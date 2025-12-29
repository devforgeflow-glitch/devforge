/**
 * ESLint Configuration - DevForge
 *
 * Configuracao com regras de prevencao para qualidade de codigo.
 *
 * @version 1.0.0
 */

import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Configuracao base do Next.js
  ...compat.extends('next/core-web-vitals'),

  // Regras customizadas
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // === REGRAS DE PREVENCAO ===

      // Forcar uso de === em vez de ==
      // Exceto para comparacao com null (que checa null E undefined)
      'eqeqeq': ['error', 'always', { null: 'ignore' }],

      // Avisar sobre uso de console em producao
      // Permite console.warn e console.error
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Prevenir return await desnecessario
      'no-return-await': 'error',

      // Prevenir variaveis nao utilizadas
      'no-unused-vars': 'off', // Desabilitar regra JS
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],

      // Avisar sobre any explicito
      '@typescript-eslint/no-explicit-any': 'warn',

      // Prevenir expressoes nao utilizadas
      'no-unused-expressions': 'error',

      // Prevenir shadowing de variaveis
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'warn',

      // Prevenir funcoes vazias
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': ['warn', {
        allow: ['arrowFunctions'],
      }],

      // === REGRAS DE ESTILO ===

      // Preferir const sobre let quando possivel
      'prefer-const': 'error',

      // Preferir template literals
      'prefer-template': 'warn',

      // Preferir arrow functions para callbacks
      'prefer-arrow-callback': 'warn',

      // Objetos shorthand
      'object-shorthand': ['warn', 'always'],

      // === REGRAS REACT ===

      // Desabilitar prop-types (usamos TypeScript)
      'react/prop-types': 'off',

      // Permitir JSX sem import React (Next.js)
      'react/react-in-jsx-scope': 'off',

      // Avisar sobre key em listas
      'react/jsx-key': 'error',

      // Prevenir renderizacao de undefined/null
      'react/jsx-no-useless-fragment': 'warn',

      // === REGRAS NEXT.JS ===

      // Permitir <img> em alguns casos
      '@next/next/no-img-element': 'warn',
    },
  },

  // Regras especificas para arquivos de teste
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
    rules: {
      // Permitir console em testes
      'no-console': 'off',

      // Permitir any em testes
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Regras especificas para arquivos de configuracao
  {
    files: ['*.config.{js,mjs,ts}', '*.setup.{js,ts}'],
    rules: {
      // Permitir require em configs
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Ignorar pastas
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'storybook-static/**',
      'public/sw.js',
      'public/workbox-*.js',
    ],
  },
];
