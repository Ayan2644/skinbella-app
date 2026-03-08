

## Plano: Novo tipo de pergunta "Face Map" com animação SVG

### O que vamos criar

Um novo tipo de pergunta `face-map` que exibe uma imagem de rosto ao lado das opções. Ao selecionar uma opção, uma linha SVG animada "desenha" do item até a região correspondente no rosto, com um ponto de destaque final — exatamente como no quiz Lovi.

### Arquitetura

```text
QuestionRenderer
  └── case 'face-map' → <FaceMapQuestion />
        ├── SVG com imagem de rosto (feminino/masculino baseado em resposta anterior)
        ├── Pontos de destaque por região (testa, olhos, nariz, boca, pescoço)
        ├── Linhas SVG com stroke-dashoffset animation
        └── Lista de opções (multi-select) à direita
```

### Etapas de implementação

1. **Adicionar tipo `face-map` ao sistema de tipos** (`quizData.ts`)
   - Adicionar `'face-map'` ao union type `QuestionType`
   - Adicionar campo opcional `faceRegion` ao `QuizOption` (valores: `whole_face`, `forehead`, `eyebrows`, `eyes`, `nose`, `mouth`, `neck`)

2. **Criar componente `FaceMapQuestion`** (`src/components/quiz/FaceMapQuestion.tsx`)
   - Layout: imagem do rosto à esquerda (~40%), opções à direita (~60%)
   - Imagem do rosto como SVG container com uma foto de referência embutida (ou asset estático)
   - Para cada opção, definir coordenadas SVG da região facial e o path da linha curva
   - Animação: `stroke-dasharray: 1; stroke-dashoffset` transição de 1→0 via CSS transition
   - Ponto circular no final da linha com scale animation
   - Multi-select: múltiplas linhas podem estar ativas simultaneamente
   - Cor de destaque: rosa/primary quando selecionado, com contorno na região do rosto

3. **Registrar no `QuestionRenderer.tsx`**
   - Adicionar case `'face-map'` apontando para o novo componente

4. **Adicionar assets de rosto**
   - Usar uma ilustração SVG clean de rosto feminino (estilo line-art/minimalista) como asset
   - Alternativa: foto com recorte clean como no Lovi (podemos usar uma foto stock placeholder)

5. **Atualizar pergunta "Áreas para melhorar" na predefinição Lovi Skincare**
   - Alterar type de `multi-chips` para `face-map` na pergunta `areas_melhorar`
   - Adicionar `faceRegion` a cada opção

6. **Adicionar ao editor de quiz**
   - Incluir `face-map` na lista de tipos disponíveis no dropdown do Quiz Editor

### Detalhes da animação SVG

- Cada região do rosto tem coordenadas fixas (ex: testa = `{x: 120, y: 80}`)
- Cada opção na lista tem uma posição Y calculada
- O path SVG é uma curva Bézier do centro-direito da opção até o ponto facial
- `pathLength="1"` + `stroke-dasharray="1"` + transição de `stroke-dashoffset: 1 → 0`
- Duração: 400ms ease-out
- Ponto final: `scale(0) → scale(1)` com delay de 300ms

### Mapa de regiões faciais (coordenadas relativas ao SVG viewBox)

```text
whole_face  → contorno geral (borda rosa ao redor)
forehead    → (160, 60)
eyebrows    → (160, 105)
eyes        → (160, 130)
nose        → (160, 175)
mouth       → (160, 220)
neck        → (160, 290)
```

