import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from '@/components/ui';
import { CheckCircle, Key, User, Shield, ArrowRight } from 'lucide-react';

/**
 * Pagina: Seed Demo Users
 *
 * Cria usuarios de demonstracao no localStorage para testar a plataforma
 * quando o Firebase nao esta configurado.
 *
 * @version 1.0.0
 */

const DEMO_USERS_KEY = 'devforge_demo_users';

const DEMO_USERS = {
  'admin@devforge.com': {
    password: 'Admin@123',
    user: {
      uid: 'demo-admin-001',
      email: 'admin@devforge.com',
      displayName: 'Admin DevForge',
      photoURL: null,
      emailVerified: true,
      role: 'admin',
    },
  },
  'user@devforge.com': {
    password: 'User@123',
    user: {
      uid: 'demo-user-001',
      email: 'user@devforge.com',
      displayName: 'Usuario Teste',
      photoURL: null,
      emailVerified: true,
      role: 'user',
    },
  },
};

export default function SeedDemoPage() {
  const t = useTranslations();
  const router = useRouter();
  const [seeded, setSeeded] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);

  useEffect(() => {
    // Verificar se ja existe
    const existing = localStorage.getItem(DEMO_USERS_KEY);
    if (existing) {
      setAlreadyExists(true);
      setSeeded(true);
    }
  }, []);

  const handleSeed = () => {
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(DEMO_USERS));
    setSeeded(true);
    setAlreadyExists(false);
  };

  const handleClearAndSeed = () => {
    localStorage.removeItem(DEMO_USERS_KEY);
    localStorage.removeItem('devforge_auth_user');
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(DEMO_USERS));
    setSeeded(true);
    setAlreadyExists(false);
  };

  return (
    <>
      <Head>
        <title>{t('seedDemo.meta.title')}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 px-4 py-12">
        <Card className="w-full max-w-lg" variant="elevated">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Key className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">{t('seedDemo.title')}</CardTitle>
            <CardDescription>
              {t('seedDemo.description')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {seeded ? (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="h-6 w-6" />
                  <span className="font-semibold">
                    {alreadyExists ? t('seedDemo.success.alreadyExists') : t('seedDemo.success.created')}
                  </span>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t('seedDemo.users.admin.title')}</p>
                      <p className="text-xs text-muted-foreground">{t('seedDemo.users.admin.description')}</p>
                      <div className="mt-2 bg-background rounded p-2 space-y-1">
                        <p className="text-xs">
                          <span className="text-muted-foreground">{t('seedDemo.users.email')}</span>{' '}
                          <code className="bg-muted px-1 rounded">admin@devforge.com</code>
                        </p>
                        <p className="text-xs">
                          <span className="text-muted-foreground">{t('seedDemo.users.password')}</span>{' '}
                          <code className="bg-muted px-1 rounded">Admin@123</code>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t('seedDemo.users.user.title')}</p>
                      <p className="text-xs text-muted-foreground">{t('seedDemo.users.user.description')}</p>
                      <div className="mt-2 bg-background rounded p-2 space-y-1">
                        <p className="text-xs">
                          <span className="text-muted-foreground">{t('seedDemo.users.email')}</span>{' '}
                          <code className="bg-muted px-1 rounded">user@devforge.com</code>
                        </p>
                        <p className="text-xs">
                          <span className="text-muted-foreground">{t('seedDemo.users.password')}</span>{' '}
                          <code className="bg-muted px-1 rounded">User@123</code>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  {t('seedDemo.info.description')}
                </p>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-left">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Nota:</strong> {t('seedDemo.info.note')}
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex-col gap-3">
            {seeded ? (
              <>
                <Link href="/auth/login" className="w-full">
                  <Button className="w-full gap-2">
                    {t('seedDemo.actions.goToLogin')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" className="w-full" onClick={handleClearAndSeed}>
                  {t('seedDemo.actions.recreate')}
                </Button>
              </>
            ) : (
              <Button className="w-full" onClick={handleSeed}>
                {t('seedDemo.actions.create')}
              </Button>
            )}

            <Link href="/" className="text-sm text-muted-foreground hover:underline">
              {t('seedDemo.actions.backHome')}
            </Link>
          </CardFooter>
        </Card>
      </div>
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
