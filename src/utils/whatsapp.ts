/**
 * WhatsApp Utilities
 *
 * Funcoes auxiliares para geracao de links do WhatsApp.
 * Arquivo compartilhado entre servidor e cliente.
 *
 * @module utils/whatsapp
 * @version 1.0.0
 */

/**
 * Gera link do WhatsApp formatado
 *
 * Formato: https://api.whatsapp.com/send?phone=55DDDNUMBER&text=MESSAGE
 *
 * Esta funcao e pura (sem side effects) e pode ser usada
 * tanto no servidor quanto no cliente.
 *
 * @param number - Numero sem mascara (ex: "41999998888")
 * @param message - Mensagem opcional (sera codificada)
 * @returns Link completo ou string vazia se numero nao fornecido
 *
 * @example
 * // Sem mensagem
 * generateWhatsAppLink('41999998888');
 * // "https://api.whatsapp.com/send?phone=5541999998888"
 *
 * @example
 * // Com mensagem
 * generateWhatsAppLink('41999998888', 'Ola! Vi seu site.');
 * // "https://api.whatsapp.com/send?phone=5541999998888&text=Ol%C3%A1!%20Vi%20seu%20site."
 */
export function generateWhatsAppLink(number?: string, message?: string): string {
  // Retorna vazio se numero nao fornecido
  if (!number || number.trim() === '') {
    return '';
  }

  // Remove espacos e caracteres especiais (aceita apenas digitos)
  const cleaned = number.replace(/\D/g, '');

  // Valida se tem 10-11 digitos
  if (cleaned.length < 10 || cleaned.length > 11) {
    if (typeof console !== 'undefined') {
      console.warn('[WhatsApp] Formato de numero invalido:', {
        length: cleaned.length,
        expected: '10-11 digitos',
      });
    }
    return '';
  }

  // Monta URL base com codigo do Brasil (+55)
  const baseUrl = `https://api.whatsapp.com/send?phone=55${cleaned}`;

  // Adiciona mensagem se fornecida
  if (message && message.trim() !== '') {
    const encoded = encodeURIComponent(message);
    return `${baseUrl}&text=${encoded}`;
  }

  return baseUrl;
}
