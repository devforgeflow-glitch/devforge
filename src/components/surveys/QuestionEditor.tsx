/**
 * Componente QuestionEditor
 *
 * Editor de perguntas para criacao/edicao de pesquisas.
 *
 * @version 1.0.0
 */

import { useState } from 'react';
import { Card, CardContent, Button, Input, Textarea, Checkbox } from '@/components/ui';
import type { QuestionType } from '@/api/types/survey.types';

/**
 * Representacao de uma pergunta no editor
 */
export interface EditorQuestion {
  id: string;
  type: QuestionType;
  text: string;
  description?: string;
  required: boolean;
  options?: string[];
  minValue?: number;
  maxValue?: number;
}

interface QuestionEditorProps {
  question: EditorQuestion;
  index: number;
  onUpdate: (question: EditorQuestion) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'text', label: 'Texto livre' },
  { value: 'rating', label: 'Avaliacao (1-5)' },
  { value: 'nps', label: 'NPS (0-10)' },
  { value: 'choice', label: 'Multipla escolha' },
  { value: 'date', label: 'Data' },
];

export function QuestionEditor({
  question,
  index,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: QuestionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleTypeChange = (type: QuestionType) => {
    const updated: EditorQuestion = { ...question, type };

    // Configura valores padrao por tipo
    if (type === 'rating') {
      updated.minValue = 1;
      updated.maxValue = 5;
      delete updated.options;
    } else if (type === 'nps') {
      updated.minValue = 0;
      updated.maxValue = 10;
      delete updated.options;
    } else if (type === 'choice') {
      updated.options = updated.options?.length ? updated.options : ['Opcao 1', 'Opcao 2'];
      delete updated.minValue;
      delete updated.maxValue;
    } else {
      delete updated.options;
      delete updated.minValue;
      delete updated.maxValue;
    }

    onUpdate(updated);
  };

  const handleAddOption = () => {
    const options = [...(question.options || []), `Opcao ${(question.options?.length || 0) + 1}`];
    onUpdate({ ...question, options });
  };

  const handleUpdateOption = (optionIndex: number, value: string) => {
    const options = [...(question.options || [])];
    options[optionIndex] = value;
    onUpdate({ ...question, options });
  };

  const handleRemoveOption = (optionIndex: number) => {
    const options = (question.options || []).filter((_, i) => i !== optionIndex);
    onUpdate({ ...question, options });
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-4">
        {/* Header da pergunta */}
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            {index + 1}
          </span>

          <div className="flex-1">
            <Input
              value={question.text}
              onChange={(e) => onUpdate({ ...question, text: e.target.value })}
              placeholder="Digite a pergunta..."
              className="font-medium"
            />
          </div>

          <div className="flex items-center gap-1">
            {onMoveUp && (
              <Button variant="ghost" size="sm" onClick={onMoveUp}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </Button>
            )}
            {onMoveDown && (
              <Button variant="ghost" size="sm" onClick={onMoveDown}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <svg
                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Conteudo expandido */}
        {isExpanded && (
          <div className="space-y-4 pl-11">
            {/* Tipo de pergunta */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Tipo</label>
                <select
                  value={question.type}
                  onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {QUESTION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <Checkbox
                  checked={question.required}
                  onChange={(e) => onUpdate({ ...question, required: e.target.checked })}
                  label="Obrigatoria"
                />
              </div>
            </div>

            {/* Descricao (opcional) */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Descricao (opcional)
              </label>
              <Textarea
                value={question.description || ''}
                onChange={(e) => onUpdate({ ...question, description: e.target.value })}
                placeholder="Adicione uma descricao ou instrucao para esta pergunta..."
                rows={2}
              />
            </div>

            {/* Opcoes para multipla escolha */}
            {question.type === 'choice' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Opcoes</label>
                <div className="space-y-2">
                  {(question.options || []).map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => handleUpdateOption(optionIndex, e.target.value)}
                        placeholder={`Opcao ${optionIndex + 1}`}
                      />
                      {(question.options?.length || 0) > 2 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveOption(optionIndex)}
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={handleAddOption}>
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Adicionar opcao
                  </Button>
                </div>
              </div>
            )}

            {/* Preview do tipo */}
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">Preview:</p>
              {question.type === 'text' && (
                <Input disabled placeholder="Resposta do usuario..." />
              )}
              {question.type === 'rating' && (
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      className="w-10 h-10 rounded-full border border-border hover:border-primary hover:bg-primary/10 flex items-center justify-center"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
              {question.type === 'nps' && (
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <button
                      key={n}
                      className={`w-8 h-8 rounded text-sm border flex items-center justify-center ${
                        n <= 6
                          ? 'border-red-300 hover:bg-red-50'
                          : n <= 8
                          ? 'border-yellow-300 hover:bg-yellow-50'
                          : 'border-green-300 hover:bg-green-50'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
              {question.type === 'choice' && (
                <div className="space-y-2">
                  {(question.options || []).map((option, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-border" />
                      <span className="text-sm">{option}</span>
                    </div>
                  ))}
                </div>
              )}
              {question.type === 'date' && (
                <Input type="date" disabled />
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
