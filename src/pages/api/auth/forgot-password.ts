/**
 * API Route: POST /api/auth/forgot-password
 *
 * Envia email de recuperacao de senha.
 *
 * @version 1.0.0
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { emailService } from '@/api/services/email.service';
import { handleApiError } from '@/api/utils/errors';
import { logger } from '@/api/utils/logger';

interface ForgotPasswordRequest {
  email: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Metodo nao permitido',
      },
    });
  }

  try {
    const { email } = req.body as ForgotPasswordRequest;

    // Validar email
    if (!email) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email e obrigatorio',
        },
      });
    }

    if (!emailService.validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email invalido',
        },
      });
    }

    logger.info('Solicitacao de recuperacao de senha', {
      service: 'ForgotPasswordAPI',
      email: email.substring(0, 3) + '***', // Mascarar email no log
    });

    // Gerar token de reset (em producao, usar JWT ou token seguro)
    const resetToken = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetLink = `${appUrl}/auth/reset-password?token=${resetToken}`;

    // Enviar email
    const result = await emailService.sendPasswordResetEmail(email, {
      resetLink,
      expiresIn: '1 hora',
    });

    if (!result.success) {
      logger.warn('Falha ao enviar email de recuperacao', {
        service: 'ForgotPasswordAPI',
        error: result.error?.message,
      });

      // Nao revelar se o email existe ou nao (seguranca)
      return res.status(200).json({
        success: true,
        message: 'Se o email existir, voce recebera as instrucoes de recuperacao.',
      });
    }

    logger.info('Email de recuperacao enviado com sucesso', {
      service: 'ForgotPasswordAPI',
    });

    return res.status(200).json({
      success: true,
      message: 'Se o email existir, voce recebera as instrucoes de recuperacao.',
    });
  } catch (error) {
    handleApiError(error, req, res);
  }
}
