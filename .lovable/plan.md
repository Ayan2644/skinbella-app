
Objetivo
- Corrigir imediatamente o crash global `checklist.filter is not a function` sem quebrar o design atual nem as melhorias recentes do editor.
- Garantir que usuários com dados antigos/corrompidos no navegador não voltem a quebrar o app.

Diagnóstico (confirmado)
- Do I know what the issue is? Sim.
- O erro nasce em `src/pages/app/Today.tsx` (linha com `checklist.filter(...)`), porque `storage.getChecklist()` pode retornar algo que não é array.
- Em `src/lib/storage.ts`, `getChecklist()` faz parse do localStorage e retorna o valor salvo sem validação estrutural. Se vier objeto/string (legado/corrompido), `.filter()` quebra.
- O motivo de “quebrar todas as abas” é o `ErrorBoundary` em `AppShell`: quando uma rota dispara erro, ele fica em estado de erro e mantém fallback para toda navegação interna.

Fluxo do bug hoje
```text
localStorage.skinbella.checklist (valor inválido)
  -> storage.getChecklist() retorna inválido
  -> Today.tsx chama checklist.filter(...)
  -> exception
  -> ErrorBoundary entra em hasError=true
  -> todas as abas aparentam quebradas até reset/reload
```

Plano de implementação

1) Blindagem definitiva do storage (fonte raiz)
- Arquivo: `src/lib/storage.ts`
- Criar normalizador de checklist:
  - Aceitar apenas array válido de itens `{ id, label, done }`.
  - Tentar migrar formatos legados comuns (ex.: objeto com `items` array).
  - Se inválido/irrecuperável: cair para checklist padrão premium atual.
- Fazer `getChecklist()`:
  - Sempre retornar array válido.
  - Auto-corrigir localStorage imediatamente com o valor normalizado (self-healing).
- Fazer `saveChecklist()`:
  - Sanitizar antes de salvar para impedir persistência de formato inválido.

2) Guardas nos consumidores (defesa em profundidade)
- Arquivos:
  - `src/pages/app/Today.tsx`
  - `src/pages/app/Checklist.tsx`
- Ajustes:
  - Tipar leitura inicial como array garantido.
  - Evitar qualquer chamada de `.filter/.map/.every` em valor não-array.
  - Em `Checklist.tsx`, inicialização do estado com função lazy tipada para evitar inconsistência inicial.

3) Evitar “efeito dominó” entre abas
- Arquivo: `src/pages/AppShell.tsx`
- Ajuste:
  - Isolar erro por rota (remontar boundary ao trocar pathname), para que um erro pontual numa página não “contamine” todas as outras abas.

4) Auditoria rápida de pontos parecidos
- Revisar acessos de dados de localStorage com `.map/.filter` em páginas de app.
- Aplicar mesmo padrão de validação onde houver risco semelhante (sem refatoração desnecessária, só hardening seguro).

5) Testes e validação completa (incluindo cenário real do seu caso)
- Testes manuais obrigatórios:
  1. Forçar localStorage inválido em `skinbella.checklist` (objeto/string) e abrir `/app`.
  2. Confirmar que não há crash e que checklist é recuperado automaticamente.
  3. Navegar por Hoje, Relatório, Dieta, Checklist, Admin (sem fallback de erro global).
  4. Marcar/desmarcar itens e confirmar persistência correta.
- Testes de regressão:
  - Garantir que o visual premium atual permanece igual.
  - Confirmar que nada do editor de página foi impactado por essa correção.

Detalhes técnicos (implementação)
- Introduzir utilitário interno de validação de shape em `storage.ts` (type guard + normalizer).
- Estratégia de migração:
  - Preferir preservar progresso quando possível (ex.: formato com `items` aproveitável).
  - Só resetar para default quando realmente impossível recuperar.
- Estratégia de robustez:
  - “Normalize on read” + “sanitize on write”.
  - Isso resolve estado quebrado existente e previne recorrência.
- Estratégia de UX:
  - Boundary por rota reduz impacto de futuros erros isolados.

Riscos e mitigação
- Risco: perder progresso de checklist em casos totalmente inválidos.
  - Mitigação: migrar tudo que for recuperável antes de fallback.
- Risco: alteração no boundary afetar comportamento de retry.
  - Mitigação: validar fluxo de navegação e botão “Tentar novamente” após ajuste.
- Risco: regressão visual.
  - Mitigação: zero mudança de layout/estilo; apenas lógica de dados e estabilidade.

Resultado esperado após aplicar
- App volta a abrir normalmente.
- Erro `checklist.filter is not a function` deixa de acontecer mesmo com dados antigos.
- Troca de abas não fica mais travada por um único erro de rota.
