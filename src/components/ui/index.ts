/**
 * Componentes UI - DevForge
 *
 * Exporta todos os componentes de UI reutilizaveis.
 *
 * @version 1.0.0
 */

// Botoes e acoes
export { Button, buttonVariants, type ButtonProps } from './Button';

// Formularios
export { Input, inputVariants, type InputProps } from './Input';
export { Textarea, textareaVariants, type TextareaProps } from './Textarea';
export { Select, type SelectOption } from './Select';
export { Checkbox, type CheckboxProps } from './Checkbox';

// Layout e containers
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
  type CardProps,
} from './Card';

// Modais e overlays
export {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogCloseButton,
} from './Dialog';

// Feedback
export { Badge, badgeVariants, type BadgeProps } from './Badge';
export { Spinner, LoadingScreen, spinnerVariants, type SpinnerProps } from './Spinner';
export { LoadingLogo, LoadingLogoFullscreen, LoadingLogoOverlay } from './LoadingLogo';
export { CookieConsent, useCookieConsent } from './CookieConsent';

// Avatar e imagens
export { Avatar, AvatarImage, AvatarFallback, avatarVariants, type AvatarProps } from './Avatar';

// Tema e idioma
export { ThemeToggle } from './ThemeToggle';
export { LanguageSelector } from './LanguageSelector';
