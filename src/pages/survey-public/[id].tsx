import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Card, CardContent, Button, Spinner, Input } from '@/components/ui';
import {
  TextQuestion,
  RatingQuestion,
  NPSQuestion,
  ChoiceQuestion,
  DateQuestion,
} from '@/components/surveys/questions';
import { useBrand } from '@/contexts/BrandContext';
import type { QuestionType } from '@/api/types/survey.types';

/**
 * Pagina Publica de Resposta de Pesquisa
 *
 * Permite que usuarios respondam pesquisas sem autenticacao.
 *
 * @version 1.0.0
 */

// Mock de pesquisa (substituir por API real)
const MOCK_SURVEY = {
  id: '1',
  title: 'Pesquisa de Satisfacao Q4 2024',
  description: 'Sua opiniao e muito importante para nos! Responda algumas perguntas rapidas.',
  settings: {
    allowAnonymous: true,
    requireEmail: false,
    showProgressBar: true,
  },
  questions: [
    {
      id: 'q1',
      type: 'rating' as QuestionType,
      text: 'Como voce avalia sua experiencia geral conosco?',
      description: 'Considere todos os aspectos da sua interacao.',
      required: true,
    },
    {
      id: 'q2',
      type: 'nps' as QuestionType,
      text: 'De 0 a 10, qual a probabilidade de voce nos recomendar a um amigo ou colega?',
      required: true,
    },
    {
      id: 'q3',
      type: 'choice' as QuestionType,
      text: 'Qual aspecto voce mais valoriza em nosso servico?',
      options: ['Qualidade do produto', 'Atendimento ao cliente', 'Preco justo', 'Rapidez na entrega', 'Facilidade de uso'],
      required: true,
    },
    {
      id: 'q4',
      type: 'text' as QuestionType,
      text: 'O que podemos fazer para melhorar sua experiencia?',
      description: 'Compartilhe suas sugestoes, criticas ou elogios.',
      required: false,
    },
  ],
};

type AnswerValue = string | number | null;

export default function PublicSurveyPage() {
  const router = useRouter();
  const { id } = router.query;
  const { brand } = useBrand();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const survey = MOCK_SURVEY; // TODO: Buscar via API
  const totalQuestions = survey.questions.length;
  const progress = ((currentStep + 1) / totalQuestions) * 100;

  useEffect(() => {
    // Simula carregamento
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const currentQuestion = survey.questions[currentStep];

  const handleAnswer = (value: AnswerValue) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const canProceed = () => {
    if (!currentQuestion.required) return true;
    const answer = answers[currentQuestion.id];
    return answer !== null && answer !== undefined && answer !== '';
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // TODO: Enviar respostas via API
      console.log('Submitting answers:', { surveyId: id, answers, email });

      // Simula delay de API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsCompleted(true);
    } catch (error) {
      console.error('Erro ao enviar respostas:', error);
      alert('Erro ao enviar respostas. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderiza pergunta atual
  const renderQuestion = () => {
    const value = answers[currentQuestion.id];

    switch (currentQuestion.type) {
      case 'text':
        return (
          <TextQuestion
            questionId={currentQuestion.id}
            text={currentQuestion.text}
            description={currentQuestion.description}
            required={currentQuestion.required}
            value={(value as string) || ''}
            onChange={handleAnswer}
          />
        );

      case 'rating':
        return (
          <RatingQuestion
            questionId={currentQuestion.id}
            text={currentQuestion.text}
            description={currentQuestion.description}
            required={currentQuestion.required}
            value={value as number | null}
            onChange={handleAnswer}
          />
        );

      case 'nps':
        return (
          <NPSQuestion
            questionId={currentQuestion.id}
            text={currentQuestion.text}
            description={currentQuestion.description}
            required={currentQuestion.required}
            value={value as number | null}
            onChange={handleAnswer}
          />
        );

      case 'choice':
        return (
          <ChoiceQuestion
            questionId={currentQuestion.id}
            text={currentQuestion.text}
            description={currentQuestion.description}
            required={currentQuestion.required}
            options={currentQuestion.options || []}
            value={value as string | null}
            onChange={handleAnswer}
          />
        );

      case 'date':
        return (
          <DateQuestion
            questionId={currentQuestion.id}
            text={currentQuestion.text}
            description={currentQuestion.description}
            required={currentQuestion.required}
            value={(value as string) || ''}
            onChange={handleAnswer}
          />
        );

      default:
        return <p>Tipo de pergunta nao suportado</p>;
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Spinner size="lg" />
      </div>
    );
  }

  // Pagina de agradecimento
  if (isCompleted) {
    return (
      <>
        <Head>
          <title>Obrigado! | {brand.name}</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
          <Card className="w-full max-w-lg text-center">
            <CardContent className="pt-12 pb-8">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 mx-auto mb-6 flex items-center justify-center">
                <svg
                  className="h-10 w-10 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-3">Obrigado pela sua resposta!</h1>
              <p className="text-muted-foreground mb-8">
                Suas respostas foram enviadas com sucesso. Sua opiniao e muito importante para nos.
              </p>
              <Link href="/">
                <Button variant="outline">Voltar ao inicio</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{survey.title} | {brand.name}</title>
        <meta name="description" content={survey.description} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-muted/30 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-4">
              <span className="text-xl font-bold text-primary-foreground">
                {brand.name.charAt(0)}
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{survey.title}</h1>
            <p className="text-muted-foreground">{survey.description}</p>
          </div>

          {/* Progress bar */}
          {survey.settings.showProgressBar && (
            <div className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Pergunta {currentStep + 1} de {totalQuestions}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Question Card */}
          <Card className="mb-6">
            <CardContent className="pt-8 pb-6">
              {renderQuestion()}
            </CardContent>
          </Card>

          {/* Email (se requerido) */}
          {survey.settings.requireEmail && currentStep === totalQuestions - 1 && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <label className="text-sm font-medium mb-1.5 block">
                  Seu email (para contato)
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Enviando...
                </>
              ) : currentStep === totalQuestions - 1 ? (
                <>
                  Enviar
                  <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              ) : (
                <>
                  Proxima
                  <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>
              Powered by{' '}
              <Link href="/" className="text-primary hover:underline">
                {brand.name}
              </Link>
            </p>
          </div>
        </div>
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

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
