/**
 * API Route: /api/surveys/[id]/responses
 *
 * Endpoints para listar e criar respostas de uma pesquisa.
 *
 * Camadas de Seguranca:
 * - Autenticacao (obrigatoria para listar, opcional para responder)
 * - Validacao Zod
 * - Rate Limiting
 * - Sanitizacao Firestore
 *
 * @version 1.0.0
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { runMiddleware } from '@/api/middleware';
import { authMiddleware, optionalAuthMiddleware } from '@/api/middleware/auth';
import { validatorMiddleware } from '@/api/middleware/validator';
import { rateLimitMiddleware } from '@/api/middleware/rateLimit';
import { createResponse, listResponses } from '@/api/services/response.service';
import { getSurveyByIdOrFail, canReceiveResponses } from '@/api/services/survey.service';
import { handleApiError, AuthorizationError, ValidationError } from '@/api/utils/errors';

/**
 * Schema de validacao para criar resposta
 */
const createResponseSchema = z.object({
  body: z.object({
    answers: z
      .array(
        z.object({
          questionId: z.string().min(1),
          value: z.union([z.string(), z.number(), z.array(z.string()), z.null()]),
        })
      )
      .min(1, 'Pelo menos uma resposta e obrigatoria'),
    respondent: z
      .object({
        email: z.string().email().optional(),
        name: z.string().max(100).optional(),
        metadata: z.record(z.string()).optional(),
      })
      .optional(),
  }),
});

/**
 * Schema de validacao para listar respostas
 */
const listResponsesSchema = z.object({
  query: z.object({
    limit: z.coerce.number().positive().max(100).optional().default(20),
    offset: z.coerce.number().nonnegative().optional().default(0),
  }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'ID da pesquisa e obrigatorio' },
      });
      return;
    }

    switch (req.method) {
      case 'GET':
        return await handleList(req, res, id);
      case 'POST':
        return await handleCreate(req, res, id);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({
          success: false,
          error: { code: 'METHOD_NOT_ALLOWED', message: `Metodo ${req.method} nao permitido` },
        });
    }
  } catch (error) {
    handleApiError(error, req, res);
  }
}

/**
 * GET /api/surveys/[id]/responses - Lista respostas (requer auth)
 */
async function handleList(
  req: NextApiRequest,
  res: NextApiResponse,
  surveyId: string
): Promise<void> {
  // Requer autenticacao para listar respostas
  await runMiddleware(req, res, [
    authMiddleware,
    validatorMiddleware(listResponsesSchema),
  ]);

  // Verifica se usuario tem acesso a pesquisa
  const survey = await getSurveyByIdOrFail(surveyId);
  if (survey.createdBy !== req.user!.uid) {
    throw new AuthorizationError('Voce nao tem permissao para ver as respostas desta pesquisa');
  }

  const { limit, offset } = req.query;

  const responses = await listResponses({
    surveyId,
    limit: Number(limit) || 20,
    offset: Number(offset) || 0,
  });

  res.status(200).json({
    success: true,
    data: responses,
    meta: {
      surveyId,
      count: responses.length,
      limit: Number(limit) || 20,
      offset: Number(offset) || 0,
    },
  });
}

/**
 * POST /api/surveys/[id]/responses - Cria resposta (auth opcional)
 */
async function handleCreate(
  req: NextApiRequest,
  res: NextApiResponse,
  surveyId: string
): Promise<void> {
  // Auth opcional + rate limiting
  await runMiddleware(req, res, [
    optionalAuthMiddleware,
    rateLimitMiddleware({ windowMs: 60000, max: 30 }),
    validatorMiddleware(createResponseSchema),
  ]);

  // Busca e valida pesquisa
  const survey = await getSurveyByIdOrFail(surveyId);

  // Verifica se pode receber respostas
  if (!canReceiveResponses(survey)) {
    throw new ValidationError('Esta pesquisa nao esta aceitando respostas no momento');
  }

  // Verifica se permite respostas anonimas
  if (!survey.settings.allowAnonymous && !req.user) {
    throw new AuthorizationError('Esta pesquisa requer autenticacao');
  }

  const { answers, respondent } = req.body;

  // Captura metadados da requisicao
  const forwarded = req.headers['x-forwarded-for'];
  const ipAddress = forwarded
    ? (Array.isArray(forwarded) ? forwarded[0] : forwarded).split(',')[0].trim()
    : req.socket?.remoteAddress;

  // Cria resposta (service ja sanitiza dados)
  const response = await createResponse({
    surveyId,
    organizationId: survey.organizationId,
    answers,
    respondent: respondent || (req.user ? { email: req.user.email } : undefined),
    ipAddress: ipAddress || undefined,
    userAgent: req.headers['user-agent'] || undefined,
  });

  res.status(201).json({
    success: true,
    data: {
      id: response.id,
      surveyId: response.surveyId,
      completedAt: response.completedAt,
    },
    message: 'Resposta registrada com sucesso',
  });
}
