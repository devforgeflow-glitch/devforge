/**
 * Tipos de Jobs BullMQ
 *
 * Define as interfaces para os diferentes tipos de jobs.
 *
 * @version 1.0.0
 */

/**
 * Job de Email
 */
export interface EmailJobData {
  type: 'welcome' | 'survey-invite' | 'survey-reminder' | 'password-reset' | 'notification';
  to: string;
  subject: string;
  template: string;
  variables: Record<string, string | number | boolean>;
  attachments?: Array<{
    filename: string;
    content: string;
    encoding: 'base64' | 'utf-8';
  }>;
}

/**
 * Job de Exportacao
 */
export interface ExportJobData {
  type: 'csv' | 'pdf' | 'excel';
  surveyId: string;
  userId: string;
  filters?: {
    startDate?: string;
    endDate?: string;
    status?: string;
  };
  options?: {
    includeMetadata?: boolean;
    includeAnalytics?: boolean;
  };
}

/**
 * Job de Analytics
 */
export interface AnalyticsJobData {
  type: 'aggregate-daily' | 'aggregate-weekly' | 'calculate-nps' | 'sentiment-summary';
  surveyId?: string;
  organizationId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

/**
 * Job de IA
 */
export interface AIJobData {
  type: 'sentiment-analysis' | 'generate-summary' | 'categorize-responses' | 'generate-questions';
  surveyId?: string;
  responseId?: string;
  input?: string;
  options?: {
    model?: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3';
    maxTokens?: number;
  };
}

/**
 * Job de Notificacao
 */
export interface NotificationJobData {
  type: 'push' | 'in-app' | 'sms';
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  action?: {
    url: string;
    label: string;
  };
}

/**
 * Resultado de Job de Email
 */
export interface EmailJobResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Resultado de Job de Exportacao
 */
export interface ExportJobResult {
  success: boolean;
  fileUrl?: string;
  fileName?: string;
  size?: number;
  error?: string;
}

/**
 * Resultado de Job de Analytics
 */
export interface AnalyticsJobResult {
  success: boolean;
  metrics?: Record<string, number>;
  error?: string;
}

/**
 * Resultado de Job de IA
 */
export interface AIJobResult {
  success: boolean;
  result?: string | Record<string, unknown>;
  tokens?: {
    prompt: number;
    completion: number;
  };
  error?: string;
}

/**
 * Resultado de Job de Notificacao
 */
export interface NotificationJobResult {
  success: boolean;
  delivered?: boolean;
  error?: string;
}

/**
 * Nomes dos jobs
 */
export const JOB_NAMES = {
  // Email
  SEND_WELCOME_EMAIL: 'send-welcome-email',
  SEND_SURVEY_INVITE: 'send-survey-invite',
  SEND_SURVEY_REMINDER: 'send-survey-reminder',
  SEND_PASSWORD_RESET: 'send-password-reset',

  // Export
  EXPORT_RESPONSES_CSV: 'export-responses-csv',
  EXPORT_RESPONSES_PDF: 'export-responses-pdf',

  // Analytics
  AGGREGATE_DAILY_STATS: 'aggregate-daily-stats',
  CALCULATE_NPS: 'calculate-nps',

  // AI
  ANALYZE_SENTIMENT: 'analyze-sentiment',
  GENERATE_SUMMARY: 'generate-summary',
  GENERATE_QUESTIONS: 'generate-questions',

  // Notification
  SEND_PUSH_NOTIFICATION: 'send-push-notification',
} as const;
