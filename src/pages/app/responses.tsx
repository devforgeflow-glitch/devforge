import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogCloseButton,
} from '@/components/ui';
import {
  MessageSquare,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  User,
  Star,
  TrendingUp,
  Clock,
  ChevronRight,
  X,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from 'lucide-react';

/**
 * Página: Respostas
 *
 * Exibe todas as respostas recebidas nas pesquisas do usuário.
 *
 * @version 1.0.0
 */

// Tipo de resposta
interface ResponseData {
  id: string;
  surveyId: string;
  surveyTitle: string;
  respondent: string;
  completedAt: string;
  rating: number;
  sentiment: string;
  answers: {
    question: string;
    answer: string;
    type: 'text' | 'rating' | 'choice';
  }[];
}

// Dados mock de respostas
const MOCK_RESPONSES: ResponseData[] = [
  {
    id: '1',
    surveyId: 'survey-1',
    surveyTitle: 'Pesquisa de Satisfação Q4 2024',
    respondent: 'joao.silva@email.com',
    completedAt: '2024-12-28T14:30:00',
    rating: 5,
    sentiment: 'positive',
    answers: [
      { question: 'Como você avalia nosso atendimento?', answer: '5', type: 'rating' },
      { question: 'O que mais gostou?', answer: 'Atendimento rápido e eficiente, equipe muito prestativa.', type: 'text' },
      { question: 'Recomendaria para um amigo?', answer: 'Sim, com certeza', type: 'choice' },
      { question: 'Qual departamento você contatou?', answer: 'Suporte Técnico', type: 'choice' },
    ],
  },
  {
    id: '2',
    surveyId: 'survey-1',
    surveyTitle: 'Pesquisa de Satisfação Q4 2024',
    respondent: 'maria.santos@email.com',
    completedAt: '2024-12-28T12:15:00',
    rating: 4,
    sentiment: 'positive',
    answers: [
      { question: 'Como você avalia nosso atendimento?', answer: '4', type: 'rating' },
      { question: 'O que mais gostou?', answer: 'Interface muito intuitiva e fácil de usar.', type: 'text' },
      { question: 'Recomendaria para um amigo?', answer: 'Sim', type: 'choice' },
      { question: 'Qual departamento você contatou?', answer: 'Vendas', type: 'choice' },
    ],
  },
  {
    id: '3',
    surveyId: 'survey-2',
    surveyTitle: 'Feedback de Produto',
    respondent: 'Anônimo',
    completedAt: '2024-12-27T18:45:00',
    rating: 3,
    sentiment: 'neutral',
    answers: [
      { question: 'Avalie o produto de 1 a 5', answer: '3', type: 'rating' },
      { question: 'O que podemos melhorar?', answer: 'Poderia ter mais opções de personalização.', type: 'text' },
      { question: 'Usaria novamente?', answer: 'Talvez', type: 'choice' },
    ],
  },
  {
    id: '4',
    surveyId: 'survey-2',
    surveyTitle: 'Feedback de Produto',
    respondent: 'pedro.costa@email.com',
    completedAt: '2024-12-27T10:20:00',
    rating: 2,
    sentiment: 'negative',
    answers: [
      { question: 'Avalie o produto de 1 a 5', answer: '2', type: 'rating' },
      { question: 'O que podemos melhorar?', answer: 'O tempo de carregamento está muito lento e houve alguns bugs.', type: 'text' },
      { question: 'Usaria novamente?', answer: 'Não', type: 'choice' },
    ],
  },
  {
    id: '5',
    surveyId: 'survey-3',
    surveyTitle: 'NPS Trimestral',
    respondent: 'ana.oliveira@email.com',
    completedAt: '2024-12-26T16:00:00',
    rating: 5,
    sentiment: 'positive',
    answers: [
      { question: 'De 0 a 10, qual a probabilidade de recomendar?', answer: '10', type: 'rating' },
      { question: 'O que justifica sua nota?', answer: 'Excelente produto, superou minhas expectativas!', type: 'text' },
      { question: 'Qual recurso mais utiliza?', answer: 'Dashboard de Analytics', type: 'choice' },
    ],
  },
];

const STATS_KEYS = ['total', 'thisWeek', 'avgRating', 'avgTime'] as const;
const STATS_VALUES = ['1,234', '+89', '4.2', '3m 45s'];
const STATS_ICONS = [MessageSquare, TrendingUp, Star, Clock];
const STATS_COLORS = ['text-blue-500', 'text-green-500', 'text-amber-500', 'text-purple-500'];

function formatDate(dateStr: string, locale: string = 'pt-BR') {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ResponsesPage() {
  const t = useTranslations();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSentiment, setFilterSentiment] = useState<string>('all');
  const [selectedResponse, setSelectedResponse] = useState<ResponseData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredResponses = MOCK_RESPONSES.filter((response) => {
    const matchesSearch =
      response.surveyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.respondent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSentiment = filterSentiment === 'all' || response.sentiment === filterSentiment;
    return matchesSearch && matchesSentiment;
  });

  const handleViewResponse = (response: ResponseData) => {
    setSelectedResponse(response);
    setIsModalOpen(true);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="h-5 w-5 text-green-500" />;
      case 'negative':
        return <ThumbsDown className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    const variants: Record<string, 'success' | 'destructive' | 'secondary'> = {
      positive: 'success',
      negative: 'destructive',
      neutral: 'secondary',
    };
    return (
      <Badge variant={variants[sentiment] || 'secondary'}>
        {t(`responsesPage.sentiment.${sentiment}`)}
      </Badge>
    );
  };

  return (
    <>
      <Head>
        <title>{t('responsesPage.meta.title')}</title>
      </Head>

      <Layout title={t('responsesPage.title')} description={t('responsesPage.description')}>
        <div className="container-app py-8">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            {STATS_KEYS.map((key, index) => {
              const Icon = STATS_ICONS[index];
              return (
                <Card key={key}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg bg-muted ${STATS_COLORS[index]}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{STATS_VALUES[index]}</p>
                        <p className="text-sm text-muted-foreground">{t(`responsesPage.stats.${key}`)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Filtros */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('responsesPage.filters.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterSentiment}
                    onChange={(e) => setFilterSentiment(e.target.value)}
                    className="px-4 py-2 border rounded-lg bg-background"
                  >
                    <option value="all">{t('responsesPage.filters.allSentiments')}</option>
                    <option value="positive">{t('responsesPage.sentiment.positive')}</option>
                    <option value="neutral">{t('responsesPage.sentiment.neutral')}</option>
                    <option value="negative">{t('responsesPage.sentiment.negative')}</option>
                  </select>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    {t('responsesPage.filters.export')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Respostas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {t('responsesPage.list.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredResponses.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{t('responsesPage.list.noResults')}</p>
                  </div>
                ) : (
                  filteredResponses.map((response) => (
                    <div
                      key={response.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{response.surveyTitle}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{response.respondent}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(response.completedAt, router.locale || 'pt-BR')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= response.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-gray-200 text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        {getSentimentBadge(response.sentiment)}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleViewResponse(response)}
                        >
                          <Eye className="h-4 w-4" />
                          {t('responsesPage.list.view')}
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modal de Detalhes da Resposta */}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} size="full">
          <DialogCloseButton onClose={() => setIsModalOpen(false)} />
            {selectedResponse && (
              <>
                <DialogTitle className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  {t('responsesPage.modal.title')}
                </DialogTitle>
                <DialogDescription>
                  {selectedResponse.surveyTitle}
                </DialogDescription>

                <div className="mt-4 space-y-6">
                  {/* Informacoes do Respondente */}
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedResponse.respondent}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(selectedResponse.completedAt, router.locale || 'pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= selectedResponse.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-gray-200 text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      {getSentimentIcon(selectedResponse.sentiment)}
                    </div>
                  </div>

                  {/* Respostas */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      {t('responsesPage.modal.answersCount', { count: selectedResponse.answers.length })}
                    </h4>
                    {selectedResponse.answers.map((answer, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <p className="font-medium text-sm mb-2">{answer.question}</p>
                        <div className="flex items-start gap-2">
                          {answer.type === 'rating' ? (
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= parseInt(answer.answer)
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'fill-gray-200 text-gray-200'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-muted-foreground">
                                ({answer.answer}/5)
                              </span>
                            </div>
                          ) : answer.type === 'choice' ? (
                            <Badge variant="outline">{answer.answer}</Badge>
                          ) : (
                            <p className="text-muted-foreground">{answer.answer}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    {t('responsesPage.modal.close')}
                  </Button>
                  <Button className="gap-2">
                    <Download className="h-4 w-4" />
                    {t('responsesPage.modal.export')}
                  </Button>
                </DialogFooter>
              </>
            )}
        </Dialog>
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
