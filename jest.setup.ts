/**
 * Jest Setup
 *
 * Configuracao global para todos os testes.
 * Importa matchers do Testing Library.
 *
 * @version 1.0.0
 */

import '@testing-library/jest-dom';

// Mock do next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
      isReady: true,
      isPreview: false,
    };
  },
}));

// Mock do next-themes
jest.mock('next-themes', () => ({
  useTheme() {
    return {
      theme: 'light',
      setTheme: jest.fn(),
      resolvedTheme: 'light',
      themes: ['light', 'dark', 'system'],
      systemTheme: 'light',
    };
  },
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock do next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'pt-BR',
}));

// Suprimir warnings do console durante testes
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    // Ignorar warnings conhecidos do React 18
    if (
      typeof args[0] === 'string' &&
      args[0].includes('ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Limpar todos os mocks apos cada teste
afterEach(() => {
  jest.clearAllMocks();
});
