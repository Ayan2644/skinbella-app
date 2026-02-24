import { GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CHILD_BLOCK_TYPES } from "./blockTypes";

interface SectionChildPreviewProps {
  child: any;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export default function SectionChildPreview({ child, isSelected, onSelect, onDelete }: SectionChildPreviewProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: child.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const typeDef = CHILD_BLOCK_TYPES.find((b) => b.type === child.block_type);
  const Icon = typeDef?.icon;
  const label = typeDef?.label || child.block_type;

  // Build a preview string
  let preview = "";
  if (child.content?.text) preview = child.content.text.slice(0, 40);
  else if (child.block_type === "spacer") preview = `${child.content?.height || 24}px`;
  else if (child.block_type === "image") preview = child.content?.src ? "Imagem" : "Sem imagem";
  else if (child.block_type === "button") preview = child.content?.text || "Botão";

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group relative flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all ${
        isSelected ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/50 border border-transparent"
      }`}
    >
      <button {...attributes} {...listeners} className="p-0.5 rounded hover:bg-muted cursor-grab flex-shrink-0">
        <GripVertical className="w-3 h-3 text-muted-foreground" />
      </button>

      {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}

      <div className="flex-1 min-w-0">
        <span className="text-[11px] font-medium text-foreground/80 truncate block">{label}</span>
        {preview && <span className="text-[10px] text-muted-foreground truncate block">{preview}</span>}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="p-0.5 rounded hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
      >
        <Trash2 className="w-3 h-3 text-destructive" />
      </button>
    </div>
  );
}
