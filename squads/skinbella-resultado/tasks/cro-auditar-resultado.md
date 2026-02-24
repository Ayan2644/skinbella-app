# cro-auditar-resultado

```yaml
task:
  id: cro-auditar-resultado
  description: "Gap analysis da tela de resultado atual vs. estrutura ideal de conversão"
  agent: cro-specialist
  squad: skinbella-resultado
  elicit: false
  inputs:
    required: []
    optional:
      - data/refs-mapa-resultado.md
  output:
    path: docs/conteudo/resultado/auditoria-resultado.md
    format: markdown
```

## Objetivo

Fazer o gap analysis completo da ResultScreen atual comparando com a estrutura ideal de conversão — identificando o que falta, o que está desalinhado e o que deve ser criado.

## Steps

### Step 1: Documentar Estado Atual

Listar o que está implementado atualmente:
```
## Estado Atual da ResultScreen

| Seção | Existe? | Personalizada? | Copy? | Status |
|-------|---------|---------------|-------|--------|
| HeroResult | {SIM/NÃO} | {SIM/NÃO} | {SIM/NÃO} | {descrição} |
| MeaningCard | ... | ... | ... | ... |
...
```

### Step 2: Estrutura Ideal

Documentar a estrutura ideal de alta conversão:
1. HeroResult com diagnóstico personalizado por perfil
2. MeaningCard com validação emocional
3. ProjectionCard com linha do tempo
4. NutrientCards com "por que para você"
5. LockedReportCard com itens bloqueados
6. OfferCard com preço e CTA principal
7. Testimonials por perfil
8. MiniFAQ de objeções
9. Sticky CTA (componente persistente)

### Step 3: Gap Analysis por Seção

```
## Gap Analysis

### HeroResult
**Atual:** {descrição do estado atual}
**Ideal:** {descrição do estado ideal}
**Gaps:**
- [ ] Personalização por perfil ausente
- [ ] Score do diagnóstico não exibido
- [ ] Frase de identificação genérica

**Prioridade:** {alta | média | baixa}
**Complexidade de Copy:** {alta | média | baixa}
**Bloqueadores:** {o que impede avançar}
```

### Step 4: Score de Maturidade

Pontuar a ResultScreen atual em 5 dimensões:
- **Personalização:** {0-10}
- **Persuasão científica:** {0-10}
- **Fluxo de conversão:** {0-10}
- **Prova social:** {0-10}
- **Gestão de objeções:** {0-10}

**Score total:** {X}/50
**Interpretação:** {análise do score}

### Step 5: Roadmap de Melhorias

Priorizar as melhorias por impacto × esforço:
```
## Roadmap

### Quick Wins (alta prioridade, baixo esforço)
1. {melhoria}
2. {melhoria}

### Médio Prazo (alta prioridade, médio esforço)
1. {melhoria}

### Longo Prazo (estrutural)
1. {melhoria}
```

### Step 6: Alertas e Bloqueadores

Documentar o que bloqueia progresso:
- ⚠️ **CRÍTICO:** Preço R$19 vs R$29 — decisão ANTES de qualquer validação de copy de oferta
- ⚠️ **IMPORTANTE:** Diagnóstico de expiração — confirmar se existe tecnicamente
- Outros bloqueadores identificados

### Step 7: Salvar

- Documento com estado atual documentado
- Gap analysis por seção
- Score de maturidade
- Roadmap priorizado
- Alertas e bloqueadores
- Salvar em `docs/conteudo/resultado/auditoria-resultado.md`

## Regras

- Gap analysis é honesto — sem minimizar problemas
- Cada gap tem prioridade e estimativa de esforço
- Bloqueadores identificados imediatamente
- Output: documento .md APENAS — nunca código
