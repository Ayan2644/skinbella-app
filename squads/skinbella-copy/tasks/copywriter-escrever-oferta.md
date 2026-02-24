# copywriter-escrever-oferta

```yaml
task:
  id: copywriter-escrever-oferta
  description: "Escrever copy do OfferCard — apresentação da oferta com preço e itens incluídos"
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
    path: docs/conteudo/resultado/oferta-copy.md
    format: markdown
```

## Objetivo

Escrever o copy completo do OfferCard — a seção de apresentação da oferta com preço, itens incluídos, personalização por perfil e urgência ética.

## Steps

### Step 1: Verificar Preço

⚠️ **ATENÇÃO:** Verificar a decisão de preço antes de prosseguir.
- ESSENCIAL.md indica R$19/mês
- OfferCard.tsx mostra R$29/mês
- Esta inconsistência DEVE ser resolvida antes de finalizar o copy
- Usar o preço confirmado pela decisão de negócio

### Step 2: Estrutura do OfferCard

```
### Título Personalizado
"{perfil-specific title}"

### Itens Incluídos
| Item | Por que para você |
|------|------------------|
| Caps (suplemento) | {ativos prioritários do perfil} |
| Serum (tópico) | {ativos prioritários do perfil} |

### Preço
{preço/período} — {reframing de valor}

### Urgência (se real)
{gatilho de urgência — apenas se fundamentado}

### Trust Badges
{3 selos de confiança}
```

### Step 3: Escrever por Perfil

Para cada perfil, personalizar:
1. Título do OfferCard
2. "Por que para você" de cada produto
3. Itens do Caps + Serum mais relevantes
4. Frase de valor que ressoa com a dor do perfil

### Step 4: LockedReportCard

Itens do relatório bloqueado (geram urgência e curiosidade):
- 5 itens do relatório completo que a usuária vai receber
- Copy de cada item no estilo "você vai descobrir..."

### Step 5: Urgência Ética

Se há urgência real:
- "Diagnóstico expira em {X}h" (apenas se implementado)
- "Preço de lançamento" (apenas se real)
- NUNCA "últimas vagas" se não há limite real

### Step 6: Formatar e Salvar

- Título do OfferCard por perfil (8 variações)
- Tabela de itens por perfil
- Copy de preço e reframing de valor
- LockedReportCard copy
- Trust badges copy
- Salvar em `docs/conteudo/resultado/oferta-copy.md`

## Regras

- Preço deve ser confirmado antes de publicar
- Urgência apenas se real e documentada
- Não comparar com produto específico da concorrência
- Output: documento .md APENAS — nunca código
