import { test, expect } from '@playwright/test';

/**
 * Testes E2E da pagina inicial
 *
 * Valida renderizacao e navegacao basica.
 *
 * @version 1.0.0
 */

test.describe('Pagina Inicial', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve exibir o titulo DevForge', async ({ page }) => {
    await expect(page).toHaveTitle(/DevForge/);
  });

  test('deve exibir o header com navegacao', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Verifica links de navegacao
    await expect(page.getByRole('link', { name: /recursos/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /precos/i })).toBeVisible();
  });

  test('deve ter botao de toggle de tema', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /alternar tema/i });
    await expect(themeToggle).toBeVisible();
  });

  test('deve alternar entre tema claro e escuro', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /alternar tema/i });
    const html = page.locator('html');

    // Verifica tema inicial (light)
    await expect(html).not.toHaveClass(/dark/);

    // Clica para mudar para dark
    await themeToggle.click();
    await expect(html).toHaveClass(/dark/);

    // Clica para voltar para light
    await themeToggle.click();
    await expect(html).not.toHaveClass(/dark/);
  });

  test('deve exibir secao hero com CTA', async ({ page }) => {
    // Verifica texto do hero
    await expect(page.getByText(/construimos software/i)).toBeVisible();

    // Verifica botao CTA
    const ctaButton = page.getByRole('link', { name: /comecar|criar conta/i });
    await expect(ctaButton).toBeVisible();
  });

  test('deve exibir footer', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Verifica texto de direitos
    await expect(page.getByText(/direitos reservados/i)).toBeVisible();
  });
});

test.describe('Responsividade', () => {
  test('deve exibir menu mobile em telas pequenas', async ({ page }) => {
    // Configura viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Em mobile, navegacao deve estar oculta ou em menu hamburger
    const mobileMenuButton = page.getByRole('button', { name: /menu/i });

    // Se existe menu mobile, deve estar visivel
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      // Verifica se menu abre
      await expect(page.getByRole('navigation')).toBeVisible();
    }
  });
});

test.describe('Acessibilidade basica', () => {
  test('deve ter estrutura de headings correta', async ({ page }) => {
    await page.goto('/');

    // Deve haver pelo menos um h1
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
  });

  test('deve ter links com texto descritivo', async ({ page }) => {
    await page.goto('/');

    // Todos os links devem ter texto ou aria-label
    const links = page.locator('a');
    const count = await links.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');

      expect(text?.trim() || ariaLabel).toBeTruthy();
    }
  });
});
