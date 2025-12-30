/**
 * Schema de validacao para depoimentos
 *
 * Define os schemas Zod para validacao de:
 * - Envio de depoimento (usuario)
 * - Moderacao de depoimentos (admin)
 * - Listagem e filtros
 *
 * @module schemas/testimonial
 * @version 1.0.0
 */

import { z } from 'zod';

// ============================================================================
// CONSTANTES
// ============================================================================

/**
 * Status possiveis de um depoimento
 */
export const TESTIMONIAL_STATUS = ['aguardando', 'approved', 'rejected'] as const;
export type TestimonialStatus = (typeof TESTIMONIAL_STATUS)[number];

/**
 * Labels para exibicao dos status
 */
export const TESTIMONIAL_STATUS_LABELS: Record<TestimonialStatus, string> = {
  aguardando: 'Aguardando Aprovacao',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
};

// ============================================================================
// SCHEMAS DE VALIDACAO
// ============================================================================

/**
 * Schema para envio de depoimento (usuario)
 */
export const createTestimonialSchema = z.object({
  text: z
    .string()
    .trim()
    .min(50, 'Depoimento deve ter no minimo 50 caracteres. Conte um pouco mais sobre sua experiencia!')
    .max(1000, 'Depoimento deve ter no maximo 1000 caracteres'),
  rating: z
    .number()
    .int('Avaliacao deve ser um numero inteiro')
    .min(1, 'Avaliacao minima e 1 estrela')
    .max(5, 'Avaliacao maxima e 5 estrelas'),
  authorName: z
    .string()
    .trim()
    .min(2, 'Nome deve ter no minimo 2 caracteres')
    .max(100, 'Nome muito longo')
    .optional(),
  authorCompany: z
    .string()
    .trim()
    .max(100, 'Nome da empresa muito longo')
    .optional(),
  authorRole: z
    .string()
    .trim()
    .max(100, 'Cargo muito longo')
    .optional(),
});

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;

/**
 * Schema para criacao de depoimento pelo admin
 */
export const adminCreateTestimonialSchema = z.object({
  authorName: z
    .string()
    .trim()
    .min(2, 'Nome deve ter no minimo 2 caracteres')
    .max(100, 'Nome muito longo'),
  authorCompany: z
    .string()
    .trim()
    .max(100, 'Nome da empresa muito longo')
    .optional(),
  authorRole: z
    .string()
    .trim()
    .max(100, 'Cargo muito longo')
    .optional(),
  authorPhotoUrl: z
    .string()
    .url('URL da foto invalida')
    .optional(),
  text: z
    .string()
    .trim()
    .min(10, 'Depoimento deve ter no minimo 10 caracteres')
    .max(1000, 'Depoimento deve ter no maximo 1000 caracteres'),
  rating: z
    .number()
    .int()
    .min(1)
    .max(5),
  status: z.enum(TESTIMONIAL_STATUS).optional().default('approved'),
  isPublic: z.boolean().optional().default(true),
});

export type AdminCreateTestimonialInput = z.infer<typeof adminCreateTestimonialSchema>;

/**
 * Schema para atualizacao de depoimento (admin)
 */
export const updateTestimonialSchema = z.object({
  text: z
    .string()
    .trim()
    .min(10, 'Depoimento deve ter no minimo 10 caracteres')
    .max(1000, 'Depoimento deve ter no maximo 1000 caracteres')
    .optional(),
  rating: z
    .number()
    .int()
    .min(1)
    .max(5)
    .optional(),
  authorName: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),
  authorCompany: z
    .string()
    .trim()
    .max(100)
    .optional(),
  authorRole: z
    .string()
    .trim()
    .max(100)
    .optional(),
  authorPhotoUrl: z
    .string()
    .url()
    .optional(),
  status: z.enum(TESTIMONIAL_STATUS).optional(),
  isPublic: z.boolean().optional(),
});

export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;

/**
 * Schema para listagem de depoimentos
 */
export const listTestimonialsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(TESTIMONIAL_STATUS).optional(),
  isPublic: z.coerce.boolean().optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  search: z.string().max(200).trim().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'rating']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListTestimonialsInput = z.infer<typeof listTestimonialsSchema>;

// ============================================================================
// TIPOS DE DOCUMENTOS
// ============================================================================

/**
 * Estrutura de um depoimento
 */
export interface Testimonial {
  id: string;
  userId?: string;
  authorName: string;
  authorCompany?: string;
  authorRole?: string;
  authorPhotoUrl?: string;
  text: string;
  rating: number;
  status: TestimonialStatus;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  feedback?: string;
}

/**
 * Estatisticas de depoimentos
 */
export interface TestimonialStats {
  total: number;
  aguardando: number;
  approved: number;
  rejected: number;
  averageRating: number;
}
