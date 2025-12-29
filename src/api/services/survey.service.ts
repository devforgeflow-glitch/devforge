/**
 * Service de Pesquisas
 *
 * Logica de negocio para CRUD de pesquisas.
 * Todos os dados sao sanitizados antes de salvar no Firestore.
 *
 * @version 1.0.0
 */

import { getFirestore, getFieldValue } from '@/api/lib/firebase/admin';
import {
  sanitizeForFirestore,
  prepareForFirestore,
  preparePartialUpdate,
  validateAndSanitize,
} from '@/api/utils/firestore';
import { ValidationError, NotFoundError } from '@/api/utils/errors';
import { logger } from '@/api/utils/logger';
import type {
  Survey,
  CreateSurveyInput,
  UpdateSurveyInput,
  SurveyFilters,
  SurveySettings,
  Question,
} from '@/api/types/survey.types';
import { ulid } from 'ulid';
import { toDate } from '@/utils/formatDate';

const COLLECTION = 'surveys';

/**
 * Configuracoes padrao de pesquisa
 */
const DEFAULT_SETTINGS: SurveySettings = {
  allowAnonymous: true,
  requireEmail: false,
  showProgressBar: true,
  randomizeQuestions: false,
};

/**
 * Cria uma nova pesquisa
 *
 * @param input - Dados da pesquisa
 * @returns Pesquisa criada com ID
 *
 * @throws {ValidationError} Se dados obrigatorios estiverem faltando
 */
export async function createSurvey(input: CreateSurveyInput): Promise<Survey> {
  // Valida campos obrigatorios
  const validated = validateAndSanitize(input, [
    'organizationId',
    'title',
    'createdBy',
  ]);

  // Prepara dados com valores padrao
  const surveyData = {
    organizationId: validated.organizationId as string,
    title: validated.title as string,
    description: validated.description || '',
    questions: sanitizeQuestions(validated.questions as Question[] | undefined),
    settings: {
      ...DEFAULT_SETTINGS,
      ...sanitizeForFirestore((validated.settings || {}) as unknown as Record<string, unknown>),
    },
    status: 'draft' as const,
    responseCount: 0,
    createdBy: validated.createdBy as string,
    publishedAt: null,
  };

  // Prepara para Firestore (adiciona timestamps e sanitiza)
  const prepared = prepareForFirestore(surveyData, false);

  const db = getFirestore();
  const docRef = await db.collection(COLLECTION).add(prepared);

  logger.info('Pesquisa criada', { surveyId: docRef.id, organizationId: surveyData.organizationId });

  return {
    id: docRef.id,
    ...surveyData,
    createdAt: prepared.createdAt,
    updatedAt: prepared.updatedAt,
  } as Survey;
}

/**
 * Busca pesquisa por ID
 *
 * @param surveyId - ID da pesquisa
 * @returns Pesquisa ou null se nao encontrada
 */
export async function getSurveyById(surveyId: string): Promise<Survey | null> {
  const db = getFirestore();
  const doc = await db.collection(COLLECTION).doc(surveyId).get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data(),
  } as Survey;
}

/**
 * Busca pesquisa por ID (lanca erro se nao encontrada)
 *
 * @param surveyId - ID da pesquisa
 * @returns Pesquisa
 *
 * @throws {NotFoundError} Se pesquisa nao existir
 */
export async function getSurveyByIdOrFail(surveyId: string): Promise<Survey> {
  const survey = await getSurveyById(surveyId);

  if (!survey) {
    throw new NotFoundError(`Pesquisa ${surveyId} nao encontrada`);
  }

  return survey;
}

/**
 * Lista pesquisas com filtros
 *
 * @param filters - Filtros de busca
 * @returns Lista de pesquisas
 */
export async function listSurveys(filters: SurveyFilters = {}): Promise<Survey[]> {
  const db = getFirestore();
  let query: FirebaseFirestore.Query = db.collection(COLLECTION);

  // Aplica filtros (apenas se definidos e nao undefined)
  if (filters.organizationId !== undefined) {
    query = query.where('organizationId', '==', filters.organizationId);
  }

  if (filters.status !== undefined) {
    query = query.where('status', '==', filters.status);
  }

  if (filters.createdBy !== undefined) {
    query = query.where('createdBy', '==', filters.createdBy);
  }

  // Ordenacao
  query = query.orderBy('createdAt', 'desc');

  // Paginacao
  if (filters.limit !== undefined) {
    query = query.limit(filters.limit);
  }

  if (filters.offset !== undefined && filters.offset > 0) {
    query = query.offset(filters.offset);
  }

  const snapshot = await query.get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Survey[];
}

/**
 * Atualiza uma pesquisa existente
 *
 * @param surveyId - ID da pesquisa
 * @param input - Dados para atualizar
 * @returns Pesquisa atualizada
 *
 * @throws {NotFoundError} Se pesquisa nao existir
 * @throws {ValidationError} Se pesquisa estiver fechada
 */
export async function updateSurvey(
  surveyId: string,
  input: UpdateSurveyInput
): Promise<Survey> {
  const survey = await getSurveyByIdOrFail(surveyId);

  // Nao permite editar pesquisa fechada
  if (survey.status === 'closed') {
    throw new ValidationError('Nao e possivel editar uma pesquisa fechada');
  }

  // Prepara dados para atualizacao (sanitiza e remove undefined)
  const updateData: Record<string, unknown> = {};

  if (input.title !== undefined) {
    updateData.title = input.title;
  }

  if (input.description !== undefined) {
    updateData.description = input.description;
  }

  if (input.questions !== undefined) {
    updateData.questions = sanitizeQuestions(input.questions);
  }

  if (input.settings !== undefined) {
    // Merge das configuracoes
    updateData.settings = {
      ...survey.settings,
      ...sanitizeForFirestore(input.settings as unknown as Record<string, unknown>),
    };
  }

  if (input.status !== undefined) {
    updateData.status = input.status;

    // Se publicando, adiciona publishedAt
    if (input.status === 'active' && !survey.publishedAt) {
      updateData.publishedAt = getFieldValue().serverTimestamp();
    }
  }

  // Aplica atualizacao
  const prepared = preparePartialUpdate(updateData);
  const db = getFirestore();
  await db.collection(COLLECTION).doc(surveyId).update(prepared);

  logger.info('Pesquisa atualizada', { surveyId, fields: Object.keys(updateData) });

  // Retorna pesquisa atualizada
  return getSurveyByIdOrFail(surveyId);
}

/**
 * Deleta uma pesquisa
 *
 * @param surveyId - ID da pesquisa
 *
 * @throws {NotFoundError} Se pesquisa nao existir
 * @throws {ValidationError} Se pesquisa tiver respostas
 */
export async function deleteSurvey(surveyId: string): Promise<void> {
  const survey = await getSurveyByIdOrFail(surveyId);

  // Nao permite deletar pesquisa com respostas
  if (survey.responseCount > 0) {
    throw new ValidationError(
      'Nao e possivel deletar uma pesquisa que ja tem respostas. Considere fechar a pesquisa.'
    );
  }

  const db = getFirestore();
  await db.collection(COLLECTION).doc(surveyId).delete();

  logger.info('Pesquisa deletada', { surveyId });
}

/**
 * Incrementa contador de respostas
 *
 * @param surveyId - ID da pesquisa
 */
export async function incrementResponseCount(surveyId: string): Promise<void> {
  const db = getFirestore();
  const FieldValue = getFieldValue();

  await db
    .collection(COLLECTION)
    .doc(surveyId)
    .update({
      responseCount: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
    });
}

/**
 * Verifica se pesquisa pode receber respostas
 *
 * @param survey - Pesquisa a verificar
 * @returns true se pode receber respostas
 */
export function canReceiveResponses(survey: Survey): boolean {
  // So pesquisas ativas podem receber respostas
  if (survey.status !== 'active') {
    return false;
  }

  // Verifica limite de respostas
  if (
    survey.settings.limitResponses &&
    survey.responseCount >= survey.settings.limitResponses
  ) {
    return false;
  }

  // Verifica expiracao (usando conversao segura)
  if (survey.settings.expiresAt) {
    const expiresAt = toDate(survey.settings.expiresAt);
    if (expiresAt && new Date() > expiresAt) {
      return false;
    }
  }

  return true;
}

/**
 * Sanitiza array de perguntas
 * Remove undefined e garante que cada pergunta tem ID
 */
function sanitizeQuestions(questions?: Question[]): Question[] {
  if (!questions || !Array.isArray(questions)) {
    return [];
  }

  return questions
    .filter((q) => q !== undefined && q !== null)
    .map((q, index) => {
      const sanitized = sanitizeForFirestore(q as unknown as Record<string, unknown>) as unknown as Question;

      return {
        id: sanitized.id || ulid(),
        type: sanitized.type || 'text',
        text: sanitized.text || '',
        description: sanitized.description,
        required: sanitized.required ?? false,
        options: sanitized.options,
        minValue: sanitized.minValue,
        maxValue: sanitized.maxValue,
        aiGenerated: sanitized.aiGenerated,
        order: sanitized.order ?? index,
      };
    });
}
