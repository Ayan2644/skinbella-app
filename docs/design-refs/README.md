# Design References — Skinbella App

Pasta de referências visuais para o redesign do design system.

## Como usar

1. Faça upload dos screenshots de referência na pasta correspondente à funcionalidade
2. Quando a pasta estiver pronta, avise no chat para ativar o `@ux-design-expert`
3. O agente analisa as imagens e gera a spec de implementação
4. Aprovação humana é obrigatória antes de iniciar o código

## Estrutura

| Pasta | Funcionalidade | Arquivo de origem |
|-------|---------------|-------------------|
| `01-relatorio/` | Relatório | `src/pages/app/Report.tsx` |
| `02-nutrientes/` | Nutrientes | `src/pages/app/Nutrients.tsx` |
| `03-rotina/` | Rotina | `src/pages/app/Routine.tsx` |
| `04-checklist/` | Checklist | `src/pages/app/Checklist.tsx` |
| `05-dieta/` | Dieta | `src/pages/app/Diet.tsx` |
| `06-biblioteca/` | Biblioteca | `src/pages/app/Library.tsx` |
| `07-produtos/` | Produtos | `src/pages/app/Products.tsx` |

## Fluxo de Aprovação

```
[VOCÊ] Upou screenshots na pasta
    ↓
[@ux-design-expert] Analisa + gera spec
    ↓
[VOCÊ] Aprova ou rejeita spec
    ↓
[@dev] Implementa (somente após aprovação)
    ↓
[VOCÊ] Aprova ou pede ajustes
    ↓
Próxima funcionalidade
```

## Naming convention para os arquivos

Sugestão de nomeação para facilitar análise:
- `01-visao-geral.png` — tela completa
- `02-detalhe-header.png` — detalhe de componente
- `03-estado-vazio.png` — estado sem dados
- `04-mobile.png` — versão mobile (se houver)

## Status por funcionalidade

| # | Funcionalidade | Screenshots | Spec UX | Aprovação | Dev | QA |
|---|---------------|-------------|---------|-----------|-----|----|
| 1 | Relatório | ⏳ aguardando | — | — | — | — |
| 2 | Nutrientes | ⏳ aguardando | — | — | — | — |
| 3 | Rotina | ⏳ aguardando | — | — | — | — |
| 4 | Checklist | ⏳ aguardando | — | — | — | — |
| 5 | Dieta | ⏳ aguardando | — | — | — | — |
| 6 | Biblioteca | ⏳ aguardando | — | — | — | — |
| 7 | Produtos | ⏳ aguardando | — | — | — | — |
