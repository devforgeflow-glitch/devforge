/**
 * Componente DateQuestion
 *
 * Renderiza uma pergunta de data.
 *
 * @version 1.0.0
 */

import { Input } from '@/components/ui';

interface DateQuestionProps {
  questionId: string;
  text: string;
  description?: string;
  required: boolean;
  value: string;
  onChange: (value: string) => void;
}

export function DateQuestion({
  text,
  description,
  required,
  value,
  onChange,
}: DateQuestionProps) {
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
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-xs"
      />
    </div>
  );
}
