/**
 * API Route: Listar Planos
 *
 * GET /api/billing/plans
 * Lista todos os planos disponiveis.
 *
 * @version 1.0.0
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { listPlans } from '@/api/services/billing.service';

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

  const plans = listPlans();

  res.status(200).json({
    success: true,
    data: plans,
  });
}
