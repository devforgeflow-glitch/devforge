import Head from 'next/head';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { GetStaticPropsContext } from 'next';
import { Layout } from '@/components/layout';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import { SecurityLayersAccordion } from '@/components/about';
import { Info, TrendingUp, Award, Zap } from 'lucide-react';

/**
 * Página Sobre / Como Foi Feito
 *
 * Apresenta a stack tecnológica e arquitetura do projeto
 * com explicações simples para usuários não-técnicos.
 *
 * Objetivo: Transparência total - mostrar o valor sem jargões
 *
 * @version 4.0.0
 */

// Stack com explicações simples para leigos e justificativa de mercado
const TECH_STACK = [
  {
    categoryKey: 'frontend',
    categoryExplanation: 'A parte visual que você vê e interage - botões, formulários, menus',
    technologies: [
      {
        name: 'Next.js 14',
        icon: '⚡',
        technicalDesc: 'Framework React com SSR e API Routes',
        simpleDesc: 'O motor principal que faz o site carregar rápido e funcionar bem no Google',
        whyBest: 'Usado pela Netflix, TikTok, Twitch e Nike. É o framework mais popular do mundo para criar sites modernos, com +5 milhões de downloads por semana.',
        marketShare: 'Líder de mercado',
      },
      {
        name: 'React 19',
        icon: '⚛️',
        technicalDesc: 'Biblioteca de UI com hooks e componentes',
        simpleDesc: 'Tecnologia do Facebook/Meta que permite criar interfaces modernas e responsivas',
        whyBest: 'Criado pelo Facebook e usado por 40% de todos os sites modernos. Instagram, WhatsApp Web, Airbnb e Uber usam React.',
        marketShare: '#1 em popularidade',
      },
      {
        name: 'TypeScript 5',
        icon: '📘',
        technicalDesc: 'Tipagem estática para código mais seguro',
        simpleDesc: 'Uma camada extra de verificação que evita erros antes mesmo de o site ir ao ar',
        whyBest: 'Desenvolvido pela Microsoft, adotado por Google, Slack e Asana. Reduz bugs em até 15% segundo estudos.',
        marketShare: 'Padrão da indústria',
      },
      {
        name: 'Tailwind CSS',
        icon: '🎨',
        technicalDesc: 'Framework CSS utility-first',
        simpleDesc: 'Sistema de design que garante visual consistente e profissional em todas as telas',
        whyBest: 'O framework CSS que mais cresce no mundo. Usado por Shopify, OpenAI, NASA e GitHub. Permite criar interfaces 3x mais rápido.',
        marketShare: 'Crescimento de 300%',
      },
    ],
  },
  {
    categoryKey: 'backend',
    categoryExplanation: 'A parte "nos bastidores" que processa dados e mantém tudo funcionando',
    technologies: [
      {
        name: 'Firebase',
        icon: '🔥',
        technicalDesc: 'Firestore, Auth, Storage e Functions',
        simpleDesc: 'Infraestrutura do Google que guarda seus dados com segurança de nível mundial',
        whyBest: 'Plataforma do Google usada por +3 milhões de apps. The New York Times, Duolingo e Alibaba confiam no Firebase.',
        marketShare: 'Líder em BaaS',
      },
      {
        name: 'Redis',
        icon: '🗄️',
        technicalDesc: 'Cache, rate limiting e sessões',
        simpleDesc: 'Memória ultra-rápida que deixa o sistema mais ágil e protege contra ataques',
        whyBest: 'O banco de dados em memória mais popular do mundo. Twitter, GitHub, StackOverflow e Pinterest usam Redis para alta performance.',
        marketShare: '#1 em cache',
      },
      {
        name: 'BullMQ',
        icon: '📦',
        technicalDesc: 'Filas de jobs para processamento em background',
        simpleDesc: 'Sistema que executa tarefas pesadas sem travar a experiência do usuário',
        whyBest: 'A biblioteca de filas mais robusta para Node.js. Processa milhões de jobs por dia em empresas como Microsoft e Autodesk.',
        marketShare: 'Mais confiável',
      },
      {
        name: 'Zod',
        icon: '✅',
        technicalDesc: 'Validação e parsing de dados',
        simpleDesc: 'Inspetor que verifica se todas as informações estão corretas e seguras',
        whyBest: 'A biblioteca de validação mais moderna e type-safe. Recomendada oficialmente pelo time do TypeScript.',
        marketShare: 'Mais moderna',
      },
    ],
  },
  {
    categoryKey: 'ai',
    categoryExplanation: 'Inteligência Artificial que automatiza tarefas e gera insights',
    technologies: [
      {
        name: 'OpenAI GPT-4',
        icon: '🤖',
        technicalDesc: 'Geração de perguntas e análise de texto',
        simpleDesc: 'A mesma IA do ChatGPT, usada para criar pesquisas e analisar respostas automaticamente',
        whyBest: 'A IA mais avançada do mundo. Usada por +100 milhões de usuários e integrada em produtos da Microsoft, Salesforce e mais.',
        marketShare: 'Líder absoluta',
      },
      {
        name: 'Anthropic Claude',
        icon: '🧠',
        technicalDesc: 'Análise de sentimento',
        simpleDesc: 'IA alternativa que entende emoções e opiniões nas respostas dos usuários',
        whyBest: 'Criada por ex-pesquisadores da OpenAI. Conhecida por ser mais precisa em análise de texto e menos propensa a erros.',
        marketShare: 'Maior precisão',
      },
    ],
  },
  {
    categoryKey: 'devops',
    categoryExplanation: 'Ferramentas que mantêm o sistema sempre no ar e funcionando bem',
    technologies: [
      {
        name: 'Vercel',
        icon: '▲',
        technicalDesc: 'Deploy automático e edge functions',
        simpleDesc: 'Plataforma que coloca o site no ar automaticamente em servidores pelo mundo todo',
        whyBest: 'Criada pelos mesmos desenvolvedores do Next.js. Washington Post, Notion e Loom usam Vercel. Tempo de deploy de apenas 5 segundos.',
        marketShare: 'Melhor para Next.js',
      },
      {
        name: 'GitHub Actions',
        icon: '🔄',
        technicalDesc: 'CI/CD com testes e deploy',
        simpleDesc: 'Robô que testa tudo automaticamente antes de qualquer atualização ir ao ar',
        whyBest: 'A maior plataforma de código do mundo com +100 milhões de desenvolvedores. CI/CD gratuito e integrado nativamente.',
        marketShare: '#1 em CI/CD',
      },
      {
        name: 'Sentry',
        icon: '🐛',
        technicalDesc: 'Monitoramento de erros em produção',
        simpleDesc: 'Vigia 24h que nos avisa imediatamente se algo der errado no sistema',
        whyBest: 'Usado por Disney, Cloudflare e Microsoft. Detecta erros em tempo real antes que afetem muitos usuários.',
        marketShare: 'Líder em APM',
      },
    ],
  },
];

// Camadas de arquitetura com explicações
const ARCHITECTURE_LAYERS = [
  {
    layerKey: 'presentation',
    components: ['Páginas', 'Componentes', 'Hooks', 'Contextos'],
    color: 'bg-blue-500',
    explanation: 'Tudo que você vê na tela - menus, botões, formulários',
  },
  {
    layerKey: 'apiRoutes',
    components: ['Middlewares', 'Validadores', 'Controllers'],
    color: 'bg-green-500',
    explanation: 'Portões de entrada que verificam e direcionam suas solicitações',
  },
  {
    layerKey: 'services',
    components: ['Pesquisas', 'Respostas', 'Inteligência Artificial'],
    color: 'bg-yellow-500',
    explanation: 'O "cérebro" que processa suas informações e executa ações',
  },
  {
    layerKey: 'infrastructure',
    components: ['Banco de Dados', 'Cache', 'Filas', 'APIs de IA'],
    color: 'bg-red-500',
    explanation: 'A base sólida onde seus dados são armazenados com segurança',
  },
];

const TIMELINE = [
  { phaseKey: 'phase1', items: ['Modo Escuro', 'Multi-idioma', 'Biblioteca de Componentes'] },
  { phaseKey: 'phase2', items: ['Processamento em Segundo Plano', 'Integração com IA', 'Personalização Visual'] },
  { phaseKey: 'phase3', items: ['Criação de Pesquisas', 'Coleta de Respostas', 'Painéis de Análise', 'Pagamentos'] },
  { phaseKey: 'phase4', items: ['Página de Recursos', 'Documentação', 'Testes Automatizados', 'Lançamento'] },
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
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              {t('about.hero.description')}
            </p>

            {/* Nota de transparência */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm mb-8">
              <Info className="h-4 w-4" />
              <span>{t('about.transparency')}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {t('about.buttons.demo')}
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" size="lg">
                  {t('about.buttons.resources')}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Intro sobre escolhas */}
        <section className="py-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="container-app">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Award className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">{t('about.whyTech.title')}</h2>
              </div>
              <p className="text-muted-foreground">
                {t('about.whyTech.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Tech Stack com explicações e justificativas */}
        <section className="py-16 bg-muted/30">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-3">{t('about.techStack.title')}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('about.techStack.intro')}
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {TECH_STACK.map((category, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg mb-1">
                        {t(`about.techStack.${category.categoryKey}`)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t(`about.techStack.categories.${category.categoryKey}`)}
                      </p>
                    </div>
                    <div className="space-y-6">
                      {category.technologies.map((tech, techIndex) => (
                        <div key={techIndex} className="border-l-2 border-primary/30 pl-4">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{tech.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold">{tech.name}</p>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                  {tech.marketShare}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {tech.simpleDesc}
                              </p>

                              {/* Por que é a melhor opção */}
                              <div className="mt-2 p-2 bg-green-500/5 border border-green-500/20 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                                  <p className="text-xs text-green-700 dark:text-green-400">
                                    <strong>{t('about.labels.whyChosen')}</strong> {tech.whyBest}
                                  </p>
                                </div>
                              </div>

                              {/* Termo técnico */}
                              <p className="text-xs text-muted-foreground/50 mt-2 font-mono">
                                {t('about.labels.technicalTerm')} {tech.technicalDesc}
                              </p>
                            </div>
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

        {/* Arquitetura com explicações */}
        <section className="py-16">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-3">{t('about.architecture.title')}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('about.architecture.intro')}
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              {ARCHITECTURE_LAYERS.map((layer, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-4 h-4 rounded-full ${layer.color} mt-1 shrink-0`} />
                  <div className="flex-1">
                    <p className="font-semibold">{t(`about.architecture.${layer.layerKey}`)}</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t(`about.architecture.layers.${layer.layerKey}`)}
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      {t('about.labels.components')} {(t.raw(`about.architecture.components.${layer.layerKey}`) as string[]).join(' → ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security - Acordeão com explicações */}
        <section className="py-16 bg-muted/30">
          <div className="container-app">
            <div className="text-center mb-12">
              <Badge className="mb-4">{t('about.security.badge')}</Badge>
              <h2 className="heading-2 mb-3">{t('about.security.title')}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('about.security.intro')}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <SecurityLayersAccordion />
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-3">{t('about.timeline.title')}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('about.timeline.intro')}
              </p>
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
                        <Badge variant="secondary">{t('about.labels.phase')} {index + 1}</Badge>
                        <span className="font-semibold">{t(`about.timeline.${phase.phaseKey}`)}</span>
                      </div>
                      <ul className="space-y-1">
                        {(t.raw(`about.timeline.items.${phase.phaseKey}`) as string[]).map((item, itemIndex) => (
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
