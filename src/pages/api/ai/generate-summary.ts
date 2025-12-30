/**
 * API Route: Gerar Resumo
 *
 * POST /api/ai/generate-summary
 * Gera um resumo executivo das respostas usando IA.
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
    .min(1, 'Deve haver pelo menos uma resposta')
    .max(100, 'Maximo de 100 respostas'),
  context: z.string().max(500).optional(),
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

    const { responses, context } = parsed.data;

    // Verifica se IA esta disponivel
    if (!aiService.isAvailable()) {
      return res.status(503).json({
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Servico de IA nao disponivel. Configure OPENAI_API_KEY ou ANTHROPIC_API_KEY.',
        },
      });
    }

    // Gera resumo
    const result = await aiService.generateSummary(responses, context);

    if (!result.success) {
      logger.error('Erro ao gerar resumo', { error: result.error });
      return res.status(500).json({
        error: {
          code: 'AI_ERROR',
          message: result.error || 'Erro ao gerar resumo',
        },
      });
    }

    return res.status(200).json({
      success: true,
      summary: result.data,
      tokens: result.tokens,
      provider: result.provider,
      model: result.model,
    });
  } catch (error) {
    logger.error('Erro inesperado em generate-summary', { error });
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erro interno do servidor',
      },
    });
  }
}
