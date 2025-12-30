import Head from 'next/head';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { GetStaticPropsContext } from 'next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Layout } from '@/components/layout';
import { Card, CardContent, Button, Badge, Input, Label } from '@/components/ui';
import {
  MessageSquareHeart,
  Star,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import {
  createTestimonialSchema,
  type CreateTestimonialInput,
} from '@/api/lib/schemas/testimonial.schema';

/**
 * Pagina: Enviar Depoimento
 *
 * Permite usuarios autenticados enviar depoimentos
 * que serao revisados pelo admin antes de publicar.
 *
 * @version 1.0.0
 */

// Componente de rating com estrelas
function StarRating({
  value,
  onChange,
  disabled = false,
  t,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  t: (key: string) => string;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className={`p-1 transition-transform hover:scale-110 ${
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                star <= (hover || value)
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-muted-foreground ml-2">
        {value > 0 ? t(`testimonialPage.rating.${value}`) : t('testimonialPage.rating.select')}
      </span>
    </div>
  );
}

export default function TestimonialPage() {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [rating, setRating] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateTestimonialInput>({
    resolver: zodResolver(createTestimonialSchema),
    defaultValues: {
      text: '',
      rating: 0,
      authorName: '',
      authorCompany: '',
      authorRole: '',
    },
  });

  const handleRatingChange = (value: number) => {
    setRating(value);
    setValue('rating', value);
  };

  const onSubmit = async (data: CreateTestimonialInput) => {
    if (rating === 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simular envio (em producao seria API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitStatus('success');
      reset();
      setRating(0);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t('testimonialPage.meta.title')}</title>
      </Head>

      <Layout title={t('testimonialPage.title')} description={t('testimonialPage.description')}>
        <section className="py-12">
          <div className="container-app">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquareHeart className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">{t('testimonialPage.header.title')}</h1>
                <p className="text-muted-foreground">
                  {t('testimonialPage.header.description')}
                </p>
              </div>

              <Card>
                <CardContent className="p-6 md:p-8">
                  {submitStatus === 'success' ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{t('testimonialPage.success.title')}</h3>
                      <p className="text-muted-foreground mb-6">
                        {t('testimonialPage.success.description')}
                      </p>
                      <Button onClick={() => setSubmitStatus('idle')}>
                        {t('testimonialPage.success.sendAnother')}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      {/* Avaliação */}
                      <div className="space-y-3">
                        <Label className="text-base">{t('testimonialPage.form.ratingLabel')}</Label>
                        <StarRating
                          value={rating}
                          onChange={handleRatingChange}
                          disabled={isSubmitting}
                          t={t}
                        />
                        {rating === 0 && (
                          <p className="text-sm text-muted-foreground">
                            {t('testimonialPage.form.ratingHint')}
                          </p>
                        )}
                      </div>

                      {/* Depoimento */}
                      <div className="space-y-2">
                        <Label htmlFor="text">{t('testimonialPage.form.testimonialLabel')}</Label>
                        <textarea
                          id="text"
                          rows={5}
                          placeholder={t('testimonialPage.form.testimonialPlaceholder')}
                          disabled={isSubmitting}
                          {...register('text')}
                          className={`w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none ${
                            errors.text ? 'border-red-500' : 'border-input'
                          }`}
                        />
                        {errors.text && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.text.message}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {t('testimonialPage.form.testimonialHint')}
                        </p>
                      </div>

                      {/* Informacoes do autor */}
                      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{t('testimonialPage.form.optionalInfo')}</span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="authorName">{t('testimonialPage.form.nameLabel')}</Label>
                            <Input
                              id="authorName"
                              placeholder={t('testimonialPage.form.namePlaceholder')}
                              disabled={isSubmitting}
                              {...register('authorName')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="authorRole">{t('testimonialPage.form.roleLabel')}</Label>
                            <Input
                              id="authorRole"
                              placeholder={t('testimonialPage.form.rolePlaceholder')}
                              disabled={isSubmitting}
                              {...register('authorRole')}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="authorCompany">{t('testimonialPage.form.companyLabel')}</Label>
                          <Input
                            id="authorCompany"
                            placeholder={t('testimonialPage.form.companyPlaceholder')}
                            disabled={isSubmitting}
                            {...register('authorCompany')}
                          />
                        </div>
                      </div>

                      {/* Erro geral */}
                      {submitStatus === 'error' && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-800 dark:text-red-200">
                              {t('testimonialPage.error.title')}
                            </p>
                            <p className="text-sm text-red-600 dark:text-red-300">
                              {t('testimonialPage.error.description')}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Botao de envio */}
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isSubmitting || rating === 0}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {t('testimonialPage.form.submitting')}
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            {t('testimonialPage.form.submit')}
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        {t('testimonialPage.form.reviewNotice')}
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
