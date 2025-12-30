import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';

/**
 * Pagina de Completar Perfil
 *
 * Exibida apos login social (Google) quando o perfil precisa ser completado.
 *
 * @version 1.0.0
 */

export default function CompleteProfilePage() {
  const t = useTranslations();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect para login se nao estiver autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // Pre-preencher nome do usuario do Google
  useEffect(() => {
    if (user?.displayName) {
      setName(user.displayName);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validacao
    if (!name.trim()) {
      setError(t('auth.completeProfile.errors.nameRequired'));
      return;
    }

    setLoading(true);

    try {
      // Aqui você implementaria a atualizacao do perfil no Firebase
      // await updateUserProfile({ name, phone, company });

      // Simula delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redireciona para dashboard
      router.push('/app/dashboard');
    } catch {
      setError(t('auth.completeProfile.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  // Loading enquanto verifica autenticacao
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">
          {t('status.loading')}
        </div>
      </div>
    );
  }

  // Se nao estiver autenticado, nao renderiza (vai redirecionar)
  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{t('auth.completeProfile.meta.title')}</title>
        <meta name="description" content={t('auth.completeProfile.meta.description')} />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <Card className="w-full max-w-md" variant="elevated">
          <CardHeader className="text-center">
            {/* Avatar do usuario */}
            {user.photoURL ? (
              <div className="mx-auto mb-4">
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Avatar'}
                  className="h-16 w-16 rounded-full border-4 border-primary/20"
                />
              </div>
            ) : (
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
            <CardTitle className="text-2xl">
              {t('auth.completeProfile.title')}
            </CardTitle>
            <CardDescription>
              {t('auth.completeProfile.description')}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Email (readonly) */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Email
                </label>
                <div className="px-3 py-2 rounded-md bg-muted text-muted-foreground text-sm">
                  {user.email}
                </div>
              </div>

              <Input
                label={t('auth.completeProfile.fields.name')}
                type="text"
                placeholder={t('auth.completeProfile.placeholders.name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                autoComplete="name"
              />

              <Input
                label={t('auth.completeProfile.fields.phone')}
                type="tel"
                placeholder={t('auth.completeProfile.placeholders.phone')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                autoComplete="tel"
                hint={t('auth.completeProfile.hints.phone')}
              />

              <Input
                label={t('auth.completeProfile.fields.company')}
                type="text"
                placeholder={t('auth.completeProfile.placeholders.company')}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={loading}
                autoComplete="organization"
                hint={t('auth.completeProfile.hints.company')}
              />
            </CardContent>

            <CardFooter className="flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                isLoading={loading}
              >
                {t('auth.completeProfile.submit')}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                {t('auth.completeProfile.terms')}
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}

// Carregar traducoes
export async function getStaticProps({ locale }: { locale?: string }) {
  const { loadMessages } = await import('@/i18n');
  return {
    props: {
      messages: await loadMessages(locale || 'pt-BR'),
    },
  };
}
