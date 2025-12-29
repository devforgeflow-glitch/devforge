/**
 * API Route: /api/surveys
 *
 * Endpoints para listar e criar pesquisas.
 *
 * Camadas de Seguranca:
 * - Autenticacao JWT/Firebase
 * - Validacao Zod
 * - Rate Limiting
 * - Sanitizacao Firestore
 *
 * @version 1.0.0
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { runMiddleware } from '@/api/middleware';
import { authMiddleware } from '@/api/middleware/auth';
import { validatorMiddleware } from '@/api/middleware/validator';
import { rateLimitMiddleware } from '@/api/middleware/rateLimit';
import { createSurvey, listSurveys } from '@/api/services/survey.service';
import { handleApiError } from '@/api/utils/errors';

/**
 * Schema de validacao para criar pesquisa
 */
const createSurveySchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Titulo deve ter no minimo 3 caracteres').max(200),
    description: z.string().max(1000).optional(),
    questions: z
      .array(
        z.object({
          type: z.enum(['text', 'rating', 'choice', 'nps', 'matrix', 'date']),
          text: z.string().min(1, 'Texto da pergunta e obrigatorio'),
          description: z.string().max(500).optional(),
          required: z.boolean().default(false),
          options: z.array(z.string()).optional(),
          minValue: z.number().optional(),
          maxValue: z.number().optional(),
        })
      )
      .optional(),
    settings: z
      .object({
        allowAnonymous: z.boolean().optional(),
        requireEmail: z.boolean().optional(),
        showProgressBar: z.boolean().optional(),
        randomizeQuestions: z.boolean().optional(),
        limitResponses: z.number().positive().optional(),
        redirectUrl: z.string().url().optional(),
      })
      .optional(),
  }),
});

/**
 * Schema de validacao para listar pesquisas
 */
const listSurveysSchema = z.object({
  query: z.object({
    status: z.enum(['draft', 'active', 'paused', 'closed']).optional(),
    limit: z.coerce.number().positive().max(100).optional().default(20),
    offset: z.coerce.number().nonnegative().optional().default(0),
  }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    // Middleware de autenticacao (obrigatorio)
    await runMiddleware(req, res, [authMiddleware]);

    switch (req.method) {
      case 'GET':
        return await handleList(req, res);
      case 'POST':
        return await handleCreate(req, res);
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
 * GET /api/surveys - Lista pesquisas do usuario
 */
async function handleList(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  // Valida query params
  await runMiddleware(req, res, [validatorMiddleware(listSurveysSchema)]);

  const { status, limit, offset } = req.query;

  // Busca pesquisas do usuario autenticado
  const surveys = await listSurveys({
    createdBy: req.user!.uid,
    status: status as 'draft' | 'active' | 'paused' | 'closed' | undefined,
    limit: Number(limit) || 20,
    offset: Number(offset) || 0,
  });

  res.status(200).json({
    success: true,
    data: surveys,
    meta: {
      count: surveys.length,
      limit: Number(limit) || 20,
      offset: Number(offset) || 0,
    },
  });
}

/**
 * POST /api/surveys - Cria nova pesquisa
 */
async function handleCreate(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  // Rate limiting para escrita
  await runMiddleware(req, res, [
    rateLimitMiddleware({ windowMs: 60000, max: 10 }),
    validatorMiddleware(createSurveySchema),
  ]);

  const { title, description, questions, settings } = req.body;

  // Cria pesquisa (service ja sanitiza dados)
  const survey = await createSurvey({
    organizationId: req.user!.uid, // Por enquanto, usa UID como org
    title,
    description,
    questions,
    settings,
    createdBy: req.user!.uid,
  });

  res.status(201).json({
    success: true,
    data: survey,
  });
}
