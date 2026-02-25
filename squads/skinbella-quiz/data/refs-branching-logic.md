# refs-branching-logic

> **Referência:** `docs/conteudo/quiz/branching-logic.md`

Este arquivo é um ponteiro de referência. O conteúdo completo está em:

```
docs/conteudo/quiz/branching-logic.md
```

## Conteúdo Resumido

Mapa completo da lógica de branching condicional do quiz:
- 3 branches definidos (P13b_acne_tipo, P13c_ciclo_hormonal, P12b_sensibilidade_gatilhos)
- Triggers para cada branch
- Contagem de perguntas por caminho (13 min / 16 max)
- Fluxograma de todos os caminhos possíveis

## Os 3 Branches

| Branch | Trigger | Pergunta Adicional |
|--------|---------|-------------------|
| 1 | P13: acne nos incomodos | P13b: tipo de acne |
| 2 | P13b: acne hormonal | P13c: ciclo hormonal |
| 3 | P12: sensível OU 3+ chips | P12b: gatilhos de sensibilidade |

## Uso pelo Agente

Ao mapear ou validar branching:
1. Carregar este arquivo como mapa atual
2. Não adicionar branches sem valor diagnóstico documentado
3. Respeitar máximo de 3 perguntas adicionais total

## Status

✅ v1.0 gerado — **revisar e validar com skinEngine antes de implementar**
