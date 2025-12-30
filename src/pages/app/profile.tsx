import Head from 'next/head';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { GetStaticPropsContext } from 'next';
import { Layout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui';
import { User, Mail, Building, Save, Camera } from 'lucide-react';
import { useAuth } from '@/contexts';

/**
 * Pagina de Perfil do Usuario
 *
 * @version 1.0.0
 */

export default function ProfilePage() {
  const t = useTranslations();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    company: '',
    role: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const userInitials = user?.displayName
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'U';

  return (
    <>
      <Head>
        <title>{t('profile.meta.title')}</title>
      </Head>

      <Layout title={t('profile.title')} description={t('profile.description')}>
        <section className="py-8">
          <div className="container-app max-w-2xl">
            {/* Avatar */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-3xl font-bold text-primary-foreground">
                      {userInitials}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-background border rounded-full hover:bg-accent transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{user?.displayName || t('profile.anonymous')}</h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <p className="text-sm text-primary mt-1">{user?.role === 'admin' ? 'Administrador' : t('profile.member')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formulario */}
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.editInfo')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      <User className="h-4 w-4 inline mr-2" />
                      {t('profile.fields.name')}
                    </label>
                    <Input
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      placeholder={t('profile.fields.namePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      <Mail className="h-4 w-4 inline mr-2" />
                      {t('profile.fields.email')}
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{t('profile.fields.emailNote')}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      <Building className="h-4 w-4 inline mr-2" />
                      {t('profile.fields.company')}
                    </label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder={t('profile.fields.companyPlaceholder')}
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                      {isSaving ? (
                        t('profile.saving')
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {t('profile.save')}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
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
