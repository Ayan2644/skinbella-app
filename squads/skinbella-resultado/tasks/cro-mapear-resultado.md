# cro-mapear-resultado

```yaml
task:
  id: cro-mapear-resultado
  description: "Mapear cada seção da ResultScreen com objetivo de conversão, copy reference e hipótese A/B"
  agent: cro-specialist
  squad: skinbella-resultado
  elicit: false
  inputs:
    required: []
    optional:
      - data/refs-oferta.md
      - data/refs-provas-sociais.md
      - data/refs-faq.md
  output:
    path: docs/conteudo/resultado/mapa-resultado.md
    format: markdown
```

## Objetivo

Criar o mapa completo da ResultScreen — documentando cada seção com seu objetivo de conversão, referência de copy, estrutura esperada e hipótese A/B associada.

## Steps

### Step 1: Listar Seções da ResultScreen

Mapear todas as seções em ordem de scroll:
1. HeroResult
2. MeaningCard
3. ProjectionCard
4. NutrientCards
5. LockedReportCard
6. OfferCard
7. Testimonials
8. MiniFAQ
9. (Sticky CTA — componente persistente)

### Step 2: Para Cada Seção, Documentar

```
## Seção {N}: {Nome}

**Posição:** #{N} no scroll
**Objetivo de Conversão:** {o que esta seção deve fazer}
**Copy Reference:** {arquivo de referência}

### Estrutura Esperada
{componentes e elementos da seção}

### Objetivo Primário
{ação ou estado que queremos gerar na usuária}

### Métricas
- Scroll depth: {% de usuárias que chegam aqui}
- Tempo médio: {segundos esperados}
- Conversão auxiliar: {o que esta seção contribui para o CTA final}

### Hipótese A/B
{hipótese de teste para esta seção}
Variação A: {controle}
Variação B: {teste}
Métrica: {o que medir}
```

### Step 3: Mapa de Fluxo de Conversão

Criar fluxo visual textual:
```
HeroResult (choque diagnóstico)
    ↓ [scroll motivado por: identificação]
MeaningCard (validação + causa)
    ↓ [scroll motivado por: curiosidade sobre reversibilidade]
ProjectionCard (esperança + prazo)
    ↓ [scroll motivado por: querer saber mais]
NutrientCards (solução específica)
    ↓ [scroll motivado por: confiança crescente]
LockedReport (curiosidade + FOMO)
    ↓ [urgência para ver o restante]
OfferCard (CONVERSÃO)
    ↓ [se não converteu]
Testimonials + FAQ (superar objeções)
    ↓
Sticky CTA (recaptura em qualquer scroll)
```

### Step 4: Gap Analysis

Comparar estado atual vs. ideal:
```
| Seção | Estado Atual | Estado Ideal | Gap |
|-------|-------------|--------------|-----|
| HeroResult | genérico | personalizado por perfil | personalização |
| MeaningCard | ausente | validação emocional | criar |
...
```

### Step 5: Salvar

- Documento com 9 seções mapeadas
- Fluxo de conversão documentado
- Gap analysis v1 → v2
- ⚠️ Nota sobre preço (R$19 vs R$29 — decidir antes de validar)
- Salvar em `docs/conteudo/resultado/mapa-resultado.md`

## Regras

- Cada seção tem UM objetivo primário — não dois
- Hipótese A/B só entra se há métrica clara
- Gap analysis é honesto — não minimiza lacunas
- Output: documento .md APENAS — nunca código
