/**
 * Service de Respostas
 *
 * Logica de negocio para coleta e analise de respostas.
 * Todos os dados sao sanitizados antes de salvar no Firestore.
 *
 * @version 1.0.0
 */

import { getFirestore, getTimestamp } from '@/api/lib/firebase/admin';
import {
  prepareForFirestore,
  sanitizeForFirestore,
  validateAndSanitize,
} from '@/api/utils/firestore';
import { ValidationError } from '@/api/utils/errors';
import { logger } from '@/api/utils/logger';
import { getSurveyByIdOrFail, canReceiveResponses, incrementResponseCount } from './survey.service';
import type {
  SurveyResponse,
  CreateResponseInput,
  ResponseFilters,
  Answer,
  RespondentInfo,
  SentimentAnalysis,
} from '@/api/types/survey.types';

const COLLECTION = 'responses';

/**
 * Cria uma nova resposta para uma pesquisa
 *
 * @param input - Dados da resposta
 * @returns Resposta criada com ID
 *
 * @throws {ValidationError} Se dados estiverem invalidos
 * @throws {NotFoundError} Se pesquisa nao existir
 */
export async function createResponse(input: CreateResponseInput): Promise<SurveyResponse> {
  // Valida campos obrigatorios
  const validated = validateAndSanitize(input, ['surveyId', 'organizationId', 'answers']);

  // Busca pesquisa
  const survey = await getSurveyByIdOrFail(validated.surveyId as string);

  // Verifica se pode receber respostas
  if (!canReceiveResponses(survey)) {
    throw new ValidationError('Esta pesquisa nao esta aceitando respostas no momento');
  }

  // Valida respostas
  const answers = sanitizeAnswers(validated.answers as Answer[], survey.questions);

  // Valida respondent se email for obrigatorio
  if (survey.settings.requireEmail) {
    const respondent = validated.respondent as RespondentInfo | undefined;
    if (!respondent?.email) {
      throw new ValidationError('Email e obrigatorio para esta pesquisa');
    }
  }

  // Prepara dados
  const responseData = {
    surveyId: validated.surveyId as string,
    organizationId: validated.organizationId as string,
    answers,
    respondent: sanitizeRespondent(validated.respondent as RespondentInfo | undefined),
    ipAddress: (validated.ipAddress as string) || undefined,
    userAgent: (validated.userAgent as string) || undefined,
    sentiment: undefined as SentimentAnalysis | undefined, // Sera preenchido por job de IA
    completedAt: new Date(),
  };

  // Prepara para Firestore
  const prepared = prepareForFirestore(responseData, false);

  const db = getFirestore();
  const docRef = await db.collection(COLLECTION).add(prepared);

  // Incrementa contador de respostas
  await incrementResponseCount(survey.id);

  logger.info('Resposta criada', {
    responseId: docRef.id,
    surveyId: survey.id,
    organizationId: responseData.organizationId,
  });

  return {
    id: docRef.id,
    ...responseData,
    createdAt: prepared.createdAt,
  } as unknown as SurveyResponse;
}

/**
 * Busca resposta por ID
 *
 * @param responseId - ID da resposta
 * @returns Resposta ou null
 */
export async function getResponseById(responseId: string): Promise<SurveyResponse | null> {
  const db = getFirestore();
  const doc = await db.collection(COLLECTION).doc(responseId).get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data(),
  } as SurveyResponse;
}

/**
 * Lista respostas com filtros
 *
 * @param filters - Filtros de busca
 * @returns Lista de respostas
 */
export async function listResponses(filters: ResponseFilters = {}): Promise<SurveyResponse[]> {
  const db = getFirestore();
  let query: FirebaseFirestore.Query = db.collection(COLLECTION);

  // Aplica filtros (apenas se definidos)
  if (filters.surveyId !== undefined) {
    query = query.where('surveyId', '==', filters.surveyId);
  }

  if (filters.organizationId !== undefined) {
    query = query.where('organizationId', '==', filters.organizationId);
  }

  if (filters.startDate !== undefined) {
    query = query.where('createdAt', '>=', filters.startDate);
  }

  if (filters.endDate !== undefined) {
    query = query.where('createdAt', '<=', filters.endDate);
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
  })) as SurveyResponse[];
}

/**
 * Conta respostas por pesquisa
 *
 * @param surveyId - ID da pesquisa
 * @returns Numero de respostas
 */
export async function countResponsesBySurvey(surveyId: string): Promise<number> {
  const db = getFirestore();
  const snapshot = await db
    .collection(COLLECTION)
    .where('surveyId', '==', surveyId)
    .count()
    .get();

  return snapshot.data().count;
}

/**
 * Deleta todas as respostas de uma pesquisa
 * CUIDADO: Operacao irreversivel
 *
 * @param surveyId - ID da pesquisa
 * @returns Numero de respostas deletadas
 */
export async function deleteResponsesBySurvey(surveyId: string): Promise<number> {
  const db = getFirestore();
  const snapshot = await db
    .collection(COLLECTION)
    .where('surveyId', '==', surveyId)
    .get();

  if (snapshot.empty) {
    return 0;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  logger.warn('Respostas deletadas', { surveyId, count: snapshot.size });

  return snapshot.size;
}

/**
 * Atualiza analise de sentimento de uma resposta
 *
 * @param responseId - ID da resposta
 * @param sentiment - Analise de sentimento
 */
export async function updateSentiment(
  responseId: string,
  sentiment: { score: number; label: 'negative' | 'neutral' | 'positive'; confidence: number }
): Promise<void> {
  const db = getFirestore();

  // Sanitiza antes de salvar
  const sanitized = sanitizeForFirestore(sentiment);

  const Timestamp = getTimestamp();
  await db.collection(COLLECTION).doc(responseId).update({
    sentiment: sanitized,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Sanitiza array de respostas
 * Remove undefined e valida contra perguntas da pesquisa
 */
function sanitizeAnswers(
  answers: Answer[],
  questions: Array<{ id: string; required: boolean }>
): Answer[] {
  if (!answers || !Array.isArray(answers)) {
    return [];
  }

  const questionIds = new Set(questions.map((q) => q.id));
  const requiredIds = new Set(questions.filter((q) => q.required).map((q) => q.id));

  // Filtra respostas validas
  const validAnswers = answers
    .filter((a) => a !== undefined && a !== null)
    .filter((a) => questionIds.has(a.questionId))
    .map((a) => {
      const sanitized = sanitizeForFirestore(a as unknown as Record<string, unknown>) as unknown as Answer;
      return {
        questionId: sanitized.questionId,
        value: sanitized.value ?? null,
      };
    });

  // Verifica se todas as perguntas obrigatorias foram respondidas
  const answeredIds = new Set(validAnswers.map((a) => a.questionId));
  const missingRequired = [...requiredIds].filter((id) => !answeredIds.has(id));

  if (missingRequired.length > 0) {
    throw new ValidationError(
      `Perguntas obrigatorias nao respondidas: ${missingRequired.join(', ')}`
    );
  }

  return validAnswers;
}

/**
 * Sanitiza informacoes do respondente
 */
function sanitizeRespondent(respondent?: RespondentInfo): RespondentInfo | null {
  if (!respondent) {
    return null;
  }

  const sanitized = sanitizeForFirestore(respondent as unknown as Record<string, unknown>);

  // Retorna null se nao tiver dados uteis
  if (!sanitized.email && !sanitized.name) {
    return null;
  }

  return {
    email: sanitized.email as string | undefined,
    name: sanitized.name as string | undefined,
    metadata: sanitized.metadata as Record<string, string> | undefined,
  };
}
