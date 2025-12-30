/**
 * API Route: Webhook Mercado Pago
 *
 * POST /api/billing/webhook
 * Recebe notificacoes do Mercado Pago.
 *
 * @version 1.0.0
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { upsertSubscription, recordPayment } from '@/api/services/billing.service';
import { logger } from '@/api/utils/logger';
import type { PlanId, MercadoPagoWebhook } from '@/api/types/billing.types';

export const config = {
  api: {
    bodyParser: true,
  },
};

/**
 * Obtem cliente Mercado Pago
 */
function getMPClient(): MercadoPagoConfig | null {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return null;
  }
  return new MercadoPagoConfig({ accessToken });
}

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
    const webhook = req.body as MercadoPagoWebhook;

    logger.info('Webhook recebido', {
      type: webhook.type,
      action: webhook.action,
      dataId: webhook.data?.id,
    });

    const client = getMPClient();
    if (!client) {
      logger.error('MERCADOPAGO_ACCESS_TOKEN nao configurado');
      return res.status(500).json({ error: 'Configuracao invalida' });
    }

    // Processa por tipo de webhook
    switch (webhook.type) {
      case 'payment':
        await handlePaymentWebhook(client, webhook.data.id);
        break;

      case 'subscription_preapproval':
        await handleSubscriptionWebhook(webhook.data.id);
        break;

      default:
        logger.info('Tipo de webhook nao processado', { type: webhook.type });
    }

    // Responde 200 para confirmar recebimento
    res.status(200).json({ received: true });
  } catch (error) {
    logger.error('Erro ao processar webhook', { error });
    // Ainda retorna 200 para evitar retries infinitos
    res.status(200).json({ received: true, error: 'Erro interno' });
  }
}

/**
 * Processa webhook de pagamento
 */
async function handlePaymentWebhook(client: MercadoPagoConfig, paymentId: string): Promise<void> {
  try {
    const paymentApi = new Payment(client);
    const data = await paymentApi.get({ id: paymentId });

    logger.info('Pagamento recebido', {
      paymentId,
      status: data.status,
      amount: data.transaction_amount,
    });

    // Extrai referencia externa
    let externalReference: {
      organizationId: string;
      userId: string;
      planId: PlanId;
    } | null = null;

    try {
      externalReference = JSON.parse(data.external_reference || '{}');
    } catch {
      logger.warn('Referencia externa invalida', { external_reference: data.external_reference });
    }

    if (!externalReference?.organizationId) {
      logger.warn('OrganizationId nao encontrado no pagamento');
      return;
    }

    const amount = data.transaction_amount || 0;

    // Se pagamento aprovado, ativa subscription
    if (data.status === 'approved') {
      await upsertSubscription(
        externalReference.organizationId,
        externalReference.planId,
        paymentId,
        'active'
      );

      await recordPayment(
        `sub_${externalReference.organizationId}`,
        externalReference.organizationId,
        amount,
        paymentId,
        'paid'
      );

      logger.info('Subscription ativada via pagamento', {
        organizationId: externalReference.organizationId,
        planId: externalReference.planId,
      });
    } else if (data.status === 'pending') {
      await recordPayment(
        `sub_${externalReference.organizationId}`,
        externalReference.organizationId,
        amount,
        paymentId,
        'pending'
      );
    } else if (data.status === 'rejected' || data.status === 'cancelled') {
      await recordPayment(
        `sub_${externalReference.organizationId}`,
        externalReference.organizationId,
        amount,
        paymentId,
        'failed'
      );
    }
  } catch (error) {
    logger.error('Erro ao processar pagamento', { paymentId, error });
    throw error;
  }
}

/**
 * Processa webhook de subscription
 */
async function handleSubscriptionWebhook(subscriptionId: string): Promise<void> {
  // TODO: Implementar processamento de subscription recorrente
  // Por enquanto apenas loga o evento
  logger.info('Subscription webhook recebido (nao implementado)', {
    subscriptionId,
  });
}
