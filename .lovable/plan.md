

# Plano: Preview Admin da Pagina de Resultado

## Problema

O admin precisa refazer o quiz inteiro toda vez que quer ver como a pagina de resultado esta ficando apos editar no Page Editor. Nao existe atalho para pular direto ao resultado.

## Solucao

Criar uma rota `/admin-preview` que renderiza o `ResultScreen` com um perfil fake (mock), acessivel apenas por admins. Adicionar um botao "Visualizar Resultado" no Page Editor que navega para essa rota internamente (usando react-router, sem sair do app).

## Implementacao

### 1. Criar pagina `src/pages/admin/ResultPreview.tsx`
- Importa `ResultScreen` diretamente
- Gera um perfil mock com dados realistas (skinAge: 32, scores medios)
- Renderiza `ResultScreen` passando `profile`, `onRedo` (volta ao editor), `onAccess` (noop/toast)
- Adiciona barra flutuante no topo: "MODO PREVIEW — Admin" com botao "Voltar ao Editor"

### 2. Adicionar rota em `src/App.tsx`
- Nova rota: `<Route path="admin/result-preview" element={<AdminRoute><ResultPreview /></AdminRoute>} />`
- Dentro do bloco `/app` existente, ao lado das outras rotas admin

### 3. Adicionar botao no Page Editor (`src/pages/admin/PageEditor.tsx`)
- Botao "👁 Visualizar" ao lado dos botoes existentes (Salvar, Restaurar)
- Usa `navigate('/app/admin/result-preview')` (navegacao interna, nao abre Lovable)

### Perfil Mock
```typescript
const MOCK_PROFILE = {
  skinAge: 32,
  scores: {
    manchas: 6,
    textura: 5,
    elasticidade: 7,
    poros: 4,
    oleosidade: 6,
    hidratacao: 5,
  },
  prioridadesTop3: ['manchas', 'textura', 'hidratacao'],
  nutrientesTop4: [],
  rotina: { manha: [], noite: [] },
  dieta: { priorizar: [], reduzir: [], plano: [] },
};
```

## Arquivos

| Arquivo | Acao |
|---------|------|
| `src/pages/admin/ResultPreview.tsx` | Criar |
| `src/App.tsx` | Adicionar rota |
| `src/pages/admin/PageEditor.tsx` | Adicionar botao "Visualizar" |

## Detalhes Tecnicos

- A navegacao usa `react-router-dom` (`useNavigate`), permanecendo dentro do SPA
- O `ResultScreen` ja busca os `page_blocks` do banco via `usePublicPageBlocks` — entao qualquer alteracao salva no editor aparece automaticamente no preview
- A barra de preview fixa no topo (z-50) deixa claro que e modo admin, sem confundir com a experiencia real do usuario
- Nenhum arquivo existente e alterado alem de adicionar a rota e o botao

