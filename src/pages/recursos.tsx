import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { Layout } from '@/components/layout';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import {
  BarChart3,
  ClipboardList,
  Users,
  Zap,
  Shield,
  Globe,
  Smartphone,
  Bell,
  FileText,
  Palette,
  Code,
  Lock,
  ArrowRight,
  CheckCircle,
  LucideIcon,
} from 'lucide-react';

/**
 * Página de Recursos
 *
 * Apresenta todos os recursos e funcionalidades da plataforma.
 *
 * @version 1.0.0
 */

const RECURSOS_BASE: { icon: LucideIcon; key: string }[] = [
  { icon: ClipboardList, key: 'surveys' },
  { icon: BarChart3, key: 'analytics' },
  { icon: Users, key: 'respondents' },
  { icon: Zap, key: 'automations' },
  { icon: Shield, key: 'security' },
  { icon: Globe, key: 'multilang' },
  { icon: Smartphone, key: 'mobile' },
  { icon: Bell, key: 'notifications' },
  { icon: FileText, key: 'export' },
  { icon: Palette, key: 'whitelabel' },
  { icon: Code, key: 'api' },
  { icon: Lock, key: 'access' },
];

export default function RecursosPage() {
  const t = useTranslations();

  const recursos = RECURSOS_BASE.map((item) => ({
    ...item,
    title: t(`recursos.items.${item.key}.title`),
    description: t(`recursos.items.${item.key}.description`),
    features: t.raw(`recursos.items.${item.key}.features`) as string[],
  }));
  return (
    <>
      <Head>
        <title>{t('recursos.meta.title')}</title>
        <meta name="description" content={t('recursos.meta.description')} />
      </Head>

      <Layout title={t('recursos.hero.title')} description={t('recursos.meta.description')}>
        {/* Hero */}
        <section className="py-16 text-center">
          <div className="container-app">
            <Badge variant="secondary" className="mb-4">
              {t('recursos.hero.badge')}
            </Badge>
            <h1 className="heading-1 mb-4">
              {t('recursos.hero.title')} <span className="gradient-text">{t('recursos.hero.titleHighlight')}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('recursos.hero.description')}
            </p>
          </div>
        </section>

        {/* Grid de Recursos */}
        <section className="py-12 pb-20">
          <div className="container-app">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recursos.map((recurso, index) => (
                <Card key={index} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <recurso.icon className="h-6 w-6 text-primary" />
                    </div>

                    <h3 className="text-lg font-semibold mb-2">{recurso.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {recurso.description}
                    </p>

                    <ul className="space-y-2">
                      {recurso.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/50">
          <div className="container-app text-center">
            <h2 className="heading-2 mb-4">{t('recursos.cta.title')}</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              {t('recursos.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2">
                  {t('recursos.cta.primary')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  {t('recursos.cta.secondary')}
                </Button>
              </Link>
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
