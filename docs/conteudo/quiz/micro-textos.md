# Micro-Textos — Quiz SKINBELLA v2.0

> **Squad:** Quiz Experience (Bia — UX Writer)
> **Propósito:** Todos os textos de interface do quiz — botões, tooltips, estados, erros e confirmações.
> **Regra:** Micro-textos são invisíveis quando bons. Visíveis quando ruins.

---

## Tela de Introdução (antes do quiz)

```
[Hero visual — imagem de pele saudável]

LABEL:  DIAGNÓSTICO GRATUITO

H1:     Quantos anos tem a sua pele?

SUB:    Não é sobre a sua idade — é sobre o que o sol,
        o estresse e os seus hábitos fizeram por ela.

[Badge 1] 🕐 3 minutos
[Badge 2] 14 perguntas
[Badge 3] Diagnóstico personalizado

[CTA]   Descobrir minha idade de pele →

[Subtexto] Mais de 2.400 mulheres já fizeram o diagnóstico
```

---

## Navegação do Quiz

### Botão Avançar
| Contexto | Texto |
|---|---|
| Padrão | `Continuar →` |
| Última pergunta | `Ver meu resultado →` |
| Após selfie | `Finalizar diagnóstico →` |
| Após selfie pulada | `Ver resultado assim mesmo →` |

### Botão Voltar
| Contexto | Texto |
|---|---|
| Padrão | `← Voltar` |
| Primeira pergunta | (ocultar — sem voltar no P1) |

### Botão Pular (apenas P14 — selfie)
```
[Texto do link]  Pular esta etapa
[Subtexto]       Seu diagnóstico não muda
```

---

## Barra de Progresso

```
[Barra visual — preenchimento proporcional]

Texto abaixo:   "Pergunta {atual} de {total}"
Subtexto:       (nenhum — a barra fala por si)
```

**Nota:** `{total}` é dinâmico — muda conforme branches são ativados.

---

## Estados de Seleção

### Opção de escolha única
```
Não selecionado:  [○]  Texto da opção
Selecionado:      [●]  Texto da opção    ← destaque visual (cor primária)
```

### Multi-select (chips)
```
Não selecionado:  [ Texto ]              ← borda suave
Selecionado:      [✓ Texto ]             ← fundo colorido
```

### Slider (P1 — idade, P5 — sono, P6 — água)
```
Label acima:    {valor} {unidade}        ← ex: "28 anos", "6h", "4 copos"
Label mínimo:   {sliderMin}             ← ex: "18"
Label máximo:   {sliderMax}             ← ex: "65"
```

---

## Tooltips e Contextos de Ajuda

### P3 — Tipo de pele
```
[ícone de ajuda (?)]
Tooltip: "Não sabe seu tipo? Observe sua pele 1h após lavar o rosto,
          sem aplicar nada. Brilho = oleosa. Tensão = seca. Misto = combinada."
```

### P9 — Exposição ao sol
```
[ícone de ajuda (?)]
Tooltip: "Inclua tempo no carro, janelas de escritório e
          caminhadas curtas. O UV atravessa vidro e nuvens."
```

### P10 — Uso de protetor solar
```
[ícone de ajuda (?)]
Tooltip: "Protetor dentro de base ou BB cream conta como 'às vezes' —
          a concentração geralmente não é suficiente para proteção real."
```

### P13b — Tipo de acne (condicional)
```
[ícone de ajuda (?)]
Tooltip: "Acne hormonal tipicamente aparece no queixo, mandíbula
          e pescoço. Acne bacteriana costuma se concentrar na zona T."
```

---

## Tela de Processamento (7 segundos de loading)

### Estrutura
```
[Animação — pulso ou barra de análise]
[Mensagem rotativa — troca a cada 1.4s]
[Subtexto fixo]: "Analisando {n} fatores da sua pele..."
```

### 5 Mensagens Rotativas (em ordem)
```
1. "Calculando sua idade de pele real..."
2. "Cruzando seus hábitos com os 8 perfis de pele..."
3. "Identificando sua causa-raiz principal..."
4. "Selecionando os ativos certos para o seu perfil..."
5. "Montando seu protocolo personalizado..."
```

### Variações por perfil detectado (se possível mostrar antes do resultado)
| Perfil detectado | Mensagem final (msg 5) |
|---|---|
| Manchas/Sol | "Criando seu protocolo anti-manchas..." |
| Acne Hormonal | "Montando protocolo hormonal personalizado..." |
| Oleosa/Poros | "Selecionando reguladores de oleosidade..." |
| Envelhecimento | "Calculando seu protocolo anti-aging..." |
| Pele Seca | "Definindo sua rotina hidratante..." |
| Pele Sensível | "Escolhendo ativos de baixo atrito..." |
| Preventivo | "Montando protocolo de proteção precoce..." |
| Estresse | "Criando escudo contra o cortisol..." |

---

## Estados de Erro e Validação

### Pergunta obrigatória sem resposta
```
[Destaque sutil na pergunta]
Texto:  "Selecione uma opção para continuar"
Tom:    informativo, nunca acusativo
```

### Multi-select sem nenhum chip
```
Texto:  "Selecione ao menos uma opção"
```

### Slider não movido (valor padrão)
```
(nenhuma mensagem de erro — valor padrão é aceito)
```

---

## Tela de Selfie (P14 — opcional)

```
[Ícone de câmera]

H2:     Quer adicionar uma foto do rosto?

SUB:    Opcional. Não afeta seu diagnóstico — é para
        você acompanhar sua evolução visual depois.

[Botão primário]    Tirar foto agora
[Botão secundário]  Pular esta etapa

[Nota de privacidade]
🔒  Sua foto fica salva apenas no seu dispositivo.
    Não compartilhamos com ninguém.
```

---

## Confirmações e Feedbacks

### Após selecionar opção em pergunta rápida
```
(sem feedback — avanço automático após seleção única)
```

### Após upload de selfie
```
✓  Foto salva. Vamos ao resultado!
[Botão]  Continuar →
```

### Após pular selfie
```
Tudo bem! Seu diagnóstico está completo.
[Botão]  Ver resultado →
```

---

## Microcopy de Confiança (espalhados pelo quiz)

### Rodapé do quiz (fixo)
```
🔒 Suas respostas são privadas e usadas apenas para personalizar seu diagnóstico.
```

### Após P1 (idade)
```
[Não exibir — não queremos criar atrito logo no início]
```

### Após P9-P10 (sol e protetor)
```
[Tag sutil]  ☀️ Hábito solar registrado
```

### Após P13 (incomodos)
```
[Tag sutil]  ✓ Principais incômodos mapeados
```

---

## ✏️ Regras de Micro-texto

1. **Máximo 8 palavras** por botão — brevidade é funcional
2. **Tom de parceiro** — "Ver meu resultado" não "Ver resultado"
3. **Sem "Por favor"** — soa burocrático demais para o tom da Marina
4. **Erros informam, não culpam** — "Selecione uma opção" não "Você esqueceu de responder"
5. **Progresso é celebrado** — cada etapa tem uma micro-conquista visual
