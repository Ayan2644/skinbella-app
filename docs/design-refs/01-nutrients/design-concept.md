# Design Concept — Tela de Nutrientes
> Status: **Aguardando aprovação** | Versão: 1.0 | Data: 2026-03-01

---

## 1. Diagnóstico da tela atual

**Problemas identificados no `Nutrients.tsx` atual:**
- Lista genérica — os 4 nutrientes são sempre os mesmos, independente do perfil
- Sem hierarquia visual — todos os cards têm o mesmo peso
- Sem conexão emocional com o resultado do quiz
- Sem senso de urgência ou prioridade
- Sem camada premium / locked content (oportunidade de upsell perdida)
- Visual básico — não reflete o padrão premium das referências

**Dados disponíveis no perfil:**
- `nutrientesTop4[]` → nome, porque, acao, recomendacao
- `skinAge` → idade da pele (ex: 33 anos)
- `scores` → hidratação, textura, anti-idade, oleosidade, manchas
- `prioridadesTop3` → top 3 prioridades da pele

---

## 2. Conceito do novo design

**Ideia central:** *"Seu protocolo nutricional personalizado"*

A tela deixa de ser uma lista genérica e passa a ser uma **prescrição visual** — como se a usuária estivesse recebendo um diagnóstico de especialista, com:
- Contexto personalizado (baseado no perfil dela)
- Prioridade visual clara (badge de urgência)
- Seção premium bloqueada para conversão

**Tom:** Científico + cuidado + empoderamento

---

## 3. Paleta de cores (baseada nas referências)

```
Background principal:  #F7F3EE  (bege creme, textura mármore leve)
Background card:       #FFFFFF  com sombra sutil
Texto primário:        #2C1F14  (marrom escuro)
Texto secundário:      #8C7B6B  (marrom médio)
Verde ação (CTA):      #4A5C3A  (verde oliva)
Verde suave (badge):   #E8EFDF  (verde muito claro)
Urgência alta:         #C4472A  (terracota)
Urgência média:        #C8913F  (dourado)
Urgência baixa:        #4A5C3A  (verde oliva)
Borda card:            #EDE8E1
```

---

## 4. Tipografia

```
Título da seção:    Playfair Display, 22px, weight 600, #2C1F14
Subtítulo/contexto: Inter, 13px, weight 400, #8C7B6B
Nome do nutriente:  Playfair Display, 17px, weight 600, #2C1F14
Corpo:              Inter, 13px, weight 400, #8C7B6B
Ação (dica):        Inter, 12px, weight 500, #2C1F14
Badge urgência:     Inter, 10px, weight 700, uppercase
```

---

## 5. Layout — Mockup ASCII

```
┌─────────────────────────────────────┐
│  ← Nutrientes                       │
│                                     │
│  Seu protocolo                      │  ← Playfair Display 22px
│  nutricional                        │
│  Para uma pele de 33 anos           │  ← Inter 13px muted
│                                     │
│  ┌─────────────────────────────┐    │
│  │  📊 Baseado no seu perfil   │    │  ← Banner contextual
│  │  Hidratação · Textura ·     │    │
│  │  Anti-idade                 │    │
│  └─────────────────────────────┘    │
│                                     │
│  ── PRIORIDADE ALTA ────────────    │  ← Separador com label
│                                     │
│  ┌─────────────────────────────┐    │
│  │  🔴 URGENTE                 │    │  ← Badge terracota
│  │                             │    │
│  │  Vitamina C                 │    │  ← Playfair 17px
│  │  (Antioxidante)             │    │
│  │                             │    │
│  │  Neutraliza radicais livres │    │  ← corpo 13px muted
│  │  e uniformiza o tom.        │    │
│  │                             │    │
│  │  ┌────────────────────┐     │    │
│  │  │ 💡 Use sérum com   │     │    │  ← Dica em card interno
│  │  │ vitamina C pela    │     │    │    bg: #E8EFDF
│  │  │ manhã              │     │    │
│  │  └────────────────────┘     │    │
│  │                             │    │
│  │  ✦ SkinBella Sérum  →       │    │  ← Link produto (verde)
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  🟡 IMPORTANTE              │    │  ← Badge dourado
│  │  Colágeno Hidrolisado       │    │
│  │  ...                        │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  🟢 RECOMENDADO             │    │  ← Badge verde
│  │  Ácido Hialurônico          │    │
│  │  ...                        │    │
│  └─────────────────────────────┘    │
│                                     │
│  ── ── ── ── ── ── ── ── ── ──     │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  🔒  PLANO NUTRICIONAL      │    │  ← Seção BLOQUEADA
│  │      COMPLETO               │    │    blur overlay
│  │                             │    │
│  │  O que comer para acelerar  │    │  ← Preview embaçado
│  │  o resultado                │    │
│  │                             │    │
│  │  ░ Café da manhã: Smoothie  │    │  ← Conteúdo borrado
│  │  ░ Almoço: Salmão grelhado  │    │
│  │  ░ O que evitar: Açúcar...  │    │
│  │                             │    │
│  │  ┌─────────────────────┐    │    │
│  │  │ Desbloquear Plano   │    │    │  ← CTA verde oliva
│  │  │ R$29/mês            │    │    │
│  │  └─────────────────────┘    │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

---

## 6. Componentes detalhados

### 6.1 Header contextual

```
┌─────────────────────────────────────┐
│  Seu protocolo nutricional          │  Playfair Display Bold
│  Para sua pele de 33 anos           │  Inter 13px #8C7B6B
│                                     │
│  ┌───────────────────────────────┐  │
│  │  📊  Baseado em 3 prioridades │  │  bg: #F0EBE3, border-radius: 12px
│  │  Hidratação · Textura ·       │  │  ícone + texto inline
│  │  Anti-idade                   │  │  Inter 12px #8C7B6B
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### 6.2 Card de Nutriente

```
┌─────────────────────────────────────┐
│  ┌──────┐                           │
│  │URGENTE│  ← badge pill            │  Cor varia por urgência:
│  └──────┘   10px uppercase bold     │  URGENTE   = #C4472A bg #FDF0EE
│                                     │  IMPORTANTE= #C8913F bg #FDF6EE
│  Vitamina C              ◉ Ativo    │  RECOMENDADO=#4A5C3A bg #E8EFDF
│  Antioxidante                       │
│                                     │  ◉ Ativo = pill status verde
│  Neutraliza radicais livres e       │
│  uniformiza o tom da pele,          │
│  prevenindo manchas futuras.        │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  💡  Use sérum com vitamina C │  │  bg: #E8EFDF
│  │      pela manhã, antes do     │  │  border-radius: 8px
│  │      protetor solar.          │  │  Inter 12px #2C1F14
│  └───────────────────────────────┘  │
│                                     │
│  Produto recomendado                │
│  ✦ SkinBella Sérum          →      │  Verde #4A5C3A, seta →
└─────────────────────────────────────┘
```

### 6.3 Seção bloqueada (Plano Nutricional)

```
┌─────────────────────────────────────┐
│                           ┌──────┐  │
│  🔒 Plano Nutricional     │52%OFF│  │  Badge desconto terracota
│     Completo              └──────┘  │
│                                     │
│  O que comer para acelerar          │
│  seu resultado                      │
│                                     │
│  ╔═══════════════════════════════╗  │
│  ║ ░░ Café da manhã: Smoothie    ║  │  ← Conteúdo com blur/opacidade
│  ║ ░░ de morango + colágeno      ║  │    simulando "desfoque"
│  ║ ░░ Almoço: Salmão grelhado   ║  │    opacity: 0.3 + blur: 4px
│  ║ ░░ + salada verde             ║  │
│  ║ ░░ Evitar: açúcar, frituras  ║  │
│  ╚═══════════════════════════════╝  │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Desbloquear Plano Completo │    │  bg: #4A5C3A, texto branco
│  │  R$29/mês · Acesso imediato │    │  border-radius: 12px, full width
│  └─────────────────────────────┘    │
│                                     │
│  ✓ Checkout seguro  ✓ Cancele quando│
│    quiser                           │
└─────────────────────────────────────┘
```

---

## 7. Sistema de urgência dos nutrientes

Os 4 nutrientes serão apresentados com prioridade diferente:

| Posição | Badge | Cor | Lógica |
|---------|-------|-----|--------|
| 1º | URGENTE | Terracota `#C4472A` | Nutriente 1 do perfil |
| 2º | IMPORTANTE | Dourado `#C8913F` | Nutriente 2 do perfil |
| 3º | RECOMENDADO | Verde `#4A5C3A` | Nutriente 3 do perfil |
| 4º | RECOMENDADO | Verde `#4A5C3A` | Nutriente 4 do perfil |

---

## 8. Animações (sugestão leve)

- Cards entram com `fade-in-up` sequencial (100ms de delay entre cada)
- Badge de urgência pulsa suavemente (1x ao montar, não loop)
- Seção bloqueada: shimmer sutil no blur overlay

---

## 9. Fluxo de interação

```
Usuária abre Nutrientes
        ↓
Vê header contextual com sua idade de pele
        ↓
Lê os 4 cards (do mais urgente ao menos urgente)
        ↓
Chega na seção bloqueada → curiosidade
        ↓
Clica "Desbloquear" → vai para checkout / plano premium
```

---

## 10. O que NÃO muda

- Dados continuam vindo do `storage.getProfile().nutrientesTop4`
- Estrutura de 4 nutrientes mantida
- Rota e navegação inalteradas

---

## 11. Pontos para revisão / decisão

> **Perguntas para aprovação:**

1. **Seção bloqueada** — Deve aparecer sempre, ou só para usuárias no plano free?
2. **Badge de urgência** — Os níveis URGENTE/IMPORTANTE/RECOMENDADO fazem sentido como hierarquia?
3. **Link de produto** — "SkinBella Sérum" deve abrir uma modal, ir para aba Produtos, ou é link externo?
4. **Plano nutricional bloqueado** — Mostrar preview do conteúdo real (borrado) ou ícones genéricos?
5. **Fundo mármore** — Aplicar textura de fundo na página inteira ou só nos cards?

---

*Design concept criado por Orion (AIOS Master) — aguardando aprovação para implementação*
