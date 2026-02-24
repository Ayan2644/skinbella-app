import { GripVertical, Eye, EyeOff, Trash2, Copy } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import BlockRenderer from "./BlockRenderer";
import type { PageBlock } from "@/hooks/usePageBlocks";

interface BlockPreviewProps {
  block: PageBlock;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function BlockPreview({ block, isSelected, onSelect, onToggleVisibility, onDelete, onDuplicate }: BlockPreviewProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group relative rounded-xl border-2 transition-all cursor-pointer ${
        isSelected ? "border-primary/50 bg-primary/5" : "border-transparent hover:border-border/40"
      } ${!block.is_visible ? "opacity-40" : ""}`}
    >
      {/* Drag handle + controls */}
      <div className="absolute -left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button {...attributes} {...listeners} className="p-1 rounded hover:bg-muted cursor-grab">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      <div className="absolute -right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
        <button onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }} className="p-1 rounded hover:bg-muted">
          {block.is_visible ? <Eye className="w-3.5 h-3.5 text-muted-foreground" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="p-1 rounded hover:bg-primary/10" title="Duplicar">
          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 rounded hover:bg-destructive/10" title="Excluir">
          <Trash2 className="w-3.5 h-3.5 text-destructive" />
        </button>
      </div>

      {/* Block preview */}
      <div className="px-4 py-2 pointer-events-none">
        <BlockRenderer block={block} profile={{ skinAge: 38, scores: { hidratacao: 6, textura: 5 } }} />
      </div>

      {/* Type label */}
      <div className="absolute top-1 left-6 text-[9px] uppercase tracking-wider text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        {block.block_type}
      </div>
    </div>
  );
}
