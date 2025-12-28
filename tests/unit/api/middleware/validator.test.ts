/**
 * Testes do middleware de validacao
 *
 * Valida a integracao com Zod para validacao de schemas.
 *
 * @version 1.0.0
 */

import { z } from 'zod';

// Schema de exemplo para testes
const createSurveySchema = z.object({
  title: z.string().min(3, 'Titulo deve ter no minimo 3 caracteres').max(100),
  description: z.string().max(500).optional(),
  questions: z
    .array(
      z.object({
        type: z.enum(['text', 'rating', 'choice', 'nps']),
        text: z.string().min(1),
        required: z.boolean().default(false),
        options: z.array(z.string()).optional(),
      })
    )
    .min(1, 'Pesquisa deve ter pelo menos 1 pergunta'),
});

const emailSchema = z.string().email('Email invalido');

const userSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('Email invalido'),
  password: z.string().min(8, 'Senha deve ter no minimo 8 caracteres'),
});

describe('Zod Validation', () => {
  describe('createSurveySchema', () => {
    it('deve validar survey valido', () => {
      const validSurvey = {
        title: 'Pesquisa de Satisfacao',
        description: 'Avalie nosso servico',
        questions: [
          {
            type: 'rating',
            text: 'Como voce avalia nosso atendimento?',
            required: true,
          },
        ],
      };

      const result = createSurveySchema.safeParse(validSurvey);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar titulo muito curto', () => {
      const invalidSurvey = {
        title: 'AB',
        questions: [{ type: 'text', text: 'Pergunta', required: false }],
      };

      const result = createSurveySchema.safeParse(invalidSurvey);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('minimo 3 caracteres');
      }
    });

    it('deve rejeitar survey sem perguntas', () => {
      const invalidSurvey = {
        title: 'Pesquisa Vazia',
        questions: [],
      };

      const result = createSurveySchema.safeParse(invalidSurvey);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('pelo menos 1 pergunta');
      }
    });

    it('deve rejeitar tipo de pergunta invalido', () => {
      const invalidSurvey = {
        title: 'Pesquisa',
        questions: [{ type: 'invalid_type', text: 'Pergunta', required: false }],
      };

      const result = createSurveySchema.safeParse(invalidSurvey);
      expect(result.success).toBe(false);
    });

    it('deve aceitar description opcional', () => {
      const surveyWithoutDescription = {
        title: 'Pesquisa sem descricao',
        questions: [{ type: 'nps', text: 'Recomendaria?', required: true }],
      };

      const result = createSurveySchema.safeParse(surveyWithoutDescription);
      expect(result.success).toBe(true);
    });
  });

  describe('emailSchema', () => {
    it('deve validar email valido', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co',
        'user+tag@gmail.com',
      ];

      validEmails.forEach((email) => {
        const result = emailSchema.safeParse(email);
        expect(result.success).toBe(true);
      });
    });

    it('deve rejeitar email invalido', () => {
      const invalidEmails = ['invalid', 'test@', '@domain.com', 'test @domain.com'];

      invalidEmails.forEach((email) => {
        const result = emailSchema.safeParse(email);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('userSchema', () => {
    it('deve validar usuario valido', () => {
      const validUser = {
        name: 'Joao Silva',
        email: 'joao@example.com',
        password: 'senhasegura123',
      };

      const result = userSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar senha curta', () => {
      const invalidUser = {
        name: 'Joao',
        email: 'joao@example.com',
        password: '123',
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('minimo 8 caracteres');
      }
    });

    it('deve rejeitar nome curto', () => {
      const invalidUser = {
        name: 'J',
        email: 'j@example.com',
        password: 'senhasegura123',
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Nome muito curto');
      }
    });

    it('deve retornar multiplos erros', () => {
      const invalidUser = {
        name: 'J',
        email: 'invalid',
        password: '123',
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(3);
      }
    });
  });

  describe('Transformacoes', () => {
    const trimmedSchema = z.object({
      name: z.string().trim(),
      email: z.string().email().toLowerCase(),
    });

    it('deve aplicar trim no nome', () => {
      const result = trimmedSchema.parse({
        name: '  Joao Silva  ',
        email: 'TEST@Example.com',
      });

      expect(result.name).toBe('Joao Silva');
    });

    it('deve converter email para lowercase', () => {
      const result = trimmedSchema.parse({
        name: 'Joao',
        email: 'TEST@Example.com',
      });

      expect(result.email).toBe('test@example.com');
    });
  });
});
