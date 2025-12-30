/**
 * API Route: Historico de Pagamentos
 *
 * GET /api/billing/payments
 * Lista pagamentos do usuario.
 *
 * @version 1.0.0
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { runMiddleware } from '@/api/middleware';
import { authMiddleware } from '@/api/middleware/auth';
import { validatorMiddleware } from '@/api/middleware/validator';
import { listPayments } from '@/api/services/billing.service';
import { handleApiError } from '@/api/utils/errors';

/**
 * Schema de validacao
 */
const querySchema = z.object({
  query: z.object({
    limit: z.coerce.number().positive().max(100).optional().default(20),
  }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      success: false,
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Metodo nao permitido' },
    });
  }

  try {
    await runMiddleware(req, res, [
      authMiddleware,
      validatorMiddleware(querySchema),
    ]);

    const { limit } = req.query;
    const organizationId = req.user!.uid;

    const payments = await listPayments(organizationId, Number(limit) || 20);

    res.status(200).json({
      success: true,
      data: payments,
      meta: {
        count: payments.length,
        limit: Number(limit) || 20,
      },
    });
  } catch (error) {
    handleApiError(error, req, res);
  }
}
