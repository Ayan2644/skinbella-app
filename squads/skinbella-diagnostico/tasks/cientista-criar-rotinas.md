# cientista-criar-rotinas

```yaml
task:
  id: cientista-criar-rotinas
  description: "Criar protocolo de rotina AM/PM por perfil de pele, com recomendações de uso do Caps e Serum"
  agent: cientista
  squad: skinbella-diagnostico
  elicit: false
  inputs:
    required:
      - data/refs-matriz-perfil.md
      - data/refs-substancias-caps.md
      - data/refs-substancias-serum.md
    optional: []
  output:
    path: docs/conteudo/diagnostico/rotinas-por-perfil.md
    format: markdown
```

## Objetivo

Gerar o protocolo de rotina de skincare AM/PM para cada um dos 8 perfis do skinEngine SKINBELLA, integrando Caps + Serum com fundamentação funcional.

## Steps

### Step 1: Carregar Perfis e Substâncias

- Ler `refs-matriz-perfil.md` — obter os 8 perfis com score, incomodos e prioridade
- Ler `refs-substancias-caps.md` — obter ativos do suplemento oral
- Ler `refs-substancias-serum.md` — obter ativos do sérum tópico

### Step 2: Mapear Prioridade por Perfil

Para cada perfil:
1. Identificar problema principal (incomodo P1)
2. Selecionar 2-3 ativos do Caps mais relevantes para o problema
3. Selecionar 2-3 ativos do Serum mais relevantes para o problema
4. Definir momento ideal de uso (AM / PM / ambos)

### Step 3: Criar Protocolo AM/PM

Para cada perfil, gerar:
```
## Perfil: {nome}

### Manhã (AM)
- Caps: {ativos prioritários}
- Serum: {aplicação + ordem}

### Noite (PM)
- Caps: {ativos noturnos}
- Serum: {aplicação + rotina completa}

### Notas científicas
- Mecanismo primário: {explicação}
- Prazo para resultado visível: {D20 / D30 / D60}
- Fundamento: {referência ou mecanismo}
```

### Step 4: Validar Claims

- Cada recomendação tem mecanismo documentado
- Nenhum claim usa "elimina", "cura" ou "milagre"
- Prazo é conservador (nunca prometer sem evidência)

### Step 5: Formatar Output

- Seção por perfil (8 seções)
- Cada seção com AM, PM, notas científicas
- Tabela-resumo final com todos os perfis e prioridade de ativo
- Salvar em `docs/conteudo/diagnostico/rotinas-por-perfil.md`

## Regras

- NUNCA prometer resultado sem mecanismo documentado
- Prazo conservador: preferir D60 a D30 quando incerto
- Diferenciação clara entre Caps (oral/sistêmico) e Serum (tópico/local)
- Output: documento .md APENAS — nunca código
