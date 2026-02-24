# ux-writer-criar-micro-textos

```yaml
task:
  id: ux-writer-criar-micro-textos
  description: "Criar todos os micro-textos de interface do quiz — botões, tooltips, estados de erro e confirmações"
  agent: ux-writer
  squad: skinbella-quiz
  elicit: false
  inputs:
    required:
      - data/refs-tom-de-voz.md
      - data/refs-persona.md
    optional:
      - data/refs-perguntas-v2.md
  output:
    path: docs/conteudo/quiz/micro-textos.md
    format: markdown
```

## Objetivo

Criar a biblioteca completa de micro-textos de interface do quiz — tudo que não é a pergunta em si mas faz parte da experiência: botões, barra de progresso, tooltips, estados de validação, tela de selfie, loading.

## Steps

### Step 1: Mapear Todos os Contextos de Micro-texto

Listar todos os elementos de UI que precisam de copy:
1. Tela de intro
2. Navegação (próximo/anterior)
3. Barra de progresso
4. Estados de seleção
5. Tooltips de contexto
6. Mensagens de validação (sem "erro")
7. Tela de selfie
8. Tela de loading
9. Mensagens de confirmação

### Step 2: Escrever Micro-textos por Contexto

```
## Navegação

### Botão Avançar (contextos)
| Contexto | Texto |
|---------|-------|
| Padrão | "Continuar" |
| P1 (início) | "Começar meu diagnóstico" |
| P7 (meio) | "Continuar →" |
| P13 (penúltima) | "Quase lá" |
| P14 (selfie) | "Ver meu resultado" |

### Botão Voltar
"← Voltar" (ícone + texto)
```

### Step 3: Tooltips

Para perguntas com atrito ou conceito técnico:
```
### P3 — Tipo de Pele
**Tooltip:** "Não sabe seu tipo? Responda como sua pele fica 1 hora depois de lavar sem usar nada."

### P9 — Exposição ao Sol
**Tooltip:** "Conte exposição direta, sem protetor, por mais de 20 minutos."
```

### Step 4: Estados de Validação (sem "erro")

Nunca usar: "Erro", "Inválido", "Obrigatório"

```
### Seleção Não Feita
Texto: "Toque em uma opção para continuar"
Estilo: [sugestão de tom — não bloqueante]

### Selfie Sem Aceite
Texto: "Toque para fazer a foto ou pular esta etapa"
```

### Step 5: Loading — 5 Mensagens Rotativas

Criar 5 mensagens para os 7 segundos de loading:
```
1. "Analisando suas respostas..."
2. "Identificando seu perfil de pele..."
3. "Combinando com nosso banco de perfis..."
4. "Criando seu protocolo personalizado..."
5. "Seu diagnóstico está quase pronto..."
```

### Step 6: Organizar e Salvar

- Documento organizado por contexto de UI
- Tabela de variações onde aplicável
- Nota: micro-textos são invisíveis quando bons
- Salvar em `docs/conteudo/quiz/micro-textos.md`

## Regras

- Máximo 5 palavras em botões de navegação
- Nunca usar "erro", "inválido", "obrigatório"
- Loading cria antecipação, não ansiedade
- P14 SEMPRE com opção de skip visível
- Output: documento .md APENAS — nunca código
