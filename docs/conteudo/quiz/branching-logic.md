# Branching Logic — Quiz SKINBELLA v3.0

> **Squad:** skinbella-quiz (Bia — UX Writer)
> **Versão:** 3.0 — alinhada com perguntas-v3.md
> **Para @dev:** Este documento é o input para `getVisibleQuestions()` no skinEngine v3.
> **Mudança crítica v3:** Branch triggers mudaram de P13/P3 para P1/P2.

---

## Sequência Base (todas as usuárias)

```
P1  → incomodos          (multi-chips — o que chama atenção no espelho)
P2  → tipo_pele_proxy    (cards — como a pele está ao acordar)
P3  → idade              (slider 16–65)
P4  → tentativas         (cards — o que já tentou sem resultado)
P5  → sono               (slider ou cards — qualidade do sono)
P6  → exposicao_solar + uso_protetor  (cards combinados)
P7  → rotina_atual + frequencia_skincare  (cards combinados)
P8  → alimentacao        (cards — qualidade)
P9  → estresse           (cards — nível)
P10 → ciclo_hormonal     (cards — SEMPRE VISÍVEL)
P11 → agua               (slider 0–10 copos — última pergunta)
```

**Total base:** 11 perguntas
**Com selfie:** Tela intermediária após P11 — NÃO conta como pergunta do fluxo

---

## Perguntas Condicionais (branching)

### BRANCH A — Tipo de Acne
**Trigger:** `P1.incomodos` inclui `"acne"`
**Inserir:** após P10 (ciclo_hormonal), antes de P11 (agua)

> **Lógica:** P1 é onde a usuária identifica acne. Quanto mais cedo o trigger, melhor — mas a pergunta sobre tipo de acne deve aparecer depois que temos contexto hormonal (P10). Por isso inserimos após P10.

```yaml
branch_A:
  id: BA_acne_tipo
  trigger:
    question: P1
    key: incomodos
    condition: answers.incomodos.includes("acne")
  insert_after: P10
  question:
    id: BA_acne_tipo
    title: "Como é a sua acne normalmente?"
    subtitle: "Cada tipo de acne tem uma causa diferente — e um tratamento diferente. Isso muda tudo no seu protocolo."
    type: single_choice
    options:
      - value: hormonal
        label: "Hormonal"
        description: "Piora antes da menstruação, no queixo e mandíbula"
        emoji: "🔄"
      - value: comedonal
        label: "Cravos & poros"
        description: "Principalmente cravos e poros entupidos, pouca inflamação"
        emoji: "⚫"
      - value: inflamatorio
        label: "Inflamatória"
        description: "Espinhas com pus, vermelhas e doloridas"
        emoji: "🔴"
      - value: misto
        label: "Misto"
        description: "Um pouco de tudo — varia conforme a fase"
        emoji: "🔀"
    skinEngine_key: acne_tipo
```

**Impacto no diagnóstico:**
- `hormonal` + `ciclo_hormonal = irregular` → confirma Perfil 2 (Acne Hormonal)
- `comedonal` + `tipo_pele_proxy = oleosa` → direciona Perfil 3 (Oleosa & Poros)
- `inflamatorio` → Perfil 2 ou 3 dependendo de `ciclo_hormonal`
- `misto` → tratado como `hormonal` se `estresse = alto` ou `ciclo_hormonal = irregular`

---

### BRANCH B — Gatilhos de Sensibilidade
**Trigger:** `P2.tipo_pele_proxy` = `"vermelhidao"` OU `P1.incomodos` inclui `"vermelhidao"`
**Inserir:** após P9 (estresse), antes de P10 (ciclo_hormonal)

> **Lógica:** A identificação de sensibilidade vem de P2 (estado matinal) ou de P1 (incômodos). Inserimos antes do ciclo hormonal para que o diagnóstico de sensibilidade informe a análise hormonal também.

```yaml
branch_B:
  id: BB_sensibilidade
  trigger:
    condition: >
      answers.tipo_pele_proxy === "vermelhidao" ||
      (answers.incomodos?.includes("vermelhidao"))
  insert_after: P9
  question:
    id: BB_sensibilidade_gatilhos
    title: "O que normalmente irrita sua pele?"
    subtitle: "Identificar os gatilhos é o primeiro passo para um protocolo que respeita os seus limites."
    type: multi_select
    options:
      - value: sol
        label: "Sol e calor"
        emoji: "☀️"
      - value: cosmeticos
        label: "Cosméticos e perfumes"
        emoji: "🧴"
      - value: temperatura
        label: "Mudanças de temperatura"
        emoji: "🌡️"
      - value: alimentos
        label: "Certos alimentos"
        emoji: "🥛"
      - value: stress
        label: "Estresse e ansiedade"
        emoji: "😰"
      - value: agua
        label: "Água da torneira / cloro"
        emoji: "💧"
    skinEngine_key: sensibilidade_gatilhos
```

**Impacto no diagnóstico:**
- 3+ gatilhos → ativa Perfil 6 (Pele Sensível) como modificador de todos os perfis
- `cosmeticos` + `temperatura` → barreira comprometida — sobrepõe com Perfil 5 (Seca)
- `alimentos` + `stress` → link com Perfil 8 (Estresse/Cortisol)

---

## Fluxograma Completo v3

```
P1 (incomodos — espelho)
    │  se incomodos inclui "acne"
    │      → marcador: BRANCH_A_ativo = true (inserir BA após P10)
    │  se incomodos inclui "vermelhidao"
    │      → marcador: BRANCH_B_ativo = true (inserir BB após P9)
    ↓
P2 (tipo_pele_proxy — ao acordar)
    │  se tipo_pele_proxy = "vermelhidao"
    │      → marcador: BRANCH_B_ativo = true (se não estava ainda)
    ↓
P3 (idade)
P4 (tentativas)
P5 (sono)
P6 (exposicao_solar + uso_protetor — combinada)
P7 (rotina_atual + frequencia_skincare — combinada)
P8 (alimentacao)
P9 (estresse)
    ↓
    ├── [BRANCH B ativo?] → insere BB (sensibilidade_gatilhos)
    ↓
P10 (ciclo_hormonal) ← SEMPRE, para todas
    ↓
    ├── [BRANCH A ativo?] → insere BA (acne_tipo)
    ↓
P11 (agua) ← última pergunta — botão "Ver meu diagnóstico →"
    ↓
[TELA SELFIE — opcional, fora do fluxo de perguntas]
    ↓
[PROCESSAMENTO — 7 segundos]
    ↓
[RESULTADO]
```

---

## P10 — Ciclo Hormonal (SEMPRE VISÍVEL)

**Não é branch** — aparece para TODAS as usuárias, posição P10.

```yaml
P10:
  id: ciclo_hormonal
  status: always_visible
  position: 10
  title: "Como é o seu ciclo hormonal?"
  subtitle: "Hormônios regulam oleosidade, manchas, acne e envelhecimento — são a causa raiz de 60% dos problemas de pele em mulheres adultas."
  type: single_choice
  options:
    - value: nao_se_aplica
      label: "Não se aplica"
      description: "Pós-menopausa ou prefiro não informar"
      emoji: "—"
    - value: regular
      label: "Ciclo regular"
      description: "Sem grandes variações ao longo do mês"
      emoji: "🌙"
    - value: irregular
      label: "Ciclo irregular"
      description: "Variações, atrasos ou sintomas intensos de TPM"
      emoji: "🌓"
    - value: uso_hormonal
      label: "Uso hormonal"
      description: "Anticoncepcional, DIU hormonal ou TRH"
      emoji: "💊"
  skinEngine_key: ciclo_hormonal
```

**Impacto no diagnóstico:**
- `irregular` + `incomodos.acne` → confirma Perfil 2 (Acne Hormonal)
- `uso_hormonal` → adicionar nota no resultado sobre interação com contraceptivos
- `nao_se_aplica` + `idade > 45` → perfil pós-menopausa (Pele Seca + Flacidez)
- Todos os perfis usam este dado — por isso sempre visível em P10

---

## Tela de Selfie (fora do fluxo)

```yaml
selfie_screen:
  status: opcional
  position: "após P11 — tela intermediária, NÃO é pergunta numerada"
  show_skip_button: true
  skip_label: "Pular e ver meu resultado"
  skip_subtext: "Seu diagnóstico está completo"
  copy:
    title: "Quer adicionar uma foto do rosto?"
    subtitle: "Opcional. Não afeta seu diagnóstico — é para você acompanhar sua evolução depois."
    privacy_note: "🔒 Sua foto fica salva apenas no seu dispositivo."
  impacto_no_diagnostico: nenhum
```

---

## Contagem de Perguntas por Fluxo

| Fluxo | Perguntas | Quando |
|---|---|---|
| Base (sem branches) | 11 | incomodos sem acne e sem vermelhidão, ao acordar ≠ vermelhidao |
| Com acne (Branch A) | 12 | incomodos inclui "acne" |
| Com sensibilidade (Branch B) | 12 | tipo_pele_proxy = vermelhidao OU incomodos inclui "vermelhidao" |
| Máximo (A + B) | 13 | ambos os triggers ativos |

**Tempo estimado:** 1min45s – 2min30s
**Selfie:** não conta no tempo — é opcional e a usuária pula imediatamente

---

## Mudanças em relação ao v2.1

| Dimensão | v2.1 | v3.0 |
|---------|------|------|
| Total base | 15 | 11 |
| Máximo com branches | 17 | 13 |
| Trigger Branch Acne | P13.incomodos | P1.incomodos |
| Trigger Branch Sensibilidade | P3 = sensivel | P2 = vermelhidao OU P1 inclui "vermelhidao" |
| Ciclo hormonal | P14a (após todos) | P10 (posição estratégica 90%) |
| Selfie | P15 no fluxo | Tela intermediária pós P11 |
| P1 | idade (slider) | incomodos (multi-chips — espelho emocional) |
| Branch acne inserida | após P13 | após P10 |
| Branch sensibilidade inserida | após P12 | após P9 |

---

## Regras de Implementação

```yaml
implementacao:
  funcao: getVisibleQuestions(baseQuestions, answers)
  retorna: QuizQuestion[]
  algoritmo:
    1. Iniciar com 11 perguntas base (P1–P11)
    2. Para cada BranchRule:
       - Avaliar condição com answers atual
       - Se verdadeiro: inserir pergunta condicional no índice correto
    3. P10 (ciclo_hormonal) sempre incluída — não é branch
    4. Tela selfie fora do array de perguntas — componente separado
    5. Retornar array dinâmico (11, 12 ou 13 perguntas)
  tipo_answers: Record<string, unknown>
  branch_order:
    - BRANCH_B (sensibilidade): trigger em P1/P2, inserido após P9
    - BRANCH_A (acne_tipo): trigger em P1, inserido após P10
  nota_implementacao: >
    Selfie é renderizada como tela separada após P11.
    Não incluir no array de perguntas.
    Progress bar: calcular com 11–13 (não incluir selfie).
```

---

## QA — Checklist de Validação

- [ ] Branch A não aparece se P1.incomodos NÃO inclui "acne"
- [ ] Branch B não aparece se P2 ≠ "vermelhidao" E P1 não inclui "vermelhidao"
- [ ] Ambos os branches podem aparecer simultaneamente (max 13 perguntas)
- [ ] P10 (ciclo_hormonal) aparece SEMPRE — não depende de nenhuma resposta
- [ ] Barra de progresso reflete total dinâmico (11, 12 ou 13)
- [ ] Navegação "voltar" preserva respostas de branches
- [ ] Selfie NÃO aparece dentro do fluxo de perguntas — é tela separada
- [ ] Botão "Pular" na selfie sempre visível desde o primeiro frame
- [ ] Respostas de BA (acne_tipo) não afetam engine se "acne" removida de P1
