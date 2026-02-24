# SKINBELLA — Estratégia de Squads & Copy

> **Documento:** Visão estratégica da estrutura de squads para desenvolvimento profissional do produto
> **Data:** 2026-02-24
> **Premissa:** Content-first. O conteúdo define o produto — o código implementa o conteúdo.

---

## 🏗️ Visão Geral da Estrutura

```
CAMADA 1 — CIÊNCIA & CONTEÚDO (Fundação)
├── Squad Diagnóstico Científico     ← BASE DE TUDO
└── Squad Copy & Resultado

CAMADA 2 — EXPERIÊNCIA DO PRODUTO
├── Squad Quiz Experience
├── Squad Resultado & Conversão
└── Squad Hub Interno

CAMADA 3 — NEGÓCIO
├── Squad Funil & Ofertas
└── Squad Performance & Analytics

CAMADA 4 — TECNOLOGIA
└── Squad Tech & Integrações
```

**Regra de ouro:** Nenhum squad de camada superior começa sem o output da camada inferior estar pronto.

---

## CAMADA 1 — CIÊNCIA & CONTEÚDO

---

### 🔬 Squad Diagnóstico Científico

**Missão:** Definir o conhecimento científico que fundamenta TODAS as recomendações do produto.

**Persona do squad:** Nutricionista funcional + Dermatologista clínica

**Por que começar aqui:**
O skinEngine v2 precisa de conteúdo real para funcionar. Sem esse squad, o motor de personalização vai gerar textos genéricos com cara de personalizados. É a diferença entre uma usuária que pensa "esse diagnóstico é exatamente o meu caso" e uma que pensa "é a mesma coisa de qualquer app."

**Output principal:**

```
docs/conteudo/diagnostico/
├── matriz-perfil-problema.md         ← Qual combinação de respostas → qual diagnóstico
├── matriz-substancia-problema.md     ← Qual substância resolve qual problema (já criada)
├── rotinas-por-perfil.md             ← Rotina manhã/noite específica por tipo de pele + problema
├── nutrientes-por-perfil.md          ← Qual nutriente para qual perfil (com justificativa)
├── dieta-por-perfil.md               ← Alimentos priorizar/reduzir por problema
└── frases-diagnostico.md             ← Biblioteca de frases clínicas para o resultado
```

**Tasks do squad:**

- [ ] `*criar-matriz-perfil-problema` — mapear combinações possíveis de respostas do quiz → diagnóstico
- [ ] `*criar-rotinas-personalizadas` — rotina manhã/noite para cada tipo de pele × problema
- [ ] `*criar-recomendacoes-nutrientes` — qual nutriente para qual perfil (usando substancias-caps.md + substancias-serum.md)
- [ ] `*validar-claims-cientificos` — verificar se as afirmações têm base científica defensável
- [ ] `*criar-biblioteca-frases` — frases para o resultado como "Sua pele com acne hormonal responde a..."

---

### ✍️ Squad Copy & Resultado

**Missão:** Escrever todos os textos do resultado do quiz — personalizados por perfil — antes de qualquer linha de código.

**Persona do squad:** Copywriter de direct response especializado em saúde/beleza

**Por que antes do dev:**
O ResultScreen hoje tem textos hardcoded para 2 perfis (skinAge > 30 ou não). Com a copy pronta para 8–12 perfis distintos, o dev só implementa a lógica de seleção — não inventa textos.

**Output principal:**

```
docs/conteudo/copy-resultado/
├── hero-por-perfil.md                ← Título principal do resultado por perfil
├── significado-por-perfil.md         ← Seção "O que isso significa" por perfil
├── projecao-por-perfil.md            ← "Com o protocolo, você pode..."
├── nutrientes-copy.md                ← Copy de cada nutriente recomendado
├── cta-variações.md                  ← Variações de CTA para A/B test
└── copy-quiz-perguntas.md            ← Textos das perguntas (reescritas com foco em conversão)
```

**Perfis a criar copy:**

| Perfil | Trigger no quiz | Headline do resultado |
|---|---|---|
| Manchas + Sol | objetivo=manchas, sol=alta | "Suas manchas têm causa — e tratamento" |
| Acne Hormonal | incomodos=acne, ciclo_hormonal=irregular | "Acne na fase adulta: o problema não é a pele" |
| Pele Seca + Idade | tipo_pele=seca, idade>35 | "Sua pele perdeu água e colágeno — vamos devolver" |
| Oleosa + Poros | tipo_pele=oleosa, objetivo=poros | "Poro dilatado não é falta de higiene" |
| Envelhecimento Precoce | offset>4 | "Você tem X anos. Sua pele aparenta Y. Vamos fechar essa diferença." |
| Pele Sensível | tipo_pele=sensivel | "Pele reativa pede protocolo delicado. Temos o certo." |
| Preventivo | idade<28, habitScore<4 | "Você está cuidando cedo. Isso muda tudo." |
| Estresse + Cansaço | estresse=alto, sono<5 | "O cortisol está envelhecendo sua pele 3x mais rápido" |

**Tasks do squad:**

- [ ] `*escrever-hero-resultado` — headline + subtítulo de cada perfil
- [ ] `*escrever-significado` — o que o diagnóstico significa por perfil (seção MeaningCard)
- [ ] `*escrever-projecao` — o que o protocolo vai fazer pelo perfil específico
- [ ] `*escrever-nutrientes-copy` — copy de cada nutriente (o "porque" + "o que sente") por perfil
- [ ] `*escrever-ctas` — variações de CTA para teste A/B

---

## CAMADA 2 — EXPERIÊNCIA DO PRODUTO

---

### 🧪 Squad Quiz Experience

**Missão:** Otimizar o quiz para máxima taxa de conclusão e qualidade de dados coletados.

**Persona do squad:** UX Writer + Especialista em quiz de conversão

**Output principal:**

```
docs/conteudo/quiz/
├── perguntas-v2.md                   ← Todas as 14+3 perguntas com copy otimizada
├── branching-logic.md                ← Documento de lógica de branching (input p/ dev)
├── micro-textos.md                   ← Botões, tooltips, textos de loading
└── copy-processamento.md             ← Mensagens da tela de processamento (7s)
```

**Benchmarks a analisar:**
- Taxa de abandono por pergunta (onde as usuárias saem?)
- Pergunta da selfie — gera atrito? deve ser opcional?
- Ordem das perguntas — a emoção cresce ou cai?

**Tasks do squad:**

- [ ] `*auditar-perguntas-atuais` — revisar cada pergunta com olhar de conversão
- [ ] `*reescrever-perguntas` — copy nova com tom de voz SKINBELLA
- [ ] `*mapear-branching` — definir exatamente quais respostas disparam quais perguntas extras
- [ ] `*otimizar-processamento` — reescrever as 5 mensagens dos 7 segundos de loading

---

### 🖥️ Squad Resultado & Conversão

**Missão:** Otimizar a tela de resultado para máxima conversão — da visualização do diagnóstico ao clique no CTA.

**Persona do squad:** Growth Hacker + CRO Specialist

**Output principal:**

```
docs/conteudo/resultado/
├── mapa-resultado.md                 ← Estrutura de cada seção + objetivo de conversão
├── oferta-copy.md                    ← Texto da seção de oferta (OfferCard)
├── provas-sociais.md                 ← Depoimentos refinados por perfil
├── faq-resultado.md                  ← FAQ otimizado para quebrar objeções
└── sticky-cta-variações.md           ← Variações do sticky CTA para A/B
```

**Hipóteses de melhoria a validar:**

| Hipótese | Seção afetada | Métrica |
|---|---|---|
| Mostrar scores numéricos aumenta engajamento | HeroResult | Scroll depth |
| Depoimento por perfil específico aumenta conversão | Testimonials | Clique no CTA |
| Projeção com gráfico de progresso aumenta urgência | ProjectionCard | Conv. rate |
| CTA "Começar protocolo" > "Desbloquear" | OfferCard / sticky | Conv. rate |

---

### 📱 Squad Hub Interno

**Missão:** Desenhar a experiência pós-compra — o que a usuária vê e faz todo dia dentro do app.

**Persona do squad:** Product Designer + Especialista em retenção/gamificação

**Output principal:**

```
docs/conteudo/hub/
├── copy-dashboard.md                 ← Textos do Today, streak, check-in
├── rotina-copy.md                    ← Copy das etapas da rotina manhã/noite
├── nutrientes-cards.md               ← Copy dos cards de nutrientes
├── gamificacao.md                    ← Sistema de streak, badges, milestones
└── notificacoes.md                   ← Push notifications (mensagens de retenção)
```

---

## CAMADA 3 — NEGÓCIO

---

### 💰 Squad Funil & Ofertas

**Missão:** Otimizar toda a estratégia de preço, oferta e conversão do funil.

**Output principal:**

```
docs/negocio/
├── estrategia-preco.md               ← Definição de planos, preços, promoções
├── copy-oferta-principal.md          ← Copy da oferta na tela de resultado
├── upsell-caps-serum.md              ← Estratégia de venda dos produtos físicos
├── copy-kiwify.md                    ← Textos da página de checkout (Kiwify)
└── email-sequencia.md                ← Sequência de e-mails pós-cadastro
```

**Questões a resolver:**

1. O preço final é R$19 (ESSENCIAL.md) ou R$29 (OfferCard.tsx)? → **Definir agora antes de lançar**
2. Caps e Sérum são upsell ou incluso no plano?
3. Qual o gatilho de oferta do produto físico? (Após X dias? Por perfil?)

---

### 📊 Squad Performance & Analytics

**Missão:** Definir o que medir, como medir e o que fazer com os dados.

**Output principal:**

```
docs/metricas/
├── kpis-definidos.md                 ← KPIs do funil, metas por etapa
├── eventos-a-trackear.md             ← Eventos do app para analytics
└── hipoteses-ab.md                   ← Hipóteses de A/B test priorizadas
```

---

## CAMADA 4 — TECNOLOGIA

---

### ⚙️ Squad Tech & Integrações

**Missão:** Implementar o backend, integração Kiwify e Supabase.

> **Aguarda:** Output de todos os squads de camada 1-3 antes de começar.

---

## 🚀 Ordem de Execução Recomendada

```
SEMANA 1-2:
  [X] Documentos de base (substâncias, persona, tom de voz) ← FEITO AGORA
  [ ] Squad Diagnóstico Científico → criar matrizes e biblioteca de frases
  [ ] Definir preço final (R$19 vs R$29) → Squad Funil

SEMANA 3-4:
  [ ] Squad Copy & Resultado → escrever copy dos 8 perfis
  [ ] Squad Quiz Experience → reescrever perguntas v2
  [ ] Definir estratégia de upsell Caps/Sérum

SEMANA 5-6:
  [ ] @dev implementa skinEngine v2 (Story 1.2) com conteúdo real dos squads
  [ ] @dev implementa ResultScreen personalizada (Story 1.3)
  [ ] Squad Hub → copy do dashboard

SEMANA 7-8:
  [ ] Squad Funil → copy do Kiwify, email sequência
  [ ] Squad Tech → integração Supabase + Kiwify
  [ ] Testes finais e lançamento
```

---

## 📋 Próximos Comandos Sugeridos

Para executar cada squad, ativar o agente correspondente:

```
# Para criar as matrizes científicas:
@squad-diagnostico *criar-matriz-perfil-problema

# Para escrever a copy do resultado:
@squad-copy *escrever-hero-resultado

# Para otimizar o quiz:
@squad-quiz *auditar-perguntas-atuais
```

---

*Este documento é vivo — atualizar à medida que os squads entregam seus outputs.*
