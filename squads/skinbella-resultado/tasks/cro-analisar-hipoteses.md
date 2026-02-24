# cro-analisar-hipoteses

```yaml
task:
  id: cro-analisar-hipoteses
  description: "Priorizar e documentar hipóteses de A/B test por impacto esperado"
  agent: cro-specialist
  squad: skinbella-resultado
  elicit: false
  inputs:
    required: []
    optional:
      - data/refs-mapa-resultado.md
      - data/refs-cta-variacoes.md
  output:
    path: docs/conteudo/resultado/hipoteses-ab.md
    format: markdown
```

## Objetivo

Documentar e priorizar todas as hipóteses de A/B test para a ResultScreen, com variação A, variação B, métrica, critério de winner e impacto estimado.

## Steps

### Step 1: Levantar Hipóteses por Seção

Para cada seção da ResultScreen, identificar o que pode ser testado:
- Headline (texto vs. texto)
- CTA (texto vs. texto)
- Ordem das seções
- Urgência (com vs. sem)
- Personalização (genérico vs. por perfil)
- Social proof (posição: antes vs. depois do OfferCard)

### Step 2: Estrutura de Hipótese

Para cada hipótese:
```
## Hipótese {N}: {nome descritivo}

**Seção:** {onde fica na ResultScreen}
**Tipo:** [copy | layout | ordem | elemento]
**Impacto Estimado:** [alto | médio | baixo]
**Esforço de Implementação:** [alto | médio | baixo]
**Prioridade:** {impacto/esforço}

### Hipótese
"Acreditamos que {mudança} vai {resultado esperado} porque {razão}."

### Variação A (Controle)
{estado atual}

### Variação B (Teste)
{mudança proposta}

### Métrica Primária
{o que medir — ex: taxa de clique no CTA}

### Critério de Winner
+{X}% conversão com p<0.05, n≥{N}/variação

### Pré-condição
{o que precisa estar implementado antes de testar}
```

### Step 3: Priorizar por Matriz ICE

**ICE Score:** Impact × Confidence × Ease (1-10 cada)

```
| Hipótese | Impact | Confidence | Ease | ICE | Prioridade |
|---------|--------|-----------|------|-----|-----------|
| CTA personalizado | 8 | 7 | 6 | 336 | 1 |
| Testimonials por perfil | 7 | 8 | 5 | 280 | 2 |
...
```

### Step 4: Roadmap de Testes

Organizar testes em fases:
- **Fase 1 (Quick wins):** ICE alto, baixo esforço
- **Fase 2 (Médio prazo):** ICE médio, esforço médio
- **Fase 3 (Estrutural):** Alto impacto, alto esforço

### Step 5: Requisitos por Hipótese

Para cada teste, documentar:
- Amostra mínima necessária
- Duração estimada do teste
- Pré-condições técnicas
- Dependências de copy

### Step 6: Salvar

- Documento com todas as hipóteses priorizadas
- Matriz ICE
- Roadmap de testes em 3 fases
- ⚠️ Nota: preço R$19 vs R$29 deve ser resolvido antes de testar copy de oferta
- Salvar em `docs/conteudo/resultado/hipoteses-ab.md`

## Regras

- Cada hipótese tem: variação A, variação B, métrica, critério
- Amostra mínima calculada antes de propor o teste
- Nunca declarar winner antes de p<0.05
- Output: documento .md APENAS — nunca código
