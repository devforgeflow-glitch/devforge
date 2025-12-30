import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { Layout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
import {
  Code,
  Database,
  Shield,
  Zap,
  Globe,
  Layers,
  GitBranch,
  Server,
  Palette,
  TestTube,
  Rocket,
  ArrowRight,
  ExternalLink,
  LucideIcon,
} from 'lucide-react';

/**
 * Página Como Foi Feito
 *
 * Apresenta a stack tecnológica e arquitetura do projeto.
 * Serve como portfólio e demonstração técnica.
 *
 * @version 1.0.0
 */

const STACK_CATEGORIES_BASE: { key: string; icon: LucideIcon; technologies: { name: string; desc: string }[] }[] = [
  {
    key: 'frontend',
    icon: Palette,
    technologies: [
      { name: 'Next.js 14', desc: 'Framework React full-stack com App Router' },
      { name: 'React 19', desc: 'Biblioteca UI com hooks e Server Components' },
      { name: 'TypeScript 5', desc: 'Tipagem estática para maior segurança' },
      { name: 'Tailwind CSS', desc: 'Estilização utility-first' },
      { name: 'Radix UI', desc: 'Componentes acessíveis e sem estilo' },
      { name: 'Lucide Icons', desc: 'Ícones SVG otimizados' },
    ],
  },
  {
    key: 'backend',
    icon: Server,
    technologies: [
      { name: 'Next.js API Routes', desc: 'Endpoints serverless' },
      { name: 'Firebase Admin', desc: 'Firestore, Auth e Storage' },
      { name: 'Redis', desc: 'Cache e rate limiting' },
      { name: 'BullMQ', desc: 'Filas de jobs em background' },
      { name: 'Zod', desc: 'Validação de schemas em runtime' },
    ],
  },
  {
    key: 'security',
    icon: Shield,
    technologies: [
      { name: 'Helmet', desc: 'Security headers automáticos' },
      { name: 'CORS', desc: 'Controle de origem de requisições' },
      { name: 'CSRF Protection', desc: 'Proteção contra ataques CSRF' },
      { name: 'Rate Limiting', desc: 'Prevenção de abuso de API' },
      { name: 'JWT + RBAC', desc: 'Autenticação e permissões' },
      { name: 'Audit Logging', desc: 'Registro de todas as ações' },
    ],
  },
  {
    key: 'ai',
    icon: Zap,
    technologies: [
      { name: 'OpenAI GPT-4', desc: 'Geração de perguntas e resumos' },
      { name: 'Claude API', desc: 'Análise de sentimento' },
      { name: 'Embeddings', desc: 'Busca semântica de respostas' },
    ],
  },
  {
    key: 'i18n',
    icon: Globe,
    technologies: [
      { name: 'next-intl', desc: 'Framework de i18n para Next.js' },
      { name: 'Português (BR)', desc: 'Idioma principal' },
      { name: 'Inglês', desc: 'Suporte completo' },
      { name: 'Espanhol', desc: 'Suporte completo' },
    ],
  },
  {
    key: 'devops',
    icon: Rocket,
    technologies: [
      { name: 'Vercel', desc: 'Deploy automático e CDN global' },
      { name: 'GitHub Actions', desc: 'CI/CD automatizado' },
      { name: 'Sentry', desc: 'Monitoramento de erros' },
      { name: 'CodeQL', desc: 'Análise de segurança (SAST)' },
    ],
  },
];

const ARCHITECTURE_BASE: { key: string; icon: LucideIcon }[] = [
  { key: 'folders', icon: Layers },
  { key: 'patterns', icon: Code },
  { key: 'quality', icon: TestTube },
  { key: 'versioning', icon: GitBranch },
];

export default function ComoFoiFeitoPage() {
  const t = useTranslations();

  const stackCategories = STACK_CATEGORIES_BASE.map((cat) => ({
    ...cat,
    title: t(`howItWasMade.stack.${cat.key}.title`),
    description: t(`howItWasMade.stack.${cat.key}.description`),
  }));

  const arquitetura = ARCHITECTURE_BASE.map((item) => ({
    ...item,
    title: t(`howItWasMade.architecture.${item.key}.title`),
    items: t.raw(`howItWasMade.architecture.${item.key}.items`) as string[],
  }));

  return (
    <>
      <Head>
        <title>{t('howItWasMade.meta.title')}</title>
        <meta name="description" content={t('howItWasMade.meta.description')} />
      </Head>

      <Layout title={t('howItWasMade.hero.title')} description={t('howItWasMade.meta.description')}>
        {/* Hero */}
        <section className="py-16 text-center">
          <div className="container-app">
            <Badge variant="secondary" className="mb-4">
              {t('howItWasMade.hero.badge')}
            </Badge>
            <h1 className="heading-1 mb-4">
              {t('howItWasMade.hero.title')}{' '}
              <span className="gradient-text">{t('howItWasMade.hero.titleHighlight')}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('howItWasMade.hero.description')}
            </p>
          </div>
        </section>

        {/* Stack Tecnologica */}
        <section className="py-12">
          <div className="container-app">
            <h2 className="heading-2 text-center mb-8">{t('howItWasMade.sections.stack')}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {stackCategories.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <category.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.technologies.map((tech, i) => (
                        <li key={i} className="border-l-2 border-primary/20 pl-3">
                          <p className="font-medium text-sm">{tech.name}</p>
                          <p className="text-xs text-muted-foreground">{tech.desc}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Arquitetura */}
        <section className="py-12 bg-muted/50">
          <div className="container-app">
            <h2 className="heading-2 text-center mb-8">{t('howItWasMade.sections.architecture')}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {arquitetura.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {item.items.map((text, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Code className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Numeros */}
        <section className="py-12">
          <div className="container-app">
            <h2 className="heading-2 text-center mb-8">{t('howItWasMade.sections.numbers')}</h2>
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <p className="text-4xl font-bold text-primary">{t('howItWasMade.numbers.security.value')}</p>
                  <p className="text-sm text-muted-foreground">{t('howItWasMade.numbers.security.label')}</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <p className="text-4xl font-bold text-primary">{t('howItWasMade.numbers.components.value')}</p>
                  <p className="text-sm text-muted-foreground">{t('howItWasMade.numbers.components.label')}</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <p className="text-4xl font-bold text-primary">{t('howItWasMade.numbers.languages.value')}</p>
                  <p className="text-sm text-muted-foreground">{t('howItWasMade.numbers.languages.label')}</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <p className="text-4xl font-bold text-primary">{t('howItWasMade.numbers.typescript.value')}</p>
                  <p className="text-sm text-muted-foreground">{t('howItWasMade.numbers.typescript.label')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/50">
          <div className="container-app text-center">
            <h2 className="heading-2 mb-4">{t('howItWasMade.cta.title')}</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              {t('howItWasMade.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="gap-2">
                  {t('howItWasMade.cta.primary')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="gap-2">
                  {t('howItWasMade.cta.secondary')}
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
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
