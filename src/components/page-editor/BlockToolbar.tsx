import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  SquarePlus,
} from "lucide-react";
import { BLOCK_TYPES, CHILD_BLOCK_TYPES } from "./blockTypes";

interface BlockToolbarProps {
  onAdd: (type: string) => void;
  /** When a section_custom is selected, show child block palette */
  selectedSectionId: string | null;
  onAddChild: (childType: string) => void;
}

export default function BlockToolbar({ onAdd, selectedSectionId, onAddChild }: BlockToolbarProps) {
  const [sectionsOpen, setSectionsOpen] = useState(true);
  const [childOpen, setChildOpen] = useState(true);

  return (
    <div className="w-52 flex-shrink-0 border-r border-border/30 bg-card p-3 overflow-y-auto">
      {/* Section blocks */}
      <button
        onClick={() => setSectionsOpen(!sectionsOpen)}
        className="w-full flex items-center gap-1.5 px-1 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
      >
        {sectionsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        Seções
      </button>

      {sectionsOpen && (
        <div className="space-y-0.5 mb-4">
          {BLOCK_TYPES.map((bt) => (
            <button
              key={bt.type}
              onClick={() => onAdd(bt.type)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                bt.type === "section_custom"
                  ? "text-primary font-semibold hover:bg-primary/10"
                  : "text-foreground/80 hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <bt.icon className={`w-4 h-4 ${bt.type === "section_custom" ? "text-primary" : "text-muted-foreground"}`} />
              {bt.label}
            </button>
          ))}
        </div>
      )}

      {/* Child block palette — only shown when a custom section is selected */}
      {selectedSectionId && (
        <>
          <div className="border-t border-border/30 mt-2 pt-2" />
          <button
            onClick={() => setChildOpen(!childOpen)}
            className="w-full flex items-center gap-1.5 px-1 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
          >
            {childOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            Blocos da Seção
          </button>

          {childOpen && (
            <div className="space-y-0.5">
              <p className="px-3 py-1 text-[10px] text-muted-foreground">
                Adicionar dentro da seção selecionada:
              </p>
              {CHILD_BLOCK_TYPES.map((bt) => (
                <button
                  key={bt.type}
                  onClick={() => onAddChild(bt.type)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <bt.icon className="w-4 h-4 text-muted-foreground" />
                  {bt.label}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
