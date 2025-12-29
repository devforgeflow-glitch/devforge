/**
 * Configuracao dos Clientes de IA
 *
 * Suporta OpenAI e Anthropic (Claude).
 * Fallback automatico se um provider nao estiver configurado.
 *
 * @version 1.0.0
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { logger } from '@/api/utils/logger';

/**
 * Providers de IA disponiveis
 */
export type AIProvider = 'openai' | 'anthropic';

/**
 * Modelos disponiveis por provider
 */
export const AI_MODELS = {
  openai: {
    default: 'gpt-4-turbo-preview',
    fast: 'gpt-3.5-turbo',
    vision: 'gpt-4-vision-preview',
  },
  anthropic: {
    default: 'claude-3-opus-20240229',
    fast: 'claude-3-sonnet-20240229',
    haiku: 'claude-3-haiku-20240307',
  },
} as const;

/**
 * Verifica se OpenAI esta configurado
 */
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

/**
 * Verifica se Anthropic esta configurado
 */
export function isAnthropicConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

/**
 * Retorna o provider disponivel preferido
 */
export function getPreferredProvider(): AIProvider | null {
  if (isAnthropicConfigured()) return 'anthropic';
  if (isOpenAIConfigured()) return 'openai';
  return null;
}

/**
 * Cliente OpenAI (lazy initialization)
 */
let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  if (!isOpenAIConfigured()) {
    logger.warn('OpenAI nao configurado - OPENAI_API_KEY nao definido');
    return null;
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return openaiClient;
}

/**
 * Cliente Anthropic (lazy initialization)
 */
let anthropicClient: Anthropic | null = null;

export function getAnthropicClient(): Anthropic | null {
  if (!isAnthropicConfigured()) {
    logger.warn('Anthropic nao configurado - ANTHROPIC_API_KEY nao definido');
    return null;
  }

  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  return anthropicClient;
}

/**
 * Configuracoes padrao para requests
 */
export const AI_CONFIG = {
  maxTokens: {
    default: 1024,
    summary: 512,
    questions: 2048,
    analysis: 1024,
  },
  temperature: {
    creative: 0.8,
    balanced: 0.5,
    precise: 0.2,
  },
  timeout: 30000, // 30 segundos
};

/**
 * Exporta clientes para uso direto (quando necessario)
 */
export const openai = {
  get client() {
    return getOpenAIClient();
  },
  isConfigured: isOpenAIConfigured,
};

export const anthropic = {
  get client() {
    return getAnthropicClient();
  },
  isConfigured: isAnthropicConfigured,
};
