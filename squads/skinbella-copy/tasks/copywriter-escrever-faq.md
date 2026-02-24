# copywriter-escrever-faq

```yaml
task:
  id: copywriter-escrever-faq
  description: "Escrever FAQ da tela de resultado para superar objeções de compra"
  agent: copywriter
  squad: skinbella-copy
  elicit: false
  inputs:
    required:
      - data/refs-persona.md
      - data/refs-tom-de-voz.md
      - data/refs-matriz-perfil.md
    optional: []
  output:
    path: docs/conteudo/resultado/faq-resultado.md
    format: markdown
```

## Objetivo

Escrever o FAQ da tela de resultado com foco em superar as principais objeções de compra, mantendo tom de conversa (não de FAQ corporativo).

## Steps

### Step 1: Mapear Objeções por Tipo

Identificar as 10+ principais objeções da persona Marina:
- **Preço:** "É muito caro para mim agora"
- **Ceticismo:** "Já tentei tudo e não funcionou"
- **Tempo:** "Não tenho tempo para uma rotina"
- **Confiança:** "Como sei que funciona para mim?"
- **Prazo:** "Quanto tempo leva para ver resultado?"
- **Produto:** "Qual a diferença para o que eu já uso?"

### Step 2: Estrutura de Resposta

Para cada FAQ, estrutura:
```
### {Pergunta no estilo da usuária}

{Resposta em 2-4 frases — valida a objeção antes de responder}

{Dado ou prova que suporta a resposta}

{Fecha com confiança — não arrogância}
```

### Step 3: FAQ Universal (5 perguntas)

Válido para todos os perfis:
1. Quanto tempo até ver resultado?
2. Preciso usar Caps E Serum juntos?
3. Funciona para minha pele?
4. E se não funcionar?
5. Qual a diferença para outros produtos?

### Step 4: FAQ por Perfil (específico)

Para perfis com objeções únicas:
- **Acne Hormonal:** "Já uso anticoncepcional, vai funcionar junto?"
- **Manchas:** "Meu dermatologista disse que mancha não sai"
- **Envelhecimento:** "Já tenho rugas fundas, ainda vale?"
- **Sensível:** "Minha pele reage a tudo, como sei que é seguro?"

### Step 5: Seção de Objeção de Preço

Dedicar seção específica:
- "R$X/mês parece caro"
- Reframing: custo por dia, custo por resultado
- Comparação ética com alternativas

### Step 6: Formatar

- FAQ Universal (5 perguntas) no topo
- FAQ por perfil (3-4 por perfil relevante)
- Tom: conversa de amiga que entende, não FAQ corporativo
- Salvar em `docs/conteudo/resultado/faq-resultado.md`

## Regras

- Resposta começa validando a objeção — nunca na defensiva
- Nenhuma resposta > 80 palavras
- Dados e fatos concretos onde possível
- Output: documento .md APENAS — nunca código
