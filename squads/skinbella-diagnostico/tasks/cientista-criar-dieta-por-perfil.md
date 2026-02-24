# cientista-criar-dieta-por-perfil

```yaml
task:
  id: cientista-criar-dieta-por-perfil
  description: "Criar guia de alimentação funcional complementar ao protocolo por perfil de pele"
  agent: cientista
  squad: skinbella-diagnostico
  elicit: false
  inputs:
    required:
      - data/refs-matriz-perfil.md
      - data/refs-substancias-caps.md
    optional: []
  output:
    path: docs/conteudo/diagnostico/dieta-por-perfil.md
    format: markdown
```

## Objetivo

Criar guia alimentar funcional complementar, alinhado ao protocolo Caps + Serum para cada perfil — reforçando a abordagem de nutrição funcional da marca.

## Steps

### Step 1: Mapear Base Metabólica por Perfil

Para cada perfil, identificar:
- Processo fisiológico subjacente ao problema
- Nutrientes alimentares que potencializam os ativos do Caps
- Alimentos que antagonizam ou prejudicam o protocolo

### Step 2: Criar Guia Alimentar por Perfil

```
## Perfil: {nome}

### Potencialize com
- {alimento}: {mecanismo de potencialização}
- {alimento}: {mecanismo}

### Reduza ou Evite
- {alimento/hábito}: {por que prejudica}

### Combo Estratégico
{refeição ou ritual alimentar que potencializa o protocolo}

### Nota Científica
{fundamento da recomendação}
```

### Step 3: Criar Seção de Universais

Recomendações válidas para todos os perfis:
- Hidratação mínima diária
- Anti-inflamatórios universais
- Evitar (glicação, álcool excessivo, etc.)

### Step 4: Avisos e Limitações

- Este guia é informativo — não substitui nutricionista
- Alergias e restrições individuais devem ser respeitadas
- Claims seguem biblioteca de frases validadas

### Step 5: Formatar Output

- 8 seções por perfil
- 1 seção universal
- Avisos legais/nutricionais
- Salvar em `docs/conteudo/diagnostico/dieta-por-perfil.md`

## Regras

- Foco em alimentos funcionais, não em dieta restritiva
- Linguagem positiva: "adicione" mais que "evite"
- Nenhuma dieta específica prescrita (low carb, vegana, etc.)
- Output: documento .md APENAS — nunca código
