# copywriter-escrever-cta

```yaml
task:
  id: copywriter-escrever-cta
  description: "Escrever variações de CTA para A/B testing — principal, sticky e secundário"
  agent: copywriter
  squad: skinbella-copy
  elicit: false
  inputs:
    required:
      - data/refs-persona.md
      - data/refs-tom-de-voz.md
      - data/refs-matriz-perfil.md
    optional: []
  output:
    path: docs/conteudo/copy-resultado/cta-variacoes.md
    format: markdown
```

## Objetivo

Criar todas as variações de CTA para A/B testing — CTA principal do OfferCard, Sticky CTA, CTA secundário de engajamento e exit-intent — com hipóteses testáveis para cada.

## Steps

### Step 1: Mapear Contextos de CTA

Identificar todos os pontos de CTA na ResultScreen:
1. CTA Principal (OfferCard)
2. Sticky CTA (fixed bottom)
3. CTA Secundário ("ver mais detalhes")
4. Exit Intent CTA

### Step 2: Escrever CTA Principal (variações A/B)

Para o CTA principal, criar 5 variações:
```
### CTA Principal

| Variação | Texto | Hipótese |
|---------|-------|----------|
| A (controle) | "Quero meu protocolo personalizado" | baseline |
| B | "Começar meu protocolo agora" | ação imediata vs. posse |
| C | "Ver meu protocolo completo" | curiosidade vs. posse |
| D | "Sim, quero começar" | confirmação vs. proposta |
| E (personalizado) | "{por perfil}" | personalização vs. genérico |
```

**Variação E — por perfil:**
| Perfil | CTA |
|--------|-----|
| Manchas | "Começar a clarear minha pele" |
| Acne Hormonal | "Começar meu protocolo anti-acne" |
| ... | ... |

### Step 3: Escrever Sticky CTA

4 variações para o sticky:
- Variação curta (máx 5 palavras)
- Variação com urgência ética
- Variação personalizada por perfil
- Variação com benefício explícito

### Step 4: CTA Secundário

Para quem não comprou ainda:
- "Entender meu diagnóstico completo"
- "Ver como funciona o protocolo"
- Link para FAQ

### Step 5: Exit Intent

3 variações para quando a usuária vai sair:
- Resgatar diagnóstico (urgência real)
- Oferta de conteúdo gratuito
- "Salvar meu resultado"

### Step 6: Formatar com Hipóteses A/B

Para cada variação, incluir:
- Hipótese de por que converte melhor
- Métrica de sucesso
- Critério de winner

## Regras

- Urgência APENAS se baseada em algo real (ex: diagnóstico expira)
- Nenhuma variação usa "última chance" sem base real
- CTA personalizado requer dado real do diagnóstico
- Output: documento .md APENAS — nunca código
