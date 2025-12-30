/**
 * Schema de validacao para mensagens de contato
 *
 * Define os schemas Zod para validacao de:
 * - Envio de mensagem de contato (publico)
 * - Atualizacao de status (admin)
 * - Filtros de listagem (admin)
 *
 * @module schemas/contact
 * @version 1.0.0
 */

import { z } from 'zod';

// ============================================================================
// CONSTANTES
// ============================================================================

/**
 * Status possiveis de uma mensagem de contato
 */
export const CONTACT_STATUS = ['novo', 'em_andamento', 'resolvido'] as const;
export type ContactStatus = (typeof CONTACT_STATUS)[number];

/**
 * Assuntos/categorias predefinidos para mensagens
 */
export const CONTACT_SUBJECTS = [
  'duvida',
  'orcamento',
  'sugestao',
  'parceria',
  'suporte',
  'reclamacao',
  'outro',
] as const;
export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

/**
 * Labels para exibicao dos assuntos
 */
export const CONTACT_SUBJECT_LABELS: Record<ContactSubject, string> = {
  duvida: 'Duvida',
  orcamento: 'Solicitar Orcamento',
  sugestao: 'Sugestao',
  parceria: 'Parceria Comercial',
  suporte: 'Suporte Tecnico',
  reclamacao: 'Reclamacao',
  outro: 'Outro Assunto',
};

/**
 * Labels para exibicao dos status
 */
export const CONTACT_STATUS_LABELS: Record<ContactStatus, string> = {
  novo: 'Novo',
  em_andamento: 'Em Andamento',
  resolvido: 'Resolvido',
};

// ============================================================================
// SCHEMAS DE VALIDACAO
// ============================================================================

/**
 * Schema para envio de mensagem de contato (publico)
 */
export const sendContactMessageSchema = z.object({
  nome: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no maximo 100 caracteres')
    .trim(),
  email: z.string().email('Email invalido').max(255, 'Email muito longo').trim().toLowerCase(),
  telefone: z
    .string()
    .regex(/^(\+55\s?)?\(?\d{2}\)?[\s.-]?\d{4,5}[\s.-]?\d{4}$/, 'Telefone invalido')
    .optional()
    .or(z.literal('')),
  empresa: z
    .string()
    .max(200, 'Nome da empresa muito longo')
    .optional()
    .or(z.literal('')),
  assunto: z.enum(CONTACT_SUBJECTS, {
    message: 'Selecione um assunto valido',
  }),
  mensagem: z
    .string()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(5000, 'Mensagem deve ter no maximo 5000 caracteres')
    .trim(),
});

export type SendContactMessageInput = z.infer<typeof sendContactMessageSchema>;

/**
 * Schema para atualizacao de status de mensagem (admin)
 */
export const updateContactStatusSchema = z.object({
  status: z.enum(CONTACT_STATUS, {
    message: 'Status invalido',
  }),
  notaInterna: z
    .string()
    .max(2000, 'Nota interna deve ter no maximo 2000 caracteres')
    .trim()
    .optional(),
});

export type UpdateContactStatusInput = z.infer<typeof updateContactStatusSchema>;

/**
 * Schema para filtros de listagem (admin)
 */
export const listContactMessagesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(CONTACT_STATUS).optional(),
  assunto: z.enum(CONTACT_SUBJECTS).optional(),
  search: z.string().max(100).trim().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListContactMessagesInput = z.infer<typeof listContactMessagesSchema>;

/**
 * Schema para resposta de mensagem (admin)
 */
export const replyContactMessageSchema = z.object({
  resposta: z
    .string()
    .min(10, 'Resposta deve ter pelo menos 10 caracteres')
    .max(5000, 'Resposta deve ter no maximo 5000 caracteres')
    .trim(),
  marcarComoResolvido: z.boolean().default(false),
});

export type ReplyContactMessageInput = z.infer<typeof replyContactMessageSchema>;

// ============================================================================
// TIPOS DE DOCUMENTOS
// ============================================================================

/**
 * Estrutura de uma mensagem de contato no Firestore
 */
export interface ContactMessage {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  assunto: ContactSubject;
  mensagem: string;
  status: ContactStatus;
  notaInterna?: string;
  respostas: ContactReply[];
  createdAt: string;
  updatedAt: string;
  resolvidoAt?: string;
  resolvidoPor?: string;
  ip?: string;
  userAgent?: string;
}

/**
 * Estrutura de uma resposta a mensagem de contato
 */
export interface ContactReply {
  id: string;
  resposta: string;
  enviadoPor: string;
  enviadoEm: string;
  emailEnviado: boolean;
}

/**
 * Estatisticas de mensagens de contato
 */
export interface ContactStats {
  total: number;
  novo: number;
  em_andamento: number;
  resolvido: number;
  ultimaSemana: number;
  tempoMedioResposta?: number;
}
