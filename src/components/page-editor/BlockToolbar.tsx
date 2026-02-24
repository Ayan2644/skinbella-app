import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { BLOCK_TYPES, CHILD_BLOCK_TYPES, CHILD_BLOCK_CATEGORIES } from "./blockTypes";

interface BlockToolbarProps {
  onAdd: (type: string) => void;
  selectedSectionId: string | null;
  onAddChild: (childType: string) => void;
}

export default function BlockToolbar({ onAdd, selectedSectionId, onAddChild }: BlockToolbarProps) {
  const [sectionsOpen, setSectionsOpen] = useState(true);
  const [childOpen, setChildOpen] = useState(true);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    content: true, lists: true, conversion: true, social: true, layout: true,
  });

  const toggleCat = (key: string) => setOpenCategories((p) => ({ ...p, [key]: !p[key] }));

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

      {/* Child block palette — categorized */}
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
            <div className="space-y-1">
              <p className="px-3 py-1 text-[10px] text-muted-foreground">
                Adicionar dentro da seção selecionada:
              </p>
              {CHILD_BLOCK_CATEGORIES.map((cat) => {
                const blocks = CHILD_BLOCK_TYPES.filter((b) => b.category === cat.key);
                if (blocks.length === 0) return null;
                const isOpen = openCategories[cat.key] !== false;
                return (
                  <div key={cat.key}>
                    <button
                      onClick={() => toggleCat(cat.key)}
                      className="w-full flex items-center gap-1 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/70 hover:text-muted-foreground"
                    >
                      {isOpen ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                      {cat.label}
                    </button>
                    {isOpen && blocks.map((bt) => (
                      <button
                        key={bt.type}
                        onClick={() => onAddChild(bt.type)}
                        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <bt.icon className="w-3.5 h-3.5 text-muted-foreground" />
                        {bt.label}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
