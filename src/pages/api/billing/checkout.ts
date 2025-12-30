/**
 * API Route: Criar Checkout
 *
 * POST /api/billing/checkout
 * Cria sessao de checkout no Mercado Pago.
 *
 * @version 1.0.0
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { runMiddleware } from '@/api/middleware';
import { authMiddleware } from '@/api/middleware/auth';
import { validatorMiddleware } from '@/api/middleware/validator';
import { rateLimitMiddleware } from '@/api/middleware/rateLimit';
import { createCheckout, getPlan } from '@/api/services/billing.service';
import { handleApiError } from '@/api/utils/errors';

/**
 * Schema de validacao
 */
const checkoutSchema = z.object({
  body: z.object({
    planId: z.enum(['starter', 'professional', 'enterprise']),
    successUrl: z.string().url().optional(),
    cancelUrl: z.string().url().optional(),
  }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Metodo nao permitido' },
    });
  }

  try {
    // Middlewares
    await runMiddleware(req, res, [
      authMiddleware,
      rateLimitMiddleware({ windowMs: 60000, max: 5 }),
      validatorMiddleware(checkoutSchema),
    ]);

    const { planId, successUrl, cancelUrl } = req.body;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Valida plano
    const plan = getPlan(planId);

    // Cria checkout
    const result = await createCheckout({
      planId,
      organizationId: req.user!.uid,
      userId: req.user!.uid,
      userEmail: req.user!.email || '',
      successUrl: successUrl || `${baseUrl}/app/settings?billing=success`,
      cancelUrl: cancelUrl || `${baseUrl}/app/settings?billing=canceled`,
    });

    res.status(200).json({
      success: true,
      data: {
        checkoutUrl: result.checkoutUrl,
        preferenceId: result.preferenceId,
        plan: {
          id: plan.id,
          name: plan.name,
          price: plan.price,
        },
      },
    });
  } catch (error) {
    handleApiError(error, req, res);
  }
}
