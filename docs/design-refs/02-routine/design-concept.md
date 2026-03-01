# Design Concept — Tela de Rotina
> Status: **Implementado** | Versão: 1.0 | Data: 2026-03-01
> Base: Nutrients v1 + Report.tsx (conic-gradient) + Design Refs

---

## 1. Identidade Visual Única

**Tema dual:** manhã e noite têm personalidades visuais distintas

| Período | Gradiente | Acento | Sensação |
|---------|-----------|--------|----------|
| **Manhã** | Âmbar dourado `#FDF0C8 → #EDB84A` | `#C8913F` | Energia, proteção, vitalidade |
| **Noite** | Lavanda suave `#E8E0F5 → #A898D8` | `#7058B0` | Recuperação, renovação, calma |

---

## 2. Elementos-chave

### 2.1 Anel de Progresso (conic-gradient)
Inspirado no Report.tsx — círculo com `conic-gradient` animado que preenche conforme steps são concluídos.
- 88px de diâmetro, inner circle 70px
- Transição suave de 700ms ao trocar de tab ou marcar step

### 2.2 Tab Switcher Visual
Não é simples tab — é um switcher com gradiente ativo que muda a temperatura da tela toda.

### 2.3 Hero Card do Tab
Card com gradiente do tema, círculos decorativos e anel de progresso. Aparece abaixo do switcher.

### 2.4 Steps com Emoji + Número
Cada step tem:
- Ícone emoji mapeado por keyword (🧼 ☀️ 💧 ✨ 🌸 🔬 🌙 👁️)
- Número "01" "02" abaixo do emoji
- Ao marcar: ícone muda para ✓ com cor do tema
- Estado checked: fundo suave + texto riscado + pill "✓"

### 2.5 Streak Banner
Aparece se streak > 0 — mostra dias consecutivos com 🔥

### 2.6 Completion State
Quando todos os steps estão marcados: anel mostra ✅, banner de parabéns aparece no hero card.

---

## 3. Animações
- Entrada de cards: `animate-fade-in-up` com stagger de 80ms
- Anel de progresso: CSS transition 700ms no conic-gradient degree
- Tab switch: re-animação dos steps com nova cor de tema
- Check/uncheck: transition 300ms no background + transform scale

---

## 4. Arquivos modificados
- `src/pages/app/Routine.tsx` — único arquivo alterado

---

*Criado por Uma (UX Design Expert) — implementado em 2026-03-01*
