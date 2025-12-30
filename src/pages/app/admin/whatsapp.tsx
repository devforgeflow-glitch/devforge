import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { GetStaticPropsContext } from 'next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layout } from '@/components/layout';
import { Card, CardContent, Button, Input, Label, Badge } from '@/components/ui';
import {
  MessageCircle,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  Smartphone,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
} from 'lucide-react';
import { generateWhatsAppLink } from '@/utils/whatsapp';

/**
 * Pagina Admin: Configuracoes de WhatsApp e Redes Sociais
 *
 * Permite configurar:
 * - Numero e mensagem do botao flutuante WhatsApp
 * - Links das redes sociais
 *
 * @version 1.0.0
 */

// Schema de validacao
const whatsappFormSchema = z.object({
  whatsappNumber: z
    .string()
    .regex(/^\d{10,11}$/, {
      message: 'Numero deve conter 10-11 digitos (DDD + numero, sem espacos)',
    })
    .optional()
    .or(z.literal('')),
  whatsappMessage: z
    .string()
    .max(500, 'Mensagem muito longa (maximo 500 caracteres)')
    .optional()
    .or(z.literal('')),
  agentName: z
    .string()
    .max(50, 'Nome muito longo')
    .optional()
    .or(z.literal('')),
  welcomeMessage: z
    .string()
    .max(200, 'Mensagem muito longa')
    .optional()
    .or(z.literal('')),
  instagramUrl: z
    .string()
    .url('URL do Instagram invalida')
    .optional()
    .or(z.literal('')),
  facebookUrl: z
    .string()
    .url('URL do Facebook invalida')
    .optional()
    .or(z.literal('')),
  linkedinUrl: z
    .string()
    .url('URL do LinkedIn invalida')
    .optional()
    .or(z.literal('')),
  twitterUrl: z
    .string()
    .url('URL do Twitter/X invalida')
    .optional()
    .or(z.literal('')),
  youtubeUrl: z
    .string()
    .url('URL do YouTube invalida')
    .optional()
    .or(z.literal('')),
});

type WhatsAppFormData = z.infer<typeof whatsappFormSchema>;

// Chave do localStorage
const SETTINGS_KEY = 'devforge_whatsapp_settings';

export default function AdminWhatsAppPage() {
  const t = useTranslations();
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [previewLink, setPreviewLink] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<WhatsAppFormData>({
    resolver: zodResolver(whatsappFormSchema),
    defaultValues: {
      whatsappNumber: '',
      whatsappMessage: 'Ola! Vi seu site e gostaria de mais informacoes.',
      agentName: 'Suporte DevForge',
      welcomeMessage: 'Ola! Como podemos ajudar você hoje?',
      instagramUrl: '',
      facebookUrl: '',
      linkedinUrl: '',
      twitterUrl: '',
      youtubeUrl: '',
    },
  });

  // Carregar configuracoes salvas
  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        reset(settings);
      } catch (e) {
        console.error('Erro ao carregar configuracoes:', e);
      }
    }
  }, [reset]);

  // Atualizar preview do link
  const watchNumber = watch('whatsappNumber');
  const watchMessage = watch('whatsappMessage');

  useEffect(() => {
    if (watchNumber) {
      setPreviewLink(generateWhatsAppLink(watchNumber, watchMessage));
    } else {
      setPreviewLink('');
    }
  }, [watchNumber, watchMessage]);

  const onSubmit = async (data: WhatsAppFormData) => {
    setSaving(true);
    setSuccessMessage('');

    try {
      // Salvar no localStorage (em producao seria API/Firestore)
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));

      // Disparar evento para atualizar o botao flutuante
      window.dispatchEvent(new CustomEvent('whatsapp-settings-updated', { detail: data }));

      setSuccessMessage('Configuracoes salvas com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t('adminPages.whatsapp.meta.title')}</title>
      </Head>

      <Layout title={t('adminPages.whatsapp.title')} description={t('adminPages.whatsapp.description')}>
        <section className="py-8">
          <div className="container-app">
            <div className="max-w-3xl mx-auto">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{t('adminPages.whatsapp.header.title')}</h1>
                  <p className="text-muted-foreground">{t('adminPages.whatsapp.header.subtitle')}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Secao WhatsApp */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Smartphone className="h-5 w-5 text-green-500" />
                      <h2 className="text-lg font-semibold">{t('adminPages.whatsapp.whatsappSection.title')}</h2>
                    </div>

                    <div className="space-y-4">
                      {/* Numero */}
                      <div className="space-y-2">
                        <Label htmlFor="whatsappNumber">{t('adminPages.whatsapp.whatsappSection.number')}</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-4 py-2 border border-r-0 rounded-l-full bg-muted text-muted-foreground font-semibold">
                            +55
                          </span>
                          <Input
                            id="whatsappNumber"
                            type="tel"
                            placeholder="41999998888"
                            className="rounded-l-none"
                            {...register('whatsappNumber')}
                          />
                        </div>
                        {errors.whatsappNumber && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.whatsappNumber.message}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {t('adminPages.whatsapp.whatsappSection.numberHint')}
                        </p>
                      </div>

                      {/* Mensagem Padrao */}
                      <div className="space-y-2">
                        <Label htmlFor="whatsappMessage">{t('adminPages.whatsapp.whatsappSection.defaultMessage')}</Label>
                        <textarea
                          id="whatsappMessage"
                          rows={3}
                          placeholder="Ola! Vi seu site e gostaria de mais informacoes..."
                          className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                          {...register('whatsappMessage')}
                        />
                        {errors.whatsappMessage && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.whatsappMessage.message}
                          </p>
                        )}
                      </div>

                      {/* Nome do Atendente */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="agentName">{t('adminPages.whatsapp.whatsappSection.agentName')}</Label>
                          <Input
                            id="agentName"
                            placeholder="Suporte DevForge"
                            {...register('agentName')}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="welcomeMessage">{t('adminPages.whatsapp.whatsappSection.welcomeMessage')}</Label>
                          <Input
                            id="welcomeMessage"
                            placeholder="Ola! Como podemos ajudar?"
                            {...register('welcomeMessage')}
                          />
                        </div>
                      </div>

                      {/* Preview */}
                      {previewLink && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Eye className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-800 dark:text-green-200">{t('adminPages.whatsapp.whatsappSection.preview')}</span>
                          </div>
                          <code className="text-xs text-green-700 dark:text-green-300 break-all">
                            {previewLink}
                          </code>
                          <div className="mt-3">
                            <a
                              href={previewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-green-600 hover:underline"
                            >
                              {t('adminPages.whatsapp.whatsappSection.testLink')} →
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Secao Redes Sociais */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-6">{t('adminPages.whatsapp.socialSection.title')}</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      {t('adminPages.whatsapp.socialSection.description')}
                    </p>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="instagramUrl" className="flex items-center gap-2">
                          <Instagram className="h-4 w-4 text-pink-600" />
                          Instagram
                        </Label>
                        <Input
                          id="instagramUrl"
                          type="url"
                          placeholder="https://instagram.com/devforge"
                          {...register('instagramUrl')}
                        />
                        {errors.instagramUrl && (
                          <p className="text-sm text-red-500">{errors.instagramUrl.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="facebookUrl" className="flex items-center gap-2">
                          <Facebook className="h-4 w-4 text-blue-600" />
                          Facebook
                        </Label>
                        <Input
                          id="facebookUrl"
                          type="url"
                          placeholder="https://facebook.com/devforge"
                          {...register('facebookUrl')}
                        />
                        {errors.facebookUrl && (
                          <p className="text-sm text-red-500">{errors.facebookUrl.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="linkedinUrl" className="flex items-center gap-2">
                          <Linkedin className="h-4 w-4 text-blue-700" />
                          LinkedIn
                        </Label>
                        <Input
                          id="linkedinUrl"
                          type="url"
                          placeholder="https://linkedin.com/company/devforge"
                          {...register('linkedinUrl')}
                        />
                        {errors.linkedinUrl && (
                          <p className="text-sm text-red-500">{errors.linkedinUrl.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="twitterUrl" className="flex items-center gap-2">
                          <Twitter className="h-4 w-4 text-sky-500" />
                          Twitter / X
                        </Label>
                        <Input
                          id="twitterUrl"
                          type="url"
                          placeholder="https://twitter.com/devforge"
                          {...register('twitterUrl')}
                        />
                        {errors.twitterUrl && (
                          <p className="text-sm text-red-500">{errors.twitterUrl.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="youtubeUrl" className="flex items-center gap-2">
                          <Youtube className="h-4 w-4 text-red-600" />
                          YouTube
                        </Label>
                        <Input
                          id="youtubeUrl"
                          type="url"
                          placeholder="https://youtube.com/@devforge"
                          {...register('youtubeUrl')}
                        />
                        {errors.youtubeUrl && (
                          <p className="text-sm text-red-500">{errors.youtubeUrl.message}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Mensagem de Sucesso */}
                {successMessage && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 dark:text-green-200 font-medium">{successMessage}</span>
                  </div>
                )}

                {/* Botoes */}
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      localStorage.removeItem(SETTINGS_KEY);
                      reset();
                    }}
                  >
                    {t('adminPages.whatsapp.actions.restore')}
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t('adminPages.whatsapp.actions.saving')}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {t('adminPages.whatsapp.actions.save')}
                      </>
                    )}
                  </Button>
                </div>
              </form>
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
