import { type HTMLAttributes, type ImgHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Componente Avatar
 *
 * Imagem de perfil com fallback para iniciais.
 *
 * @example
 * ```tsx
 * <Avatar src="/avatar.jpg" alt="Usuario" />
 * <Avatar fallback="JD" /> // Iniciais
 * ```
 *
 * @version 1.0.0
 */

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full bg-muted',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface AvatarProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
}

function Avatar({ className, size, src, alt, fallback, ...props }: AvatarProps) {
  return (
    <div className={cn(avatarVariants({ size, className }))} {...props}>
      {src ? (
        <AvatarImage src={src} alt={alt || ''} />
      ) : (
        <AvatarFallback>{fallback}</AvatarFallback>
      )}
    </div>
  );
}

interface AvatarImageProps extends ImgHTMLAttributes<HTMLImageElement> {}

function AvatarImage({ className, alt, ...props }: AvatarImageProps) {
  return (
    <img
      className={cn('aspect-square h-full w-full object-cover', className)}
      alt={alt}
      {...props}
    />
  );
}

interface AvatarFallbackProps extends HTMLAttributes<HTMLSpanElement> {}

function AvatarFallback({ className, children, ...props }: AvatarFallbackProps) {
  return (
    <span
      className={cn(
        'flex h-full w-full items-center justify-center bg-muted font-medium text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Avatar, AvatarImage, AvatarFallback, avatarVariants };
