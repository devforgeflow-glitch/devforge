# Varredura de Qualidade de Codigo - DevForge

Guia completo para varreduras de qualidade e prevencao de erros comuns.

**Versao:** 1.0.0
**Ultima Atualizacao:** 2025-12-28

---

## Indice

1. [Varreduras de Correcao](#varreduras-de-correcao)
2. [Diretrizes de Prevencao](#diretrizes-de-prevencao)
3. [Automacao](#automacao)
4. [Checklist de Code Review](#checklist-de-code-review)

---

## Varreduras de Correcao

### Prioridade de Execucao

| Prioridade | Varredura | Impacto |
|------------|-----------|---------|
| P0 - CRITICO | Undefined no Firestore | Crash imediato |
| P0 - CRITICO | Null safety em .data() | Crash em runtime |
| P1 - ALTO | Timestamps inconsistentes | Crash em conversoes |
| P2 - MEDIO | Error handling inadequado | Dificulta debug |
| P3 - BAIXO | Promises nao tratadas | Erros silenciosos |
| P4 - BAIXO | Comparacoes == vs === | Bugs sutis |

---

## VARREDURA 1: Valores Undefined no Firestore (P0)

**Problema:** Firestore nao aceita valores undefined. Causa erro: "Cannot use 'undefined' as a Firestore value"

### Buscar padroes:

```typescript
// Arquivos que salvam no Firestore
.collection(...).add(...)
.collection(...).doc(...).set(...)
.collection(...).doc(...).update(...)
```

### Verificar campos que podem ser undefined:

- Campos opcionais de formularios
- Valores de query params
- Propriedades de objetos que podem nao existir

### Correcao - usar spread condicional:

```typescript
// ❌ ERRADO
const data = {
  nome: dados.nome,
  telefone: dados.telefone, // pode ser undefined!
};

// ✅ CORRETO - Spread condicional
const data = {
  nome: dados.nome,
  ...(dados.telefone && { telefone: dados.telefone }),
};

// ✅ CORRETO - Usar sanitizeForFirestore (RECOMENDADO)
import { sanitizeForFirestore } from '@/api/utils/firestore';

const data = sanitizeForFirestore({
  nome: dados.nome,
  telefone: dados.telefone,
});
```

### Utilitario disponivel:

O projeto possui `src/api/utils/firestore.ts` com funcoes prontas:

| Funcao | Uso |
|--------|-----|
| `sanitizeForFirestore()` | Remove undefined recursivamente |
| `prepareForFirestore()` | Sanitiza + adiciona timestamps |
| `preparePartialUpdate()` | Para updates parciais |
| `validateAndSanitize()` | Valida campos obrigatorios + sanitiza |

---

## VARREDURA 2: Promises Nao Tratadas (P3)

**Problema:** Promises sem .catch() em padroes fire-and-forget causam erros silenciosos.

### Buscar padroes:

```typescript
// Fire-and-forget sem catch
auditLog.log(...);
analytics.track(...);
notification.send(...);
```

### Correcao:

```typescript
// ✅ CORRETO - adicionar .catch()
auditLog.log(...).catch(err => logger.error('Falha no audit log', { err }));

// ✅ CORRETO - usar void para indicar intencao
void auditLog.log(...).catch(err => logger.error('Falha', { err }));
```

---

## VARREDURA 3: Null Safety em .data() (P0)

**Problema:** Chamar .data() sem verificar .exists pode retornar undefined.

### Buscar padroes:

```typescript
const doc = await db.collection('x').doc(id).get();
const data = doc.data(); // Pode ser undefined!
data.campo; // Crash se doc nao existe
```

### Correcao:

```typescript
// ✅ CORRETO
const doc = await db.collection('x').doc(id).get();
if (!doc.exists) {
  throw new NotFoundError('Documento nao encontrado');
}
const data = doc.data()!; // Seguro apos verificar .exists
```

---

## VARREDURA 4: Comparacoes == vs === (P4)

**Problema:** Usar == em vez de === causa comparacoes com coercao de tipo.

### Buscar:

```typescript
// Buscar por == (exceto != que vira !==)
value == null
value == undefined
value == ''
```

### Correcao:

```typescript
// ✅ CORRETO - usar sempre ===
value === null
value === undefined
value === ''

// Excecao aceita: value == null (checa null E undefined)
if (value == null) { /* OK */ }
```

---

## VARREDURA 5: Timestamps e Datas Inconsistentes (P1)

**Problema:** Conversoes de Timestamp - Date - ISO string sem tratamento de null causam crashes.

### Buscar padroes perigosos:

```typescript
timestamp.toDate()           // Crash se timestamp for null
new Date(valor)              // Crash se valor for invalido
date.toISOString()           // Crash se date for Invalid Date
```

### Solucao - Usar utilitarios do projeto:

```typescript
// Frontend + Backend (src/utils/formatDate.ts)
import { toDate, formatDate, isValidDate } from '@/utils/formatDate';

const date = toDate(timestamp); // Seguro
const formatted = formatDate(date); // Seguro

// Backend apenas (src/api/utils/dateConverter.ts)
import { toTimestampSafe, toISOStringSafe } from '@/api/utils/dateConverter';

const timestamp = toTimestampSafe(date); // Seguro
const iso = toISOStringSafe(timestamp); // Seguro
```

---

## VARREDURA 6: Error Handling Inadequado (P2)

**Problema:** Uso de console.error/warn/log em vez de logger estruturado, e catch blocks vazios.

### Buscar:

```typescript
// Console em codigo de producao
console.error(...)
console.warn(...)
console.log(...)

// Catch vazio
} catch (error) {
}

// Catch que apenas re-lanca
} catch (error) {
  throw error;
}
```

### Correcao:

```typescript
// ✅ CORRETO - usar logger estruturado
import { logger } from '@/api/utils/logger';

} catch (error) {
  logger.error('Descricao do erro', {
    context: 'NomeDoServico',
    method: 'nomeDoMetodo',
    error
  });
  throw error; // ou handle appropriately
}
```

---

## Diretrizes de Prevencao

### Regras TypeScript Strict (tsconfig.json)

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Regras ESLint Recomendadas

```javascript
// eslint.config.mjs
{
  rules: {
    "eqeqeq": ["error", "always", { null: "ignore" }],
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/strict-boolean-expressions": "warn",
    "no-return-await": "error"
  }
}
```

---

## Automacao

### Pre-commit Hook (husky + lint-staged)

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### Script de Varredura

```bash
# Adicionar ao package.json
"scripts": {
  "scan:undefined": "grep -rn 'undefined' src/api --include='*.ts' | grep -v node_modules",
  "scan:console": "grep -rn 'console\\.' src --include='*.ts' | grep -v node_modules",
  "scan:equality": "grep -rn ' == ' src --include='*.ts' | grep -v node_modules"
}
```

---

## Checklist de Code Review

### Antes de Aprovar PR

```markdown
□ FIRESTORE
  □ Nenhum valor undefined sendo salvo
  □ sanitizeForFirestore() usado em todos os .add()/.set()/.update()
  □ .exists verificado antes de .data()

□ PROMISES
  □ Todas as promises tem .catch() ou await em try/catch
  □ Fire-and-forget tem .catch() explicito

□ TIPOS
  □ Sem any desnecessario
  □ Null checks antes de acessar propriedades

□ DATAS
  □ Usando utilitarios de data (toDate, toTimestampSafe)
  □ Sem .toDate() direto em valores que podem ser null

□ ERROS
  □ Logger estruturado em vez de console.*
  □ Catch blocks tem tratamento adequado
  □ Erros tem contexto suficiente

□ GERAL
  □ === em vez de == (exceto == null)
  □ Sem codigo duplicado
  □ Testes passando
```

---

## Executando as Varreduras

### Ordem Recomendada

1. **CRITICO:** Varredura 1 (undefined) - causa crash imediato
2. **CRITICO:** Varredura 3 (null safety) - causa crash em runtime
3. **ALTO:** Varredura 5 (timestamps) - causa crash em conversoes
4. **MEDIO:** Varredura 6 (error handling) - dificulta debug
5. **BAIXO:** Varredura 2 (promises) - erros silenciosos
6. **BAIXO:** Varredura 4 (==) - bugs sutis

### Validacao Final

```bash
# Apos correcoes
npm run type-check   # Verificar tipos
npm run lint         # Verificar ESLint
npm test             # Executar testes
npm run build        # Verificar build
```

---

## Referencias

- [Documentacao Firestore](https://firebase.google.com/docs/firestore)
- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
- [ESLint TypeScript Rules](https://typescript-eslint.io/rules/)
