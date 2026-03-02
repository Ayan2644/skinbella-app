# Criativos de Anúncio — Skinbella

> Gerenciado pelo agente `@sora-skinbella` (Ari) com a task `create-ad-creative.md`.

---

## Como funciona

Cada criativo tem **dois arquivos** e **três durações**:

### Arquivos por criativo

| Arquivo | Descrição | Uso |
|---|---|---|
| `copy-completa.md` | Copy em texto com as 3 versões (15s, 30s, 1 min) | Principal — validação humana, briefing, legenda |
| `sora-prompt.md` | Prompt Sora 2 Pro V3 — **só os primeiros 15s** | Colar no Sora para gerar o avatar/vídeo UGC |

### As 3 durações

| Duração | Formato | Produção | Uso |
|---|---|---|---|
| **15s** | Hook + CTA | **Sora gera o vídeo** | Stories, TikTok feed, pre-roll |
| **30s** | Hook + mecanismo rápido + CTA | Copy texto + vídeo UGC/avatar | Reels, TikTok, Facebook video |
| **1 min** | Storytelling "Amiga, deixa eu te contar" | Copy texto — caption, legenda, post | Facebook feed, email, caption longo |

> **O Sora não gera o vídeo inteiro.** Ele gera o avatar para os 15s do hook. O restante é copy que vai como legenda, voiceover ou script para a criadora gravar.

---

## 5 Ângulos Criativos

| Pasta | Ângulo | Segmento | Plataforma Principal |
|---|---|---|---|
| `criativo-01-quiz-hook/` | Descobri a idade real da minha pele | Jovem 22–28 | Reels, TikTok |
| `criativo-02-frustracao/` | Por que minha pele não melhora | Mãe 30–38 | Facebook, Reels |
| `criativo-03-diagnostico-vs-produto/` | Parei de comprar produto e fiz isso | Consciente 25–35 | TikTok, Reels |
| `criativo-04-protocolo-20-dias/` | 20 dias de protocolo personalizado | Mãe 30–38 | Facebook, Feed |
| `criativo-05-preco-ancora/` | R$29 que mudou minha pele | Executive 35–45 |
| `criativo-06-colageno-interno/` | Sua pele não envelhece por falta de creme | Mãe 30–38 | Facebook, Reels |

---

## Como usar o Sora prompt

1. Abrir `sora-prompt.md` do criativo
2. Copiar o bloco inteiro que começa com `⭐ SORA 2 PRO PROMPT`
3. Colar no Sora 2 Pro
4. O Sora gera o vídeo de 15s com a mulher brasileira entregando o hook
5. Esse vídeo é o início do criativo — o restante da copy vai como legenda ou continua em outro formato

---

## Como gerar novos criativos

```
@sora-skinbella
*criar-criativo {angulo} {segmento}
```

Exemplos:
```
*criar-criativo quiz-hook jovem
*criar-criativo frustracao mae
*criar-criativo protocolo-20-dias executive
```

---

## Status dos Criativos

| Criativo | Copy (3 durações) | Sora Prompt (15s) | Revisão humana |
|---|---|---|---|
| 01 — quiz-hook (jovem) | ✅ | ✅ | ⏳ pendente |
| 02 — frustracao (mae) | ✅ | ✅ | ⏳ pendente |
| 03 — diagnostico-vs-produto (consciente) | ✅ | ✅ | ⏳ pendente |
| 04 — protocolo-20-dias (mae) | ✅ | ✅ | ⏳ pendente |
| 05 — preco-ancora (executive) | ✅ | ✅ | ⏳ pendente |
| 06 — colageno-interno (mae) | ✅ | ✅ | ⏳ pendente |
