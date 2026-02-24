

# Plano: Expansao dos Blocos Filhos para Secoes Customizadas

## Contexto

Hoje o `section_custom` suporta 8 tipos de blocos filhos basicos (heading, text, image, button, spacer, chart, code, divider). Precisamos expandir drasticamente a paleta inspirando-nos nos elementos que ja existem nas secoes pre-montadas (Offer, Testimonials, LockedReport, Projection, FAQ), criando versoes modulares e editaveis desses mesmos padroes.

---

## Novos Blocos Filhos a Adicionar

Baseado nos componentes existentes, esses sao os novos child block types:

```text
BLOCO FILHO          INSPIRADO EM                   CAMPOS EDITAVEIS
─────────────────────────────────────────────────────────────────────
headline_icon        ProtocolBrandCard header        texto, subtexto, icone (lucide name), nivel (h2/h3)
headline_trigger     OfferCard header                texto, badge texto, badge cor, icone
checklist            ProjectionCard checklist        items[]: {texto, checked}
checklist_emoji      LockedReportCard items           items[]: {emoji, texto}
pricing              OfferCard pricing               precoOriginal, preco, sufixo, legenda
trust_badges         OfferCard trust badges          items[]: {icone, texto}
testimonial          Testimonials cards              items[]: {nome, texto, estrelas(1-5), imagemUrl}
faq_item             MiniFAQ                         items[]: {pergunta, resposta}
social_proof         Testimonials footer             icone, texto, contagem
badge_label          OfferCard -52% badge            texto, cor (accent/success/warning)
icon_block           ProtocolBrandCard icon circle   icone (lucide), tamanho, corFundo
```

### Detalhes de Cada Bloco

**1. `headline_icon`** — Titulo com icone circular (como ProtocolBrandCard)
- Circulo com icone Lucide acima + h2 Playfair + subtexto
- Props: `icon` (nome lucide), `text`, `subtitle`, `level`

**2. `headline_trigger`** — Headline com gatilho/badge (como OfferCard header)
- Titulo grande + badge flutuante tipo "-52% HOJE"
- Props: `text`, `badgeText`, `badgeColor`, `icon`

**3. `checklist`** — Lista com checks verdes (como ProjectionCard)
- Items com circulo verde + check icon + texto
- Props: `items[]` array de strings

**4. `checklist_emoji`** — Lista com emojis (como LockedReportCard)
- Items com emoji + texto
- Props: `items[]` array de `{emoji, text}`

**5. `pricing`** — Bloco de preco (como OfferCard pricing)
- Preco original riscado + preco atual grande + sufixo + legenda
- Props: `originalPrice`, `price`, `suffix`, `caption`

**6. `trust_badges`** — Badges de confianca (como OfferCard footer)
- Row horizontal com icone + texto cada
- Props: `items[]` array de `{icon, text}`

**7. `testimonial`** — Bloco de depoimentos (como Testimonials)
- Lista de cards com avatar/imagem, nome, estrelas, texto
- Botao "Adicionar depoimento" no painel de propriedades
- Props: `items[]`, `headerText`

**8. `faq_item`** — Bloco FAQ (como MiniFAQ)
- Cards de pergunta/resposta empilhados
- Botao "Adicionar pergunta" no painel
- Props: `items[]`, `headerText`

**9. `social_proof`** — Prova social inline (como "+12.400 mulheres...")
- Icone + contagem + texto
- Props: `icon`, `count`, `text`

**10. `badge_label`** — Badge/etiqueta solta
- Badge pill com texto e cor
- Props: `text`, `variant` (accent/success/warning/muted)

**11. `icon_block`** — Bloco de icone decorativo
- Circulo com icone Lucide centralizado
- Props: `icon`, `size` (sm/md/lg), `bgColor`

---

## Arquivos a Modificar

### 1. `src/components/page-editor/blockTypes.ts`
- Adicionar os 11 novos tipos ao array `CHILD_BLOCK_TYPES` com `defaultContent` e `defaultStyles` adequados
- Importar icones Lucide necessarios (List, ListChecks, DollarSign, ShieldCheck, Quote, MessageCircle, Users, Award, CircleDot)

### 2. `src/components/page-editor/BlockRenderer.tsx` — `ChildBlockRenderer`
- Adicionar cases no switch para cada novo tipo
- Renderizar com o visual premium identico aos componentes existentes
- Para `testimonial`: renderizar cards no estilo `TestimonialCard` com avatar, estrelas, texto
- Para `checklist`: renderizar com circulo verde + Check icon
- Para `pricing`: layout de preco riscado + preco grande + sufixo
- Para `trust_badges`: row flex horizontal com icones

### 3. `src/components/page-editor/BlockProperties.tsx`
- Adicionar paineis de edicao para cada novo tipo
- Para tipos com `items[]` (checklist, checklist_emoji, testimonial, faq_item, trust_badges):
  - Interface de lista com botao "Adicionar item" e "Remover item"
  - Cada item editavel inline (nao JSON bruto)
- Para `pricing`: campos separados (preco original, preco atual, sufixo, legenda)
- Para `headline_icon` e `headline_trigger`: campo de selecao de icone (dropdown com icones comuns)
- Para `badge_label`: selector de variante de cor

### 4. `src/components/page-editor/SectionChildPreview.tsx`
- Expandir a logica de preview para mostrar resumos dos novos tipos (ex: "3 depoimentos", "5 itens", "R$ 29/mes")

### 5. `src/components/page-editor/BlockToolbar.tsx`
- Os novos tipos aparecem automaticamente porque o toolbar ja itera `CHILD_BLOCK_TYPES`
- Organizar em sub-grupos visuais: "Conteudo", "Listas", "Conversao", "Prova Social"

---

## Detalhes Tecnicos

### Selecao de Icones Lucide
Para campos de icone (headline_icon, trust_badges, etc), criar um mini-selector com ~20 icones comuns pre-definidos:
```text
Sparkles, Shield, Zap, Heart, Star, Check, Lock, Users,
HeadphonesIcon, Gift, Award, TrendingUp, Eye, Clock,
ThumbsUp, Flame, Crown, Target, Gem, Coffee
```
Renderizar usando o pattern `icons[name]` do lucide-react.

### Estrutura de Content para tipos com items[]
```typescript
// testimonial
content: {
  headerText: "O que dizem nossas usuarias",
  items: [
    { name: "Ana C.", text: "Minha pele mudou...", stars: 5, image: "" },
  ]
}

// checklist_emoji
content: {
  items: [
    { emoji: "💆", text: "Plano de skincare personalizado" },
  ]
}

// pricing
content: {
  originalPrice: "59",
  price: "29",
  suffix: "/mes",
  caption: "Cancele quando quiser • Acesso imediato"
}
```

### Organizacao da Toolbar (Blocos da Secao)
```text
── Conteudo ──
  Titulo
  Titulo + Icone
  Titulo + Gatilho
  Texto
  Imagem
  Icone Decorativo

── Listas ──
  Checklist (check)
  Checklist (emoji)
  FAQ

── Conversao ──
  Botao
  Preco
  Badge/Etiqueta

── Prova Social ──
  Depoimentos
  Trust Badges
  Prova Social

── Layout ──
  Espaco
  Divisor
  Grafico
  Codigo
```

---

## Resumo

Nenhuma secao existente sera alterada. Os novos blocos filhos sao modulos reutilizaveis dentro de `section_custom`, permitindo montar qualquer layout que hoje so existe hardcoded. O admin pode criar uma secao de depoimentos arrastando o bloco "Depoimentos" para dentro de uma Nova Secao, e ela automaticamente assume o visual premium com cards, estrelas e avatares — tudo editavel pelo painel de propriedades.

