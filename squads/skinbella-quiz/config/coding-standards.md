# Padrões de Output — skinbella-quiz

> Padrões de escrita e estrutura para todos os documentos do squad de quiz.

---

## Estrutura de Documento de Quiz

### Cabeçalho Obrigatório
```markdown
# {título do documento}

**Squad:** skinbella-quiz
**Agente:** ux-writer (Bia)
**Versão:** v{N}.{M}
**Data:** {data}
**Status:** [Rascunho | Em revisão | Aprovado]
```

---

## Padrões de Perguntas do Quiz

### Estrutura por Pergunta
```markdown
## P{N} — {título}

**Tipo:** [única | múltipla | chips | texto]
**Jornada:** [curiosidade | identificação | awareness | compromisso | especificidade]
**Atrito:** {1-5}
**Valor Diagnóstico:** {1-5}

### Título
{pergunta}

### Subtítulo
{contexto de por que esta pergunta existe}

### Opções
- {opção 1}
- {opção 2}
- {opção 3}
- {opção 4}

### Nota de UX
{intenção da reformulação}
```

---

## Regras Imutáveis de Quiz

- **P1 (idade) SEMPRE primeira posição — nunca mover**
- **P14 (selfie) SEMPRE opcional com botão de skip**
- Máximo 4 opções por pergunta (exceto chips)
- Subtítulo obrigatório para atrito >= 3
- Nunca usar: "erro", "inválido", "obrigatório", "formulário"

---

## Padrões de Micro-textos

| Elemento | Máx. Caracteres | Tom |
|---------|----------------|-----|
| Botão de navegação | 30 chars | Ativo, direto |
| Tooltip | 80 chars | Explicativo, amigável |
| Mensagem de validação | 50 chars | Sugestivo, nunca punitivo |
| Mensagem de loading | 50 chars | Antecipação crescente |

---

## Controle de Versão

- `v0.x` — Rascunho não validado
- `v1.0` — Primeira versão para revisão humana
- `v2.0` — Validado e pronto para handoff ao @dev
