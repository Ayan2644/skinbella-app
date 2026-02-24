import { useState, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Save, RotateCcw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageBlocks, type PageBlock } from "@/hooks/usePageBlocks";
import { BLOCK_TYPES, CHILD_BLOCK_TYPES, STRUCTURED_LAYOUT_BLOCKS } from "@/components/page-editor/blockTypes";
import { getDefaultBlocks } from "@/components/page-editor/defaultBlocks";
import BlockToolbar from "@/components/page-editor/BlockToolbar";
import BlockCanvas from "@/components/page-editor/BlockCanvas";
import BlockProperties from "@/components/page-editor/BlockProperties";
import { toast } from "sonner";

const hasStructuredLayout = (blocks: PageBlock[]) =>
  blocks.some((block) =>
    STRUCTURED_LAYOUT_BLOCKS.includes(block.block_type as (typeof STRUCTURED_LAYOUT_BLOCKS)[number])
  );

export default function PageEditor() {
  const navigate = useNavigate();
  const { blocks: savedBlocks, isLoading, saveAll, resetToDefault } = usePageBlocks();
  const [localBlocks, setLocalBlocks] = useState<PageBlock[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  /** When editing a child inside section_custom, track both parent & child */
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const didInit = useRef(false);

  const blocks = localBlocks ?? savedBlocks;

  // Init
  if (!didInit.current && localBlocks === null && !isLoading) {
    didInit.current = true;
    if (savedBlocks.length > 0) {
      setLocalBlocks(hasStructuredLayout(savedBlocks) ? [...savedBlocks] : getDefaultBlocks());
    } else {
      setLocalBlocks(getDefaultBlocks());
    }
  }

  // Is selected block a custom section?
  const selectedBlock = blocks.find((b) => b.id === selectedId) ?? null;
  const isCustomSection = selectedBlock?.block_type === "section_custom";
  const selectedSectionId = isCustomSection ? selectedId : null;

  // Selected child block
  const selectedChild = useMemo(() => {
    if (!isCustomSection || !selectedChildId || !selectedBlock) return null;
    const children: any[] = selectedBlock.content?.children || [];
    return children.find((c: any) => c.id === selectedChildId) ?? null;
  }, [isCustomSection, selectedChildId, selectedBlock]);

  // Is the selected child an inner_section? If so, toolbar should target it
  const isSelectedChildInnerSection = selectedChild?.block_type === "inner_section";
  const innerSectionTargetId = isSelectedChildInnerSection ? selectedChildId : null;

  // --- Top-level block operations ---
  const addBlock = useCallback(
    (type: string) => {
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
      setSelectedChildId(null);
    },
    [blocks]
  );

  const updateBlock = useCallback(
    (updated: PageBlock) => {
      setLocalBlocks(blocks.map((b) => (b.id === updated.id ? updated : b)));
    },
    [blocks]
  );

  const deleteBlock = useCallback(
    (id: string) => {
      setLocalBlocks(blocks.filter((b) => b.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
        setSelectedChildId(null);
      }
    },
    [blocks, selectedId]
  );

  const toggleVisibility = useCallback(
    (id: string) => {
      setLocalBlocks(blocks.map((b) => (b.id === id ? { ...b, is_visible: !b.is_visible } : b)));
    },
    [blocks]
  );

  // --- Child block operations (inside section_custom) ---
  const addChildBlock = useCallback(
    (childType: string) => {
      const def = CHILD_BLOCK_TYPES.find((b) => b.type === childType);
      if (!def) return;

      const newChild = {
        id: crypto.randomUUID(),
        block_type: childType,
        content: JSON.parse(JSON.stringify(def.defaultContent)),
        styles: { ...def.defaultStyles },
        is_visible: true,
      };

      // If an inner_section child is selected, add inside it
      if (innerSectionTargetId && selectedSectionId) {
        setLocalBlocks(
          blocks.map((b) => {
            if (b.id !== selectedSectionId) return b;
            const children = (b.content?.children || []).map((c: any) => {
              if (c.id !== innerSectionTargetId) return c;
              return { ...c, content: { ...c.content, children: [...(c.content?.children || []), newChild] } };
            });
            return { ...b, content: { ...b.content, children } };
          })
        );
        return;
      }

      if (!selectedSectionId) return;

      setLocalBlocks(
        blocks.map((b) => {
          if (b.id !== selectedSectionId) return b;
          const children = [...(b.content?.children || []), newChild];
          return { ...b, content: { ...b.content, children } };
        })
      );
      setSelectedChildId(newChild.id);
    },
    [blocks, selectedSectionId, innerSectionTargetId]
  );

  const updateChildBlock = useCallback(
    (updatedChild: any) => {
      if (!selectedSectionId) return;
      setLocalBlocks(
        blocks.map((b) => {
          if (b.id !== selectedSectionId) return b;
          const children = (b.content?.children || []).map((c: any) =>
            c.id === updatedChild.id ? updatedChild : c
          );
          return { ...b, content: { ...b.content, children } };
        })
      );
    },
    [blocks, selectedSectionId]
  );

  const deleteChildBlock = useCallback(
    (childId: string) => {
      if (!selectedSectionId) return;
      setLocalBlocks(
        blocks.map((b) => {
          if (b.id !== selectedSectionId) return b;
          const children = (b.content?.children || []).filter((c: any) => c.id !== childId);
          return { ...b, content: { ...b.content, children } };
        })
      );
      if (selectedChildId === childId) setSelectedChildId(null);
    },
    [blocks, selectedSectionId, selectedChildId]
  );

  const reorderChildren = useCallback(
    (newChildren: any[]) => {
      if (!selectedSectionId) return;
      setLocalBlocks(
        blocks.map((b) => {
          if (b.id !== selectedSectionId) return b;
          return { ...b, content: { ...b.content, children: newChildren } };
        })
      );
    },
    [blocks, selectedSectionId]
  );

  const deleteInnerChild = useCallback(
    (innerChildId: string) => {
      if (!selectedSectionId || !innerSectionTargetId) return;
      setLocalBlocks(
        blocks.map((b) => {
          if (b.id !== selectedSectionId) return b;
          const children = (b.content?.children || []).map((c: any) => {
            if (c.id !== innerSectionTargetId) return c;
            const innerChildren = (c.content?.children || []).filter((ic: any) => ic.id !== innerChildId);
            return { ...c, content: { ...c.content, children: innerChildren } };
          });
          return { ...b, content: { ...b.content, children } };
        })
      );
    },
    [blocks, selectedSectionId, innerSectionTargetId]
  );

  const reorderInnerChildren = useCallback(
    (newInnerChildren: any[]) => {
      if (!selectedSectionId || !innerSectionTargetId) return;
      setLocalBlocks(
        blocks.map((b) => {
          if (b.id !== selectedSectionId) return b;
          const children = (b.content?.children || []).map((c: any) => {
            if (c.id !== innerSectionTargetId) return c;
            return { ...c, content: { ...c.content, children: newInnerChildren } };
          });
          return { ...b, content: { ...b.content, children } };
        })
      );
    },
    [blocks, selectedSectionId, innerSectionTargetId]
  );

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setSelectedChildId(null);
  }, []);

  const handleSelectChild = useCallback((childId: string) => {
    setSelectedChildId(childId);
  }, []);

  const handleSave = async () => {
    try {
      await saveAll.mutateAsync(blocks);
      toast.success("Página salva com sucesso!");
    } catch {
      toast.error("Erro ao salvar");
    }
  };

  const handleReset = async () => {
    try {
      await resetToDefault.mutateAsync();
      setLocalBlocks(getDefaultBlocks());
      setSelectedId(null);
      setSelectedChildId(null);
      toast.success("Layout restaurado ao padrão");
    } catch {
      toast.error("Erro ao restaurar");
    }
  };

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
          <Button variant="outline" size="sm" onClick={() => navigate("/app/admin/result-preview")}>
            <Eye className="w-3.5 h-3.5 mr-1" />
            Visualizar
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saveAll.isPending}>
            <Save className="w-3.5 h-3.5 mr-1" />
            {saveAll.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden">
        <BlockToolbar
          onAdd={addBlock}
          selectedSectionId={selectedSectionId}
          onAddChild={addChildBlock}
          innerSectionSelected={isSelectedChildInnerSection}
        />
        <BlockCanvas
          blocks={blocks}
          selectedId={selectedId}
          selectedChildId={selectedChildId}
          onSelect={handleSelect}
          onSelectChild={handleSelectChild}
          onReorder={setLocalBlocks}
          onReorderChildren={reorderChildren}
          onReorderInnerChildren={reorderInnerChildren}
          onToggleVisibility={toggleVisibility}
          onDelete={deleteBlock}
          onDeleteChild={deleteChildBlock}
          onDeleteInnerChild={deleteInnerChild}
        />
        <BlockProperties
          block={selectedBlock}
          childBlock={selectedChild}
          onChange={updateBlock}
          onChangeChild={updateChildBlock}
          onDelete={deleteBlock}
          onDeleteChild={deleteChildBlock}
        />
      </div>
    </div>
  );
}
