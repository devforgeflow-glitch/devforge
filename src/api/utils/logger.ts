/**
 * Logger Centralizado
 *
 * Sistema de logging estruturado para produção e desenvolvimento.
 *
 * @version 1.0.0
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  service?: string;
  method?: string;
  userId?: string;
  duration?: number;
  [key: string]: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const CURRENT_LEVEL = LOG_LEVELS[
  (process.env.LOG_LEVEL as LogLevel) || 'info'
];

/**
 * Formata mensagem de log
 */
function formatLog(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` ${JSON.stringify(context)}` : '';

  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
}

/**
 * Verifica se deve logar baseado no nível
 */
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= CURRENT_LEVEL;
}

/**
 * Logger principal
 */
export const logger = {
  debug(message: string, context?: LogContext): void {
    if (!shouldLog('debug')) return;

    if (process.env.NODE_ENV === 'development') {
      console.debug(formatLog('debug', message, context));
    }
  },

  info(message: string, context?: LogContext): void {
    if (!shouldLog('info')) return;

    console.log(formatLog('info', message, context));
  },

  warn(message: string, context?: LogContext): void {
    if (!shouldLog('warn')) return;

    console.warn(formatLog('warn', message, context));
  },

  error(message: string, context?: LogContext | unknown): void {
    if (!shouldLog('error')) return;

    // Se context for um erro, extrair informações
    if (context instanceof Error) {
      console.error(formatLog('error', message, {
        error: context.message,
        stack: context.stack,
      }));
    } else {
      console.error(formatLog('error', message, context as LogContext));
    }
  },

  /**
   * Log de performance
   */
  perf(operation: string, durationMs: number, context?: LogContext): void {
    this.info(`[PERF] ${operation}`, {
      ...context,
      duration: durationMs,
    });
  },

  /**
   * Log de auditoria
   */
  audit(action: string, context: LogContext): void {
    this.info(`[AUDIT] ${action}`, {
      ...context,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Log de segurança
   */
  security(event: string, context: LogContext): void {
    this.warn(`[SECURITY] ${event}`, {
      ...context,
      timestamp: new Date().toISOString(),
    });
  },
};

/**
 * Mede tempo de execução de uma função async
 */
export async function withPerformanceLog<T>(
  operation: string,
  fn: () => Promise<T>,
  context?: LogContext
): Promise<T> {
  const start = Date.now();

  try {
    const result = await fn();
    logger.perf(operation, Date.now() - start, { ...context, success: true });
    return result;
  } catch (error) {
    logger.perf(operation, Date.now() - start, {
      ...context,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}
