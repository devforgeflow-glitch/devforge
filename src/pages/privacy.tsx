import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { GetStaticPropsContext } from 'next';
import { Layout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui';
import { Shield, Lock, Eye, UserCheck } from 'lucide-react';

/**
 * Pagina de Politica de Privacidade
 *
 * @version 1.0.0
 */

export default function PrivacyPage() {
  const t = useTranslations();

  const sections = [
    {
      icon: Shield,
      title: t('privacy.sections.collection.title'),
      content: t('privacy.sections.collection.content'),
    },
    {
      icon: Lock,
      title: t('privacy.sections.security.title'),
      content: t('privacy.sections.security.content'),
    },
    {
      icon: Eye,
      title: t('privacy.sections.usage.title'),
      content: t('privacy.sections.usage.content'),
    },
    {
      icon: UserCheck,
      title: t('privacy.sections.rights.title'),
      content: t('privacy.sections.rights.content'),
    },
  ];

  return (
    <>
      <Head>
        <title>{t('privacy.meta.title')}</title>
        <meta name="description" content={t('privacy.meta.description')} />
      </Head>

      <Layout title={t('privacy.title')} description={t('privacy.description')}>
        <section className="py-12">
          <div className="container-app max-w-4xl">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold mb-4">{t('privacy.title')}</h1>
              <p className="text-muted-foreground">{t('privacy.lastUpdated')}: 28/12/2024</p>
            </div>

            <div className="space-y-6">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
                          <p className="text-muted-foreground whitespace-pre-line">{section.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>{t('privacy.contact')}</p>
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
