import { defineConfig, devices } from '@playwright/test';

/**
 * Configuracao do Playwright para testes E2E
 *
 * @see https://playwright.dev/docs/test-configuration
 * @version 1.0.0
 */
export default defineConfig({
  // Diretorio dos testes E2E
  testDir: './tests/e2e',

  // Executar testes em paralelo
  fullyParallel: true,

  // Falhar o build se deixar test.only no codigo
  forbidOnly: !!process.env.CI,

  // Retry em CI
  retries: process.env.CI ? 2 : 0,

  // Workers paralelos
  workers: process.env.CI ? 1 : undefined,

  // Reporter
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],

  // Configuracoes globais
  use: {
    // Base URL para navegacao
    baseURL: 'http://localhost:3000',

    // Coletar trace em caso de falha
    trace: 'on-first-retry',

    // Screenshot em falha
    screenshot: 'only-on-failure',

    // Video em falha (apenas CI)
    video: process.env.CI ? 'on-first-retry' : 'off',
  },

  // Projetos (browsers)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Testes mobile
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Servidor de desenvolvimento
  webServer: {
    command: 'npm run dev:no-redis',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
