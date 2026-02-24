import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import BlockPreview from "./BlockPreview";
import SectionChildPreview from "./SectionChildPreview";
import type { PageBlock } from "@/hooks/usePageBlocks";

interface BlockCanvasProps {
  blocks: PageBlock[];
  selectedId: string | null;
  selectedChildId: string | null;
  onSelect: (id: string) => void;
  onSelectChild: (childId: string) => void;
  onReorder: (blocks: PageBlock[]) => void;
  onReorderChildren: (children: any[]) => void;
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteChild: (childId: string) => void;
}

export default function BlockCanvas({
  blocks,
  selectedId,
  selectedChildId,
  onSelect,
  onSelectChild,
  onReorder,
  onReorderChildren,
  onToggleVisibility,
  onDelete,
  onDeleteChild,
}: BlockCanvasProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    if (oldIndex >= 0 && newIndex >= 0) {
      onReorder(arrayMove(blocks, oldIndex, newIndex));
    }
  }

  // Get the selected block to check for children
  const selectedBlock = blocks.find((b) => b.id === selectedId);
  const isCustomSection = selectedBlock?.block_type === "section_custom";
  const sectionChildren: any[] = isCustomSection ? (selectedBlock?.content?.children || []) : [];

  function handleChildDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sectionChildren.findIndex((c: any) => c.id === active.id);
    const newIndex = sectionChildren.findIndex((c: any) => c.id === over.id);
    if (oldIndex >= 0 && newIndex >= 0) {
      onReorderChildren(arrayMove(sectionChildren, oldIndex, newIndex));
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-[520px] mx-auto bg-background border border-border/30 rounded-2xl p-4 min-h-[60vh] shadow-sm">
        {blocks.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
            Clique em um bloco na barra lateral para começar
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1">
                {blocks.map((block) => (
                  <div key={block.id}>
                    <BlockPreview
                      block={block}
                      isSelected={selectedId === block.id}
                      onSelect={() => onSelect(block.id)}
                      onToggleVisibility={() => onToggleVisibility(block.id)}
                      onDelete={() => onDelete(block.id)}
                    />

                    {/* Expanded children area for selected custom section */}
                    {block.id === selectedId && block.block_type === "section_custom" && (
                      <div className="ml-6 mt-1 mb-2 pl-3 border-l-2 border-primary/30">
                        <p className="text-[9px] uppercase tracking-widest text-primary/60 font-semibold mb-1 px-1">
                          Blocos internos
                        </p>
                        {sectionChildren.length === 0 ? (
                          <div className="text-xs text-muted-foreground/50 text-center py-3 italic">
                            Use a barra lateral para adicionar blocos
                          </div>
                        ) : (
                          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleChildDragEnd}>
                            <SortableContext items={sectionChildren.map((c: any) => c.id)} strategy={verticalListSortingStrategy}>
                              <div className="space-y-0.5">
                                {sectionChildren.map((child: any) => (
                                  <SectionChildPreview
                                    key={child.id}
                                    child={child}
                                    isSelected={selectedChildId === child.id}
                                    onSelect={() => onSelectChild(child.id)}
                                    onDelete={() => onDeleteChild(child.id)}
                                  />
                                ))}
                              </div>
                            </SortableContext>
                          </DndContext>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
