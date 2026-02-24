import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import BlockPreview from "./BlockPreview";
import type { PageBlock } from "@/hooks/usePageBlocks";

interface BlockCanvasProps {
  blocks: PageBlock[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (blocks: PageBlock[]) => void;
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function BlockCanvas({ blocks, selectedId, onSelect, onReorder, onToggleVisibility, onDelete }: BlockCanvasProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    onReorder(arrayMove(blocks, oldIndex, newIndex));
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
                  <BlockPreview
                    key={block.id}
                    block={block}
                    isSelected={selectedId === block.id}
                    onSelect={() => onSelect(block.id)}
                    onToggleVisibility={() => onToggleVisibility(block.id)}
                    onDelete={() => onDelete(block.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
