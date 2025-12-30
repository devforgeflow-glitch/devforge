/**
 * API Route: Subscription
 *
 * GET /api/billing/subscription - Obtem subscription atual
 * DELETE /api/billing/subscription - Cancela subscription
 *
 * @version 1.0.0
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { runMiddleware } from '@/api/middleware';
import { authMiddleware } from '@/api/middleware/auth';
import {
  getSubscriptionByOrganization,
  cancelSubscription,
  getUsage,
  getPlan,
} from '@/api/services/billing.service';
import { handleApiError } from '@/api/utils/errors';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    // Requer autenticacao
    await runMiddleware(req, res, [authMiddleware]);

    switch (req.method) {
      case 'GET':
        return await handleGet(req, res);
      case 'DELETE':
        return await handleCancel(req, res);
      default:
        res.setHeader('Allow', ['GET', 'DELETE']);
        res.status(405).json({
          success: false,
          error: { code: 'METHOD_NOT_ALLOWED', message: 'Metodo nao permitido' },
        });
    }
  } catch (error) {
    handleApiError(error, req, res);
  }
}

/**
 * GET - Obtem subscription e uso atual
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const organizationId = req.user!.uid;

  const subscription = await getSubscriptionByOrganization(organizationId);
  const usage = await getUsage(organizationId);
  const plan = getPlan(subscription?.planId || 'free');

  res.status(200).json({
    success: true,
    data: {
      subscription: subscription
        ? {
            id: subscription.id,
            planId: subscription.planId,
            status: subscription.status,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          }
        : null,
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        features: plan.features,
        limits: plan.limits,
      },
      usage,
    },
  });
}

/**
 * DELETE - Cancela subscription
 */
async function handleCancel(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const organizationId = req.user!.uid;
  const { immediately } = req.query;

  await cancelSubscription(organizationId, immediately === 'true');

  res.status(200).json({
    success: true,
    message: immediately === 'true'
      ? 'Subscription cancelada imediatamente'
      : 'Subscription sera cancelada ao fim do periodo atual',
  });
}
