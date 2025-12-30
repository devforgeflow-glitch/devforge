import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { GetStaticPropsContext } from 'next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Layout } from '@/components/layout';
import { Card, CardContent, Button, Badge, Input, Label } from '@/components/ui';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Clock,
  Shield
} from 'lucide-react';
import {
  sendContactMessageSchema,
  CONTACT_SUBJECTS,
  CONTACT_SUBJECT_LABELS,
  type SendContactMessageInput,
} from '@/api/lib/schemas/contact.schema';

/**
 * Página de Contato
 *
 * Formulário para usuários entrarem em contato.
 * Mensagens são enviadas para o painel admin.
 *
 * @version 1.0.0
 */

export default function ContactPage() {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SendContactMessageInput>({
    resolver: zodResolver(sendContactMessageSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      empresa: '',
      assunto: 'duvida',
      mensagem: '',
    },
  });

  const onSubmit = async (data: SendContactMessageInput) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao enviar mensagem');
      }

      setSubmitStatus('success');
      reset();
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t('contact.meta.title')}</title>
        <meta name="description" content={t('contact.meta.description')} />
      </Head>

      <Layout title={t('nav.contact')} description={t('contact.meta.description')}>
        {/* Hero */}
        <section className="py-16 text-center">
          <div className="container-app">
            <Badge variant="secondary" className="mb-4">
              {t('contact.hero.badge')}
            </Badge>
            <h1 className="heading-1 mb-4">
              {t('contact.hero.title')}{' '}
              <span className="gradient-text">{t('contact.hero.titleHighlight')}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('contact.hero.description')}
            </p>
          </div>
        </section>

        {/* Informações de Contato */}
        <section className="py-8">
          <div className="container-app">
            <div className="grid gap-6 md:grid-cols-3 mb-12">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{t('contact.info.email.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('contact.info.email.value')}</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{t('contact.info.responseTime.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('contact.info.responseTime.value')}</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{t('contact.info.data.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('contact.info.data.value')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Formulário */}
        <section className="py-8 pb-16">
          <div className="container-app">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-6 md:p-8">
                  {submitStatus === 'success' ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{t('contact.success.title')}</h3>
                      <p className="text-muted-foreground mb-6">
                        {t('contact.success.description')}
                      </p>
                      <Button onClick={() => setSubmitStatus('idle')}>
                        {t('contact.success.newMessage')}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="flex items-center gap-2 mb-6">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">{t('contact.form.title')}</h2>
                      </div>

                      {/* Nome e Email */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="nome">{t('contact.form.fields.name')} *</Label>
                          <Input
                            id="nome"
                            placeholder={t('contact.form.fields.namePlaceholder')}
                            {...register('nome')}
                            className={errors.nome ? 'border-red-500' : ''}
                          />
                          {errors.nome && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.nome.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">{t('contact.form.fields.email')} *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder={t('contact.form.fields.emailPlaceholder')}
                            {...register('email')}
                            className={errors.email ? 'border-red-500' : ''}
                          />
                          {errors.email && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Telefone e Empresa */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="telefone">{t('contact.form.fields.phone')}</Label>
                          <Input
                            id="telefone"
                            type="tel"
                            placeholder={t('contact.form.fields.phonePlaceholder')}
                            {...register('telefone')}
                            className={errors.telefone ? 'border-red-500' : ''}
                          />
                          {errors.telefone && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.telefone.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="empresa">{t('contact.form.fields.company')}</Label>
                          <Input
                            id="empresa"
                            placeholder={t('contact.form.fields.companyPlaceholder')}
                            {...register('empresa')}
                            className={errors.empresa ? 'border-red-500' : ''}
                          />
                          {errors.empresa && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.empresa.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Assunto */}
                      <div className="space-y-2">
                        <Label htmlFor="assunto">{t('contact.form.fields.subject')} *</Label>
                        <select
                          id="assunto"
                          {...register('assunto')}
                          className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                            errors.assunto ? 'border-red-500' : 'border-input'
                          }`}
                        >
                          {CONTACT_SUBJECTS.map((subject) => (
                            <option key={subject} value={subject}>
                              {CONTACT_SUBJECT_LABELS[subject]}
                            </option>
                          ))}
                        </select>
                        {errors.assunto && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.assunto.message}
                          </p>
                        )}
                      </div>

                      {/* Mensagem */}
                      <div className="space-y-2">
                        <Label htmlFor="mensagem">{t('contact.form.fields.message')} *</Label>
                        <textarea
                          id="mensagem"
                          rows={5}
                          placeholder={t('contact.form.fields.messagePlaceholder')}
                          {...register('mensagem')}
                          className={`w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none ${
                            errors.mensagem ? 'border-red-500' : 'border-input'
                          }`}
                        />
                        {errors.mensagem && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.mensagem.message}
                          </p>
                        )}
                      </div>

                      {/* Erro geral */}
                      {submitStatus === 'error' && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-800 dark:text-red-200">{t('contact.error.title')}</p>
                            <p className="text-sm text-red-600 dark:text-red-300">{errorMessage}</p>
                          </div>
                        </div>
                      )}

                      {/* Botão de envio */}
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {t('contact.form.submitting')}
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            {t('contact.form.submit')}
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        {t('contact.form.privacyNote')}{' '}
                        <Link href="/privacy" className="underline hover:text-primary">
                          {t('contact.form.privacyLink')}
                        </Link>
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
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
