import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uploadPageAsset } from "@/hooks/usePageBlocks";
import type { PageBlock } from "@/hooks/usePageBlocks";

interface BlockPropertiesProps {
  block: PageBlock | null;
  onChange: (block: PageBlock) => void;
  onDelete: (id: string) => void;
}

export default function BlockProperties({ block, onChange, onDelete }: BlockPropertiesProps) {
  const [uploading, setUploading] = useState(false);

  if (!block) {
    return (
      <div className="w-64 flex-shrink-0 border-l border-border/30 bg-card p-4 flex items-center justify-center text-sm text-muted-foreground">
        Selecione um bloco
      </div>
    );
  }

  const updateContent = (key: string, value: any) => {
    onChange({ ...block, content: { ...block.content, [key]: value } });
  };
  const updateStyles = (key: string, value: any) => {
    onChange({ ...block, styles: { ...block.styles, [key]: value } });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadPageAsset(file);
      updateContent("src", url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setUploading(false);
  };

  return (
    <div className="w-64 flex-shrink-0 border-l border-border/30 bg-card p-4 overflow-y-auto space-y-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Propriedades — {block.block_type}
      </p>

      {/* Visibility */}
      <div className="flex items-center justify-between">
        <Label className="text-xs">Visível</Label>
        <Switch checked={block.is_visible} onCheckedChange={(v) => onChange({ ...block, is_visible: v })} />
      </div>

      {/* Content fields by type */}
      {(block.block_type === "heading" || block.block_type === "text") && (
        <>
          <div>
            <Label className="text-xs">Texto</Label>
            <Textarea
              value={block.content.text || ""}
              onChange={(e) => updateContent("text", e.target.value)}
              className="mt-1 text-xs min-h-[60px]"
            />
          </div>
          {block.block_type === "heading" && (
            <div>
              <Label className="text-xs">Nível</Label>
              <Select value={block.content.level || "h2"} onValueChange={(v) => updateContent("level", v)}>
                <SelectTrigger className="mt-1 text-xs h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">H1</SelectItem>
                  <SelectItem value="h2">H2</SelectItem>
                  <SelectItem value="h3">H3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </>
      )}

      {block.block_type === "image" && (
        <>
          <div>
            <Label className="text-xs">URL da imagem</Label>
            <Input value={block.content.src || ""} onChange={(e) => updateContent("src", e.target.value)} className="mt-1 text-xs h-8" />
          </div>
          <div>
            <Label className="text-xs">Upload</Label>
            <label className="mt-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border cursor-pointer hover:bg-muted/50 text-xs text-muted-foreground">
              <Upload className="w-3.5 h-3.5" />
              {uploading ? "Enviando..." : "Escolher arquivo"}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
          <div>
            <Label className="text-xs">Alt text</Label>
            <Input value={block.content.alt || ""} onChange={(e) => updateContent("alt", e.target.value)} className="mt-1 text-xs h-8" />
          </div>
        </>
      )}

      {block.block_type === "button" && (
        <>
          <div>
            <Label className="text-xs">Texto</Label>
            <Input value={block.content.text || ""} onChange={(e) => updateContent("text", e.target.value)} className="mt-1 text-xs h-8" />
          </div>
          <div>
            <Label className="text-xs">Ação</Label>
            <Select value={block.content.action || "checkout"} onValueChange={(v) => updateContent("action", v)}>
              <SelectTrigger className="mt-1 text-xs h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="checkout">Checkout</SelectItem>
                <SelectItem value="scroll">Scroll</SelectItem>
                <SelectItem value="link">Link externo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {block.block_type === "spacer" && (
        <div>
          <Label className="text-xs">Altura (px)</Label>
          <Input type="number" value={block.content.height || 32} onChange={(e) => updateContent("height", Number(e.target.value))} className="mt-1 text-xs h-8" />
        </div>
      )}

      {block.block_type === "code" && (
        <>
          <div>
            <Label className="text-xs">HTML</Label>
            <Textarea value={block.content.html || ""} onChange={(e) => updateContent("html", e.target.value)} className="mt-1 text-xs min-h-[100px] font-mono" />
          </div>
          <div>
            <Label className="text-xs">CSS</Label>
            <Textarea value={block.content.css || ""} onChange={(e) => updateContent("css", e.target.value)} className="mt-1 text-xs min-h-[60px] font-mono" />
          </div>
        </>
      )}

      {block.block_type === "offer" && (
        <>
          <div>
            <Label className="text-xs">Título</Label>
            <Input value={block.content.title || ""} onChange={(e) => updateContent("title", e.target.value)} className="mt-1 text-xs h-8" />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="text-xs">Preço</Label>
              <Input value={block.content.price || ""} onChange={(e) => updateContent("price", e.target.value)} className="mt-1 text-xs h-8" />
            </div>
            <div className="flex-1">
              <Label className="text-xs">De</Label>
              <Input value={block.content.originalPrice || ""} onChange={(e) => updateContent("originalPrice", e.target.value)} className="mt-1 text-xs h-8" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Itens (um por linha)</Label>
            <Textarea
              value={(block.content.items || []).join("\n")}
              onChange={(e) => updateContent("items", e.target.value.split("\n").filter(Boolean))}
              className="mt-1 text-xs min-h-[80px]"
            />
          </div>
        </>
      )}

      {block.block_type === "testimonials" && (
        <div>
          <Label className="text-xs">Depoimentos (JSON)</Label>
          <Textarea
            value={JSON.stringify(block.content.items || [], null, 2)}
            onChange={(e) => { try { updateContent("items", JSON.parse(e.target.value)); } catch {} }}
            className="mt-1 text-xs min-h-[120px] font-mono"
          />
        </div>
      )}

      {block.block_type === "faq" && (
        <div>
          <Label className="text-xs">FAQ (JSON)</Label>
          <Textarea
            value={JSON.stringify(block.content.items || [], null, 2)}
            onChange={(e) => { try { updateContent("items", JSON.parse(e.target.value)); } catch {} }}
            className="mt-1 text-xs min-h-[120px] font-mono"
          />
        </div>
      )}

      {block.block_type === "divider" && (
        <div>
          <Label className="text-xs">Estilo</Label>
          <Select value={block.content.style || "line"} onValueChange={(v) => updateContent("style", v)}>
            <SelectTrigger className="mt-1 text-xs h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Linha</SelectItem>
              <SelectItem value="dots">Pontos</SelectItem>
              <SelectItem value="gradient">Gradiente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Style fields (common) */}
      <div className="border-t border-border/30 pt-3 space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Estilos</p>

        <div>
          <Label className="text-xs">Fonte</Label>
          <Select value={block.styles.fontFamily || ""} onValueChange={(v) => updateStyles("fontFamily", v)}>
            <SelectTrigger className="mt-1 text-xs h-8"><SelectValue placeholder="Padrão" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Playfair Display">Playfair Display</SelectItem>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="system-ui">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Tamanho fonte</Label>
          <Input value={block.styles.fontSize || ""} onChange={(e) => updateStyles("fontSize", e.target.value)} placeholder="16px" className="mt-1 text-xs h-8" />
        </div>

        <div>
          <Label className="text-xs">Cor do texto</Label>
          <div className="flex gap-2 mt-1">
            <input type="color" value={block.styles.color || "#000000"} onChange={(e) => updateStyles("color", e.target.value)} className="w-8 h-8 rounded border cursor-pointer" />
            <Input value={block.styles.color || ""} onChange={(e) => updateStyles("color", e.target.value)} className="text-xs h-8 flex-1" />
          </div>
        </div>

        <div>
          <Label className="text-xs">Cor de fundo</Label>
          <div className="flex gap-2 mt-1">
            <input type="color" value={block.styles.bgColor || "#ffffff"} onChange={(e) => updateStyles("bgColor", e.target.value)} className="w-8 h-8 rounded border cursor-pointer" />
            <Input value={block.styles.bgColor || ""} onChange={(e) => updateStyles("bgColor", e.target.value)} className="text-xs h-8 flex-1" />
          </div>
        </div>

        <div>
          <Label className="text-xs">Alinhamento</Label>
          <Select value={block.styles.textAlign || "left"} onValueChange={(v) => updateStyles("textAlign", v)}>
            <SelectTrigger className="mt-1 text-xs h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Esquerda</SelectItem>
              <SelectItem value="center">Centro</SelectItem>
              <SelectItem value="right">Direita</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Padding</Label>
          <Input value={block.styles.padding || ""} onChange={(e) => updateStyles("padding", e.target.value)} placeholder="8px 0" className="mt-1 text-xs h-8" />
        </div>

        <div>
          <Label className="text-xs">Margem</Label>
          <Input value={block.styles.margin || ""} onChange={(e) => updateStyles("margin", e.target.value)} placeholder="0" className="mt-1 text-xs h-8" />
        </div>

        <div>
          <Label className="text-xs">Border radius</Label>
          <Input value={block.styles.borderRadius || ""} onChange={(e) => updateStyles("borderRadius", e.target.value)} placeholder="16px" className="mt-1 text-xs h-8" />
        </div>

        <div>
          <Label className="text-xs">Largura máx.</Label>
          <Input value={block.styles.maxWidth || ""} onChange={(e) => updateStyles("maxWidth", e.target.value)} placeholder="100%" className="mt-1 text-xs h-8" />
        </div>
      </div>

      {/* Delete */}
      <Button variant="destructive" size="sm" onClick={() => onDelete(block.id)} className="w-full mt-4">
        <Trash2 className="w-3.5 h-3.5 mr-1" />
        Excluir bloco
      </Button>
    </div>
  );
}
