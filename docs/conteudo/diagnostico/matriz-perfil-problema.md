# Matriz Perfil × Problema — Squad Diagnóstico Científico

> **Propósito:** Guia para o skinEngine v2 (Story 1.2) e para o Squad Copy & Resultado.
> Cada combinação de respostas do quiz mapeia para um diagnóstico específico com copy e recomendações únicos.

---

## 🧠 Lógica de Diagnóstico

O diagnóstico SKINBELLA é determinado por **3 dimensões primárias:**

1. **Problema principal** (objetivo + incomodos)
2. **Tipo de pele** (tipo_pele + oleosidade)
3. **Causa raiz** (lifestyle: sono, estresse, sol, açúcar, hormônios)

A interseção dessas 3 dimensões define o perfil. Existem **8 perfis primários** e variações internas.

---

## 📊 Os 8 Perfis Primários

---

### PERFIL 1 — Manchas & Dano Solar

**Trigger:**
- `objetivo = manchas` OU `incomodos` inclui `manchas`
- `sol = media` ou `alta`
- `protetor = nunca` ou `as_vezes`

**Diagnóstico clínico:**
Hiperpigmentação ativa por dano actínico cumulativo. O UV estimula melanócitos a produzirem melanina em excesso, resultando em manchas solares e melasma superficial. A ausência de protetor solar é o agravante principal.

**Nome do perfil (para copy):** "A Manchada pelo Sol"

**Causa raiz:** Dano oxidativo por UV + ausência de fotoproteção

**O que priorizar:**
- Fotoproteção imediata (protetor FPS 50+) — mudança comportamental #1
- Vitamina C tópica (inibe tirosinase) + Vitamina C oral (antioxidante UV)
- Niacinamida tópica (impede transferência de melanossomas)
- Licopeno oral (fotoproteção interna)
- Despigmentação progressiva (4-8 semanas de protocolo)

**Rotina manhã específica:**
1. Lavar rosto com sabonete suave (sem esfoliante — não estimular melanócitos)
2. SKINBELLA Sérum (Vitamina C primeiro — absorção máxima)
3. Hidratante leve
4. **Protetor solar FPS 50+ — obrigatório todo dia, até em casa**

**Rotina noite específica:**
1. Demaquilar + lavar rosto
2. SKINBELLA Sérum (Niacinamida age melhor à noite — sem UV)
3. Hidratante nutritivo
4. Rosa Mosqueta nas manchas (acção concentrada)

**Nutriente primário:** Vitamina C + Licopeno (Caps) + Vitamina C + Niacinamida (Sérum)

**Headline copy:** *"Suas manchas têm causa. E têm protocolo."*

---

### PERFIL 2 — Acne Hormonal

**Trigger:**
- `incomodos` inclui `acne`
- `acne_tipo = hormonal` (pergunta condicional)
- `ciclo_hormonal = irregular` ou `uso_hormonal`
- OU: `estresse = alto` + `incomodos` inclui `acne`

**Diagnóstico clínico:**
Acne de origem hormonal — o aumento de andrógenos (testosterona, DHT) estimula glândulas sebáceas a produzirem mais sebo. Mulheres com ciclo irregular têm picos de andrógenos mais intensos. Estresse crônico eleva cortisol, que estimula a produção de ACTH e andrógenos adrenais.

**Nome do perfil (para copy):** "A Acne da Fase Adulta"

**Causa raiz:** Desequilíbrio hormonal → excesso de sebo → P. acnes prolifera

**O que priorizar:**
- Zinco oral (inibe 5-alfa-redutase → menos DHT → menos sebo)
- Niacinamida tópica (regula sebo sem ressecar)
- Evitar laticínios e açúcar (agravam acne hormonal via IGF-1)
- Rotina leve — limpar sem agressão (a agressão piora)
- Vitamina B5 tópica (pantenol) para cicatrização de lesões

**Rotina manhã específica:**
1. Sabonete facial com ácido salicílico suave (desobstruir poros)
2. SKINBELLA Sérum (Niacinamida — regula sebo ao longo do dia)
3. Hidratante oil-free (não pular — pele desidratada compensa com mais sebo)
4. Protetor solar não-comedogênico

**Rotina noite específica:**
1. Dupla limpeza (óleo para remover protetor, sabonete para pele)
2. SKINBELLA Sérum (Rosa Mosqueta — cicatriza lesões de acne, não comedogênica)
3. Hidratante gel sem óleo

**Nutriente primário:** Zinco + Vitamina B5 (Caps) + Niacinamida + Rosa Mosqueta (Sérum)

**Dieta específica:**
- Priorizar: ômega-3 (anti-inflamatório), vegetais verde-escuros, chá de spearmint
- Reduzir: laticínios (IGF-1 estimula sebo), açúcar (glicação + inflamação), whey protein

**Headline copy:** *"Acne depois dos 25 não é falta de higiene. É hormônio. E tem protocolo."*

---

### PERFIL 3 — Pele Oleosa & Poros

**Trigger:**
- `tipo_pele = oleosa` ou `mista`
- `objetivo = oleosidade` ou `poros`
- `incomodos` inclui `poros`
- `acne_tipo != hormonal`

**Diagnóstico clínico:**
Hipersecreção sebácea por fatores genéticos e ambientais (calor, umidade, dieta pró-inflamatória). Poros dilatados são resultado de sebo acumulado que estica o poro mecânicamente. Limpeza excessiva piora o quadro (a pele compensa com mais sebo).

**Nome do perfil (para copy):** "A Pele que Brilha Demais"

**Causa raiz:** Hiperatividade das glândulas sebáceas

**Rotina específica:**
- Niacinamida 10% tópica (regulação mais estudada de sebo)
- Zinco oral (supressão androgênica do sebo)
- Limpeza gentil 2x/dia (não mais)
- Hidratação oil-free (pele oleosa TAMBÉM ressseca com produtos inadequados)

**Headline copy:** *"Poro dilatado não fecha com limpeza — regula com o ativo certo."*

---

### PERFIL 4 — Envelhecimento Precoce

**Trigger:**
- `offset >= 4` (skinAge - realAge ≥ 4 anos)
- `objetivo = vico` OU `incomodos` inclui `linhas`
- OU: combinação de `sol=alta` + `acucar=frequente` + `sono<5`

**Diagnóstico clínico:**
Envelhecimento acelerado por estresse oxidativo multifatorial. UV não-filtrado gera radicais livres que degradam colágeno (via MMP-1). Açúcar causa glicação — ligações cruzadas entre colágeno e glicose que o rigidificam e degradam. Privação de sono reduz GH (hormônio do crescimento) e IGF-1, comprometendo renovação celular.

**Nome do perfil (para copy):** "O Envelhecimento Precoce"

**Causa raiz:** Estresse oxidativo + glicação + déficit de renovação celular

**O que priorizar:**
- Colágeno hidrolisado (repor o que está sendo degradado)
- Vitamina C + E (escudo antioxidante duplo)
- Peptídeos Matrixyl (estimular produção endógena)
- Reduzir açúcar (a mudança de estilo de vida com maior impacto)
- Protetor solar (para o dano futuro)

**Nutriente primário:** Colágeno + Vitamina C + E + Resveratrol (Caps) + Peptídeos + Vitamina C (Sérum)

**Headline copy:** *"Você tem [X] anos. Sua pele aparenta [Y]. Vamos fechar essa diferença — em 20 dias."*

---

### PERFIL 5 — Pele Seca & Desidratada

**Trigger:**
- `tipo_pele = seca` OU `objetivo = ressecamento`
- `agua < 5`
- `hidratacao score < 55`

**Diagnóstico clínico:**
Barreira cutânea comprometida com perda transepidérmica de água (TEWL) acima do normal. A pele seca tem menos ceramidas na camada córnea, permitindo que a água evapore antes de hidratar as células. Pode ser genético ou adquirido (sabonetes agressivos, clima, desidratação sistêmica).

**Nome do perfil (para copy):** "A Pele com Sede"

**Causa raiz:** Barreira comprometida + desidratação sistêmica

**Nutriente primário:** Biotina + HA oral (Caps) + HA duplo + Glicerina + Pantenol (Sérum)

**Headline copy:** *"Sua pele perde água 3x mais rápido que o normal. O protocolo devolve a barreira."*

---

### PERFIL 6 — Pele Sensível & Reativa

**Trigger:**
- `tipo_pele = sensivel`
- `sensibilidade_gatilhos` (multi-chips)
- Score alto de sensibilidade

**Diagnóstico clínico:**
Hiper-reatividade neurossensorial da pele. Fibras C e A-delta hipersensíveis respondem a estímulos normais com inflamação desproporcional. A barreira é comprometida, permitindo penetração de irritantes.

**Nome do perfil (para copy):** "A Pele que Reage a Tudo"

**O que priorizar:**
- Protocolo minimalista (menos é mais)
- Alantoína e Pantenol (calmar)
- Rosa Mosqueta (regenerar sem irritar)
- Evitar álcool, perfume, ácidos fortes
- Introduzir ativos um de cada vez

**Headline copy:** *"Pele sensível não precisa de menos cuidado. Precisa do cuidado certo."*

---

### PERFIL 7 — Preventivo (Jovem, Boa Saúde)

**Trigger:**
- `idade < 28`
- `habitScore < 4` (bons hábitos)
- Sem queixa principal grave

**Diagnóstico clínico:**
Pele em bom estado com oportunidade de prevenção. O investimento em antioxidantes e fotoproteção agora evita tratamentos caros e agressivos no futuro. A "conta" do envelhecimento da pele é paga de uma vez ou parcelada — começar cedo é parcelar.

**Nome do perfil (para copy):** "A Prevenção Inteligente"

**Headline copy:** *"Sua pele está boa. O protocolo é pra continuar assim daqui a 10 anos."*

---

### PERFIL 8 — Estresse & Cortisol

**Trigger:**
- `estresse = alto`
- `sono < 5`
- Combinação de múltiplos problemas sem causa única clara

**Diagnóstico clínico:**
O cortisol crônico é um dos maiores destruidores da pele. Reduz a síntese de colágeno, aumenta a inflamação sistêmica, compromete a barreira cutânea e piora acne, manchas e envelhecimento simultaneamente. O estresse explica peles que "pioram sem motivo."

**Nome do perfil (para copy):** "A Pele do Estresse"

**Headline copy:** *"O cortisol está envelhecendo sua pele [X]x mais rápido. O protocolo começa por dentro."*

---

## 🔀 Regras de Prioridade (Quando há múltiplos perfis)

Quando a usuária se encaixa em mais de um perfil, usar esta hierarquia:

1. **Acne hormonal** (prioridade absoluta — mais específica)
2. **Manchas ativas** (impacto emocional mais alto)
3. **Envelhecimento precoce** (quando offset ≥ 5)
4. **Oleosidade/Poros** (quando tipo_pele = oleosa)
5. **Sensível** (condiciona toda a escolha de ativos)
6. **Seca** (afeta formulação)
7. **Preventivo** (apenas quando nenhum acima se aplica)
8. **Estresse** (como overlay — não substitui o primário)

---

## 📌 Como usar esta matriz

**Para o skinEngine v2 (@dev):**
Usar a coluna "Trigger" para definir a lógica de classificação de perfil no código.

**Para o Squad Copy & Resultado:**
Usar "Headline copy" e "Nome do perfil" como base para escrever todos os textos da ResultScreen.

**Para o Squad Quiz Experience:**
Usar a coluna "Causa raiz" para garantir que o quiz está coletando os dados necessários para identificar cada perfil.
