# Padrões de Output — skinbella-resultado

> Padrões de análise e documentação para todos os outputs do squad de CRO.

---

## Estrutura de Documento de CRO

### Cabeçalho Obrigatório
```markdown
# {título do documento}

**Squad:** skinbella-resultado
**Agente:** cro-specialist (Gabi)
**Versão:** v{N}.{M}
**Data:** {data}
**Status:** [Rascunho | Em revisão | Aprovado]
```

---

## Padrões de Hipótese A/B

Toda hipótese deve ter os 5 elementos obrigatórios:

```markdown
### Hipótese {N}: {nome}

**Hipótese:** "Acreditamos que {mudança} vai {resultado} porque {razão}."
**Variação A (controle):** {estado atual}
**Variação B (teste):** {mudança proposta}
**Métrica primária:** {o que medir}
**Critério de winner:** +{X}% com p<0.05, n≥{N}/variação
```

---

## Padrões de Gap Analysis

```markdown
### {Seção da ResultScreen}

| Dimensão | v1 Atual | v2 Ideal | Gap |
|---------|---------|---------|-----|
| Personalização | {estado} | {ideal} | {lacuna} |
| Copy | {estado} | {ideal} | {lacuna} |
| Conversão | {estado} | {ideal} | {lacuna} |

**Prioridade:** [alta | média | baixa]
**Esforço:** [alto | médio | baixo]
```

---

## Regras de CRO Ético

- Urgência APENAS com base real documentada no output
- Nenhum teste sem hipótese e métrica clara
- Amostra mínima calculada antes de propor teste
- Winner declarado apenas com p<0.05 (nunca antes)

---

## ⚠️ Flag Obrigatória

Todo documento que menciona preço DEVE incluir:
```
⚠️ Preço confirmado: R$19/mês
```

---

## Controle de Versão

- `v0.x` — Análise preliminar
- `v1.0` — Primeira versão para revisão humana
- `v2.0` — Validado, pronto para execução
