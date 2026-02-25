# Squad skinbella-copy

**Camada:** 1 — Fundação
**Agente:** Val — Copywriter especialista em saúde e beleza com foco em DR
**Foco:** Escrever todos os textos da tela de resultado, personalizados por perfil

---

## O que este squad faz

Gera o copy completo da ResultScreen do quiz SKINBELLA:
- Hero do resultado (headline + diagnóstico por perfil)
- MeaningCard (significado do diagnóstico)
- ProjectionCard (linha do tempo de resultados)
- NutrientCards (apresentação dos ativos do protocolo)
- Depoimentos/provas sociais por perfil
- Variações de CTA para A/B testing
- FAQ de objeções
- Copy do OfferCard

**Output:** Documentos `.md` em `docs/conteudo/copy-resultado/` e `docs/conteudo/resultado/`
**Nunca:** Gera código, instrui implementação ou cria claims sem validação científica

---

## Agente

### Val — copywriter
Ativar com: `@skinbella-copy`

**Comandos:**
- `*escrever-hero` — HeroResult por perfil
- `*escrever-significado` — MeaningCard por perfil
- `*escrever-projecao` — ProjectionCard (linha do tempo)
- `*escrever-nutrientes` — NutrientCards por ativo + perfil
- `*escrever-depoimentos` — Provas sociais por perfil
- `*escrever-cta` — Variações de CTA para A/B
- `*escrever-faq` — FAQ de objeções
- `*escrever-oferta` — OfferCard copy

---

## Dependências

Depende de: **skinbella-diagnostico** (claims validados, substâncias, perfis)

---

## Outputs Gerados

| Documento | Path | Status |
|-----------|------|--------|
| Hero por perfil | `docs/conteudo/copy-resultado/hero-por-perfil.md` | ✅ v1.0 — revisar |
| Significado por perfil | `docs/conteudo/copy-resultado/significado-por-perfil.md` | ✅ v1.0 — revisar |
| Projeção por perfil | `docs/conteudo/copy-resultado/projecao-por-perfil.md` | ✅ v1.0 — revisar |
| Nutrientes copy | `docs/conteudo/copy-resultado/nutrientes-copy.md` | ✅ v1.0 — revisar |
| CTA variações | `docs/conteudo/copy-resultado/cta-variacoes.md` | ✅ v1.0 — revisar |
| Provas sociais | `docs/conteudo/resultado/provas-sociais.md` | ✅ v1.0 — revisar |
| FAQ resultado | `docs/conteudo/resultado/faq-resultado.md` | ✅ v1.0 — revisar |
| Oferta copy | `docs/conteudo/resultado/oferta-copy.md` | ✅ v1.0 — revisar |

---

## ⚠️ Bloqueador Ativo

**Preço inconsistente: R$19/mês vs R$29/mês**
Decisão necessária antes de validar copy de oferta e CTA com preço.

---

## Regras Globais

- Todos os outputs são documentos Markdown (.md) APENAS
- Nenhum squad gera ou modifica código
- Validação humana obrigatória antes de qualquer handoff ao @dev
- Tom de voz: consultar `refs-tom-de-voz.md` sempre
