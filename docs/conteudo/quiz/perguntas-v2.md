# Quiz SKINBELLA v2 — Copy Completa das Perguntas

> **Squad:** Quiz Experience
> **Data:** 2026-02-24
> **Princípio:** Cada pergunta tem dois trabalhos — coletar dado e aumentar o nível de consciência da usuária sobre sua pele.
> **Tom:** Amiga que estudou dermatologia. Direta. Empática. Nunca julgadora.

---

## 🎯 Estratégia Geral do Quiz

### A Jornada Emocional da Usuária

O quiz não é um formulário. É um processo de revelação progressiva:

```
Pergunta 1-3   → CURIOSIDADE     ("deixa eu ver o que vai sair")
Pergunta 4-7   → IDENTIFICAÇÃO   ("ela está falando de mim")
Pergunta 8-11  → CONSCIÊNCIA     ("não sabia que isso afeta minha pele")
Pergunta 12-14 → COMPROMETIMENTO ("quero saber o resultado")
Pergunta 15+   → ESPECIFICIDADE  ("ela quer entender meu caso de verdade")
```

**Princípio da educação paralela:** Cada subtítulo ensina algo que a usuária não sabia — isso aumenta a percepção de valor do diagnóstico antes mesmo do resultado aparecer.

---

## 📋 Micro-textos Gerais

### Tela de Intro
```
Label:    SKINBELLA APP
H1:       Operação Pele
          de Porcelana
Body:     Descubra a idade real da sua pele e receba
          um plano personalizado — skincare, nutrição
          e rotina, feitos para o seu perfil.
CTA:      Iniciar análise gratuita  →
Rodapé:   Menos de 3 minutos • 100% gratuito • Sem cadastro
```

### Botão de navegação
```
Avançar → "Próxima"     (perguntas 1 a N-1)
Última pergunta → "Ver meu diagnóstico"
```

### Tela de processamento (7 segundos)
```
Mensagem 1 (0-1.4s):  "Analisando seu perfil de pele..."
Mensagem 2 (1.4-2.8s): "Identificando fatores de envelhecimento..."
Mensagem 3 (2.8-4.2s): "Cruzando dados com nossa base científica..."
Mensagem 4 (4.2-5.6s): "Calculando a idade real da sua pele..."
Mensagem 5 (5.6-7s):   "Montando seu protocolo personalizado..."
```

---

## 📝 Perguntas — Copy Completa

---

### P1 — IDADE (`idade`)
**Tipo:** Slider (16–65 anos)

```
Título:   Qual é a sua idade?
Subtítulo: A partir dos 25 anos, o corpo produz 1%
           menos colágeno por ano — essa é a base
           do nosso cálculo.
Unidade:  anos
```

**Nota estratégica:** A palavra "colágeno" aqui é proposital — ela já cria o contexto científico que vai justificar o produto. A usuária ainda não sabe, mas está sendo educada.

---

### P2 — OBJETIVO PRINCIPAL (`objetivo`)
**Tipo:** Cards com emoji

```
Título:   O que mais te incomoda na pele hoje?
Subtítulo: Escolha seu principal problema —
           o protocolo será construído em torno dele.
```

| Opção atual | ❌ Label atual | ✅ Label v2 | ✅ Descrição v2 |
|---|---|---|---|
| manchas | Manchas | Manchas & tom irregular | Marcas escuras, melasma ou pele sem uniformidade |
| textura | Textura | Textura & cravos | Pele áspera, poros entupidos ou superfície irregular |
| vico | Viço | Sem brilho & opaca | Pele apagada, sem luminosidade, cansada |
| poros | Poros | Poros dilatados | Poros visíveis e difíceis de fechar |
| oleosidade | Oleosidade | Oleosidade excessiva | Brilho constante, pele grudenta, maquiagem derrete |
| ressecamento | Ressecamento | Pele seca & repuxando | Sensação de repuxamento, descamação, falta de conforto |

**Nota estratégica:** A primeira pergunta de escolha define o "protagonismo emocional" do quiz. A usuária deve se sentir vista imediatamente. Usar linguagem que ela usaria — não linguagem clínica.

---

### P3 — TIPO DE PELE (`tipo_pele`)
**Tipo:** Cards com imagem

```
Título:   Como é a sua pele normalmente?
Subtítulo: Não existe tipo certo ou errado —
           cada tipo pede um protocolo específico.
```

| Opção | Label v2 | Descrição v2 |
|---|---|---|
| oleosa | Oleosa | Brilho ao longo do dia, especialmente na zona T |
| mista | Mista | Oleosa no centro, normal ou seca nas bochechas |
| seca | Seca | Pele repuxando, quase sem brilho natural |
| sensivel | Sensível | Vermelhidão fácil, reage a produtos novos, coça ou arde |

**Nota estratégica:** A descrição de "sensível" inclui sintomas que a usuária reconhece no cotidiano — isso aumenta a precisão da auto-identificação.

---

### P4 — ROTINA ATUAL (`rotina_atual`)
**Tipo:** Cards com emoji

```
Título:   Como é sua rotina de skincare hoje?
Subtítulo: Sem julgamento — o diagnóstico é o mesmo
           para quem cuida e para quem não cuida ainda.
```

| Opção | Label v2 | Descrição v2 |
|---|---|---|
| nenhuma | Não tenho rotina | Só água — ou quase isso |
| basica | Rotina básica | Sabonete e hidratante, quando lembro |
| avancada | Rotina completa | Sérum, ácidos, protetor — faço consistentemente |

**Nota estratégica:** "Sem julgamento" na subtítulo é crítico — remove a barreira de vergonha que faria a usuária mentir para parecer mais cuidadosa. Dado honesto = diagnóstico preciso. Isso é explicado de forma implícita ao usuário, gerando confiança.

---

### P5 — SONO (`sono`)
**Tipo:** Slider (0–10)

```
Título:   Como está a qualidade do seu sono?
Subtítulo: Durante o sono profundo, o corpo libera
           hormônio do crescimento — que repara a
           pele. Noites ruins aparecem na pele.
```

| Valor | Interpretação interna (não mostrar) |
|---|---|
| 0–3 | Sono muito comprometido → +2 no habitScore |
| 4–6 | Sono irregular → +1 no habitScore |
| 7–10 | Sono adequado → sem penalidade |

**Nota estratégica:** A subtítulo aqui é o momento de maior "aha" do quiz — a maioria das mulheres não associa sono ruim com envelhecimento. Isso cria engajamento e percepção de valor no diagnóstico.

---

### P6 — HIDRATAÇÃO (`agua`)
**Tipo:** Slider (0–10 copos)

```
Título:   Quantos copos de água você bebe por dia?
Subtítulo: A hidratação interna afeta diretamente
           o volume e a elasticidade da pele —
           não só a superfície ressecada.
```

| Valor | Interpretação interna |
|---|---|
| 0–3 | Desidratação sistêmica → impacto em hidratacao score |
| 4–7 | Hidratação parcial |
| 8–10 | Hidratação adequada |

**Nota estratégica:** "Não só a superfície" diferencia o discurso do senso comum e demonstra que o app tem profundidade científica. Isso aumenta a credibilidade do resultado.

---

### P7 — EXPOSIÇÃO SOLAR (`sol`)
**Tipo:** Cards com emoji

```
Título:   Qual é sua exposição ao sol diária?
Subtítulo: O sol é responsável por 80% do
           envelhecimento visível da pele —
           mais do que genética e idade juntos.
```

| Opção | Label v2 | Descrição v2 | Emoji |
|---|---|---|---|
| baixa | Quase nenhuma | Trabalho e fico em ambientes fechados | ☁️ |
| media | Moderada | Saio algumas vezes, me exponho ao sol | 🌤️ |
| alta | Alta exposição | Trabalho ao ar livre ou pratico exercício externo | 🔆 |

**Nota estratégica:** "80% do envelhecimento" é um dado científico real (Photodermatol Photoimmunol Photomed, 2013) e impactante. É o tipo de informação que a usuária vai guardar e contar para alguém — viraliza organicamente.

---

### P8 — ESTRESSE (`estresse`)
**Tipo:** Cards com emoji

```
Título:   Como está seu nível de estresse?
Subtítulo: Cortisol elevado degrada colágeno,
           aumenta inflamação e piora manchas
           e acne — tudo ao mesmo tempo.
```

| Opção | Label v2 | Descrição v2 | Emoji |
|---|---|---|---|
| baixo | Sob controle | Me sinto tranquila na maior parte do tempo | 😌 |
| medio | Vai e volta | Tenho dias difíceis mas consigo equilibrar | 😐 |
| alto | Estresse constante | Vivo acelerada — isso já está pesando | 😮‍💨 |

**Nota estratégica:** "Já está pesando" na opção alto é empático — não julga, reconhece. A descrição do cortisol no subtítulo é uma revelação para a maioria das usuárias e aumenta muito o engajamento.

---

### P9 — ALIMENTAÇÃO (`alimentacao`)
**Tipo:** Cards com emoji

```
Título:   Como você avalia sua alimentação?
Subtítulo: O que você come aparece na pele em
           3 a 4 semanas. Inflamação começa
           no intestino — e termina no rosto.
```

| Opção | Label v2 | Descrição v2 | Emoji |
|---|---|---|---|
| boa | Bastante equilibrada | Priorizo frutas, vegetais e proteínas | 🥗 |
| ok | Poderia melhorar | Quando dá eu me cuido, quando não dá... | 🍽️ |
| ruim | Muito processada | Comida rápida e industrializada domina | 🍔 |

**Nota estratégica:** "Quando não dá..." é uma micro-copy de identificação — a maioria das mulheres se sente assim e a frase valida sem julgar. O subtítulo "inflamação começa no intestino" é um conceito de medicina funcional que ressoa profundamente com esse público.

---

### P10 — AÇÚCAR (`acucar`)
**Tipo:** Cards com emoji

```
Título:   Com que frequência você consome açúcar?
Subtítulo: O açúcar causa glicação — ele se liga
           ao colágeno, tornando-o rígido e quebrável.
           É como envelhecer por dentro antes do tempo.
```

| Opção | Label v2 | Descrição v2 | Emoji |
|---|---|---|---|
| raro | Raramente | Evito ativamente — troco por alternativas | 🌿 |
| as_vezes | Com moderação | Um docinho aqui e ali, sem exagerar | 🍬 |
| frequente | Todo dia | Difícil passar sem — faz parte da rotina | 🧁 |

**Nota estratégica:** "Glicação" é um conceito científico explicado de forma acessível e impactante. "Envelhecer por dentro antes do tempo" é emocional e visual — exatamente o tipo de imagem que fica na memória e que a usuária não vai esquecer.

---

### P11 — FREQUÊNCIA DE SKINCARE (`skincare`)
**Tipo:** Cards com emoji

```
Título:   Com que frequência você faz skincare?
Subtítulo: Consistência importa mais do que
           os produtos que você usa. Uma rotina
           simples todo dia supera qualquer creme caro feito às vezes.
```

| Opção | Label v2 | Descrição v2 | Emoji |
|---|---|---|---|
| nunca | Não tenho hábito | Não faço parte da minha rotina ainda | ○ |
| as_vezes | Quando lembro | Às vezes sim, às vezes não — sem constância | ◑ |
| sempre | Todo dia | Faz parte da minha rotina diária — manhã e/ou noite | ● |

**Nota estratégica:** Usar círculos (○ ◑ ●) em vez de emojis pode funcionar melhor — transmite objetividade de uma escala. O subtítulo posiciona o app como a solução: ele cria a consistência que a usuária não tem sozinha.

---

### P12 — PROTETOR SOLAR (`protetor`)
**Tipo:** Cards com emoji

```
Título:   Você usa protetor solar diariamente?
Subtítulo: 90% do envelhecimento visível vem
           do sol — mesmo em dias nublados,
           mesmo dentro de casa perto de janelas.
```

| Opção | Label v2 | Descrição v2 | Emoji |
|---|---|---|---|
| nunca | Não uso | Não é parte da minha rotina | 🚫 |
| as_vezes | Às vezes | Quando saio de casa ou quando lembro | 🌥️ |
| sempre | Todo dia | Uso diariamente — inclusive em casa | 🛡️ |

**Nota estratégica:** "Mesmo em dias nublados, mesmo dentro de casa" é a informação que a maioria das mulheres não sabe — e muda comportamento. Isso cria um momento de revelação que aumenta o engajamento e a percepção de valor do diagnóstico.

---

### P13 — INCÔMODOS ESPECÍFICOS (`incomodos`)
**Tipo:** Multi-chips (seleção múltipla)

```
Título:   O que mais te incomoda na pele agora?
Subtítulo: Selecione quantos quiser —
           o protocolo vai priorizar os mais urgentes.
```

| Opção | Label v2 | Emoji |
|---|---|---|
| manchas | Manchas & desuniformidade | 🟤 |
| poros | Poros dilatados | 🔎 |
| linhas | Linhas finas & marcas | 〰️ |
| acne | Acne & espinhas | 🔴 |
| olheiras | Olheiras & inchaço | 👁️ |
| **flacidez** *(nova)* | **Flacidez & perda de firmeza** | **↘️** |

> ⚠️ **Gatilho de branching aqui:** Se `acne` estiver selecionada → inserir P14b (acne_tipo) após esta pergunta.

**Nota estratégica:** Adicionamos "flacidez" como nova opção — faixa 35–45 anos tem essa queixa mas não era capturada. Aumenta a precisão do diagnóstico para esse segmento.

---

### P14a — CICLO HORMONAL (`ciclo_hormonal`) ← NOVA, SEMPRE VISÍVEL
**Tipo:** Cards com emoji

```
Título:   Como é seu ciclo hormonal?
Subtítulo: Hormônios são o fator mais subestimado
           da saúde da pele — influenciam manchas,
           acne, oleosidade e envelhecimento diretamente.
```

| Opção | Label v2 | Descrição v2 | Emoji |
|---|---|---|---|
| nao_se_aplica | Não se aplica | Pós-menopausa ou prefiro não informar | — |
| regular | Ciclo regular | Sem grandes variações ao longo do mês | 🌙 |
| irregular | Ciclo irregular | Variações, atrasos ou sintomas intensos de TPM | 🌓 |
| uso_hormonal | Uso hormonal | Anticoncepcional, DIU hormonal ou TRH | 💊 |

**Nota estratégica:** Esta é a pergunta mais "ousada" do quiz — pode gerar atrito se mal comunicada. O subtítulo deve justificar claramente POR QUE estamos perguntando. "Hormônios são o fator mais subestimado" valida o espaço da pergunta e aumenta a curiosidade da usuária sobre o diagnóstico.

**Interpretação interna:**
- `irregular` + `incomodos.acne` → reforça PERFIL 2 (Acne Hormonal)
- `uso_hormonal` → adicionar nota no resultado sobre interação com contraceptivos
- `nao_se_aplica` + `idade > 45` → perfil pós-menopausa (pele seca + flacidez)

---

### P14b — TIPO DE ACNE (`acne_tipo`) ← CONDICIONAL: só aparece se `incomodos` inclui `acne`
**Tipo:** Cards com emoji

```
Título:   Como é a sua acne normalmente?
Subtítulo: Cada tipo de acne tem uma causa diferente
           — e um tratamento diferente. Isso muda
           tudo no seu protocolo.
```

| Opção | Label v2 | Descrição v2 | Emoji |
|---|---|---|---|
| hormonal | Hormonal | Piora antes da menstruação, na queixo e mandíbula | 🔄 |
| comedonal | Cravos & poros | Principalmente cravos e poros entupidos, pouca inflamação | ⚫ |
| inflamatorio | Inflamatória | Espinhas com pus, vermelhas e doloridas | 🔴 |
| misto | Misto | Um pouco de tudo — varia conforme a fase | 🔀 |

**Nota estratégica:** Esta pergunta é um divisor de águas estratégico — a usuária que nunca soube que existem tipos diferentes de acne agora recebe uma micro-educação que vai fazer ela confiar muito mais no diagnóstico. O resultado que menciona o tipo exato dela vai parecer "ela me conhece de verdade."

---

### P14c — GATILHOS DE SENSIBILIDADE (`sensibilidade_gatilhos`) ← CONDICIONAL: só aparece se `tipo_pele` = `sensivel`
**Tipo:** Multi-chips (seleção múltipla)

```
Título:   O que normalmente irrita sua pele?
Subtítulo: Identificar os gatilhos é o primeiro passo
           para um protocolo que respeita os seus limites.
```

| Opção | Label v2 | Emoji |
|---|---|---|
| sol | Sol e calor | ☀️ |
| cosmeticos | Cosméticos e perfumes | 🧴 |
| alimentos | Alimentos específicos | 🥛 |
| stress | Estresse e ansiedade | 😰 |
| hormonal | Mudanças hormonais | 🔄 |

**Nota estratégica:** "Respeita os seus limites" é uma frase de empatia e posicionamento — comunica que o protocolo vai ser ADAPTADO para ela, não genérico. Isso aumenta a disposição de pagar.

---

### P15 — SELFIE (`selfie`)
**Tipo:** Selfie / upload

```
Título:   Foto para análise visual
Subtítulo: Usada apenas para o diagnóstico —
           não é armazenada ou compartilhada.
           Opção de pular disponível.
```

**Copy do botão:** `Tirar selfie agora` / `Pular esta etapa →`

**Nota estratégica:** A selfie gera atrito significativo. Duas mudanças importantes:
1. Explicitar privacidade ANTES da ação ("não é armazenada ou compartilhada")
2. Dar opção de pular sem penalidade — quem pula segue no quiz, o diagnóstico continua funcionando
3. Posicionar como **última pergunta** para que o momentum do quiz já esteja no pico

---

## 📊 Análise de Atrito por Pergunta

| Pergunta | Atrito esperado | Estratégia |
|---|---|---|
| P1 — Idade | Baixo | Slider é rápido e neutro |
| P2 — Objetivo | Muito baixo | Alta identificação emocional |
| P3 — Tipo de pele | Baixo | Visual e intuitivo |
| P4 — Rotina | Médio | "Sem julgamento" remove a barreira |
| P5 — Sono | Baixo | Curiosidade gerada pelo subtítulo |
| P6 — Água | Baixo | Simples e rápido |
| P7 — Sol | Baixo | Dado simples, subtítulo impactante |
| P8 — Estresse | Médio | Emojis menos claros — melhorar visual |
| P9 — Alimentação | Médio | Vergonha potencial — copy validadora |
| P10 — Açúcar | Baixo | Curiosidade sobre glicação |
| P11 — Skincare | Médio | Vergonha potencial — "quando lembro" normaliza |
| P12 — Protetor | Baixo | Dado simples |
| P13 — Incômodos | Muito baixo | Multi-select é rápido e satisfatório |
| P14a — Ciclo hormonal | **Alto** | Pergunta pessoal — justificativa clara no subtítulo |
| P14b — Tipo acne | Baixo | Condicional aparece com contexto |
| P14c — Sensibilidade | Baixo | Condicional aparece com contexto |
| P15 — Selfie | **Muito alto** | Opção de pular obrigatória |

---

## 🔁 Sequência Recomendada (Ordem Final)

```
P1  → Idade (slider)
P2  → Objetivo principal (cards)
P3  → Tipo de pele (cards)
  └─ [BRANCH] se sensivel → P14c (gatilhos)
P4  → Rotina atual (cards)
P5  → Sono (slider)
P6  → Água (slider)
P7  → Exposição solar (cards)
P8  → Estresse (cards)
P9  → Alimentação (cards)
P10 → Açúcar (cards)
P11 → Skincare (cards)
P12 → Protetor solar (cards)
P13 → Incômodos (multi-chips)
  └─ [BRANCH] se acne → P14b (tipo de acne)
P14a→ Ciclo hormonal (cards) ← sempre aparece
P15 → Selfie (com skip)
```

**Contagem de perguntas:**
- Fluxo mínimo (sem branches): **15 perguntas**
- Fluxo com acne: **16 perguntas**
- Fluxo com pele sensível: **16 perguntas**
- Fluxo máximo (ambos): **17 perguntas**

**Tempo estimado:** 2–3 minutos (prometido na intro: "menos de 3 minutos" ✅)

---

## ✏️ Regras Gerais de Copy para o Quiz

1. **Subtítulo = educação paralela** — sempre ensina algo que justifica a pergunta
2. **Labels de opção = linguagem da usuária** — não linguagem clínica
3. **Nunca julgar** — especialmente alimentação, rotina e skincare
4. **Criar antecipação** — "o protocolo vai ser construído em torno disso"
5. **Subtítulo máximo de 2 linhas** — senão perde atenção no mobile
6. **Emojis com propósito** — um por opção, consistente, não decorativo

---

## 🚀 Próximo Passo

Com esta copy aprovada, o @dev pode:
1. Atualizar `src/lib/quizData.ts` com os novos títulos, subtítulos, labels e descrições
2. Adicionar a opção `flacidez` ao array `incomodos`
3. Adicionar as 3 novas perguntas (ciclo_hormonal, acne_tipo, sensibilidade_gatilhos)
4. Implementar a lógica de branching (Story 1.1)

Nenhum código precisa mudar estruturalmente — só os textos.
