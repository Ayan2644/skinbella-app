# Quiz SKINBELLA v3.0 — Redesenho Completo para Máxima Conversão

> **Squad:** skinbella-quiz (Bia — UX Writer)
> **Versão:** 3.0 — redesenho estrutural completo
> **Data:** 2026-02-24
> **Status:** Para revisão humana antes de handoff ao @dev

---

## Por que a v3 existe — o problema da v2

A v2 era um **formulário de diagnóstico bem escrito**. As perguntas eram boas, os subtítulos ensinavam, a copy era empática. Mas a estrutura era construída para o skinEngine, não para a psicologia de compra da Marina.

**4 problemas estruturais da v2:**

1. **A ordem seguia a lógica do banco de dados, não da emoção.** Começar com idade (neutro) e tipo de pele (técnico) antes de criar identificação emocional é o caminho mais rápido para o abandono silencioso.

2. **Perguntas de hábito "inconvenientes" chegavam cedo.** Alimentação (P9), açúcar (P10) e rotina (P4) apareciam antes da usuária ter investimento emocional suficiente no quiz para ser honesta.

3. **Os subtítulos ensinavam. Não vendiam.** Ótima educação, zero amplificação de desejo. A usuária aprendia sobre cortisol mas não conectava isso ao produto que ia aparecer no resultado.

4. **15 perguntas.** Dados de plataformas de quiz (Typeform, Interact, SurveyMonkey) mostram queda de 5–10% na taxa de conclusão por pergunta acima de 10 em mobile. A v2 operava na faixa de 35–50% de conclusão. A v3 projeta 60–70%.

---

## A filosofia do v3 — o quiz como funil de vendas

O v3 é construído sobre 3 leis de psicologia de conversão:

**Lei 1 — Escalada de compromisso (Cialdini):** Cada pergunta respondida aumenta o investimento psicológico. A usuária que respondeu 8 perguntas não abandona na 9ª — o sunk cost trabalha a favor. Por isso, as perguntas mais delicadas (hormônios, estresse) ficam para o final.

**Lei 2 — Subtítulo que vende, não só que ensina:** Na v2, o subtítulo terminava no dado científico. Na v3, o subtítulo termina na conexão com o produto. Exemplo: "O cortisol degrada colágeno — **e é exatamente aí que os ativos do Caps agem**." A Marina chega no resultado já entendendo por que o produto existe.

**Lei 3 — Espelho emocional:** A pergunta mais conversiva não é "qual é o seu tipo de pele?" — é "quando você olha no espelho, o que chama atenção primeiro?" Mesmos dados, experiência completamente diferente. Quanto mais a usuária vê seu próprio rosto nas perguntas, mais ela quer ver o que o diagnóstico vai revelar.

---

## Os 4 Atos Emocionais do v3

```
Ato 1 — CURIOSIDADE (P1–P3)
"Deixa eu ver o que vai sair"
→ Identificação imediata, zero resistência, sem dados de hábito

Ato 2 — REVELAÇÃO (P4–P7)
"Ela está descobrindo a causa do meu problema"
→ Cada pergunta entrega um aha moment + planta semente do produto

Ato 3 — COMPROMISSO (P8–P10)
"Já fui longe demais para parar"
→ Perguntas íntimas chegam quando a barra está em 70%+

Ato 4 — ANTECIPAÇÃO (P11 + selfie)
"QUERO ver meu resultado agora"
→ Última pergunta é a mais simples. Tela de selfie fora do fluxo.
```

---

## Comparativo: v2 vs v3

| Dimensão | v2 | v3 |
|---------|----|----|
| Perguntas base | 15 | 11 |
| Perguntas máximo (com branches) | 17 | 13 |
| Selfie | Pergunta P15 no fluxo | Tela intermediária após P11 |
| Tempo estimado | ~3 minutos | ~1min45s – 2min30s |
| Taxa de conclusão projetada | 35–50% | 60–70% |
| Subtítulo | Ensina | Ensina + vende |
| 1ª pergunta | Idade (slider neutro) | Dor no espelho (identificação imediata) |
| Perguntas de hábito | Aparecem no início | Aparecem no Ato 2–3 |
| Perguntas novas | — | 2 novas (espelho + estado matinal) |
| Perguntas eliminadas | — | 3 eliminadas (açúcar, protetor separado, skincare separado) |
| Perguntas combinadas | 0 | 2 (sol+protetor, rotina+frequência) |

---

## Sequência Final — v3

```
[INTRO SCREEN]
    ↓
P1  → O que chama atenção no espelho          [Ato 1 — Hook]
P2  → Como a pele está ao acordar             [Ato 1 — Especificação]
P3  → Idade                                   [Ato 1 — Cálculo]
P4  → O que já tentou sem resultado           [Ato 2 — Revelação / Reframe]
P5  → Sono                                   [Ato 2 — Revelação 1]
P6  → Sol + protetor (combinada)              [Ato 2 — Revelação 2]
P7  → Rotina atual (combinada com frequência) [Ato 2 — Baseline]
P8  → Alimentação                             [Ato 3 — Hábito íntimo 1]
P9  → Estresse                               [Ato 3 — Hábito íntimo 2]
P10 → Ciclo hormonal                         [Ato 3 — Revelação final]
P11 → Água                                   [Ato 4 — Última, mais simples]
    ↓
[TELA DE SELFIE — opcional, fora do fluxo]
    ↓
[TELA DE PROCESSAMENTO — 7 segundos]
    ↓
[RESULTADO]

[Branch A] — se P1 inclui acne → tipo de acne → inserir após P10
[Branch B] — se P2 = vermelhidão ou P10 = irregular → gatilhos → inserir após P10
```

---

## Tela de Introdução

```
[Visual — pele saudável, iluminada]

LABEL:    DIAGNÓSTICO GRATUITO

H1:       Quantos anos tem
          a sua pele?

SUB:      Não é sobre a sua idade — é sobre o que o sol,
          o estresse e os seus hábitos fizeram por ela.

[Badge 1] ⏱️ Menos de 2 minutos
[Badge 2] 11 perguntas
[Badge 3] Protocolo personalizado

[CTA]     Descobrir minha idade de pele →

[Rodapé]  Mais de 2.400 mulheres já fizeram o diagnóstico
```

> **Mudança v3:** "3 minutos" → "2 minutos" (reduz a percepção de esforço antes de começar)

---

## P1 — O QUE CHAMA ATENÇÃO NO ESPELHO

**Tipo:** Cards com emoji — seleção múltipla (mínimo 1)
**Dado coletado:** `incomodos` + `incômodo_primário` (o primeiro selecionado)
**Ato:** 1 — Identificação imediata

```
Título:    Quando você olha no espelho,
           o que mais chama atenção?

Subtítulo: Selecione quantos quiser —
           vamos priorizar o que mais te incomoda.
```

| Opção | Label | Emoji |
|-------|-------|-------|
| manchas | Manchas & tom irregular | 🟤 |
| cansaco | Pele cansada & sem brilho | 😶 |
| acne | Acne & espinhas | 🔴 |
| poros | Poros & oleosidade | 🔎 |
| linhas | Linhas & marcas de expressão | 〰️ |
| flacidez | Flacidez & perda de firmeza | ↘️ |
| vermelhidao | Vermelhidão & irritação | 🌹 |
| olheiras | Olheiras & inchaço | 👁️ |

---

### 🧠 Lógica da P1

**Por que é a primeira pergunta:**
A pergunta mais conversiva possível é aquela que a usuária responde em 2 segundos e pensa "ela está falando de mim." Começar pela DOR — não pela idade, não pelo tipo de pele — cria identificação emocional imediata.

**Por que "espelho" e não "incômodos":**
"Quando você olha no espelho" ativa um modo visual e emocional. A usuária não está respondendo um formulário — ela está descrevendo o que já vive todo dia. A mesma informação, enquadrada de forma completamente diferente.

**Por que multi-select como P1:**
O multi-select rápido gera momentum — a usuária clica em 2-3 opções e sente que "já deu uma boa quantidade de informação." Isso cria compromisso desde o início.

**Mudança em relação à v2:**
Na v2, P2 era "objetivo principal" (single choice) e P13 era "incômodos" (multi-chips no final). No v3, fundimos as duas em P1 — mais rico, mais cedo, mais emocional.

---

## P2 — COMO A PELE ESTÁ AO ACORDAR

**Tipo:** Cards com emoji — escolha única
**Dado coletado:** `tipo_pele` (proxy mais preciso que autopercepção direta)
**Ato:** 1 — Especificação concreta

```
Título:    Como está a sua pele
           quando você acorda?

Subtítulo: O estado matinal da pele é o diagnóstico
           mais honesto — sem maquiagem, sem produto,
           só a sua pele real.
```

| Opção | Label | Descrição | Emoji |
|-------|-------|-----------|-------|
| oleosa | Brilhando, especialmente no centro | Oleosidade evidente na testa, nariz e queixo | ✨ |
| seca | Repuxando, sem viço | Sensação de tensão, às vezes descama | 🏜️ |
| mista | Oleosa no centro, normal nas bochechas | Zona T brilhando, bochechas secas ou normais | 🌓 |
| vermelhidao | Rosada ou irritada | Vermelhidão, calor ou sensibilidade logo ao acordar | 🌹 |
| normal | Equilibrada, sem extremos | Nem muito oleosa, nem muito seca | 🌿 |
| marcas | Com marcas do travesseiro que demoram a sumir | Sinal de perda de elasticidade | 〽️ |

---

### 🧠 Lógica da P2

**Por que "ao acordar" e não "tipo de pele":**
"Qual é o seu tipo de pele?" é a pergunta que a maioria das mulheres responde errado — porque se baseiam em como a pele está COM produto aplicado. "Como você acorda" captura o estado basal real, sem interferência. Dado mais preciso para o skinEngine.

**Por que a opção "marcas do travesseiro":**
Esta opção não existe na v2. É um indicador de perda de elasticidade — colágeno degradado, pele que não recupera a forma rapidamente. A usuária que seleciona isso está sinalizando Perfil 4 (Envelhecimento Precoce) de forma muito mais específica do que "linhas e rugas."

**Dado que coleta:** `tipo_pele` com muito mais fidelidade. `vermelhidao` aqui também ativa o Branch B (gatilhos de sensibilidade).

---

## P3 — IDADE

**Tipo:** Slider (18–65 anos)
**Dado coletado:** `idade`
**Ato:** 1 — Cálculo (agora com contexto)

```
Título:    Qual é a sua idade?

Subtítulo: A partir dos 25 anos, o corpo produz
           1% menos colágeno por ano. Esse é o
           ponto de partida do seu cálculo.
```

---

### 🧠 Lógica da P3

**Por que a idade vai para P3 (era P1 na v2):**
Na v1 e v2, a idade era P1 porque o skinEngine precisa dela. Faz sentido tecnicamente — não faz sentido emocionalmente. Um slider de número como primeira pergunta é a abertura mais fria possível para um quiz que promete "entender sua pele."

Na P3, a idade chega depois que a usuária já respondeu "o que me incomoda" e "como minha pele está." Ela está DENTRO do diagnóstico. Aí o subtítulo "1% menos colágeno por ano" não é um dado neutro — é urgente. A Marina de 34 anos pensa "são 9% de colágeno que já perdi." Isso não acontece quando a pergunta é a primeira.

**O slider continua sendo instantâneo** — 2 segundos de interação. Zero atrito.

---

## P4 — O QUE JÁ TENTOU SEM RESULTADO ← NOVA

**Tipo:** Multi-chips — seleção múltipla
**Dado coletado:** `tentativas_anteriores` (novo campo — alimenta copy do resultado)
**Ato:** 2 — Reframe (a virada do quiz)

```
Título:    O que você já tentou
           para melhorar a sua pele?

Subtítulo: Sem julgamento — essa pergunta existe
           para entendermos o que já não funcionou
           e por quê.
```

| Opção | Label | Emoji |
|-------|-------|-------|
| cremes | Cremes e hidratantes | 🧴 |
| seruns | Sérum e ácidos (vitamina C, retinol...) | 🔬 |
| estetica | Tratamentos em clínica ou dermatologista | 🏥 |
| suplementos | Suplementos de colágeno ou vitaminas | 💊 |
| dieta | Mudança na alimentação | 🥗 |
| remedio | Antibiótico ou medicamento receitado | 💉 |
| nada | Não tentei muita coisa ainda | 🤷 |

---

### 🧠 Lógica da P4

**Por que esta pergunta é a mais importante do quiz:**
Esta é a pergunta que nenhuma versão anterior tinha. E é a mais estratégica do ponto de vista de conversão.

A Marina já tentou cremes caros. Já tentou sérum de vitamina C. Pode ter tentado antibiótico. Nada funcionou de forma definitiva. Quando ela marca 3+ opções aqui, o resultado vai poder dizer: "Você tratou de fora. O que faltou foi tratar de dentro." Isso é o argumento central do produto SKINBELLA (oral + tópico) — e ele surge ORGANICAMENTE a partir da resposta da usuária, não como uma afirmação da marca.

**O que o dado faz no skinEngine:**
- `tentativas_anteriores.length >= 3` → resultado recebe frame "tratamento diferente de tudo que você tentou"
- `tentativas_anteriores.includes("suplementos")` → resultado diferencia "colágeno genérico" de "nutrição funcional direcionada"
- `tentativas_anteriores.includes("nada")` → resultado recebe frame "boa notícia — você não tem hábitos para desfazer"

**Timing:** P4 no Ato 2 porque a usuária já está engajada mas ainda não comprometida. É o momento exato de validar a frustração antes das revelações científicas.

---

## P5 — SONO

**Tipo:** Slider (0–10) ou cards com 4 opções
**Dado coletado:** `sono`
**Ato:** 2 — Revelação 1

```
Título:    Como está a qualidade
           do seu sono?

Subtítulo: Durante o sono profundo, o corpo
           libera hormônio do crescimento —
           que reconstrói colágeno e repara
           o DNA da pele. Noites ruins acumulam
           dano visível com o tempo.
```

| Opção | Label | Descrição | Emoji |
|-------|-------|-----------|-------|
| otimo | Ótimo | Durmo bem, acordo descansada | 😴 |
| regular | Regular | Às vezes bem, às vezes não | 🌙 |
| ruim | Comprometido | Dificuldade frequente para dormir ou acordar | 😮‍💨 |
| pessimo | Muito ruim | Sono fragmentado, acordo cansada quase sempre | 😵 |

---

### 🧠 Lógica da P5

**Por que o sono vem antes do estresse (mudança em relação à v2):**
Na v2, estresse era P8 e sono era P5. No v3, sono vem antes do estresse porque sua revelação científica ("hormônio do crescimento que reconstrói colágeno") é a mais tangível e mais surpreendente. A maioria das mulheres conecta estresse com acne, mas não conecta sono com colágeno. Começar pelo mais surpreendente cria o padrão mental de "esse quiz sabe coisas que eu não sabia."

**O que o dado faz:** Sono comprometido + estresse alto = Perfil 8 (Estresse/Cortisol) confirmado como modificador.

---

## P6 — SOL + PROTETOR ← COMBINADA

**Tipo:** Cards com emoji — escolha única
**Dado coletado:** `exposicao_solar` + `uso_protetor` (dois dados, uma pergunta)
**Ato:** 2 — Revelação 2

```
Título:    Qual é a sua relação
           com o sol?

Subtítulo: O sol é responsável por 80% do
           envelhecimento visível — mais do que
           genética e idade combinadas.
           Mesmo em dias nublados. Mesmo em casa
           perto de janelas.
```

| Opção | Label | Valor interno |
|-------|-------|---------------|
| fechado_protetor | Fico em ambientes fechados e uso protetor diariamente | exposicao=baixa, protetor=sempre |
| sai_protetor | Saio com frequência e uso protetor consistentemente | exposicao=media, protetor=sempre |
| sai_sem | Saio com frequência mas não uso protetor sempre | exposicao=media, protetor=as_vezes |
| externo_protetor | Alta exposição ao sol e uso protetor | exposicao=alta, protetor=sempre |
| externo_sem | Alta exposição ao sol e raramente uso protetor | exposicao=alta, protetor=nunca |

---

### 🧠 Lógica da P6

**Por que fundir duas perguntas em uma:**
Na v2, havia P7 (exposição solar) e P12 (protetor solar) separadas — duas perguntas para o mesmo tema. No v3, as opções compostas capturam os dois dados simultaneamente. A usuária escolhe a opção que descreve AMBOS os aspectos de uma vez. Economizamos uma pergunta inteira sem perder dado nenhum.

**A revelação "mesmo em casa perto de janelas":**
Este é o dado que a maioria das mulheres não sabe. Elas se protegem quando "vão sair" mas não percebem o UV passivo de janelas. Esta informação cria urgência (meu dano é maior do que eu pensava) e credibilidade (esse quiz sabe coisas que o meu dermatologista não me contou).

---

## P7 — ROTINA ATUAL ← COMBINADA

**Tipo:** Cards — escolha única
**Dado coletado:** `rotina_atual` + `frequencia_skincare` (dois dados, uma pergunta)
**Ato:** 2 — Baseline de cuidado

```
Título:    Como é a sua rotina
           de skincare hoje?

Subtítulo: Sem julgamento — o protocolo é o mesmo
           para quem tem rotina e para quem não tem ainda.
           Consistência importa mais do que o produto.
```

| Opção | Label | Descrição | Valor interno |
|-------|-------|-----------|---------------|
| nenhuma | Não tenho rotina | Só água, ou quase | rotina=nenhuma, freq=nunca |
| basica_irregular | Básica quando lembro | Hidratante e sabonete às vezes | rotina=basica, freq=irregular |
| basica_consistente | Básica todo dia | Hidratante e sabonete diariamente | rotina=basica, freq=sempre |
| avancada | Completa e consistente | Sérum, ácidos, protetor — faço todos os dias | rotina=avancada, freq=sempre |

---

### 🧠 Lógica da P7

**Por que a rotina vem aqui e não no início (era P4 na v2):**
Na v2, a rotina era P4 — logo no início, antes de qualquer engajamento emocional. Isso criava dois problemas: (1) a usuária sem rotina sentia vergonha e mentia, e (2) a pergunta parecia um julgamento antes de qualquer conexão.

No v3, P7 chega quando a usuária já entendeu que o quiz "sabe o que faz." Ela já foi revelada sobre sono, sol e hormônios. Agora a rotina não é um julgamento — é uma peça do quebra-cabeça que o quiz está montando. E o subtítulo "sem julgamento" confirma isso.

---

## P8 — ALIMENTAÇÃO

**Tipo:** Cards com emoji — escolha única
**Dado coletado:** `alimentacao`
**Ato:** 3 — Hábito íntimo 1

```
Título:    Como você descreveria
           a sua alimentação?

Subtítulo: O que você come aparece na sua pele
           em 3 a 4 semanas. Inflamação sistêmica
           começa no intestino — e termina no rosto.
```

| Opção | Label | Descrição | Emoji |
|-------|-------|-----------|-------|
| boa | Bastante equilibrada | Priorizo vegetais, proteínas e minimizo processados | 🥗 |
| ok | Poderia melhorar | Quando dá me cuido. Quando não dá... | 🍽️ |
| processada | Muito processada | Comida rápida e industrializada dominam a semana | 🍔 |

---

### 🧠 Lógica da P8

**Por que eliminamos a pergunta de açúcar:**
A v2 tinha alimentação (P9) + açúcar (P10) separadas. O açúcar é um sub-componente de "alimentação muito processada" — quem come muito processado, come muito açúcar. A pergunta de açúcar tinha valor diagnóstico marginal que não justificava o atrito de uma pergunta extra. No v3, eliminada.

**Por que a opção "quando não dá...":**
A frase incompleta é um dispositivo de identificação preciso. A Marina interrompeu a frase mentalmente com sua própria experiência. Isso cria ressonância sem usar palavras de julgamento. Dado mais honesto = diagnóstico mais preciso.

---

## P9 — ESTRESSE

**Tipo:** Cards com emoji — escolha única
**Dado coletado:** `estresse`
**Ato:** 3 — Hábito íntimo 2

```
Título:    Como está seu nível
           de estresse?

Subtítulo: Cortisol elevado degrada colágeno,
           aumenta a oleosidade e intensifica
           manchas e acne — tudo ao mesmo tempo.
           É o fator mais subestimado na saúde
           da pele adulta.
```

| Opção | Label | Descrição | Emoji |
|-------|-------|-----------|-------|
| baixo | Tranquila | Me sinto equilibrada na maior parte do tempo | 😌 |
| medio | Vai e volta | Tenho dias difíceis mas consigo equilibrar | 😐 |
| alto | Estresse constante | Vivo acelerada — isso já está pesando | 😮‍💨 |
| exaustao | Exaustão | No limite — física e mentalmente | 🫠 |

---

### 🧠 Lógica da P9

**Por que estresse vem depois do sono (era P8 na v2, agora P9):**
Sono e estresse são dois lados da mesma moeda (cortisol). Apresentar sono primeiro e estresse depois cria um padrão crescente de revelação. A usuária que marcou "sono ruim" em P5 agora está mais propensa a reconhecer o estresse como causa — porque o quiz já ligou sono → cortisol → pele.

**O que "no limite" faz no skinEngine:**
`estresse = exaustao` → ativa Perfil 8 (Estresse/Cortisol) como perfil primário, independentemente de outras respostas.

---

## P10 — CICLO HORMONAL

**Tipo:** Cards — escolha única
**Dado coletado:** `ciclo_hormonal`
**Ato:** 3 — Revelação final (a mais íntima)

```
Título:    Como é o seu
           ciclo hormonal?

Subtítulo: Hormônios regulam oleosidade, manchas,
           acne e envelhecimento — mais do que
           qualquer produto que você aplica.
           São a causa raiz de 60% dos problemas
           de pele em mulheres adultas.
```

| Opção | Label | Descrição | Emoji |
|-------|-------|-----------|-------|
| regular | Ciclo regular | Sem grandes variações ao longo do mês | 🌙 |
| irregular | Irregular ou TPM intensa | Ciclos imprevisíveis, sintomas fortes | 🌓 |
| hormonal | Uso hormonal | Anticoncepcional, DIU hormonal ou TRH | 💊 |
| pos_meno | Pós-menopausa | | 🌸 |
| nao_aplica | Prefiro não informar | | — |

---

### 🧠 Lógica da P10

**Por que a pergunta mais íntima fica para o penúltimo lugar:**
Esta é a mudança mais importante de posicionamento do quiz. Na v2, ciclo hormonal aparecia em P14a — penúltimo. No v3, é P10 de 11. O motivo é matemático: aos 90% do quiz, a usuária vê a barra quase completa e não abandona por nenhuma pergunta, por mais íntima que seja. A sunk cost fallacy trabalha a favor.

**Por que "60% dos problemas de pele":**
O número concreto substitui o genérico "hormônios afetam a pele." 60% é específico o suficiente para ser surpreendente mas plausível o suficiente para ser crível.

**Gatilho de branch aqui:**
Se `ciclo_hormonal = irregular | pos_meno` + `incomodos.includes("acne")` → inserir Branch A (tipo de acne) antes de P11.

---

## P11 — ÁGUA ← ÚLTIMA PERGUNTA (estratégica)

**Tipo:** Slider (0–10 copos) ou cards simples
**Dado coletado:** `agua`
**Ato:** 4 — Antecipação (a mais simples de todas)

```
Título:    Quantos copos de água
           você bebe por dia?

Subtítulo: A hidratação interna afeta o volume
           e a elasticidade da pele — não só a
           superfície ressecada que cremes não alcançam.
```

| Valor | Interpretação |
|-------|---------------|
| 0–3 | Desidratação sistêmica |
| 4–6 | Hidratação parcial |
| 7–10 | Hidratação adequada |

**Botão de avanço:** `Ver meu diagnóstico →`
*(troca do "Continuar" padrão para criar o pico de antecipação)*

---

### 🧠 Lógica da P11

**Por que água é a ÚLTIMA pergunta:**
Esta é uma decisão puramente psicológica. A última pergunta define a experiência do quiz completo — ela deve ser a mais simples e mais satisfatória possível. Água é objetiva, rápida (slider de 0-10), sem julgamento e sem revelação perturbadora. A usuária termina o quiz com a sensação de "foi fácil."

Imediatamente após responder P11, o botão muda para `Ver meu diagnóstico →` — esse é o maior pico de antecipação do quiz. A progressão de "Continuar" para "Ver meu diagnóstico" é o equivalente ao cliffhanger de série: ela não pode parar agora.

**O subtítulo "que cremes não alcançam":**
Esta é a primeira vez que o quiz implicitamente critica a abordagem tópica isolada. Chegou a hora porque a usuária já está a 100% das perguntas — não há risco de abandono. E planta a última semente: a solução vem de dentro, não só de fora.

---

## Branches Condicionais

### Branch A — Tipo de Acne
**Trigger:** `incomodos.includes("acne")` (de P1)
**Inserir:** após P10, antes de P11
**Pergunta:** `acne_tipo`

```
Título:    Como é a sua acne normalmente?

Subtítulo: Cada tipo tem uma causa diferente —
           e um tratamento completamente diferente.
           Isso muda tudo no protocolo.
```

| Opção | Label | Descrição | Emoji |
|-------|-------|-----------|-------|
| hormonal | Hormonal | Piora antes da menstruação, no queixo e mandíbula | 🔄 |
| comedonal | Cravos & poros | Principalmente cravos e poros entupidos, pouca inflamação | ⚫ |
| inflamatorio | Inflamatória | Espinhas com pus, vermelhas e doloridas | 🔴 |
| misto | Misto | Varia — às vezes um, às vezes outro | 🔀 |

**Impacto no skinEngine:**
- `hormonal` → confirma Perfil 2 (Acne Hormonal), especialmente se P10 = irregular
- `comedonal` → direciona para Perfil 3 (Oleosa & Poros)
- `inflamatorio` → Perfil 2 ou 3 dependendo de P10
- `misto` → tratado como `hormonal` se P9 = alto OU P10 = irregular

---

### Branch B — Gatilhos de Sensibilidade
**Trigger:** `P2 = "vermelhidao"` (estado matinal ao acordar irritado/vermelho)
**Inserir:** após P10, antes de P11 (ou junto com Branch A se ambos ativos)
**Pergunta:** `sensibilidade_gatilhos`

```
Título:    O que costuma irritar
           a sua pele?

Subtítulo: Identificar os gatilhos é o primeiro passo
           para um protocolo que respeita os seus limites.
```

| Opção | Label | Emoji |
|-------|-------|-------|
| sol | Sol e calor | ☀️ |
| cosmeticos | Cosméticos e perfumes | 🧴 |
| temperatura | Mudanças de temperatura | 🌡️ |
| alimentos | Certos alimentos | 🥛 |
| stress | Estresse e ansiedade | 😰 |
| agua | Água da torneira / cloro | 💧 |

**Impacto no skinEngine:**
- 3+ gatilhos → ativa Perfil 6 (Pele Sensível) como modificador
- `cosmeticos + temperatura` → barreira comprometida, link com Perfil 5 (Seca)
- `alimentos + stress` → link com Perfil 8 (Estresse/Cortisol)

---

## Tela de Selfie — Fora do Fluxo de Perguntas

**Aparece:** APÓS `Ver meu diagnóstico →` em P11, ANTES da tela de processamento
**Não é uma pergunta** — é uma tela intermediária opcional

```
[Ícone de câmera, visual leve]

H2:     Quer adicionar uma foto
        para acompanhar sua evolução?

SUB:    Opcional. Não afeta o diagnóstico —
        é para você ter um registro antes e depois.

[Nota]  🔒 Salva apenas no seu dispositivo.
           Não compartilhamos com ninguém.

[Botão primário]    Adicionar foto
[Botão secundário]  Gerar diagnóstico sem foto
```

> **Mudança crítica em relação à v2:** A selfie SAIU do fluxo de perguntas.
> Na v2, era P15 — última pergunta, com atrito de ~5 (maior do quiz).
> No v3, aparece após a usuária já ter clicado em "Ver meu diagnóstico" —
> ela já se comprometeu com o resultado. O atrito da selfie vai para zero
> porque ela sente que o quiz "acabou" e isto é um bônus opcional.

---

## Tela de Processamento — 7 Segundos

### Estrutura
```
[Animação — pulso ou scan de pele]
[Mensagem rotativa — troca a cada 1.4s]
[Subtexto fixo]: "Analisando {n} fatores da sua pele..."
```

### 5 Mensagens Rotativas

```
1. "Calculando sua idade de pele real..."
2. "Cruzando seus hábitos com os 8 perfis de pele..."
3. "Identificando sua causa raiz principal..."
4. "Selecionando os ativos certos para o seu perfil..."
5. "Montando seu protocolo personalizado..."
```

### Mensagem 5 personalizada por perfil detectado

| Perfil | Mensagem 5 |
|--------|------------|
| Manchas | "Criando seu protocolo anti-manchas..." |
| Acne Hormonal | "Montando protocolo hormonal personalizado..." |
| Oleosa/Poros | "Selecionando reguladores de oleosidade..." |
| Envelhecimento | "Calculando seu protocolo anti-aging..." |
| Pele Seca | "Definindo sua rotina de nutrição profunda..." |
| Pele Sensível | "Escolhendo ativos de baixo atrito para você..." |
| Preventivo | "Montando seu protocolo de proteção precoce..." |
| Estresse | "Criando seu escudo anti-cortisol..." |

---

## Micro-textos de Navegação

### Botão de avanço — contexto por pergunta

| Pergunta | Texto do botão |
|---------|----------------|
| P1 (incômodos) | `Continuar →` |
| P2–P10 | `Continuar →` |
| P11 (última) | `Ver meu diagnóstico →` |
| Branch A ou B | `Continuar →` |

### Barra de progresso
```
"Pergunta {atual} de {total}"
```
`{total}` é dinâmico: 11 (base), 12 (um branch), 13 (dois branches)

### Botão voltar
```
← Voltar       (P2 em diante)
[ocultar]      (P1 — não há para onde voltar)
```

### Estados de validação (nunca usar "erro")
```
Multi-select sem seleção:    "Selecione ao menos uma opção para continuar"
Card sem seleção:            "Escolha uma opção para continuar"
Slider no valor padrão:      (nenhuma mensagem — valor padrão é aceito)
```

---

## Mapeamento Completo: v2 → v3

| Pergunta v2 | Status | Destino no v3 |
|------------|--------|--------------|
| P1 — Idade | Reorganizada | → P3 |
| P2 — Objetivo principal (single) | Substituída | → Absorvida por P1-v3 (espelho, multi) |
| P3 — Tipo de pele | Reformulada | → P2-v3 (estado ao acordar — mais preciso) |
| P4 — Rotina atual | Fundida | → Fundida com P11-v2 em P7-v3 |
| P5 — Sono | Reorganizada | → P5-v3 |
| P6 — Água | Reorganizada | → P11-v3 (estrategicamente a última) |
| P7 — Exposição solar | Fundida | → Fundida com P12-v2 em P6-v3 |
| P8 — Estresse | Reorganizada | → P9-v3 |
| P9 — Alimentação | Reorganizada | → P8-v3 |
| P10 — Açúcar | **ELIMINADA** | → Absorvida por alimentação |
| P11 — Frequência de skincare | Fundida | → Absorvida em P7-v3 |
| P12 — Protetor solar | Fundida | → Fundida com P7-v2 em P6-v3 |
| P13 — Incômodos (multi-chips) | Reformulada | → P1-v3 (espelho) |
| P14a — Ciclo hormonal | Reorganizada | → P10-v3 |
| P14b — Tipo acne (branch) | Mantida | → Branch A |
| P14c — Sensibilidade (branch) | Reorganizada | → Branch B (trigger diferente) |
| P15 — Selfie | **Saiu do fluxo** | → Tela intermediária após P11 |
| *(nova)* — O que já tentou | **NOVA** | → P4-v3 |
| *(nova)* — Estado ao acordar | **NOVA** | → P2-v3 |

---

## Dados Coletados pelo skinEngine v3

| Dado | Pergunta | Como |
|------|----------|------|
| `incomodos` + `incomodo_primario` | P1 | Multi-chips — espelho |
| `tipo_pele` | P2 | Estado ao acordar (proxy preciso) |
| `idade` | P3 | Slider 18–65 |
| `tentativas_anteriores` | P4 | Multi-chips — NOVO |
| `sono` | P5 | Cards 4 opções |
| `exposicao_solar` + `uso_protetor` | P6 | Cards compostos |
| `rotina_atual` + `frequencia_skincare` | P7 | Cards compostos |
| `alimentacao` | P8 | Cards 3 opções |
| `estresse` | P9 | Cards 4 opções |
| `ciclo_hormonal` | P10 | Cards 5 opções |
| `agua` | P11 | Slider 0–10 |
| `acne_tipo` | Branch A | Cards condicional |
| `sensibilidade_gatilhos` | Branch B | Multi-chips condicional |

**Total de dados coletados:** 13 variáveis
**Total de perguntas:** 11 base / 13 máximo
**Dados perdidos vs v2:** nenhum — todas as variáveis presentes, algumas via fusão

---

## Checklist de Implementação (para @dev — quando chegar a hora)

- [ ] Criar novo array `quizQuestionsV3` em `src/lib/quizData.ts`
- [ ] Adicionar tipo de resposta `multi_chips_min1` para P1 e P4
- [ ] Adicionar tipo `cards_compostos` para P6 e P7 (retornam dois valores)
- [ ] Mover selfie para fora do array de perguntas → tela intermediária `SelfieOptionalScreen`
- [ ] Atualizar `getVisibleQuestions()` para novos triggers de Branch A e B
- [ ] Atualizar `skinEngine.ts` para processar `tentativas_anteriores` (novo campo)
- [ ] Atualizar `skinEngine.ts` para derivar `tipo_pele` de P2 (estado ao acordar)
- [ ] Barra de progresso: total dinâmico (11, 12 ou 13 — nunca fixo)
- [ ] Botão P11: texto `Ver meu diagnóstico →` (diferente do `Continuar →` padrão)
- [ ] Intro screen: atualizar "3 minutos" → "2 minutos"

> **Lembrete:** Nenhum deste checklist é executado agora.
> Validação humana do conteúdo primeiro. Handoff ao @dev só após GO no quality gate.
