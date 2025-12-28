/**
 * Middleware de CORS (Cross-Origin Resource Sharing)
 *
 * Controla quais origens podem acessar a API.
 *
 * @version 1.0.0
 */

import type { NextApiRequest, NextApiResponse } from 'next';

const getAllowedOrigins = (): string[] => {
  const originsEnv = process.env.CORS_ALLOWED_ORIGINS || process.env.ALLOWED_ORIGINS || '';
  const origins = originsEnv.split(',').map(origin => origin.trim()).filter(Boolean);

  const safeOrigins = origins.filter(origin => {
    if (origin === '*') {
      console.error('[CORS] ⚠️ Wildcard (*) não é permitido. Ignorando.');
      return false;
    }
    try {
      const url = new URL(origin);
      if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
        console.warn(`[CORS] ⚠️ Origem não-HTTPS ignorada em produção: ${origin}`);
        return false;
      }
      return true;
    } catch {
      console.warn(`[CORS] ⚠️ Origem inválida ignorada: ${origin}`);
      return false;
    }
  });

  return safeOrigins;
};

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];

const ALLOWED_HEADERS = [
  'Content-Type',
  'Authorization',
  'X-Requested-With',
  'X-CSRF-Token',
  'Accept-Language',
];

const EXPOSED_HEADERS = [
  'Content-Length',
  'X-Request-Id',
];

/**
 * Middleware CORS com validação rigorosa
 */
export async function corsMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
): Promise<void> {
  const origin = req.headers.origin || '';
  const allowedOrigins = getAllowedOrigins();

  const isOriginAllowed = origin ? allowedOrigins.includes(origin) : false;

  if (!isOriginAllowed && origin) {
    console.warn('[CORS] 🚫 Origem não permitida:', {
      origin,
      method: req.method,
      url: req.url,
    });
  }

  if (isOriginAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader('Access-Control-Allow-Methods', ALLOWED_METHODS.join(', '));
  res.setHeader('Access-Control-Allow-Headers', ALLOWED_HEADERS.join(', '));
  res.setHeader('Access-Control-Expose-Headers', EXPOSED_HEADERS.join(', '));
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
}

/**
 * CORS com configuração customizada
 */
export function corsWithOptions(options: {
  allowedOrigins?: string[];
  allowCredentials?: boolean;
  allowedMethods?: string[];
}) {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const origin = req.headers.origin || '';
    const allowedOrigins = options.allowedOrigins || getAllowedOrigins();

    const isOriginAllowed = allowedOrigins.includes(origin);

    if (isOriginAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);

      if (options.allowCredentials !== false) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      }
    }

    const methods = options.allowedMethods || ALLOWED_METHODS;
    res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
    res.setHeader('Access-Control-Allow-Headers', ALLOWED_HEADERS.join(', '));

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    next();
  };
}
