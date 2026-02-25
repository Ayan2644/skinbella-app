# refs-matriz-perfil

> **Referência:** `docs/conteudo/referencias/matriz-perfil-problema.md`

Este arquivo é um ponteiro de referência. O conteúdo completo está em:

```
docs/conteudo/referencias/matriz-perfil-problema.md
```

## Relevância para o Quiz

A matriz de perfis define QUAL diagnóstico cada combinação de respostas gera.
O quiz existe para coletar os dados que o skinEngine usa para classificar o perfil.

## Relação Quiz → Perfil

| Pergunta | Dado coletado | Influência no perfil |
|---------|---------------|---------------------|
| P13 (incomodos) | chips selecionados | define perfil primário |
| P12 (tipo de pele) | oleosa/seca/mista/normal/sensível | modifica perfil |
| P13b (acne tipo) | hormonal/cística/espinhinha | sub-perfil acne |

## Uso pelo Agente

Ao mapear branching:
- Checar quais perguntas geram dados para qual perfil
- Branches só existem se diferenciam perfis de forma mensurável
