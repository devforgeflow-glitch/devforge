/**
 * Email Service
 *
 * Servico centralizado para envio de emails via SendGrid.
 *
 * Funcionalidades:
 * - Envio de email individual
 * - Envio em massa (broadcast)
 * - Sistema de retry automatico
 * - Templates de email HTML
 * - Validacao de email
 *
 * @module api/services/email.service
 * @version 1.0.0
 */

import sgMail from '@sendgrid/mail';
import type {
  EmailConfig,
  SendEmailOptions,
  SendEmailResult,
  BulkEmailResult,
  EmailProvider,
  EmailTemplateType,
  TemplateData,
} from '@/api/types/email.types';
import { logger } from '@/api/utils/logger';
import { ValidationError } from '@/api/utils/errors';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Configuracao do servico de email a partir de variaveis de ambiente
 */
const EMAIL_CONFIG: EmailConfig = {
  provider: (process.env.EMAIL_PROVIDER as EmailProvider) || 'sendgrid',
  from: {
    email: process.env.SENDGRID_FROM_EMAIL || 'notificacoes@devforge.app',
    name: process.env.SENDGRID_FROM_NAME || 'DevForge',
  },
  enabled: process.env.EMAIL_ENABLE_SENDING !== 'false',
  retry: {
    attempts: parseInt(process.env.EMAIL_RETRY_ATTEMPTS || '3', 10),
    delayMs: parseInt(process.env.EMAIL_RETRY_DELAY_MS || '5000', 10),
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
  },
};

// Configurar SendGrid API Key
if (EMAIL_CONFIG.provider === 'sendgrid' && EMAIL_CONFIG.sendgrid?.apiKey) {
  sgMail.setApiKey(EMAIL_CONFIG.sendgrid.apiKey);
}

// ============================================================================
// EMAIL SERVICE CLASS
// ============================================================================

class EmailService {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    this.validateConfig();
  }

  // ==========================================================================
  // VALIDATION
  // ==========================================================================

  /**
   * Valida configuracao do servico de email
   */
  private validateConfig(): void {
    if (!this.config.enabled) {
      logger.warn('Email Service esta DESABILITADO (EMAIL_ENABLE_SENDING=false)');
      return;
    }

    if (this.config.provider === 'sendgrid') {
      if (!this.config.sendgrid?.apiKey) {
        logger.warn('SENDGRID_API_KEY nao configurada. Email Service sera DESABILITADO.');
        this.config.enabled = false;
        return;
      }
    }

    if (!this.config.from.email) {
      logger.warn('Email remetente nao configurado. Email Service sera DESABILITADO.');
      this.config.enabled = false;
      return;
    }

    logger.info('Email Service configurado corretamente', {
      service: 'EmailService',
      method: 'validateConfig',
    });
  }

  /**
   * Valida formato de endereco de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida opcoes de envio de email
   */
  private validateSendOptions(options: SendEmailOptions): void {
    if (!options.to) {
      throw new ValidationError('Email destinatario (to) e obrigatorio');
    }

    if (!this.isValidEmail(options.to)) {
      throw new ValidationError(`Email destinatario invalido: ${options.to}`);
    }

    if (!options.subject) {
      throw new ValidationError('Assunto do email (subject) e obrigatorio');
    }

    if (!options.html && !options.text) {
      throw new ValidationError('Conteudo do email (html ou text) e obrigatorio');
    }
  }

  // ==========================================================================
  // CORE SEND METHODS
  // ==========================================================================

  /**
   * Envia um email individual
   */
  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    const startTime = Date.now();
    const logContext = {
      service: 'EmailService',
      method: 'sendEmail',
    };

    logger.info(`Enviando email para ${options.to}`, logContext);

    try {
      // 1. Verificar se envio esta habilitado
      if (!this.config.enabled) {
        logger.warn('Email NAO enviado (servico desabilitado)', logContext);
        return {
          success: false,
          error: {
            code: 'EMAIL_DISABLED',
            message: 'Envio de email esta desabilitado',
          },
          provider: this.config.provider,
        };
      }

      // 2. Validar opcoes
      this.validateSendOptions(options);

      // 3. Enviar via SendGrid
      const result = await this.sendViaSendGrid(options);

      // 4. Log de sucesso
      const duration = Date.now() - startTime;
      logger.info('Email enviado com sucesso', {
        ...logContext,
        duration,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      logger.error('Erro ao enviar email', {
        ...logContext,
        error: errorMessage,
      });

      return {
        success: false,
        error: {
          code: 'EMAIL_SEND_ERROR',
          message: errorMessage,
          details: error,
        },
        provider: this.config.provider,
      };
    }
  }

  /**
   * Envia emails em massa (broadcast)
   */
  async sendBulkEmail(
    emails: string[],
    options: Omit<SendEmailOptions, 'to'>
  ): Promise<BulkEmailResult> {
    logger.info(`Enviando emails em massa para ${emails.length} destinatarios`, {
      service: 'EmailService',
      method: 'sendBulkEmail',
    });

    const result: BulkEmailResult = {
      success: 0,
      failed: 0,
      total: emails.length,
      messageIds: [],
      errors: [],
    };

    // Enviar emails individualmente
    const promises = emails.map(async (email) => {
      try {
        const sendResult = await this.sendEmail({
          ...options,
          to: email,
        });

        if (sendResult.success) {
          result.success++;
          if (sendResult.messageId) {
            result.messageIds.push(sendResult.messageId);
          }
        } else {
          result.failed++;
          result.errors.push({
            email,
            error: sendResult.error?.message || 'Erro desconhecido',
          });
        }
      } catch (error) {
        result.failed++;
        result.errors.push({
          email,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }
    });

    await Promise.all(promises);

    logger.info('Envio em massa concluido', {
      service: 'EmailService',
      method: 'sendBulkEmail',
    });

    return result;
  }

  // ==========================================================================
  // PROVIDER-SPECIFIC METHODS
  // ==========================================================================

  /**
   * Envia email via SendGrid
   */
  private async sendViaSendGrid(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      // Construir mensagem - usar 'as any' para contornar tipos estritos do SendGrid
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg: any = {
        to: options.to,
        from: {
          email: this.config.from.email,
          name: this.config.from.name,
        },
        subject: options.subject,
      };

      // Adicionar conteudo (html tem prioridade)
      if (options.html) {
        msg.html = options.html;
      }
      if (options.text) {
        msg.text = options.text;
      }

      // Adicionar campos opcionais
      if (options.replyTo) msg.replyTo = options.replyTo;
      if (options.cc) msg.cc = options.cc;
      if (options.bcc) msg.bcc = options.bcc;
      if (options.headers) msg.headers = options.headers;
      if (options.category) msg.categories = [options.category];
      if (options.trackingId) msg.customArgs = { trackingId: options.trackingId };

      if (options.attachments) {
        msg.attachments = options.attachments.map((att) => ({
          filename: att.filename,
          content: typeof att.content === 'string' ? att.content : att.content.toString('base64'),
          ...(att.type && { type: att.type }),
          ...(att.disposition && { disposition: att.disposition }),
          ...(att.contentId && { contentId: att.contentId }),
        }));
      }

      const [response] = await sgMail.send(msg);

      return {
        success: true,
        messageId: response.headers['x-message-id'] as string,
        sentAt: new Date(),
        provider: 'sendgrid',
      };
    } catch (error: unknown) {
      // SendGrid retorna erros estruturados
      if (error && typeof error === 'object' && 'response' in error) {
        const sgError = error as { response: { statusCode: number; body?: { errors?: Array<{ message: string }> } } };
        const { statusCode, body } = sgError.response;
        throw new Error(
          `SendGrid Error ${statusCode}: ${body?.errors?.[0]?.message || 'Erro desconhecido'}`
        );
      }
      throw error;
    }
  }

  // ==========================================================================
  // RETRY LOGIC
  // ==========================================================================

  /**
   * Envia email com retry automatico em caso de falha
   */
  async sendEmailWithRetry(options: SendEmailOptions): Promise<SendEmailResult> {
    const { attempts, delayMs } = this.config.retry;

    for (let attempt = 1; attempt <= attempts; attempt++) {
      const result = await this.sendEmail(options);

      if (result.success) {
        return result;
      }

      if (attempt < attempts) {
        logger.warn(`Tentativa ${attempt}/${attempts} falhou. Retentando em ${delayMs}ms...`, {
          service: 'EmailService',
        });
        await this.delay(delayMs);
      }
    }

    logger.error('Todas as tentativas de envio falharam', {
      service: 'EmailService',
    });

    return {
      success: false,
      error: {
        code: 'EMAIL_RETRY_EXHAUSTED',
        message: `Falha apos ${attempts} tentativas`,
      },
      provider: this.config.provider,
    };
  }

  /**
   * Aguarda um periodo de tempo (para retry)
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ==========================================================================
  // TEMPLATE-BASED METHODS
  // ==========================================================================

  /**
   * Renderiza e envia email usando template
   */
  async sendTemplatedEmail(
    to: string,
    templateType: EmailTemplateType,
    data: Partial<TemplateData>,
    subject: string
  ): Promise<SendEmailResult> {
    try {
      // Renderizar template
      const html = this.renderTemplate(templateType, data, subject);

      // Enviar email
      return await this.sendEmail({
        to,
        subject,
        html,
        category: templateType,
      });
    } catch (error) {
      logger.error('Erro ao enviar email com template', {
        service: 'EmailService',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
      throw error;
    }
  }

  /**
   * Renderiza template HTML
   */
  private renderTemplate(
    templateType: EmailTemplateType,
    data: Partial<TemplateData>,
    subject: string
  ): string {
    const appName = 'DevForge';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://devforge.app';
    const currentYear = new Date().getFullYear();

    // Template base
    const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { text-align: center; margin-bottom: 24px; }
    .logo { font-size: 24px; font-weight: 700; color: #6366F1; }
    .title { font-size: 20px; font-weight: 600; margin: 16px 0 8px; color: #1a1a1a; }
    .message { color: #4a4a4a; margin-bottom: 24px; }
    .button { display: inline-block; background: #6366F1; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-weight: 600; margin: 16px 0; }
    .button:hover { background: #4F46E5; }
    .footer { text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e5e5; color: #888; font-size: 12px; }
    .footer a { color: #6366F1; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">${appName}</div>
      </div>
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${currentYear} ${appName}. Todos os direitos reservados.</p>
      <p><a href="${appUrl}">Acessar plataforma</a></p>
    </div>
  </div>
</body>
</html>
    `;

    // Templates especificos
    const templates: Record<EmailTemplateType, string> = {
      'welcome': baseTemplate(`
        <h1 class="title">Bem-vindo ao ${appName}!</h1>
        <p class="message">Ola ${data.userName || 'Usuario'},</p>
        <p class="message">Sua conta foi criada com sucesso. Estamos felizes em ter voce conosco!</p>
        <p style="text-align: center;">
          <a href="${appUrl}/app/dashboard" class="button">Acessar Dashboard</a>
        </p>
      `),

      'password-reset': baseTemplate(`
        <h1 class="title">Redefinir Senha</h1>
        <p class="message">Ola ${data.userName || 'Usuario'},</p>
        <p class="message">Recebemos uma solicitacao para redefinir sua senha. Clique no botao abaixo para criar uma nova senha:</p>
        <p style="text-align: center;">
          <a href="${data.resetLink}" class="button">Redefinir Senha</a>
        </p>
        <p class="message" style="font-size: 13px; color: #888;">Este link expira em ${data.expiresIn || '1 hora'}. Se voce nao solicitou esta alteracao, ignore este email.</p>
      `),

      'email-verification': baseTemplate(`
        <h1 class="title">Verificar Email</h1>
        <p class="message">Ola ${data.userName || 'Usuario'},</p>
        <p class="message">Por favor, verifique seu email clicando no botao abaixo:</p>
        <p style="text-align: center;">
          <a href="${data.actionLink}" class="button">Verificar Email</a>
        </p>
      `),

      'survey-invitation': baseTemplate(`
        <h1 class="title">${data.title || 'Convite para Pesquisa'}</h1>
        <p class="message">Ola ${data.userName || 'Usuario'},</p>
        <p class="message">${data.message || 'Voce foi convidado a participar de uma pesquisa.'}</p>
        <p style="text-align: center;">
          <a href="${data.actionLink}" class="button">${data.actionButtonText || 'Responder Pesquisa'}</a>
        </p>
      `),

      'survey-response': baseTemplate(`
        <h1 class="title">Nova Resposta na Pesquisa</h1>
        <p class="message">Ola ${data.userName || 'Usuario'},</p>
        <p class="message">Sua pesquisa "${data.projectTitle || 'Pesquisa'}" recebeu uma nova resposta!</p>
        <p style="text-align: center;">
          <a href="${data.actionLink}" class="button">Ver Resultados</a>
        </p>
      `),

      'notification-system': baseTemplate(`
        <h1 class="title">${data.title || 'Notificacao'}</h1>
        <p class="message">${data.message || ''}</p>
        ${data.actionLink ? `
        <p style="text-align: center;">
          <a href="${data.actionLink}" class="button">${data.actionButtonText || 'Ver mais'}</a>
        </p>
        ` : ''}
      `),
    };

    return templates[templateType] || templates['notification-system'];
  }

  // ==========================================================================
  // CONVENIENCE METHODS
  // ==========================================================================

  /**
   * Envia email de boas-vindas
   */
  async sendWelcomeEmail(to: string, userName: string): Promise<SendEmailResult> {
    return this.sendTemplatedEmail(to, 'welcome', { userName }, 'Bem-vindo ao DevForge!');
  }

  /**
   * Envia email de recuperacao de senha
   */
  async sendPasswordResetEmail(
    to: string,
    data: { userName?: string; resetLink: string; expiresIn?: string }
  ): Promise<SendEmailResult> {
    return this.sendTemplatedEmail(to, 'password-reset', data, 'Redefinir Senha - DevForge');
  }

  /**
   * Envia email de verificacao
   */
  async sendVerificationEmail(
    to: string,
    data: { userName?: string; actionLink: string }
  ): Promise<SendEmailResult> {
    return this.sendTemplatedEmail(to, 'email-verification', data, 'Verificar Email - DevForge');
  }

  /**
   * Envia convite para pesquisa
   */
  async sendSurveyInvitation(
    to: string,
    data: { userName?: string; title: string; message?: string; actionLink: string }
  ): Promise<SendEmailResult> {
    return this.sendTemplatedEmail(to, 'survey-invitation', data, data.title);
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  /**
   * Verifica se o servico de email esta habilitado
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Obtem configuracao atual
   */
  getConfig(): EmailConfig {
    return { ...this.config };
  }

  /**
   * Valida um endereco de email
   */
  validateEmail(email: string): boolean {
    return this.isValidEmail(email);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Instancia singleton do EmailService
 */
export const emailService = new EmailService(EMAIL_CONFIG);

/**
 * Export class para testes
 */
export { EmailService };

/**
 * Export default
 */
export default emailService;
