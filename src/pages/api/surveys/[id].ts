/**
 * API Route: /api/surveys/[id]
 *
 * Endpoints para operacoes em pesquisa especifica.
 *
 * Camadas de Seguranca:
 * - Autenticacao JWT/Firebase
 * - Validacao Zod
 * - Verificacao de propriedade
 * - Sanitizacao Firestore
 *
 * @version 1.0.0
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { runMiddleware } from '@/api/middleware';
import { authMiddleware } from '@/api/middleware/auth';
import { validatorMiddleware } from '@/api/middleware/validator';
import {
  getSurveyByIdOrFail,
  updateSurvey,
  deleteSurvey,
} from '@/api/services/survey.service';
import { handleApiError, AuthorizationError } from '@/api/utils/errors';

/**
 * Schema de validacao para atualizar pesquisa
 */
const updateSurveySchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().max(1000).optional(),
    questions: z
      .array(
        z.object({
          id: z.string().optional(),
          type: z.enum(['text', 'rating', 'choice', 'nps', 'matrix', 'date']),
          text: z.string().min(1),
          description: z.string().max(500).optional(),
          required: z.boolean().default(false),
          options: z.array(z.string()).optional(),
          minValue: z.number().optional(),
          maxValue: z.number().optional(),
          order: z.number().optional(),
        })
      )
      .optional(),
    settings: z
      .object({
        allowAnonymous: z.boolean().optional(),
        requireEmail: z.boolean().optional(),
        showProgressBar: z.boolean().optional(),
        randomizeQuestions: z.boolean().optional(),
        limitResponses: z.number().positive().nullable().optional(),
        redirectUrl: z.string().url().nullable().optional(),
      })
      .optional(),
    status: z.enum(['draft', 'active', 'paused', 'closed']).optional(),
  }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    // Middleware de autenticacao
    await runMiddleware(req, res, [authMiddleware]);

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
        return await handleGet(req, res, id);
      case 'PUT':
      case 'PATCH':
        return await handleUpdate(req, res, id);
      case 'DELETE':
        return await handleDelete(req, res, id);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
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
 * Verifica se usuario tem permissao para acessar a pesquisa
 */
async function checkOwnership(
  req: NextApiRequest,
  surveyId: string
): Promise<void> {
  const survey = await getSurveyByIdOrFail(surveyId);

  // Verifica se o usuario e o criador
  if (survey.createdBy !== req.user!.uid) {
    throw new AuthorizationError('Voce nao tem permissao para acessar esta pesquisa');
  }
}

/**
 * GET /api/surveys/[id] - Busca pesquisa por ID
 */
async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
): Promise<void> {
  await checkOwnership(req, id);

  const survey = await getSurveyByIdOrFail(id);

  res.status(200).json({
    success: true,
    data: survey,
  });
}

/**
 * PUT/PATCH /api/surveys/[id] - Atualiza pesquisa
 */
async function handleUpdate(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
): Promise<void> {
  await checkOwnership(req, id);

  // Valida body
  await runMiddleware(req, res, [validatorMiddleware(updateSurveySchema)]);

  const { title, description, questions, settings, status } = req.body;

  // Atualiza pesquisa (service ja sanitiza dados)
  const updated = await updateSurvey(id, {
    title,
    description,
    questions,
    settings,
    status,
  });

  res.status(200).json({
    success: true,
    data: updated,
  });
}

/**
 * DELETE /api/surveys/[id] - Deleta pesquisa
 */
async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
): Promise<void> {
  await checkOwnership(req, id);

  await deleteSurvey(id);

  res.status(200).json({
    success: true,
    message: 'Pesquisa deletada com sucesso',
  });
}
