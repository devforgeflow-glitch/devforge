/**
 * Tipos para o servico de email
 *
 * Define interfaces para configuracao, opcoes de envio e resultados.
 *
 * @module api/types/email.types
 * @version 1.0.0
 */

// ============================================================================
// PROVIDER TYPES
// ============================================================================

/**
 * Provedores de email suportados
 */
export type EmailProvider = 'sendgrid' | 'smtp' | 'aws-ses';

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

/**
 * Configuracao do servico de email
 */
export interface EmailConfig {
  /** Provedor de email */
  provider: EmailProvider;
  /** Remetente padrao */
  from: {
    email: string;
    name: string;
  };
  /** Se o envio esta habilitado */
  enabled: boolean;
  /** Configuracao de retry */
  retry: {
    attempts: number;
    delayMs: number;
  };
  /** Configuracao especifica do SendGrid */
  sendgrid?: {
    apiKey: string;
  };
}

// ============================================================================
// SEND OPTIONS
// ============================================================================

/**
 * Anexo de email
 */
export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  type?: string;
  disposition?: 'attachment' | 'inline';
  contentId?: string;
}

/**
 * Opcoes para envio de email
 */
export interface SendEmailOptions {
  /** Email destinatario */
  to: string;
  /** Assunto do email */
  subject: string;
  /** Conteudo HTML */
  html?: string;
  /** Conteudo texto puro */
  text?: string;
  /** Email de resposta */
  replyTo?: string;
  /** Copia */
  cc?: string | string[];
  /** Copia oculta */
  bcc?: string | string[];
  /** Headers customizados */
  headers?: Record<string, string>;
  /** Categoria para tracking */
  category?: string;
  /** ID de tracking customizado */
  trackingId?: string;
  /** Anexos */
  attachments?: EmailAttachment[];
}

// ============================================================================
// RESULT TYPES
// ============================================================================

/**
 * Erro de envio de email
 */
export interface EmailError {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Resultado de envio de email individual
 */
export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  sentAt?: Date;
  error?: EmailError;
  provider: EmailProvider;
}

/**
 * Resultado de envio em massa
 */
export interface BulkEmailResult {
  success: number;
  failed: number;
  total: number;
  messageIds: string[];
  errors: Array<{
    email: string;
    error: string;
  }>;
}

// ============================================================================
// TEMPLATE TYPES
// ============================================================================

/**
 * Tipos de template de email disponiveis
 */
export type EmailTemplateType =
  | 'welcome'
  | 'password-reset'
  | 'email-verification'
  | 'survey-invitation'
  | 'survey-response'
  | 'notification-system';

/**
 * Dados dinamicos para templates
 */
export interface TemplateData {
  /** Nome do usuario */
  userName?: string;
  /** Titulo */
  title?: string;
  /** Mensagem principal */
  message?: string;
  /** Link de acao */
  actionLink?: string;
  /** Texto do botao de acao */
  actionButtonText?: string;
  /** URL de imagem */
  imageUrl?: string;
  /** Link de reset de senha */
  resetLink?: string;
  /** Tempo de expiracao */
  expiresIn?: string;
  /** IP da requisicao */
  requestIp?: string;
  /** Categoria de preferencia */
  preferenceCategory?: string;
  /** Titulo do projeto/pesquisa */
  projectTitle?: string;
  /** Imagem do projeto */
  projectImage?: string;
  /** Ano atual */
  currentYear?: number;
  /** URL do app */
  appUrl?: string;
  /** URL de preferencias */
  preferencesUrl?: string;
}

/**
 * Eventos transacionais disponiveis
 */
export type TransactionalEventId =
  | 'welcome'
  | 'password_reset'
  | 'email_verification'
  | 'survey_created'
  | 'survey_response'
  | 'subscription_created'
  | 'subscription_renewed'
  | 'subscription_cancelled';
