import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { GetStaticPropsContext } from 'next';
import { Layout } from '@/components/layout';
import { Card, CardContent, Button, Badge, Input } from '@/components/ui';
import {
  MessageSquare,
  Mail,
  Phone,
  Building,
  Clock,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Reply,
  Trash2,
  X,
  Send,
} from 'lucide-react';
import {
  CONTACT_STATUS,
  CONTACT_SUBJECTS,
  CONTACT_STATUS_LABELS,
  CONTACT_SUBJECT_LABELS,
  type ContactMessage,
  type ContactStatus,
  type ContactSubject,
} from '@/api/lib/schemas/contact.schema';

/**
 * Pagina Admin: Gerenciamento de Mensagens de Contato
 *
 * Permite:
 * - Listar todas as mensagens recebidas
 * - Filtrar por status e assunto
 * - Visualizar detalhes
 * - Responder mensagens
 * - Alterar status
 *
 * @version 1.0.0
 */

// Dados mock para demonstracao
const MOCK_MESSAGES: ContactMessage[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    email: 'maria@exemplo.com',
    telefone: '(11) 99999-1234',
    empresa: 'Empresa ABC',
    assunto: 'orcamento',
    mensagem: 'Ola! Gostaria de solicitar um orcamento para desenvolvimento de um sistema de gestao para minha empresa. Precisamos de modulos de vendas, estoque e financeiro.',
    status: 'novo',
    respostas: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    nome: 'Joao Santos',
    email: 'joao@teste.com',
    assunto: 'duvida',
    mensagem: 'Qual o prazo medio para desenvolvimento de um site institucional? E qual a forma de pagamento?',
    status: 'em_andamento',
    respostas: [
      {
        id: 'r1',
        resposta: 'Ola Joao! O prazo medio e de 2-4 semanas. Aceitamos PIX, cartao e boleto. Posso agendar uma reuniao?',
        enviadoPor: 'Admin',
        enviadoEm: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        emailEnviado: true,
      },
    ],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    nome: 'Ana Costa',
    email: 'ana@empresa.com.br',
    telefone: '(21) 98888-5555',
    empresa: 'Costa Comercio',
    assunto: 'parceria',
    mensagem: 'Somos uma agencia de marketing e gostavamos de estabelecer uma parceria para indicacao mutua de clientes.',
    status: 'resolvido',
    respostas: [
      {
        id: 'r2',
        resposta: 'Ola Ana! Temos interesse sim. Vou enviar nosso contrato de parceria por email.',
        enviadoPor: 'Admin',
        enviadoEm: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        emailEnviado: true,
      },
    ],
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    resolvidoAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    resolvidoPor: 'Admin',
  },
];

// Cores dos status
const STATUS_COLORS: Record<ContactStatus, string> = {
  novo: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  em_andamento: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  resolvido: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
};

export default function AdminMessagesPage() {
  const t = useTranslations();
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>(MOCK_MESSAGES);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>(MOCK_MESSAGES);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'todos'>('todos');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Estatisticas
  const stats = {
    total: messages.length,
    novo: messages.filter((m) => m.status === 'novo').length,
    em_andamento: messages.filter((m) => m.status === 'em_andamento').length,
    resolvido: messages.filter((m) => m.status === 'resolvido').length,
  };

  // Filtrar mensagens
  useEffect(() => {
    let filtered = [...messages];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.nome.toLowerCase().includes(term) ||
          m.email.toLowerCase().includes(term) ||
          m.mensagem.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'todos') {
      filtered = filtered.filter((m) => m.status === statusFilter);
    }

    // Ordenar por data (mais recentes primeiro)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredMessages(filtered);
  }, [messages, searchTerm, statusFilter]);

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return t('adminPages.messages.time.now');
    if (diffHours < 24) return t('adminPages.messages.time.hoursAgo', { hours: diffHours });
    if (diffDays < 7) return t('adminPages.messages.time.daysAgo', { days: diffDays });

    return date.toLocaleDateString(router.locale || 'pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Atualizar status
  const updateStatus = (messageId: string, newStatus: ContactStatus) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              status: newStatus,
              updatedAt: new Date().toISOString(),
              ...(newStatus === 'resolvido' && {
                resolvidoAt: new Date().toISOString(),
                resolvidoPor: 'Admin',
              }),
            }
          : m
      )
    );

    if (selectedMessage?.id === messageId) {
      setSelectedMessage((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : null
      );
    }
  };

  // Enviar resposta
  const sendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setSendingReply(true);

    // Simular envio
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newReply = {
      id: `r${Date.now()}`,
      resposta: replyText,
      enviadoPor: 'Admin',
      enviadoEm: new Date().toISOString(),
      emailEnviado: true,
    };

    setMessages((prev) =>
      prev.map((m) =>
        m.id === selectedMessage.id
          ? {
              ...m,
              respostas: [...m.respostas, newReply],
              status: m.status === 'novo' ? 'em_andamento' : m.status,
              updatedAt: new Date().toISOString(),
            }
          : m
      )
    );

    setSelectedMessage((prev) =>
      prev
        ? {
            ...prev,
            respostas: [...prev.respostas, newReply],
            status: prev.status === 'novo' ? 'em_andamento' : prev.status,
          }
        : null
    );

    setReplyText('');
    setSendingReply(false);
  };

  return (
    <>
      <Head>
        <title>{t('adminPages.messages.meta.title')}</title>
      </Head>

      <Layout title={t('adminPages.messages.title')} description={t('adminPages.messages.description')}>
        <section className="py-8">
          <div className="container-app">
            {/* Header com Estatisticas */}
            <div className="grid gap-4 md:grid-cols-4 mb-8">
              <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setStatusFilter('todos')}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('adminPages.messages.stats.total')}</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-blue-500 transition-colors" onClick={() => setStatusFilter('novo')}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('adminPages.messages.stats.new')}</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.novo}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-yellow-500 transition-colors" onClick={() => setStatusFilter('em_andamento')}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('adminPages.messages.stats.inProgress')}</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats.em_andamento}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-green-500 transition-colors" onClick={() => setStatusFilter('resolvido')}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('adminPages.messages.stats.resolved')}</p>
                      <p className="text-2xl font-bold text-green-600">{stats.resolvido}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('adminPages.messages.filters.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ContactStatus | 'todos')}
                className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="todos">{t('adminPages.messages.filters.allStatuses')}</option>
                {CONTACT_STATUS.map((status) => (
                  <option key={status} value={status}>
                    {t(`adminPages.messages.status.${status}`)}
                  </option>
                ))}
              </select>
            </div>

            {/* Lista de Mensagens */}
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Lista */}
              <div className="space-y-4">
                {filteredMessages.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">{t('adminPages.messages.list.noResults')}</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredMessages.map((message) => (
                    <Card
                      key={message.id}
                      className={`cursor-pointer transition-all hover:border-primary ${
                        selectedMessage?.id === message.id ? 'border-primary ring-2 ring-primary/20' : ''
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold truncate">{message.nome}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[message.status]}`}>
                                {t(`adminPages.messages.status.${message.status}`)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{message.email}</p>
                            <p className="text-sm mt-2 line-clamp-2">{message.mensagem}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs text-muted-foreground">{formatDate(message.createdAt)}</p>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {t(`adminPages.messages.subjects.${message.assunto}`)}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Detalhe da Mensagem */}
              <div className="lg:sticky lg:top-4 lg:self-start">
                {selectedMessage ? (
                  <Card>
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold">{selectedMessage.nome}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {selectedMessage.email}
                            </span>
                            {selectedMessage.telefone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {selectedMessage.telefone}
                              </span>
                            )}
                          </div>
                          {selectedMessage.empresa && (
                            <span className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <Building className="h-3 w-3" />
                              {selectedMessage.empresa}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedMessage(null)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Status e Assunto */}
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary">{t(`adminPages.messages.subjects.${selectedMessage.assunto}`)}</Badge>
                        <select
                          value={selectedMessage.status}
                          onChange={(e) => updateStatus(selectedMessage.id, e.target.value as ContactStatus)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${STATUS_COLORS[selectedMessage.status]}`}
                        >
                          {CONTACT_STATUS.map((status) => (
                            <option key={status} value={status}>
                              {t(`adminPages.messages.status.${status}`)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Mensagem */}
                      <div className="bg-muted/50 rounded-lg p-4 mb-6">
                        <p className="text-sm whitespace-pre-wrap">{selectedMessage.mensagem}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {t('adminPages.messages.detail.receivedAt')} {new Date(selectedMessage.createdAt).toLocaleString(router.locale || 'pt-BR')}
                        </p>
                      </div>

                      {/* Respostas */}
                      {selectedMessage.respostas.length > 0 && (
                        <div className="space-y-3 mb-6">
                          <h4 className="text-sm font-semibold">{t('adminPages.messages.detail.replies')}</h4>
                          {selectedMessage.respostas.map((reply) => (
                            <div key={reply.id} className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-4">
                              <p className="text-sm whitespace-pre-wrap">{reply.resposta}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {reply.enviadoPor} - {new Date(reply.enviadoEm).toLocaleString(router.locale || 'pt-BR')}
                                {reply.emailEnviado && (
                                  <span className="ml-2 text-green-600">✓ {t('adminPages.messages.detail.emailSent')}</span>
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Responder */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold">{t('adminPages.messages.actions.reply')}</h4>
                        <textarea
                          rows={3}
                          placeholder={t('adminPages.messages.actions.replyPlaceholder')}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(selectedMessage.id, 'resolvido')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {t('adminPages.messages.actions.markResolved')}
                          </Button>
                          <Button
                            size="sm"
                            onClick={sendReply}
                            disabled={!replyText.trim() || sendingReply}
                          >
                            {sendingReply ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4 mr-1" />
                            )}
                            {t('adminPages.messages.actions.send')}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">{t('adminPages.messages.detail.selectPrompt')}</p>
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
