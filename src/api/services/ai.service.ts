/**
 * Servico de Inteligencia Artificial
 *
 * Fornece funcionalidades de IA para:
 * - Geracao de perguntas de pesquisa
 * - Analise de sentimento
 * - Sumarizacao de respostas
 * - Categorizacao automatica
 *
 * @version 1.0.0
 */

import {
  getOpenAIClient,
  getAnthropicClient,
  getPreferredProvider,
  AI_MODELS,
  AI_CONFIG,
  type AIProvider,
} from '@/api/lib/ai';
import { logger } from '@/api/utils/logger';

/**
 * Tipos de resultado de IA
 */
export interface AIResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
  provider?: AIProvider;
  model?: string;
}

/**
 * Pergunta gerada por IA
 */
export interface GeneratedQuestion {
  text: string;
  type: 'text' | 'rating' | 'choice' | 'nps';
  options?: string[];
  required: boolean;
}

/**
 * Analise de sentimento
 */
export interface SentimentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number; // -1 a 1
  confidence: number; // 0 a 1
  keywords: string[];
}

/**
 * Resumo de respostas
 */
export interface ResponseSummary {
  summary: string;
  keyInsights: string[];
  recommendations: string[];
  wordCount: number;
}

/**
 * Categoria detectada
 */
export interface DetectedCategory {
  name: string;
  count: number;
  percentage: number;
  examples: string[];
}

/**
 * Servico de IA
 */
export class AIService {
  private provider: AIProvider | null;

  constructor() {
    this.provider = getPreferredProvider();

    if (!this.provider) {
      logger.warn('Nenhum provider de IA configurado');
    } else {
      logger.info(`Provider de IA configurado: ${this.provider}`);
    }
  }

  /**
   * Verifica se o servico de IA esta disponivel
   */
  isAvailable(): boolean {
    return this.provider !== null;
  }

  /**
   * Gera perguntas de pesquisa baseado em contexto
   */
  async generateQuestions(
    context: string,
    options?: {
      count?: number;
      types?: GeneratedQuestion['type'][];
      language?: string;
    }
  ): Promise<AIResult<GeneratedQuestion[]>> {
    if (!this.isAvailable()) {
      return { success: false, error: 'Servico de IA nao disponivel' };
    }

    const count = options?.count || 5;
    const types = options?.types || ['text', 'rating', 'choice'];
    const language = options?.language || 'pt-BR';

    const prompt = `Voce e um especialista em pesquisas de satisfacao e feedback.
Com base no seguinte contexto, gere ${count} perguntas relevantes para uma pesquisa.

Contexto: ${context}

Requisitos:
- Idioma: ${language}
- Tipos permitidos: ${types.join(', ')}
- As perguntas devem ser claras e objetivas
- Inclua uma mistura de tipos quando possivel
- Para perguntas de 'choice', inclua 3-5 opcoes

Responda APENAS com um JSON valido no formato:
[
  {
    "text": "pergunta aqui",
    "type": "text|rating|choice|nps",
    "options": ["opcao1", "opcao2"] // apenas para choice
    "required": true|false
  }
]`;

    try {
      const result = await this.complete(prompt, {
        maxTokens: AI_CONFIG.maxTokens.questions,
        temperature: AI_CONFIG.temperature.creative,
      });

      if (!result.success || !result.content) {
        return { success: false, error: result.error || 'Falha ao gerar perguntas' };
      }

      // Parse do JSON
      const jsonMatch = result.content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return { success: false, error: 'Resposta invalida da IA' };
      }

      const questions: GeneratedQuestion[] = JSON.parse(jsonMatch[0]);

      return {
        success: true,
        data: questions,
        tokens: result.tokens,
        provider: this.provider!,
        model: result.model,
      };
    } catch (error) {
      logger.error('Erro ao gerar perguntas', { error });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  /**
   * Analisa o sentimento de um texto
   */
  async analyzeSentiment(text: string): Promise<AIResult<SentimentAnalysis>> {
    if (!this.isAvailable()) {
      return { success: false, error: 'Servico de IA nao disponivel' };
    }

    const prompt = `Analise o sentimento do seguinte texto e retorne um JSON:

Texto: "${text}"

Responda APENAS com um JSON valido no formato:
{
  "sentiment": "positive|neutral|negative",
  "score": <numero de -1 a 1>,
  "confidence": <numero de 0 a 1>,
  "keywords": ["palavra1", "palavra2"]
}`;

    try {
      const result = await this.complete(prompt, {
        maxTokens: AI_CONFIG.maxTokens.analysis,
        temperature: AI_CONFIG.temperature.precise,
      });

      if (!result.success || !result.content) {
        return { success: false, error: result.error || 'Falha na analise' };
      }

      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return { success: false, error: 'Resposta invalida da IA' };
      }

      const analysis: SentimentAnalysis = JSON.parse(jsonMatch[0]);

      return {
        success: true,
        data: analysis,
        tokens: result.tokens,
        provider: this.provider!,
        model: result.model,
      };
    } catch (error) {
      logger.error('Erro na analise de sentimento', { error });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  /**
   * Gera um resumo das respostas de uma pesquisa
   */
  async generateSummary(
    responses: string[],
    context?: string
  ): Promise<AIResult<ResponseSummary>> {
    if (!this.isAvailable()) {
      return { success: false, error: 'Servico de IA nao disponivel' };
    }

    const prompt = `Voce e um analista de dados especializado em feedback de clientes.
${context ? `Contexto da pesquisa: ${context}\n` : ''}
Analise as seguintes respostas e gere um resumo executivo:

Respostas:
${responses.map((r, i) => `${i + 1}. "${r}"`).join('\n')}

Responda APENAS com um JSON valido no formato:
{
  "summary": "resumo em 2-3 paragrafos",
  "keyInsights": ["insight1", "insight2", "insight3"],
  "recommendations": ["recomendacao1", "recomendacao2"],
  "wordCount": <numero de palavras no resumo>
}`;

    try {
      const result = await this.complete(prompt, {
        maxTokens: AI_CONFIG.maxTokens.summary,
        temperature: AI_CONFIG.temperature.balanced,
      });

      if (!result.success || !result.content) {
        return { success: false, error: result.error || 'Falha ao gerar resumo' };
      }

      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return { success: false, error: 'Resposta invalida da IA' };
      }

      const summary: ResponseSummary = JSON.parse(jsonMatch[0]);

      return {
        success: true,
        data: summary,
        tokens: result.tokens,
        provider: this.provider!,
        model: result.model,
      };
    } catch (error) {
      logger.error('Erro ao gerar resumo', { error });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  /**
   * Categoriza respostas automaticamente
   */
  async categorizeResponses(
    responses: string[],
    maxCategories?: number
  ): Promise<AIResult<DetectedCategory[]>> {
    if (!this.isAvailable()) {
      return { success: false, error: 'Servico de IA nao disponivel' };
    }

    const limit = maxCategories || 5;

    const prompt = `Analise as seguintes respostas e identifique ate ${limit} categorias/temas principais:

Respostas:
${responses.map((r, i) => `${i + 1}. "${r}"`).join('\n')}

Responda APENAS com um JSON valido no formato:
[
  {
    "name": "nome da categoria",
    "count": <numero de respostas nesta categoria>,
    "percentage": <porcentagem>,
    "examples": ["exemplo1", "exemplo2"]
  }
]`;

    try {
      const result = await this.complete(prompt, {
        maxTokens: AI_CONFIG.maxTokens.analysis,
        temperature: AI_CONFIG.temperature.balanced,
      });

      if (!result.success || !result.content) {
        return { success: false, error: result.error || 'Falha na categorizacao' };
      }

      const jsonMatch = result.content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return { success: false, error: 'Resposta invalida da IA' };
      }

      const categories: DetectedCategory[] = JSON.parse(jsonMatch[0]);

      return {
        success: true,
        data: categories,
        tokens: result.tokens,
        provider: this.provider!,
        model: result.model,
      };
    } catch (error) {
      logger.error('Erro na categorizacao', { error });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  /**
   * Metodo interno para completar prompts
   */
  private async complete(
    prompt: string,
    options?: {
      maxTokens?: number;
      temperature?: number;
      model?: string;
    }
  ): Promise<{
    success: boolean;
    content?: string;
    error?: string;
    tokens?: { prompt: number; completion: number; total: number };
    model?: string;
  }> {
    const maxTokens = options?.maxTokens || AI_CONFIG.maxTokens.default;
    const temperature = options?.temperature || AI_CONFIG.temperature.balanced;

    if (this.provider === 'anthropic') {
      return this.completeWithAnthropic(prompt, { maxTokens, temperature, model: options?.model });
    } else if (this.provider === 'openai') {
      return this.completeWithOpenAI(prompt, { maxTokens, temperature, model: options?.model });
    }

    return { success: false, error: 'Nenhum provider disponivel' };
  }

  /**
   * Completa com Anthropic Claude
   */
  private async completeWithAnthropic(
    prompt: string,
    options: { maxTokens: number; temperature: number; model?: string }
  ) {
    const client = getAnthropicClient();
    if (!client) {
      return { success: false, error: 'Cliente Anthropic nao disponivel' };
    }

    const model = options.model || AI_MODELS.anthropic.fast;

    try {
      const response = await client.messages.create({
        model,
        max_tokens: options.maxTokens,
        temperature: options.temperature,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        return { success: false, error: 'Resposta inesperada da API' };
      }

      return {
        success: true,
        content: content.text,
        tokens: {
          prompt: response.usage.input_tokens,
          completion: response.usage.output_tokens,
          total: response.usage.input_tokens + response.usage.output_tokens,
        },
        model,
      };
    } catch (error) {
      logger.error('Erro na API Anthropic', { error });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro na API Anthropic',
      };
    }
  }

  /**
   * Completa com OpenAI
   */
  private async completeWithOpenAI(
    prompt: string,
    options: { maxTokens: number; temperature: number; model?: string }
  ) {
    const client = getOpenAIClient();
    if (!client) {
      return { success: false, error: 'Cliente OpenAI nao disponivel' };
    }

    const model = options.model || AI_MODELS.openai.fast;

    try {
      const response = await client.chat.completions.create({
        model,
        max_tokens: options.maxTokens,
        temperature: options.temperature,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return { success: false, error: 'Resposta vazia da API' };
      }

      return {
        success: true,
        content,
        tokens: {
          prompt: response.usage?.prompt_tokens || 0,
          completion: response.usage?.completion_tokens || 0,
          total: response.usage?.total_tokens || 0,
        },
        model,
      };
    } catch (error) {
      logger.error('Erro na API OpenAI', { error });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro na API OpenAI',
      };
    }
  }
}

/**
 * Instancia singleton do servico
 */
export const aiService = new AIService();
