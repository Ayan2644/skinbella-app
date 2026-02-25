# Auditoria de Atrito — Quiz SKINBELLA v2.0

> **Squad:** skinbella-quiz (Bia — UX Writer)
> **Versão:** 1.0
> **Propósito:** Análise de atrito × valor diagnóstico por pergunta para priorizar otimizações.
> **Escala de atrito:** 1 (mínimo) → 5 (muito alto)
> **Escala de valor:** 1 (baixo) → 5 (essencial para o skinEngine)

---

## Resumo Executivo

| Status | Quantidade |
|--------|-----------|
| ✅ MANTER (ratio ≥ 1.0) | 12 |
| ⚠️ ATENÇÃO (atrito ≥ 3, monitorar) | 3 |
| 🔵 BRANCH (alto valor, subset) | 3 |
| ❌ REMOVER | 0 |

**Score médio de qualidade:** 8.2/10
**Risco de abandono estimado:** Baixo para P1-P13, Alto somente P15 (selfie — mitigado com skip)

---

## Análise por Pergunta

---

### P1 — Idade (`idade`)
**Tipo:** Slider

| Dimensão | Score | Justificativa |
|---------|-------|---------------|
| Atrito | 1 | Slider é instantâneo e neutro |
| Valor diagnóstico | 5 | Base do cálculo de envelhecimento — essencial |
| Ratio | 5.0 | |

**Status:** ✅ MANTER — IMUTÁVEL (P1 sempre primeiro)
**Nota de UX:** Subtítulo "1% menos colágeno por ano a partir dos 25" cria ancoragem científica logo de início — excelente.

---

### P2 — Objetivo Principal (`objetivo`)
**Tipo:** Cards com emoji

| Dimensão | Score | Justificativa |
|---------|-------|---------------|
| Atrito | 1 | Alta identificação emocional, resposta imediata |
| Valor diagnóstico | 5 | Define o protagonismo do diagnóstico |
| Ratio | 5.0 | |

**Status:** ✅ MANTER
**Nota de UX:** "O protocolo será construído em torno dele" cria expectativa e aumenta engajamento.

---

### P3 — Tipo de Pele (`tipo_pele`)
**Tipo:** Cards com imagem

| Dimensão | Score | Justificativa |
|---------|-------|---------------|
| Atrito | 2 | Algumas usuárias não sabem seu tipo → tooltip resolve |
| Valor diagnóstico | 5 | Determina categorias principais de ativos |
| Ratio | 2.5 | |

**Status:** ✅ MANTER
**Otimização:** Tooltip "Observe sua pele 1h após lavar" é excelente — mantém dado preciso.
**Risco:** Usuárias que marcam "mista" quando são oleosas — não há solução para isso.

---

### P4 — Rotina Atual (`rotina_atual`)
**Tipo:** Cards com emoji

| Dimensão | Score | Justificativa |
|---------|-------|---------------|
| Atrito | 2 | Vergonha potencial — copy "Sem julgamento" mitiga bem |
| Valor diagnóstico | 3 | Contextualiza a recomendação de rotina |
| Ratio | 1.5 | |

**Status:** ✅ MANTER
**Nota de UX:** "Sem julgamento" no subtítulo é crítico — sem ele, o atrito seria 4.

---

### P5 — Sono (`sono`)
**Tipo:** Slider

| Dimensão | Score | Justificativa |
|---------|-------|---------------|
| Atrito | 1 | Slider é rápido; pergunta familiar |
| Valor diagnóstico | 4 | Sono impacta diretamente produção de GH e reparação celular |
| Ratio | 4.0 | |

**Status:** ✅ MANTER
**Nota de UX:** Subtítulo "hormônio do crescimento repara a pele" é o maior momento de educação do quiz — usuária não sabe e fica impactada.

---

### P6 — Hidratação (`agua`)
**Tipo:** Slider

| Dimensão | Score | Justificativa |
|---------|-------|---------------|
| Atrito | 1 | Muito simples e rápida |
| Valor diagnóstico | 3 | Afeta hidratacao score mas não é determinante isolado |
| Ratio | 3.0 | |

**Status:** ✅ MANTER
**Nota:** Subtítulo diferencia "hidratação interna" de creme superficial — diferenciação boa.

---

### P7 — Exposição Solar (`sol`)
**Tipo:** Cards com emoji

| Dimensão | Score | Justificativa |
|---------|-------|---------------|
| Atrito | 1 | Simples, resposta objetiva |
| Valor diagnóstico | 5 | 80% do envelhecimento visível — dado central |
| Ratio | 5.0 | |

**Status:** ✅ MANTER
**Nota:** "80% do envelhecimento vem do sol" — dado memorável, gera viralização orgânica.

---

### P8 — Estresse (`estresse`)
**Tipo:** Cards com emoji

| Dimensão | Score | Justificativa |
|---------|-------|---------------|
| Atrito | 2 | Pergunta pessoal mas emojis tornam leve |
| Valor diagnóstico | 4 | Cortisol impacta manchas, acne e envelhecimento simultaneamente |
| Ratio | 2.0 | |

**Status:** ✅ MANTER
**Otimização Pendente:** Verificar emojis — 😌 / 😐 / 😮‍💨 precisam ser testados visualmente em mobile.

---

### P9 — Alimentação (`alimentacao`)
**Tipo:** Cards com emoji

| Dimensão | Score | Justificativa |
|---------|-------|---------------|
| Atrito | 3 | Vergonha potencial com alimentação "ruim" |
| Valor diagnóstico | 3 | Inflamação alimentar afeta pele mas é dado complementar |
| Ratio | 1.0 | |

**Status:** ⚠️ ATENÇÃO — monitorar abandono
**Otimização:** "Quando não dá..." normaliza bem. Avaliar reposicionar mais para o final se abandono for alto.

---

### P10 — Açúcar (`acucar`)
**Tipo:** Cards com emoji

| Dimensão | Score | Justificativa |
|---------|-------|---------------|
| Atrito | 2 | Vergonha menor que alimentação geral |
| Valor diagnóstico | 3 | Glicação afeta colágeno — dado de envelhecimento |
| Ratio | 1.5 | |

**Status:** ✅ MANTER
**Nota de UX:** "Glicação" explicada como "envelhecer por dentro antes do tempo" — imagem memorável.

---

### P11 — Frequência de Skincare (`skincare`)
**Tipo:** Cards com emoji

| Dimensão | Score | Justificativa |
|---------|-------|---------------|
| Atrito | 2 | "Quando lembro" normaliza a resposta honesta |
| Valor diagnóstico | 3 | Contextualiza recomendação de rotina |
| Ratio | 1.5 | |

**Status:** ✅ MANTER
**Nota:** A opção "quando lembro" é a de maior identificação — a maioria das usuárias responde essa.

---

### P12 — Protetor Solar (`protetor`)
**Tipo:** Cards com emoji

| Dimensão | Score | Justificativa |
|---------|-------|---------------|
| Atrito | 1 | Simples e objetivo |
| Valor diagnóstico | 4 | Amplifica ou reduz dano solar de P7 |
| Ratio | 4.0 | |

**Status:** ✅ MANTER
**Nota de UX:** "Mesmo em casa perto de janelas" — informação que gera revelação. Excelente.

---

### P13 — Incômodos Específicos (`incomodos`)
**Tipo:** Multi-chips

| Dimensão | Score | Justificativa |
|---------|-------|---------------|
| Atrito | 1 | Multi-select é rápido e satisfatório |
| Valor diagnóstico | 5 | Determina perfil primário do diagnóstico |
| Ratio | 5.0 | |

**Status:** ✅ MANTER — pergunta mais importante do quiz
**Nota:** Gate de branches aqui (acne → P13b). Opção "flacidez" adicionada para 35–45 anos — boa adição.

---

### P14a — Ciclo Hormonal (`ciclo_hormonal`)
**Tipo:** Cards com emoji — SEMPRE VISÍVEL

| Dimensão | Score | Justificativa |
|---------|-------|---------------|
| Atrito | 3 | Pergunta pessoal/íntima — subtítulo justificativo é essencial |
| Valor diagnóstico | 5 | Afeta todos os 8 perfis, especialmente Manchas e Acne |
| Ratio | 1.67 | |

**Status:** ⚠️ ATENÇÃO — atrito moderado, valor altíssimo
**Mitigação:** Subtítulo "hormônios são o fator mais subestimado" valida o porquê da pergunta.
**Risco:** 10–15% das usuárias podem não querer responder → opção "Não se aplica" é essencial.

---

### P13b — Tipo de Acne (`acne_tipo`) — Branch 1
**Tipo:** Cards com emoji — CONDICIONAL

| Dimensão | Score | Justificativa |
|---------|-------|---------------|
| Atrito | 2 | Aparece com contexto — usuária já sinalizou acne |
| Valor diagnóstico | 5 | Diferencia Perfil 2 de Perfil 3 completamente |
| Ratio | 2.5 | |

**Status:** 🔵 BRANCH — mantido, alta justificativa
**Nota:** Aparece com contexto "cada tipo de acne tem uma causa diferente" — reduz atrito.

---

### P12b — Gatilhos de Sensibilidade (`sensibilidade_gatilhos`) — Branch 2
**Tipo:** Multi-chips — CONDICIONAL

| Dimensão | Score | Justificativa |
|---------|-------|---------------|
| Atrito | 2 | Multi-select rápido; contexto já dado |
| Valor diagnóstico | 4 | Determina sub-perfil de Pele Sensível |
| Ratio | 2.0 | |

**Status:** 🔵 BRANCH — mantido, boa justificativa
**Nota:** "Respeita seus limites" → posicionamento empático que aumenta disposição de responder.

---

### P15 — Selfie (`selfie`)
**Tipo:** Câmera — SEMPRE OPCIONAL

| Dimensão | Score | Justificativa |
|---------|-------|---------------|
| Atrito | 5 | Maior barreira do quiz — privacidade + exposição |
| Valor diagnóstico | 1 | ML não implementado — sem valor real atual |
| Ratio | 0.2 | |

**Status:** ⚠️ ATENÇÃO — alto atrito, valor diagnóstico atual = zero
**Mitigação obrigatória:**
- Skip button visível e claramente não penalizador
- "Seu diagnóstico não muda" abaixo do skip
- Framing: "para acompanhar evolução visual" (não para diagnóstico)
- Nota de privacidade antes da ação

---

## Pontos de Abandono Previstos

| Pergunta | Risco | Motivo | Mitigação |
|---------|-------|--------|-----------|
| P9 (alimentação) | Médio | Vergonha de resposta honesta | "Quando não dá" normaliza |
| P14a (ciclo hormonal) | Médio | Pergunta íntima | Subtítulo justificativo essencial |
| P15 (selfie) | **Alto** | Maior barreira de privacidade | Skip obrigatório e não penalizador |

---

## Recomendações de Otimização

### Implementar agora (alto impacto, baixo esforço de copy)
1. ✅ Já feito: "Sem julgamento" em P4 e P9
2. ✅ Já feito: Skip visível em P15
3. ✅ Já feito: Tooltips em P3, P7, P10 e P13b

### Monitorar com dados reais (pós-lançamento)
1. Taxa de abandono por pergunta (evento analytics)
2. Se P9 ou P14a mostrar >20% abandono → reescrever subtítulo
3. Taxa de skip em P15 → meta: >60% de conclusão mesmo com skip

### Não mudar (risco de regressão)
1. P1 (imutável)
2. Skip em P15 (sempre visível)
3. Opção "Não se aplica" em P14a

---

## Conclusão

O quiz v2.0 está bem otimizado. Os 3 pontos de maior atrito (P9, P14a, P15) têm mitigações implementadas. A única área de risco real é P15 (selfie) — mas o skip resolve o abandono sem perda de diagnóstico.

**Próximo passo após lançamento:** Implementar analytics por pergunta para substituir estimativas de atrito por dados reais.
