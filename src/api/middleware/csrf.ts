/**
 * Middleware de Proteção CSRF (Double-Submit Cookie)
 *
 * @version 1.0.0
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { randomBytes } from 'crypto';

const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Gera token CSRF
 */
function generateToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Métodos que requerem validação CSRF
 */
const DANGEROUS_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * Middleware CSRF usando Double-Submit Cookie pattern
 */
export function csrfMiddleware() {
  return async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void
  ): Promise<void> => {
    // GET/HEAD/OPTIONS não precisam de CSRF
    if (!DANGEROUS_METHODS.includes(req.method || '')) {
      return next();
    }

    // Verificar se é webhook (tem signature própria)
    const webhookSignature = req.headers['x-webhook-signature'];
    if (webhookSignature) {
      return next();
    }

    // Obter token do cookie
    const cookies = req.headers.cookie || '';
    const cookieToken = cookies
      .split(';')
      .find(c => c.trim().startsWith(`${CSRF_COOKIE_NAME}=`))
      ?.split('=')[1];

    // Obter token do header
    const headerToken = req.headers[CSRF_HEADER_NAME] as string;

    // Validar tokens
    if (!cookieToken || !headerToken) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'CSRF_TOKEN_MISSING',
          message: 'Token CSRF não fornecido',
        },
      });
    }

    if (cookieToken !== headerToken) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'CSRF_TOKEN_INVALID',
          message: 'Token CSRF inválido',
        },
      });
    }

    next();
  };
}

/**
 * Handler para gerar token CSRF
 */
export async function getCsrfTokenHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const token = generateToken();

  // Definir cookie httpOnly
  res.setHeader('Set-Cookie', [
    `${CSRF_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; ${
      process.env.NODE_ENV === 'production' ? 'Secure;' : ''
    } Max-Age=3600`,
  ]);

  res.status(200).json({
    success: true,
    data: { token },
  });
}
