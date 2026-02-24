# Análise Estratégica — As 14 Perguntas Originais

> **Squad:** Quiz Experience
> **Data:** 2026-02-24
> **Propósito:** Entender o que cada pergunta coleta, o que ela alimenta no diagnóstico e onde estão os gaps.
> **Regra:** P1 (idade) é sempre a primeira. Todas as 14 perguntas são mantidas — apenas otimizadas.

---

## 🔍 Framework de Análise

Cada pergunta será avaliada em 3 dimensões:

| Dimensão | O que mede |
|---|---|
| **Valor para personalização** | Quanto essa resposta muda o diagnóstico final? |
| **Valor de engajamento** | Essa pergunta prende a usuária ou gera atrito? |
| **Gap de exploração** | O dado coletado está sendo totalmente usado? |

**Legenda:** 🟢 Alta | 🟡 Média | 🔴 Baixa

---

## 📋 As 14 Perguntas — Análise Individual

---

### P1 — `idade` — Slider
**Pergunta atual:** *"Qual a sua idade?"*
**Subtítulo atual:** *"Precisamos saber para calcular a idade real da sua pele"*

| Dimensão | Status | Detalhe |
|---|---|---|
| Valor personalização | 🟢 Alta | Base matemática do skinAge — tudo começa aqui |
| Valor engajamento | 🟢 Alta | Cria expectativa imediata: "quanto vai sair?" |
| Gap de exploração | 🟡 Médio | Só entra no cálculo de offset — poderia segmentar faixas etárias |

**Análise:**
A mais importante do quiz. Slider é o formato correto — rápido, visual. A faixa (16–65) está adequada ao público.

**O que muda com a resposta:**
- Determina `realAge`
- `skinAge = realAge + offset (3-5)`
- Base de todo o discurso de "envelhecimento precoce"

**Oportunidade não explorada:**
Poderia determinar também: < 28 → perfil preventivo; 28–38 → perfil manutenção; 38–50 → anti-aging ativo; > 50 → menopausa/regeneração. Atualmente não há segmentação por faixa etária além do cálculo numérico.

**Veredicto:** ✅ Mantida. Copy v2 adiciona contexto científico (colágeno -1%/ano).

---

### P2 — `objetivo` — Cards emoji
**Pergunta atual:** *"Qual o seu principal objetivo?"*
**Subtítulo atual:** *"Escolha o que mais te incomoda hoje"*

| Dimensão | Status | Detalhe |
|---|---|---|
| Valor personalização | 🟢 Alta | Define a prioridade #1 da usuária — âncora emocional do resultado |
| Valor engajamento | 🟢 Alta | Primeira seleção — alta identificação emocional |
| Gap de exploração | 🟡 Médio | Informa `prioridadesTop3` mas não alimenta rotina nem nutrientes diretamente |

**Análise:**
Esta é a pergunta de "âncora emocional" — o que a usuária escolhe aqui define o frame mental do resto do quiz. O resultado deve espelhar diretamente o que foi escolhido aqui.

**O que muda com a resposta:**
- Entra no cálculo de `prioridadesTop3`
- Score baixo da prioridade escolhida aumenta o impacto no resultado

**Gap crítico:**
A opção `vico` (viço) é confusa para parte do público. "Pele sem brilho" é mais claro. Além disso, **a resposta desta pergunta deveria alimentar a headline do resultado diretamente** — hoje não alimenta.

**Veredicto:** ✅ Mantida. Ajuste nas labels (ver perguntas-v2.md). Conectar ao resultado (Squad Resultado).

---

### P3 — `tipo_pele` — Cards imagem
**Pergunta atual:** *"Qual o seu tipo de pele?"*
**Subtítulo atual:** *"Selecione a opção que mais se aproxima"*

| Dimensão | Status | Detalhe |
|---|---|---|
| Valor personalização | 🟢 Alta | Determina scores de poros e oleosidade diretamente |
| Valor engajamento | 🟡 Médio | Subtítulo genérico demais — não ensina nada |
| Gap de exploração | 🟡 Médio | Entra em scores mas não determina rotina específica |

**O que muda com a resposta:**
```
oleosa → scores.poros baixo, scores.oleosidade = rand(45,15)
seca   → scores.oleosidade = rand(80,10)
mista  → scores.oleosidade = rand(65,15)
```
**Problema:** `sensivel` não altera nenhum score no engine atual — é coletado mas ignorado no cálculo.

**Gap crítico:**
`tipo_pele = sensivel` deveria: reduzir recomendações de ácidos fortes, priorizar ingredientes calmantes, adicionar aviso especial no resultado. Hoje o dado é coletado e jogado fora.

**Veredicto:** ✅ Mantida. Subtítulo melhorado. Dado de `sensivel` precisa ser explorado no skinEngine v2.

---

### P4 — `rotina_atual` — Cards emoji
**Pergunta atual:** *"Como é sua rotina de skincare atual?"*
**Subtítulo atual:** *"Seja honesta — sem julgamentos 😊"*

| Dimensão | Status | Detalhe |
|---|---|---|
| Valor personalização | 🔴 Baixa | **NÃO é usada no skinEngine atual** |
| Valor engajamento | 🟢 Alta | Subtítulo "sem julgamentos" remove barreira — muito bom |
| Gap de exploração | 🔴 Alta | Dado coletado mas ignorado no diagnóstico |

**Análise:**
Esta é a pergunta com **maior gap** do quiz. O dado é coletado, mas nunca alimenta nada no resultado. A usuária que não tem rotina recebe o mesmo resultado que quem tem rotina avançada.

**O que deveria mudar com a resposta:**
- `nenhuma` → resultado deve incluir "vamos começar do zero — rotina de 5 minutos"
- `basica` → "você já tem a base — vamos potencializar"
- `avancada` → "você já conhece skincare — vamos otimizar o que você usa"

**Potencial estratégico:**
Esta pergunta também poderia determinar o **nível de complexidade do protocolo recomendado**. Iniciante ≠ avançada em termos de produtos recomendados.

**Veredicto:** ✅ Mantida. Precisa ser conectada ao resultado no skinEngine v2. Alta prioridade para Squad Diagnóstico Científico.

---

### P5 — `sono` — Slider (0–10)
**Pergunta atual:** *"Como está a qualidade do seu sono?"*
**Subtítulo atual:** *"O sono é essencial para a renovação celular"*

| Dimensão | Status | Detalhe |
|---|---|---|
| Valor personalização | 🟢 Alta | Entra no habitScore → afeta skinAge |
| Valor engajamento | 🟢 Alta | Revelação: "noite ruim = pele envelhecida" |
| Gap de exploração | 🟡 Médio | Só entra no offset — poderia alimentar score de elasticidade |

**O que muda com a resposta:**
```
sono < 4 → habitScore +2
sono < 7 → habitScore +1
scores.elasticidade → rand(baseScore - (sono < 5 ? 10 : 0), 10)
```

**Oportunidade:**
`sono < 5` penaliza elasticidade. Poderia também: sono < 5 → recomendar colágeno com força extra (GH noturno reduzido). Conectar ao PERFIL 8 (Estresse & Cortisol).

**Veredicto:** ✅ Mantida. Subtítulo atualizado com "hormônio do crescimento" — mais impactante.

---

### P6 — `agua` — Slider (0–10 copos)
**Pergunta atual:** *"Quantos copos de água por dia?"*
**Subtítulo atual:** *"A hidratação interna reflete diretamente na pele"*

| Dimensão | Status | Detalhe |
|---|---|---|
| Valor personalização | 🟢 Alta | Impacta scores.hidratacao e habitScore |
| Valor engajamento | 🟡 Médio | Subtítulo correto mas sem revelação nova |
| Gap de exploração | 🟡 Médio | Conectado a hidratação mas não a recomendação de produto |

**O que muda com a resposta:**
```
agua < 5 → habitScore +1
scores.hidratacao → rand(baseScore - (agua < 5 ? 15 : 0), 12)
```

**Oportunidade:**
`agua < 4` poderia amplificar a recomendação de Ácido Hialurônico oral (Caps) no resultado — a conexão "você bebe pouca água + sua pele está desidratada + AH oral hidrata de dentro" é perfeita.

**Veredicto:** ✅ Mantida. Subtítulo melhorado para destacar hidratação profunda vs superficial.

---

### P7 — `sol` — Cards emoji
**Pergunta atual:** *"Qual sua exposição ao sol diária?"*
**Subtítulo atual:** *"O sol é o fator #1 de envelhecimento precoce"*

| Dimensão | Status | Detalhe |
|---|---|---|
| Valor personalização | 🟢 Alta | Afeta habitScore e scores.manchas |
| Valor engajamento | 🟢 Alta | "fator #1" é impactante — bom |
| Gap de exploração | 🟡 Médio | Deveria também acionar recomendação de fotoproteção interna (Licopeno) |

**O que muda com a resposta:**
```
sol = alta → habitScore +2, scores.manchas - 15
sol = media → habitScore +1
prioridades: "Proteção Solar" score = 100 (se protetor = nunca)
```

**Oportunidade:**
`sol = alta` + `protetor = nunca` é a combinação mais urgente do quiz — deveria acionar um resultado especial com alerta de dano actínico acumulado. Hoje entra na mesma lógica que qualquer outro perfil.

**Veredicto:** ✅ Mantida. Subtítulo atualizado com "80% do envelhecimento" (dado mais preciso e impactante).

---

### P8 — `estresse` — Cards emoji
**Pergunta atual:** *"Qual seu nível de estresse?"*
**Subtítulo atual:** *"O cortisol acelera o envelhecimento da pele"*

| Dimensão | Status | Detalhe |
|---|---|---|
| Valor personalização | 🟡 Média | Só entra como +1 no habitScore se alto |
| Valor engajamento | 🟢 Alta | Cortisol é revelação para a maioria |
| Gap de exploração | 🔴 Alta | Dado subutilizado — influencia muito mais que um ponto |

**O que muda com a resposta:**
```
estresse = alto → habitScore +1
```
**Apenas isso.** O dado mais rico e complexo do quiz entra como uma variável binária de um ponto.

**O que deveria mudar:**
- `estresse = alto` + `sono < 5` → PERFIL 8 (Estresse & Cortisol) — diagnóstico especial
- `estresse = alto` + `incomodos.acne` → reforçar acne por cortisol (diferente de acne hormonal)
- Deveria alimentar recomendação de adaptógenos (ashwagandha — fora do escopo atual) ou pelo menos enfatizar colágeno + antioxidantes

**Veredicto:** ✅ Mantida. Subtítulo melhorado (cortisol + colágeno + inflamação). Gap deve ser corrigido no skinEngine v2.

---

### P9 — `alimentacao` — Cards emoji
**Pergunta atual:** *"Como você avalia sua alimentação?"*
**Subtítulo atual:** *"Sua pele é reflexo do que você come"*

| Dimensão | Status | Detalhe |
|---|---|---|
| Valor personalização | 🟡 Média | +1 no habitScore se ruim |
| Valor engajamento | 🟡 Média | Subtítulo verdadeiro mas genérico |
| Gap de exploração | 🔴 Alta | Coletado mas não alimenta seção de dieta |

**O que muda com a resposta:**
```
alimentacao = ruim → habitScore +1
```

**Gap crítico:**
A seção de **dieta** no resultado (`dieta: priorizar, reduzir, plano`) é completamente hardcoded e **não muda** com base na resposta de alimentação. Alguém que disse "alimentação boa" recebe o mesmo plano de dieta de quem disse "muito processada." Isso é inconsistência de resultado detectável pela usuária.

**O que deveria mudar:**
- `alimentacao = boa` → "sua alimentação já ajuda — vamos otimizar os micronutrientes específicos"
- `alimentacao = ruim` → plano de dieta mais detalhado e urgente com ajuda passo a passo

**Veredicto:** ✅ Mantida. Subtítulo melhorado ("intestino-pele"). Gap é prioridade no skinEngine v2.

---

### P10 — `acucar` — Cards emoji
**Pergunta atual:** *"Com que frequência consome açúcar?"*
**Subtítulo atual:** *"O açúcar causa glicação — que danifica o colágeno"*

| Dimensão | Status | Detalhe |
|---|---|---|
| Valor personalização | 🟡 Média | +1 no habitScore se frequente |
| Valor engajamento | 🟢 Alta | Glicação é conceito pouco conhecido — cria "aha moment" |
| Gap de exploração | 🟡 Médio | Poderia fortalecer recomendação de Vitaminas C e E (antioxidantes anti-glicação) |

**O que muda com a resposta:**
```
acucar = frequente → habitScore +1
```

**Oportunidade:**
`acucar = frequente` deveria adicionar à seção de dieta: "Reduzir açúcar é a mudança com maior impacto na sua pele" + reforçar recomendação de Vitamina C + E (protegem contra glicação).

**Veredicto:** ✅ Mantida. Subtítulo é um dos melhores do quiz — manter e melhorar visualmente ("como envelhecer por dentro antes do tempo").

---

### P11 — `skincare` — Cards emoji
**Pergunta atual:** *"Com que frequência faz skincare?"*
**Subtítulo atual:** *"Consistência é mais importante que produtos caros"*

| Dimensão | Status | Detalhe |
|---|---|---|
| Valor personalização | 🟡 Média | Entra em scores.textura se nunca |
| Valor engajamento | 🟢 Alta | Subtítulo posiciona o app como solução de consistência |
| Gap de exploração | 🟡 Médio | Deveria alimentar o nível de protocolo recomendado |

**O que muda com a resposta:**
```
skincare = nunca → scores.textura - 10, habitScore +1
```

**Oportunidade estratégica máxima:**
Esta pergunta é a mais importante para o **argumento de venda do app**. Quem responde "nunca" ou "às vezes" está dizendo: "eu não consigo manter sozinha." O app resolve exatamente isso. O resultado para esse perfil deveria dizer: **"O checklist diário vai resolver isso — sem precisar lembrar."**

**Veredicto:** ✅ Mantida. Subtítulo atualizado com posicionamento do app como solução.

---

### P12 — `protetor` — Cards emoji
**Pergunta atual:** *"Usa protetor solar diariamente?"*
**Subtítulo atual:** *"90% do envelhecimento visível vem do sol"*

| Dimensão | Status | Detalhe |
|---|---|---|
| Valor personalização | 🟢 Alta | Maior peso na priorização ("Proteção Solar" score = 100 se nunca) |
| Valor engajamento | 🟢 Alta | "90%" é dado impactante — manter |
| Gap de exploração | 🟡 Médio | Poderia amplificar recomendação de fotoproteção interna (Licopeno) |

**O que muda com a resposta:**
```
protetor = nunca  → habitScore +2, prioridade "Proteção Solar" = 100
protetor = as_vezes → habitScore +1, prioridade = 60
protetor = sempre → prioridade = 20
```

**Esta é a pergunta com maior peso no engine atual** — e corretamente posicionada. O subtítulo "90%" é correto e impactante.

**Adição sugerida:**
"mesmo em dias nublados, mesmo dentro de casa" — detalhe que surpreende e educa. Gera compartilhamento orgânico ("eu não sabia isso!").

**Veredicto:** ✅ Mantida. Subtítulo levemente expandido.

---

### P13 — `incomodos` — Multi-chips
**Pergunta atual:** *"O que mais te incomoda na pele?"*
**Subtítulo atual:** *"Selecione todos que se aplicam"*

| Dimensão | Status | Detalhe |
|---|---|---|
| Valor personalização | 🟢 Alta | Afeta score de manchas e prioridadesTop3 |
| Valor engajamento | 🟢 Alta | Multi-select gera engajamento — o usuário "monta" seu perfil |
| Gap de exploração | 🟡 Médio | Só `manchas` entra no cálculo; `acne`, `poros`, `linhas`, `olheiras` são ignorados |

**O que muda com a resposta:**
```
incomodos.includes('manchas') → scores.manchas += prioridade +20
```
**Apenas manchas.** Os outros 4 incômodos (poros, linhas, acne, olheiras) **são coletados mas ignorados** no engine atual.

**Gap crítico:**
- `acne` deveria ser o trigger mais importante do quiz (ativa PERFIL 2)
- `poros` deveria alimentar score de poros
- `linhas` + `acne` juntos deveriam priorizar colágeno
- `olheiras` poderia adicionar seção específica no resultado

**Veredicto:** ✅ Mantida. Adição de `flacidez` como nova opção. Todos os incômodos precisam alimentar o engine v2.

---

### P14 — `selfie` — Câmera
**Pergunta atual:** *"Tire uma selfie para análise"*
**Subtítulo atual:** *"Sua foto será usada apenas para o diagnóstico visual"*

| Dimensão | Status | Detalhe |
|---|---|---|
| Valor personalização | 🔴 Nula | **NÃO é processada nem usada no diagnóstico atual** |
| Valor engajamento | 🔴 Baixo | Alto atrito, baixo retorno percebido |
| Gap de exploração | 🔴 Total | Dado coletado e completamente descartado |

**Análise:**
Esta é a pergunta mais problemática do quiz. Gera o maior atrito (câmera, privacidade, iluminação) e não agrega nada ao resultado. A usuária acredita que a foto está sendo analisada — mas o diagnóstico seria idêntico sem ela.

**Impacto no funil:**
Estima-se que a selfie cause abandono em 15–25% das usuárias que chegam até aqui (benchmarks de quizzes com câmera). Esse é um dos maiores buracos do funil atual.

**Recomendação:**
- **Curto prazo:** Tornar opcional com skip visível. Manter como "análise futura" (v1.1 terá ML)
- **Médio prazo (v1.1):** Implementar análise real de imagem
- **Comunicação:** "Usada para análise visual — ainda em aprimoramento" é mais honesto que "diagnóstico visual" se não está sendo processada

**Copy corrigida:**
```
Título:   Foto opcional para análise visual
Subtítulo: Nossa tecnologia de análise visual
           está em desenvolvimento. Sua foto
           ajuda a aprimorar futuras versões.
Opção:    [Tirar selfie]    [Pular →]
```

**Veredicto:** ✅ Mantida mas tornada OPCIONAL com skip. Copy corrigida para honestidade.

---

## 📊 Resumo — Mapa de Valor e Gaps

| # | Pergunta | Valor Pers. | Engajamento | Gap |
|---|---|---|---|---|
| P1 | idade | 🟢 | 🟢 | Mínimo |
| P2 | objetivo | 🟢 | 🟢 | Não alimenta headline |
| P3 | tipo_pele | 🟢 | 🟡 | `sensivel` ignorado no engine |
| P4 | rotina_atual | 🔴 | 🟢 | **NÃO usada no engine** |
| P5 | sono | 🟢 | 🟢 | Subutilizada |
| P6 | agua | 🟢 | 🟡 | Subutilizada |
| P7 | sol | 🟢 | 🟢 | Poderia acionar licopeno |
| P8 | estresse | 🟡 | 🟢 | **Gravemente subutilizada** |
| P9 | alimentacao | 🟡 | 🟡 | Não alimenta seção de dieta |
| P10 | acucar | 🟡 | 🟢 | Subutilizada |
| P11 | skincare | 🟡 | 🟢 | Não alimenta nível de protocolo |
| P12 | protetor | 🟢 | 🟢 | Bem explorada |
| P13 | incomodos | 🟢 | 🟢 | 4/5 opções ignoradas no engine |
| P14 | selfie | 🔴 | 🔴 | **NÃO usada — gera atrito máximo** |

---

## 🎯 Conclusões para o Squad Diagnóstico Científico

### Perguntas bem exploradas (manter e ampliar):
P1, P5, P6, P7, P12

### Perguntas com dados coletados mas descartados (prioridade máxima para v2):
- **P4 (rotina_atual):** Alimentar nível de complexidade do protocolo
- **P13 (incomodos):** Acne, poros, linhas, olheiras → todos devem impactar resultado
- **P8 (estresse):** Construir PERFIL 8 (Estresse & Cortisol) com dados desta pergunta

### Perguntas honestas mas inconsistentes:
- **P14 (selfie):** Tornar opcional + corrigir copy para não prometer o que não entrega
- **P9 (alimentacao):** Conectar diretamente à seção de dieta do resultado

### Perguntas novas que resolvem os maiores gaps:
- **`ciclo_hormonal`:** Dimensão completamente ausente hoje
- **`acne_tipo`:** Precisão que diferencia entre 3 causas raiz completamente distintas
- **`sensibilidade_gatilhos`:** `tipo_pele=sensivel` hoje é dado ignorado — isso muda isso
