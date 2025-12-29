/**
 * Componente TextQuestion
 *
 * Renderiza uma pergunta de texto livre.
 *
 * @version 1.0.0
 */

import { Textarea } from '@/components/ui';

interface TextQuestionProps {
  questionId: string;
  text: string;
  description?: string;
  required: boolean;
  value: string;
  onChange: (value: string) => void;
}

export function TextQuestion({
  text,
  description,
  required,
  value,
  onChange,
}: TextQuestionProps) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-medium">
          {text}
          {required && <span className="text-destructive ml-1">*</span>}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Digite sua resposta..."
        rows={4}
      />
    </div>
  );
}
