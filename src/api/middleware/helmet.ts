/**
 * Middleware de Headers de Segurança HTTP (Helmet)
 *
 * Headers implementados:
 * - X-DNS-Prefetch-Control
 * - X-Frame-Options
 * - X-Content-Type-Options
 * - Strict-Transport-Security
 * - X-XSS-Protection
 * - Referrer-Policy
 * - Content-Security-Policy
 *
 * @version 1.0.0
 */

import type { NextApiRequest, NextApiResponse } from 'next';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Domínios confiáveis para CSP
 */
const TRUSTED_DOMAINS = {
  images: [
    'https://firebasestorage.googleapis.com',
    'https://storage.googleapis.com',
    'https://images.unsplash.com',
  ],
  fonts: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ],
  connect: [
    'https://*.firebaseio.com',
    'https://*.googleapis.com',
    'wss://*.firebaseio.com',
    'https://api.mercadopago.com',
    'https://api.openai.com',
    'https://api.anthropic.com',
  ],
  scripts: [
    'https://sdk.mercadopago.com',
    'https://www.googletagmanager.com',
  ],
};

/**
 * Gera CSP baseada no ambiente
 */
function buildCSP(): string {
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''} ${TRUSTED_DOMAINS.scripts.join(' ')}`.trim(),
    `style-src 'self' 'unsafe-inline' ${TRUSTED_DOMAINS.fonts[0]}`,
    `img-src 'self' data: blob: ${TRUSTED_DOMAINS.images.join(' ')}`,
    `font-src 'self' data: ${TRUSTED_DOMAINS.fonts.join(' ')}`,
    `connect-src 'self' ${TRUSTED_DOMAINS.connect.join(' ')} ${isDev ? 'ws://localhost:* http://localhost:*' : ''}`.trim(),
    "worker-src 'self' blob:",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "manifest-src 'self'",
  ];

  return directives.join('; ');
}

const SECURITY_HEADERS = {
  'X-DNS-Prefetch-Control': 'off',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': buildCSP(),
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()',
    'payment=(self)',
  ].join(', '),
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': isDev ? 'unsafe-none' : 'require-corp',
};

/**
 * Middleware de headers de segurança
 */
export async function helmetMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
): Promise<void> {
  Object.entries(SECURITY_HEADERS).forEach(([header, value]) => {
    if (header === 'Strict-Transport-Security' && isDev) {
      return;
    }
    res.setHeader(header, value);
  });

  res.removeHeader('X-Powered-By');
  next();
}

/**
 * Helmet com CSP customizada
 */
export function helmetWithCustomCSP(additionalDirectives: Record<string, string>) {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    await helmetMiddleware(req, res, () => {});

    const baseDirectives = SECURITY_HEADERS['Content-Security-Policy']
      .split('; ')
      .map(dir => {
        const [key, ...values] = dir.split(' ');
        return { key, value: values.join(' ') };
      });

    const mergedDirectives = baseDirectives.map(({ key, value }) => {
      const customValue = additionalDirectives[key];
      return customValue ? `${key} ${customValue}` : `${key} ${value}`;
    });

    Object.entries(additionalDirectives).forEach(([key, value]) => {
      if (!baseDirectives.some(d => d.key === key)) {
        mergedDirectives.push(`${key} ${value}`);
      }
    });

    res.setHeader('Content-Security-Policy', mergedDirectives.join('; '));
    next();
  };
}
