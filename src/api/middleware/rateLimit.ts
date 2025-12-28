/**
 * Middleware de Rate Limiting com Redis
 *
 * @version 1.0.0
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { QuotaExceededError } from '@/api/utils/errors';
import { getRedisClient } from '@/api/lib/redis';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: NextApiRequest) => string;
}

function defaultKeyGenerator(req: NextApiRequest): string {
  if (req.user?.uid) {
    return `user:${req.user.uid}`;
  }

  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const forwardedValue = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return `ip:${forwardedValue.split(',')[0].trim()}`;
  }

  const realIP = req.headers['x-real-ip'];
  if (realIP) {
    return `ip:${Array.isArray(realIP) ? realIP[0] : realIP}`;
  }

  return `ip:${req.socket?.remoteAddress || 'unknown'}`;
}

/**
 * Middleware de rate limiting
 */
export function rateLimitMiddleware(config: Partial<RateLimitConfig> = {}) {
  const {
    windowMs = 60000,
    max = 100,
    message = 'Muitas requisições. Tente novamente mais tarde',
    keyGenerator = defaultKeyGenerator,
  } = config;

  return async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void
  ): Promise<void> => {
    try {
      const redis = await getRedisClient();
      const identifier = keyGenerator(req);
      const key = `ratelimit:${identifier}:${req.url || 'unknown'}`;
      const now = Date.now();
      const windowStart = now - windowMs;
      const requestId = `${now}:${Math.random()}`;

      const pipeline = redis.multi();
      pipeline.zremrangebyscore(key, 0, windowStart);
      pipeline.zadd(key, now, requestId);
      pipeline.zcard(key);
      pipeline.expire(key, Math.ceil(windowMs / 1000));

      const results = await pipeline.exec();
      // results[2] contem [error, count] do zcard
      const count = (results?.[2]?.[1] as number) || 0;

      res.setHeader('X-RateLimit-Limit', max.toString());
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - count).toString());

      if (count > max) {
        throw new QuotaExceededError(message);
      }

      next();
    } catch (error) {
      if (error instanceof QuotaExceededError) {
        res.status(429).json({
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        });
        return;
      }

      // Fail open - permitir requisição se Redis falhar
      console.error('[RateLimit] Erro no Redis, permitindo requisição:', error);
      next();
    }
  };
}

/**
 * Rate limits pré-configurados
 */
export const rateLimits = {
  login: rateLimitMiddleware({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos',
  }),

  signup: rateLimitMiddleware({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: 'Muitas tentativas de cadastro. Tente novamente em 1 hora',
  }),

  general: rateLimitMiddleware({
    windowMs: 60 * 1000,
    max: 100,
  }),

  write: rateLimitMiddleware({
    windowMs: 60 * 1000,
    max: 20,
  }),

  admin: rateLimitMiddleware({
    windowMs: 60 * 1000,
    max: 50,
  }),

  ai: rateLimitMiddleware({
    windowMs: 60 * 1000,
    max: 10,
    message: 'Muitas requisições de IA. Aguarde um momento',
  }),
};
