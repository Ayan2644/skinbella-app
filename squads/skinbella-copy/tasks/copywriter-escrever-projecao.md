# copywriter-escrever-projecao

```yaml
task:
  id: copywriter-escrever-projecao
  description: "Escrever copy do ProjectionCard — linha do tempo de resultados por perfil"
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
    path: docs/conteudo/copy-resultado/projecao-por-perfil.md
    format: markdown
```

## Objetivo

Escrever o copy do ProjectionCard — a linha do tempo de resultados esperados com o protocolo, organizados em marcos D7/D20/D60 por perfil.

## Steps

### Step 1: Carregar Dados de Prazo

- Ler `refs-substancias-caps.md` e `refs-substancias-serum.md` — prazos por ativo
- Ler `refs-matriz-perfil.md` — prioridade de resultado por perfil

### Step 2: Definir Marco por Perfil

Para cada perfil, mapear o que é esperável em:
- **D7:** Resultado interno/invisível (sensação, hidratação base)
- **D20:** Primeiro resultado visível (leve melhora percebível)
- **D60:** Resultado consolidado (transformação documentável)

### Step 3: Escrever Linha do Tempo

```
## Perfil: {nome}

### Título do Card
"{frase âncora de expectativa}"

### D7 — Semana 1
{O que começa a mudar internamente}
Mecanismo: {explicação científica breve}

### D20 — 3 Semanas
{Primeiro resultado visível}
Mecanismo: {explicação}

### D60 — 2 Meses
{Resultado consolidado}
Mecanismo: {explicação}

### Frase Âncora
"{frase de compromisso com a jornada}"

### Nota Científica
{fundamento do prazo — honesto sobre variabilidade}
```

### Step 4: Validar Honestidade

- Nenhum prazo subestimado (D7 é real, não força resultado)
- D7 pode ser "invisível mas real" (mudança interna)
- Sem "em 7 dias você vai notar" se não é defensável

### Step 5: Salvar

- 8 seções por perfil
- Notas científicas por marco
- Salvar em `docs/conteudo/copy-resultado/projecao-por-perfil.md`

## Regras

- Prazos conservadores — melhor surpreender do que decepcionar
- D7 pode ser experiencial (textura, absorção) mesmo sem visível
- Nunca prometer prazo absoluto sem hedge
- Output: documento .md APENAS — nunca código
