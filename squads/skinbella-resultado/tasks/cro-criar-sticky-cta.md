# cro-criar-sticky-cta

```yaml
task:
  id: cro-criar-sticky-cta
  description: "Criar variações do sticky CTA por perfil e momento de scroll"
  agent: cro-specialist
  squad: skinbella-resultado
  elicit: false
  inputs:
    required: []
    optional:
      - data/refs-cta-variacoes.md
  output:
    path: docs/conteudo/resultado/sticky-cta-variacoes.md
    format: markdown
```

## Objetivo

Criar e documentar todas as variações do Sticky CTA — o botão fixo no bottom da ResultScreen — com lógica de visibilidade, copy por perfil e hipóteses de A/B.

## Steps

### Step 1: Definir Regras de Visibilidade

O Sticky CTA tem regras de quando aparecer/sumir:
```
MOSTRAR quando:
- Usuária passou da seção HeroResult
- OfferCard NÃO está visível no viewport

ESCONDER quando:
- OfferCard está visível no viewport
- (Não competir com o CTA principal)
```

### Step 2: Variações de Copy

Criar 4 variações para teste A/B:
```
## Variação A — Padrão
Texto: "Quero meu protocolo personalizado"
Hipótese: baseline — posse do protocolo

## Variação B — Ação Imediata
Texto: "Começar agora"
Hipótese: ação direta converte mais que posse

## Variação C — Personalizado por Perfil
Textos por perfil:
| Perfil | Texto |
|--------|-------|
| Manchas | "Começar a clarear minha pele" |
| Acne | "Começar meu protocolo anti-acne" |
| Oleosa | "Controlar minha oleosidade" |
| Envelhecimento | "Começar meu protocolo anti-aging" |
| Seca | "Nutrir e hidratar minha pele" |
| Sensível | "Cuidar da minha pele com delicadeza" |
| Preventivo | "Começar a prevenir agora" |
| Estresse | "Restaurar minha pele" |

## Variação D — Com Urgência Ética
Texto: "Ver meu protocolo completo →"
Sub-copy: "Diagnóstico disponível por {X}h"
CONDIÇÃO: Usar APENAS se diagnóstico de fato expira
```

### Step 3: Sticky CTA com Preço (opcional)

Variação que inclui preço:
```
"Começar por R${X}/mês"
```
⚠️ **BLOQUEADA** até resolução do preço R$19 vs R$29

### Step 4: Comportamento de Animação

Descrever comportamento esperado (para entrega ao @dev quando chegar a hora):
- Aparece: slide up suave (não pisca)
- Desaparece: fade out quando OfferCard entra no viewport
- Re-aparece: quando OfferCard sai do viewport
- Sticky: fixed bottom, full width, z-index alto

### Step 5: Hipótese A/B para Sticky

```
Hipótese: CTA personalizado por perfil (variação C) converte mais
que CTA genérico (variação A).

Variação A: "Quero meu protocolo personalizado"
Variação C: texto personalizado por perfil
Métrica: taxa de clique no sticky CTA
Critério: +5% clique com p<0.05, n≥300/variação
```

### Step 6: Salvar

- Documento com 4 variações de copy
- Tabela de personalização por perfil
- Regras de visibilidade
- Hipóteses A/B
- ⚠️ Nota de bloqueio de preço
- Salvar em `docs/conteudo/resultado/sticky-cta-variacoes.md`

## Regras

- Sticky some SEMPRE quando OfferCard está no viewport
- Urgência apenas se diagnóstico de fato expira (real)
- Nenhuma variação > 6 palavras no botão
- Output: documento .md APENAS — nunca código
