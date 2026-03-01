# Design Concept — Tela de Dieta
> Status: **Aguardando aprovação** | Versão: 1.0 | Data: 2026-03-01
> Base: Design System 00 + Nutrients v1 + Checklist v1

---

## 1. Diagnóstico do estado atual

**Problemas identificados no `Diet.tsx` atual:**
- Layout completamente genérico — 3 listas sem hierarquia visual
- Sem personalidade — poderia ser qualquer app de dieta
- Sem emojis/ícones por item
- Plano de refeições tratado igual aos outros — sem timeline
- Sem seção premium bloqueada (oportunidade de upsell)
- Sem conexão com o perfil da pele da usuária (sem contexto)
- Seção "reduzir" sem destaque visual de alerta

---

## 2. Dados disponíveis

```
profile.dieta.priorizar[]  → itens para priorizar (frutas, peixes, vegetais...)
profile.dieta.reduzir[]    → itens para reduzir (açúcar, frituras...)
profile.dieta.plano[]      → plano de 1 dia ("Café da manhã: ...", "Almoço: ...")
profile.prioridadesTop3[]  → contexto da pele (ex: Hidratação, Anti-idade)
profile.skinAge            → contexto: "Para uma pele de 33 anos"
```

Cada item do `plano` segue o padrão `"Refeição: descrição"` — extraímos o nome e a descrição automaticamente.

---

## 3. Conceito visual

**Ideia central:** *"Seu protocolo nutricional para a pele"*

A tela passa a ser um **guia de nutrição dermatológica** personalizado. Três blocos bem distintos:
- 🟢 **Aliados da pele** — com visual verde e acolhedor
- 🔴 **Inimigos da pele** — com visual terracota de alerta
- 🍽️ **Plano do dia** — timeline de refeições com visual de receituário

**Tom:** Científico + leve + empoderador

---

## 4. Paleta de cores

```
Priorizar (verde):
  Card bg:     #E8EFDF
  Borda:       #d0e4c0
  Ícone bg:    #4A5C3A
  Texto:       #2C1F14

Reduzir (terracota):
  Card bg:     #FDF0EE
  Borda:       #f0c0b8
  Ícone bg:    #C4472A
  Texto:       #2C1F14

Plano / Timeline (âmbar):
  Card bg:     #FFFFFF
  Timeline:    #C8913F
  Dot:         #C8913F
  Header meal: #FDF6EE
```

---

## 5. Layout — Mockup ASCII

```
┌─────────────────────────────────────┐
│                                     │
│  Protocolo                          │  ← Playfair Display 24px
│  Nutricional                        │
│  Para sua pele de 33 anos           │  ← Inter 13px muted
│                                     │
│  ┌─────────────────────────────┐    │
│  │  📊 Baseado em: Hidratação  │    │  ← Banner contextual
│  │  · Anti-idade · Manchas     │    │    (prioridades do perfil)
│  └─────────────────────────────┘    │
│                                     │
│  ── ALIADOS DA SUA PELE ────────    │  ← Separador verde
│                                     │
│  ┌─────────────────────────────┐    │  ← Card priorizar
│  │  🍊  Frutas ricas em        │    │  bg: #E8EFDF
│  │      vitamina C             │    │  borda: verde
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │  🐟  Peixes ricos em ômega-3│    │
│  └─────────────────────────────┘    │
│  ... (todos os itens)               │
│                                     │
│  ── EVITAR PARA MELHORES ───────    │  ← Separador terracota
│     RESULTADOS                      │
│                                     │
│  ┌─────────────────────────────┐    │  ← Card reduzir
│  │  🍬  Açúcar refinado e      │    │  bg: #FDF0EE
│  │      doces                  │    │  borda: terracota
│  └─────────────────────────────┘    │
│  ... (todos os itens)               │
│                                     │
│  ── PLANO DE HOJE ──────────────    │  ← Separador âmbar
│                                     │
│  ● ── ──────────────────────── ─   │  ← Timeline vertical
│  │  ☕  Café da manhã               │
│  │  Smoothie de morango +           │  ← refeição parseada
│  │  colágeno + aveia                │
│  │                                  │
│  ● ── ──────────────────────── ─   │
│  │  🍎  Lanche                      │
│  │  Mix de castanhas + chá verde    │
│  │                                  │
│  ● ── ──────────────────────── ─   │
│  │  🥗  Almoço                      │
│  │  Salmão grelhado + salada...     │
│  │                                  │
│  ● ── ──────────────────────── ─   │
│  │  🍎  Lanche da tarde             │
│  │  Frutas vermelhas com iogurte    │
│  │                                  │
│  ● ── ──────────────────────── ─   │
│  │  🍲  Jantar                      │
│  │  Sopa de legumes + frango        │
│                                     │
│  ┌─────────────────────────────┐    │  ← Seção BLOQUEADA
│  │  🔒 Plano Completo de 7 dias│    │
│  │                             │    │
│  │  ░░ Seg: Smoothie + salmão  │    │  ← conteúdo borrado
│  │  ░░ Ter: Aveia + frango     │    │
│  │  ░░ Qua: Omelete + quinoa   │    │
│  │                             │    │
│  │  ┌─────────────────────┐    │    │
│  │  │ Desbloquear Plano   │    │    │  ← CTA verde
│  │  │ R$29/mês            │    │    │
│  │  └─────────────────────┘    │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

---

## 6. Componentes detalhados

### 6.1 Header Contextual

```
┌─────────────────────────────────────┐
│  Protocolo Nutricional              │  Playfair 24px #2C1F14
│  Para sua pele de 33 anos           │  Inter 13px #8C7B6B
│                                     │
│  ┌───────────────────────────────┐  │
│  │  📊 Baseado em suas 3        │  │  bg: #F0EBE3, border-radius: 14px
│  │  prioridades de pele         │  │  Inter 12px, chip de prioridades
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### 6.2 Card de Item Priorizar

```
┌──────────────────────────────────────┐
│  ┌────┐                              │  bg: #E8EFDF, border: #d0e4c0
│  │ 🍊 │  Frutas ricas em vitamina C  │  border-radius: 18px
│  └────┘  (laranja, kiwi, morango)    │  ícone bg: rgba(74,92,58,0.15)
└──────────────────────────────────────┘
```

### 6.3 Card de Item Reduzir

```
┌──────────────────────────────────────┐
│  ┌────┐                              │  bg: #FDF0EE, border: #f0c0b8
│  │ 🍬 │  Açúcar refinado e doces    │  border-radius: 18px
│  └────┘                              │  ícone bg: rgba(196,71,42,0.12)
└──────────────────────────────────────┘
```

### 6.4 Timeline de Refeições

Linha vertical âmbar com dots e cards das refeições:
```
●
│  ┌────────────────────────────────┐
│  │ ☕ Café da manhã               │  bg: #FFFFFF, shadow sutil
│  │ Smoothie de morango + colágeno │  dot âmbar, linha âmbar
│  └────────────────────────────────┘
│
●
│  ┌────────────────────────────────┐
│  │ 🍎 Lanche                      │
│  │ Mix de castanhas + chá verde   │
│  └────────────────────────────────┘
```

Parse do item: `"Café da manhã: Smoothie..."` → `{ title: "Café da manhã", desc: "Smoothie..." }`

Emojis por refeição:
| Refeição | Emoji |
|----------|-------|
| café da manhã | ☕ |
| lanche | 🍎 |
| almoço | 🥗 |
| jantar | 🍲 |
| ceia | 🌙 |

### 6.5 Seção Bloqueada (Plano 7 dias)

Mesma estrutura do Nutrients.tsx — blur overlay com preview borrado e CTA verde.

---

## 7. Emojis por item (mapeamento)

**Priorizar:**
| Keyword | Emoji |
|---------|-------|
| fruta, vitamina c | 🍊 |
| peixe, ômega, salmão | 🐟 |
| vegetal, verde, espinafre | 🥬 |
| água | 💧 |
| chá, antioxidante | 🍵 |
| oleaginosa, castanha | 🥜 |
| iogurte, probiótico | 🥛 |

**Reduzir:**
| Keyword | Emoji |
|---------|-------|
| açúcar, doce | 🍬 |
| fritura, processado | 🍟 |
| álcool | 🍷 |
| laticínio | 🥛 |
| refrigerante | 🥤 |
| sal, sódio | 🧂 |

---

## 8. Animações

- Header: `animate-fade-in` imediato
- Cards priorizar: `animate-fade-in-up` stagger 60ms
- Cards reduzir: `animate-fade-in-up` stagger 60ms (após priorizar)
- Timeline items: entram da esquerda com stagger 80ms
- Seção bloqueada: shimmer sutil

---

## 9. O que NÃO muda

- Dados vêm de `storage.getProfile().dieta`
- Rota e navegação inalteradas
- Sem alterações no skinEngine

---

## 10. Arquivos a modificar

- `src/pages/app/Diet.tsx` — único arquivo alterado

---

*Design concept criado por Uma (UX Design Expert) — aguardando aprovação para implementação*
