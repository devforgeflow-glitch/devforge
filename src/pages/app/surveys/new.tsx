import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AuthLayout } from '@/components/layout/AuthLayout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Textarea,
  Checkbox,
  Spinner,
} from '@/components/ui';
import { QuestionEditor, type EditorQuestion } from '@/components/surveys/QuestionEditor';
import { ulid } from 'ulid';

/**
 * Pagina de Criacao de Pesquisa
 *
 * Formulario completo para criar uma nova pesquisa.
 *
 * @version 1.0.0
 */

interface SurveyFormData {
  title: string;
  description: string;
  questions: EditorQuestion[];
  settings: {
    allowAnonymous: boolean;
    requireEmail: boolean;
    showProgressBar: boolean;
  };
}

const DEFAULT_FORM_DATA: SurveyFormData = {
  title: '',
  description: '',
  questions: [],
  settings: {
    allowAnonymous: true,
    requireEmail: false,
    showProgressBar: true,
  },
};

export default function NewSurveyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SurveyFormData>(DEFAULT_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiContext, setAiContext] = useState('');

  /**
   * Adiciona uma nova pergunta
   */
  const handleAddQuestion = () => {
    const newQuestion: EditorQuestion = {
      id: ulid(),
      type: 'text',
      text: '',
      required: false,
    };

    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion],
    });
  };

  /**
   * Atualiza uma pergunta existente
   */
  const handleUpdateQuestion = (index: number, question: EditorQuestion) => {
    const questions = [...formData.questions];
    questions[index] = question;
    setFormData({ ...formData, questions });
  };

  /**
   * Remove uma pergunta
   */
  const handleDeleteQuestion = (index: number) => {
    const questions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions });
  };

  /**
   * Move uma pergunta para cima
   */
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const questions = [...formData.questions];
    [questions[index - 1], questions[index]] = [questions[index], questions[index - 1]];
    setFormData({ ...formData, questions });
  };

  /**
   * Move uma pergunta para baixo
   */
  const handleMoveDown = (index: number) => {
    if (index === formData.questions.length - 1) return;
    const questions = [...formData.questions];
    [questions[index], questions[index + 1]] = [questions[index + 1], questions[index]];
    setFormData({ ...formData, questions });
  };

  /**
   * Gera perguntas com IA
   */
  const handleGenerateWithAI = async () => {
    if (!aiContext.trim()) return;

    setIsGeneratingAI(true);

    // Simula geracao de perguntas por IA
    // TODO: Integrar com endpoint real de IA
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const generatedQuestions: EditorQuestion[] = [
      {
        id: ulid(),
        type: 'rating',
        text: 'Como voce avalia sua experiencia geral?',
        required: true,
      },
      {
        id: ulid(),
        type: 'nps',
        text: 'De 0 a 10, qual a probabilidade de voce nos recomendar?',
        required: true,
      },
      {
        id: ulid(),
        type: 'choice',
        text: 'Qual aspecto voce mais valoriza?',
        options: ['Qualidade', 'Preco', 'Atendimento', 'Rapidez'],
        required: false,
      },
      {
        id: ulid(),
        type: 'text',
        text: 'O que podemos melhorar?',
        description: 'Sua opiniao e muito importante para nos.',
        required: false,
      },
    ];

    setFormData({
      ...formData,
      questions: [...formData.questions, ...generatedQuestions],
    });
    setAiContext('');
    setIsGeneratingAI(false);
  };

  /**
   * Salva a pesquisa
   */
  const handleSubmit = async (asDraft: boolean = false) => {
    if (!formData.title.trim()) {
      alert('Por favor, informe um titulo para a pesquisa.');
      return;
    }

    if (formData.questions.length === 0) {
      alert('Adicione pelo menos uma pergunta a pesquisa.');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Integrar com API real
      console.log('Salvando pesquisa:', { ...formData, status: asDraft ? 'draft' : 'active' });

      // Simula delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redireciona para lista de pesquisas
      router.push('/app/surveys');
    } catch (error) {
      console.error('Erro ao salvar pesquisa:', error);
      alert('Erro ao salvar pesquisa. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Nova Pesquisa | DevForge</title>
        <meta name="description" content="Criar uma nova pesquisa" />
      </Head>

      <AuthLayout title="Nova Pesquisa">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/app/surveys"
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h2 className="text-2xl font-bold">Nova Pesquisa</h2>
              <p className="text-muted-foreground">
                Crie uma pesquisa para coletar feedbacks
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
            >
              Salvar Rascunho
            </Button>
            <Button onClick={() => handleSubmit(false)} disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
              Publicar Pesquisa
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Coluna principal - Formulario */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informacoes basicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informacoes Basicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Titulo da Pesquisa *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Pesquisa de Satisfacao 2024"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Descricao (opcional)
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o objetivo da pesquisa..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Gerar com IA */}
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Gerar Perguntas com IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Descreva o objetivo da sua pesquisa e nossa IA gerara perguntas relevantes.
                </p>
                <div className="flex gap-2">
                  <Input
                    value={aiContext}
                    onChange={(e) => setAiContext(e.target.value)}
                    placeholder="Ex: Quero medir a satisfacao dos clientes com nosso suporte..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleGenerateWithAI}
                    disabled={isGeneratingAI || !aiContext.trim()}
                  >
                    {isGeneratingAI ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Gerando...
                      </>
                    ) : (
                      'Gerar'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de perguntas */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Perguntas ({formData.questions.length})
                </h3>
                <Button variant="outline" onClick={handleAddQuestion}>
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Adicionar Pergunta
                </Button>
              </div>

              {formData.questions.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                      <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-medium mb-2">Nenhuma pergunta ainda</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Adicione perguntas manualmente ou use a IA para gerar automaticamente.
                    </p>
                    <Button variant="outline" onClick={handleAddQuestion}>
                      Adicionar Primeira Pergunta
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {formData.questions.map((question, index) => (
                    <QuestionEditor
                      key={question.id}
                      question={question}
                      index={index}
                      onUpdate={(q) => handleUpdateQuestion(index, q)}
                      onDelete={() => handleDeleteQuestion(index)}
                      onMoveUp={index > 0 ? () => handleMoveUp(index) : undefined}
                      onMoveDown={
                        index < formData.questions.length - 1
                          ? () => handleMoveDown(index)
                          : undefined
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Coluna lateral - Configuracoes */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuracoes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Checkbox
                  checked={formData.settings.allowAnonymous}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      settings: { ...formData.settings, allowAnonymous: e.target.checked },
                    })
                  }
                  label="Permitir respostas anonimas"
                />

                <Checkbox
                  checked={formData.settings.requireEmail}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      settings: { ...formData.settings, requireEmail: e.target.checked },
                    })
                  }
                  label="Exigir email do respondente"
                />

                <Checkbox
                  checked={formData.settings.showProgressBar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      settings: { ...formData.settings, showProgressBar: e.target.checked },
                    })
                  }
                  label="Mostrar barra de progresso"
                />
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Titulo</dt>
                    <dd className="font-medium truncate max-w-[150px]">
                      {formData.title || '-'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Perguntas</dt>
                    <dd className="font-medium">{formData.questions.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Obrigatorias</dt>
                    <dd className="font-medium">
                      {formData.questions.filter((q) => q.required).length}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Dicas */}
            <Card variant="ghost">
              <CardContent className="pt-6">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Dicas
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Pesquisas curtas tem maior taxa de resposta</li>
                  <li>• Use perguntas NPS para medir fidelidade</li>
                  <li>• Deixe perguntas de texto abertas para insights</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </AuthLayout>
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
