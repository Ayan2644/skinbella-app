# cientista-validar-claims

```yaml
task:
  id: cientista-validar-claims
  description: "Auditar e validar todos os claims científicos dos documentos de copy e conteúdo"
  agent: cientista
  squad: skinbella-diagnostico
  elicit: false
  inputs:
    required:
      - data/refs-substancias-caps.md
      - data/refs-substancias-serum.md
    optional:
      - data/refs-matriz-perfil.md
  output:
    path: docs/conteudo/diagnostico/validacao-claims.md
    format: markdown
```

## Objetivo

Auditar todos os claims científicos presentes nos documentos de copy e conteúdo do SKINBELLA, classificando-os por nível de evidência e sinalizando os que precisam de ajuste.

## Steps

### Step 1: Listar Claims a Validar

Identificar todos os claims de efeito nos documentos:
- Docs de copy do resultado (projecao, nutrientes, oferta)
- Descrições de ativos do Caps e Serum
- Frases de diagnóstico e perfil

### Step 2: Classificar por Nível de Evidência

Para cada claim:
```
Claim: "{frase exata}"
Tipo: [efeito direto | mecanismo | prazo | comparação]
Evidência: [forte | moderada | emergente | sem base]
Status: [APROVADO | AJUSTAR | REMOVER]
Versão corrigida (se ajustar/remover): "{frase alternativa}"
```

**Critérios:**
- **Forte:** Meta-análise ou múltiplos RCTs
- **Moderada:** RCT único ou estudos observacionais robustos
- **Emergente:** Estudos in vitro ou preliminares (permitido com hedge)
- **Sem base:** Afirmação sem suporte — REMOVER sempre

### Step 3: Checar Linguagem

Palavras proibidas (sem evidência forte):
- "elimina", "cura", "resolve definitivamente"
- "mais eficaz que qualquer outro"
- "resultados garantidos"
- "em X dias você vai ver" (absoluto)

Palavras aceitáveis:
- "contribui para", "apoia", "auxilia", "reduz", "melhora"
- "pode ajudar", "estudos indicam", "baseado em evidências"

### Step 4: Gerar Relatório de Validação

```
## Relatório de Validação de Claims

### Resumo
- Total de claims analisados: N
- APROVADOS: N
- AJUSTAR: N
- REMOVER: N

### Claims por Status

#### ✅ APROVADOS
...

#### ⚠️ AJUSTAR
...

#### ❌ REMOVER
...
```

### Step 5: Priorizar Ajustes

- Claims ❌ REMOVER bloqueiam publicação
- Claims ⚠️ AJUSTAR devem ser corrigidos antes de handoff ao copywriter
- Claims ✅ APROVADOS são liberados

## Regras

- Auditoria é objetiva — sem interpretação criativa
- Um claim "emergente" pode ficar COM hedge linguístico
- Regulatório: nenhum claim de tratamento médico (ANVISA)
- Output: documento .md APENAS — nunca código
