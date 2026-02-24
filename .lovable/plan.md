

# Editor de Pagina Profissional (Estilo Elementor) - Pagina de Resultado do Quiz

## Visao Geral

Criar um editor visual completo na area admin para customizar a pagina de resultado do quiz. O editor permitira drag-and-drop de blocos, edicao de textos, fontes, cores, tamanhos, upload de imagens e um elemento de codigo customizado -- tudo salvo no banco de dados.

---

## Arquitetura

O sistema tera 3 partes:

```text
+------------------+       +------------------+       +-------------------+
|  ADMIN           |       |  BANCO DE DADOS  |       |  RESULTADO QUIZ   |
|  Page Builder     | --->  |  page_blocks     | <---  |  Renderer          |
|  (drag-and-drop)  |       |  page_assets     |       |  (le do DB e       |
|  /app/admin/      |       |  Storage bucket  |       |   renderiza)       |
|  page-editor      |       |                  |       |  ResultScreen.tsx   |
+------------------+       +------------------+       +-------------------+
```

### Fluxo:
1. Admin abre o editor, carrega os blocos do banco
2. Edita visualmente (arrastar, editar texto, subir imagem, mudar estilo)
3. Salva no banco
4. Quando um usuario completa o quiz, o ResultScreen le os blocos do banco e renderiza dinamicamente
5. Se nao houver blocos salvos, exibe o layout hardcoded atual como fallback

---

## Banco de Dados

### Tabela: `page_blocks`

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | uuid | PK |
| page_id | text | Identificador da pagina (ex: "quiz_result") |
| block_type | text | Tipo do bloco (heading, text, image, button, spacer, chart, code, offer, testimonials, faq, divider) |
| sort_order | integer | Posicao no layout |
| content | jsonb | Conteudo do bloco (texto, URL da imagem, codigo, etc.) |
| styles | jsonb | Estilos (fontSize, fontFamily, color, bgColor, padding, margin, borderRadius, textAlign, maxWidth) |
| is_visible | boolean | Se o bloco esta visivel na pagina |
| created_at | timestamptz | |
| updated_at | timestamptz | |

Exemplo de `content` por tipo:
- **heading**: `{ "text": "Seu Resultado", "level": "h1" }`
- **text**: `{ "text": "Baseado na analise de 12 fatores", "html": false }`
- **image**: `{ "src": "https://...", "alt": "Foto", "objectFit": "cover" }`
- **button**: `{ "text": "Comecar agora", "action": "checkout", "icon": "sparkles" }`
- **spacer**: `{ "height": 32 }`
- **chart**: `{ "chartType": "rejuvenation", "config": {} }`
- **code**: `{ "html": "<div>...</div>", "css": "...", "description": "Widget customizado" }`
- **offer**: `{ "title": "...", "price": "29", "originalPrice": "59", "items": [...] }`
- **testimonials**: `{ "items": [{ "name": "Ana", "text": "...", "stars": 5 }] }`
- **faq**: `{ "items": [{ "q": "...", "a": "..." }] }`
- **divider**: `{ "style": "line" | "dots" | "gradient" }`

### RLS Policies:
- SELECT: admins podem ler, usuarios anonimos tambem podem ler (para renderizar a pagina)
- INSERT/UPDATE/DELETE: apenas admins

### Storage Bucket: `page-assets`
- Bucket publico para imagens uploadadas pelo editor
- RLS: admins podem fazer upload, todos podem ler

---

## Interface do Editor (Admin)

### Nova rota: `/app/admin/page-editor`

Layout em 3 colunas:

```text
+------------+------------------------+--------------+
|  BLOCOS    |   CANVAS / PREVIEW     |  PROPRIEDADES|
| (toolbar)  |   (drag-and-drop)      |  (sidebar)   |
|            |                        |              |
| + Heading  |  [Bloco 1: Heading]    | Texto: ___   |
| + Texto    |  [Bloco 2: Image  ]    | Fonte: ___   |
| + Imagem   |  [Bloco 3: Chart  ]    | Cor:   ___   |
| + Botao    |  [Bloco 4: Offer  ]    | Tamanho: ___ |
| + Espaco   |  [Bloco 5: FAQ    ]    | Padding: ___ |
| + Grafico  |  [Bloco 6: Button ]    | BG: ___      |
| + Codigo   |                        | Visivel: [x] |
| + Oferta   |                        |              |
| + Depoimt  |                        |              |
| + FAQ      |                        |              |
| + Divisor  |                        |              |
+------------+------------------------+--------------+
```

### Funcionalidades:
1. **Toolbar esquerda**: Lista de tipos de bloco para adicionar (clique para inserir no canvas)
2. **Canvas central**: Lista vertical dos blocos com drag-and-drop (@dnd-kit, ja instalado)
3. **Sidebar direita**: Painel de propriedades do bloco selecionado
   - Editor de texto (input/textarea)
   - Seletor de fonte (Playfair Display, Inter, system)
   - Seletor de cor (input color)
   - Tamanho da fonte (slider/input)
   - Padding e margem
   - Cor de fundo
   - Alinhamento do texto
   - Largura maxima
   - Toggle de visibilidade
   - Botao de deletar bloco
4. **Upload de imagens**: Usa o Storage bucket para subir imagens diretamente
5. **Elemento de codigo**: Textarea com HTML/CSS que sera renderizado via dangerouslySetInnerHTML (com sanitizacao basica)
6. **Preview**: Os blocos no canvas mostram uma pre-visualizacao aproximada

### Barra superior:
- Botao "Salvar" (salva todos os blocos no banco)
- Botao "Restaurar padrao" (apaga os blocos e volta ao layout hardcoded)
- Botao "Visualizar" (abre a pagina de resultado em nova aba com preview)

---

## Renderer (ResultScreen)

O `ResultScreen.tsx` sera atualizado para:
1. Fazer fetch dos blocos da tabela `page_blocks` onde `page_id = 'quiz_result'` e `is_visible = true`, ordenados por `sort_order`
2. Se encontrar blocos, renderiza dinamicamente usando um componente `BlockRenderer`
3. Se nao encontrar (tabela vazia), renderiza o layout hardcoded atual como fallback

### BlockRenderer
Componente que recebe um bloco e renderiza baseado no `block_type`:
- `heading` -> `<h1>`, `<h2>`, etc. com estilos customizados
- `text` -> `<p>` com estilos
- `image` -> `<img>` com estilos
- `button` -> `<Button>` com acao configuravel
- `spacer` -> `<div>` com altura fixa
- `chart` -> Renderiza o `RejuvenationChart` existente, passando skinAge do perfil
- `code` -> `<div dangerouslySetInnerHTML>` com CSS inline
- `offer` -> Renderiza card de oferta com dados do bloco
- `testimonials` -> Renderiza depoimentos do bloco
- `faq` -> Renderiza FAQ do bloco
- `divider` -> Linha decorativa

Variaveis dinamicas no texto (substituidas em runtime):
- `{{skinAge}}` -> idade da pele do usuario
- `{{hidratacao}}` -> score de hidratacao
- `{{textura}}` -> score de textura

---

## Arquivos a Criar/Modificar

### Novos arquivos (7):
1. `src/pages/admin/PageEditor.tsx` -- Pagina principal do editor
2. `src/components/page-editor/BlockToolbar.tsx` -- Toolbar lateral de tipos de bloco
3. `src/components/page-editor/BlockCanvas.tsx` -- Canvas central com drag-and-drop
4. `src/components/page-editor/BlockProperties.tsx` -- Sidebar de propriedades
5. `src/components/page-editor/BlockPreview.tsx` -- Preview de cada bloco no canvas
6. `src/components/page-editor/BlockRenderer.tsx` -- Renderizador para producao
7. `src/hooks/usePageBlocks.ts` -- Hook para CRUD de blocos (React Query + Supabase)

### Arquivos modificados (3):
1. `src/App.tsx` -- Adicionar rota `/app/admin/page-editor`
2. `src/pages/AppShell.tsx` -- Adicionar item no menu admin
3. `src/components/quiz/ResultScreen.tsx` -- Integrar com BlockRenderer (fallback para layout atual)

### Migracao SQL (1):
- Criar tabela `page_blocks` com RLS
- Criar bucket `page-assets`

---

## Ordem de Implementacao

1. Migracoes SQL (tabela + bucket + RLS)
2. Hook `usePageBlocks` (CRUD)
3. `BlockRenderer` (renderizador de producao)
4. Atualizar `ResultScreen` para usar blocos dinamicos
5. Componentes do editor (Toolbar, Canvas, Properties, Preview)
6. Pagina `PageEditor` montando os 3 paineis
7. Rotas e navegacao

