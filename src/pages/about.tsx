import Head from 'next/head';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { GetStaticPropsContext } from 'next';
import { Layout } from '@/components/layout';
import { Card, CardContent, Button, Badge } from '@/components/ui';

/**
 * Pagina Sobre / Como Foi Feito
 *
 * Apresenta a stack tecnologica e arquitetura do projeto.
 * Totalmente traduzida para PT-BR, EN e ES.
 *
 * @version 2.0.0
 */

const TECH_STACK = [
  {
    categoryKey: 'frontend',
    technologies: [
      { name: 'Next.js 14', descKey: 'nextjs', icon: '⚡' },
      { name: 'React 19', descKey: 'react', icon: '⚛️' },
      { name: 'TypeScript 5', descKey: 'typescript', icon: '📘' },
      { name: 'Tailwind CSS', descKey: 'tailwind', icon: '🎨' },
    ],
  },
  {
    categoryKey: 'backend',
    technologies: [
      { name: 'Firebase', descKey: 'firebase', icon: '🔥' },
      { name: 'Redis', descKey: 'redis', icon: '🗄️' },
      { name: 'BullMQ', descKey: 'bullmq', icon: '📦' },
      { name: 'Zod', descKey: 'zod', icon: '✅' },
    ],
  },
  {
    categoryKey: 'ai',
    technologies: [
      { name: 'OpenAI GPT-4', descKey: 'openai', icon: '🤖' },
      { name: 'Anthropic Claude', descKey: 'claude', icon: '🧠' },
    ],
  },
  {
    categoryKey: 'devops',
    technologies: [
      { name: 'Vercel', descKey: 'vercel', icon: '▲' },
      { name: 'GitHub Actions', descKey: 'github', icon: '🔄' },
      { name: 'Sentry', descKey: 'sentry', icon: '🐛' },
    ],
  },
];

const TECH_DESCRIPTIONS: Record<string, Record<string, string>> = {
  frontend: {
    nextjs: 'Framework React com SSR, SSG e API Routes',
    react: 'Biblioteca de UI com hooks e componentes',
    typescript: 'Tipagem estatica para codigo mais seguro',
    tailwind: 'Framework CSS utility-first para estilizacao',
  },
  backend: {
    firebase: 'Firestore, Auth, Storage e Functions',
    redis: 'Cache, rate limiting e sessoes',
    bullmq: 'Filas de jobs para processamento em background',
    zod: 'Validacao e parsing de dados',
  },
  ai: {
    openai: 'Geracao de perguntas e analise de texto',
    claude: 'Alternativa para analise de sentimento',
  },
  devops: {
    vercel: 'Deploy automatico e edge functions',
    github: 'CI/CD com testes e deploy',
    sentry: 'Monitoramento de erros em producao',
  },
};

const ARCHITECTURE_LAYERS = [
  { layerKey: 'presentation', components: ['Pages', 'Components', 'Hooks', 'Contexts'], color: 'bg-blue-500' },
  { layerKey: 'apiRoutes', components: ['Middlewares', 'Validators', 'Controllers'], color: 'bg-green-500' },
  { layerKey: 'services', components: ['Survey Service', 'Response Service', 'AI Service'], color: 'bg-yellow-500' },
  { layerKey: 'infrastructure', components: ['Firebase', 'Redis', 'BullMQ', 'AI APIs'], color: 'bg-red-500' },
];

const SECURITY_LAYERS = [
  'Helmet (Security Headers)',
  'CORS configurado',
  'CSRF Protection',
  'JWT Authentication',
  'RBAC Permissions',
  'Rate Limiting',
  'Zod Validation',
  'Audit Logging',
  'PII Masking',
  'Error Sanitization',
  'N+1 Prevention',
  'Mass Assignment Protection',
  'IP Allowlist (Admin)',
  'Circuit Breaker',
  'SRI Policy',
  'security.txt',
  'Input Sanitization',
  'SQL Injection Prevention',
];

const TIMELINE = [
  { phaseKey: 'phase1', items: ['Dark Mode', 'i18n', 'Storybook'] },
  { phaseKey: 'phase2', items: ['BullMQ Jobs', 'AI Integration', 'White-label', 'SEO'] },
  { phaseKey: 'phase3', items: ['CRUD Surveys', 'Responses', 'Analytics', 'Billing'] },
  { phaseKey: 'phase4', items: ['Features Page', 'About Page', 'OpenAPI', 'E2E Tests'] },
];

export default function AboutPage() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t('about.meta.title')}</title>
        <meta name="description" content={t('about.meta.description')} />
      </Head>

      <Layout title={t('footer.about')} description={t('about.hero.description')}>
        {/* Hero */}
        <section className="py-16 text-center">
          <div className="container-app">
            <Badge variant="secondary" className="mb-4">
              {t('about.hero.badge')}
            </Badge>
            <h1 className="heading-1 mb-4">
              {t('about.hero.title')}{' '}
              <span className="gradient-text">{t('about.hero.titleHighlight')}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {t('about.hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="https://github.com/devforge/template" target="_blank">
                <Button size="lg">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  {t('about.cta.github')}
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg">
                  {t('about.cta.docs')}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-16 bg-muted/30">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-3">{t('about.techStack.title')}</h2>
              <p className="text-muted-foreground">{t('about.techStack.subtitle')}</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {TECH_STACK.map((category, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-4">
                      {t(`about.techStack.${category.categoryKey}`)}
                    </h3>
                    <div className="space-y-4">
                      {category.technologies.map((tech, techIndex) => (
                        <div key={techIndex} className="flex items-start gap-3">
                          <span className="text-2xl">{tech.icon}</span>
                          <div>
                            <p className="font-medium">{tech.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {TECH_DESCRIPTIONS[category.categoryKey][tech.descKey]}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="py-16">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-3">{t('about.architecture.title')}</h2>
              <p className="text-muted-foreground">{t('about.architecture.subtitle')}</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              {ARCHITECTURE_LAYERS.map((layer, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border"
                >
                  <div className={`w-4 h-4 rounded-full ${layer.color}`} />
                  <div className="flex-1">
                    <p className="font-semibold">{t(`about.architecture.${layer.layerKey}`)}</p>
                    <p className="text-sm text-muted-foreground">
                      {layer.components.join(' → ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="py-16 bg-muted/30">
          <div className="container-app">
            <div className="text-center mb-12">
              <Badge className="mb-4">{t('about.security.badge')}</Badge>
              <h2 className="heading-2 mb-3">{t('about.security.title')}</h2>
              <p className="text-muted-foreground">{t('about.security.subtitle')}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
              {SECURITY_LAYERS.map((layer, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border"
                >
                  <svg
                    className="h-5 w-5 text-green-500 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="text-sm">{layer}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-3">{t('about.timeline.title')}</h2>
              <p className="text-muted-foreground">{t('about.timeline.subtitle')}</p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-8">
                {TIMELINE.map((phase, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500 text-white">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {index < TIMELINE.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">Fase {index + 1}</Badge>
                        <span className="font-semibold">{t(`about.timeline.${phase.phaseKey}`)}</span>
                      </div>
                      <ul className="space-y-1">
                        {phase.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="text-sm text-muted-foreground flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Credits */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container-app text-center">
            <h2 className="heading-2 mb-4">{t('about.credits.title')}</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              {t('about.credits.description')}
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <span className="text-2xl">🤖</span>
                <span>{t('about.credits.claude')}</span>
              </div>
              <span className="text-white/50">+</span>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <span className="text-2xl">👨‍💻</span>
                <span>{t('about.credits.developer')}</span>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const { loadMessages } = await import('@/i18n');
  return {
    props: {
      messages: await loadMessages(locale || 'pt-BR'),
    },
  };
}
