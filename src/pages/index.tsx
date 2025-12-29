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
  const t = useTranslations();

  return (
    <Layout
      title={t('home.title')}
      description={t('app.description')}
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
              {t('home.badge')}
            </div>

            {/* Titulo */}
            <h1 className="heading-1 mb-6">
              <span className="gradient-text">{t('home.title')}</span>
              <br />
              <span className="text-foreground">{t('home.subtitle')}</span>
            </h1>

            {/* Descricao */}
            <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
              {t('home.description')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button size="lg" className="min-w-[200px]">
                  {t('home.cta.primary')}
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  {t('home.cta.secondary')}
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
            <h2 className="heading-2 mb-4">{t('home.featuresTitle')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('home.featuresSubtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featureKeys.map((key) => (
              <div
                key={key}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-2xl">{featureIcons[key]}</span>
                </div>
                <h3 className="heading-4 mb-2">{t(`home.features.${key}.title`)}</h3>
                <p className="text-muted-foreground">{t(`home.features.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="heading-2 mb-4">{t('home.techTitle')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('home.techSubtitle')}
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
          <h2 className="heading-2 mb-4">{t('home.ctaTitle')}</h2>
          <p className="mb-8 text-lg opacity-90">
            {t('home.ctaSubtitle')}
          </p>
          <Link href="https://github.com/devforge/template" target="_blank">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              {t('home.ctaButton')}
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

const featureKeys = ['darkMode', 'i18n', 'security', 'storybook', 'ai', 'bullmq'] as const;

const featureIcons: Record<string, string> = {
  darkMode: '🌙',
  i18n: '🌐',
  security: '🔐',
  storybook: '📊',
  ai: '🤖',
  bullmq: '⚡',
};

const techStack = [
  { icon: '⚛️', name: 'Next.js 14' },
  { icon: '🔥', name: 'Firebase' },
  { icon: '🗄️', name: 'Redis' },
  { icon: '📘', name: 'TypeScript' },
  { icon: '🎨', name: 'Tailwind CSS' },
  { icon: '🧪', name: 'Jest' },
];

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const { loadMessages } = await import('@/i18n');
  return {
    props: {
      messages: await loadMessages(locale || 'pt-BR'),
    },
  };
}
