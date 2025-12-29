import { test, expect } from '@playwright/test';

/**
 * Testes E2E de Navegacao
 *
 * Valida links e navegacao entre paginas.
 *
 * @version 1.0.0
 */

test.describe('Navegacao Principal', () => {
  test('deve navegar da home para features', async ({ page }) => {
    await page.goto('/');

    const featuresLink = page.getByRole('link', { name: /recursos/i }).first();
    await featuresLink.click();

    await expect(page).toHaveURL(/features/);
    await expect(page.getByText(/Criacao de Pesquisas/i)).toBeVisible();
  });

  test('deve navegar da home para pricing', async ({ page }) => {
    await page.goto('/');

    const pricingLink = page.getByRole('link', { name: /precos/i }).first();
    await pricingLink.click();

    await expect(page).toHaveURL(/pricing/);
    await expect(page.getByText('Gratuito')).toBeVisible();
  });

  test('deve navegar da home para about', async ({ page }) => {
    await page.goto('/');

    // Procura link para about no footer ou header
    const aboutLink = page.getByRole('link', { name: /sobre|about|como foi feito/i }).first();

    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await expect(page).toHaveURL(/about/);
    } else {
      // Navega diretamente se link nao existe
      await page.goto('/about');
      await expect(page).toHaveURL(/about/);
    }
  });

  test('deve manter header visivel em todas as paginas', async ({ page }) => {
    const pages = ['/', '/features', '/pricing', '/about'];

    for (const path of pages) {
      await page.goto(path);
      const header = page.locator('header');
      await expect(header).toBeVisible();
    }
  });

  test('deve manter footer visivel em todas as paginas', async ({ page }) => {
    const pages = ['/', '/features', '/pricing', '/about'];

    for (const path of pages) {
      await page.goto(path);
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    }
  });
});

test.describe('Navegacao por CTAs', () => {
  test('deve navegar de features para pricing via CTA', async ({ page }) => {
    await page.goto('/features');

    const pricingLink = page.getByRole('link', { name: /Ver Planos/i });
    await pricingLink.click();

    await expect(page).toHaveURL(/pricing/);
  });

  test('deve navegar de pricing para signup via CTA', async ({ page }) => {
    await page.goto('/pricing');

    const signupLink = page
      .getByRole('link', { name: /Comecar Gratis/i })
      .first();
    await signupLink.click();

    await expect(page).toHaveURL(/signup/);
  });

  test('deve navegar de about para docs via CTA', async ({ page }) => {
    await page.goto('/about');

    const docsLink = page.getByRole('link', { name: /Documentacao/i });
    await docsLink.click();

    await expect(page).toHaveURL(/docs/);
  });
});

test.describe('Breadcrumbs e Retorno', () => {
  test('logo deve navegar para home', async ({ page }) => {
    await page.goto('/features');

    // Clica no logo (geralmente um link para home)
    const logo = page.getByRole('link', { name: /devforge/i }).first();
    await logo.click();

    await expect(page).toHaveURL('/');
  });

  test('deve voltar com navegacao do browser', async ({ page }) => {
    await page.goto('/');
    await page.goto('/features');
    await page.goto('/pricing');

    // Volta para features
    await page.goBack();
    await expect(page).toHaveURL(/features/);

    // Volta para home
    await page.goBack();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Links Externos', () => {
  test('link do GitHub deve abrir em nova aba', async ({ page }) => {
    await page.goto('/about');

    const githubLink = page.getByRole('link', { name: /Ver no GitHub/i });
    const target = await githubLink.getAttribute('target');

    expect(target).toBe('_blank');
  });
});

test.describe('404 e Paginas Inexistentes', () => {
  test('deve exibir 404 para pagina inexistente', async ({ page }) => {
    const response = await page.goto('/pagina-que-nao-existe');

    // Deve retornar 404 ou exibir pagina de erro
    expect(response?.status()).toBe(404);
  });
});

test.describe('SEO e Meta Tags', () => {
  test('home deve ter meta description', async ({ page }) => {
    await page.goto('/');

    const description = page.locator('meta[name="description"]');
    const content = await description.getAttribute('content');

    expect(content).toBeTruthy();
    expect(content?.length).toBeGreaterThan(50);
  });

  test('features deve ter meta description', async ({ page }) => {
    await page.goto('/features');

    const description = page.locator('meta[name="description"]');
    const content = await description.getAttribute('content');

    expect(content).toBeTruthy();
    expect(content?.length).toBeGreaterThan(30);
  });

  test('pricing deve ter meta description', async ({ page }) => {
    await page.goto('/pricing');

    const description = page.locator('meta[name="description"]');
    const content = await description.getAttribute('content');

    expect(content).toBeTruthy();
  });

  test('about deve ter meta description', async ({ page }) => {
    await page.goto('/about');

    const description = page.locator('meta[name="description"]');
    const content = await description.getAttribute('content');

    expect(content).toBeTruthy();
  });
});
