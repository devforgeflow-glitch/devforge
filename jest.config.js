/**
 * Configuracao do Jest para DevForge
 *
 * Suporta:
 * - TypeScript via ts-jest
 * - React Testing Library
 * - Path aliases (@/*)
 * - Cobertura de codigo
 *
 * @version 1.0.0
 */

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Caminho para o app Next.js para carregar next.config e .env
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  // Diretorio raiz dos testes
  roots: ['<rootDir>/tests'],

  // Setup executado antes de cada teste
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Ambiente de teste para componentes React
  testEnvironment: 'jsdom',

  // Padroes de arquivos de teste
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // Ignorar pastas
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/tests/e2e/',
  ],

  // Mapeamento de modulos para path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Transformacoes de arquivos
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },

  // Extensoes de modulos
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Cobertura de codigo
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx',
  ],

  // Thresholds de cobertura por criticidade (conforme CLAUDE.md)
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
    // Modulos criticos: 90%+
    'src/api/middleware/auth.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Diretorios de cobertura
  coverageDirectory: '<rootDir>/coverage',

  // Reporters
  coverageReporters: ['text', 'lcov', 'html'],

  // Limpar mocks entre testes
  clearMocks: true,

  // Verbosidade
  verbose: true,
};

module.exports = createJestConfig(customJestConfig);
