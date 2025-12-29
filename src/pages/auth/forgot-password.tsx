import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';

/**
 * Pagina de Recuperacao de Senha
 *
 * Permite usuarios recuperarem acesso a conta.
 *
 * @version 1.0.0
 */

export default function ForgotPasswordPage() {
  const { resetPassword, loading, error, clearError, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccess(false);
    clearError();

    if (!email) {
      setLocalError('Digite seu email');
      return;
    }

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch {
      // Erro ja esta no contexto
    }
  };

  const displayError = localError || error;

  return (
    <>
      <Head>
        <title>Recuperar Senha | DevForge</title>
        <meta name="description" content="Recupere sua senha da plataforma DevForge" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <Card className="w-full max-w-md" variant="elevated">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl">Recuperar senha</CardTitle>
            <CardDescription>
              Digite seu email para receber instrucoes de recuperacao
            </CardDescription>
          </CardHeader>

          {success ? (
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-green-800 dark:text-green-200">
                  Email enviado!
                </h3>
                <p className="mt-2 text-sm text-green-700 dark:text-green-300">
                  Verifique sua caixa de entrada e siga as instrucoes para redefinir sua senha.
                </p>
              </div>
              <div className="text-center">
                <Link href="/auth/login" className="text-sm text-primary hover:underline">
                  Voltar para o login
                </Link>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {!isConfigured && (
                  <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4 text-sm text-yellow-800 dark:text-yellow-200">
                    Firebase nao configurado. Configure as credenciais para habilitar autenticacao.
                  </div>
                )}

                {displayError && (
                  <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                    {displayError}
                  </div>
                )}

                <Input
                  label="Email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || !isConfigured}
                  autoComplete="email"
                />
              </CardContent>

              <CardFooter className="flex-col gap-4">
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={loading}
                  disabled={!isConfigured}
                >
                  Enviar instrucoes
                </Button>

                <Link
                  href="/auth/login"
                  className="text-center text-sm text-muted-foreground hover:text-foreground"
                >
                  Voltar para o login
                </Link>
              </CardFooter>
            </form>
          )}
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
