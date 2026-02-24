# cientista-criar-biblioteca-frases

```yaml
task:
  id: cientista-criar-biblioteca-frases
  description: "Criar biblioteca de frases científicas validadas para uso nos copies"
  agent: cientista
  squad: skinbella-diagnostico
  elicit: false
  inputs:
    required:
      - data/refs-substancias-caps.md
      - data/refs-substancias-serum.md
      - data/refs-matriz-perfil.md
    optional: []
  output:
    path: docs/conteudo/diagnostico/frases-diagnostico.md
    format: markdown
```

## Objetivo

Criar uma biblioteca reutilizável de frases científicas validadas, organizadas por categoria, que o copywriter pode usar diretamente sem adaptação — garantindo que todo copy tem base científica defensável.

## Steps

### Step 1: Definir Categorias de Frases

- **Mecanismo de ação** — como os ativos funcionam
- **Prazo de resultado** — quando esperar o quê
- **Problema → Causa** — raiz do problema por perfil
- **Diferenciação** — por que oral + tópico juntos
- **Validação científica** — frases de autoridade sem exagero

### Step 2: Gerar Frases por Categoria

Para cada categoria, criar 5-10 frases modelo:

```
### Mecanismo de ação — {ativo}
- "[Ativo] atua diretamente no [mecanismo], o que [resultado esperado] ao longo de [prazo]."
- "A ação do [ativo] começa no [nível sistêmico/tópico], onde [explicação]."
...
```

### Step 3: Frases por Perfil

Para cada um dos 8 perfis, criar:
1. Frase de diagnóstico (explicar o problema)
2. Frase de causa (por que acontece)
3. Frase de solução (como o protocolo endereça)
4. Frase de prazo (quando esperar melhora)

### Step 4: Checar e Validar

- Cada frase tem mecanismo implícito ou explícito
- Nenhuma frase promete resultado absoluto
- Linguagem acessível mas não superficial
- Claims hedgeados onde evidência é moderada

### Step 5: Organizar e Formatar

```
# Biblioteca de Frases Científicas — SKINBELLA

## Instruções de Uso
[Como o copywriter deve usar esta biblioteca]

## Por Categoria
### Mecanismo de Ação
### Prazo e Resultado
### Diagnóstico por Perfil
...

## Por Perfil
### Manchas / Hiperpigmentação
### Acne Hormonal
...
```

## Regras

- Frases são reutilizáveis — devem funcionar em diferentes contextos
- Manter banco de dados atualizado quando novos estudos chegarem
- Versão: marcar data de criação para controle de validade
- Output: documento .md APENAS — nunca código
