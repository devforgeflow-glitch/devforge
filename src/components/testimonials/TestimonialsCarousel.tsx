/**
 * Componente: Carrossel de Depoimentos
 *
 * Exibe depoimentos de clientes em formato de carrossel inline
 * com animacao de scroll automatico e controles manuais.
 *
 * @version 1.0.0
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';

// Depoimentos de exemplo (em producao viriam da API)
const TESTIMONIALS = [
  {
    id: '1',
    authorName: 'Maria Silva',
    authorCompany: 'Empresa ABC',
    authorRole: 'CEO',
    authorPhotoUrl: null,
    text: 'A plataforma transformou a maneira como coletamos feedback dos nossos clientes. A analise de sentimento por IA nos ajuda a entender melhor as necessidades do mercado.',
    rating: 5,
  },
  {
    id: '2',
    authorName: 'Joao Santos',
    authorCompany: 'Tech Solutions',
    authorRole: 'Diretor de Produto',
    authorPhotoUrl: null,
    text: 'Implementamos o sistema em menos de uma semana e ja vimos resultados incriveis. O suporte tecnico e excepcional e a interface e muito intuitiva.',
    rating: 5,
  },
  {
    id: '3',
    authorName: 'Ana Costa',
    authorCompany: 'Startup XYZ',
    authorRole: 'Fundadora',
    authorPhotoUrl: null,
    text: 'O melhor investimento que fizemos para entender nossos usuarios. Os insights gerados pela IA sao extremamente valiosos para nossas decisoes de produto.',
    rating: 5,
  },
  {
    id: '4',
    authorName: 'Carlos Oliveira',
    authorCompany: 'Comercio Digital',
    authorRole: 'Gerente de Marketing',
    authorPhotoUrl: null,
    text: 'Aumentamos nossa taxa de resposta em 300% apos comecar a usar a plataforma. A experiencia do usuario final e impecavel.',
    rating: 4,
  },
  {
    id: '5',
    authorName: 'Patricia Lima',
    authorCompany: 'Agencia Criativa',
    authorRole: 'Diretora',
    authorPhotoUrl: null,
    text: 'Usamos para todos os nossos clientes agora. A facilidade de criacao de pesquisas e a qualidade dos relatorios nos impressionou muito.',
    rating: 5,
  },
  {
    id: '6',
    authorName: 'Roberto Ferreira',
    authorCompany: 'Consultoria Plus',
    authorRole: 'Consultor Senior',
    authorPhotoUrl: null,
    text: 'A seguranca dos dados e um diferencial importante. Nossos clientes corporativos ficam tranquilos sabendo que usamos uma plataforma com certificacoes LGPD.',
    rating: 5,
  },
];

/**
 * Componente de estrelas
 */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Componente de avatar com iniciais
 */
function Avatar({ name, photoUrl }: { name: string; photoUrl?: string | null }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
      {initials}
    </div>
  );
}

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Autoplay
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  // Calcular quantos itens mostrar baseado no tamanho da tela
  const visibleItems = 3;

  return (
    <div className="relative">
      {/* Container do carrossel */}
      <div className="overflow-hidden" ref={containerRef}>
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
          }}
        >
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  {/* Quote icon */}
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />

                  {/* Texto */}
                  <p className="text-muted-foreground mb-6 line-clamp-4">
                    "{testimonial.text}"
                  </p>

                  {/* Rating */}
                  <div className="mb-4">
                    <StarRating rating={testimonial.rating} />
                  </div>

                  {/* Autor */}
                  <div className="flex items-center gap-3">
                    <Avatar name={testimonial.authorName} photoUrl={testimonial.authorPhotoUrl} />
                    <div>
                      <p className="font-semibold text-sm">{testimonial.authorName}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.authorRole}
                        {testimonial.authorCompany && ` - ${testimonial.authorCompany}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Controles de navegacao */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-background border shadow-md flex items-center justify-center hover:bg-muted transition-colors z-10"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-background border shadow-md flex items-center justify-center hover:bg-muted transition-colors z-10"
        aria-label="Proximo"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Indicadores (dots) */}
      <div className="flex justify-center gap-2 mt-6">
        {TESTIMONIALS.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-primary w-6'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Ir para depoimento ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default TestimonialsCarousel;
