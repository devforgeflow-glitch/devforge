/**
 * Middleware de Validação com Zod
 *
 * @version 1.0.0
 */

import { z, ZodError, ZodIssue } from 'zod';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ValidationError } from '@/api/utils/errors';

interface ValidationErrorDetail {
  field: string;
  message: string;
  code?: string;
}

/**
 * Middleware de validação com Zod
 */
export function validatorMiddleware<T = unknown>(
  schema: z.ZodSchema<T>,
  source: 'body' | 'query' | 'both' = 'body'
) {
  return async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void
  ): Promise<void> => {
    try {
      let dataToValidate: Record<string, unknown> = {};

      switch (source) {
        case 'body':
          dataToValidate = (req.body as Record<string, unknown>) || {};
          break;
        case 'query':
          dataToValidate = (req.query as Record<string, unknown>) || {};
          break;
        case 'both':
          dataToValidate = {
            ...((req.body as Record<string, unknown>) || {}),
            ...((req.query as Record<string, unknown>) || {}),
          };
          break;
      }

      const validated = schema.parse(dataToValidate);

      if (source === 'body' || source === 'both') {
        req.body = validated;
      }

      if (source === 'query' || source === 'both') {
        req.query = validated as { [key: string]: string | string[] };
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details: ValidationErrorDetail[] = error.issues.map((issue: ZodIssue) => ({
          field: issue.path.join('.') || 'root',
          message: issue.message,
          code: issue.code,
        }));

        const validationError = new ValidationError(
          'Dados inválidos. Verifique os campos e tente novamente.',
          details
        );

        res.status(400).json({
          success: false,
          error: {
            code: validationError.code,
            message: validationError.message,
            details: validationError.details,
          },
        });
        return;
      }

      throw error;
    }
  };
}

export function validateBody<T = unknown>(schema: z.ZodSchema<T>) {
  return validatorMiddleware(schema, 'body');
}

export function validateQuery<T = unknown>(schema: z.ZodSchema<T>) {
  return validatorMiddleware(schema, 'query');
}

export function validateBoth<T = unknown>(schema: z.ZodSchema<T>) {
  return validatorMiddleware(schema, 'both');
}

export function validateSync<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const details: ValidationErrorDetail[] = error.issues.map((issue: ZodIssue) => ({
        field: issue.path.join('.') || 'root',
        message: issue.message,
        code: issue.code,
      }));

      throw new ValidationError('Dados inválidos', details);
    }

    throw error;
  }
}
