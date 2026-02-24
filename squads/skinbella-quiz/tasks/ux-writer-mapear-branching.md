# ux-writer-mapear-branching

```yaml
task:
  id: ux-writer-mapear-branching
  description: "Definir lógica de branching condicional do quiz — quais respostas disparam quais perguntas"
  agent: ux-writer
  squad: skinbella-quiz
  elicit: false
  inputs:
    required:
      - data/refs-perguntas-v2.md
      - data/refs-matriz-perfil.md
    optional:
      - data/refs-branching-logic.md
  output:
    path: docs/conteudo/quiz/branching-logic.md
    format: markdown
```

## Objetivo

Documentar e validar a lógica de branching condicional do quiz — definindo exatamente quais respostas disparam quais perguntas adicionais, garantindo que cada branch tem valor diagnóstico real.

## Steps

### Step 1: Carregar Mapa de Perguntas

- Ler `refs-perguntas-v2.md` — estrutura completa do quiz
- Ler `refs-matriz-perfil.md` — entender quais dados cada perfil precisa
- Ler `refs-branching-logic.md` (se existir) — checar branches já documentados

### Step 2: Identificar Triggers de Branch

Para cada pergunta, verificar se uma resposta específica deve disparar pergunta adicional:
- A resposta gera dado diagnóstico diferente de outra resposta?
- A pergunta adicional tem valor para o skinEngine?
- O atrito da pergunta adicional é justificado pelo valor?

### Step 3: Documentar Branches

Para cada branch, formato YAML + descrição:
```
## Branch {N}: {nome}

**Trigger:**
  pergunta: P{N}
  condicao: {resposta ou conjunto de respostas}

**Pergunta Adicional:** P{Nb}
  Título: {pergunta}
  Subtítulo: {contexto}
  Opções: [...]

**Inserir após:** P{N}

**Valor Diagnóstico:**
{por que esse dado é essencial para diferenciar perfis}

**Justificativa de Atrito:**
{por que vale pedir esse dado extra}

**Fluxo:**
P1 → P2 → ... → P{N} → [SE trigger] → P{Nb} → P{N+1} → ...
```

### Step 4: Validar Cada Branch

Para cada branch, responder:
1. ✅ O dado coletado diferencia perfis de forma mensurável?
2. ✅ A pergunta adicional tem < 3 de atrito?
3. ✅ O branch NÃO viola a regra de P14 (sempre opcional)?
4. ✅ O fluxo sem o branch ainda gera diagnóstico válido?

### Step 5: Mapear Contagem de Perguntas

Documentar por caminho:
- Mínimo de perguntas (sem nenhum branch)
- Máximo de perguntas (todos os branches)
- Caminho mais comum (perfis frequentes)

### Step 6: Salvar

- Documento com todos os branches definidos
- Fluxograma textual de cada caminho
- Contagem por caminho
- Salvar em `docs/conteudo/quiz/branching-logic.md`

## Regras

- Branch APENAS se valor diagnóstico real e documentado
- Nunca criar branch por curiosidade ou "seria legal"
- Máximo 3 perguntas adicionais no total (não por branch)
- Output: documento .md APENAS — nunca código
