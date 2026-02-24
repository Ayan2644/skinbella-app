# copywriter-escrever-significado

```yaml
task:
  id: copywriter-escrever-significado
  description: "Escrever copy do MeaningCard — seção que explica o significado do diagnóstico"
  agent: copywriter
  squad: skinbella-copy
  elicit: false
  inputs:
    required:
      - data/refs-persona.md
      - data/refs-matriz-perfil.md
      - data/refs-tom-de-voz.md
    optional: []
  output:
    path: docs/conteudo/copy-resultado/significado-por-perfil.md
    format: markdown
```

## Objetivo

Escrever o copy da seção MeaningCard para cada perfil — explicar o que o diagnóstico significa, a causa raiz do problema e por que é reversível com o protocolo certo.

## Steps

### Step 1: Carregar Contexto

- Ler `refs-persona.md` e `refs-tom-de-voz.md`
- Ler `refs-matriz-perfil.md` — causas funcionais por perfil

### Step 2: Estrutura do MeaningCard

Cada MeaningCard tem 4 elementos:
1. **Título da seção** — "O que isso significa para você"
2. **Bullet 1 (Dado)** — score ou indicador quantitativo
3. **Bullet 2 (Causa)** — por que está acontecendo
4. **Bullet 3 (Reversibilidade)** — o que muda com o protocolo
5. **Frase de validação** — fechamento empático

### Step 3: Escrever por Perfil

```
## Perfil: {nome}

### Título
{título da seção}

### Bullet 1 — Dado
{informação quantitativa ou diagnóstica}

### Bullet 2 — Causa
{explicação da causa raiz}

### Bullet 3 — Reversibilidade
{o que o protocolo faz para mudar isso}

### Frase de Validação
{fechamento empático}

### Nota de copy
Intenção: {validar | explicar | esperançar}
```

### Step 4: Checar Regra da Estrutura

- Bullet 1 = dado (nunca pular para solução)
- Bullet 2 = causa (não solução)
- Bullet 3 = reversibilidade (hopeful, não promessa absoluta)
- Nenhum bullet > 25 palavras

### Step 5: Salvar

- 8 seções de perfil
- Notas de intenção por bullet
- Salvar em `docs/conteudo/copy-resultado/significado-por-perfil.md`

## Regras

- Não pular para a solução antes de validar o problema
- Reversibilidade é esperança, não promessa
- Tom: empática, não técnica
- Output: documento .md APENAS — nunca código
