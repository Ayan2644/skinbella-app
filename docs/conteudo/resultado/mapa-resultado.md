# Mapa da Tela de Resultado — ResultScreen v2.0

> **Squad:** Resultado & Conversão (Gabi — CRO Specialist)
> **Propósito:** Estrutura completa de cada seção da ResultScreen com objetivo de conversão e copy a usar.
> **Regra:** Cada seção tem uma função específica no funil. Nada é decorativo.

---

## Estrutura Geral da ResultScreen

```
┌─────────────────────────────────────────────────┐
│  1. HeroResult                    [DIAGNÓSTICO]  │
│  2. MeaningCard                   [EDUCAÇÃO]     │
│  3. ProjectionCard                [DESEJO]       │
│  4. ProtocolBrandCard             [CREDIBILIDADE]│
│  5. NutrientCard × 4             [ESPECIFICIDADE]│
│  6. LockedReportCard              [CURIOSIDADE]  │
│  7. OfferCard                     [CONVERSÃO]    │
│  8. Testimonials                  [PROVA SOCIAL] │
│  9. MiniFAQ                       [OBJEÇÕES]     │
│ 10. Sticky CTA                    [AÇÃO CONTÍNUA]│
└─────────────────────────────────────────────────┘
```

---

## SEÇÃO 1 — HeroResult

**Objetivo de conversão:** Criar o choque de diagnóstico + identificação imediata

**Copy a usar:** `hero-por-perfil.md`

**Estrutura:**
```
[Label]   SEU RESULTADO
[H1]      Idade da sua pele: {skinAge} anos
[Sub]     Baseado na análise de {n} fatores
[Badge]   Perfil: {nome_do_perfil}
[Headline diagnóstico personalizada — por perfil]
[Scores visuais: Hidratação {%} + Textura {%}]
```

**Hipótese de A/B:**
- Mostrar `{skinAge - realAge} anos a mais` em destaque vermelho vs. neutro → impacto emocional
- Mostrar todos os 6 scores vs. apenas 2 → engajamento/scroll depth

**Métrica:** Scroll depth para seção 2 (≥ 80% = HeroResult funcionou)

---

## SEÇÃO 2 — MeaningCard

**Objetivo de conversão:** Educação que gera identificação — "isso é exatamente o meu caso"

**Copy a usar:** `significado-por-perfil.md`

**Estrutura:**
```
[H3]    O que isso significa para você
[Bullet 1]  🔬 Dado científico específico com score real
[Bullet 2]  ⚡/☀️  A causa fisiológica (nunca culpa)
[Bullet 3]  ✓  O que é reversível + prazo
[Frase de validação — por perfil]
```

**Hipótese de A/B:**
- 3 bullets vs. accordion expansível → qual gera mais leitura completa?
- Badge "Baseado em ciência" ao lado do título → credibilidade

**Métrica:** Tempo na seção (≥ 15s = leitura completa)

---

## SEÇÃO 3 — ProjectionCard

**Objetivo de conversão:** Criar desejo específico com timeline real — "quero esse resultado"

**Copy a usar:** `projecao-por-perfil.md`

**Estrutura:**
```
[Label]   COM O PROTOCOLO SKINBELLA
[H2]      O que muda — e quando
[Timeline visual]
  D7  → Primeiro resultado (invisível mas acontece)
  D20 → Resultado visível
  D60 → Transformação consistente
[Frase de ancoragem por perfil]
[Nota científica — subtexto]
```

**Hipótese de A/B:**
- Timeline visual (gráfico) vs. bullets de texto → qual gera mais urgência?
- Mostrar "D3" como marco imediato → reduz "demora muito"

**Métrica:** Clique no CTA após seção 3 (usuárias que convertem "cedo")

---

## SEÇÃO 4 — ProtocolBrandCard

**Objetivo de conversão:** Construir credibilidade do produto antes da oferta

**Copy:**
```
[Logo SKINBELLA]
[H3]    O protocolo que age em duas frentes

[Coluna 1]  SKINBELLA Caps
            → Nutre de dentro
            → {2-3 nutrientes do perfil}

[Coluna 2]  SKINBELLA Sérum
            → Age por fora
            → {2-3 ativos do perfil}

[Sub]   Formulado especificamente para o Perfil {nome}.
        Não é genérico — é o seu.

[Badge] 🇧🇷 Fabricado no Brasil — ANVISA
[Badge] 🔬 Ativos com evidência científica publicada
```

**Hipótese de A/B:**
- Mostrar ingredientes específicos do perfil vs. lista geral → personalização percebida

**Métrica:** Clique em "saiba mais sobre os ingredientes" (engajamento de produto)

---

## SEÇÃO 5 — NutrientCards (×4)

**Objetivo de conversão:** Especificidade que justifica o preço — "eu entendo por que preciso disso"

**Copy a usar:** `nutrientes-copy.md`

**Estrutura por card:**
```
[Ícone do nutriente]
[Nome]         Colágeno Hidrolisado
[Badge]        CAPS / SÉRUM
[Por que você] Frase personalizada por perfil
[O que sentir] Resultado esperado
[Prazo]        Em X semanas
```

**Ordem dos cards:** Nutriente primário do perfil primeiro, depois os de suporte

**Hipótese de A/B:**
- 4 cards vs. carrossel infinito → qual gera mais leitura?
- "O que você vai sentir" em destaque vs. subtexto → identificação emocional

**Métrica:** Cards abertos vs. scrollados (engajamento por ativo)

---

## SEÇÃO 6 — LockedReportCard

**Objetivo de conversão:** Criar curiosidade pelo que está bloqueado — FOMO de conteúdo

**Copy a usar:** `oferta-copy.md` (seção LockedReportCard)

**Estrutura:**
```
[H3]    Seu relatório completo de pele está pronto

[Itens bloqueados — com cadeado visual:]
  🔒  Análise detalhada de 6 scores da sua pele
  🔒  Rotina personalizada manhã e noite (com horários)
  🔒  Dieta específica para o seu perfil
  🔒  Projeção de 90 dias com marcos de progresso
  🔒  Recomendação de nutrientes com dosagem

[CTA inline]  Desbloquear com o protocolo → R$19/mês

[Sub]  Tudo baseado nos {n} fatores que você respondeu.
       Não é genérico — é exatamente o seu caso.
```

**Hipótese de A/B:**
- 5 itens bloqueados vs. 3 → qual cria mais desejo?
- Animação de "desbloqueio" ao passar o cursor → engajamento

**Métrica:** Cliques no CTA inline desta seção

---

## SEÇÃO 7 — OfferCard

**Objetivo de conversão:** Converter — esta é a seção de fechamento principal

**Copy a usar:** `oferta-copy.md`

**Estrutura:**
```
[Badge]   PARA VOCÊ

[H2]      Seu protocolo {perfil} — começa hoje

[Itens inclusos:]
  ✓  SKINBELLA Caps — {nutrientes primários}
  ✓  SKINBELLA Sérum — {ativos do perfil}
  ✓  Rotina personalizada manhã e noite
  ✓  Hub de acompanhamento — check-in diário
  ✓  Acesso à equipe — WhatsApp em até 2h
  ✓  Garantia de 30 dias

[Preço]   R$19/mês
[Sub]     Menos que um hidratante de farmácia.
          Cancele quando quiser.

[CTA Principal]   Começar meu protocolo
[Sub CTA]         30 dias de garantia total

[Badges de confiança]
  ✓ Formulado por especialistas
  🔬 Evidência científica
  🇧🇷 ANVISA  |  ♻️ Sustentável
```

**Hipótese de A/B:**
- CTA "Começar meu protocolo" vs. "Quero minha pele em 30 dias" → conversão
- Mostrar preço antes vs. depois da lista de itens → resistência de preço
- Urgência suave ("diagnóstico válido por 24h") vs. sem urgência → conversão

**Métrica:** Taxa de clique no CTA principal (conversão primária)

---

## SEÇÃO 8 — Testimonials

**Objetivo de conversão:** Prova social — "outras mulheres como eu viram resultado"

**Copy a usar:** `provas-sociais.md`

**Estrutura:**
```
[H3]    O que mulheres com o mesmo perfil estão dizendo

[Card 1 — depoimento do perfil da usuária]
  [Foto]  [Nome, Idade]  [Badge: Perfil de pele]
  [Citação — 2-4 frases]
  [Resultado em bold]
  [Tempo de uso]

[Card 2 — depoimento complementar]

[Social proof count]
  "Mais de 2.400 mulheres já usam o protocolo SKINBELLA"
```

**Regra de seleção:** Mostrar 2 depoimentos do perfil identificado. Se perfil misto: 1 de cada dor principal.

**Hipótese de A/B:**
- Depoimentos por perfil específico vs. depoimentos gerais → conversão
- Foto real vs. avatar → credibilidade percebida

**Métrica:** Clique no CTA após seção de depoimentos (conversão "tardia")

---

## SEÇÃO 9 — MiniFAQ

**Objetivo de conversão:** Quebrar as últimas objeções antes do CTA final

**Copy a usar:** `faq-resultado.md`

**Estrutura:**
```
[H3]    Perguntas frequentes

[Accordion — 5 perguntas padrão:]
  1. O que está incluído no protocolo?
  2. Quanto tempo para ver resultado?
  3. Posso usar junto com o que já uso?
  4. E se não funcionar para mim?
  5. Como funciona o pagamento?

[Perguntas adicionais por perfil:]
  → Acne Hormonal: "Isso não é tratamento médico..."
  → Manchas: "Já usei Vitamina C antes..."
  → Envelhecimento: "Não seria melhor botox?"
  → Sensível: "Tenho medo de reação..."

[CTA pós-FAQ]  Começar com garantia de 30 dias →
```

**Hipótese de A/B:**
- 5 perguntas genéricas vs. 3 genéricas + 2 do perfil → relevância
- FAQ em accordion vs. texto expandido → leitura completa

**Métrica:** Taxa de expansão de accordions + clique no CTA pós-FAQ

---

## SEÇÃO 10 — Sticky CTA

**Objetivo de conversão:** Manter CTA visível em todo momento do scroll

**Copy a usar:** `cta-variacoes.md` (seção Sticky CTA)

**Estrutura:**
```
[Barra fixa no rodapé]
[Left]  SKINBELLA Protocolo Personalizado
[Right] [CTA] Começar → R$19/mês

Variações para A/B:
  A: "Ativar protocolo — R$19/mês"
  B: "Começar agora — 30 dias de garantia"
  C: "Ver meu plano completo →"
  D: "Protocolo completo por menos que um hidratante"
```

**Regra:** Sticky CTA some apenas quando OfferCard está visível (não competir com ele).

**Métrica:** Taxa de clique no sticky vs. no OfferCard (qual converte mais?)

---

## Fluxo de Conversão Ideal

```
HeroResult → choque emocional (skinAge)
    ↓ scroll
MeaningCard → "isso faz sentido, sou eu"
    ↓ scroll
ProjectionCard → "quero esse resultado em 20 dias"
    ↓ scroll
NutrientCards → "entendo por que preciso disso"
    ↓ scroll
LockedReport → "quero ver o que está bloqueado"
    ↓ clique no CTA inline OR continua scrollando
OfferCard → CONVERSÃO PRIMÁRIA
    ↓ se não converteu
Testimonials → "outras como eu conseguiram"
    ↓ se ainda não converteu
MiniFAQ → última objeção quebrada
    ↓ clique no CTA pós-FAQ
CONVERSÃO TARDIA
```

---

## Gaps Identificados vs. ResultScreen Atual

| Seção atual | Status v1 | v2.0 |
|---|---|---|
| HeroResult | ✓ Existe | Personalizar por perfil (hoje hardcoded) |
| MeaningCard | ✓ Existe | Copy personalizada por perfil |
| ProjectionCard | ✓ Existe | Marcos D7/D20/D60 por perfil |
| ProtocolBrandCard | ✓ Existe | Mostrar ativos específicos do perfil |
| NutrientCards | ✓ Existe | Copy de benefício por perfil |
| LockedReportCard | ✓ Existe | Itens desbloqueáveis mais específicos |
| OfferCard | ✓ Existe | CTA personalizada, preço correto (R$19 vs R$29) |
| Testimonials | ✓ Existe | Segmentar por perfil detectado |
| MiniFAQ | ✓ Existe | Adicionar perguntas do perfil |
| Sticky CTA | ✓ Existe | Testar variações por perfil |
| **Exit Intent** | ❌ Não existe | Implementar popup ao sair |

**Nota crítica:** Preço inconsistente — `ESSENCIAL.md` diz R$19/mês, `OfferCard.tsx` mostra R$29/mês. **Decisão necessária antes de qualquer validação.**
