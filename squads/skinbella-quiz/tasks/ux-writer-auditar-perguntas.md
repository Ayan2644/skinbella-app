# ux-writer-auditar-perguntas

```yaml
task:
  id: ux-writer-auditar-perguntas
  description: "Auditar todas as perguntas do quiz por atrito e valor diagnóstico"
  agent: ux-writer
  squad: skinbella-quiz
  elicit: false
  inputs:
    required:
      - data/refs-perguntas-v2.md
    optional:
      - data/refs-analise-originais.md
  output:
    path: docs/conteudo/quiz/auditoria-atrito.md
    format: markdown
```

## Objetivo

Auditar cada pergunta do quiz com dois eixos: **atrito** (quanto esforço pede da usuária) e **valor diagnóstico** (quanto dado útil gera para o skinEngine).

## Steps

### Step 1: Carregar Perguntas

- Ler `refs-perguntas-v2.md` — lista de todas as perguntas do quiz
- Ler `refs-analise-originais.md` (se disponível) — análise das perguntas originais

### Step 2: Definir Escala de Auditoria

Para cada pergunta, pontuar de 1-5:

**Atrito:**
- 1 = mínimo (resposta imediata, óbvia)
- 3 = médio (precisa pensar)
- 5 = alto (constrangedor, íntimo, exige esforço)

**Valor Diagnóstico:**
- 1 = baixo (dado redundante ou desnecessário)
- 3 = médio (complementa o perfil)
- 5 = alto (essencial para o skinEngine)

### Step 3: Auditar por Pergunta

```
## P{N} — {título da pergunta}

**Atrito:** {1-5}
**Valor Diagnóstico:** {1-5}
**Ratio:** {valor/atrito}
**Status:** [MANTER | REESCREVER | REMOVER | BRANCH]

### Análise
{por que este atrito/valor}

### Recomendação
{o que mudar e por quê}
```

### Step 4: Identificar Pontos Críticos

Classificar perguntas por prioridade de ação:
- **REMOVER:** Ratio < 0.5 (muito atrito, pouco valor)
- **REESCREVER:** Atrito >= 4 mas valor >= 4 (vale o esforço mas precisa facilitar)
- **BRANCH:** Valor alto mas só para subset de perfis
- **MANTER:** Ratio >= 1.0, funcionando bem

### Step 5: Gerar Relatório

```
# Auditoria de Atrito — Quiz SKINBELLA

## Resumo Executivo
- Total de perguntas: N
- MANTER: N
- REESCREVER: N
- REMOVER: N
- BRANCH: N

## Pontos de Abandono Previstos
{perguntas com atrito alto — risco de drop-off}

## Perguntas por Prioridade
### 🔴 REMOVER (ratio < 0.5)
### 🟡 REESCREVER (atrito >= 4)
### 🟢 MANTER (ratio >= 1.0)
### 🔵 BRANCH (valor alto, subset)
```

## Regras

- P1 (idade) é IMUTÁVEL — não auditar para remoção
- P14 (selfie) é SEMPRE opcional — nunca aumentar atrito
- Atrito > 3 requer justificativa de valor diagnóstico
- Output: documento .md APENAS — nunca código
