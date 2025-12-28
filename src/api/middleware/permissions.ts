/**
 * Middleware de Autorização (Permissions)
 *
 * Sistema de autorização baseado em roles (RBAC).
 *
 * @version 1.0.0
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthenticationError, AuthorizationError } from '@/api/utils/errors';
import { logger } from '@/api/utils/logger';

/**
 * Middleware de verificação de permissões
 *
 * @param requiredRoles - Array de roles necessárias (OR logic)
 */
export function permissionsMiddleware(requiredRoles: string[]) {
  return async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Usuário não autenticado');
      }

      if (!req.user.roles || !Array.isArray(req.user.roles)) {
        throw new AuthorizationError('Usuário sem roles definidas');
      }

      const userRolesUpper = req.user.roles.map((r: string) => r.toUpperCase());

      const hasPermission = requiredRoles.some(required => {
        return userRolesUpper.includes(required.toUpperCase());
      });

      if (!hasPermission) {
        logger.warn('[Unauthorized Access]', {
          userId: req.user.uid,
          email: req.user.email,
          userRoles: req.user.roles,
          requiredRoles,
          url: req.url,
          method: req.method,
        });

        throw new AuthorizationError(
          `Permissão negada. Necessário: ${requiredRoles.join(' ou ')}`
        );
      }

      next();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return res.status(401).json({
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        });
      }

      if (error instanceof AuthorizationError) {
        return res.status(403).json({
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        });
      }

      throw error;
    }
  };
}

/**
 * Middleware que verifica se é admin
 */
export const requireAdminMiddleware = permissionsMiddleware(['ADMIN']);

/**
 * Verifica se usuário é dono do recurso
 */
export function requireOwnershipMiddleware(
  getResourceOwnerId: (req: NextApiRequest) => Promise<string>
) {
  return async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Usuário não autenticado');
      }

      const ownerId = await getResourceOwnerId(req);

      if (req.user.roles?.map(r => r.toUpperCase()).includes('ADMIN')) {
        return next();
      }

      if (req.user.uid !== ownerId) {
        throw new AuthorizationError('Sem permissão para acessar este recurso');
      }

      next();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return res.status(401).json({
          success: false,
          error: { code: error.code, message: error.message },
        });
      }

      if (error instanceof AuthorizationError) {
        return res.status(403).json({
          success: false,
          error: { code: error.code, message: error.message },
        });
      }

      throw error;
    }
  };
}
