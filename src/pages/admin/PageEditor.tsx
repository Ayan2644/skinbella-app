import { useState, useCallback, useRef } from "react";
import { Save, RotateCcw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageBlocks, type PageBlock } from "@/hooks/usePageBlocks";
import { BLOCK_TYPES } from "@/components/page-editor/blockTypes";
import { getDefaultBlocks } from "@/components/page-editor/defaultBlocks";
import BlockToolbar from "@/components/page-editor/BlockToolbar";
import BlockCanvas from "@/components/page-editor/BlockCanvas";
import BlockProperties from "@/components/page-editor/BlockProperties";
import { toast } from "sonner";

export default function PageEditor() {
  const { blocks: savedBlocks, isLoading, saveAll, resetToDefault } = usePageBlocks();
  const [localBlocks, setLocalBlocks] = useState<PageBlock[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const didInit = useRef(false);

  // Use local state if user has made edits, otherwise DB data
  const blocks = localBlocks ?? savedBlocks;

  // Sync from DB when first loaded — if DB is empty, seed with defaults
  if (!didInit.current && localBlocks === null && !isLoading) {
    didInit.current = true;
    if (savedBlocks.length > 0) {
      setLocalBlocks([...savedBlocks]);
    } else {
      setLocalBlocks(getDefaultBlocks());
    }
  }

  const addBlock = useCallback((type: string) => {
    const def = BLOCK_TYPES.find((b) => b.type === type);
    if (!def) return;
    const newBlock: PageBlock = {
      id: crypto.randomUUID(),
      page_id: "quiz_result",
      block_type: type,
      sort_order: blocks.length,
      content: { ...def.defaultContent },
      styles: { ...def.defaultStyles },
      is_visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setLocalBlocks([...blocks, newBlock]);
    setSelectedId(newBlock.id);
  }, [blocks]);

  const updateBlock = useCallback((updated: PageBlock) => {
    setLocalBlocks(blocks.map((b) => (b.id === updated.id ? updated : b)));
  }, [blocks]);

  const deleteBlock = useCallback((id: string) => {
    setLocalBlocks(blocks.filter((b) => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [blocks, selectedId]);

  const toggleVisibility = useCallback((id: string) => {
    setLocalBlocks(blocks.map((b) => (b.id === id ? { ...b, is_visible: !b.is_visible } : b)));
  }, [blocks]);

  const handleSave = async () => {
    try {
      await saveAll.mutateAsync(blocks);
      toast.success("Página salva com sucesso!");
    } catch (err) {
      toast.error("Erro ao salvar");
    }
  };

  const handleReset = async () => {
    try {
      await resetToDefault.mutateAsync();
      setLocalBlocks(getDefaultBlocks());
      setSelectedId(null);
      toast.success("Layout restaurado ao padrão");
    } catch (err) {
      toast.error("Erro ao restaurar");
    }
  };

  const selectedBlock = blocks.find((b) => b.id === selectedId) ?? null;

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Carregando...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -mx-5 -my-6 md:-mx-8">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 bg-card">
        <h1 className="text-sm font-semibold text-foreground">Editor de Página — Resultado do Quiz</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset} disabled={resetToDefault.isPending}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Restaurar
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3.5 h-3.5 mr-1" />
              Visualizar
            </a>
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saveAll.isPending}>
            <Save className="w-3.5 h-3.5 mr-1" />
            {saveAll.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden">
        <BlockToolbar onAdd={addBlock} />
        <BlockCanvas
          blocks={blocks}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onReorder={setLocalBlocks}
          onToggleVisibility={toggleVisibility}
          onDelete={deleteBlock}
        />
        <BlockProperties
          block={selectedBlock}
          onChange={updateBlock}
          onDelete={deleteBlock}
        />
      </div>
    </div>
  );
}
