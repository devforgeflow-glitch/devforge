/**
 * Tipos do dominio Survey
 *
 * Interfaces e tipos para pesquisas e respostas.
 *
 * @version 1.0.0
 */

import type admin from 'firebase-admin';

/**
 * Tipos de perguntas suportados
 */
export type QuestionType = 'text' | 'rating' | 'choice' | 'nps' | 'matrix' | 'date';

/**
 * Status da pesquisa
 */
export type SurveyStatus = 'draft' | 'active' | 'paused' | 'closed';

/**
 * Configuracao de uma pergunta
 */
export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  description?: string;
  required: boolean;
  options?: string[];
  minValue?: number;
  maxValue?: number;
  aiGenerated?: boolean;
  order: number;
}

/**
 * Configuracoes da pesquisa
 */
export interface SurveySettings {
  allowAnonymous: boolean;
  requireEmail: boolean;
  showProgressBar: boolean;
  randomizeQuestions: boolean;
  limitResponses?: number;
  expiresAt?: admin.firestore.Timestamp | null;
  redirectUrl?: string;
  customTheme?: {
    primaryColor?: string;
    backgroundColor?: string;
    logoUrl?: string;
  };
}

/**
 * Documento de pesquisa no Firestore
 */
export interface Survey {
  id: string;
  organizationId: string;
  title: string;
  description?: string;
  questions: Question[];
  settings: SurveySettings;
  status: SurveyStatus;
  responseCount: number;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
  createdBy: string;
  publishedAt?: admin.firestore.Timestamp | null;
}

/**
 * Input para criar pesquisa
 */
export interface CreateSurveyInput {
  organizationId: string;
  title: string;
  description?: string;
  questions?: Question[];
  settings?: Partial<SurveySettings>;
  createdBy: string;
}

/**
 * Input para atualizar pesquisa
 */
export interface UpdateSurveyInput {
  title?: string;
  description?: string;
  questions?: Question[];
  settings?: Partial<SurveySettings>;
  status?: SurveyStatus;
}

/**
 * Resposta individual a uma pergunta
 */
export interface Answer {
  questionId: string;
  value: string | number | string[] | null;
}

/**
 * Informacoes do respondente
 */
export interface RespondentInfo {
  email?: string;
  name?: string;
  metadata?: Record<string, string>;
}

/**
 * Analise de sentimento (gerada por IA)
 */
export interface SentimentAnalysis {
  score: number; // -1 a 1
  label: 'negative' | 'neutral' | 'positive';
  confidence: number;
}

/**
 * Documento de resposta no Firestore
 */
export interface SurveyResponse {
  id: string;
  surveyId: string;
  organizationId: string;
  answers: Answer[];
  respondent?: RespondentInfo;
  sentiment?: SentimentAnalysis;
  completedAt: admin.firestore.Timestamp;
  createdAt: admin.firestore.Timestamp;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Input para criar resposta
 */
export interface CreateResponseInput {
  surveyId: string;
  organizationId: string;
  answers: Answer[];
  respondent?: RespondentInfo;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Filtros para buscar pesquisas
 */
export interface SurveyFilters {
  organizationId?: string;
  status?: SurveyStatus;
  createdBy?: string;
  limit?: number;
  offset?: number;
}

/**
 * Filtros para buscar respostas
 */
export interface ResponseFilters {
  surveyId?: string;
  organizationId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}
