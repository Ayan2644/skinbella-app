# cro-criar-urgencia

```yaml
task:
  id: cro-criar-urgencia
  description: "Criar copy de urgência e escassez ético — apenas baseado em algo real"
  agent: cro-specialist
  squad: skinbella-resultado
  elicit: false
  inputs:
    required: []
    optional:
      - data/refs-persona.md
  output:
    path: docs/conteudo/resultado/urgencia-copy.md
    format: markdown
```

## Objetivo

Criar o copy de urgência e escassez para a ResultScreen — **apenas** baseado em elementos reais e documentados, nunca em gatilhos falsos.

## Steps

### Step 1: Mapear Fontes Legítimas de Urgência

Identificar o que é REAL no produto SKINBELLA:
- Diagnóstico expira? (tempo de sessão)
- Preço de lançamento? (período limitado)
- Estoque limitado? (apenas se real)
- Oferta personalizada expira? (se tecnicamente implementado)

Documentar apenas o que for confirmado como real.

### Step 2: Categorias de Urgência Ética

```
## Categoria A: Urgência de Diagnóstico
Base: diagnóstico expira em {X}h (se implementado)
Status: PENDENTE de confirmação técnica

## Categoria B: Urgência de Preço
Base: preço de lançamento / promoção por tempo
Status: PENDENTE de decisão de negócio
⚠️ Bloqueado pelo conflito R$19 vs R$29

## Categoria C: Urgência de Contexto
Base: "a cada dia sem protocolo, {problema continua}"
Status: ÉTICA — baseada em fisiologia real
Uso: copy de continuação, não de escassez

## Categoria D: Escassez de Personalização
Base: "este protocolo foi criado para o seu perfil hoje"
Status: ÉTICA — é real (diagnóstico é único por sessão)
```

### Step 3: Escrever Copy por Categoria

Para cada categoria válida:
```
### Copy de Urgência — {Categoria}

**Gatilho:** {o que cria a urgência}
**É real?** {SIM/NÃO/PENDENTE}

**Versão curta (sticky CTA):**
{texto}

**Versão média (OfferCard sub-copy):**
{texto}

**Versão completa (seção dedicada):**
{texto}

**Nota de uso:**
{onde e como usar este copy — contexto da página}
```

### Step 4: Copy de "Não Urgência" — Categoria C

A urgência mais ética é o custo da inação:
- "Sua pele vai continuar nesse ciclo sem intervenção funcional"
- "Cada mês é mais pigmentação acumulada"

Escrever 3-5 versões desta abordagem por perfil.

### Step 5: Regras de Uso

Documentar regras claras:
```
✅ PODE usar:
- Urgência baseada em dados técnicos reais
- Custo da inação (fisiológico, não emocional)
- Personalização "este diagnóstico é de hoje"

❌ NUNCA usar:
- "Últimas vagas" sem limite real
- "Oferta exclusiva" sem exclusividade real
- Contador regressivo que reinicia no reload
- "Só hoje" se o preço está disponível sempre
```

### Step 6: Salvar

- Documento com categorias de urgência
- Copy por categoria (apenas as válidas)
- Copy de custo da inação por perfil
- Regras de uso claras
- ⚠️ Notas de itens PENDENTES de decisão
- Salvar em `docs/conteudo/resultado/urgencia-copy.md`

## Regras

- Urgência FALSA é proibida — mesmo que converta mais no curto prazo
- Documentar SEMPRE a base real da urgência
- PENDENTE = não usar até confirmar
- Output: documento .md APENAS — nunca código
