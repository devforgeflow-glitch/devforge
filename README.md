# 🚀 DevForge

> Template enterprise-grade para aplicações SaaS modernas, construído com Next.js, TypeScript e Firebase.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-Admin-FFCA28?style=flat-square&logo=firebase)
![Security](https://img.shields.io/badge/Security-18%20Layers-green?style=flat-square&logo=shield)

---

## ✨ Funcionalidades

### 🔒 Segurança Enterprise (18 Camadas)
- Helmet, CORS, CSRF Protection
- JWT + Refresh Token + 2FA
- Rate Limiting Distribuído (Redis)
- Audit Logging com PII Masking (LGPD)
- SAST Automatizado (CodeQL, Snyk)

### 🌙 Dark Mode
- Toggle claro/escuro/sistema
- Persistência de preferência
- Zero flash no carregamento

### 🌍 Internacionalização (i18n)
- Português, English, Español
- Detecção automática
- SEO otimizado por idioma

### 🤖 Inteligência Artificial
- Integração OpenAI GPT-4 / Claude
- Geração automática de conteúdo
- Análise de sentimento

### 📊 Jobs em Background (BullMQ)
- Processamento assíncrono
- Retries automáticos
- Monitoramento em tempo real

### 🎨 White-label
- Personalização de cores
- Logo customizável
- Temas por organização

### 📚 Storybook
- Documentação de componentes
- Testes visuais
- Design system

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 20+
- Redis (local ou cloud)
- Firebase Project
- Conta OpenAI/Anthropic (opcional)

### Instalação

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/devforge.git
cd devforge

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Iniciar em desenvolvimento
npm run dev
```

### Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Build de produção
npm run start            # Inicia servidor de produção

# Qualidade
npm run lint             # Verifica ESLint
npm run type-check       # Verifica TypeScript
npm test                 # Executa testes

# Storybook
npm run storybook        # Inicia Storybook
npm run build-storybook  # Build do Storybook

# Jobs (BullMQ)
npm run jobs:dev         # Inicia workers em dev
npm run jobs:dashboard   # Dashboard Bull Board
```

---

## 📁 Estrutura do Projeto

```
devforge/
├── src/
│   ├── pages/api/       # API Routes
│   ├── api/             # Backend (services, middleware)
│   ├── components/      # React Components
│   ├── contexts/        # Theme, Auth, i18n
│   ├── hooks/           # Custom hooks
│   ├── locales/         # Traduções
│   └── types/           # TypeScript types
├── tests/               # Testes
├── stories/             # Storybook
├── docs/                # Documentação
└── public/              # Assets estáticos
```

---

## 🛡️ Segurança

Este template implementa **18 camadas de segurança**:

| Camada | Descrição |
|--------|-----------|
| Helmet | Security Headers |
| CORS | Cross-Origin Protection |
| CSRF | Double-Submit Cookie |
| JWT | Token Authentication |
| RBAC | Role-Based Access Control |
| Rate Limit | DoS Prevention |
| Zod | Input Validation |
| Audit Log | Compliance Logging |
| PII Masking | LGPD Compliance |
| ... | [Ver documentação completa](docs/security/SECURITY_LAYERS_GUIDE.md) |

---

## 🎨 Showcase: FeedbackHub

Este template inclui um produto completo de exemplo: **FeedbackHub** - Plataforma de Pesquisas e Feedbacks.

### Funcionalidades do Produto

- ✅ Criação de pesquisas (manual ou com IA)
- ✅ Coleta de respostas em tempo real
- ✅ Dashboard de analytics
- ✅ Exportação CSV/PDF
- ✅ Webhooks para integrações
- ✅ Planos e billing

---

## 📚 Documentação

- [Guia de Segurança](docs/security/SECURITY_LAYERS_GUIDE.md)
- [API Reference](docs/api/OPENAPI_SPEC.yaml)
- [Guia de Contribuição](docs/guides/CONTRIBUTING.md)
- [Storybook](https://devforge-storybook.vercel.app)

---

## 🧪 Testes

```bash
# Unitários
npm run test:unit

# Integração
npm run test:integration

# E2E
npm run test:e2e

# Cobertura
npm run test:coverage
```

---

## 📄 Licença

Este projeto é proprietário. Uso comercial requer licença.

---

## 🤝 Suporte

- 📧 Email: suporte@devforge.com.br
- 💬 WhatsApp: (XX) XXXXX-XXXX
- 📖 Docs: [docs.devforge.com.br](https://docs.devforge.com.br)

---

**Desenvolvido com ❤️ e 🤖 IA por [Seu Nome/Empresa]**
