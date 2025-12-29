import { test, expect } from '@playwright/test';

/**
 * Testes E2E da pagina de Pricing
 *
 * Valida exibicao de planos e comparativo.
 *
 * @version 1.0.0
 */

test.describe('Pagina de Pricing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing');
  });

  test('deve exibir o titulo correto', async ({ page }) => {
    await expect(page).toHaveTitle(/Planos.*Precos.*DevForge/);
  });

  test('deve exibir hero com titulo', async ({ page }) => {
    await expect(page.getByText(/Precos simples e transparentes/i)).toBeVisible();

    await expect(
      page.getByRole('heading', { name: /plano ideal/i })
    ).toBeVisible();
  });

  test('deve exibir 3 planos', async ({ page }) => {
    await expect(page.getByText('Gratuito')).toBeVisible();
    await expect(page.getByText('Profissional')).toBeVisible();
    await expect(page.getByText('Empresarial')).toBeVisible();
  });

  test('deve exibir precos corretos', async ({ page }) => {
    // Preco do plano gratuito
    const freePrice = page.locator('text=/R\\$.*0/').first();
    await expect(freePrice).toBeVisible();

    // Preco do plano pro
    await expect(page.getByText('97')).toBeVisible();

    // Preco do plano enterprise
    await expect(page.getByText('297')).toBeVisible();
  });

  test('deve destacar plano mais popular', async ({ page }) => {
    await expect(page.getByText('Mais Popular')).toBeVisible();
  });

  test('deve exibir features do plano gratuito', async ({ page }) => {
    await expect(page.getByText(/Ate 3 pesquisas ativas/i)).toBeVisible();
    await expect(page.getByText(/100 respostas\/mes/i)).toBeVisible();
    await expect(page.getByText(/Suporte por email/i)).toBeVisible();
  });

  test('deve exibir features do plano profissional', async ({ page }) => {
    await expect(page.getByText(/Pesquisas ilimitadas/i)).toBeVisible();
    await expect(page.getByText(/5.000 respostas\/mes/i)).toBeVisible();
    await expect(page.getByText(/Geracao de perguntas com IA/i)).toBeVisible();
    await expect(page.getByText(/Analise de sentimento IA/i)).toBeVisible();
  });

  test('deve exibir features do plano empresarial', async ({ page }) => {
    await expect(page.getByText(/White-label completo/i)).toBeVisible();
    await expect(page.getByText(/API access/i)).toBeVisible();
    await expect(page.getByText(/SSO \/ SAML/i)).toBeVisible();
    await expect(page.getByText(/SLA 99.9%/i)).toBeVisible();
  });

  test('deve exibir tabela de comparativo', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Comparativo Completo/i })
    ).toBeVisible();

    // Headers da tabela
    await expect(page.getByText('Funcionalidade')).toBeVisible();

    // Linhas do comparativo
    await expect(page.getByText(/Pesquisas ativas/i)).toBeVisible();
    await expect(page.getByText(/Respostas\/mes/i)).toBeVisible();
    await expect(page.getByText(/Membros da equipe/i)).toBeVisible();
  });

  test('deve exibir secao de FAQ', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Perguntas Frequentes/i })
    ).toBeVisible();

    // Perguntas
    await expect(
      page.getByText(/Posso cancelar a qualquer momento/i)
    ).toBeVisible();
    await expect(
      page.getByText(/exceder o limite de respostas/i)
    ).toBeVisible();
    await expect(page.getByText(/desconto para pagamento anual/i)).toBeVisible();
    await expect(page.getByText(/mudar de plano/i)).toBeVisible();
  });

  test('deve ter CTAs funcionais', async ({ page }) => {
    // Botao do plano gratuito
    const freeButton = page.getByRole('link', { name: /Comecar Gratis/i });
    await expect(freeButton).toBeVisible();

    // Botao do plano pro
    const proButton = page.getByRole('link', { name: /Comecar Teste Gratis/i });
    await expect(proButton).toBeVisible();

    // Botao do plano enterprise
    const enterpriseButton = page.getByRole('link', {
      name: /Falar com Vendas/i,
    });
    await expect(enterpriseButton).toBeVisible();
  });

  test('deve navegar para signup ao clicar em CTA', async ({ page }) => {
    const ctaButton = page
      .getByRole('link', { name: /Comecar Gratuitamente/i })
      .first();
    await ctaButton.click();

    await expect(page).toHaveURL(/signup/);
  });

  test('deve exibir CTA final', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Pronto para comecar/i })
    ).toBeVisible();

    await expect(
      page.getByRole('link', { name: /Falar com Vendas/i }).last()
    ).toBeVisible();
  });
});

test.describe('Pricing - Responsividade', () => {
  test('deve exibir planos empilhados no mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pricing');

    // Todos os planos devem estar visiveis
    await expect(page.getByText('Gratuito')).toBeVisible();
    await expect(page.getByText('Profissional')).toBeVisible();
    await expect(page.getByText('Empresarial')).toBeVisible();
  });

  test('deve ter tabela de comparativo com scroll horizontal', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pricing');

    // Tabela deve existir
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });
});
