/**
 * Definicao das Filas BullMQ
 *
 * Configura as filas de processamento em background.
 *
 * @version 1.0.0
 */

import { Queue, type ConnectionOptions } from 'bullmq';

/**
 * Configuracao de conexao Redis para BullMQ
 */
function getRedisConnection(): ConnectionOptions {
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

const connection = getRedisConnection();

/**
 * Opcoes padrao para filas
 */
const defaultQueueOptions = {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential' as const,
      delay: 1000,
    },
    removeOnComplete: {
      count: 100,
      age: 24 * 60 * 60, // 24 horas
    },
    removeOnFail: {
      count: 500,
      age: 7 * 24 * 60 * 60, // 7 dias
    },
  },
};

/**
 * Fila de emails
 * Processamento de envio de emails transacionais
 */
export const emailQueue = new Queue('emails', {
  ...defaultQueueOptions,
  defaultJobOptions: {
    ...defaultQueueOptions.defaultJobOptions,
    priority: 1, // Alta prioridade
  },
});

/**
 * Fila de exportacao
 * Processamento de exportacao de dados (CSV, PDF)
 */
export const exportQueue = new Queue('exports', {
  ...defaultQueueOptions,
  defaultJobOptions: {
    ...defaultQueueOptions.defaultJobOptions,
    priority: 2,
  },
});

/**
 * Fila de analytics
 * Agregacao de metricas e estatisticas
 */
export const analyticsQueue = new Queue('analytics', {
  ...defaultQueueOptions,
  defaultJobOptions: {
    ...defaultQueueOptions.defaultJobOptions,
    priority: 3, // Baixa prioridade
  },
});

/**
 * Fila de IA
 * Processamento de tarefas de inteligencia artificial
 */
export const aiQueue = new Queue('ai-processing', {
  ...defaultQueueOptions,
  defaultJobOptions: {
    ...defaultQueueOptions.defaultJobOptions,
    priority: 2,
  },
});

/**
 * Fila de notificacoes
 * Push notifications e alertas
 */
export const notificationQueue = new Queue('notifications', {
  ...defaultQueueOptions,
  defaultJobOptions: {
    ...defaultQueueOptions.defaultJobOptions,
    priority: 1,
  },
});

/**
 * Exporta todas as filas
 */
export const queues = {
  email: emailQueue,
  export: exportQueue,
  analytics: analyticsQueue,
  ai: aiQueue,
  notification: notificationQueue,
};

/**
 * Fecha todas as filas (para shutdown gracioso)
 */
export async function closeAllQueues(): Promise<void> {
  await Promise.all([
    emailQueue.close(),
    exportQueue.close(),
    analyticsQueue.close(),
    aiQueue.close(),
    notificationQueue.close(),
  ]);
}
