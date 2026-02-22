

# Redesign Completo da Pagina de Resultados do Quiz

## Objetivo
Transformar a pagina de resultados do quiz em uma experiencia visual premium de alta conversao, seguindo fielmente as referencias fornecidas com fundo marmorizado rose, paleta verde salvia + dourado, graficos de rejuvenescimento e imagens antes/depois.

---

## 1. Fundo e Atmosfera Global

**Arquivo: `src/index.css`**
- Adicionar gradiente radial dourado + linear porcelana como fundo da pagina de resultado
- Adicionar classe CSS para textura marmorizada sutil (overlay com opacidade ~6%)
- Ajustar variaveis CSS se necessario para acomodar os novos tons

**Cores-chave da referencia:**
- Fundo base: `#F6F2ED` (ja proximo do atual)
- Cards: `#FFFFFF` com borda `rgba(0,0,0,0.05)` e sombra `0 4px 20px rgba(0,0,0,0.05)`
- Verde assinatura: `#4E6B57` (botoes e CTA)
- Dourado suave: `#C8A96B` (badges, estrelas, bullets)

---

## 2. Geracao de Imagens via IA

Usar o modelo `google/gemini-2.5-flash-image` atraves de uma Edge Function para gerar e salvar no storage as seguintes imagens:

| Imagem | Descricao | Uso |
|--------|-----------|-----|
| Antes/Depois | Rosto feminino maduro, iluminacao suave, fundo neutro | MeaningCard e Testimonials |
| Produtos flat-lay | Composicao SkinBella com flores, fundo creme, estetica luxo natural | Bloco entre Projecao e Oferta |
| Testimonial antes/depois 1 | Mulher loira, dia 1 vs dia 30 | Card de depoimento |
| Testimonial antes/depois 2 | Mulher morena, dia 1 vs dia 30 | Card de depoimento |

As imagens serao geradas uma vez e salvas como assets estaticos no projeto (`src/assets/result/`).

---

## 3. Componentes Redesenhados

### 3.1 `ResultCard.tsx` (base)
- Atualizar para: fundo branco, borda `rgba(0,0,0,0.05)`, sombra `0 4px 20px rgba(0,0,0,0.05)`, radius 24px
- Gradiente sutil interno: `linear-gradient(145deg, #FFFFFF, #F3EEE8)`

### 3.2 `HeroResult.tsx`
- Circulo central: 180x180px com gradiente porcelana `linear-gradient(145deg, #FFFFFF, #EFE8E1)`, sombra `0 10px 40px rgba(0,0,0,0.06)`
- Numero: 64px Playfair Display
- Metricas (Hidratacao/Textura): card horizontal unico com divisao central por linha vertical, numeros 36px Playfair

### 3.3 `MeaningCard.tsx`
- Layout dividido: texto com bullets a esquerda, imagem antes/depois a direita
- Bullets com bolinha dourada (#C8A96B) 6px
- Fotos antes/depois com radius 16px, sombra leve, legendas "Antes" e "Depois: 20 dias"

### 3.4 `ProjectionCard.tsx` (Novo: Grafico de Rejuvenescimento)
- Grafico SVG customizado com:
  - Fundo creme claro com linhas horizontais 10% opacidade
  - Curva Bezier principal em verde `#4E6B57`, espessura 3px
  - Linha comparativa dourada tracejada
  - Pontos finais: circulos preenchidos 8px
  - Legendas: Dia 1 / Dia 10 / Dia 20
  - Valores dinamicos baseados em skinAge (ex: 56 -> 51)
- Manter checklist abaixo com icones de check verdes
- Botao CTA verde escuro `#4E6B57` com texto branco

### 3.5 Novo: `ProductShowcaseCard.tsx`
- Imagem flat-lay de produtos gerada por IA
- Card com radius 24px, sem texto extra - apenas visual aspiracional

### 3.6 `OfferCard.tsx`
- Titulo: "Relatorio completo bloqueado" em Playfair 32px
- Badge dourado "-52% HOJE" com radius 999px
- Preco: R$59 riscado + R$29 em Playfair 44px
- Botao verde escuro largura total, 56px altura
- Trust badges abaixo (Checkout seguro, Acesso imediato, Suporte)

### 3.7 `Testimonials.tsx`
- Cards com fotos antes/depois lado a lado (pequenas, com label "Dia 1" e "Dia 30")
- Estrelas douradas (#C8A96B)
- Layout: foto a esquerda, texto + estrelas a direita

### 3.8 `MiniFAQ.tsx`
- Cards brancos, padding 28px, radius 20px
- Pergunta: 18px Inter bold
- Resposta: 16px Inter normal

### 3.9 `ProtocolBrandCard.tsx` e `LockedReportCard.tsx`
- Serao absorvidos/fundidos nos novos blocos (OfferCard e ProductShowcase)

---

## 4. `ResultScreen.tsx` - Nova Ordem

```text
1. HeroResult (circulo + metricas)
2. MeaningCard (diagnostico + antes/depois)
3. ProjectionCard (grafico SVG + checklist + CTA)
4. ProductShowcaseCard (imagem produtos)
5. OfferCard (relatorio bloqueado + preco + CTA)
6. Testimonials (com fotos antes/depois)
7. MiniFAQ
8. Sticky CTA (botao verde no rodape)
```

---

## 5. Sticky CTA Redesenhado
- Fundo com blur porcelana
- Botao verde escuro `#4E6B57` com radius 20px
- Preco e desconto ao lado esquerdo

---

## Detalhes Tecnicos

- **Imagens**: Geradas via Edge Function usando `google/gemini-2.5-flash-image`, convertidas de base64 para arquivos PNG e colocadas em `src/assets/result/`
- **Grafico SVG**: Componente React puro com `<svg>`, paths Bezier e animacao CSS para a curva
- **CSS**: Ajustes no `index.css` para adicionar gradientes globais e classe `.result-bg` com textura marmorizada
- **Sem dependencias novas**: Tudo feito com SVG nativo, CSS e React
- **Componentes removidos**: `ProtocolBrandCard.tsx` e `LockedReportCard.tsx` serao removidos (funcionalidade absorvida)
- **Componentes novos**: `ProductShowcaseCard.tsx`, `RejuvenationChart.tsx` (SVG)

