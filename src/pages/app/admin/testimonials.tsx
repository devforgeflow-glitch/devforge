import Head from 'next/head';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { GetStaticPropsContext } from 'next';
import { Layout } from '@/components/layout';
import { Card, CardContent, Button, Badge, Input } from '@/components/ui';
import {
  MessageSquareHeart,
  Star,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  Trash2,
  Filter,
  Plus,
  Loader2,
  X,
} from 'lucide-react';
import {
  TESTIMONIAL_STATUS,
  TESTIMONIAL_STATUS_LABELS,
  type Testimonial,
  type TestimonialStatus,
} from '@/api/lib/schemas/testimonial.schema';

/**
 * Pagina Admin: Gerenciamento de Depoimentos
 *
 * Permite:
 * - Listar todos os depoimentos
 * - Aprovar/Rejeitar depoimentos
 * - Controlar visibilidade
 * - Criar depoimentos manuais
 *
 * @version 1.0.0
 */

// Dados mock para demonstracao
const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    authorName: 'Maria Silva',
    authorCompany: 'Empresa ABC',
    authorRole: 'CEO',
    text: 'A plataforma transformou a maneira como coletamos feedback dos nossos clientes. A analise de sentimento por IA nos ajuda a entender melhor as necessidades do mercado.',
    rating: 5,
    status: 'approved',
    isPublic: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    authorName: 'Joao Santos',
    authorCompany: 'Tech Solutions',
    authorRole: 'Diretor de Produto',
    text: 'Implementamos o sistema em menos de uma semana e ja vimos resultados incriveis. O suporte tecnico e excepcional e a interface e muito intuitiva.',
    rating: 5,
    status: 'approved',
    isPublic: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    authorName: 'Cliente Novo',
    text: 'Acabei de comecar a usar e estou gostando muito. A interface e bem intuitiva e facil de usar. Recomendo para quem quer coletar feedback.',
    rating: 4,
    status: 'aguardando',
    isPublic: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    authorName: 'Usuario Teste',
    text: 'Nao gostei muito. Muito complicado.',
    rating: 2,
    status: 'rejected',
    isPublic: false,
    feedback: 'Depoimento muito curto e nao construtivo.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Cores dos status
const STATUS_COLORS: Record<TestimonialStatus, string> = {
  aguardando: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

const STATUS_ICONS: Record<TestimonialStatus, React.ReactNode> = {
  aguardando: <Clock className="h-4 w-4" />,
  approved: <CheckCircle className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
};

// Componente de estrelas (somente leitura)
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
          }`}
        />
      ))}
    </div>
  );
}

export default function AdminTestimonialsPage() {
  const t = useTranslations();
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(MOCK_TESTIMONIALS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TestimonialStatus | 'todos'>('todos');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  // Estatisticas
  const stats = {
    total: testimonials.length,
    aguardando: testimonials.filter((t) => t.status === 'aguardando').length,
    approved: testimonials.filter((t) => t.status === 'approved').length,
    rejected: testimonials.filter((t) => t.status === 'rejected').length,
    averageRating:
      testimonials.length > 0
        ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
        : '0',
  };

  // Filtrar depoimentos
  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      !searchTerm ||
      testimonial.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.text.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || testimonial.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Atualizar status
  const updateStatus = async (id: string, status: TestimonialStatus) => {
    setLoading(id);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              isPublic: status === 'approved',
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );

    if (selectedTestimonial?.id === id) {
      setSelectedTestimonial((prev) =>
        prev ? { ...prev, status, isPublic: status === 'approved' } : null
      );
    }

    setLoading(null);
  };

  // Toggle visibilidade
  const toggleVisibility = async (id: string) => {
    setLoading(id);
    await new Promise((resolve) => setTimeout(resolve, 300));

    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, isPublic: !t.isPublic, updatedAt: new Date().toISOString() }
          : t
      )
    );

    if (selectedTestimonial?.id === id) {
      setSelectedTestimonial((prev) =>
        prev ? { ...prev, isPublic: !prev.isPublic } : null
      );
    }

    setLoading(null);
  };

  // Deletar depoimento
  const deleteTestimonial = async (id: string) => {
    if (!confirm(t('adminPages.testimonials.actions.confirmDelete'))) return;

    setLoading(id);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setTestimonials((prev) => prev.filter((t) => t.id !== id));

    if (selectedTestimonial?.id === id) {
      setSelectedTestimonial(null);
    }

    setLoading(null);
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(router.locale || 'pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Head>
        <title>{t('adminPages.testimonials.meta.title')}</title>
      </Head>

      <Layout title={t('adminPages.testimonials.title')} description={t('adminPages.testimonials.description')}>
        <section className="py-8">
          <div className="container-app">
            {/* Header com Estatisticas */}
            <div className="grid gap-4 md:grid-cols-5 mb-8">
              <Card className="cursor-pointer hover:border-primary" onClick={() => setStatusFilter('todos')}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('adminPages.testimonials.stats.total')}</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <MessageSquareHeart className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-yellow-500" onClick={() => setStatusFilter('aguardando')}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('adminPages.testimonials.stats.pending')}</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats.aguardando}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-green-500" onClick={() => setStatusFilter('approved')}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('adminPages.testimonials.stats.approved')}</p>
                      <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-red-500" onClick={() => setStatusFilter('rejected')}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('adminPages.testimonials.stats.rejected')}</p>
                      <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('adminPages.testimonials.stats.average')}</p>
                      <p className="text-2xl font-bold text-amber-600">{stats.averageRating}</p>
                    </div>
                    <Star className="h-8 w-8 fill-amber-400 text-amber-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('adminPages.testimonials.filters.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TestimonialStatus | 'todos')}
                className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="todos">{t('adminPages.testimonials.filters.allStatuses')}</option>
                {TESTIMONIAL_STATUS.map((status) => (
                  <option key={status} value={status}>
                    {t(`adminPages.testimonials.status.${status}`)}
                  </option>
                ))}
              </select>
            </div>

            {/* Lista de Depoimentos */}
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Lista */}
              <div className="space-y-4">
                {filteredTestimonials.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageSquareHeart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">{t('adminPages.testimonials.list.noResults')}</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredTestimonials.map((testimonial) => (
                    <Card
                      key={testimonial.id}
                      className={`cursor-pointer transition-all hover:border-primary ${
                        selectedTestimonial?.id === testimonial.id
                          ? 'border-primary ring-2 ring-primary/20'
                          : ''
                      }`}
                      onClick={() => setSelectedTestimonial(testimonial)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">{testimonial.authorName || t('adminPages.testimonials.list.anonymous')}</span>
                              <StarRating rating={testimonial.rating} />
                            </div>
                            <p className="text-sm line-clamp-2 text-muted-foreground">
                              {testimonial.text}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                                STATUS_COLORS[testimonial.status]
                              }`}
                            >
                              {STATUS_ICONS[testimonial.status]}
                              {t(`adminPages.testimonials.status.${testimonial.status}`)}
                            </span>
                            {testimonial.isPublic ? (
                              <Eye className="h-4 w-4 text-green-500" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Detalhe do Depoimento */}
              <div className="lg:sticky lg:top-4 lg:self-start">
                {selectedTestimonial ? (
                  <Card>
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {selectedTestimonial.authorName || t('adminPages.testimonials.list.anonymous')}
                          </h3>
                          {(selectedTestimonial.authorRole || selectedTestimonial.authorCompany) && (
                            <p className="text-sm text-muted-foreground">
                              {selectedTestimonial.authorRole}
                              {selectedTestimonial.authorRole && selectedTestimonial.authorCompany && ' - '}
                              {selectedTestimonial.authorCompany}
                            </p>
                          )}
                        </div>
                        <button onClick={() => setSelectedTestimonial(null)} className="p-1 hover:bg-muted rounded">
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Rating */}
                      <div className="mb-4">
                        <StarRating rating={selectedTestimonial.rating} />
                      </div>

                      {/* Status atual */}
                      <div className="flex items-center gap-2 mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                            STATUS_COLORS[selectedTestimonial.status]
                          }`}
                        >
                          {STATUS_ICONS[selectedTestimonial.status]}
                          {t(`adminPages.testimonials.status.${selectedTestimonial.status}`)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {selectedTestimonial.isPublic ? t('adminPages.testimonials.detail.visible') : t('adminPages.testimonials.detail.hidden')}
                        </span>
                      </div>

                      {/* Texto */}
                      <div className="bg-muted/50 rounded-lg p-4 mb-6">
                        <p className="text-sm whitespace-pre-wrap">{selectedTestimonial.text}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {t('adminPages.testimonials.detail.sentOn')} {formatDate(selectedTestimonial.createdAt)}
                        </p>
                      </div>

                      {/* Acoes */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold">{t('adminPages.testimonials.actions.title')}</h4>

                        <div className="flex flex-wrap gap-2">
                          {selectedTestimonial.status !== 'approved' && (
                            <Button
                              size="sm"
                              onClick={() => updateStatus(selectedTestimonial.id, 'approved')}
                              disabled={loading === selectedTestimonial.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {loading === selectedTestimonial.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              )}
                              {t('adminPages.testimonials.actions.approve')}
                            </Button>
                          )}

                          {selectedTestimonial.status !== 'rejected' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(selectedTestimonial.id, 'rejected')}
                              disabled={loading === selectedTestimonial.id}
                              className="border-red-500 text-red-500 hover:bg-red-50"
                            >
                              {loading === selectedTestimonial.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-1" />
                              )}
                              {t('adminPages.testimonials.actions.reject')}
                            </Button>
                          )}

                          {selectedTestimonial.status === 'approved' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleVisibility(selectedTestimonial.id)}
                              disabled={loading === selectedTestimonial.id}
                            >
                              {loading === selectedTestimonial.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : selectedTestimonial.isPublic ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-1" />
                                  {t('adminPages.testimonials.actions.hide')}
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-1" />
                                  {t('adminPages.testimonials.actions.show')}
                                </>
                              )}
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteTestimonial(selectedTestimonial.id)}
                            disabled={loading === selectedTestimonial.id}
                            className="border-red-500 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            {t('adminPages.testimonials.actions.delete')}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {t('adminPages.testimonials.detail.selectPrompt')}
                      </p>
                    </CardContent>
                  </Card>
                )}
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
