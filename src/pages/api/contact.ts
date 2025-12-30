/**
 * API Route: /api/contact
 *
 * Endpoint publico para envio de mensagens de contato.
 * As mensagens sao salvas para posterior visualizacao no painel admin.
 *
 * Metodos:
 * - POST: Envia nova mensagem de contato
 *
 * @version 1.0.0
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import {
  sendContactMessageSchema,
  type ContactMessage,
} from '@/api/lib/schemas/contact.schema';
import { logger } from '@/api/utils/logger';

// Armazenamento temporario em memoria (em producao seria Firestore)
// Este e um mock para funcionar sem Firebase configurado
const contactMessages: ContactMessage[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Apenas POST permitido
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Metodo nao permitido',
    });
  }

  try {
    // Validar dados com Zod
    const validationResult = sendContactMessageSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errors = validationResult.error.flatten();
      return res.status(400).json({
        success: false,
        message: 'Dados invalidos',
        errors: errors.fieldErrors,
      });
    }

    const data = validationResult.data;
    const now = new Date().toISOString();
    const messageId = uuidv4();

    // Criar mensagem de contato
    const message: ContactMessage = {
      id: messageId,
      nome: data.nome,
      email: data.email,
      ...(data.telefone && { telefone: data.telefone }),
      ...(data.empresa && { empresa: data.empresa }),
      assunto: data.assunto,
      mensagem: data.mensagem,
      status: 'novo',
      respostas: [],
      createdAt: now,
      updatedAt: now,
      ip: (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    };

    // Salvar mensagem (em memoria por enquanto)
    contactMessages.push(message);

    logger.info('Mensagem de contato recebida', {
      messageId,
      assunto: data.assunto,
      email: data.email,
    });

    // Retornar sucesso
    return res.status(201).json({
      success: true,
      message: 'Mensagem enviada com sucesso',
      data: {
        id: messageId,
      },
    });
  } catch (error: any) {
    logger.error('Erro ao processar mensagem de contato', { error });

    return res.status(500).json({
      success: false,
      message: 'Erro interno ao processar mensagem',
    });
  }
}

// Exportar mensagens para uso no admin (temporario)
export { contactMessages };
