/**
 * Componente SurveyCard
 *
 * Card para exibir uma pesquisa na listagem.
 *
 * @version 1.0.0
 */

import Link from 'next/link';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import type { SurveyStatus } from '@/api/types/survey.types';

/**
 * Props do SurveyCard
 */
interface SurveyCardProps {
  id: string;
  title: string;
  description?: string;
  status: SurveyStatus;
  responseCount: number;
  questionCount: number;
  createdAt: string;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

/**
 * Retorna variante e texto do badge de status
 */
function getStatusConfig(status: SurveyStatus): {
  variant: 'success' | 'secondary' | 'warning' | 'default';
  text: string;
} {
  switch (status) {
    case 'active':
      return { variant: 'success', text: 'Ativo' };
    case 'draft':
      return { variant: 'secondary', text: 'Rascunho' };
    case 'paused':
      return { variant: 'warning', text: 'Pausado' };
    case 'closed':
      return { variant: 'default', text: 'Encerrado' };
    default:
      return { variant: 'default', text: status };
  }
}

export function SurveyCard({
  id,
  title,
  description,
  status,
  responseCount,
  questionCount,
  createdAt,
  onDelete,
  onDuplicate,
}: SurveyCardProps) {
  const statusConfig = getStatusConfig(status);

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Header com titulo e status */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <Link
              href={`/app/surveys/${id}`}
              className="text-lg font-semibold hover:text-primary transition-colors line-clamp-1"
            >
              {title}
            </Link>
          </div>
          <Badge variant={statusConfig.variant}>{statusConfig.text}</Badge>
        </div>

        {/* Descricao */}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {description}
          </p>
        )}

        {/* Metricas */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{questionCount} perguntas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            <span>{responseCount} respostas</span>
          </div>
        </div>

        {/* Footer com data e acoes */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Criado em {new Date(createdAt).toLocaleDateString('pt-BR')}
          </span>

          {/* Acoes */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link href={`/app/surveys/${id}`}>
              <Button variant="ghost" size="sm">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </Button>
            </Link>

            <Link href={`/app/surveys/${id}/edit`}>
              <Button variant="ghost" size="sm">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Button>
            </Link>

            {onDuplicate && (
              <Button variant="ghost" size="sm" onClick={() => onDuplicate(id)}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </Button>
            )}

            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(id)}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
