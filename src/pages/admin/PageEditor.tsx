import { useState, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Undo2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageBlocks, type PageBlock } from "@/hooks/usePageBlocks";
import { BLOCK_TYPES, CHILD_BLOCK_TYPES, STRUCTURED_LAYOUT_BLOCKS } from "@/components/page-editor/blockTypes";
import { getDefaultBlocks, getDefaultChildrenForSection } from "@/components/page-editor/defaultBlocks";
import BlockToolbar from "@/components/page-editor/BlockToolbar";
import BlockCanvas from "@/components/page-editor/BlockCanvas";
import BlockProperties from "@/components/page-editor/BlockProperties";
import { toast } from "sonner";

const MAX_UNDO_STACK = 30;

const hasStructuredLayout = (blocks: PageBlock[]) =>
  blocks.some((block) =>
    STRUCTURED_LAYOUT_BLOCKS.includes(block.block_type as (typeof STRUCTURED_LAYOUT_BLOCKS)[number])
  );

/**
 * Ensure sections loaded from DB have children populated.
 * Old saved blocks may lack children — we seed them from defaults.
 */
function hydrateBlockChildren(blocks: PageBlock[]): PageBlock[] {
  return blocks.map((block) => {
    if (
      block.block_type.startsWith("section_") &&
      block.block_type !== "section_hero" &&
      block.block_type !== "section_custom" &&
      (!block.content?.children || block.content.children.length === 0)
    ) {
      const defaultChildren = getDefaultChildrenForSection(block.block_type);
      if (defaultChildren.length > 0) {
        return {
          ...block,
          content: {
            ...block.content,
            sectionStyle: block.content?.sectionStyle || "premium",
            children: defaultChildren,
          },
        };
      }
    }
    return block;
  });
}

export default function PageEditor() {
  const navigate = useNavigate();
  const { blocks: savedBlocks, isLoading, saveAll } = usePageBlocks();
  const [localBlocks, setLocalBlocks] = useState<PageBlock[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [selectedInnerChildId, setSelectedInnerChildId] = useState<string | null>(null);
  const didInit = useRef(false);

  // ── Undo stack ──
  const undoStackRef = useRef<PageBlock[][]>([]);
  
  /** Push current state to undo stack before making a change */
  const pushUndo = useCallback(() => {
    if (localBlocks) {
      const stack = undoStackRef.current;
      stack.push(JSON.parse(JSON.stringify(localBlocks)));
      if (stack.length > MAX_UNDO_STACK) stack.shift();
    }
  }, [localBlocks]);

  /** Wrapper: push undo then set new blocks */
  const setBlocksWithUndo = useCallback(
    (newBlocks: PageBlock[] | ((prev: PageBlock[]) => PageBlock[])) => {
      pushUndo();
      if (typeof newBlocks === "function") {
        setLocalBlocks((prev) => newBlocks(prev ?? []));
      } else {
        setLocalBlocks(newBlocks);
      }
    },
    [pushUndo]
  );

  const blocks = localBlocks ?? savedBlocks;

  // Init — hydrate children for sections loaded from DB
  if (!didInit.current && localBlocks === null && !isLoading) {
    didInit.current = true;
    if (savedBlocks.length > 0 && hasStructuredLayout(savedBlocks)) {
      setLocalBlocks(hydrateBlockChildren([...savedBlocks]));
    } else {
      setLocalBlocks(getDefaultBlocks());
    }
  }

  // Is selected block a section with children?
  const selectedBlock = blocks.find((b) => b.id === selectedId) ?? null;
  const isSectionWithChildren = selectedBlock?.block_type.startsWith("section_") && selectedBlock?.block_type !== "section_hero";
  const selectedSectionId = isSectionWithChildren ? selectedId : null;

  // Selected child block
  const selectedChild = useMemo(() => {
    if (!isSectionWithChildren || !selectedChildId || !selectedBlock) return null;
    const children: any[] = selectedBlock.content?.children || [];
    return children.find((c: any) => c.id === selectedChildId) ?? null;
  }, [isSectionWithChildren, selectedChildId, selectedBlock]);

  const isSelectedChildInnerSection = selectedChild?.block_type === "inner_section";
  const innerSectionTargetId = isSelectedChildInnerSection ? selectedChildId : null;

  // Selected inner child block (block inside inner_section)
  const selectedInnerChild = useMemo(() => {
    if (!isSelectedChildInnerSection || !selectedInnerChildId || !selectedChild) return null;
    const innerChildren: any[] = selectedChild.content?.children || [];
    return innerChildren.find((c: any) => c.id === selectedInnerChildId) ?? null;
  }, [isSelectedChildInnerSection, selectedInnerChildId, selectedChild]);

  // --- Top-level block operations ---
  const addBlock = useCallback(
    (type: string) => {
      const def = BLOCK_TYPES.find((b) => b.type === type);
      if (!def) return;
      
      // For predefined sections, seed with default children
      let content = JSON.parse(JSON.stringify(def.defaultContent));
      if (type.startsWith("section_") && type !== "section_hero" && type !== "section_custom") {
        const defaultChildren = getDefaultChildrenForSection(type);
        if (defaultChildren.length > 0 && (!content.children || content.children.length === 0)) {
          content.children = defaultChildren;
          content.sectionStyle = content.sectionStyle || "premium";
        }
      }
      
      const newBlock: PageBlock = {
        id: crypto.randomUUID(),
        page_id: "quiz_result",
        block_type: type,
        sort_order: blocks.length,
        content,
        styles: { ...def.defaultStyles },
        is_visible: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setBlocksWithUndo([...blocks, newBlock]);
      setSelectedId(newBlock.id);
      setSelectedChildId(null);
    },
    [blocks, setBlocksWithUndo]
  );

  const updateBlock = useCallback(
    (updated: PageBlock) => {
      setBlocksWithUndo(blocks.map((b) => (b.id === updated.id ? updated : b)));
    },
    [blocks, setBlocksWithUndo]
  );

  const deleteBlock = useCallback(
    (id: string) => {
      setBlocksWithUndo(blocks.filter((b) => b.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
        setSelectedChildId(null);
      }
    },
    [blocks, selectedId, setBlocksWithUndo]
  );

  const toggleVisibility = useCallback(
    (id: string) => {
      setBlocksWithUndo(blocks.map((b) => (b.id === id ? { ...b, is_visible: !b.is_visible } : b)));
    },
    [blocks, setBlocksWithUndo]
  );

  // --- Child block operations ---
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

      if (innerSectionTargetId && selectedSectionId) {
        setBlocksWithUndo(
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

      setBlocksWithUndo(
        blocks.map((b) => {
          if (b.id !== selectedSectionId) return b;
          const children = [...(b.content?.children || []), newChild];
          return { ...b, content: { ...b.content, children } };
        })
      );
      setSelectedChildId(newChild.id);
    },
    [blocks, selectedSectionId, innerSectionTargetId, setBlocksWithUndo]
  );

  const updateChildBlock = useCallback(
    (updatedChild: any) => {
      if (!selectedSectionId) return;
      setBlocksWithUndo(
        blocks.map((b) => {
          if (b.id !== selectedSectionId) return b;
          const children = (b.content?.children || []).map((c: any) =>
            c.id === updatedChild.id ? updatedChild : c
          );
          return { ...b, content: { ...b.content, children } };
        })
      );
    },
    [blocks, selectedSectionId, setBlocksWithUndo]
  );

  const deleteChildBlock = useCallback(
    (childId: string) => {
      if (!selectedSectionId) return;
      setBlocksWithUndo(
        blocks.map((b) => {
          if (b.id !== selectedSectionId) return b;
          const children = (b.content?.children || []).filter((c: any) => c.id !== childId);
          return { ...b, content: { ...b.content, children } };
        })
      );
      if (selectedChildId === childId) setSelectedChildId(null);
    },
    [blocks, selectedSectionId, selectedChildId, setBlocksWithUndo]
  );

  const reorderChildren = useCallback(
    (newChildren: any[]) => {
      if (!selectedSectionId) return;
      setBlocksWithUndo(
        blocks.map((b) => {
          if (b.id !== selectedSectionId) return b;
          return { ...b, content: { ...b.content, children: newChildren } };
        })
      );
    },
    [blocks, selectedSectionId, setBlocksWithUndo]
  );

  const deleteInnerChild = useCallback(
    (innerChildId: string) => {
      if (!selectedSectionId || !innerSectionTargetId) return;
      setBlocksWithUndo(
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
    [blocks, selectedSectionId, innerSectionTargetId, setBlocksWithUndo]
  );

  const reorderInnerChildren = useCallback(
    (newInnerChildren: any[]) => {
      if (!selectedSectionId || !innerSectionTargetId) return;
      setBlocksWithUndo(
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
    [blocks, selectedSectionId, innerSectionTargetId, setBlocksWithUndo]
  );

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setSelectedChildId(null);
    setSelectedInnerChildId(null);
  }, []);

  const handleSelectChild = useCallback((childId: string) => {
    setSelectedChildId(childId);
    setSelectedInnerChildId(null);
  }, []);

  const handleSelectInnerChild = useCallback((innerChildId: string) => {
    setSelectedInnerChildId(innerChildId);
  }, []);

  // Update a block inside an inner_section
  const updateInnerChildBlock = useCallback(
    (updatedInnerChild: any) => {
      if (!selectedSectionId || !innerSectionTargetId) return;
      setBlocksWithUndo(
        blocks.map((b) => {
          if (b.id !== selectedSectionId) return b;
          const children = (b.content?.children || []).map((c: any) => {
            if (c.id !== innerSectionTargetId) return c;
            const innerChildren = (c.content?.children || []).map((ic: any) =>
              ic.id === updatedInnerChild.id ? updatedInnerChild : ic
            );
            return { ...c, content: { ...c.content, children: innerChildren } };
          });
          return { ...b, content: { ...b.content, children } };
        })
      );
    },
    [blocks, selectedSectionId, innerSectionTargetId, setBlocksWithUndo]
  );

  const handleSave = async () => {
    try {
      await saveAll.mutateAsync(blocks);
      toast.success("Página salva com sucesso!");
    } catch {
      toast.error("Erro ao salvar");
    }
  };

  // ── Undo: reverts to the previous state (NOT a full reset) ──
  const handleUndo = useCallback(() => {
    const stack = undoStackRef.current;
    if (stack.length === 0) {
      toast.info("Nada para desfazer");
      return;
    }
    const previous = stack.pop()!;
    setLocalBlocks(previous);
    setSelectedId(null);
    setSelectedChildId(null);
    toast.success("Ação desfeita");
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Carregando...</div>;
  }

  const canUndo = undoStackRef.current.length > 0;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -mx-5 -my-6 md:-mx-8">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 bg-card">
        <h1 className="text-sm font-semibold text-foreground">Editor de Página — Resultado do Quiz</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleUndo} disabled={!canUndo}>
            <Undo2 className="w-3.5 h-3.5 mr-1" />
            Desfazer
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
          selectedInnerChildId={selectedInnerChildId}
          onSelect={handleSelect}
          onSelectChild={handleSelectChild}
          onSelectInnerChild={handleSelectInnerChild}
          onReorder={(newBlocks) => setBlocksWithUndo(newBlocks)}
          onReorderChildren={reorderChildren}
          onReorderInnerChildren={reorderInnerChildren}
          onToggleVisibility={toggleVisibility}
          onDelete={deleteBlock}
          onDeleteChild={deleteChildBlock}
          onDeleteInnerChild={deleteInnerChild}
        />
        <BlockProperties
          block={selectedBlock}
          childBlock={selectedInnerChild || selectedChild}
          onChange={updateBlock}
          onChangeChild={selectedInnerChild ? updateInnerChildBlock : updateChildBlock}
          onDelete={deleteBlock}
          onDeleteChild={selectedInnerChild ? (id) => deleteInnerChild(id) : deleteChildBlock}
        />
      </div>
    </div>
  );
}
