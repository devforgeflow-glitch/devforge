/**
 * Worker de Email
 *
 * Processa jobs de envio de emails.
 *
 * @version 1.0.0
 */

import { Worker, type Job } from 'bullmq';
import { logger } from '@/api/utils/logger';
import type { EmailJobData, EmailJobResult } from '../types';

/**
 * Configuracao de conexao Redis
 */
function getRedisConnection() {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  try {
    const url = new URL(redisUrl);
    return {
      host: url.hostname,
      port: parseInt(url.port) || 6379,
      password: url.password || undefined,
      username: url.username || undefined,
    };
  } catch {
    return {
      host: 'localhost',
      port: 6379,
    };
  }
}

/**
 * Processa um job de email
 */
async function processEmailJob(job: Job<EmailJobData>): Promise<EmailJobResult> {
  const { type, to, subject, template, variables } = job.data;

  logger.info('Processando job de email', {
    jobId: job.id,
    type,
    to,
    subject,
  });

  try {
    // TODO: Implementar envio real de email com SendGrid/Resend
    // Por enquanto, simula o envio
    await simulateEmailSend(to, subject, template, variables);

    logger.info('Email enviado com sucesso', {
      jobId: job.id,
      to,
    });

    return {
      success: true,
      messageId: `msg-${Date.now()}`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

    logger.error('Erro ao enviar email', {
      jobId: job.id,
      error: errorMessage,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Simula envio de email (substituir por implementacao real)
 */
async function simulateEmailSend(
  to: string,
  subject: string,
  template: string,
  variables: Record<string, string | number | boolean>
): Promise<void> {
  // Simula delay de envio
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Log para desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    logger.info('Email simulado', {
      to,
      subject,
      template,
      variables,
    });
  }
}

/**
 * Cria e retorna o worker de email
 */
export function createEmailWorker(): Worker<EmailJobData, EmailJobResult> {
  const worker = new Worker<EmailJobData, EmailJobResult>(
    'emails',
    processEmailJob,
    {
      connection: getRedisConnection(),
      concurrency: 5, // Processa ate 5 emails simultaneamente
      limiter: {
        max: 100, // Maximo 100 emails
        duration: 60000, // Por minuto
      },
    }
  );

  worker.on('completed', (job) => {
    logger.debug('Job de email completado', { jobId: job.id });
  });

  worker.on('failed', (job, error) => {
    logger.error('Job de email falhou', {
      jobId: job?.id,
      error: error.message,
    });
  });

  return worker;
}

export default createEmailWorker;
