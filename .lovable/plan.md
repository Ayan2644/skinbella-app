
# Expandir Layout e Redesenhar Projecao do Protocolo

## Resumo

A pagina de resultados esta muito estreita (max 420px) e o grafico de projecao esta comprimido. Vamos expandir o layout e redesenhar o ProjectionCard para ficar como a imagem de referencia, com grafico + antes/depois lado a lado, banner de destaque em Playfair Display, e area sombreada abaixo da curva verde.

---

## Mudancas

### 1. ResultScreen.tsx -- Expandir frame principal
- Aumentar `max-w-[420px]` para `max-w-[520px]`
- Reduzir padding das secoes de `px-4` para `px-2`

### 2. ResultCard.tsx -- Remover padding externo duplicado
- Remover o `px-5` da `<section>` wrapper (linha 15), pois quem controla o padding externo e o pai
- Isso libera ~40px de espaco horizontal para o conteudo dos cards

### 3. MeaningCard.tsx e ProjectionCard.tsx -- Remover px-5 do wrapper
- Ambos envolvem o `ResultCard` em `<section className="px-5">`, que ja tem seu proprio padding
- Remover esse padding duplicado

### 4. RejuvenationChart.tsx -- Grafico expandido e premium
- Aumentar viewBox de 320x160 para 420x200
- Aumentar maxHeight de 180 para 240
- Adicionar **area sombreada** (gradient fill) abaixo da curva verde usando `<linearGradient>` + `<path>` com fill
- Engrossar curva verde (strokeWidth 3.5)
- Pontos maiores (r=6)
- Labels maiores (fontSize 12-13)
- Trocar "Dia 1" / "Dia 20" por **"Hoje"** e **"20 dias"** com destaque
- Legenda: "Idade Biologica" (verde) e "Idade Cronologica" (dourado tracejado)

### 5. ProjectionCard.tsx -- Redesign completo

Nova estrutura interna:

```text
+-----------------------------------------------+
| Projecao com o Protocolo                       |
| Resultados estimados em 20 dias                |
+-----------------------------------------------+
|  [Grafico SVG expandido]  |  [Circulo          |
|  Curva verde com glow     |   Antes/Depois     |
|  Linha dourada tracejada  |   com divisao]     |
|  Labels: Hoje / 20 dias   |   "Evolucao"       |
+-----------------------------------------------+
|  +------------------------------------------+  |
|  | Voce pode reverter de 2 a 4 anos na      |  |
|  | aparencia da sua pele.                    |  |
|  +------------------------------------------+  |
|  (fundo #FDF8F3, fonte Playfair Display,       |
|   texto verde #4E6B57, italico)                |
+-----------------------------------------------+
|  * Plano diario guiado passo a passo           |
|  * Checklist + streak de consistencia          |
|  * Selfie semanal para comparar evolucao       |
+-----------------------------------------------+
|  [ Comecar protocolo agora ]                   |
+-----------------------------------------------+
```

Detalhes:
- **Layout lado a lado**: `flex` com grafico `flex-1` e circulo antes/depois `w-24`
- **Circulo antes/depois**: 80x80px rounded-full com borda verde sutil, dividido ao meio com texto "ANTES | DEPOIS", label "Evolucao" abaixo em uppercase tracking-widest
- **Banner de destaque**: `div` com `background: #FDF8F3`, `border: 1px solid rgba(200,169,107,0.2)`, rounded-xl, padding 16px, texto centralizado em `font-display` (Playfair Display), italico, cor `#4E6B57`, com "2 a 4 anos" em bold+underline
- **Checklist**: mantido como esta, com icones de check verde
- **Botao CTA**: mantido com estilo verde #4E6B57

---

## Detalhes Tecnicos

### Arquivos modificados (5):
1. **src/components/quiz/ResultScreen.tsx** -- max-width e padding
2. **src/components/quiz/result/ResultCard.tsx** -- remover px-5 da section
3. **src/components/quiz/result/MeaningCard.tsx** -- remover px-5 duplicado
4. **src/components/quiz/result/ProjectionCard.tsx** -- redesign completo com layout lado a lado + banner
5. **src/components/quiz/result/RejuvenationChart.tsx** -- SVG expandido com gradient fill

### Sem dependencias novas
- Tudo feito com SVG nativo, CSS e componentes React existentes

### Ganho de espaco estimado
- Frame: +100px (420 para 520)
- Padding removido: ~40px recuperados
- Total: ~140px a mais de largura util para o conteudo
