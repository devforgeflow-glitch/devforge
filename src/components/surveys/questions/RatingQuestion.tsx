/**
 * Componente RatingQuestion
 *
 * Renderiza uma pergunta de avaliacao (1-5 estrelas).
 *
 * @version 1.0.0
 */

import { useState } from 'react';

interface RatingQuestionProps {
  questionId: string;
  text: string;
  description?: string;
  required: boolean;
  value: number | null;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
}

export function RatingQuestion({
  text,
  description,
  required,
  value,
  onChange,
  minValue = 1,
  maxValue = 5,
}: RatingQuestionProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const ratings = Array.from(
    { length: maxValue - minValue + 1 },
    (_, i) => minValue + i
  );

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

      <div className="flex items-center gap-2">
        {ratings.map((rating) => {
          const isSelected = value !== null && rating <= value;
          const isHovered = hoveredValue !== null && rating <= hoveredValue;

          return (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              onMouseEnter={() => setHoveredValue(rating)}
              onMouseLeave={() => setHoveredValue(null)}
              className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              <svg
                className={`h-10 w-10 transition-colors ${
                  isSelected || isHovered
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-muted-foreground/30'
                }`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
          );
        })}
        {value !== null && (
          <span className="ml-2 text-sm text-muted-foreground">
            {value} de {maxValue}
          </span>
        )}
      </div>
    </div>
  );
}
