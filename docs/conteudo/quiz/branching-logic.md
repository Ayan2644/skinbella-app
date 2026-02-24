# Branching Logic — Quiz SKINBELLA v2.0

> **Squad:** Quiz Experience (Bia — UX Writer)
> **Propósito:** Mapa exato de quais respostas disparam quais perguntas condicionais.
> **Regra:** P1 (idade) é sempre a primeira pergunta — imutável.
> **Para @dev (futuro):** Este documento é o input para implementar `getVisibleQuestions()` no skinEngine v2.

---

## Sequência Base (todas as usuárias)

```
P1  → idade
P2  → objetivo
P3  → tipo_pele
P4  → rotina_atual          ← coleta dado mas não afeta branching
P5  → sono
P6  → agua
P7  → alimentacao
P8  → estresse
P9  → sol
P10 → protetor
P11 → oleosidade
P12 → sensibilidade
P13 → incomodos
P14 → selfie                ← opcional (ver nota)
```

**Total base:** 14 perguntas (P14 marcada como opcional)

---

## Perguntas Condicionais (branching)

### BRANCH 1 — Pergunta sobre Acne Hormonal
**Trigger:** `P13.incomodos` inclui `acne`

```yaml
branch_1:
  trigger:
    question: P13 (incomodos)
    condition: answers.incomodos.includes("acne")
  insert_after: P13
  question:
    id: P13b_acne_tipo
    title: "Como essa acne se comporta?"
    subtitle: "Isso muda completamente o protocolo"
    type: single_choice
    options:
      - value: hormonal
        label: "Piora antes da menstruação ou em fases de estresse"
        tag: "Hormonal"
      - value: bacteriana
        label: "Aparece em qualquer época, especialmente na zona T"
        tag: "Bacteriana"
      - value: cosmetica
        label: "Surgiu depois que comecei a usar algum produto"
        tag: "Cosmética"
      - value: nao_sei
        label: "Não consigo identificar um padrão"
        tag: "Sem padrão"
    skinEngine_key: acne_tipo
```

**Impacto no diagnóstico:**
- `hormonal` → ativa Perfil 2 (Acne Hormonal) — prioridade absoluta
- `bacteriana` → ativa Perfil 3 (Oleosa & Poros) — se tipo_pele = oleosa/mista
- `cosmetica` → flag para `sensibilidade_cosmetica` no perfil
- `nao_sei` → tratado como `hormonal` se `estresse = alto` ou `ciclo = irregular`

---

### BRANCH 2 — Pergunta sobre Ciclo Hormonal
**Trigger:** `P13b_acne_tipo` = `hormonal`

```yaml
branch_2:
  trigger:
    question: P13b_acne_tipo
    condition: answers.acne_tipo === "hormonal"
  insert_after: P13b_acne_tipo
  question:
    id: P13c_ciclo_hormonal
    title: "Como é o seu ciclo menstrual?"
    subtitle: "O ciclo irregular amplifica a acne hormonal de forma significativa"
    type: single_choice
    options:
      - value: regular
        label: "Regular (entre 25 e 35 dias)"
      - value: irregular
        label: "Irregular — ciclos muito curtos, longos ou imprevisíveis"
      - value: ausente
        label: "Não tenho menstruação (anticoncepcional, menopausa, etc.)"
      - value: spco
        label: "Tenho SOP (síndrome dos ovários policísticos)"
    skinEngine_key: ciclo_hormonal
```

**Impacto no diagnóstico:**
- `irregular` ou `spco` → aumenta peso do Perfil 2 — diagnóstico Acne Hormonal confirmado
- `ausente` → investigar se é hormônio sintético (anticoncepcional pode causar ou melhorar)
- `regular` → acne hormonal leve — manter Perfil 2 com menor intensidade

---

### BRANCH 3 — Pergunta sobre Sensibilidade
**Trigger:** `P3.tipo_pele` = `sensivel` OU `P12.sensibilidade` ≥ 3 chips selecionados

```yaml
branch_3:
  trigger:
    question: P3 (tipo_pele) ou P12 (sensibilidade)
    condition: >
      answers.tipo_pele === "sensivel" ||
      answers.sensibilidade_gatilhos?.length >= 3
  insert_after: P12
  question:
    id: P12b_sensibilidade_gatilhos
    title: "O que costuma irritar sua pele?"
    subtitle: "Selecione todos que se aplicam"
    type: multi_select
    multiSelect: true
    options:
      - value: sol
        label: "Exposição ao sol"
      - value: produtos
        label: "Produtos com perfume ou álcool"
      - value: temperatura
        label: "Mudanças de temperatura (calor/frio)"
      - value: tecido
        label: "Tecidos sintéticos ou ásperos"
      - value: alimentos
        label: "Certos alimentos (especiarias, álcool)"
      - value: estresse
        label: "Estresse emocional"
      - value: agua
        label: "Água da torneira / cloro"
    skinEngine_key: sensibilidade_gatilhos
```

**Impacto no diagnóstico:**
- 3+ gatilhos → ativa Perfil 6 (Pele Sensível) como modificador
- Perfil Sensível como modificador: condiciona a escolha de ativos de todos os outros perfis
- `produtos` + `temperatura` → barreira comprometida — sobrepõe com Perfil 5 (Seca)
- Gatilhos de origem interna (`alimentos`, `estresse`) → link com Perfil 8 (Cortisol)

---

## Fluxograma Completo

```
P1 (idade)
    ↓
P2 (objetivo)
    ↓
P3 (tipo_pele)
    ↓
    ├── se tipo_pele = "sensivel"
    │       → insere P12b (sensibilidade_gatilhos) após P12
    ↓
P4 (rotina_atual)
    ↓
P5 (sono)
    ↓
P6 (agua)
    ↓
P7 (alimentacao)
    ↓
P8 (estresse)
    ↓
P9 (sol)
    ↓
P10 (protetor)
    ↓
P11 (oleosidade)
    ↓
P12 (sensibilidade)
    ↓
    ├── se sensibilidade.length >= 3 E não inserido ainda
    │       → insere P12b (sensibilidade_gatilhos)
    ↓
P13 (incomodos)
    ↓
    ├── se incomodos.includes("acne")
    │       → insere P13b (acne_tipo)
    │           ↓
    │           ├── se acne_tipo = "hormonal"
    │           │       → insere P13c (ciclo_hormonal)
    ↓
P14 (selfie) ← OPCIONAL — ver regra abaixo
```

---

## Regra da Selfie (P14)

```yaml
selfie_rule:
  status: opcional
  show_skip_button: true
  skip_label: "Pular esta etapa"
  copy_quando_exibida:
    title: "Quer adicionar uma foto do rosto?"
    subtitle: "Opcional. Não é obrigatória para o diagnóstico."
    note: "Sua foto não é armazenada nem compartilhada."
  copy_quando_pulada:
    confirmation: "Tudo bem! Seu diagnóstico está completo."
  impacto_no_diagnostico: nenhum  # P14 não processa ML atualmente
  recomendacao_futura: >
    Quando análise de imagem estiver disponível,
    P14 pode confirmar manchas e oleosidade visualmente.
    Por ora: coletar mas não prometer diagnóstico visual.
```

---

## Contagem de Perguntas por Fluxo

| Fluxo | Perguntas | Quando |
|---|---|---|
| Mínimo (sem branches) | 13 | tipo_pele ≠ sensível + sem acne |
| Mínimo com selfie pulada | 13 | idem |
| Base com sensibilidade | 14 | tipo_pele = sensível OU 3+ gatilhos |
| Base com acne | 14 | incomodos inclui acne |
| Base com acne hormonal | 15 | acne + tipo = hormonal |
| Máximo (sensível + acne hormonal) | 16 | todos os branches ativos |

---

## Regras de Implementação

```yaml
implementacao:
  funcao: getVisibleQuestions(baseQuestions, answers)
  retorna: QuizQuestion[]
  algoritmo:
    1. Iniciar com baseQuestions (14 perguntas)
    2. Para cada BranchRule em cada pergunta:
       - Avaliar condição com answers atual
       - Se verdadeiro: inserir pergunta condicional após trigger
    3. Retornar array dinâmico
  tipo_answers: Record<string, unknown>  # não Record<string, any>
  orphan_answers: ignorar silenciosamente  # resposta de branch inativo não afeta engine
```

---

## Notas de QA para Validação Futura

- [ ] Verificar que P12b não aparece duas vezes se tipo_pele=sensível E 3+ chips
- [ ] Verificar que P13c só aparece se P13b existe (encadeamento correto)
- [ ] Verificar que barra de progresso reflete total dinâmico (não fixo em 14)
- [ ] Testar navegação "voltar" quando branches foram inseridos
- [ ] Confirmar que respostas orphan de P13b não quebram engine quando acne removida de P13
