/**
 * Tipos de Billing
 *
 * Define interfaces para pagamentos e subscricoes.
 *
 * @version 1.0.0
 */

/**
 * Planos disponiveis
 */
export type PlanId = 'free' | 'starter' | 'professional' | 'enterprise';

/**
 * Status da subscription
 */
export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'trialing'
  | 'paused'
  | 'pending';

/**
 * Configuracao de um plano
 */
export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  price: number;
  currency: 'BRL';
  interval: 'month' | 'year';
  features: string[];
  limits: {
    surveys: number;
    responses: number;
    users: number;
    aiQueries: number;
    storage: number; // MB
  };
  popular?: boolean;
}

/**
 * Subscription do usuario/organizacao
 */
export interface Subscription {
  id: string;
  organizationId: string;
  planId: PlanId;
  status: SubscriptionStatus;
  priceId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  externalId?: string; // ID no Mercado Pago
  paymentMethod?: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Metodo de pagamento
 */
export interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'pix' | 'boleto';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

/**
 * Historico de pagamento
 */
export interface Payment {
  id: string;
  subscriptionId: string;
  organizationId: string;
  amount: number;
  currency: 'BRL';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  externalId?: string;
  paymentMethod?: PaymentMethod;
  invoiceUrl?: string;
  paidAt?: Date;
  createdAt: Date;
}

/**
 * Input para criar checkout
 */
export interface CreateCheckoutInput {
  planId: PlanId;
  organizationId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Resultado do checkout
 */
export interface CheckoutResult {
  checkoutUrl: string;
  preferenceId: string;
}

/**
 * Webhook do Mercado Pago
 */
export interface MercadoPagoWebhook {
  id: string;
  action: string;
  api_version: string;
  data: {
    id: string;
  };
  date_created: string;
  live_mode: boolean;
  type: 'payment' | 'subscription_preapproval' | 'subscription_preapproval_plan';
  user_id: string;
}

/**
 * Uso atual do usuario
 */
export interface Usage {
  organizationId: string;
  period: {
    start: Date;
    end: Date;
  };
  surveys: {
    used: number;
    limit: number;
  };
  responses: {
    used: number;
    limit: number;
  };
  aiQueries: {
    used: number;
    limit: number;
  };
  storage: {
    used: number; // MB
    limit: number; // MB
  };
}
