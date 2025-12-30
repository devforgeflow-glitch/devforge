/**
 * Componente Alert
 *
 * Exibe mensagens de alerta com diferentes variantes.
 * Suporte a dark mode.
 *
 * @example
 * ```tsx
 * <Alert>
 *   <AlertTitle>Atencao!</AlertTitle>
 *   <AlertDescription>Esta e uma mensagem de alerta.</AlertDescription>
 * </Alert>
 * ```
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&:has(>svg)]:pl-11",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border",
        destructive:
          "text-destructive bg-destructive/10 border-destructive/20 [&>svg]:text-destructive",
        success:
          "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 [&>svg]:text-green-600",
        warning:
          "text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 [&>svg]:text-yellow-600",
        info:
          "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 [&>svg]:text-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "mb-1 font-medium leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm [&_p]:leading-relaxed opacity-90",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
