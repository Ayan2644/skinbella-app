# ux-writer-otimizar-processamento

```yaml
task:
  id: ux-writer-otimizar-processamento
  description: "Criar as 5 mensagens rotativas da tela de loading de 7 segundos"
  agent: ux-writer
  squad: skinbella-quiz
  elicit: false
  inputs:
    required:
      - data/refs-tom-de-voz.md
    optional:
      - data/refs-persona.md
      - data/refs-matriz-perfil.md
  output:
    path: docs/conteudo/quiz/copy-processamento.md
    format: markdown
```

## Objetivo

Criar as mensagens da tela de loading (processamento do diagnóstico) que mantêm a usuária engajada por 7 segundos enquanto o skinEngine calcula o perfil — criando antecipação, não ansiedade.

## Steps

### Step 1: Entender o Contexto da Tela

A tela de loading:
- Dura ~7 segundos
- Mostra progressão (0% → 100%)
- Exibe 5 mensagens rotativas
- É o momento de maior expectativa da jornada

### Step 2: Princípios das Mensagens

**Deve fazer:**
- Criar sensação de processo científico real
- Aumentar antecipação progressivamente
- Usar linguagem de descoberta, não de cálculo
- Manter tom da persona (não robótico)

**Nunca deve:**
- Criar ansiedade ou urgência
- Ser técnico demais (não é código rodando)
- Parecer genérico (um quiz qualquer)

### Step 3: Escrever 5 Mensagens Principais

Mensagens em sequência (cada uma ~1.4 segundos):
```
1. "Analisando suas {N} respostas..."
2. "Identificando padrões do seu perfil de pele..."
3. "Cruzando com nossa base de {X}+ perfis..."
4. "Selecionando os ativos ideais para você..."
5. "Seu diagnóstico personalizado está pronto 🎯"
```

### Step 4: Variações por Perfil (opcional)

Se a UI suportar personalização no loading:
```
## Manchas / Hiperpigmentação
Msg 4: "Identificando os melhores despigmentantes para você..."

## Acne Hormonal
Msg 4: "Mapeando gatilhos hormonais do seu perfil..."

## Envelhecimento Precoce
Msg 4: "Selecionando antioxidantes e firmadores para você..."
```

### Step 5: Copy do Progress Indicator

Para a barra de progresso:
- 0-20%: "Iniciando análise..."
- 20-50%: "Processando perfil..."
- 50-80%: "Criando protocolo..."
- 80-100%: "Finalizando..."

Ou: sem texto (barra pura) + mensagens rotativas

### Step 6: Micro-copy Pós-Loading

Texto que aparece quando o resultado está pronto:
```
"Seu diagnóstico de pele está pronto.
Veja o que encontramos para você. 👇"
```

### Step 7: Salvar

- 5 mensagens universais
- Variações por perfil (se aplicável)
- Copy do progress indicator
- Micro-copy pós-loading
- Salvar em `docs/conteudo/quiz/copy-processamento.md`

## Regras

- Mensagem 5 deve criar pico de antecipação (não "pronto")
- Progressão deve sentir crescente — não linear
- Nenhuma mensagem > 8 palavras
- Output: documento .md APENAS — nunca código
