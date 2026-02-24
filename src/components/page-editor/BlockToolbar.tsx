import { BLOCK_TYPES } from "./blockTypes";

interface BlockToolbarProps {
  onAdd: (type: string) => void;
}

export default function BlockToolbar({ onAdd }: BlockToolbarProps) {
  return (
    <div className="w-48 flex-shrink-0 border-r border-border/30 bg-card p-3 overflow-y-auto">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">Blocos</p>
      <div className="space-y-1">
        {BLOCK_TYPES.map((bt) => (
          <button
            key={bt.type}
            onClick={() => onAdd(bt.type)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-foreground/80 hover:bg-muted/60 hover:text-foreground transition-colors"
          >
            <bt.icon className="w-4 h-4 text-muted-foreground" />
            {bt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
