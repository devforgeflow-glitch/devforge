/**
 * API Route: Gerar Perguntas com IA
 *
 * POST /api/ai/generate-questions
 * Gera perguntas de pesquisa baseado em contexto usando IA.
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
  context: z
    .string()
    .min(10, 'Contexto deve ter pelo menos 10 caracteres')
    .max(2000, 'Contexto deve ter no maximo 2000 caracteres'),
  count: z.number().min(1).max(10).optional().default(5),
  types: z
    .array(z.enum(['text', 'rating', 'choice', 'nps']))
    .optional(),
  language: z.string().optional().default('pt-BR'),
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

    const { context, count, types, language } = parsed.data;

    // Verifica se IA esta disponivel
    if (!aiService.isAvailable()) {
      return res.status(503).json({
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Servico de IA nao disponivel. Configure OPENAI_API_KEY ou ANTHROPIC_API_KEY.',
        },
      });
    }

    // Gera perguntas
    const result = await aiService.generateQuestions(context, {
      count,
      types,
      language,
    });

    if (!result.success) {
      logger.error('Erro ao gerar perguntas', { error: result.error });
      return res.status(500).json({
        error: {
          code: 'AI_ERROR',
          message: result.error || 'Erro ao gerar perguntas',
        },
      });
    }

    return res.status(200).json({
      success: true,
      questions: result.data,
      tokens: result.tokens,
      provider: result.provider,
      model: result.model,
    });
  } catch (error) {
    logger.error('Erro inesperado em generate-questions', { error });
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erro interno do servidor',
      },
    });
  }
}
