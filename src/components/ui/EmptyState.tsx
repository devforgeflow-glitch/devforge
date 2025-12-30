/**
 * Componente EmptyState
 *
 * Exibe um estado vazio com icone, titulo, descricao e acao opcional.
 * Usado quando nao ha dados para exibir em listas, tabelas, etc.
 * Suporte a dark mode.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<Inbox className="h-12 w-12" />}
 *   title="Nenhum projeto encontrado"
 *   description="Tente ajustar os filtros ou criar um novo projeto."
 *   action={
 *     <Button onClick={handleCreate}>
 *       Criar Projeto
 *     </Button>
 *   }
 * />
 * ```
 *
 * @example Com variante
 * ```tsx
 * <EmptyState
 *   variant="search"
 *   title="Nenhum resultado"
 *   description="Tente buscar por outros termos."
 * />
 * ```
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Inbox,
  Search,
  FileX,
  FolderOpen,
  Heart,
  ShoppingCart,
  Bell,
  Users,
  ClipboardList,
  BarChart3,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Variantes de estilo para o container
 */
const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center p-8",
  {
    variants: {
      size: {
        sm: "py-6 px-4",
        default: "py-12 px-6",
        lg: "py-16 px-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

/**
 * Icones pre-definidos por variante
 */
const VARIANT_ICONS: Record<string, LucideIcon> = {
  default: Inbox,
  search: Search,
  "no-results": FileX,
  folder: FolderOpen,
  favorites: Heart,
  cart: ShoppingCart,
  notifications: Bell,
  users: Users,
  surveys: ClipboardList,
  analytics: BarChart3,
}

/**
 * Cores de icone por variante (com suporte a dark mode)
 */
const VARIANT_COLORS: Record<string, string> = {
  default: "text-muted-foreground",
  search: "text-primary/60",
  "no-results": "text-muted-foreground",
  folder: "text-muted-foreground",
  favorites: "text-red-400 dark:text-red-500",
  cart: "text-orange-400 dark:text-orange-500",
  notifications: "text-yellow-500 dark:text-yellow-400",
  users: "text-blue-400 dark:text-blue-500",
  surveys: "text-primary/60",
  analytics: "text-green-400 dark:text-green-500",
}

export type EmptyStateVariant = keyof typeof VARIANT_ICONS

interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  /** Variante pre-definida com icone e cor */
  variant?: EmptyStateVariant
  /** Icone customizado (sobrescreve o da variante) */
  icon?: React.ReactNode
  /** Titulo principal */
  title: string
  /** Descricao opcional */
  description?: string
  /** Acao opcional (botao, link, etc) */
  action?: React.ReactNode
  /** Classe CSS adicional para o icone */
  iconClassName?: string
}

/**
 * Componente principal EmptyState
 */
function EmptyState({
  className,
  variant = "default",
  size,
  icon,
  title,
  description,
  action,
  iconClassName,
  ...props
}: EmptyStateProps) {
  const IconComponent = VARIANT_ICONS[variant] || Inbox
  const iconColor = VARIANT_COLORS[variant] || "text-muted-foreground"

  return (
    <div
      data-slot="empty-state"
      role="status"
      aria-label={title}
      className={cn(emptyStateVariants({ size }), className)}
      {...props}
    >
      {/* Icone */}
      <div
        data-slot="empty-state-icon"
        className={cn("mb-4", iconColor, iconClassName)}
      >
        {icon || <IconComponent className="h-12 w-12" strokeWidth={1.5} />}
      </div>

      {/* Titulo */}
      <h3
        data-slot="empty-state-title"
        className="text-lg font-semibold text-foreground mb-2"
      >
        {title}
      </h3>

      {/* Descricao */}
      {description && (
        <p
          data-slot="empty-state-description"
          className="text-sm text-muted-foreground max-w-sm mb-4"
        >
          {description}
        </p>
      )}

      {/* Acao */}
      {action && (
        <div data-slot="empty-state-action" className="mt-2">
          {action}
        </div>
      )}
    </div>
  )
}

/**
 * Variantes pre-configuradas para uso rapido
 */

/** Nenhum resultado de busca */
function EmptyStateSearch({
  title = "Nenhum resultado encontrado",
  description = "Tente ajustar os termos da busca.",
  ...props
}: Omit<EmptyStateProps, "variant">) {
  return (
    <EmptyState variant="search" title={title} description={description} {...props} />
  )
}

/** Lista vazia */
function EmptyStateNoResults({
  title = "Nenhum item encontrado",
  description = "Nao ha itens para exibir no momento.",
  ...props
}: Omit<EmptyStateProps, "variant">) {
  return (
    <EmptyState
      variant="no-results"
      title={title}
      description={description}
      {...props}
    />
  )
}

/** Pasta/Colecao vazia */
function EmptyStateFolder({
  title = "Pasta vazia",
  description = "Esta pasta nao contem nenhum item.",
  ...props
}: Omit<EmptyStateProps, "variant">) {
  return (
    <EmptyState variant="folder" title={title} description={description} {...props} />
  )
}

/** Favoritos vazio */
function EmptyStateFavorites({
  title = "Nenhum favorito",
  description = "Voce ainda nao adicionou nenhum item aos favoritos.",
  ...props
}: Omit<EmptyStateProps, "variant">) {
  return (
    <EmptyState
      variant="favorites"
      title={title}
      description={description}
      {...props}
    />
  )
}

/** Carrinho vazio */
function EmptyStateCart({
  title = "Carrinho vazio",
  description = "Adicione itens ao seu carrinho para continuar.",
  ...props
}: Omit<EmptyStateProps, "variant">) {
  return (
    <EmptyState variant="cart" title={title} description={description} {...props} />
  )
}

/** Sem notificacoes */
function EmptyStateNotifications({
  title = "Nenhuma notificacao",
  description = "Voce esta em dia! Nao ha novas notificacoes.",
  ...props
}: Omit<EmptyStateProps, "variant">) {
  return (
    <EmptyState
      variant="notifications"
      title={title}
      description={description}
      {...props}
    />
  )
}

/** Sem usuarios */
function EmptyStateUsers({
  title = "Nenhum usuario encontrado",
  description = "Nao ha usuarios correspondentes aos criterios.",
  ...props
}: Omit<EmptyStateProps, "variant">) {
  return (
    <EmptyState variant="users" title={title} description={description} {...props} />
  )
}

/** Sem pesquisas */
function EmptyStateSurveys({
  title = "Nenhuma pesquisa",
  description = "Crie sua primeira pesquisa para comecar a coletar feedback.",
  ...props
}: Omit<EmptyStateProps, "variant">) {
  return (
    <EmptyState variant="surveys" title={title} description={description} {...props} />
  )
}

/** Sem dados de analytics */
function EmptyStateAnalytics({
  title = "Sem dados disponiveis",
  description = "Os dados de analytics aparecerao aqui apos coletar respostas.",
  ...props
}: Omit<EmptyStateProps, "variant">) {
  return (
    <EmptyState variant="analytics" title={title} description={description} {...props} />
  )
}

export {
  EmptyState,
  EmptyStateSearch,
  EmptyStateNoResults,
  EmptyStateFolder,
  EmptyStateFavorites,
  EmptyStateCart,
  EmptyStateNotifications,
  EmptyStateUsers,
  EmptyStateSurveys,
  EmptyStateAnalytics,
}
