import { test, expect } from '@playwright/test';

/**
 * Testes E2E da pagina de Features
 *
 * Valida exibicao de recursos e navegacao.
 *
 * @version 1.0.0
 */

test.describe('Pagina de Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/features');
  });

  test('deve exibir o titulo correto', async ({ page }) => {
    await expect(page).toHaveTitle(/Recursos.*DevForge/);
  });

  test('deve exibir hero com badge e titulo', async ({ page }) => {
    // Badge "Plataforma Completa"
    await expect(page.getByText(/Plataforma Completa/i)).toBeVisible();

    // Titulo principal
    await expect(
      page.getByRole('heading', { name: /entender seus clientes/i })
    ).toBeVisible();
  });

  test('deve exibir metricas de destaque', async ({ page }) => {
    // Verifica highlights
    await expect(page.getByText('99.9%')).toBeVisible();
    await expect(page.getByText('<100ms')).toBeVisible();
    await expect(page.getByText('256-bit')).toBeVisible();
    await expect(page.getByText('LGPD')).toBeVisible();
  });

  test('deve exibir todas as categorias de features', async ({ page }) => {
    // 4 categorias principais
    await expect(page.getByText(/Criacao de Pesquisas/i)).toBeVisible();
    await expect(page.getByText(/Coleta de Respostas/i)).toBeVisible();
    await expect(page.getByText(/Analise e Insights/i)).toBeVisible();
    await expect(page.getByText(/Integracao e Automacao/i)).toBeVisible();
  });

  test('deve exibir features de criacao de pesquisas', async ({ page }) => {
    await expect(page.getByText(/Editor Visual Intuitivo/i)).toBeVisible();
    await expect(page.getByText(/Geracao com IA/i)).toBeVisible();
    await expect(page.getByText(/6 Tipos de Pergunta/i)).toBeVisible();
    await expect(page.getByText(/Personalizacao Visual/i)).toBeVisible();
  });

  test('deve exibir secao de seguranca', async ({ page }) => {
    // Badge de seguranca
    await expect(page.getByText(/Seguranca Enterprise/i)).toBeVisible();

    // 18 camadas de seguranca
    await expect(page.getByText(/18 camadas de seguranca/i)).toBeVisible();

    // Itens de seguranca
    await expect(page.getByText(/Criptografia AES-256/i)).toBeVisible();
    await expect(page.getByText(/JWT/i)).toBeVisible();
    await expect(page.getByText(/Rate limiting/i)).toBeVisible();
  });

  test('deve exibir badges de compliance', async ({ page }) => {
    await expect(page.getByText('SSL/TLS')).toBeVisible();
    await expect(page.getByText('WAF')).toBeVisible();
    await expect(page.getByText('SOC 2')).toBeVisible();
    await expect(page.getByText('GDPR')).toBeVisible();
  });

  test('deve exibir CTA final', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Pronto para comecar/i })
    ).toBeVisible();

    const ctaButton = page.getByRole('link', { name: /Criar Conta Gratuita/i });
    await expect(ctaButton).toBeVisible();
  });

  test('deve navegar para signup ao clicar no CTA', async ({ page }) => {
    const ctaButton = page.getByRole('link', { name: /Comecar Gratuitamente/i }).first();
    await ctaButton.click();

    await expect(page).toHaveURL(/signup/);
  });

  test('deve navegar para pricing ao clicar em Ver Planos', async ({ page }) => {
    const pricingLink = page.getByRole('link', { name: /Ver Planos/i });
    await pricingLink.click();

    await expect(page).toHaveURL(/pricing/);
  });
});

test.describe('Features - Responsividade', () => {
  test('deve exibir features em grid no mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/features');

    // Verifica que conteudo esta visivel
    await expect(page.getByText(/Criacao de Pesquisas/i)).toBeVisible();

    // Cards devem estar empilhados
    const cards = page.locator('[class*="CardContent"]');
    const firstCard = cards.first();

    if (await firstCard.isVisible()) {
      const box = await firstCard.boundingBox();
      // Em mobile, cards ocupam largura total
      expect(box?.width).toBeGreaterThan(300);
    }
  });
});
