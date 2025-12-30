'use client';

import { useTranslations } from 'next-intl';
import { Shield, Lock, Key, Eye, FileCheck, Clock, AlertTriangle, UserCheck, Search, Bug, Database, Server, Globe, Zap, FileText, CheckCircle } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, Badge } from '@/components/ui';

/**
 * SecurityLayersAccordion
 *
 * Componente que exibe as 18 camadas de segurança em formato de acordeão
 * com explicações simples para usuários não-técnicos entenderem.
 *
 * Objetivo: Transparência total - mostrar o valor real de cada proteção
 * sem usar jargões técnicos que confundem.
 *
 * @version 1.0.0
 */

// Dados das camadas de segurança com explicações para leigos
const SECURITY_LAYERS = [
  {
    id: 'helmet',
    icon: Shield,
    technicalName: 'Helmet (Security Headers)',
    simpleTitle: 'Escudo do Navegador',
    simpleExplanation: 'Imagine que seu navegador (Chrome, Firefox, etc.) tem um guarda-costas invisível. Este escudo envia instruções ao navegador dizendo exatamente como proteger você. Ele impede que sites maliciosos tentem se passar pelo nosso sistema ou injetar códigos perigosos na página.',
    benefit: 'Protege você contra ataques que tentam enganar seu navegador',
    category: 'protection',
  },
  {
    id: 'cors',
    icon: Globe,
    technicalName: 'CORS Configurado',
    simpleTitle: 'Porteiro Digital',
    simpleExplanation: 'Funciona como um porteiro de condomínio: só deixa entrar quem está na lista. Isso significa que apenas os sistemas autorizados (como nosso site oficial) podem acessar seus dados. Sites falsos ou de terceiros não conseguem se conectar ao nosso sistema.',
    benefit: 'Impede que sites falsos acessem suas informações',
    category: 'access',
  },
  {
    id: 'csrf',
    icon: FileCheck,
    technicalName: 'CSRF Protection',
    simpleTitle: 'Verificador de Identidade',
    simpleExplanation: 'Cada ação que você faz (salvar, deletar, enviar) recebe um "código secreto" único. É como se cada formulário tivesse uma assinatura digital. Se alguém tentar fazer uma ação em seu nome sem esse código, o sistema bloqueia automaticamente.',
    benefit: 'Garante que ninguém pode fazer ações em seu nome',
    category: 'identity',
  },
  {
    id: 'jwt',
    icon: Key,
    technicalName: 'JWT Authentication',
    simpleTitle: 'Crachá Digital Inteligente',
    simpleExplanation: 'Quando você faz login, recebe um "crachá digital" com validade limitada. Este crachá contém suas informações criptografadas e é verificado a cada ação. Diferente de uma senha comum, ele expira sozinho e não pode ser falsificado.',
    benefit: 'Seu acesso é verificado constantemente, não apenas no login',
    category: 'identity',
  },
  {
    id: 'rbac',
    icon: UserCheck,
    technicalName: 'RBAC Permissions',
    simpleTitle: 'Sistema de Níveis de Acesso',
    simpleExplanation: 'Assim como em uma empresa onde cada cargo tem acessos diferentes, aqui cada tipo de usuário (visitante, membro, admin) só vê e faz o que seu nível permite. Um usuário comum não consegue acessar funções de administrador, mesmo que tente.',
    benefit: 'Cada pessoa só acessa o que foi autorizado para ela',
    category: 'access',
  },
  {
    id: 'ratelimit',
    icon: Clock,
    technicalName: 'Rate Limiting',
    simpleTitle: 'Controlador de Velocidade',
    simpleExplanation: 'Imagine uma cancela que só deixa passar um carro por vez. Se alguém tentar fazer milhares de tentativas de login por segundo (ataque automatizado), o sistema percebe e bloqueia. Isso impede que hackers usem "força bruta" para adivinhar senhas.',
    benefit: 'Bloqueia ataques automatizados e tentativas de invasão',
    category: 'protection',
  },
  {
    id: 'validation',
    icon: CheckCircle,
    technicalName: 'Zod Validation',
    simpleTitle: 'Inspetor de Dados',
    simpleExplanation: 'Antes de aceitar qualquer informação que você envia (nome, email, etc.), o sistema verifica se ela está no formato correto. É como um inspetor que confere se um pacote está bem embalado antes de aceitar. Dados mal formatados ou suspeitos são rejeitados.',
    benefit: 'Garante que só dados válidos e seguros entram no sistema',
    category: 'validation',
  },
  {
    id: 'audit',
    icon: FileText,
    technicalName: 'Audit Logging',
    simpleTitle: 'Livro de Registros',
    simpleExplanation: 'Todas as ações importantes são anotadas em um "diário" com data, hora e quem fez. Se algo der errado, podemos consultar esse histórico para entender o que aconteceu. É como câmeras de segurança, mas para ações digitais.',
    benefit: 'Histórico completo para investigar problemas ou abusos',
    category: 'monitoring',
  },
  {
    id: 'pii',
    icon: Eye,
    technicalName: 'PII Masking',
    simpleTitle: 'Máscara de Privacidade',
    simpleExplanation: 'Dados sensíveis como CPF, cartão de crédito ou telefone aparecem parcialmente ocultos (ex: ***.***.123-45) em relatórios e logs. Mesmo quem tem acesso administrativo não vê a informação completa sem necessidade.',
    benefit: 'Seus dados pessoais ficam protegidos até de quem administra o sistema',
    category: 'privacy',
  },
  {
    id: 'errorsan',
    icon: Bug,
    technicalName: 'Error Sanitization',
    simpleTitle: 'Filtro de Mensagens de Erro',
    simpleExplanation: 'Quando algo dá errado, o sistema mostra uma mensagem amigável para você, mas esconde os detalhes técnicos. Isso é importante porque hackers usam mensagens de erro para descobrir como o sistema funciona por dentro.',
    benefit: 'Erros não revelam informações que hackers poderiam explorar',
    category: 'protection',
  },
  {
    id: 'n1',
    icon: Database,
    technicalName: 'N+1 Prevention',
    simpleTitle: 'Otimizador de Consultas',
    simpleExplanation: 'Quando o sistema precisa buscar informações, ele faz isso de forma inteligente, pegando tudo de uma vez ao invés de fazer centenas de perguntas ao banco de dados. Isso deixa tudo mais rápido e evita sobrecarga que poderia derrubar o sistema.',
    benefit: 'Sistema mais rápido e resistente a travamentos',
    category: 'performance',
  },
  {
    id: 'massassign',
    icon: AlertTriangle,
    technicalName: 'Mass Assignment Protection',
    simpleTitle: 'Filtro de Campos',
    simpleExplanation: 'Quando você envia um formulário, o sistema só aceita os campos esperados. Se alguém tentar adicionar campos extras (como "tornarAdmin=true"), eles são ignorados. É como um caixa de supermercado que só aceita os itens do carrinho, não importa o que você diga.',
    benefit: 'Impede que usuários mal-intencionados manipulem o sistema',
    category: 'validation',
  },
  {
    id: 'ipallowlist',
    icon: Server,
    technicalName: 'IP Allowlist (Admin)',
    simpleTitle: 'Lista VIP de Administradores',
    simpleExplanation: 'O painel de administração só pode ser acessado de locais específicos (escritório da empresa, por exemplo). Mesmo que alguém descubra a senha de admin, não conseguirá entrar se estiver em outro lugar.',
    benefit: 'Área administrativa blindada contra acessos externos',
    category: 'access',
  },
  {
    id: 'circuitbreaker',
    icon: Zap,
    technicalName: 'Circuit Breaker',
    simpleTitle: 'Disjuntor Inteligente',
    simpleExplanation: 'Assim como o disjuntor da sua casa desliga a energia quando há sobrecarga, este sistema "desliga" temporariamente serviços que estão com problemas. Isso evita que um problema pequeno se espalhe e derrube todo o sistema.',
    benefit: 'Um problema isolado não afeta o resto do sistema',
    category: 'resilience',
  },
  {
    id: 'sri',
    icon: Lock,
    technicalName: 'SRI Policy',
    simpleTitle: 'Verificador de Arquivos',
    simpleExplanation: 'Cada arquivo usado pelo sistema (códigos, estilos) tem uma "impressão digital" única. Antes de usar, o navegador confere se a impressão digital bate. Se alguém alterar um arquivo, o sistema detecta e não usa.',
    benefit: 'Detecta se algum código foi alterado maliciosamente',
    category: 'integrity',
  },
  {
    id: 'securitytxt',
    icon: FileText,
    technicalName: 'security.txt',
    simpleTitle: 'Canal de Comunicação Segura',
    simpleExplanation: 'Um arquivo público que diz como pesquisadores de segurança podem nos avisar se encontrarem vulnerabilidades. É uma prática recomendada mundialmente que mostra que levamos segurança a sério e queremos melhorar continuamente.',
    benefit: 'Facilita que especialistas nos ajudem a manter tudo seguro',
    category: 'transparency',
  },
  {
    id: 'inputsan',
    icon: Search,
    technicalName: 'Input Sanitization',
    simpleTitle: 'Limpador de Entradas',
    simpleExplanation: 'Todo texto que você digita é "limpo" antes de ser processado. Caracteres especiais que poderiam ser usados para ataques são neutralizados. É como passar a bagagem no raio-X do aeroporto antes de embarcar.',
    benefit: 'Impede que códigos maliciosos sejam inseridos em formulários',
    category: 'validation',
  },
  {
    id: 'sqlinjection',
    icon: Database,
    technicalName: 'SQL Injection Prevention',
    simpleTitle: 'Proteção do Banco de Dados',
    simpleExplanation: 'Uma das técnicas de ataque mais antigas e perigosas é tentar "conversar diretamente" com o banco de dados através de formulários. Nossa proteção garante que comandos maliciosos nunca chegam ao banco de dados, mantendo suas informações seguras.',
    benefit: 'Seus dados armazenados ficam completamente protegidos',
    category: 'protection',
  },
];

// Categorias com cores e labels
const CATEGORIES = {
  protection: { label: 'Proteção', color: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  access: { label: 'Controle de Acesso', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  identity: { label: 'Identidade', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  validation: { label: 'Validação', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  monitoring: { label: 'Monitoramento', color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
  privacy: { label: 'Privacidade', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
  performance: { label: 'Performance', color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
  resilience: { label: 'Resiliência', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  integrity: { label: 'Integridade', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
  transparency: { label: 'Transparência', color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
};

export function SecurityLayersAccordion() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      {/* Intro explicativo */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
        <h3 className="font-semibold text-lg mb-2">
          Por que 18 camadas?
        </h3>
        <p className="text-muted-foreground">
          Segurança não é uma única barreira, mas sim múltiplas proteções trabalhando juntas.
          Se uma falhar, as outras continuam protegendo você. Clique em cada camada para
          entender o que ela faz e por que é importante.
        </p>
      </div>

      {/* Legenda de categorias */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(CATEGORIES).map(([key, { label, color }]) => (
          <span key={key} className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
            {label}
          </span>
        ))}
      </div>

      {/* Acordeao das camadas */}
      <Accordion type="multiple" defaultOpen={['helmet']} className="space-y-3">
        {SECURITY_LAYERS.map((layer, index) => {
          const Icon = layer.icon;
          const category = CATEGORIES[layer.category as keyof typeof CATEGORIES];

          return (
            <AccordionItem key={layer.id} id={layer.id}>
              <AccordionTrigger
                icon={
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center">
                      {index + 1}
                    </span>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                }
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span>{layer.simpleTitle}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full hidden sm:inline ${category.color}`}>
                    {category.label}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pl-11">
                  {/* Nome tecnico (para quem quiser pesquisar) */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono bg-muted px-2 py-1 rounded">
                      {layer.technicalName}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full sm:hidden ${category.color}`}>
                      {category.label}
                    </span>
                  </div>

                  {/* Explicacao simples */}
                  <p className="text-sm leading-relaxed">
                    {layer.simpleExplanation}
                  </p>

                  {/* Beneficio destacado */}
                  <div className="flex items-start gap-2 bg-green-500/10 text-green-700 dark:text-green-400 p-3 rounded-lg">
                    <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{layer.benefit}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Resumo final */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Shield className="h-6 w-6 text-primary" />
          <h3 className="font-semibold text-lg">Proteção Completa</h3>
        </div>
        <p className="text-muted-foreground text-sm">
          Todas essas camadas trabalham juntas automaticamente, sem que você precise
          fazer nada. Nossa prioridade é que você use a plataforma com tranquilidade,
          sabendo que seus dados estão protegidos por tecnologia de nível bancário.
        </p>
      </div>
    </div>
  );
}

export default SecurityLayersAccordion;
