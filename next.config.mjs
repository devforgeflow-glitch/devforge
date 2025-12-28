import withPWAInit from 'next-pwa';
import createNextIntlPlugin from 'next-intl/plugin';

/**
 * Configuracao Next.js para DevForge
 *
 * Inclui: PWA, i18n (next-intl), Security Headers
 *
 * @version 1.0.0
 */

// Configuracao do i18n (next-intl)
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

// Configuracao do PWA
const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    // Cache de imagens do Firebase Storage
    {
      urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'firebase-images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 dias
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache de imagens do Google Storage
    {
      urlPattern: /^https:\/\/storage\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-storage-images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 dias
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache de fontes do Google
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 ano
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache de assets estaticos (JS, CSS)
    {
      urlPattern: /^https:\/\/.*\.(?:js|css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 1 dia
        },
      },
    },
    // Cache de API responses
    {
      urlPattern: /^\/api\/feedback.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-feedback',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutos
        },
        networkTimeoutSeconds: 10,
      },
    },
    // Fallback para paginas
    {
      urlPattern: /^\/(?!api\/).*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 24 * 60 * 60, // 1 dia
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

/**
 * Security Headers para todas as paginas
 * Complementa o helmet middleware que cobre apenas API routes
 */
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'off',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Security Headers para todas as paginas
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },

  // Configurar dominios de imagens permitidos
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      // Firebase Storage (producao)
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      // Firebase Storage Emulator (desenvolvimento)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9199',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9199',
        pathname: '/**',
      },
      // Avatares de usuarios
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // TypeScript strict
  typescript: {
    ignoreBuildErrors: false,
  },
};

// Compor plugins: i18n + PWA
export default withNextIntl(withPWA(nextConfig));
