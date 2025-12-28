/**
 * Middleware Composer e Exports Centralizados
 *
 * Utilitário para executar múltiplos middlewares em sequência.
 * Simplifica o uso de middlewares em API Routes.
 *
 * @version 1.0.0
 */

import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Tipo do middleware Next.js
 */
export type MiddlewareFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: (err?: Error) => void
) => void | Promise<void>;

export type Middleware = MiddlewareFunction;

/**
 * Executa um ou múltiplos middlewares em sequência
 *
 * @param req - Request object
 * @param res - Response object
 * @param middlewares - Middleware único ou array de middlewares
 *
 * @example
 * ```typescript
 * await runMiddleware(req, res, [
 *   helmetMiddleware,
 *   corsMiddleware,
 *   authMiddleware,
 *   permissionsMiddleware(['admin']),
 * ]);
 * ```
 */
export async function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  middlewares: Middleware | Middleware[]
): Promise<void> {
  const middlewareArray = Array.isArray(middlewares) ? middlewares : [middlewares];

  for (let i = 0; i < middlewareArray.length; i++) {
    const middleware = middlewareArray[i];

    if (res.writableEnded) {
      break;
    }

    let nextCalled = false;

    try {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          if (res.writableEnded) {
            resolve();
            return;
          }
          if (!nextCalled) {
            resolve();
          }
        }, 3000);

        const middlewareResult = middleware(req, res, (err?: Error) => {
          clearTimeout(timeout);
          nextCalled = true;
          if (err) reject(err);
          else resolve();
        });

        if (middlewareResult instanceof Promise) {
          middlewareResult
            .then(() => {
              setImmediate(() => {
                if (res.writableEnded) {
                  clearTimeout(timeout);
                  resolve();
                }
              });
            })
            .catch(reject);
        } else {
          setImmediate(() => {
            if (res.writableEnded) {
              clearTimeout(timeout);
              resolve();
            }
          });
        }
      });
    } catch (error) {
      if (!res.writableEnded) throw error;
      break;
    }

    if (res.writableEnded || !nextCalled) break;
  }
}

/**
 * Compõe múltiplos middlewares em um único
 */
export function composeMiddlewares(middlewares: Middleware[]): Middleware {
  return async (req, res, next) => {
    try {
      await runMiddleware(req, res, middlewares);
      next();
    } catch (error) {
      next(error as Error);
    }
  };
}

// ============================================================================
// EXPORTS - Todos os middlewares disponíveis
// ============================================================================

export { helmetMiddleware, helmetWithCustomCSP } from './helmet';
export { corsMiddleware, corsWithOptions } from './cors';
export { authMiddleware, optionalAuthMiddleware } from './auth';
export { permissionsMiddleware, requireAdminMiddleware } from './permissions';
export { validatorMiddleware, validateBody, validateQuery } from './validator';
export { rateLimitMiddleware, rateLimits } from './rateLimit';
export { csrfMiddleware } from './csrf';
