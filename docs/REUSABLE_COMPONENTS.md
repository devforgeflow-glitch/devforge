# Componentes e Codigos Reutilizaveis

Este documento cataloga componentes e padroes de codigo que podem ser facilmente reutilizados em novos projetos. Baseado na analise dos projetos FastMobel e DevForge.

---

## Status da Migracao

### Componentes UI Migrados para DevForge

| Componente | Localizacao | Status |
|------------|-------------|--------|
| Alert | `src/components/ui/Alert.tsx` | Migrado |
| DropdownMenu | `src/components/ui/DropdownMenu.tsx` | Migrado |
| EmptyState | `src/components/ui/EmptyState.tsx` | Migrado |
| Skeleton | `src/components/ui/Skeleton.tsx` | Migrado |
| Table | `src/components/ui/Table.tsx` | Migrado |
| Button | `src/components/ui/Button.tsx` | Ja existia |
| Card | `src/components/ui/Card.tsx` | Ja existia |
| Dialog | `src/components/ui/Dialog.tsx` | Ja existia |
| Input | `src/components/ui/Input.tsx` | Ja existia |
| Select | `src/components/ui/Select.tsx` | Ja existia |
| Badge | `src/components/ui/Badge.tsx` | Ja existia |
| Accordion | `src/components/ui/Accordion.tsx` | Ja existia |
| Avatar | `src/components/ui/Avatar.tsx` | Ja existia |
| Checkbox | `src/components/ui/Checkbox.tsx` | Ja existia |
| Spinner | `src/components/ui/Spinner.tsx` | Ja existia |
| Textarea | `src/components/ui/Textarea.tsx` | Ja existia |

### Hooks Migrados para DevForge

| Hook | Localizacao | Status |
|------|-------------|--------|
| useLocalStorage | `src/hooks/useLocalStorage.ts` | Migrado |
| useMediaQuery | `src/hooks/useMediaQuery.ts` | Migrado |
| useDebounce | `src/hooks/useDebounce.ts` | Migrado |
| useClickOutside | `src/hooks/useClickOutside.ts` | Migrado |
| usePWA | `src/hooks/usePWA.ts` | Ja existia |

### Utilitarios Adicionados

| Funcao | Localizacao | Descricao |
|--------|-------------|-----------|
| formatCurrency | `src/lib/utils.ts` | Formata valores monetarios |
| slugify | `src/lib/utils.ts` | Gera slugs URL-safe |
| maskPhone | `src/lib/utils.ts` | Mascara telefone BR |
| maskCPF | `src/lib/utils.ts` | Mascara CPF |
| maskCNPJ | `src/lib/utils.ts` | Mascara CNPJ |
| maskCEP | `src/lib/utils.ts` | Mascara CEP |
| isValidCPF | `src/lib/utils.ts` | Valida CPF |
| isValidCNPJ | `src/lib/utils.ts` | Valida CNPJ |
| timeAgo | `src/lib/utils.ts` | Tempo relativo |
| getInitials | `src/lib/utils.ts` | Iniciais de nome |
| copyToClipboard | `src/lib/utils.ts` | Copia para clipboard |

---

## Indice

1. [Componentes UI Base](#componentes-ui-base)
2. [Componentes de Layout](#componentes-de-layout)
3. [Componentes PWA](#componentes-pwa)
4. [Componentes de Formularios](#componentes-de-formularios)
5. [Componentes de Dashboard](#componentes-de-dashboard)
6. [Componentes de Marketing](#componentes-de-marketing)
7. [Hooks Personalizados](#hooks-personalizados)
8. [Contextos React](#contextos-react)
9. [Middlewares de API](#middlewares-de-api)
10. [Utilitarios](#utilitarios)

---

## Componentes UI Base

### Button
**Origem:** FastMobel/DevForge
**Localizacao:** `src/components/ui/button.tsx`

```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  disabled?: boolean;
}
```

**Aplicacoes:**
- Qualquer projeto web com React/Next.js
- Sistemas administrativos
- E-commerce
- Landing pages

**Diferenciais:**
- Suporte a estado de loading com spinner
- Variantes pre-definidas com Tailwind
- Totalmente acessivel (ARIA)

---

### Card
**Origem:** FastMobel/DevForge
**Localizacao:** `src/components/ui/card.tsx`

```typescript
// Exports: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
interface CardProps {
  variant?: 'default' | 'elevated' | 'bordered';
  className?: string;
}
```

**Aplicacoes:**
- Dashboards e paineis administrativos
- Listagens de produtos/servicos
- Apresentacao de estatisticas
- Formularios em destaque

---

### Dialog/Modal
**Origem:** FastMobel/DevForge
**Localizacao:** `src/components/ui/dialog.tsx`

```typescript
// Baseado em Radix UI
// Exports: Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
```

**Aplicacoes:**
- Confirmacoes de acoes destrutivas
- Formularios de criacao/edicao
- Visualizacao de detalhes
- Alertas e notificacoes

**Diferenciais:**
- Acessibilidade completa (foco, ESC para fechar)
- Overlay com blur
- Animacoes suaves

---

### Input
**Origem:** DevForge
**Localizacao:** `src/components/ui/input.tsx`

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
```

**Aplicacoes:**
- Formularios de qualquer tipo
- Campos de busca
- Filtros

---

### Select
**Origem:** FastMobel/DevForge
**Localizacao:** `src/components/ui/select.tsx`

```typescript
// Baseado em Radix UI Select
// Totalmente estilizado e acessivel
```

**Aplicacoes:**
- Selecao de opcoes em formularios
- Filtros de listagens
- Configuracoes

---

### Table
**Origem:** FastMobel
**Localizacao:** `src/components/ui/table.tsx`

```typescript
// Exports: Table, TableHeader, TableBody, TableRow, TableHead, TableCell
// Suporte a ordenacao, paginacao, selecao de linhas
```

**Aplicacoes:**
- Listagens administrativas
- Relatorios
- Historicos de transacoes
- Gerenciamento de usuarios

---

### Badge
**Origem:** FastMobel/DevForge
**Localizacao:** `src/components/ui/badge.tsx`

```typescript
interface BadgeProps {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
}
```

**Aplicacoes:**
- Status de itens (ativo, inativo, pendente)
- Tags e categorias
- Contadores de notificacao
- Destaques em precos

---

### Tabs
**Origem:** FastMobel/DevForge
**Localizacao:** `src/components/ui/tabs.tsx`

```typescript
// Baseado em Radix UI Tabs
// Exports: Tabs, TabsList, TabsTrigger, TabsContent
```

**Aplicacoes:**
- Navegacao entre secoes
- Formularios em etapas
- Organizacao de conteudo

---

### Tooltip
**Origem:** FastMobel
**Localizacao:** `src/components/ui/tooltip.tsx`

```typescript
// Baseado em Radix UI Tooltip
// Exports: Tooltip, TooltipTrigger, TooltipContent, TooltipProvider
```

**Aplicacoes:**
- Dicas de interface
- Descricoes de icones
- Informacoes adicionais

---

### Skeleton
**Origem:** FastMobel/DevForge
**Localizacao:** `src/components/ui/skeleton.tsx`

```typescript
// Componente de loading placeholder
// Animacao de pulse
```

**Aplicacoes:**
- Estados de carregamento
- Placeholders de conteudo
- Loading de imagens

---

### Toast/Sonner
**Origem:** FastMobel/DevForge
**Localizacao:** `src/components/ui/sonner.tsx`

```typescript
// Integracao com biblioteca Sonner
// Notificacoes toast elegantes
```

**Aplicacoes:**
- Feedback de acoes (sucesso, erro)
- Notificacoes em tempo real
- Alertas nao-bloqueantes

---

## Componentes de Layout

### AuthLayout
**Origem:** FastMobel/DevForge
**Localizacao:** `src/components/layout/AuthLayout.tsx`

```typescript
interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}
```

**Aplicacoes:**
- Paginas de login/signup
- Recuperacao de senha
- Verificacao de email
- Onboarding

**Diferenciais:**
- Layout centralizado responsivo
- Suporte a logo customizado
- Background com gradiente/imagem

---

### DashboardLayout (Layout + Sidebar + Header)
**Origem:** FastMobel/DevForge
**Localizacao:** `src/components/layout/`

```typescript
// Combina: Layout, Sidebar, Header
// Menu lateral colapsavel
// Header com usuario e notificacoes
```

**Aplicacoes:**
- Paineis administrativos
- Areas logadas de SaaS
- CRMs e ERPs
- Backoffice

**Diferenciais:**
- Sidebar responsiva (colapsavel em mobile)
- Navegacao com icones
- Indicador de pagina ativa
- Suporte a submenu

---

### Footer
**Origem:** FastMobel/DevForge
**Localizacao:** `src/components/layout/Footer.tsx`

```typescript
// Footer completo com:
// - Links institucionais
// - Redes sociais
// - Newsletter
// - Copyright
```

**Aplicacoes:**
- Sites institucionais
- Landing pages
- E-commerce
- Blogs

---

### Header/Navbar
**Origem:** FastMobel/DevForge
**Localizacao:** `src/components/layout/Header.tsx`

```typescript
// Header responsivo com:
// - Logo
// - Menu de navegacao
// - Menu mobile (hamburger)
// - Botoes de acao
```

**Aplicacoes:**
- Qualquer site/aplicacao web
- Landing pages
- Areas publicas

---

## Componentes PWA

### InstallPrompt
**Origem:** FastMobel/DevForge
**Localizacao:** `src/components/pwa/InstallPrompt.tsx`

```typescript
// Detecta se o app pode ser instalado
// Exibe prompt customizado para instalacao
// Persiste preferencia do usuario
```

**Aplicacoes:**
- Qualquer PWA
- Apps que precisam de instalacao
- Melhoria de engajamento

**Diferenciais:**
- Detecta iOS vs Android
- Instrucoes especificas por plataforma
- Controle de exibicao (nao mostrar novamente)

---

### OfflineIndicator
**Origem:** FastMobel/DevForge
**Localizacao:** `src/components/pwa/OfflineIndicator.tsx`

```typescript
// Monitora conexao com internet
// Exibe banner quando offline
// Atualiza automaticamente quando volta online
```

**Aplicacoes:**
- PWAs
- Apps que precisam funcionar offline
- Feedback de conectividade

---

## Componentes de Formularios

### FormField com React Hook Form
**Origem:** DevForge
**Localizacao:** `src/components/forms/`

```typescript
// Integracao com react-hook-form
// Validacao com Zod
// Mensagens de erro automaticas
```

**Aplicacoes:**
- Formularios complexos
- Validacao em tempo real
- Formularios multi-step

---

### StarRating
**Origem:** DevForge
**Localizacao:** `src/pages/app/testimonial.tsx` (extrair para componente)

```typescript
interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  max?: number;
}
```

**Aplicacoes:**
- Avaliacoes de produtos
- Feedback de clientes
- Pesquisas de satisfacao
- Reviews

---

## Componentes de Dashboard

### StatCard
**Origem:** FastMobel
**Localizacao:** `src/components/admin/StatCard.tsx`

```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}
```

**Aplicacoes:**
- Dashboards administrativos
- KPIs e metricas
- Resumos financeiros
- Analytics

**Diferenciais:**
- Indicador de tendencia (seta up/down)
- Porcentagem de mudanca colorida
- Icone customizavel

---

### TrendCard
**Origem:** FastMobel
**Localizacao:** `src/components/admin/TrendCard.tsx`

```typescript
// Card com grafico de linha simples
// Mostra tendencia ao longo do tempo
```

**Aplicacoes:**
- Dashboards
- Analise de tendencias
- Metricas temporais

---

### Charts (Recharts)
**Origem:** FastMobel/DevForge
**Localizacao:** `src/components/ui/chart.tsx`

```typescript
// Wrapper para Recharts
// Estilos pre-configurados
// Suporte a dark mode
```

**Aplicacoes:**
- Graficos de linha, barra, pizza
- Analytics e relatorios
- Visualizacao de dados

---

## Componentes de Marketing

### TestimonialsCarousel
**Origem:** FastMobel/DevForge
**Localizacao:** `src/components/TestimonialsCarousel.tsx`

```typescript
interface Testimonial {
  id: string;
  text: string;
  authorName: string;
  authorRole?: string;
  authorCompany?: string;
  rating: number;
  avatarUrl?: string;
}
```

**Aplicacoes:**
- Landing pages
- Paginas de produto
- Home pages
- Prova social

**Diferenciais:**
- Carrossel automatico
- Navegacao por setas e dots
- Responsivo
- Rating com estrelas

---

### FAQ Accordion
**Origem:** DevForge
**Localizacao:** Componente inline em `src/pages/index.tsx`

```typescript
// Baseado em Radix UI Accordion
// Perguntas frequentes expandiveis
```

**Aplicacoes:**
- Paginas de FAQ
- Secoes de duvidas em landing pages
- Documentacao
- Suporte

---

### PricingCards
**Origem:** DevForge
**Localizacao:** `src/pages/pricing.tsx` (extrair para componente)

```typescript
interface PricingPlan {
  name: string;
  price: number;
  period: string;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
}
```

**Aplicacoes:**
- Paginas de precos
- Comparacao de planos
- Upselling

---

### FloatingWhatsApp
**Origem:** DevForge
**Localizacao:** `src/components/FloatingWhatsApp.tsx`

```typescript
interface FloatingWhatsAppProps {
  phoneNumber: string;
  message?: string;
  position?: 'left' | 'right';
}
```

**Aplicacoes:**
- Sites comerciais
- E-commerce
- Suporte ao cliente
- Vendas

---

## Hooks Personalizados

### useAuth
**Origem:** FastMobel/DevForge
**Localizacao:** `src/contexts/AuthContext.tsx`

```typescript
interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
```

**Aplicacoes:**
- Qualquer app com autenticacao
- Firebase Auth
- Autenticacao customizada

---

### useTheme
**Origem:** FastMobel/DevForge
**Localizacao:** `src/contexts/ThemeContext.tsx`

```typescript
interface UseThemeReturn {
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}
```

**Aplicacoes:**
- Dark mode
- Temas customizados
- Preferencia do usuario

---

### useMediaQuery
**Origem:** FastMobel
**Localizacao:** `src/hooks/useMediaQuery.ts`

```typescript
function useMediaQuery(query: string): boolean;
// Ex: useMediaQuery('(min-width: 768px)')
```

**Aplicacoes:**
- Responsividade
- Renderizacao condicional
- Layouts adaptativos

---

### useLocalStorage
**Origem:** FastMobel
**Localizacao:** `src/hooks/useLocalStorage.ts`

```typescript
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void];
```

**Aplicacoes:**
- Persistencia de preferencias
- Cache local
- Estado persistente

---

### useDebounce
**Origem:** FastMobel
**Localizacao:** `src/hooks/useDebounce.ts`

```typescript
function useDebounce<T>(value: T, delay: number): T;
```

**Aplicacoes:**
- Campos de busca
- Auto-save
- Otimizacao de performance

---

## Contextos React

### AuthContext
**Origem:** FastMobel/DevForge
**Localizacao:** `src/contexts/AuthContext.tsx`

```typescript
// Gerenciamento completo de autenticacao
// Firebase ou customizado
// Persistencia de sessao
```

**Aplicacoes:**
- Qualquer app autenticado

---

### ThemeContext
**Origem:** FastMobel/DevForge
**Localizacao:** `src/contexts/ThemeContext.tsx`

```typescript
// Dark mode / Light mode
// Preferencia do sistema
// Persistencia em localStorage
```

**Aplicacoes:**
- Apps com dark mode

---

### ToastContext (via Sonner)
**Origem:** DevForge
**Localizacao:** Integrado via Sonner

```typescript
// Notificacoes globais
// toast.success(), toast.error(), etc.
```

**Aplicacoes:**
- Feedback de acoes

---

## Middlewares de API

### withAuth
**Origem:** FastMobel/DevForge
**Localizacao:** `src/api/middleware/auth.ts`

```typescript
// Valida JWT
// Extrai usuario do token
// Adiciona user ao request
```

**Aplicacoes:**
- Rotas protegidas
- APIs autenticadas

---

### withValidation (Zod)
**Origem:** FastMobel/DevForge
**Localizacao:** `src/api/middleware/validator.ts`

```typescript
// Valida body com schema Zod
// Retorna erros formatados
```

**Aplicacoes:**
- Validacao de entrada
- Type safety

---

### withRateLimit
**Origem:** FastMobel/DevForge
**Localizacao:** `src/api/middleware/rateLimit.ts`

```typescript
// Rate limiting por IP ou usuario
// Redis ou in-memory
```

**Aplicacoes:**
- Protecao contra abuso
- APIs publicas

---

### withCors
**Origem:** FastMobel/DevForge
**Localizacao:** `src/api/middleware/cors.ts`

```typescript
// Configuracao CORS
// Origins permitidas
```

**Aplicacoes:**
- APIs publicas
- Integracao com terceiros

---

## Utilitarios

### formatDate
**Origem:** FastMobel/DevForge
**Localizacao:** `src/lib/utils.ts`

```typescript
function formatDate(date: Date | string, format?: string): string;
```

**Aplicacoes:**
- Formatacao de datas
- Localizacao

---

### formatCurrency
**Origem:** FastMobel
**Localizacao:** `src/lib/utils.ts`

```typescript
function formatCurrency(value: number, currency?: string): string;
// Ex: formatCurrency(1990) => "R$ 19,90"
```

**Aplicacoes:**
- E-commerce
- Financeiro
- Relatorios

---

### cn (classNames)
**Origem:** FastMobel/DevForge
**Localizacao:** `src/lib/utils.ts`

```typescript
function cn(...inputs: ClassValue[]): string;
// Combina clsx + tailwind-merge
```

**Aplicacoes:**
- Componentes com Tailwind
- Classes condicionais

---

### slugify
**Origem:** FastMobel
**Localizacao:** `src/lib/utils.ts`

```typescript
function slugify(text: string): string;
// Ex: "Meu Produto Novo" => "meu-produto-novo"
```

**Aplicacoes:**
- URLs amigaveis
- SEO
- Identificadores

---

### maskPhone / maskCPF / maskCNPJ
**Origem:** FastMobel
**Localizacao:** `src/lib/masks.ts`

```typescript
function maskPhone(value: string): string;
function maskCPF(value: string): string;
function maskCNPJ(value: string): string;
```

**Aplicacoes:**
- Formularios brasileiros
- Validacao de documentos

---

## Schemas de Validacao (Zod)

### userSchema
**Origem:** FastMobel/DevForge
**Localizacao:** `src/api/lib/schemas/`

```typescript
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});
```

**Aplicacoes:**
- Validacao de usuarios
- Signup/Login

---

### contactSchema
**Origem:** DevForge
**Localizacao:** `src/api/lib/schemas/contact.schema.ts`

```typescript
// Schema completo para formulario de contato
// Inclui assuntos pre-definidos
```

**Aplicacoes:**
- Formularios de contato
- Suporte

---

## Configuracoes Reutilizaveis

### tailwind.config.js
**Origem:** FastMobel/DevForge

```javascript
// Configuracao completa com:
// - Cores customizadas (brand)
// - Dark mode
// - Animacoes
// - Plugins (typography, forms, aspect-ratio)
```

---

### next.config.js
**Origem:** FastMobel/DevForge

```javascript
// Configuracao otimizada com:
// - i18n
// - Imagens otimizadas
// - Headers de seguranca
// - Redirects
```

---

### Firebase Config
**Origem:** FastMobel/DevForge
**Localizacao:** `src/api/lib/firebase.ts`

```typescript
// Inicializacao segura
// Admin SDK
// Firestore, Auth, Storage
```

---

## Como Reutilizar

### 1. Copiar Componentes UI

```bash
# Copiar pasta de componentes UI
cp -r projeto-origem/src/components/ui projeto-destino/src/components/
```

### 2. Instalar Dependencias

```bash
# Dependencias comuns necessarias
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-tabs
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
npm install sonner
```

### 3. Configurar Tailwind

Copiar as configuracoes de cores e plugins do `tailwind.config.js`.

### 4. Importar Utilitarios

Copiar `src/lib/utils.ts` com a funcao `cn()`.

---

## Proximos Passos

1. **Criar pacote NPM privado** com componentes UI base
2. **Template de projeto** com estrutura pre-configurada
3. **Storybook compartilhado** para documentacao visual
4. **CLI para scaffolding** de novos projetos

---

**Ultima Atualizacao:** 2025-12-29
**Versao:** 1.0.0
