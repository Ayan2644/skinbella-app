# cientista-criar-recomendacoes-nutri

```yaml
task:
  id: cientista-criar-recomendacoes-nutri
  description: "Criar recomendações nutricionais por perfil de pele com fundamentação funcional"
  agent: cientista
  squad: skinbella-diagnostico
  elicit: false
  inputs:
    required:
      - data/refs-matriz-perfil.md
      - data/refs-substancias-caps.md
    optional:
      - data/refs-substancias-serum.md
  output:
    path: docs/conteudo/diagnostico/nutrientes-por-perfil.md
    format: markdown
```

## Objetivo

Criar mapa detalhado de recomendação de nutrientes funcionais por perfil, com mecanismo de ação, dosagem de referência e sinergia entre ativos.

## Steps

### Step 1: Carregar Dados

- Ler `refs-substancias-caps.md` — lista de ativos com mecanismo e estudos
- Ler `refs-matriz-perfil.md` — 8 perfis com problemas predominantes

### Step 2: Mapear Necessidade por Perfil

Para cada perfil, identificar:
1. Deficiência funcional subjacente (ex: oxidativo, inflamatório, hormonal)
2. Ativos do Caps que endereçam essa deficiência
3. Sinergia entre ativos (potencialização mútua)
4. Possíveis contraindicações ou alertas

### Step 3: Gerar Recomendação por Perfil

```
## Perfil: {nome} | Score: {min-max}

### Ativos Prioritários
| Ativo | Função | Mecanismo | Prazo |
|-------|--------|-----------|-------|
| ... | ... | ... | ... |

### Sinergia Chave
{ativo A} + {ativo B} = {efeito potencializado}

### Alerta Clínico (se aplicável)
{contraindicação ou cautela}
```

### Step 4: Adicionar Nota de Fundamentação

- Cada ativo citado tem referência ao mecanismo
- Claims são defensáveis: "contribui para", "apoia", "auxilia"
- Nenhuma afirmação absoluta sem evidência robusta

### Step 5: Compilar e Formatar

- Documento com 8 seções (um por perfil)
- Tabela-resumo: matriz ativo × perfil (células: primário / secundário / não indicado)
- Salvar em `docs/conteudo/diagnostico/nutrientes-por-perfil.md`

## Regras

- Linguagem científica acessível — não técnica demais, não superficial
- Claims defensáveis: "apoia", "contribui para", nunca "cura"
- Distinguir evidência forte (meta-análise) de emergente (estudos iniciais)
- Output: documento .md APENAS — nunca código
