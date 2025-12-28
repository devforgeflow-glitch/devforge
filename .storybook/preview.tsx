import type { Preview } from '@storybook/react';
import { ThemeProvider } from 'next-themes';
import '../src/styles/globals.css';

/**
 * Configuracao de preview do Storybook
 *
 * Inclui:
 * - Suporte a Dark Mode via next-themes
 * - Estilos globais do Tailwind
 * - Decorators para providers
 *
 * @version 1.0.0
 */

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0f172a' },
      ],
    },
    layout: 'centered',
  },
  decorators: [
    (Story, context) => {
      // Detecta o background selecionado no Storybook
      const isDark = context.globals.backgrounds?.value === '#0f172a';

      return (
        <ThemeProvider
          attribute="class"
          defaultTheme={isDark ? 'dark' : 'light'}
          enableSystem={false}
          forcedTheme={isDark ? 'dark' : 'light'}
        >
          <div className={isDark ? 'dark' : ''}>
            <div className="min-h-[100px] p-4 bg-background text-foreground">
              <Story />
            </div>
          </div>
        </ThemeProvider>
      );
    },
  ],
  globalTypes: {
    theme: {
      name: 'Tema',
      description: 'Tema global para componentes',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Claro' },
          { value: 'dark', icon: 'moon', title: 'Escuro' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
