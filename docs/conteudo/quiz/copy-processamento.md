# Copy de Processamento — Tela de Loading

> **Squad:** skinbella-quiz (Bia — UX Writer)
> **Versão:** 1.0
> **Propósito:** Copy dos 7 segundos de loading entre o quiz e o resultado.
> **Regra:** Loading cria antecipação crescente — nunca ansiedade.

---

## Estrutura da Tela

```
┌─────────────────────────────────────┐
│                                     │
│     [Animação — pulso circular]     │
│                                     │
│   "Calculando sua idade de pele..." │
│    ← mensagem rotativa (5 msgs)     │
│                                     │
│   Analisando 14 fatores da sua pele │
│    ← subtexto fixo                  │
│                                     │
│   [Barra de progresso 0 → 100%]    │
│                                     │
└─────────────────────────────────────┘
```

**Duração total:** ~7 segundos
**Troca de mensagem:** a cada 1.4 segundos
**Tom:** descoberta científica, não processamento de dados

---

## 5 Mensagens Rotativas — Universais

Em ordem de exibição:

```
1 → (0.0s – 1.4s)
"Calculando sua idade de pele real..."

2 → (1.4s – 2.8s)
"Cruzando seus hábitos com os 8 perfis de pele..."

3 → (2.8s – 4.2s)
"Identificando sua causa-raiz principal..."

4 → (4.2s – 5.6s)
"Selecionando os ativos certos para o seu perfil..."

5 → (5.6s – 7.0s)
"Montando seu protocolo personalizado..."
```

**Princípio da progressão:** A mensagem 5 é o pico de antecipação — deve parecer que algo único está sendo construído para a usuária, não que um algoritmo está rodando.

---

## Subtexto Fixo (abaixo da mensagem rotativa)

```
"Analisando {n} fatores da sua pele..."
```

Onde `{n}` = número de perguntas respondidas (ex: "Analisando 15 fatores da sua pele...")

**Alternativa fixa (sem dinâmico):**
```
"Analisando seus hábitos, pele e rotina..."
```

---

## Variação 5 por Perfil Detectado

Se o skinEngine já identificou o perfil provável antes de exibir o resultado, personalizar a **mensagem 5** (última):

| Perfil | Mensagem 5 personalizada |
|--------|--------------------------|
| Manchas / Hiperpigmentação | "Criando seu protocolo anti-manchas..." |
| Acne Hormonal | "Montando protocolo hormonal personalizado..." |
| Oleosa / Poros Dilatados | "Selecionando reguladores de oleosidade..." |
| Envelhecimento Precoce | "Calculando seu protocolo anti-aging..." |
| Pele Seca / Desidratada | "Definindo sua rotina de nutrição profunda..." |
| Pele Sensível / Reativa | "Escolhendo ativos de baixo atrito para você..." |
| Preventivo / Manutenção | "Montando seu protocolo de proteção precoce..." |
| Estresse / Cortisol | "Criando seu escudo anti-cortisol..." |

> **Condição:** Usar variação por perfil APENAS se o perfil estiver confirmado antes de navegar para o loading. Se não houver certeza, usar mensagem 5 universal.

---

## Copy do Indicador de Progresso

### Opção A — Com texto progressivo

| % | Texto |
|---|-------|
| 0–25% | "Iniciando análise..." |
| 26–50% | "Processando perfil..." |
| 51–75% | "Construindo protocolo..." |
| 76–99% | "Finalizando..." |
| 100% | "Pronto!" |

### Opção B — Barra silenciosa (recomendada)

Barra preenchendo sem texto — as mensagens rotativas já comunicam o progresso.
**Recomendação:** Opção B, pois evita redundância com as mensagens rotativas.

---

## Micro-copy Pós-Loading (transição para resultado)

Quando o loading termina e o resultado está pronto:

```
Seu diagnóstico de pele está pronto.
Veja o que encontramos para você. 👇
```

**Variação por perfil:**
| Perfil | Transição personalizada |
|--------|------------------------|
| Manchas | "Identificamos a causa das suas manchas. 👇" |
| Acne Hormonal | "Encontramos o padrão da sua acne. 👇" |
| Envelhecimento | "Calculamos a idade real da sua pele. 👇" |
| Genérico (fallback) | "Seu diagnóstico personalizado está pronto. 👇" |

---

## Regras de UX

1. **Sem spinner infinito** — a barra deve ter progresso real, não fake-random
2. **Mínimo 5 segundos** — menos que isso não cria antecipação suficiente
3. **Máximo 9 segundos** — acima disso a usuária abandona
4. **Mensagem 1 aparece imediatamente** — sem delay inicial
5. **Tom científico mas humano** — "montando", "selecionando" (não "processando", "calculando dados")
6. **Nunca pausar** — loading contínuo, sem micro-travamentos

---

## Variação de Teste A/B — Copy do Loading

**Hipótese:** Loading com framing de "descoberta" converte mais que loading de "processamento".

| Variação | Tom | Exemplo |
|---------|-----|---------|
| A (controle) | Processamento | "Analisando dados..." / "Calculando perfil..." |
| B (teste) | Descoberta | "Descobrindo sua causa-raiz..." / "Revelando seu perfil..." |

**Métrica:** Tempo na tela de resultado (engajamento pós-loading)
**Critério:** +10% tempo médio na ResultScreen com p<0.05

---

## Checklist de Validação

- [ ] Mensagens em ordem de crescente antecipação (não aleatórias)
- [ ] Nenhuma mensagem > 8 palavras
- [ ] Tom de descoberta, não de processamento técnico
- [ ] Subtexto fixo é neutro — não promete mais do que o diagnóstico entrega
- [ ] Variações por perfil existem para todos os 8 perfis
- [ ] Duração testada em mobile (não só desktop)
