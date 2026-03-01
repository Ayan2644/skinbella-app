# Design Concept — Tela de Checklist
> Status: **Aguardando aprovação** | Versão: 1.0 | Data: 2026-03-01
> Base: Design System 00 + Routine v1 + Today v1

---

## 1. Diagnóstico do estado atual

**Problemas identificados no `Checklist.tsx` atual:**
- Header simples sem personalidade visual
- Barra de progresso genérica (sem cor dinâmica, sem animação)
- Items são cards planos — sem estado visual rico ao marcar
- Sem agrupamento por categoria (manhã / corpo / saúde)
- Sem estado de celebração quando tudo é concluído
- Streak badge pequeno e sem destaque
- Sem feedback emocional ao interagir

---

## 2. Conceito visual

**Ideia central:** *"Seu ritual diário de cuidado"*

A tela passa a ser um **painel de ritual** — cada item marcado é uma pequena vitória, com feedback visual imediato. O progresso do dia é visível e motivador, e quando tudo está concluído, a tela celebra.

**Tom:** Leveza + conquista + constância

---

## 3. Paleta de cores

```
Background:          #F7F3EE (bege creme — consistente com todo o app)
Card não-marcado:    #FFFFFF + borda #EDE8E1
Card marcado:        #E8EFDF + borda #d0e4c0 (verde suave)
Texto primário:      #2C1F14
Texto secundário:    #8C7B6B
Texto riscado:       #8C7B6B + strikethrough
Verde (check/done):  #4A5C3A
Âmbar (streak):      #C8913F
Ring track:          #EDE8E1
Ring progress:       #4A5C3A
```

---

## 4. Layout — Mockup ASCII

```
┌─────────────────────────────────────┐
│                                     │
│  segunda-feira               🔥 7   │  ← data + streak pill
│  01 de março                        │  ← mês grande Playfair
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │  ← Hero card de progresso
│  │     [anel conic-gradient]   │    │
│  │         4 / 6               │    │  ← centro do anel
│  │       tarefas               │    │
│  │                             │    │
│  │  ████████████░░░░  66%      │    │  ← barra linear abaixo do anel
│  └─────────────────────────────┘    │
│                                     │
│  ── SUAS TAREFAS DE HOJE ───────    │  ← separador
│                                     │
│  ┌─────────────────────────────┐    │  ← Item NÃO marcado
│  │  💧  Beber 2L de água       │    │
│  │                          ○  │    │  ← checkbox à direita
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │  ← Item MARCADO
│  │  ☀️  ~~Protetor solar~~  ✓  │    │  bg verde suave
│  └─────────────────────────────┘    │  texto riscado + pill ✓
│                                     │
│  ┌─────────────────────────────┐    │
│  │  🌅  Rotina da manhã     ○  │    │
│  └─────────────────────────────┘    │
│  ...                                │
│                                     │
│  [Quando tudo marcado:]             │
│  ┌─────────────────────────────┐    │
│  │  🎉 Parabéns! Dia completo  │    │  ← Banner celebração
│  │  Seu streak é {n} dias 🔥   │    │  bg âmbar gradient
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

---

## 5. Componentes detalhados

### 5.1 Header

```
┌─────────────────────────────────────┐
│  segunda-feira          ┌─────────┐ │
│  01 de março            │ 🔥  7   │ │  ← streak pill âmbar
│                         └─────────┘ │
└─────────────────────────────────────┘
```
- Data: `dayName` Inter 13px #8C7B6B (capitalizado)
- Número + mês: Playfair Display 24px #2C1F14
- Streak pill: bg amber gradient, 🔥 + número bold

### 5.2 Card de Progresso (Hero)

Anel conic-gradient centralizado (padrão do app):
- Diâmetro: 120px, inner: 96px
- Cor do anel: `#4A5C3A` (verde)
- Centro: `X/Y` em Playfair + "tarefas" Inter 11px
- Barra linear abaixo com % e animação 700ms

### 5.3 Item de Checklist

**Estado padrão (não marcado):**
```
┌──────────────────────────────────────┐
│  ┌────┐                              │
│  │ 💧 │  Beber 2L de água       [ ] │  ← checkbox redondo à direita
│  └────┘                              │
└──────────────────────────────────────┘
bg: #FFFFFF, border: #EDE8E1
```

**Estado marcado:**
```
┌──────────────────────────────────────┐
│  ┌────┐                              │
│  │ ✓  │  ~~Beber 2L de água~~  [✓] │
│  └────┘                              │
└──────────────────────────────────────┘
bg: #E8EFDF, border: #d0e4c0
ícone muda para ✓ verde
texto: strikethrough + #8C7B6B
pill "✓ feito" no canto direito
```

Transição: 300ms background + transform scale(0.98) ao marcar

### 5.4 Estado de Celebração (All Done)

```
┌─────────────────────────────────────┐
│  🎉  Dia completo!                  │
│                                     │
│  Você completou todas as tarefas    │
│  de hoje. Streak: {n} dias 🔥       │
│                                     │
│  Sua pele agradece 💚               │
└─────────────────────────────────────┘
bg: linear-gradient âmbar #FDF0C8 → #F5CF80
border: #F0D8A8
```

Aparece abaixo dos items quando todos estão marcados.

---

## 6. Extração do emoji dos labels

Os items já têm emojis no texto (ex: "Beber 2L de água 💧"). A lógica extrai o emoji para usar como ícone:

```
função getItemEmoji(label) → extrai emoji do final ou início do label
fallback → '✅'
```

Mapeamento por keyword como backup:
| Keyword | Emoji |
|---------|-------|
| água    | 💧    |
| protetor / solar | ☀️ |
| manhã   | 🌅    |
| noite   | 🌙    |
| dormir  | 😴    |
| açúcar / alimentação | 🥗 |

---

## 7. Animações

- Anel de progresso: transition 700ms ao marcar item
- Item ao marcar: scale 0.98 → 1 + bg transition 300ms
- Emoji do ícone: quando marcado, transição para ✓ (scale + opacity)
- Banner de celebração: `animate-fade-in-up` ao aparecer
- Barra linear: transition 500ms na width

---

## 8. O que NÃO muda

- Lógica de streak (incrementa só 1x por dia)
- Storage: `storage.saveChecklist()` / `storage.getChecklist()`
- Toast ao completar
- Dados vêm do `storage.getChecklist()`

---

## 9. Arquivos a modificar

- `src/pages/app/Checklist.tsx` — único arquivo alterado

---

*Design concept criado por Uma (UX Design Expert) — aguardando aprovação para implementação*
