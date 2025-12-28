/**
 * Cliente Redis com Circuit Breaker
 *
 * @version 1.0.0
 */

import { Redis } from 'ioredis';

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  halfOpenRequests: number;
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  resetTimeout: 30000,
  halfOpenRequests: 3,
};

let redisClient: Redis | null = null;
let circuitState: CircuitState = 'CLOSED';
let failureCount = 0;
let lastFailureTime = 0;
let halfOpenAttempts = 0;

/**
 * Cria conexão Redis
 */
function createRedisClient(): Redis {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';

  const client = new Redis(url, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 200, 2000);
    },
    enableReadyCheck: true,
    lazyConnect: true,
  });

  client.on('connect', () => {
    console.log('[Redis] Conectado');
    circuitState = 'CLOSED';
    failureCount = 0;
  });

  client.on('error', (error) => {
    console.error('[Redis] Erro:', error.message);
    recordFailure();
  });

  client.on('close', () => {
    console.log('[Redis] Conexão fechada');
  });

  return client;
}

/**
 * Registra falha para circuit breaker
 */
function recordFailure(): void {
  failureCount++;
  lastFailureTime = Date.now();

  if (failureCount >= DEFAULT_CONFIG.failureThreshold) {
    circuitState = 'OPEN';
    console.warn('[Redis] Circuit breaker ABERTO');
  }
}

/**
 * Verifica se pode tentar conexão
 */
function canAttemptConnection(): boolean {
  if (circuitState === 'CLOSED') return true;

  if (circuitState === 'OPEN') {
    const elapsed = Date.now() - lastFailureTime;
    if (elapsed >= DEFAULT_CONFIG.resetTimeout) {
      circuitState = 'HALF_OPEN';
      halfOpenAttempts = 0;
      console.log('[Redis] Circuit breaker HALF_OPEN');
      return true;
    }
    return false;
  }

  if (circuitState === 'HALF_OPEN') {
    return halfOpenAttempts < DEFAULT_CONFIG.halfOpenRequests;
  }

  return false;
}

/**
 * Obtém cliente Redis com circuit breaker
 */
export async function getRedisClient(): Promise<Redis> {
  if (!canAttemptConnection()) {
    throw new Error('Redis circuit breaker está aberto');
  }

  if (!redisClient) {
    redisClient = createRedisClient();
  }

  if (redisClient.status !== 'ready') {
    try {
      await redisClient.connect();

      if (circuitState === 'HALF_OPEN') {
        circuitState = 'CLOSED';
        failureCount = 0;
        console.log('[Redis] Circuit breaker FECHADO');
      }
    } catch (error) {
      if (circuitState === 'HALF_OPEN') {
        halfOpenAttempts++;
        if (halfOpenAttempts >= DEFAULT_CONFIG.halfOpenRequests) {
          circuitState = 'OPEN';
          lastFailureTime = Date.now();
          console.warn('[Redis] Circuit breaker ABERTO após falha em HALF_OPEN');
        }
      }
      throw error;
    }
  }

  return redisClient;
}

/**
 * Verifica se Redis está disponível
 */
export async function isRedisHealthy(): Promise<boolean> {
  try {
    const client = await getRedisClient();
    const result = await client.ping();
    return result === 'PONG';
  } catch {
    return false;
  }
}

/**
 * Fecha conexão Redis
 */
export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log('[Redis] Conexão encerrada');
  }
}

/**
 * Obtém estado do circuit breaker
 */
export function getCircuitState(): CircuitState {
  return circuitState;
}
