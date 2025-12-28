import { GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui';

/**
 * Pagina Inicial - DevForge
 *
 * Landing page com hero, features e CTA.
 *
 * @version 1.0.0
 */

export default function HomePage() {
  const t = useTranslations('common');

  return (
    <Layout
      title="DevForge"
      description="Plataforma completa para feedback e gestao de produtos"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        {/* Background Gradient */}
        <div className="absolute inset-0 gradient-bg" />

        <div className="container-app relative">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <svg
                className="mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Template Profissional Next.js + Firebase
            </div>

            {/* Titulo */}
            <h1 className="heading-1 mb-6">
              <span className="gradient-text">DevForge</span>
              <br />
              <span className="text-foreground">FeedbackHub Platform</span>
            </h1>

            {/* Descricao */}
            <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
              Demonstracao completa de arquitetura enterprise com Next.js 14,
              Firebase, Redis, BullMQ, i18n, Dark Mode, Storybook e integracao com IA.
            </p>

            {/* CTAs */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="min-w-[200px]">
                  {t('actions.signup')}
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  Ver Documentacao
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="heading-2 mb-4">{t('nav.features')}</h2>
            <p className="text-lg text-muted-foreground">
              Todas as funcionalidades que um projeto enterprise precisa
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="heading-4 mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="heading-2 mb-4">Stack Tecnologico</h2>
            <p className="text-lg text-muted-foreground">
              Construido com as melhores tecnologias do mercado
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 opacity-70">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-lg font-medium"
              >
                <span className="text-2xl">{tech.icon}</span>
                {tech.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container-app text-center">
          <h2 className="heading-2 mb-4">Pronto para comecar?</h2>
          <p className="mb-8 text-lg opacity-90">
            Clone este repositorio e comece seu proximo projeto
          </p>
          <Link href="https://github.com/devforge/template" target="_blank">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              Ver no GitHub
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

const features = [
  {
    icon: '🌙',
    title: 'Dark Mode',
    description: 'Suporte completo a tema escuro com next-themes e CSS variables.',
  },
  {
    icon: '🌐',
    title: 'Internacionalizacao',
    description: 'i18n com next-intl para PT-BR, EN e ES.',
  },
  {
    icon: '🔐',
    title: '18 Camadas de Seguranca',
    description: 'Helmet, CORS, CSRF, Rate Limiting, JWT, RBAC e mais.',
  },
  {
    icon: '📊',
    title: 'Storybook',
    description: 'Documentacao visual de componentes com Storybook.',
  },
  {
    icon: '🤖',
    title: 'Integracao IA',
    description: 'OpenAI e Anthropic para classificacao e resumos.',
  },
  {
    icon: '⚡',
    title: 'BullMQ',
    description: 'Jobs em background com Redis e BullMQ.',
  },
];

const techStack = [
  { icon: '⚛️', name: 'Next.js 14' },
  { icon: '🔥', name: 'Firebase' },
  { icon: '🗄️', name: 'Redis' },
  { icon: '📘', name: 'TypeScript' },
  { icon: '🎨', name: 'Tailwind CSS' },
  { icon: '🧪', name: 'Jest' },
];

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  // Fallback para pt-BR se locale nao estiver definido
  const resolvedLocale = locale || 'pt-BR';

  return {
    props: {
      messages: (await import(`../locales/${resolvedLocale}/common.json`)).default,
    },
  };
}
