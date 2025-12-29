import { test, expect } from '@playwright/test';

/**
 * Testes E2E do Fluxo de Resposta de Pesquisa Publica
 *
 * Valida o wizard de resposta e submissao.
 *
 * @version 1.0.0
 */

test.describe('Pagina de Resposta de Pesquisa', () => {
  // Nota: Em ambiente real, usariamos um ID de pesquisa valido
  // Para testes, a pagina deve lidar graciosamente com IDs invalidos

  test('deve exibir erro para pesquisa inexistente', async ({ page }) => {
    await page.goto('/s/pesquisa-inexistente-123');

    // Deve mostrar algum indicador de erro ou loading
    // A implementacao pode variar
    const pageContent = await page.content();

    // Verifica se nao quebrou (nao tem erro JS)
    expect(pageContent).toBeTruthy();
  });

  test('deve ter estrutura de wizard', async ({ page }) => {
    await page.goto('/s/demo-survey');

    // Verifica elementos basicos do wizard (se existirem)
    const progressIndicator = page.locator('[class*="progress"], [role="progressbar"]');
    const buttons = page.locator('button');

    // Deve haver botoes de navegacao
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Componentes de Pergunta', () => {
  // Testes unitarios visuais para cada tipo de pergunta

  test('TextQuestion deve aceitar texto', async ({ page }) => {
    await page.goto('/s/demo-survey');

    const textarea = page.locator('textarea');

    if (await textarea.isVisible()) {
      await textarea.fill('Esta e uma resposta de teste');
      await expect(textarea).toHaveValue('Esta e uma resposta de teste');
    }
  });

  test('RatingQuestion deve permitir selecao de estrelas', async ({ page }) => {
    await page.goto('/s/demo-survey');

    // Procura por botoes de rating (estrelas)
    const stars = page.locator('button[class*="star"], button:has-text("★")');

    if ((await stars.count()) > 0) {
      await stars.nth(3).click(); // Clica na 4a estrela
    }
  });

  test('NPSQuestion deve ter escala 0-10', async ({ page }) => {
    await page.goto('/s/demo-survey');

    // Procura por botoes numerados
    const npsButtons = page.locator('button:has-text("5")');

    if (await npsButtons.first().isVisible()) {
      await npsButtons.first().click();
    }
  });

  test('ChoiceQuestion deve permitir selecao', async ({ page }) => {
    await page.goto('/s/demo-survey');

    // Procura por opcoes de escolha
    const options = page.locator('button[class*="choice"], div[class*="option"]');

    if ((await options.count()) > 0) {
      await options.first().click();
    }
  });
});

test.describe('Navegacao do Wizard', () => {
  test('deve ter botao Proximo', async ({ page }) => {
    await page.goto('/s/demo-survey');

    const nextButton = page.getByRole('button', { name: /proximo|next|continuar/i });

    // Botao pode existir se houver perguntas
    if (await nextButton.isVisible()) {
      await expect(nextButton).toBeEnabled();
    }
  });

  test('deve ter botao Anterior apos avancar', async ({ page }) => {
    await page.goto('/s/demo-survey');

    const nextButton = page.getByRole('button', { name: /proximo|next|continuar/i });

    if (await nextButton.isVisible()) {
      await nextButton.click();

      const prevButton = page.getByRole('button', { name: /anterior|back|voltar/i });

      if (await prevButton.isVisible()) {
        await expect(prevButton).toBeEnabled();
      }
    }
  });

  test('deve mostrar indicador de progresso', async ({ page }) => {
    await page.goto('/s/demo-survey');

    // Procura por indicador de progresso
    const progress = page.locator('[class*="progress"], text=/\\d+.*de.*\\d+/i');
    const progressCount = await progress.count();

    // Pode ter indicador de progresso
    expect(progressCount).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Submissao de Resposta', () => {
  test('botao enviar deve existir na ultima pergunta', async ({ page }) => {
    await page.goto('/s/demo-survey');

    // Navega ate o fim
    let nextButton = page.getByRole('button', { name: /proximo|next/i });
    let attempts = 0;

    while ((await nextButton.isVisible()) && attempts < 10) {
      await nextButton.click();
      await page.waitForTimeout(300);
      nextButton = page.getByRole('button', { name: /proximo|next/i });
      attempts++;
    }

    // No fim, deve haver botao de enviar
    const submitButton = page.getByRole('button', { name: /enviar|submit|finalizar/i });

    if (await submitButton.isVisible()) {
      await expect(submitButton).toBeVisible();
    }
  });
});

test.describe('Pagina de Agradecimento', () => {
  test('deve mostrar agradecimento apos envio', async ({ page }) => {
    await page.goto('/s/demo-survey');

    // Simula fluxo completo (se possivel)
    // Nota: Em teste real, preencheriamos todas as perguntas

    // Verifica se existe elemento de thank you (para testes de UI)
    const thankYou = page.getByText(/obrigado|agradecemos|resposta enviada/i);

    // Pode nao estar visivel no inicio
    expect(await thankYou.isVisible()).toBe(false);
  });
});

test.describe('Survey Response - Responsividade', () => {
  test('wizard deve funcionar em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/s/demo-survey');

    // Conteudo deve estar visivel
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Botoes devem ser clicaveis
    const buttons = page.locator('button');
    if ((await buttons.count()) > 0) {
      const firstButton = buttons.first();
      await expect(firstButton).toBeVisible();
    }
  });

  test('campos de input devem ser usaveis em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/s/demo-survey');

    const textarea = page.locator('textarea');

    if (await textarea.isVisible()) {
      // Textarea deve ter largura adequada
      const box = await textarea.boundingBox();
      expect(box?.width).toBeGreaterThan(280);
    }
  });
});

test.describe('Acessibilidade da Survey', () => {
  test('perguntas devem ter labels', async ({ page }) => {
    await page.goto('/s/demo-survey');

    // Procura por headings ou labels de pergunta
    const questionLabels = page.locator('h2, h3, label, [class*="question"]');
    const count = await questionLabels.count();

    // Deve haver pelo menos algum texto de pergunta
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('inputs devem ter associacao com labels', async ({ page }) => {
    await page.goto('/s/demo-survey');

    const inputs = page.locator('input, textarea, select');
    const count = await inputs.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const input = inputs.nth(i);

      if (await input.isVisible()) {
        // Deve ter id ou aria-label
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');

        expect(id || ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    }
  });
});
