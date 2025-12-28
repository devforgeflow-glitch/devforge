/**
 * Classes de Erro Customizadas
 *
 * Hierarquia de erros para tratamento consistente.
 *
 * @version 1.0.0
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { logger } from './logger';

/**
 * Erro base da aplicação
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Erro de validação (400)
 */
export class ValidationError extends AppError {
  public readonly details?: Array<{ field: string; message: string; code?: string }>;

  constructor(
    message: string = 'Dados inválidos',
    details?: Array<{ field: string; message: string; code?: string }>
  ) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

/**
 * Erro de autenticação (401)
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Não autenticado') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

/**
 * Erro de autorização (403)
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Acesso negado') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

/**
 * Erro de recurso não encontrado (404)
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Recurso') {
    super(`${resource} não encontrado`, 404, 'NOT_FOUND');
  }
}

/**
 * Erro de conflito (409)
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Conflito de dados') {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

/**
 * Erro de quota excedida / rate limit (429)
 */
export class QuotaExceededError extends AppError {
  constructor(message: string = 'Limite de requisições excedido') {
    super(message, 429, 'QUOTA_EXCEEDED');
  }
}

/**
 * Erro de serviço indisponível (503)
 */
export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Serviço temporariamente indisponível') {
    super(message, 503, 'SERVICE_UNAVAILABLE');
  }
}

/**
 * Gera ID único para erro (para rastreamento)
 */
function generateErrorId(): string {
  return `err-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Handler centralizado de erros para API Routes
 */
export function handleApiError(
  error: unknown,
  req: NextApiRequest,
  res: NextApiResponse
): void {
  // Se já foi respondido, não fazer nada
  if (res.writableEnded) return;

  // Erro operacional conhecido
  if (error instanceof AppError && error.isOperational) {
    const response: Record<string, unknown> = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    };

    // Adicionar details se for ValidationError
    if (error instanceof ValidationError && error.details) {
      response.error = {
        ...response.error as object,
        details: error.details,
      };
    }

    res.status(error.statusCode).json(response);
    return;
  }

  // Erro não operacional (bug) - não expor detalhes
  const errorId = generateErrorId();

  logger.error('Erro não tratado', {
    errorId,
    error: error instanceof Error ? error.message : 'Erro desconhecido',
    stack: error instanceof Error ? error.stack : undefined,
    url: req.url,
    method: req.method,
    userId: req.user?.uid,
  });

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Erro interno do servidor',
      errorId,
    },
  });
}

/**
 * Wrapper para handlers de API com tratamento de erro
 */
export function withErrorHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
      await handler(req, res);
    } catch (error) {
      handleApiError(error, req, res);
    }
  };
}
