# copywriter-escrever-depoimentos

```yaml
task:
  id: copywriter-escrever-depoimentos
  description: "Escrever depoimentos/provas sociais por perfil de pele"
  agent: copywriter
  squad: skinbella-copy
  elicit: false
  inputs:
    required:
      - data/refs-persona.md
      - data/refs-matriz-perfil.md
      - data/refs-tom-de-voz.md
    optional: []
  output:
    path: docs/conteudo/resultado/provas-sociais.md
    format: markdown
```

## Objetivo

Criar depoimentos representativos para cada perfil do skinEngine — provas sociais que espelham a dor e a transformação da usuária com o mesmo problema.

## Steps

### Step 1: Definir Arquétipo por Perfil

Para cada perfil, criar 1-2 personagens fictícios representativos:
- Nome + Idade
- Cidade/contexto de vida (opcional)
- Dor principal antes do protocolo
- Resultado após o protocolo (tempo de uso)

### Step 2: Escrever Depoimentos

Para cada perfil, criar 2 depoimentos:

```
## Perfil: {nome}

### Depoimento 1
**{Nome}, {idade} anos**
Badge: {label do perfil}

"{quote — 2-4 frases no estilo da persona}"

**Resultado em destaque:** {resultado específico e mensurável}
Tempo de uso: {prazo realista}

### Depoimento 2
**{Nome}, {idade} anos**
Badge: {label do perfil}

"{quote}"

**Resultado em destaque:** {resultado}
Tempo de uso: {prazo}
```

### Step 3: Regras do Depoimento Autêntico

- Quote deve soar como fala real, não como copy
- Incluir dúvida inicial (credibilidade)
- Resultado específico (não genérico "adorei o produto")
- Tempo de uso realista (não "em 3 dias")
- Nome e idade críveis para o perfil da persona

### Step 4: Validar Diversidade

- Variedade de idades (25-45)
- Diferentes contextos de vida
- Resultados diferentes (não todos "pele perfeita")
- Dores espelhadas no perfil correto

### Step 5: Salvar

- 8 seções por perfil (2 depoimentos cada = 16 total)
- Nota de apresentação (como exibir na UI)
- Salvar em `docs/conteudo/resultado/provas-sociais.md`

## Regras

- Depoimentos são FICTÍCIOS mas PLAUSÍVEIS — nunca inventar números exagerados
- Resultado deve ser defensável com o protocolo
- Nunca incluir "cure", "eliminou completamente" sem hedge
- Output: documento .md APENAS — nunca código
