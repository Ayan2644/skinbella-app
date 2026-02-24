# ux-writer-reescrever-perguntas

```yaml
task:
  id: ux-writer-reescrever-perguntas
  description: "Reescrever perguntas do quiz com tom SKINBELLA e jornada emocional crescente"
  agent: ux-writer
  squad: skinbella-quiz
  elicit: false
  inputs:
    required:
      - data/refs-perguntas-v2.md
      - data/refs-tom-de-voz.md
      - data/refs-persona.md
    optional:
      - data/refs-analise-originais.md
  output:
    path: docs/conteudo/quiz/perguntas-v2.md
    format: markdown
```

## Objetivo

Reescrever as perguntas do quiz seguindo a jornada emocional SKINBELLA: curiosidade → identificação → awareness → compromisso → especificidade.

## Steps

### Step 1: Carregar Contexto

- Ler `refs-perguntas-v2.md` — perguntas existentes
- Ler `refs-tom-de-voz.md` — estilo de linguagem
- Ler `refs-persona.md` — entender a Marina (como ela pensa e fala)

### Step 2: Mapear Jornada Emocional

Identificar em que fase emocional cada pergunta deve estar:
- **P1-P3:** Curiosidade (fácil, leve, sem compromisso)
- **P4-P8:** Identificação (reconhece o problema)
- **P9-P11:** Awareness (entende as causas)
- **P12-P13:** Compromisso (investe no diagnóstico)
- **P13b-P14:** Especificidade (detalha para diagnóstico preciso)

### Step 3: Estrutura por Pergunta

Para cada pergunta reescrita:
```
## P{N} — {título}

**Jornada:** {fase emocional}
**Atrito target:** {1-3}
**Valor diagnóstico:** {1-5}

### v1 (original)
{texto original}

### v2 (reescrita)
**Título:** {pergunta}
**Subtítulo:** {contexto do porquê dessa pergunta}
**Opções:**
- {opção 1}
- {opção 2}
- {opção 3}
- {opção 4}

**Nota de UX:**
{intenção emocional da reformulação}
```

### Step 4: Validar Jornada

Checar se as perguntas formam arco emocional:
- Primeiras perguntas: fáceis, não assustam
- Meio: envolvem sem abrumar
- Fim: específicas mas já têm confiança conquistada

### Step 5: Regras de Escrita

- Título: pergunta real, não label técnico
- Subtítulo: contexto de por que a pergunta existe (ganha confiança)
- Opções: sem julgamento de valor (nunca "sua pele é ruim")
- Máximo 4 opções por pergunta (exceto P13 chips — máximo 8)

### Step 6: Salvar

- Documento com todas as perguntas v2
- Nota de jornada por pergunta
- Salvar em `docs/conteudo/quiz/perguntas-v2.md`

## Regras

- P1 (idade) é IMUTÁVEL — não mover, não reescrever a posição
- Opções de resposta sem julgamento ou escala de vergonha
- Subtítulo obrigatório para perguntas de atrito >= 3
- Output: documento .md APENAS — nunca código
