# Plano Estratégico — Alinhamento App × Produtos SkinBella
> Criado por: Orion (AIOS Master) + @analyst + @pm
> Data: 2026-03-01 | Status: **Pronto para implementação**

---

## 1. Síntese dos Produtos

### SkinBella Sérum (Uso tópico)
**8 ativos reais:**
| Ativo | Concentração | Principal Benefício |
|-------|-------------|-------------------|
| Vitamina C Estabilizada | 10% | Manchas, luminosidade, antioxidante |
| Ácido Hialurônico Duplo PM | — | Hidratação superficial + profunda |
| Niacinamida | 10% | Poros, oleosidade, barreia, manchas |
| Peptídeos Matrixyl 3000 | — | Anti-envelhecimento, colágeno endógeno |
| Rosa Mosqueta | 5% | Renovação celular, sensível, cicatrizes |
| Vitamina E | 1% | Antioxidante, potencializa Vitamina C |
| Glicerina + Pantenol | 5% + 2% | Hidratação imediata, conforto sensorial |
| Alantoína | 0,5% | Calmante, seguro para todos os tipos |

**Indicação por score baixo:**
- Manchas < 70 → Vitamina C + Niacinamida
- Oleosidade desregulada → Niacinamida
- Elasticidade < 65 → Peptídeos Matrixyl
- Hidratação < 65 → Ácido Hialurônico duplo
- Textura < 70 → Rosa Mosqueta + Niacinamida
- Pele sensível → Rosa Mosqueta + Alantoína

### SkinBella Caps (Suplemento oral)
**8 ativos reais:**
| Ativo | Principal Benefício |
|-------|-------------------|
| Colágeno Hidrolisado | Firmeza, elasticidade, textura |
| Vitamina C | Síntese de colágeno, manchas, antioxidante |
| Biotina (B7) | Barreira cutânea, pele seca, cabelo/unhas |
| Zinco | Oleosidade, acne, cicatrização, anti-inflamatório |
| Ácido Hialurônico oral | Hidratação profunda interna, volume dérmico |
| Vitamina E | Proteção antioxidante, sinergia com Vitamina C |
| Licopeno | Fotoproteção interna, manchas solares |
| Silício Orgânico | Firmeza, elastina, matriz extracelular |

**Indicação por perfil:**
- Elasticidade < 65 → Colágeno + Silício Orgânico
- Acne / Oleosa → Zinco + Biotina
- Manchas solares → Vitamina C + Licopeno
- Pele seca/desidratada → Colágeno + HA oral + Biotina
- Alta exposição solar → Licopeno + Vitamina E
- skinAge > realAge + 4 → Colágeno + Silício + Peptídeos

---

## 2. Persona (Marina) — O que o app precisa comunicar

**Ela sente:**
- "Não sei o que minha pele realmente precisa"
- "Já gastei dinheiro com coisa que não funcionou"
- "Quero resultado visível, não promessa vaga"

**O app precisa entregar:**
- **Diagnóstico claro** → "Sua pele precisa de X, Y, Z — aqui está a razão científica"
- **Protocolo simples** → "Faça isso toda manhã + toda noite. São 5 minutos."
- **Resultado tangível** → Número concreto (idade da pele), barra de progresso, streak
- **Produto natural** → Não forçar venda — mostrar que os produtos TÊM os ingredientes que o diagnóstico identificou

**Vocabulário a usar (da persona):**
- "manchinha", "pele oleosa", "pele cansada", "antes e depois"
- "protocolo", "rotina de cuidados", "resultado real"
- "sua pele precisa de", "o ativo que resolve"
- **Evitar:** "melanogênese", "glicação avançada", "matriz extracelular"

---

## 3. Diagnóstico — Gaps Críticos do App Atual

### 3.1 skinEngine.ts — PROBLEMA GRAVE
**Estado atual:** `nutrientesTop4` é estático — os mesmos 4 nutrientes para TODOS os perfis
**Impacto:** A personalização principal do app não existe de verdade

**Nutrientes atuais (fixos):**
- Vitamina C
- Colágeno Hidrolisado
- Ácido Hialurônico
- Niacinamida

**Deveria ser:** Selecionados dinamicamente pelos scores e respostas do quiz

### 3.2 Ingredientes errados nos produtos
**Estado atual:** Products.tsx mostra ingredientes inventados (Vitamina D3, K2)
**Estado atual:** Report.tsx mostra ingredientes não reais do produto

**Deveria ser:** Ingredientes exatos das fichas técnicas dos produtos

### 3.3 Rotina não menciona os produtos
**Estado atual:** Passos como "Aplicar sérum de vitamina C" sem mencionar SkinBella Sérum
**Deveria ser:** "Aplicar SkinBella Sérum (vitamina C + niacinamida)" — natural, não forçado

### 3.4 Dieta não conecta aos Caps
**Estado atual:** Dieta genérica sem conexão com os ativos do Caps
**Deveria ser:** "Priorize alimentos ricos em colágeno — complementados pelo SkinBella Caps"

### 3.5 Linguagem técnica demais ou genérica demais
**Estado atual:** "Neutraliza radicais livres" (técnico), "Produto recomendado: SkinBella Sérum" (genérico)
**Deveria ser:** Linguagem de amiga especialista + conexão emocional com a dor da Marina

---

## 4. Plano de Mudanças por Camada

### 🔴 CAMADA 1 — skinEngine.ts (Fundação — máxima prioridade)

**Mudança:** Tornar `nutrientesTop4` dinâmico por perfil

```
Lógica de seleção dos nutrientes (por scores e respostas):

Pool de nutrientes disponíveis (mapeados aos produtos reais):

SÉRUM:
  - Vitamina C Estabilizada   → ativa se manchas < 70 OU sol: alta/media
  - Niacinamida 10%          → ativa se oleosidade irregular OU poros < 70 OU manchas < 70
  - Peptídeos Matrixyl       → ativa se elasticidade < 70 OU skinAge > realAge + 4
  - Ácido Hialurônico Duplo  → ativa se hidratacao < 70 OU pele_seca
  - Rosa Mosqueta            → ativa se sensível OU acne pós-inflamatória OU textura < 65

CAPS:
  - Colágeno Hidrolisado     → ativa se elasticidade < 75 OU textura < 70
  - Zinco                    → ativa se acne OU oleosa OU incomodos inclui acne/cravos
  - Biotina                  → ativa se pele_seca OU hidratacao < 60
  - Licopeno                 → ativa se sol: alta/media E protetor: nunca/as_vezes

Algoritmo: calcular score de urgência por nutriente → selecionar top 4 (mix Sérum+Caps)
```

**Mudança:** `dieta` também personalizada por perfil de pele
```
Perfil oleosa/acne → priorizar: zinco (abóbora, sementes), ômega-3 anti-inflamatório
Perfil manchas → priorizar: vitamina C natural, licopeno (tomate), antioxidantes
Perfil envelhecimento → priorizar: colágeno alimentar (caldo de osso), silício (algas)
Perfil ressecamento → priorizar: ácidos graxos (abacate, azeite), água, biotina
```

**Mudança:** `rotina` menciona produto de forma natural
```
Manhã:
  - "Lavar o rosto com sabonete suave"
  - "Aplicar SkinBella Sérum (3–4 gotas, pressionar suavemente)" ← PRODUTO
  - "Aguardar 60s para absorção"
  - "Aplicar hidratante leve"
  - "Protetor solar FPS 50+ (obrigatório com Vitamina C)"

Noite:
  - "Remover maquiagem com demaquilante"
  - "Lavar o rosto"
  - "Aplicar SkinBella Sérum nas áreas de maior preocupação" ← PRODUTO
  - "Finalizar com hidratante nutritivo"
```

---

### 🟡 CAMADA 2 — Nutrientes (linguagem + produtos corretos)

**Mudança:** Cada nutriente tem:
- Nome acessível (não só o nome técnico)
- "Por que SUA pele precisa" (conectado ao score/perfil)
- Ação conectada ao produto real
- `recomendacao` correto (Sérum ou Caps) baseado na ficha técnica

**Exemplos de texto corrigido:**
```
Atual: "Vitamina C (Antioxidante) — Neutraliza radicais livres e uniformiza o tom da pele."
Novo:  "Vitamina C — O ativo que apaga manchas e devolve o brilho que o sol roubou."
       "Sua pele tem score X de manchas — a Vitamina C é o primeiro passo para reverter."
       Produto: SkinBella Sérum (contém L-Ascorbil Glucosídeo 10% estabilizado)

Atual: "Colágeno Hidrolisado — Sustenta a firmeza e elasticidade da pele."
Novo:  "Colágeno Hidrolisado — Sua pele perde 1% de colágeno por ano. Reposição oral é o único jeito de agir de dentro."
       "Seu score de Elasticidade está em X — o colágeno é prioridade."
       Produto: SkinBella Caps (2500mg por dose)
```

---

### 🟡 CAMADA 2 — Relatório (age gap + produtos corretos)

**Mudança:** Seção de substâncias usa os 8 ativos reais de cada produto
**Mudança:** Ingredientes destacados usam o vocabulário e argumentos dos docs de produto
**Mudança:** Cards dos produtos com ingredientes corretos (sem Vitamina D3+K2 que não está nas Caps)

**Caps ingredientes corretos:** Colágeno, Vitamina C, Biotina, Zinco, Ácido Hialurônico, Vitamina E, Licopeno, Silício Orgânico

**Sérum ingredientes corretos:** Vitamina C Estabilizada, Ácido Hialurônico Duplo, Niacinamida, Peptídeos Matrixyl, Rosa Mosqueta, Vitamina E, Glicerina+Pantenol, Alantoína

---

### 🟡 CAMADA 2 — Produtos (texto alinhado)

**Mudança:** Texto de cada produto usa os argumentos de venda dos docs
**Mudança:** "Como usar" alinhado com o protocolo real da ficha técnica
**Mudança:** Matchedingredients usa os 8 ativos reais de cada produto

---

### 🟢 CAMADA 3 — Rotina (steps com produto)

**Mudança:** Passos da manhã incluem naturalmente o SkinBella Sérum
**Mudança:** Tom mais pessoal ("Seu sérum de alta performance") não só "sérum de vitamina C"

---

### 🟢 CAMADA 3 — Dieta (conexão com Caps)

**Mudança:** Dieta personalizada por perfil (não fixa)
**Mudança:** Dica final menciona que o SkinBella Caps complementa os nutrientes da dieta

---

### 🟢 CAMADA 3 — Linguagem global

**Regras de tom para todo o app:**
- Usar "sua pele" e "seu perfil" — não genérico
- Conectar cada recomendação a um score específico: "Seu score de Manchas está em X%"
- CTAs de produto sempre no contexto do benefício: "O Sérum contém os ativos que seu diagnóstico identificou"
- Nunca prometer milagre — usar "em 20–60 dias de uso consistente"
- Linguagem de amiga que entende: "o ativo que resolve isso", "vale a pena usar"

---

## 5. Ordem de Implementação

### Sprint 1 — skinEngine v2 (base de tudo)
1. `src/lib/skinEngine.ts` — nutrientesTop4 dinâmico
2. `src/lib/skinEngine.ts` — rotina com SkinBella Sérum
3. `src/lib/skinEngine.ts` — dieta personalizada por perfil

### Sprint 2 — Textos e ingredientes
4. `src/pages/app/Nutrients.tsx` — textos alinhados ao produto
5. `src/pages/app/Products.tsx` — ingredientes corretos + textos dos docs
6. `src/pages/app/Report.tsx` — ingredientes corretos nos cards de produto

### Sprint 3 — Refinamento
7. `src/pages/app/Routine.tsx` — step "SkinBella Sérum" na rotina
8. `src/pages/app/Diet.tsx` — dica de complemento com Caps
9. Revisão geral de tom de voz

---

## 6. Métricas de Sucesso

- **Conversão indireta:** % de usuárias que clicam no CTA de produto após usar o app 7+ dias
- **Engajamento:** Streak médio (indica que a rotina com o produto está sendo mantida)
- **Relevância:** As 4 substâncias recomendadas variam por perfil (não são sempre as mesmas 4)

---

## 7. O que NÃO fazer

- ❌ Não criar seções "compre agora" agressivas — o produto se vende pela relevância do diagnóstico
- ❌ Não mencionar preço no app (a compra acontece fora do app)
- ❌ Não usar ingredientes que não estão na fórmula real
- ❌ Não prometer resultados específicos com data fixa
- ❌ Não usar jargão técnico sem explicação acessível

---

*Plano criado com base em: substancias-serum.md, substancias-caps.md, por-que-skinbella.md, diferenciais-vs-competidores.md, persona.md, ESSENCIAL.md*
