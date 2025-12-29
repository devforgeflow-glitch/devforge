/**
 * Componente NPSQuestion
 *
 * Renderiza uma pergunta NPS (Net Promoter Score) de 0-10.
 *
 * @version 1.0.0
 */

interface NPSQuestionProps {
  questionId: string;
  text: string;
  description?: string;
  required: boolean;
  value: number | null;
  onChange: (value: number) => void;
}

export function NPSQuestion({
  text,
  description,
  required,
  value,
  onChange,
}: NPSQuestionProps) {
  const scores = Array.from({ length: 11 }, (_, i) => i);

  const getScoreColor = (score: number) => {
    if (score <= 6) return 'border-red-300 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950';
    if (score <= 8) return 'border-yellow-300 hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950';
    return 'border-green-300 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950';
  };

  const getSelectedColor = (score: number) => {
    if (score <= 6) return 'bg-red-500 border-red-500 text-white';
    if (score <= 8) return 'bg-yellow-500 border-yellow-500 text-white';
    return 'bg-green-500 border-green-500 text-white';
  };

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

      <div className="space-y-3">
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {scores.map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              className={`w-8 h-10 sm:w-10 sm:h-12 rounded-lg border-2 text-sm sm:text-base font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                value === score
                  ? getSelectedColor(score)
                  : getScoreColor(score)
              }`}
            >
              {score}
            </button>
          ))}
        </div>

        <div className="flex justify-between text-xs sm:text-sm text-muted-foreground px-1">
          <span>Nada provavel</span>
          <span>Muito provavel</span>
        </div>
      </div>
    </div>
  );
}
