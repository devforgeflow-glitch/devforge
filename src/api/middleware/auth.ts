/**
 * Middleware de Autenticação
 *
 * Suporta JWT customizado e Firebase Authentication.
 *
 * @version 1.0.0
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from '@/api/utils/errors';
import { getAuth, getFirestore } from '@/api/lib/firebase/admin';
import { logger } from '@/api/utils/logger';

export interface AuthenticatedUser {
  uid: string;
  email: string | undefined;
  roles: string[];
  emailVerified: boolean;
}

declare module 'next' {
  interface NextApiRequest {
    user?: AuthenticatedUser;
  }
}

interface CustomJWTPayload {
  uid: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
  iss: string;
  sub: string;
}

/**
 * Busca roles do usuário no Firestore
 */
async function getUserRoles(uid: string): Promise<string[]> {
  try {
    const db = getFirestore();
    const permDoc = await db.collection('permissions').doc(uid).get();

    if (permDoc.exists) {
      const permData = permDoc.data();
      const role = permData?.role;
      if (role) {
        return Array.isArray(role) ? role : [role];
      }
    }

    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      if (userData?.roles) return userData.roles;
      if (userData?.role) {
        return Array.isArray(userData.role) ? userData.role : [userData.role];
      }
    }

    return ['USER'];
  } catch (error) {
    logger.error('Erro ao buscar roles:', error);
    return ['USER'];
  }
}

/**
 * Detecta se é JWT customizado
 */
function isCustomJWT(token: string): boolean {
  try {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded?.payload || typeof decoded.payload === 'string') return false;
    return decoded.payload.iss === 'devforge-api';
  } catch {
    return false;
  }
}

/**
 * Valida JWT customizado
 */
async function validateCustomJWT(token: string): Promise<AuthenticatedUser> {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AuthenticationError('Configuração JWT inválida');

  try {
    const decoded = jwt.verify(token, secret) as CustomJWTPayload;
    if (!decoded.uid || !decoded.email) {
      throw new AuthenticationError('Token malformado');
    }

    const roles = await getUserRoles(decoded.uid);

    return {
      uid: decoded.uid,
      email: decoded.email,
      roles,
      emailVerified: true,
    };
  } catch (jwtError) {
    if (jwtError instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Token expirado');
    }
    if (jwtError instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Token inválido');
    }
    throw jwtError;
  }
}

/**
 * Valida token Firebase
 */
async function validateFirebaseToken(token: string): Promise<AuthenticatedUser> {
  try {
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(token);

    if (!decodedToken || !decodedToken.uid) {
      throw new AuthenticationError('Token inválido');
    }

    const roles = await getUserRoles(decodedToken.uid);

    return {
      uid: decodedToken.uid,
      email: decodedToken.email ?? undefined,
      roles,
      emailVerified: decodedToken.email_verified === true,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        throw new AuthenticationError('Token expirado');
      }
      if (error.message.includes('invalid')) {
        throw new AuthenticationError('Token inválido');
      }
    }
    throw error;
  }
}

/**
 * Middleware de autenticação
 */
export async function authMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Token não fornecido');
    }

    const token = authHeader.substring(7);
    let user: AuthenticatedUser;

    if (isCustomJWT(token)) {
      user = await validateCustomJWT(token);
    } else {
      user = await validateFirebaseToken(token);
    }

    // Verificar bloqueio
    try {
      const db = getFirestore();
      const userDoc = await db.collection('users').doc(user.uid).get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData?.isBlocked === true) {
          throw new AuthenticationError('Conta bloqueada. Contate o suporte.');
        }
      }
    } catch (error) {
      if (error instanceof AuthenticationError) throw error;
      logger.warn('Erro ao verificar bloqueio:', { userId: user.uid, error });
    }

    req.user = user;
    next();
  } catch (error) {
    const authError = error instanceof AuthenticationError
      ? error
      : new AuthenticationError('Falha na autenticação');

    res.status(401).json({
      success: false,
      error: {
        code: authError.code,
        message: authError.message,
      },
    });
  }
}

/**
 * Middleware de autenticação opcional
 */
export async function optionalAuthMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  try {
    const token = authHeader.substring(7);
    let user: AuthenticatedUser;

    if (isCustomJWT(token)) {
      user = await validateCustomJWT(token);
    } else {
      user = await validateFirebaseToken(token);
    }

    req.user = user;
  } catch (error) {
    logger.debug('Falha na autenticação opcional, continuando sem user');
  }

  next();
}
