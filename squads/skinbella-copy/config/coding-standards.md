# Padrões de Output — skinbella-copy

> Padrões de escrita e estrutura para todos os documentos de copy gerados por este squad.

---

## Estrutura de Documento de Copy

### Cabeçalho Obrigatório
```markdown
# {título do documento}

**Squad:** skinbella-copy
**Agente:** copywriter (Val)
**Versão:** v{N}.{M}
**Data:** {data}
**Status:** [Rascunho | Em revisão | Aprovado]
**Depende de:** [claims validados pelo cientista? SIM/NÃO]
```

---

## Padrões de Copy

### Extensões Máximas
| Elemento | Máx. Palavras |
|---------|--------------|
| Headline | 12 palavras |
| Lead copy | 80 palavras |
| Bullet de benefício | 25 palavras |
| FAQ resposta | 80 palavras |
| Botão de CTA | 6 palavras |
| Subtítulo de pergunta quiz | 40 palavras |

### Tom Checklist (por seção de copy)
- [ ] Amiga expert, não médico
- [ ] Esperançoso, não exagerado
- [ ] Personalizado, não genérico
- [ ] Sem linguagem de medo ou vergonha

---

## Estrutura por Perfil

Todo copy personalizado segue a ordem dos 8 perfis:
1. Manchas / Hiperpigmentação
2. Acne Hormonal
3. Oleosa / Poros Dilatados
4. Envelhecimento Precoce
5. Pele Seca / Desidratada
6. Pele Sensível / Reativa
7. Preventivo / Manutenção
8. Estresse / Cortisol

---

## Formato de Seção de Copy

```markdown
## Perfil: {nome}

### {Elemento de Copy}
{copy}

### Nota de Copy
Intenção: {o que este copy deve fazer emocionalmente}
Referência: {documento científico que fundamenta o claim}
```

---

## Claims e Validação

- Todos os claims passam pelo `*validar-claims` do cientista antes de publicar
- Claims não validados marcados com ⚠️ no documento
- Preço: verificar resolução R$19/mês ✅ confirmado antes de publicar

---

## Controle de Versão

- `v0.x` — Rascunho não validado
- `v1.0` — Primeira versão para revisão humana
- `v2.0` — Pós-validação científica e humana (pronto para handoff)
