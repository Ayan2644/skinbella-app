# create-ad-creative

```yaml
task:
  id: create-ad-creative
  description: "Gerar criativo de anúncio Skinbella com copy completa (3 durações) + Sora prompt (15s)"
  agent: sora-skinbella
  squad: skinbella-copy
  elicit: false
  inputs:
    required:
      - angulo_criativo     # ex: quiz-hook, frustracao, diagnostico-vs-produto, protocolo-20-dias, preco-ancora
      - segmento_marina     # ex: jovem, mae, executive, consciente
    context_always_loaded:
      - brand_dna (embutido no agente sora-skinbella)
  output:
    path: "docs/criativos/{angulo_criativo}/"
    files:
      - copy-completa.md    # script mestre com 15s + 30s + 1 min
      - sora-prompt.md      # apenas os 15s do hook — para o Sora gerar o avatar
    format: markdown
```

## Pipeline de Produção

```
[Ari gera] copy-completa.md + sora-prompt.md
         ↓
[Sora 2 Pro] recebe sora-prompt.md → gera vídeo avatar 15s (hook visual)
         ↓
[Áudio externo] recebe copy-completa.md → gera áudio da duração desejada (30s, 60s...)
         ↓
[Edição] combina vídeo Sora 15s + áudio → criativo final (15s / 30s / 60s / etc.)
```

## Objetivo

Produzir, para cada ângulo criativo + segmento da Marina, os **dois outputs obrigatórios**:

1. **`copy-completa.md`** — o script mestre: copy em texto com 3 versões de duração (15s, 30s, 1 min). É a base de toda a produção posterior — áudio, edição, legenda.
2. **`sora-prompt.md`** — prompt para o Sora 2 Pro gerar APENAS os primeiros 15s: o avatar UGC brasileiro entregando o hook. O Sora não gera o criativo completo.

---

## Steps

### Step 1: Carregar Contexto do Ângulo

Identificar o ângulo e o segmento recebidos como input.

Consultar o `brand_dna` do agente para:
- Dor específica do segmento da Marina
- Aparência física realista para o segmento
- Argumento-chave do ângulo criativo
- Tom correto (nunca vendas — sempre descoberta/resultado)

---

### Step 2: Escrever `copy-completa.md`

O arquivo tem **3 seções de duração obrigatórias**. É o script mestre de toda a produção.

```markdown
# Copy Completa — {Título do Ângulo}

## Metadados
- Ângulo: {angulo_criativo}
- Segmento: {segmento_marina} (Marina {nome_segmento}, {faixa_etaria})
- Plataforma alvo: {Reels / TikTok / Facebook / Feed}
- Formato: UGC vertical 9:16
- Persona: {descrição física e emocional da mulher no vídeo}

---

## VERSÃO 15s — Para o Sora + stories rápidos
> O Sora gera o vídeo desta versão. As outras são copy de texto.

### Script Falado
**Hook (0–3s):** "{frase que para o scroll — máx 10 palavras}"
**Corpo (3–12s):** "{dor reconhecível + resultado/protocolo — natural e direto}"
**CTA (12–15s):** "{quiz grátis / link na bio — nunca compra direta}"

### Direção Visual
| Elemento | Descrição |
|---|---|
| Cenário | {local, luz, objetos visíveis} |
| Persona | {aparência, idade, estilo, energia} |
| Câmera | {iPhone selfie / espelho / handheld} |
| On-screen text | {texto sobreposto, se houver} |

---

## VERSÃO 30s — Reels, TikTok, stories longos

### Script Falado
**Hook (0–3s):** "{mesmo hook ou variação}"
**Corpo (3–25s):** "{hook + mecanismo brevemente explicado + resultado + sem produto genérico}"
**CTA (25–30s):** "{quiz grátis + call to action direto}"

### Notas de Copy
- Intenção emocional:
- Objeção resolvida:
- Plataforma ideal:

---

## VERSÃO 1 MINUTO — Facebook feed, caption, email
> Tom "Amiga, deixa eu te contar" — íntimo, confessional, educativo.
> Estrutura: Hook de amizade → mecanismo interno → experiência pessoal → resultado → reframe → CTA suave.

### Script / Texto
"{copy longa no tom de conversa — começa com 'Amiga, deixa eu te contar...'}"

### Notas de Copy
- Plataforma ideal:
- Objeção resolvida:
- Reframe central:

---

## Variações de Hook (A/B)
| Versão | Hook alternativo |
|---|---|
| 15s A | "{hook alternativo}" |
| 30s A | "{hook alternativo}" |
| 1 min A | "{abertura alternativa}" |
```

**Regras para o Step 2:**
- **15s:** hook nos 2 primeiros segundos — curiosidade, choque suave ou identificação imediata
- **30s:** mesma abertura + mecanismo rápido (por que funciona) + resultado
- **1 min:** tom "Amiga, deixa eu te contar" — jamais propaganda, sempre conversa íntima
- Sem emojis no script falado
- CTA sempre para o quiz grátis — nunca "Compre"
- Linguagem da Marina: "a gente", "sua pele", "você", "de verdade", "sério"
- Resultados com prazo: "em 20 dias", "em 7 dias", nunca "vai melhorar"

---

### Step 3: Escrever `sora-prompt.md`

O prompt Sora tem um único objetivo: **gerar o avatar/vídeo UGC** que entrega o script do Step 2.

Seguir o padrão SORA 2 PRO — V3 rigorosamente:

```markdown
# Sora Prompt — {Título do Ângulo}

> Pronto para colar no Sora 2 Pro. Não alterar a estrutura.

---

⭐ SORA 2 PRO PROMPT — {Título em inglês}

**Technical description:**
{Descrição técnica: câmera, estilo de gravação, qualidade de imagem, movimento}

**Environment:**
{Ambiente: local, iluminação, hora do dia, contexto}

**Persona:**
{Descrição física: idade aproximada, etnia, aparência natural, roupa, expressão}

**Safety & realism constraints:**
No beauty filters. No AI smoothing. No eye drift. No facial warping. No hand distortion. Natural lip sync. One continuous take. Natural grain. Real depth of field. No cinematic grading.

**Timestamped spoken script (Portuguese BR):**
[0:00–0:03] "{hook em português}"
[0:03–0:12] "{corpo em português}"
[0:12–0:15] "{CTA em português}"

**Final realism notes:**
{Notas finais de realismo: tom emocional, movimento de câmera, comportamento natural}
```

**Regras para o Step 3:**
- Technical description, Environment, Persona: SEMPRE em inglês
- Spoken script: SEMPRE em português BR — tom coloquial, natural, pausas humanas
- Nunca pedir filtros de beleza — aparência real com imperfeições naturais
- Câmera: iPhone 15 vertical selfie mode ou handheld estabilizado suave
- Persona brasileira: cor de pele, traços e estilo compatíveis com Brasil (não estereótipo)
- Um take contínuo — sem cortes

---

### Step 4: Validar os Dois Outputs

Antes de salvar, checar:

**Copy completa:**
- [ ] Hook para o scroll em ≤ 3 segundos
- [ ] Sem tom de vendas explícito
- [ ] CTA vai para o quiz, não para compra direta
- [ ] Linguagem da Marina (não técnica demais)
- [ ] Resultado com prazo específico (quando aplicável)

**Sora prompt:**
- [ ] Em inglês (exceto dialogue)
- [ ] Persona com aparência natural e brasileira
- [ ] Nenhum filtro de beleza solicitado
- [ ] Script timestampado com pausas naturais
- [ ] Realism constraints presentes

---

### Step 5: Salvar nos Caminhos Corretos

```
docs/criativos/{angulo_criativo}/
├── copy-completa.md
└── sora-prompt.md
```

---

## Referência de Ângulos

| ID | Título | Hook tipo | Segmento ideal |
|---|---|---|---|
| quiz-hook | Descobri a idade real da minha pele | Curiosidade/choque | Jovem, Mãe |
| frustracao | Por que minha pele não melhora | Dor/identificação | Mãe, Executive |
| diagnostico-vs-produto | Parei de comprar produto e fiz isso | Contraste/revelação | Consciente, Mãe |
| protocolo-20-dias | 20 dias de protocolo personalizado | Prova/resultado | Todos |
| preco-ancora | R$29 que mudou minha pele | Âncora de preço | Mãe, Executive |

---

## Regras Gerais

- Output: SEMPRE dois arquivos `.md` por execução — nunca um sem o outro
- Nunca gerar código — apenas texto e prompts
- Persona no Sora: natural, imperfeições reais, ambiente brasileiro reconhecível
- Tom geral: descoberta, surpresa genuína, resultado — nunca propaganda
