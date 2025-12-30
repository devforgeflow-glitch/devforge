/**
 * API Route: Analisar Sentimento
 *
 * POST /api/ai/analyze-sentiment
 * Analisa o sentimento de um texto usando IA.
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
  text: z
    .string()
    .min(5, 'Texto deve ter pelo menos 5 caracteres')
    .max(5000, 'Texto deve ter no maximo 5000 caracteres'),
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

    const { text } = parsed.data;

    // Verifica se IA esta disponivel
    if (!aiService.isAvailable()) {
      return res.status(503).json({
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Servico de IA nao disponivel. Configure OPENAI_API_KEY ou ANTHROPIC_API_KEY.',
        },
      });
    }

    // Analisa sentimento
    const result = await aiService.analyzeSentiment(text);

    if (!result.success) {
      logger.error('Erro ao analisar sentimento', { error: result.error });
      return res.status(500).json({
        error: {
          code: 'AI_ERROR',
          message: result.error || 'Erro ao analisar sentimento',
        },
      });
    }

    return res.status(200).json({
      success: true,
      analysis: result.data,
      tokens: result.tokens,
      provider: result.provider,
      model: result.model,
    });
  } catch (error) {
    logger.error('Erro inesperado em analyze-sentiment', { error });
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erro interno do servidor',
      },
    });
  }
}
