# copywriter-escrever-nutrientes

```yaml
task:
  id: copywriter-escrever-nutrientes
  description: "Escrever copy dos NutrientCards — apresentação dos ativos do protocolo por perfil"
  agent: copywriter
  squad: skinbella-copy
  elicit: false
  inputs:
    required:
      - data/refs-substancias-caps.md
      - data/refs-substancias-serum.md
      - data/refs-matriz-perfil.md
      - data/refs-tom-de-voz.md
    optional:
      - data/refs-persona.md
  output:
    path: docs/conteudo/copy-resultado/nutrientes-copy.md
    format: markdown
```

## Objetivo

Escrever o copy para cada ativo do Caps e Serum, com a personalização "por que para você" adaptada ao perfil detectado pelo quiz.

## Steps

### Step 1: Listar Ativos

- Ler `refs-substancias-caps.md` — 8 ativos do suplemento
- Ler `refs-substancias-serum.md` — 8 ativos do sérum
- Identificar quais ativos são "prioritários" por perfil

### Step 2: Estrutura por Ativo

Para cada ativo:
```
## {Nome do Ativo} — {Produto: Caps | Serum}

### Título do Card
"{nome comercial ou nome amigável}"

### Por que para você
| Perfil | Benefício específico |
|--------|---------------------|
| Manchas | ... |
| Acne Hormonal | ... |
| ... | ... |

### O que você vai sentir
{descrição experiencial — textura, resultado percebido}

### Prazo
{quando esperar resultado com este ativo}

### Mecanismo (para a nota científica)
{explicação técnica — usada no hover/tooltip}
```

### Step 3: Escrever por Produto

**Caps (suplemento oral):** 8 ativos
**Serum (tópico):** 8 ativos

Total: 16 cards de nutriente

### Step 4: Adaptar Linguagem

- "Por que para você" é personalizado — não genérico
- Linguagem experiencial: "você vai sentir", "você vai notar"
- Mecanismo em linguagem acessível (não científica demais)

### Step 5: Salvar

- Seção Caps (8 ativos)
- Seção Serum (8 ativos)
- Tabela-resumo: perfil × ativos prioritários
- Salvar em `docs/conteudo/copy-resultado/nutrientes-copy.md`

## Regras

- "Por que para você" é SEMPRE específico ao perfil
- Nunca listar todos os 16 ativos para todos os perfis — priorizar 3-4
- Tom: entusiasta mas honesto
- Output: documento .md APENAS — nunca código
