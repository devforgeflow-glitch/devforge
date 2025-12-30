import { GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { Button, Card, CardContent, Badge } from '@/components/ui';
import { TestimonialsCarousel } from '@/components/testimonials';
import {
  ArrowRight,
  Check,
  Shield,
  Zap,
  Users,
  BarChart3,
  Palette,
  Globe,
  CreditCard,
  Settings,
  Bell,
  Mail,
  FileText,
  PieChart,
  Lock,
  Smartphone,
  Cloud,
  Code,
  ChevronRight,
  Star,
  Info,
} from 'lucide-react';

/**
 * Página Inicial - DevForge
 *
 * Landing page completa com:
 * - Hero Section
 * - Stack Tecnológico com explicações
 * - Gateways de Pagamento
 * - Showcase do Painel Admin
 * - Features de Valor
 * - CTA Final
 *
 * @version 3.0.0
 */

// Estrutura base dos arrays (textos são carregados via i18n)
const TECH_STACK_BASE = [
  { icon: '⚡', name: 'Next.js 14', key: 'nextjs' },
  { icon: '🔥', name: 'Firebase', key: 'firebase' },
  { icon: '🗄️', name: 'Redis', key: 'redis' },
  { icon: '📘', name: 'TypeScript', key: 'typescript' },
  { icon: '🎨', name: 'Tailwind CSS', key: 'tailwind' },
  { icon: '🧪', name: 'Jest', key: 'jest' },
  { icon: '🤖', name: 'OpenAI/Claude', key: 'ai' },
  { icon: '📱', name: 'PWA', key: 'pwa' },
];

const PAYMENT_GATEWAYS_BASE = [
  { name: 'Mercado Pago', logo: '🟡', recommended: true, key: 'mercadoPago', features: ['PIX', 'Cartão', 'Boleto', 'Parcelamento'] },
  { name: 'Stripe', logo: '🟣', recommended: false, key: 'stripe', features: ['Cartão Internacional', 'Apple Pay', 'Google Pay', 'Link de Pagamento'] },
  { name: 'PIX Direto', logo: '🟢', recommended: false, key: 'pix', features: ['QR Code', 'Copia e Cola', 'Notificação automática'] },
  { name: 'PagSeguro', logo: '🟠', recommended: false, key: 'pagSeguro', features: ['PIX', 'Cartão', 'Boleto', 'Maquininha'] },
];

const ADMIN_FEATURES_BASE = [
  { icon: BarChart3, key: 'dashboard' },
  { icon: Users, key: 'users' },
  { icon: CreditCard, key: 'plans' },
  { icon: Mail, key: 'emails' },
  { icon: Bell, key: 'notifications' },
  { icon: Palette, key: 'customization' },
  { icon: FileText, key: 'content' },
  { icon: PieChart, key: 'reports' },
  { icon: Lock, key: 'security' },
];

const VALUE_FEATURES_BASE = [
  { icon: Globe, key: 'multiLanguage' },
  { icon: Smartphone, key: 'pwa' },
  { icon: Shield, key: 'security' },
  { icon: Zap, key: 'ai' },
  { icon: Cloud, key: 'whiteLabel' },
  { icon: Code, key: 'api' },
];

export default function HomePage() {
  const t = useTranslations();
  const [selectedGateway, setSelectedGateway] = useState<number>(0);

  // Arrays com traduções dinâmicas
  const TECH_STACK = TECH_STACK_BASE.map((tech) => ({
    ...tech,
    category: t(`home.techStack.${tech.key}.category`),
    benefit: t(`home.techStack.${tech.key}.benefit`),
    description: t(`home.techStack.${tech.key}.description`),
  }));

  const PAYMENT_GATEWAYS = PAYMENT_GATEWAYS_BASE.map((gateway) => ({
    ...gateway,
    fees: t(`home.paymentGateways.${gateway.key}.fees`),
    settlement: t(`home.paymentGateways.${gateway.key}.settlement`),
    bestFor: t(`home.paymentGateways.${gateway.key}.bestFor`),
    description: t(`home.paymentGateways.${gateway.key}.description`),
  }));

  const ADMIN_FEATURES = ADMIN_FEATURES_BASE.map((feature) => ({
    ...feature,
    title: t(`home.adminFeatures.${feature.key}.title`),
    description: t(`home.adminFeatures.${feature.key}.description`),
    preview: t(`home.adminFeatures.${feature.key}.preview`),
  }));

  const VALUE_FEATURES = VALUE_FEATURES_BASE.map((feature) => ({
    ...feature,
    title: t(`home.valueFeatures.${feature.key}.title`),
    description: t(`home.valueFeatures.${feature.key}.description`),
    tag: t(`home.valueFeatures.${feature.key}.tag`),
  }));

  return (
    <Layout title={t('home.title')} description={t('app.description')}>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 gradient-bg" />

        <div className="container-app relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="mr-2 h-4 w-4" />
              {t('home.badge')}
            </div>

            <h1 className="heading-1 mb-6">
              <span className="gradient-text">{t('home.title')}</span>
              <br />
              <span className="text-foreground">{t('home.subtitle')}</span>
            </h1>

            <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
              {t('home.description')}
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button size="lg" className="min-w-[200px] gap-2">
                  {t('home.cta.primary')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  {t('home.cta.secondary')}
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>{t('home.trustBadges.security')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>{t('home.trustBadges.deploy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                <span>{t('home.trustBadges.languages')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack com explicacoes */}
      <section className="py-20 bg-muted/30">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <Badge variant="secondary" className="mb-4">{t('home.techSection.badge')}</Badge>
            <h2 className="heading-2 mb-4">{t('home.techTitle')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('home.techSection.description')}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TECH_STACK.map((tech, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{tech.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{tech.name}</h3>
                      </div>
                      <p className="text-xs text-primary font-medium mb-2">{tech.benefit}</p>
                      <p className="text-sm text-muted-foreground">{tech.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/about" className="inline-flex items-center gap-2 text-primary hover:underline">
              <Info className="h-4 w-4" />
              {t('home.techSection.seeDetails')}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Gateways de Pagamento */}
      <section className="py-20">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <Badge variant="secondary" className="mb-4">{t('home.payments.badge')}</Badge>
            <h2 className="heading-2 mb-4">{t('home.payments.title')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('home.payments.description')}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Lista de gateways */}
            <div className="space-y-3">
              {PAYMENT_GATEWAYS.map((gateway, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedGateway(index)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedGateway === index
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{gateway.logo}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{gateway.name}</span>
                        {gateway.recommended && (
                          <Badge className="text-xs">{t('home.payments.recommended')}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{gateway.bestFor}</p>
                    </div>
                    <ChevronRight className={`h-5 w-5 transition-transform ${selectedGateway === index ? 'rotate-90' : ''}`} />
                  </div>
                </button>
              ))}
            </div>

            {/* Detalhes do gateway selecionado */}
            <Card className="h-fit sticky top-24">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{PAYMENT_GATEWAYS[selectedGateway].logo}</span>
                  <div>
                    <h3 className="text-xl font-bold">{PAYMENT_GATEWAYS[selectedGateway].name}</h3>
                    <p className="text-sm text-muted-foreground">{PAYMENT_GATEWAYS[selectedGateway].description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">{t('home.payments.feeLabel')}</span>
                    <span className="font-semibold">{PAYMENT_GATEWAYS[selectedGateway].fees}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">{t('home.payments.settlementLabel')}</span>
                    <span className="font-semibold">{PAYMENT_GATEWAYS[selectedGateway].settlement}</span>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t('home.payments.methodsLabel')}</p>
                    <div className="flex flex-wrap gap-2">
                      {PAYMENT_GATEWAYS[selectedGateway].features.map((feature, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-400">
                      <strong>{t('home.payments.idealFor')}</strong> {PAYMENT_GATEWAYS[selectedGateway].bestFor}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Painel Administrativo */}
      <section className="py-20 bg-muted/30">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <Badge variant="secondary" className="mb-4">{t('home.adminPanel.badge')}</Badge>
            <h2 className="heading-2 mb-4">{t('home.adminPanel.title')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('home.adminPanel.description')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ADMIN_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                    <div className="text-xs text-muted-foreground/70 bg-muted/50 px-3 py-2 rounded-lg">
                      {t('home.example')} {feature.preview}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <p className="text-muted-foreground mb-4">
              {t('home.adminPanel.more')}
            </p>
            <Link href="/features">
              <Button variant="outline" className="gap-2">
                {t('home.adminPanel.seeAll')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features de Valor */}
      <section className="py-20">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <Badge variant="secondary" className="mb-4">{t('home.differentials.badge')}</Badge>
            <h2 className="heading-2 mb-4">{t('home.differentials.title')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('home.differentials.description')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {VALUE_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 rounded-xl border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{feature.title}</h3>
                      <Badge
                        variant={feature.tag === 'Incluso' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {feature.tag}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Seguranca */}
      <section className="py-20 bg-muted/30">
        <div className="container-app">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">{t('home.securitySection.badge')}</Badge>
              <h2 className="heading-2 mb-4">
                {t('home.securitySection.title')}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t('home.securitySection.description')}
              </p>

              <ul className="space-y-3 mb-6">
                {(t.raw('home.securitySection.items') as string[]).map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/about#security">
                <Button variant="outline" className="gap-2">
                  {t('home.securitySection.seeAll')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🔐', label: 'SSL/TLS', desc: t('home.securitySection.sslDesc') },
                  { icon: '🛡️', label: 'Firewall', desc: t('home.securitySection.firewallDesc') },
                  { icon: '🔍', label: 'Auditoria', desc: t('home.securitySection.auditDesc') },
                  { icon: '🇧🇷', label: 'LGPD', desc: t('home.securitySection.lgpdDesc') },
                ].map((item, i) => (
                  <div key={i} className="bg-background/80 backdrop-blur rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 bg-muted/30">
        <div className="container-app">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">{t('home.testimonials.badge')}</Badge>
            <h2 className="heading-2 mb-4">
              {t('home.testimonials.title')}{' '}
              <span className="gradient-text">{t('home.testimonials.titleHighlight')}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('home.testimonials.description')}
            </p>
          </div>

          <TestimonialsCarousel />

          <div className="text-center mt-8">
            <Link href="/auth/signup">
              <Button variant="outline" className="gap-2">
                {t('home.testimonials.joinThem')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container-app text-center">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <h2 className="heading-2 mb-4">{t('home.finalCta.title')}</h2>
          <p className="mb-8 text-lg opacity-90 max-w-2xl mx-auto">
            {t('home.finalCta.description')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2">
                {t('home.finalCta.requestQuote')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                {t('home.finalCta.seePlans')}
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm opacity-70">
            {t('home.finalCta.footer')}
          </p>
        </div>
      </section>
    </Layout>
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
