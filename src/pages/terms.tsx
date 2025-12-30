import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { GetStaticPropsContext } from 'next';
import { Layout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui';
import { FileText, Users, AlertTriangle, Scale } from 'lucide-react';

/**
 * Pagina de Termos de Uso
 *
 * @version 1.0.0
 */

export default function TermsPage() {
  const t = useTranslations();

  const sections = [
    {
      icon: FileText,
      title: t('terms.sections.acceptance.title'),
      content: t('terms.sections.acceptance.content'),
    },
    {
      icon: Users,
      title: t('terms.sections.usage.title'),
      content: t('terms.sections.usage.content'),
    },
    {
      icon: AlertTriangle,
      title: t('terms.sections.restrictions.title'),
      content: t('terms.sections.restrictions.content'),
    },
    {
      icon: Scale,
      title: t('terms.sections.liability.title'),
      content: t('terms.sections.liability.content'),
    },
  ];

  return (
    <>
      <Head>
        <title>{t('terms.meta.title')}</title>
        <meta name="description" content={t('terms.meta.description')} />
      </Head>

      <Layout title={t('terms.title')} description={t('terms.description')}>
        <section className="py-12">
          <div className="container-app max-w-4xl">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold mb-4">{t('terms.title')}</h1>
              <p className="text-muted-foreground">{t('terms.lastUpdated')}: 28/12/2024</p>
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
              <p>{t('terms.contact')}</p>
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
