# EPIC-1: Quiz Inteligente & Motor de Personalização Real

**Status:** 📋 Planning
**Owner:** Morgan (PM) — @pm
**Created:** 2026-02-23
**Prioridade:** Alta — Bloqueia diferenciação competitiva do produto

---

## Objetivo

Transformar o Skinbella App no **melhor quiz de skincare do nicho** — com perguntas estratégicas que capturam dados profundos sobre a pele da usuária e um motor de personalização que gera resultados verdadeiramente únicos para cada pessoa, conectado ao material de referência real dos produtos SKINBELLA.

**Problema atual:**
- O `skinEngine.ts` gera rotina, nutrientes e dieta **100% hardcoded** — toda usuária recebe o mesmo resultado
- Das 14 perguntas do quiz, apenas ~3 influenciam o resultado de forma significativa
- O material de referência (substâncias dos produtos, briefings, persona) existe mas **não está conectado** ao resultado
- A personalização se limita a `prioridadesTop3`, que muda pouco entre perfis

**Estado desejado após o epic:**
- Cada usuária recebe um resultado genuinamente único baseado em seu perfil completo
- As substâncias do SKINBELLA Caps e Sérum são recomendadas com base no problema específico da pele
- O quiz captura dados que realmente importam para o diagnóstico (incluindo branching condicional)
- O texto do resultado é dinâmico e personalizado ("Sua pele tem X por causa de Y")

---

## Business Value

- **Conversão:** Resultado personalizado gera mais crença → maior conversão para o Protocolo
- **Retenção:** Usuária se sente vista e compreendida → menor churn
- **Diferenciação:** Quiz inteligente com branching = barreira competitiva
- **Upsell:** Recomendação de produto conectada ao problema específico → mais compras de Caps + Sérum
- **Ticket:** Usuária que entende "por que" precisa do produto paga mais

---

## Contexto do Sistema Existente

| Camada | Arquivo | Estado Atual |
|--------|---------|-------------|
| Perguntas do quiz | `src/lib/quizData.ts` | 14 perguntas, sem branching |
| Motor de resultado | `src/lib/skinEngine.ts` | Algoritmo simplificado, resultado hardcoded |
| Armazenamento | `src/lib/quizStorage.ts` | localStorage, sem persistência server-side |
| Tela de resultado | `src/components/quiz/ResultScreen.tsx` + `result/` | Componentes estáticos |
| Referências de produtos | `docs/referencias/produtos/` | Arquivos existem mas estão vazios |

**Stack:** React 18 + TypeScript + Vite + shadcn/ui + Tailwind CSS

---

## Scope

### In Scope
- Redesenho das perguntas do quiz com lógica de branching condicional
- Refatoração completa do `skinEngine.ts` com personalização real
- Mapeamento das substâncias SKINBELLA aos problemas identificados pelo quiz
- Personalização dos textos do resultado (dinâmicos, não hardcoded)
- Personalização da rotina manhã/noite por tipo de pele + problemas
- Personalização das recomendações de nutrientes baseada nos produtos reais
- Testes unitários para o motor de personalização

### Out of Scope
- Análise de foto com ML (v2.0)
- Backend/Supabase para persistência server-side
- Integração com pagamentos (Kiwify)
- Novos componentes visuais além dos ajustes de texto

---

## Stories

| ID | Título | Pontos | Prioridade | Status | Executor | Quality Gate |
|----|--------|--------|------------|--------|----------|--------------|
| [1.1](./1.1.story.md) | Quiz Estratégico com Branching Condicional | 5 | Alta | Draft | @dev | @architect |
| [1.2](./1.2.story.md) | skinEngine v2 — Motor de Personalização Real | 8 | Alta | Draft | @dev | @architect |
| [1.3](./1.3.story.md) | ResultScreen Hiper-Personalizada | 5 | Alta | Draft | @dev | @architect |

**Total Points:** 18

---

## Success Criteria

- [ ] Quiz captura pelo menos 3 dimensões adicionais de dados estratégicos além do atual
- [ ] Branching condicional ativo em pelo menos 2 perguntas (ex: "acne" → pergunta adicional)
- [ ] skinEngine gera rotinas diferentes para pelo menos 6 perfis distintos
- [ ] Nutrientes recomendados variam baseado no problema predominante (não são fixos)
- [ ] Textos do resultado mudam de forma significativa entre perfis diferentes
- [ ] Substâncias do SKINBELLA Caps e Sérum são citadas no resultado com justificativa clínica
- [ ] 100% dos testes unitários do skinEngine passam
- [ ] `npm run lint` e `npm run typecheck` passam sem erros

---

## Technical Requirements

- Manter compatibilidade com `QuizQuestion` interface existente (ou estender sem quebrar)
- `skinEngine.ts` refatorado deve ser tree-shakeable (funções puras exportadas separadamente)
- Branching não pode quebrar o `QuizProgress` component (progresso visual)
- Todos os textos dinâmicos devem ser type-safe (sem `any` nos perfis de resultado)
- A `SkinProfile` interface deve ser estendida (não substituída) para backwards compat

---

## Risks

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Branching quebra o progresso do quiz | Alto | Calcular total de steps dinamicamente, testar todos os fluxos |
| Textos dinâmicos muito genéricos (não parecem personalizados) | Alto | Criar biblioteca de frases por perfil, revisão de copy antes de merge |
| skinEngine v2 gera inconsistências nos scores | Médio | Testes unitários com fixtures de perfis conhecidos |
| Material de referência (docs) ainda vazio | Médio | Story 1.2 cria os dados inline no código; docs são preenchidos em paralelo |

---

## Dependencies

**Depende de:**
- Nenhuma dependência bloqueante — pode iniciar imediatamente

**Bloqueia:**
- Epic de Supabase/Backend (precisará salvar o perfil enriquecido no banco)
- Epic de Kiwify (resultado personalizado → oferta personalizada)

---

## Handoff para @sm

> **Para o Story Manager (River):** Por favor, crie as stories detalhadas para este epic.
>
> **Contexto do sistema:**
> - Stack: React 18 + TypeScript + Vite + shadcn/ui + Tailwind
> - Arquivos principais: `src/lib/quizData.ts`, `src/lib/skinEngine.ts`, `src/components/quiz/`
> - Referências de produto: `docs/referencias/produtos/` (briefings, substâncias)
> - Quiz atual: 14 perguntas, sem branching, resultado hardcoded
>
> **Padrões a seguir:**
> - Funções puras e testáveis no skinEngine
> - Type-safe com TypeScript estrito (sem `any`)
> - Componentes seguem padrão shadcn/ui existente
>
> **Ordem de implementação:** Story 1.1 → 1.2 → 1.3 (dependência sequencial)
>
> **Critério crítico:** A Story 1.2 é o coração do epic. As substâncias do SKINBELLA Caps (`docs/referencias/produtos/substancias-caps.md`) e Sérum devem embasar as recomendações de nutrientes.

---

## Progress

_Progress tracking to be updated._

```
[░░░░░░░░░░] 0%
```

---

## Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-02-23 | 1.0 | Epic criado | Morgan (@pm) — AIOS |

---

**— Morgan, planejando o futuro 📊**
