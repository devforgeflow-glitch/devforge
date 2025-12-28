# 🚀 CLAUDE.md - DevForge Template

## 🎯 Sobre Este Projeto

**DevForge** é um template enterprise-grade para desenvolvimento de aplicações SaaS modernas. Foi construído para demonstrar capacidades técnicas avançadas e servir como base para projetos de clientes.

**Produto Showcase:** Plataforma de Pesquisas e Feedbacks (FeedbackHub)

---

## 🇧🇷 IDIOMA E COMUNICAÇÃO

**REGRA FUNDAMENTAL - PORTUGUÊS BRASILEIRO SEMPRE:**

- ✅ **TODA** documentação deve ser em português brasileiro
- ✅ **TODOS** os comentários de código devem ser em português brasileiro
- ✅ **TODAS** as mensagens de commit devem ser em português brasileiro
- ✅ **TODOS** os arquivos .md devem ser em português brasileiro
- ✅ **TODOS** os logs e mensagens de erro devem ser em português brasileiro
- ✅ **TODAS** as respostas ao usuário devem ser em português brasileiro
- ❌ **NUNCA** crie documentação em inglês (exceto código-fonte que segue convenções internacionais)

**Exceções permitidas (apenas código):**
- Nomes de variáveis, funções, classes (seguem padrão camelCase/PascalCase em inglês)
- Strings em APIs externas
- Bibliotecas e imports

---

## 📏 LIMITES DE CÓDIGO - PADRÕES DE MERCADO (OBRIGATÓRIO)

> **REGRA CRÍTICA:** Estes limites são baseados em padrões da indústria (Google, Airbnb, Microsoft, Clean Code) e DEVEM ser seguidos em TODA criação ou modificação de código.

### 📊 LIMITES NUMÉRICOS (HARD LIMITS)

| Métrica | ✅ Ideal | ⚠️ Máximo | 🔴 Refatorar |
|---------|----------|-----------|--------------|
| **Linhas por arquivo** | 200-300 | 400-500 | >500 |
| **Linhas por função** | 20-30 | 50 | >50 |
| **Responsabilidades por arquivo** | 1 | 2-3 | >3 |
| **useState hooks** | 3-5 | 7-8 | >8 |
| **useEffect hooks** | 1-2 | 3-4 | >4 |
| **Funções handler** | 5-8 | 10-12 | >12 |
| **Imports** | 8-12 | 15-20 | >20 |
| **Props de componente** | 3-5 | 7-8 | >8 |
| **Parâmetros de função** | 2-3 | 4-5 | >5 |
| **Aninhamento (nesting)** | 2-3 | 4 | >4 |
| **Complexidade ciclomática** | 5-10 | 15 | >15 |

### 🎯 REGRA DE RESPONSABILIDADE ÚNICA (Single Responsibility Principle)

**Cada arquivo/componente deve ter APENAS UMA razão para mudar.**

**Como contar responsabilidades:**
- Cada seção visual distinta = 1 responsabilidade
- Cada endpoint de API diferente = 1 responsabilidade
- Cada modal/dialog = 1 responsabilidade
- Cada formulário = 1 responsabilidade
- Cada tab = 1 responsabilidade

**Exemplo prático:**
```typescript
// ❌ ERRADO: 5 responsabilidades em um arquivo (800 linhas)
// SurveyPage.tsx
// - Formulário de criação
// - Lista de pesquisas
// - Modal de edição
// - Configurações
// - Analytics

// ✅ CORRETO: 1 responsabilidade por arquivo
// src/components/surveys/
// ├── SurveysPage.tsx (100 linhas) - Container/routing
// ├── SurveyList.tsx (150 linhas) - Lista
// ├── SurveyForm.tsx (200 linhas) - Formulário
// ├── SurveySettings.tsx (120 linhas) - Configurações
// └── modals/
//     └── EditSurveyModal.tsx (180 linhas) - Modal
```

### 🚨 VALIDAÇÃO OBRIGATÓRIA ANTES DE CRIAR CÓDIGO

**ANTES de escrever qualquer componente/função, responder:**

```
□ Quantas linhas terá aproximadamente? (máx 400-500)
□ Quantas responsabilidades terá? (máx 2-3)
□ Quantos useState precisará? (máx 7-8)
□ Quantos useEffect precisará? (máx 3-4)
□ Se exceder algum limite, como vou dividir?
```

**Se QUALQUER limite for excedido → DIVIDIR ANTES de implementar**

### 📁 ESTRUTURA DE REFATORAÇÃO PADRÃO

Quando um componente precisar ser dividido, usar esta estrutura:

```
src/components/[domínio]/[componente]/
├── index.ts              # Re-exports
├── types.ts              # Interfaces e tipos
├── constants.ts          # Constantes e configurações
├── [ComponentePrincipal].tsx  # Container (máx 200 linhas)
├── hooks/                # Custom hooks
│   ├── use[Feature].ts
│   └── use[OtherFeature].ts
└── components/           # Sub-componentes
    ├── [SubComponent1].tsx
    ├── [SubComponent2].tsx
    └── modals/
        └── [Modal].tsx
```

### ✅ CHECKLIST DE CONFORMIDADE

```
ANTES DE COMMITAR, VALIDAR:
□ Nenhum arquivo >500 linhas?
□ Nenhuma função >50 linhas?
□ Máximo 3 responsabilidades por arquivo?
□ Máximo 8 useState por componente?
□ Máximo 4 useEffect por componente?
□ Máximo 8 props por componente?
□ Máximo 5 parâmetros por função?
□ Imports organizados e <20?
□ Aninhamento máximo 4 níveis?
```

### 🔧 QUANDO REFATORAR (Triggers Automáticos)

**Refatoração OBRIGATÓRIA se:**
```
(linhas > 500) OU (responsabilidades > 3) OU (useState > 8)
```

**Refatoração RECOMENDADA se:**
```
(linhas > 400) OU (responsabilidades > 2) OU (useState > 6)
```

### 📚 REFERÊNCIAS

Estes limites são baseados em:
- **Google Style Guide**: 200-300 linhas ideal, 500 máximo
- **Airbnb React Guide**: Componentes "do tamanho de uma tela"
- **Clean Code (Robert C. Martin)**: 100-200 linhas ideal
- **Microsoft Guidelines**: Foco em manutenibilidade

---

## 🏗️ Stack Tecnológica

### Core
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Next.js** | 14+ | Framework React full-stack |
| **React** | 19+ | UI Library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 3.x | Styling |

### Backend
| Tecnologia | Propósito |
|------------|-----------|
| **Firebase Admin** | Database (Firestore), Auth, Storage |
| **Redis** | Cache, Rate Limiting, Sessions |
| **BullMQ** | Job Queue, Background Processing |

### Integrações
| Tecnologia | Propósito |
|------------|-----------|
| **OpenAI/Claude API** | Inteligência Artificial |
| **Mercado Pago** | Pagamentos |
| **SendGrid** | Emails transacionais |
| **Sentry** | Error Monitoring |

### DevOps
| Tecnologia | Propósito |
|------------|-----------|
| **Vercel** | Deploy e Hosting |
| **GitHub Actions** | CI/CD |
| **CodeQL/Snyk** | Security Scanning (SAST) |

---

## 📐 Arquitetura e Estrutura de Pastas

```
devforge/
├── src/
│   ├── pages/                    # Next.js Pages Router
│   │   ├── api/                  # 🚪 API Routes (apenas routing)
│   │   │   ├── auth/            # Autenticação
│   │   │   ├── surveys/         # Pesquisas (domínio principal)
│   │   │   ├── responses/       # Respostas
│   │   │   ├── analytics/       # Analytics
│   │   │   ├── webhooks/        # Webhooks outbound
│   │   │   ├── admin/           # Admin endpoints
│   │   │   └── billing/         # Pagamentos
│   │   ├── app/                 # Páginas autenticadas
│   │   └── [landing pages]      # Páginas públicas
│   │
│   ├── api/                      # 🧠 Backend Logic
│   │   ├── middleware/          # Segurança (auth, validation, etc)
│   │   ├── services/            # ⭐ Lógica de negócio
│   │   ├── lib/                 # Configs (Firebase, Redis, AI)
│   │   ├── utils/               # Utilitários (logger, errors)
│   │   ├── jobs/                # BullMQ job processors
│   │   └── types/               # TypeScript types backend
│   │
│   ├── components/               # ⚛️ React Components
│   │   ├── ui/                  # Componentes base (Storybook)
│   │   ├── forms/               # Formulários
│   │   ├── dashboard/           # Dashboard widgets
│   │   ├── surveys/             # Componentes de pesquisa
│   │   └── layout/              # Layout components
│   │
│   ├── hooks/                    # Custom hooks
│   ├── contexts/                 # React Contexts (Theme, Auth, i18n)
│   ├── lib/                      # Client-side libs
│   ├── styles/                   # Global styles
│   ├── locales/                  # 🌍 Traduções (i18n)
│   │   ├── pt-BR/
│   │   ├── en/
│   │   └── es/
│   └── types/                    # Frontend types
│
├── tests/                        # 🧪 Testes
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── stories/                      # 📚 Storybook stories
│
├── docs/                         # 📖 Documentação
│   ├── api/                     # OpenAPI specs
│   ├── security/                # Guias de segurança
│   └── guides/                  # Guias de desenvolvimento
│
├── scripts/                      # Scripts utilitários
├── public/                       # Assets estáticos
└── .github/                      # GitHub Actions
    └── workflows/
```

---

## 🎨 Sistema de Design

### Cores da Marca DevForge

```typescript
// tailwind.config.js
colors: {
  brand: {
    primary: '#6366F1',      // Indigo - Ação principal
    secondary: '#8B5CF6',    // Violet - Destaques
    accent: '#06B6D4',       // Cyan - CTAs secundários
    dark: '#1E1B4B',         // Indigo escuro - Textos
    light: '#EEF2FF',        // Indigo claro - Backgrounds
  },
  // Dark mode
  dark: {
    bg: '#0F172A',           // Slate 900
    card: '#1E293B',         // Slate 800
    border: '#334155',       // Slate 700
  }
}
```

### Padrão de Botões (OBRIGATÓRIO)

**TODOS os botões DEVEM usar formato de pílula (rounded-full):**

```tsx
// ✅ CORRETO: Botão primário
<button className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-full hover:bg-brand-primary/90 transition-colors">
  Criar Pesquisa
</button>

// ✅ CORRETO: Botão secundário
<button className="px-6 py-3 bg-white border-2 border-brand-primary text-brand-primary font-semibold rounded-full hover:bg-brand-light transition-colors">
  Ver Resultados
</button>

// ❌ ERRADO: Nunca usar rounded-lg, rounded-md
<button className="rounded-lg">Errado</button>
```

---

## 🌙 Dark Mode (IMPLEMENTAÇÃO OBRIGATÓRIA)

### Estrutura

```typescript
// src/contexts/ThemeContext.tsx
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}
```

### Uso em Componentes

```tsx
// ✅ CORRETO: Usar classes Tailwind dark:
<div className="bg-white dark:bg-dark-bg text-gray-900 dark:text-white">
  <h1 className="text-brand-dark dark:text-white">Título</h1>
</div>

// ✅ CORRETO: Toggle de tema
<ThemeToggle /> // Componente no header
```

### Regras
- ✅ SEMPRE definir variante dark: para cores de fundo e texto
- ✅ SEMPRE testar componentes em ambos os modos
- ✅ Persistir preferência no localStorage
- ✅ Respeitar preferência do sistema (prefers-color-scheme)
- ❌ NUNCA usar cores hardcoded sem variante dark

---

## 🌍 Internacionalização (i18n)

### Estrutura de Arquivos

```
src/locales/
├── pt-BR/
│   ├── common.json      # Textos comuns
│   ├── auth.json        # Autenticação
│   ├── surveys.json     # Pesquisas
│   ├── dashboard.json   # Dashboard
│   └── errors.json      # Mensagens de erro
├── en/
│   └── [mesmos arquivos]
└── es/
    └── [mesmos arquivos]
```

### Uso em Componentes

```tsx
// ✅ CORRETO: Usar hook de tradução
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('surveys');

  return (
    <h1>{t('title')}</h1>
    <p>{t('description', { count: 10 })}</p>
  );
}

// ❌ ERRADO: Texto hardcoded
<h1>Minhas Pesquisas</h1>
```

### Regras
- ✅ TODOS os textos visíveis devem usar traduções
- ✅ Chaves de tradução em inglês (ex: `surveys.create.title`)
- ✅ Interpolação para valores dinâmicos
- ✅ Pluralização quando necessário
- ❌ NUNCA hardcode textos em componentes

---

## 🤖 Integração com IA

### Estrutura

```typescript
// src/api/lib/ai.ts
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
```

### Service de IA

```typescript
// src/api/services/ai.service.ts
export class AIService {
  /**
   * Gera perguntas de pesquisa baseado em contexto
   */
  async generateSurveyQuestions(context: string): Promise<Question[]>;

  /**
   * Analisa sentimento das respostas
   */
  async analyzeSentiment(responses: string[]): Promise<SentimentAnalysis>;

  /**
   * Gera resumo executivo dos resultados
   */
  async generateSummary(surveyId: string): Promise<string>;
}
```

### Regras
- ✅ SEMPRE ter fallback se IA falhar
- ✅ Rate limiting específico para endpoints de IA
- ✅ Cache de resultados quando possível
- ✅ Logging de uso para controle de custos
- ❌ NUNCA expor API keys no frontend

---

## 📊 Jobs em Background (BullMQ)

### Estrutura

```typescript
// src/api/jobs/queues.ts
import { Queue } from 'bullmq';

export const emailQueue = new Queue('emails');
export const exportQueue = new Queue('exports');
export const analyticsQueue = new Queue('analytics');
export const aiQueue = new Queue('ai-processing');
```

### Tipos de Jobs

| Queue | Jobs | Prioridade |
|-------|------|------------|
| `emails` | Envio de emails, notificações | Alta |
| `exports` | Exportação CSV/PDF | Média |
| `analytics` | Agregação de métricas | Baixa |
| `ai-processing` | Análise de sentimento, resumos | Média |

### Regras
- ✅ Jobs idempotentes (podem ser re-executados)
- ✅ Retry automático com backoff exponencial
- ✅ Dead letter queue para jobs falhos
- ✅ Monitoramento via Bull Board
- ❌ NUNCA processar tarefas pesadas no request principal

---

## 🔒 Segurança (18 Camadas - OBRIGATÓRIO)

### Camadas Implementadas

| # | Camada | Status |
|---|--------|--------|
| 1 | Helmet (Security Headers) | ✅ |
| 2 | CORS | ✅ |
| 3 | CSRF Protection | ✅ |
| 4 | JWT Auth | ✅ |
| 5 | Permissions (RBAC) | ✅ |
| 6 | Rate Limiting | ✅ |
| 7 | Zod Validation | ✅ |
| 8 | Audit Logging | ✅ |
| 9 | PII Masking | ✅ |
| 10 | Security Events | ✅ |
| 11 | Error Sanitization | ✅ |
| 12 | N+1 Prevention | ✅ |
| 13 | Mass Assignment Prevention | ✅ |
| 14 | Security Headers (Global) | ✅ |
| 15 | IP Allowlist (Admin) | ✅ |
| 16 | Circuit Breaker | ✅ |
| 17 | SRI Policy | ✅ |
| 18 | security.txt | ✅ |

### Template de API Route

```typescript
/**
 * API Route: /api/surveys
 *
 * Camadas de Segurança:
 * - ✅ 1-18: Todas implementadas
 */
export default async function handler(req, res) {
  try {
    await runMiddleware(req, res, [
      helmetMiddleware,
      corsMiddleware,
      authMiddleware,
      csrfMiddleware(),
      permissionsMiddleware(['user']),
      rateLimitMiddleware({ windowMs: 60000, max: 100 }),
      validatorMiddleware(schema),
    ]);

    // Business logic...

  } catch (error) {
    return handleApiError(error, req, res);
  }
}
```

---

## 🎯 Funcionalidades do Produto (FeedbackHub)

### Domínio Principal: Pesquisas

```typescript
// Entidades principais
interface Survey {
  id: string;
  organizationId: string;      // Multi-tenant
  title: string;
  description?: string;
  questions: Question[];
  settings: SurveySettings;
  status: 'draft' | 'active' | 'closed';
  createdAt: Timestamp;
  createdBy: string;
}

interface Question {
  id: string;
  type: 'text' | 'rating' | 'choice' | 'nps' | 'matrix';
  text: string;
  required: boolean;
  options?: string[];          // Para choice/matrix
  aiGenerated?: boolean;       // Gerado por IA
}

interface Response {
  id: string;
  surveyId: string;
  answers: Answer[];
  respondent?: RespondentInfo; // Anônimo ou identificado
  sentiment?: SentimentScore;  // Análise de IA
  createdAt: Timestamp;
}
```

### Fluxos Principais

1. **Criar Pesquisa** → Editor de perguntas (ou gerar com IA)
2. **Publicar** → Gera link público/embed
3. **Coletar** → Respostas em real-time
4. **Analisar** → Dashboard + Insights IA
5. **Exportar** → CSV/PDF (job em background)
6. **Integrar** → Webhooks para sistemas externos

---

## 📋 Padrões de Código

### Commits Semânticos

```
feat(surveys): adicionar geração de perguntas com IA
fix(auth): corrigir refresh token expirado
docs(readme): atualizar instruções de instalação
test(analytics): adicionar testes de agregação
refactor(api): extrair validação para middleware
perf(dashboard): otimizar queries de métricas
chore(deps): atualizar dependências
```

### Nomenclatura de Arquivos

```
Componentes:   PascalCase.tsx     (SurveyCard.tsx)
Hooks:         camelCase.ts       (useSurveys.ts)
Services:      kebab-case.ts      (survey.service.ts)
Utils:         camelCase.ts       (formatDate.ts)
Types:         kebab-case.ts      (survey.types.ts)
Tests:         *.test.ts          (survey.service.test.ts)
Stories:       *.stories.tsx      (SurveyCard.stories.tsx)
```

### JSDoc Obrigatório

```typescript
/**
 * Cria uma nova pesquisa
 *
 * @param userId - ID do usuário criador
 * @param data - Dados da pesquisa validados
 * @returns Promise<Survey> - Pesquisa criada
 *
 * @throws {ValidationError} Dados inválidos
 * @throws {QuotaExceededError} Limite de pesquisas excedido
 *
 * @example
 * const survey = await surveyService.create('user-123', {
 *   title: 'Pesquisa de Satisfação',
 *   questions: [...]
 * });
 */
async create(userId: string, data: CreateSurveyInput): Promise<Survey>
```

---

## 🧪 Testes

### Cobertura por Criticidade

| Criticidade | Meta | Módulos |
|-------------|------|---------|
| 🔴 CRÍTICO | 90%+ | auth, billing, permissions |
| 🟠 ALTO | 75%+ | surveys, responses, analytics |
| 🟡 MÉDIO | 50%+ | webhooks, exports, ai |
| 🟢 BAIXO | 30%+ | admin, settings |

### Comandos

```bash
npm test                    # Todos os testes
npm run test:unit          # Apenas unitários
npm run test:integration   # Apenas integração
npm run test:e2e           # Apenas E2E
npm run test:coverage      # Com relatório de cobertura
npm run test:watch         # Watch mode
```

---

## ✅ Checklist Pré-Commit

```markdown
□ TAMANHO DE ARQUIVOS
  - [ ] Nenhum arquivo >500 linhas
  - [ ] Nenhuma função >50 linhas
  - [ ] Máximo 3 responsabilidades por arquivo

□ QUALIDADE
  - [ ] npm run lint (0 erros)
  - [ ] npm run type-check (0 erros)
  - [ ] npm test (100% passando)

□ DARK MODE
  - [ ] Componente funciona em modo claro
  - [ ] Componente funciona em modo escuro
  - [ ] Contraste adequado em ambos

□ i18n
  - [ ] Nenhum texto hardcoded
  - [ ] Traduções em PT-BR, EN, ES
  - [ ] Chaves de tradução corretas

□ SEGURANÇA
  - [ ] Validação Zod implementada
  - [ ] Autenticação verificada
  - [ ] Rate limiting configurado

□ DOCUMENTAÇÃO
  - [ ] JSDoc em funções públicas
  - [ ] Story no Storybook (se componente)
```

---

## 🚀 Roadmap de Funcionalidades

### Fase 1: Core (Semana 1-2)
- [ ] Migração do template FastMobel
- [ ] Dark Mode
- [ ] i18n (PT-BR, EN, ES)
- [ ] Storybook setup

### Fase 2: Features (Semana 2-3)
- [ ] BullMQ setup
- [ ] AI Integration
- [ ] White-label básico

### Fase 3: Produto (Semana 3-5)
- [ ] Landing page
- [ ] CRUD Pesquisas
- [ ] Coleta de respostas
- [ ] Dashboard Analytics
- [ ] Billing

### Fase 4: Polish (Semana 5-6)
- [ ] Página /recursos
- [ ] Página /como-foi-feito
- [ ] Documentação OpenAPI
- [ ] Testes E2E
- [ ] Deploy produção

---

## 📚 Documentação de Referência

### Interna
- `docs/security/SECURITY_LAYERS_GUIDE.md` - Guia de segurança
- `docs/api/OPENAPI_SPEC.yaml` - Especificação da API
- `docs/guides/CONTRIBUTING.md` - Guia de contribuição

### Externa
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [next-intl](https://next-intl-docs.vercel.app/)
- [BullMQ](https://docs.bullmq.io/)
- [Storybook](https://storybook.js.org/docs)

---

**Versão:** 1.0.0
**Última Atualização:** 2025-12-28
**Status:** Desenvolvimento inicial

---

## 🔄 Origem

Este projeto foi criado a partir do template **FastMobel**, com todas as 18 camadas de segurança, 45+ services, e infraestrutura enterprise-grade.

**Desenvolvido com IA:** Claude Code (Anthropic)
