# copywriter-escrever-hero

```yaml
task:
  id: copywriter-escrever-hero
  description: "Escrever copy do HeroResult personalizado por perfil de pele"
  agent: copywriter
  squad: skinbella-copy
  elicit: false
  inputs:
    required:
      - data/refs-persona.md
      - data/refs-matriz-perfil.md
      - data/refs-tom-de-voz.md
    optional:
      - data/refs-hero-existente.md
  output:
    path: docs/conteudo/copy-resultado/hero-por-perfil.md
    format: markdown
```

## Objetivo

Escrever o copy da seção HeroResult da tela de resultado para cada um dos 8 perfis do skinEngine — a primeira impressão após o quiz, responsável por criar o "momento diagnóstico".

## Steps

### Step 1: Carregar Contexto

- Ler `refs-persona.md` — entender a Marina (dores, linguagem, contexto)
- Ler `refs-matriz-perfil.md` — obter os 8 perfis com características
- Ler `refs-tom-de-voz.md` — internalizar o tom SKINBELLA
- Ler `refs-hero-existente.md` (se disponível) — não reescrever o que já funciona

### Step 2: Definir Estrutura do HeroResult

Para cada perfil, o HeroResult tem:
1. **Badge** — label do perfil (ex: "Pele com Tendência à Acne Hormonal")
2. **Headline** — frase de identificação emocional (máx 12 palavras)
3. **Score line** — "Seu diagnóstico: {X}/10 pontos de {problema}"
4. **Lead copy** — 2-3 frases de diagnóstico validador (não assustador)
5. **CTA anchor** — transição para a próxima seção

### Step 3: Escrever por Perfil

Para cada perfil (Manchas, Acne Hormonal, Oleosa, Envelhecimento, Seca, Sensível, Preventivo, Estresse):

```
## Perfil: {nome}

### Badge
{label}

### Headline
{frase}

### Score Line
{texto}

### Lead Copy
{parágrafo}

### CTA Anchor
{frase de transição}
```

### Step 4: Validar Tom

Para cada versão:
- Não assustador — validador e esperançoso
- Usa linguagem da Marina (não científico demais)
- Personalização real — não genérica
- Máximo 80 palavras no lead copy

### Step 5: Formatar e Salvar

- Documento com 8 seções de perfil
- Notas de copy ao final de cada seção (intenção emocional)
- Salvar em `docs/conteudo/copy-resultado/hero-por-perfil.md`

## Regras

- Nunca usar "sua pele está horrível" ou linguagem de vergonha
- Diagnóstico valida, não assusta
- Tom: amiga expert, não médico
- Output: documento .md APENAS — nunca código
