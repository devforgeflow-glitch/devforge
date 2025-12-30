/**
 * API Route: Categorizar Respostas
 *
 * POST /api/ai/categorize-responses
 * Categoriza respostas automaticamente usando IA.
 *
 * @version 1.0.0
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { aiService } from '@/api/services/ai.service';
import { logger } from '@/api/utils/logger';

/**
 * Schema de validacao
 */
const requestSchema = z.object({
  responses: z
    .array(z.string())
    .min(3, 'Deve haver pelo menos 3 respostas para categorizar')
    .max(200, 'Maximo de 200 respostas'),
  maxCategories: z.number().min(2).max(10).optional().default(5),
});

/**
 * Handler da rota
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Metodo nao permitido',
      },
    });
  }

  try {
    // Valida request
    const parsed = requestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dados invalidos',
          details: parsed.error.flatten().fieldErrors,
        },
      });
    }

    const { responses, maxCategories } = parsed.data;

    // Verifica se IA esta disponivel
    if (!aiService.isAvailable()) {
      return res.status(503).json({
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Servico de IA nao disponivel. Configure OPENAI_API_KEY ou ANTHROPIC_API_KEY.',
        },
      });
    }

    // Categoriza respostas
    const result = await aiService.categorizeResponses(responses, maxCategories);

    if (!result.success) {
      logger.error('Erro ao categorizar respostas', { error: result.error });
      return res.status(500).json({
        error: {
          code: 'AI_ERROR',
          message: result.error || 'Erro ao categorizar respostas',
        },
      });
    }

    return res.status(200).json({
      success: true,
      categories: result.data,
      tokens: result.tokens,
      provider: result.provider,
      model: result.model,
    });
  } catch (error) {
    logger.error('Erro inesperado em categorize-responses', { error });
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erro interno do servidor',
      },
    });
  }
}
