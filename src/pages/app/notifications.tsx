import Head from 'next/head';
import { useState } from 'react';
import { GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { Layout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Gift,
  Star,
  Settings,
  Trash2,
} from 'lucide-react';

/**
 * Página: Notificações
 *
 * Central de notificações do usuário.
 *
 * @version 1.0.0
 */

interface Notification {
  id: string;
  type: 'response' | 'milestone' | 'alert' | 'promo' | 'system';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// Dados mock de notificações
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'response',
    title: 'Nova resposta recebida',
    message: 'Sua pesquisa "Satisfação Q4 2024" recebeu uma nova resposta de joao.silva@email.com',
    createdAt: '2024-12-29T10:30:00',
    read: false,
  },
  {
    id: '2',
    type: 'milestone',
    title: 'Meta atingida!',
    message: 'Parabéns! Você atingiu 100 respostas na pesquisa "Feedback de Produto".',
    createdAt: '2024-12-29T09:15:00',
    read: false,
  },
  {
    id: '3',
    type: 'response',
    title: 'Nova resposta recebida',
    message: 'Sua pesquisa "NPS Trimestral" recebeu uma nova resposta.',
    createdAt: '2024-12-28T18:45:00',
    read: true,
  },
  {
    id: '4',
    type: 'alert',
    title: 'Pesquisa prestes a expirar',
    message: 'A pesquisa "Avaliação de Serviço" expira em 3 dias. Considere estender o prazo.',
    createdAt: '2024-12-28T14:00:00',
    read: true,
  },
  {
    id: '5',
    type: 'promo',
    title: 'Novidade: Análise com IA',
    message: 'Agora você pode usar inteligência artificial para analisar suas respostas. Experimente!',
    createdAt: '2024-12-27T10:00:00',
    read: true,
  },
  {
    id: '6',
    type: 'system',
    title: 'Atualização do sistema',
    message: 'Novos recursos foram adicionados à plataforma. Confira as novidades!',
    createdAt: '2024-12-26T16:30:00',
    read: true,
  },
];

function getNotificationIcon(type: string) {
  switch (type) {
    case 'response':
      return <MessageSquare className="h-5 w-5 text-blue-500" />;
    case 'milestone':
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    case 'alert':
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
    case 'promo':
      return <Gift className="h-5 w-5 text-purple-500" />;
    case 'system':
      return <Settings className="h-5 w-5 text-gray-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
}

function formatTimeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;
  return date.toLocaleDateString('pt-BR');
}

export default function NotificationsPage() {
  const t = useTranslations();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications =
    filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      <Head>
        <title>Notificações | DevForge</title>
      </Head>

      <Layout title="Notificações" description="Central de notificações">
        <div className="container-app py-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <Button
                    variant={filter === 'all' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                  >
                    Todas
                  </Button>
                  <Button
                    variant={filter === 'unread' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('unread')}
                    className="gap-2"
                  >
                    Não lidas
                    {unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white text-xs px-1.5">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>

              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="gap-2"
                >
                  <CheckCheck className="h-4 w-4" />
                  Marcar todas como lidas
                </Button>
              )}
            </div>

            {/* Lista de Notificações */}
            <Card>
              <CardContent className="p-0">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-16">
                    <BellOff className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                      {filter === 'unread'
                        ? 'Nenhuma notificação não lida'
                        : 'Nenhuma notificação'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-muted/50 transition-colors ${
                          !notification.read ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-2 rounded-lg ${
                              !notification.read ? 'bg-primary/10' : 'bg-muted'
                            }`}
                          >
                            {getNotificationIcon(notification.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p
                                  className={`font-medium ${
                                    !notification.read ? 'text-foreground' : 'text-muted-foreground'
                                  }`}
                                >
                                  {notification.title}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {formatTimeAgo(notification.createdAt)}
                                </p>
                              </div>

                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                    className="h-8 w-8 p-0"
                                    title="Marcar como lida"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                                  title="Excluir"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Configurações */}
            <div className="mt-6 text-center">
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Configurar Notificações
              </Button>
            </div>
          </div>
        </div>
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
