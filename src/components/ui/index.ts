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
export { Label, type LabelProps } from './Label';

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

// Acordeao
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  type AccordionProps,
  type AccordionItemProps,
  type AccordionTriggerProps,
  type AccordionContentProps,
} from './Accordion';

// Alertas
export { Alert, AlertTitle, AlertDescription } from './Alert';

// Dropdown Menu
export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './DropdownMenu';

// Estados vazios
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
} from './EmptyState';

// Skeletons (loading placeholders)
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
} from './Skeleton';

// Tabela
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './Table';
