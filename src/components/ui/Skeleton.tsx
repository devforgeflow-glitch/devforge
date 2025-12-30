/**
 * Componente Skeleton
 *
 * Placeholder animado para estados de carregamento.
 * Melhora a percepcao de performance mostrando onde o conteudo aparecera.
 * Suporte a dark mode.
 *
 * @example Basico
 * ```tsx
 * <Skeleton className="h-4 w-32" />
 * ```
 *
 * @example Card skeleton
 * ```tsx
 * <SkeletonCard />
 * ```
 *
 * @example Texto com multiplas linhas
 * ```tsx
 * <SkeletonText lines={3} />
 * ```
 *
 * @example Avatar
 * ```tsx
 * <SkeletonAvatar size="lg" />
 * ```
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Variantes de estilo para o skeleton base
 */
const skeletonVariants = cva("animate-pulse rounded-md", {
  variants: {
    variant: {
      default: "bg-muted",
      darker: "bg-muted-foreground/20",
      lighter: "bg-muted/50",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

/**
 * Skeleton base - retangulo animado
 */
function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  )
}

/**
 * Skeleton circular para avatares
 */
interface SkeletonAvatarProps extends SkeletonProps {
  size?: "sm" | "md" | "lg" | "xl"
}

const AVATAR_SIZES = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
}

function SkeletonAvatar({
  className,
  size = "md",
  variant,
  ...props
}: SkeletonAvatarProps) {
  return (
    <Skeleton
      className={cn("rounded-full", AVATAR_SIZES[size], className)}
      variant={variant}
      {...props}
    />
  )
}

/**
 * Skeleton para texto com multiplas linhas
 */
interface SkeletonTextProps extends SkeletonProps {
  lines?: number
  lastLineWidth?: "full" | "3/4" | "1/2" | "1/3"
}

const LINE_WIDTHS = {
  full: "w-full",
  "3/4": "w-3/4",
  "1/2": "w-1/2",
  "1/3": "w-1/3",
}

function SkeletonText({
  className,
  lines = 3,
  lastLineWidth = "3/4",
  variant,
  ...props
}: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            "h-4",
            index === lines - 1 ? LINE_WIDTHS[lastLineWidth] : "w-full"
          )}
          variant={variant}
        />
      ))}
    </div>
  )
}

/**
 * Skeleton para card completo
 */
interface SkeletonCardProps extends SkeletonProps {
  hasImage?: boolean
  hasAvatar?: boolean
  hasAction?: boolean
}

function SkeletonCard({
  className,
  hasImage = true,
  hasAvatar = false,
  hasAction = false,
  variant,
  ...props
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 shadow-sm",
        className
      )}
      {...props}
    >
      {/* Imagem */}
      {hasImage && (
        <Skeleton
          className="h-48 w-full rounded-md mb-4"
          variant={variant}
        />
      )}

      {/* Header com avatar */}
      {hasAvatar && (
        <div className="flex items-center gap-3 mb-4">
          <SkeletonAvatar size="md" variant={variant} />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" variant={variant} />
            <Skeleton className="h-3 w-16" variant={variant} />
          </div>
        </div>
      )}

      {/* Titulo */}
      <Skeleton className="h-5 w-3/4 mb-2" variant={variant} />

      {/* Descricao */}
      <SkeletonText lines={2} lastLineWidth="1/2" variant={variant} />

      {/* Acao */}
      {hasAction && (
        <div className="mt-4 flex justify-end">
          <Skeleton className="h-9 w-24 rounded-full" variant={variant} />
        </div>
      )}
    </div>
  )
}

/**
 * Skeleton para linha de tabela
 */
interface SkeletonTableRowProps extends SkeletonProps {
  columns?: number
}

function SkeletonTableRow({
  className,
  columns = 4,
  variant,
  ...props
}: SkeletonTableRowProps) {
  return (
    <div
      className={cn("flex items-center gap-4 py-3 border-b border-border", className)}
      {...props}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            "h-4",
            index === 0 ? "w-1/4" : index === columns - 1 ? "w-16" : "flex-1"
          )}
          variant={variant}
        />
      ))}
    </div>
  )
}

/**
 * Skeleton para tabela completa
 */
interface SkeletonTableProps extends SkeletonProps {
  rows?: number
  columns?: number
  hasHeader?: boolean
}

function SkeletonTable({
  className,
  rows = 5,
  columns = 4,
  hasHeader = true,
  variant,
  ...props
}: SkeletonTableProps) {
  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Header */}
      {hasHeader && (
        <div className="flex items-center gap-4 py-3 border-b-2 border-border mb-2">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton
              key={index}
              className={cn(
                "h-4",
                index === 0 ? "w-1/4" : index === columns - 1 ? "w-16" : "flex-1"
              )}
              variant="darker"
            />
          ))}
        </div>
      )}

      {/* Rows */}
      {Array.from({ length: rows }).map((_, index) => (
        <SkeletonTableRow key={index} columns={columns} variant={variant} />
      ))}
    </div>
  )
}

/**
 * Skeleton para grid de cards
 */
interface SkeletonGridProps extends SkeletonProps {
  count?: number
  columns?: 1 | 2 | 3 | 4
}

const GRID_CLASSES = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
}

function SkeletonGrid({
  className,
  count = 6,
  columns = 3,
  ...props
}: SkeletonGridProps) {
  return (
    <div className={cn("grid gap-6", GRID_CLASSES[columns], className)} {...props}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}

/**
 * Skeleton para lista simples
 */
interface SkeletonListProps extends SkeletonProps {
  count?: number
  hasAvatar?: boolean
}

function SkeletonList({
  className,
  count = 5,
  hasAvatar = false,
  variant,
  ...props
}: SkeletonListProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          {hasAvatar && <SkeletonAvatar size="md" variant={variant} />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" variant={variant} />
            <Skeleton className="h-3 w-1/2" variant={variant} />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Skeleton para formulario
 */
interface SkeletonFormProps extends SkeletonProps {
  fields?: number
  hasSubmit?: boolean
}

function SkeletonForm({
  className,
  fields = 4,
  hasSubmit = true,
  variant,
  ...props
}: SkeletonFormProps) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" variant={variant} />
          <Skeleton className="h-10 w-full rounded-md" variant={variant} />
        </div>
      ))}

      {hasSubmit && (
        <div className="flex justify-end pt-4">
          <Skeleton className="h-10 w-32 rounded-full" variant={variant} />
        </div>
      )}
    </div>
  )
}

/**
 * Skeleton para dashboard stat card
 */
function SkeletonStatCard({ className, variant, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-6 shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" variant={variant} />
          <Skeleton className="h-8 w-24" variant={variant} />
        </div>
        <Skeleton className="h-12 w-12 rounded-full" variant={variant} />
      </div>
      <div className="mt-4">
        <Skeleton className="h-3 w-32" variant={variant} />
      </div>
    </div>
  )
}

/**
 * Skeleton para survey card (especifico DevForge)
 */
function SkeletonSurveyCard({ className, variant, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-6 w-3/4" variant={variant} />
        <Skeleton className="h-6 w-16 rounded-full" variant={variant} />
      </div>
      <SkeletonText lines={2} lastLineWidth="3/4" variant={variant} />
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-4 w-24" variant={variant} />
        <Skeleton className="h-8 w-20 rounded-full" variant={variant} />
      </div>
    </div>
  )
}

export {
  Skeleton,
  SkeletonAvatar,
  SkeletonText,
  SkeletonCard,
  SkeletonTableRow,
  SkeletonTable,
  SkeletonGrid,
  SkeletonList,
  SkeletonForm,
  SkeletonStatCard,
  SkeletonSurveyCard,
}
