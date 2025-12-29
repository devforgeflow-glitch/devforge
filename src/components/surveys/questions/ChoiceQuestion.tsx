/**
 * Componente ChoiceQuestion
 *
 * Renderiza uma pergunta de multipla escolha.
 *
 * @version 1.0.0
 */

interface ChoiceQuestionProps {
  questionId: string;
  text: string;
  description?: string;
  required: boolean;
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
  allowMultiple?: boolean;
}

export function ChoiceQuestion({
  text,
  description,
  required,
  options,
  value,
  onChange,
}: ChoiceQuestionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">
          {text}
          {required && <span className="text-destructive ml-1">*</span>}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      <div className="space-y-2">
        {options.map((option, index) => {
          const isSelected = value === option;

          return (
            <button
              key={index}
              type="button"
              onClick={() => onChange(option)}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/50'
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className={isSelected ? 'font-medium' : ''}>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
