import { test, expect } from '@playwright/test';

/**
 * Testes E2E da pagina About (Como Foi Feito)
 *
 * Valida exibicao de stack tecnologica e arquitetura.
 *
 * @version 1.0.0
 */

test.describe('Pagina About', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('deve exibir o titulo correto', async ({ page }) => {
    await expect(page).toHaveTitle(/Como Foi Feito.*DevForge/);
  });

  test('deve exibir hero com badge Open Source', async ({ page }) => {
    await expect(page.getByText(/Open Source Friendly/i)).toBeVisible();

    await expect(
      page.getByRole('heading', { name: /melhores tecnologias/i })
    ).toBeVisible();
  });

  test('deve exibir botoes de acao no hero', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: /Ver no GitHub/i })
    ).toBeVisible();

    await expect(
      page.getByRole('link', { name: /Documentacao/i })
    ).toBeVisible();
  });

  test('deve exibir secao de Stack Tecnologica', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Stack Tecnologica/i })
    ).toBeVisible();

    // Categorias
    await expect(page.getByText('Frontend')).toBeVisible();
    await expect(page.getByText('Backend')).toBeVisible();
    await expect(page.getByText(/Inteligencia Artificial/i)).toBeVisible();
    await expect(page.getByText('DevOps')).toBeVisible();
  });

  test('deve exibir tecnologias do Frontend', async ({ page }) => {
    await expect(page.getByText('Next.js 14')).toBeVisible();
    await expect(page.getByText('React 19')).toBeVisible();
    await expect(page.getByText('TypeScript 5')).toBeVisible();
    await expect(page.getByText('Tailwind CSS')).toBeVisible();
  });

  test('deve exibir tecnologias do Backend', async ({ page }) => {
    await expect(page.getByText('Firebase')).toBeVisible();
    await expect(page.getByText('Redis')).toBeVisible();
    await expect(page.getByText('BullMQ')).toBeVisible();
    await expect(page.getByText('Zod')).toBeVisible();
  });

  test('deve exibir tecnologias de IA', async ({ page }) => {
    await expect(page.getByText('OpenAI GPT-4')).toBeVisible();
    await expect(page.getByText('Anthropic Claude')).toBeVisible();
  });

  test('deve exibir secao de Arquitetura em Camadas', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Arquitetura em Camadas/i })
    ).toBeVisible();

    // Camadas
    await expect(page.getByText(/Apresentacao/i)).toBeVisible();
    await expect(page.getByText(/API Routes/i)).toBeVisible();
    await expect(page.getByText(/Servicos/i)).toBeVisible();
    await expect(page.getByText(/Infraestrutura/i)).toBeVisible();
  });

  test('deve exibir 18 camadas de seguranca', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /18 Camadas de Seguranca/i })
    ).toBeVisible();

    // Algumas camadas de seguranca
    await expect(page.getByText('Helmet (Security Headers)')).toBeVisible();
    await expect(page.getByText('CORS configurado')).toBeVisible();
    await expect(page.getByText('JWT Authentication')).toBeVisible();
    await expect(page.getByText('Rate Limiting')).toBeVisible();
  });

  test('deve exibir roadmap de desenvolvimento', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Roadmap de Desenvolvimento/i })
    ).toBeVisible();

    // Fases
    await expect(page.getByText('Fase 1')).toBeVisible();
    await expect(page.getByText('Fase 2')).toBeVisible();
    await expect(page.getByText('Fase 3')).toBeVisible();
    await expect(page.getByText('Fase 4')).toBeVisible();
  });

  test('deve exibir secao de creditos com Claude Code', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Desenvolvido com IA/i })
    ).toBeVisible();

    await expect(page.getByText('Claude Code')).toBeVisible();
    await expect(page.getByText('Desenvolvedor')).toBeVisible();
  });

  test('deve ter link funcional para GitHub', async ({ page }) => {
    const githubLink = page.getByRole('link', { name: /Ver no GitHub/i });
    const href = await githubLink.getAttribute('href');

    expect(href).toContain('github.com');
  });
});

test.describe('About - Acessibilidade', () => {
  test('deve ter estrutura semantica correta', async ({ page }) => {
    await page.goto('/about');

    // Multiplos h2 para secoes
    const h2s = page.locator('h2');
    const count = await h2s.count();

    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('deve ter icones com significado visual', async ({ page }) => {
    await page.goto('/about');

    // Icones de check nas camadas de seguranca
    const checkIcons = page.locator('svg[class*="text-green"]');
    const count = await checkIcons.count();

    expect(count).toBeGreaterThanOrEqual(10);
  });
});
