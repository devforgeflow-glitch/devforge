/**
 * BullMQ Jobs - Exportacao Central
 *
 * Gerencia filas e workers de processamento em background.
 *
 * @version 1.0.0
 */

// Filas
export {
  emailQueue,
  exportQueue,
  analyticsQueue,
  aiQueue,
  notificationQueue,
  queues,
  closeAllQueues,
} from './queues';

// Tipos
export type {
  EmailJobData,
  ExportJobData,
  AnalyticsJobData,
  AIJobData,
  NotificationJobData,
  EmailJobResult,
  ExportJobResult,
  AnalyticsJobResult,
  AIJobResult,
  NotificationJobResult,
} from './types';

export { JOB_NAMES } from './types';

// Workers
export { createEmailWorker } from './workers/email.worker';
export { createAnalyticsWorker } from './workers/analytics.worker';
export { createAIWorker } from './workers/ai.worker';

/**
 * Inicia todos os workers
 */
export function startAllWorkers() {
  const { createEmailWorker } = require('./workers/email.worker');
  const { createAnalyticsWorker } = require('./workers/analytics.worker');
  const { createAIWorker } = require('./workers/ai.worker');

  return {
    email: createEmailWorker(),
    analytics: createAnalyticsWorker(),
    ai: createAIWorker(),
  };
}
