# Design Concept — Tela de Relatório
> Status: **Aguardando aprovação** | Versão: 1.0 | Data: 2026-03-01
> Base: Design System 00 + Nutrients v1 + Routine v1

---

## 1. Diagnóstico do estado atual

**Problemas identificados no `Report.tsx` atual:**
- Mostra apenas skinAge, sem contexto da idade real da pessoa
- Sem progressão visual (meta de rejuvenescimento)
- Scores em grid genérico — sem interpretação (ótimo/atenção/crítico)
- Diagnóstico textual hardcoded e vago ("mostra sinais sutis")
- Sem substâncias sugeridas (dado disponível em `nutrientesTop4`)
- Sem produto recomendado (SkinBella Sérum / Caps)
- Visual abaixo do padrão das outras telas redesenhadas

---

## 2. Dados disponíveis no perfil

```
profile.skinAge           → idade da pele (ex: 33 anos)
answers.idade             → idade real da pessoa (ex: 28 anos)
profile.scores            → 6 indicadores: manchas, textura, elasticidade, poros, oleosidade, hidratacao
profile.prioridadesTop3   → top 3 prioridades calculadas
profile.nutrientesTop4    → nome, porque, acao, recomendacao (SkinBella Sérum ou Caps)
```

**Dado calculado:**
- `ageGap = skinAge - realAge` → diferença (ex: +5 anos)
- `metaAge = realAge - 2` → idade desejada da pele (ex: 26 anos)
- `progressPercent` → quão perto está da meta (0% = skinAge, 100% = metaAge)

---

## 3. Conceito visual

**Ideia central:** *"Seu laudo dermatológico personalizado"*

A tela deixa de ser uma lista de cards e passa a ser um **laudo completo** — como se a usuária tivesse feito uma avaliação com especialista, com seções hierárquicas claras, evidência científica e prescrição de produto.

**Tom:** Diagnóstico clínico + cuidado premium + empoderamento

---

## 4. Paleta de cores

```
Background:          #F7F3EE (bege creme)
Card base:           #FFFFFF com sombra sutil
Texto primário:      #2C1F14 (marrom escuro)
Texto secundário:    #8C7B6B (marrom médio)
Verde (CTA/ótimo):   #4A5C3A
Verde suave:         #E8EFDF
Âmbar (atenção):     #C8913F
Âmbar suave:         #FDF6EE
Terracota (crítico): #C4472A
Terracota suave:     #FDF0EE
Borda:               #EDE8E1
```

**Sistema de cores dos scores:**
| Faixa | Status | Cor | Track |
|-------|--------|-----|-------|
| 75-100% | Ótimo | `#4A5C3A` | `#E8EFDF` |
| 50-74%  | Atenção | `#C8913F` | `#FDF6EE` |
| 0-49%   | Crítico | `#C4472A` | `#FDF0EE` |

---

## 5. Layout — Mockup ASCII completo

```
┌─────────────────────────────────────┐
│  🌿 SkinBella                    🔒 │  ← header (mantido)
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Diagnóstico                │    │  ← Hero section
│  │  Completo da Pele           │    │    bg: gradient bege
│  │                             │    │
│  │  ┌──────────┐ ┌──────────┐  │    │
│  │  │ Sua      │ │ Pele     │  │    │  ← 2 badges lado a lado
│  │  │ idade    │ │ aparenta │  │    │
│  │  │          │ │          │  │    │
│  │  │  [28]    │ │  [33]    │  │    │  ← números Playfair 42px
│  │  │  anos    │ │  anos    │  │    │
│  │  └──────────┘ └──────────┘  │    │
│  │                             │    │
│  │  📊 Diferença: +5 anos      │    │  ← terracota
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │  ← Seção: Meta de Rejuvenescimento
│  │  🎯 Meta: aparência de 26   │    │
│  │  anos                       │    │
│  │                             │    │
│  │  [====○─────────────] 28%  │    │  ← progress bar: skinAge → metaAge
│  │                             │    │
│  │  33 anos ────────── 26 anos │    │  ← labels nos extremos
│  │                             │    │
│  │  Com a rotina SkinBella,    │    │  ← mensagem motivacional
│  │  sua pele pode rejuvenescer │    │
│  │  até 7 anos em 90 dias.     │    │
│  └─────────────────────────────┘    │
│                                     │
│  ── DIAGNÓSTICO DETALHADO ──────    │  ← Separador com label
│                                     │
│  ┌──────────────────────────────┐   │  ← Scores: grid 2x3
│  │  ┌────┐ ┌────┐ ┌────┐        │   │
│  │  │ ◉  │ │ ◉  │ │ ◉  │        │   │  conic-gradient rings
│  │  │ 82%│ │ 67%│ │ 48%│        │   │  verde / âmbar / terracota
│  │  └────┘ └────┘ └────┘        │   │
│  │  Hidrat. Textura  Manchas    │   │
│  │  ✓Ótimo ⚠Atenção ✗Crítico   │   │  ← status label
│  │                              │   │
│  │  ┌────┐ ┌────┐ ┌────┐        │   │
│  │  │ ◉  │ │ ◉  │ │ ◉  │        │   │
│  │  │ 75%│ │ 90%│ │ 71%│        │   │
│  │  └────┘ └────┘ └────┘        │   │
│  │  Elast.  Poros  Oleosidade   │   │
│  │  ✓Ótimo ✓Ótimo ⚠Atenção     │   │
│  └──────────────────────────────┘   │
│                                     │
│  ── PRIORIDADES DA SUA PELE ────    │  ← Separador
│                                     │
│  ┌─────────────────────────────┐    │
│  │  1. 🔴 Proteção Solar       │    │  ← pill numerada
│  │  2. 🟡 Hidratação Profunda  │    │
│  │  3. 🟢 Anti-idade           │    │
│  └─────────────────────────────┘    │
│                                     │
│  ── SUBSTÂNCIAS SUGERIDAS ──────    │  ← Separador (NEW)
│                                     │
│  ┌─────────────────────────────┐    │  ← Card substância 1
│  │  💊 Vitamina C              │    │
│  │  (Antioxidante)             │    │
│  │                             │    │
│  │  Neutraliza radicais livres │    │
│  │  e uniformiza o tom.        │    │
│  │                             │    │
│  │  ✦ Usar sérum pela manhã   │    │  ← dica de ação
│  └─────────────────────────────┘    │
│  (repete para os 4 nutrientes)      │
│                                     │
│  ── PRODUTO RECOMENDADO ────────    │  ← Separador (NEW)
│                                     │
│  ┌─────────────────────────────┐    │  ← Card produto PREMIUM
│  │  ✦ SkinBella Sérum          │    │  bg: verde oliva escuro
│  │                             │    │  texto: branco
│  │  Contém as substâncias      │    │
│  │  que sua pele precisa:      │    │
│  │                             │    │
│  │  ✓ Vitamina C               │    │  ← ingredientes da lista
│  │  ✓ Ácido Hialurônico        │    │
│  │  ✓ Niacinamida              │    │
│  │                             │    │
│  │  ┌─────────────────────┐    │    │
│  │  │  Quero o SkinBella  │    │    │  ← CTA branco
│  │  └─────────────────────┘    │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │  ← Card produto CAPS (separado)
│  │  💊 SkinBella Caps           │   │
│  │                             │    │
│  │  Colágeno + vitaminas para  │    │
│  │  agir de dentro para fora.  │    │
│  │                             │    │
│  │  ✓ Colágeno Hidrolisado     │    │
│  │  ✓ Vitamina D3              │    │
│  │  ✓ Biotina                  │    │
│  │                             │    │
│  │  ┌─────────────────────┐    │    │
│  │  │  Quero o SkinBella  │    │    │  ← CTA âmbar
│  │  │  Caps               │    │    │
│  │  └─────────────────────┘    │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

---

## 6. Componentes detalhados

### 6.1 Hero — Comparativo de Idades

```
┌─────────────────────────────────────┐
│  Diagnóstico         [foto circular]│  Playfair Display 22px
│  Completo da Pele                   │  imagem: heroSkinbella.jpg
│                                     │
│  ┌──────────────┐ ┌──────────────┐  │
│  │ Sua idade    │ │ Pele aparenta│  │  bg: rgba(255,255,255,0.85)
│  │              │ │              │  │  border-radius: 18px
│  │   [28]       │ │   [33]       │  │  Playfair 46px bold
│  │   anos       │ │   anos       │  │  anos = Inter 14px
│  └──────────────┘ └──────────────┘  │
│                                     │
│  ⚠ Sua pele aparenta +5 anos       │  terracota, Inter 13px
└─────────────────────────────────────┘
```

### 6.2 Seção — Meta de Rejuvenescimento

```
┌─────────────────────────────────────┐
│  🎯 Meta de Rejuvenescimento        │  Playfair 17px
│                                     │
│  Aparência desejada: 26 anos        │  Inter 13px muted
│                                     │
│  33 ──[══════○──────────────]── 26  │
│      atual  ↑ progresso      meta   │
│             28% concluído           │  Inter 11px
│                                     │
│  ╔═══════════════════════════════╗  │
│  ║  Com a rotina SkinBella,      ║  │  bg: #E8EFDF
│  ║  sua pele pode aparecer até   ║  │  borda verde
│  ║  7 anos mais jovem em 90 dias ║  │
│  ╚═══════════════════════════════╝  │
└─────────────────────────────────────┘
```

### 6.3 Scores — Grid de diagnóstico

Cada card do grid inclui:
- Conic-gradient ring (padrão do Report.tsx atual) com cor por faixa
- Número de % dentro do anel
- Nome do indicador
- Badge de status: "✓ Ótimo" / "⚠ Atenção" / "✗ Crítico"

### 6.4 Substâncias sugeridas

```
┌─────────────────────────────────────┐
│  ●  Vitamina C (Antioxidante)       │  ● = emoji mapeado
│                                     │
│  Neutraliza radicais livres e       │  Inter 13px #8C7B6B
│  uniformiza o tom da pele.          │
│                                     │
│  ┌────────────────────────────────┐ │
│  │ 💡 Use sérum com vitamina C    │ │  bg: #E8EFDF, dica de ação
│  │    pela manhã                  │ │
│  └────────────────────────────────┘ │
│                                     │
│  Encontrado em: SkinBella Sérum ✦  │  tag de produto
└─────────────────────────────────────┘
```

### 6.5 Produtos recomendados

**SkinBella Sérum** (card escuro — produto premium)
- bg: `#2C3E22` (verde muito escuro)
- texto: `#FFFFFF`
- badge: "MAIS VENDIDO"
- ingredientes listados com ✓ verde claro
- CTA: botão branco com texto escuro

**SkinBella Caps** (card âmbar)
- bg: linear-gradient âmbar `#F5CF80 → #E8A030`
- texto: `#2C1F14`
- ingredientes listados com ✓
- CTA: botão escuro

---

## 7. Animações

- Hero card: `animate-fade-in-up` com delay 60ms
- Scores: entram com stagger 80ms entre cada card
- Conic-gradient: transition 700ms ao montar (igual ao Report.tsx atual)
- Substâncias: stagger 100ms com `animate-fade-in-up`
- Produtos: `animate-fade-in-up` com delay 500ms

---

## 8. Lógica de produto recomendado

Os nutrientes têm `recomendacao: 'SkinBella Sérum' | 'SkinBella Caps'`.
- Se ≥ 2 de 4 nutrientes recomendam Sérum → Sérum em destaque (primeiro)
- Se ≥ 2 de 4 nutrientes recomendam Caps → Caps em destaque

Sempre mostrar ambos, mas com hierarquia visual.

---

## 9. O que NÃO muda

- Dados vêm de `storage.getProfile()` e `storage.getAnswers()`
- Rota e navegação inalteradas
- Header com Leaf + Lock mantido

---

## 10. Arquivos a modificar

- `src/pages/app/Report.tsx` — único arquivo alterado

---

*Design concept criado por Uma (UX Design Expert) — aguardando aprovação para implementação*
