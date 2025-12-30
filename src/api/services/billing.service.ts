/**
 * Service de Billing
 *
 * Gerencia subscricoes e pagamentos com Mercado Pago.
 *
 * @version 1.0.0
 */

import { MercadoPagoConfig, Preference, Payment as MPPayment } from 'mercadopago';
import { getFirestore, getFieldValue } from '@/api/lib/firebase/admin';
import { logger } from '@/api/utils/logger';
import { ValidationError, NotFoundError } from '@/api/utils/errors';
import type {
  Plan,
  PlanId,
  Subscription,
  Payment,
  CreateCheckoutInput,
  CheckoutResult,
  Usage,
  SubscriptionStatus,
} from '@/api/types/billing.types';

const SUBSCRIPTIONS_COLLECTION = 'subscriptions';
const PAYMENTS_COLLECTION = 'payments';

/**
 * Cliente Mercado Pago configurado
 */
let mpClient: MercadoPagoConfig | null = null;

function getMPClient(): MercadoPagoConfig | null {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!accessToken) {
    return null;
  }

  if (!mpClient) {
    mpClient = new MercadoPagoConfig({
      accessToken,
    });
  }

  return mpClient;
}

/**
 * Planos disponiveis
 */
export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: 'free',
    name: 'Gratuito',
    description: 'Para comecar a explorar',
    price: 0,
    currency: 'BRL',
    interval: 'month',
    features: [
      'Ate 3 pesquisas',
      '100 respostas/mes',
      'Relatorios basicos',
      'Suporte por email',
    ],
    limits: {
      surveys: 3,
      responses: 100,
      users: 1,
      aiQueries: 10,
      storage: 100,
    },
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'Para pequenas equipes',
    price: 49.9,
    currency: 'BRL',
    interval: 'month',
    features: [
      'Ate 10 pesquisas',
      '1.000 respostas/mes',
      'Relatorios avancados',
      'Integracao webhooks',
      'Suporte prioritario',
    ],
    limits: {
      surveys: 10,
      responses: 1000,
      users: 3,
      aiQueries: 100,
      storage: 500,
    },
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Para empresas em crescimento',
    price: 149.9,
    currency: 'BRL',
    interval: 'month',
    popular: true,
    features: [
      'Pesquisas ilimitadas',
      '10.000 respostas/mes',
      'Analytics com IA',
      'API completa',
      'White-label basico',
      'Suporte 24/7',
    ],
    limits: {
      surveys: -1, // ilimitado
      responses: 10000,
      users: 10,
      aiQueries: 500,
      storage: 2000,
    },
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Para grandes organizacoes',
    price: 499.9,
    currency: 'BRL',
    interval: 'month',
    features: [
      'Tudo do Professional',
      'Respostas ilimitadas',
      'SSO/SAML',
      'SLA garantido',
      'Gerente de conta dedicado',
      'Implantacao personalizada',
    ],
    limits: {
      surveys: -1,
      responses: -1,
      users: -1,
      aiQueries: -1,
      storage: -1,
    },
  },
};


/**
 * Obtem plano por ID
 */
export function getPlan(planId: PlanId): Plan {
  const plan = PLANS[planId];
  if (!plan) {
    throw new NotFoundError(`Plano ${planId} nao encontrado`);
  }
  return plan;
}

/**
 * Lista todos os planos
 */
export function listPlans(): Plan[] {
  return Object.values(PLANS);
}

/**
 * Cria sessao de checkout no Mercado Pago
 */
export async function createCheckout(input: CreateCheckoutInput): Promise<CheckoutResult> {
  const client = getMPClient();
  if (!client) {
    throw new ValidationError('Sistema de pagamentos nao configurado. Configure MERCADOPAGO_ACCESS_TOKEN.');
  }

  const plan = getPlan(input.planId);

  if (plan.price === 0) {
    throw new ValidationError('Plano gratuito nao requer checkout');
  }

  try {
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [
          {
            id: `plan_${plan.id}`,
            title: `DevForge ${plan.name}`,
            description: plan.description,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: plan.price,
          },
        ],
        payer: {
          email: input.userEmail,
        },
        back_urls: {
          success: input.successUrl,
          failure: input.cancelUrl,
          pending: input.successUrl,
        },
        auto_return: 'approved',
        external_reference: JSON.stringify({
          organizationId: input.organizationId,
          userId: input.userId,
          planId: input.planId,
        }),
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/billing/webhook`,
        statement_descriptor: 'DEVFORGE',
      },
    });

    logger.info('Checkout criado', {
      preferenceId: result.id,
      planId: input.planId,
      organizationId: input.organizationId,
    });

    return {
      checkoutUrl: result.init_point || '',
      preferenceId: result.id || '',
    };
  } catch (error) {
    logger.error('Erro ao criar checkout', { error });
    throw new ValidationError('Erro ao criar sessao de pagamento');
  }
}

/**
 * Busca subscription por organizacao
 */
export async function getSubscriptionByOrganization(
  organizationId: string
): Promise<Subscription | null> {
  const db = getFirestore();
  const snapshot = await db
    .collection(SUBSCRIPTIONS_COLLECTION)
    .where('organizationId', '==', organizationId)
    .where('status', 'in', ['active', 'trialing', 'past_due'])
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  } as Subscription;
}

/**
 * Cria ou atualiza subscription
 */
export async function upsertSubscription(
  organizationId: string,
  planId: PlanId,
  externalId?: string,
  status: SubscriptionStatus = 'active'
): Promise<Subscription> {
  const db = getFirestore();
  const FieldValue = getFieldValue();

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  // Verifica se ja existe subscription
  const existing = await getSubscriptionByOrganization(organizationId);

  const subscriptionData = {
    organizationId,
    planId,
    status,
    priceId: `price_${planId}`,
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
    cancelAtPeriodEnd: false,
    externalId,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (existing) {
    // Atualiza existente
    await db.collection(SUBSCRIPTIONS_COLLECTION).doc(existing.id).update(subscriptionData);

    logger.info('Subscription atualizada', {
      subscriptionId: existing.id,
      planId,
      organizationId,
    });

    return {
      ...existing,
      ...subscriptionData,
      updatedAt: now,
    } as Subscription;
  }

  // Cria nova
  const newSubscription = {
    ...subscriptionData,
    createdAt: FieldValue.serverTimestamp(),
  };

  const docRef = await db.collection(SUBSCRIPTIONS_COLLECTION).add(newSubscription);

  logger.info('Subscription criada', {
    subscriptionId: docRef.id,
    planId,
    organizationId,
  });

  return {
    id: docRef.id,
    ...subscriptionData,
    createdAt: now,
    updatedAt: now,
  } as Subscription;
}

/**
 * Cancela subscription
 */
export async function cancelSubscription(
  organizationId: string,
  immediately: boolean = false
): Promise<void> {
  const subscription = await getSubscriptionByOrganization(organizationId);

  if (!subscription) {
    throw new NotFoundError('Subscription nao encontrada');
  }

  const db = getFirestore();
  const FieldValue = getFieldValue();

  if (immediately) {
    // Cancela imediatamente e move para plano free
    await db.collection(SUBSCRIPTIONS_COLLECTION).doc(subscription.id).update({
      status: 'canceled',
      planId: 'free',
      updatedAt: FieldValue.serverTimestamp(),
    });
  } else {
    // Cancela no fim do periodo
    await db.collection(SUBSCRIPTIONS_COLLECTION).doc(subscription.id).update({
      cancelAtPeriodEnd: true,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  logger.info('Subscription cancelada', {
    subscriptionId: subscription.id,
    organizationId,
    immediately,
  });
}

/**
 * Registra pagamento
 */
export async function recordPayment(
  subscriptionId: string,
  organizationId: string,
  amount: number,
  externalId?: string,
  status: Payment['status'] = 'paid'
): Promise<Payment> {
  const db = getFirestore();
  const FieldValue = getFieldValue();

  const paymentData = {
    subscriptionId,
    organizationId,
    amount,
    currency: 'BRL' as const,
    status,
    externalId,
    paidAt: status === 'paid' ? new Date() : undefined,
    createdAt: FieldValue.serverTimestamp(),
  };

  const docRef = await db.collection(PAYMENTS_COLLECTION).add(paymentData);

  logger.info('Pagamento registrado', {
    paymentId: docRef.id,
    amount,
    status,
    organizationId,
  });

  return {
    id: docRef.id,
    ...paymentData,
    createdAt: new Date(),
  } as Payment;
}

/**
 * Lista pagamentos de uma organizacao
 */
export async function listPayments(
  organizationId: string,
  limit: number = 20
): Promise<Payment[]> {
  const db = getFirestore();
  const snapshot = await db
    .collection(PAYMENTS_COLLECTION)
    .where('organizationId', '==', organizationId)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Payment[];
}

/**
 * Obtem uso atual da organizacao
 */
export async function getUsage(organizationId: string): Promise<Usage> {
  const subscription = await getSubscriptionByOrganization(organizationId);
  const plan = getPlan(subscription?.planId || 'free');

  const db = getFirestore();

  // Conta pesquisas
  const surveysSnapshot = await db
    .collection('surveys')
    .where('organizationId', '==', organizationId)
    .count()
    .get();

  // Conta respostas do periodo atual
  const periodStart = subscription?.currentPeriodStart || new Date();
  const responsesSnapshot = await db
    .collection('responses')
    .where('organizationId', '==', organizationId)
    .where('createdAt', '>=', periodStart)
    .count()
    .get();

  return {
    organizationId,
    period: {
      start: periodStart,
      end: subscription?.currentPeriodEnd || new Date(),
    },
    surveys: {
      used: surveysSnapshot.data().count,
      limit: plan.limits.surveys,
    },
    responses: {
      used: responsesSnapshot.data().count,
      limit: plan.limits.responses,
    },
    aiQueries: {
      used: 0, // TODO: implementar contagem
      limit: plan.limits.aiQueries,
    },
    storage: {
      used: 0, // TODO: implementar contagem
      limit: plan.limits.storage,
    },
  };
}

/**
 * Verifica se organizacao pode criar mais pesquisas
 */
export async function canCreateSurvey(organizationId: string): Promise<boolean> {
  const usage = await getUsage(organizationId);

  // -1 significa ilimitado
  if (usage.surveys.limit === -1) {
    return true;
  }

  return usage.surveys.used < usage.surveys.limit;
}

/**
 * Verifica se pesquisa pode receber mais respostas
 */
export async function canReceiveResponse(organizationId: string): Promise<boolean> {
  const usage = await getUsage(organizationId);

  if (usage.responses.limit === -1) {
    return true;
  }

  return usage.responses.used < usage.responses.limit;
}
