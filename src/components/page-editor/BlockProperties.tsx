import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Plus, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uploadPageAsset } from "@/hooks/usePageBlocks";
import {
  SECTION_STYLE_VARIANTS, BADGE_VARIANTS, INNER_SECTION_BG_VARIANTS,
  FONT_OPTIONS, FONT_WEIGHT_OPTIONS, GRADIENT_PRESETS, SHADOW_PRESETS,
  BORDER_STYLE_OPTIONS, LETTER_SPACING_OPTIONS, TEXT_TRANSFORM_OPTIONS,
  LINE_HEIGHT_OPTIONS, OPACITY_OPTIONS,
} from "./blockTypes";
import LucideIconPicker from "./LucideIconPicker";
import type { PageBlock } from "@/hooks/usePageBlocks";

interface BlockPropertiesProps {
  block: PageBlock | null;
  childBlock?: any | null;
  onChange: (block: PageBlock) => void;
  onChangeChild?: (child: any) => void;
  onDelete: (id: string) => void;
  onDeleteChild?: (childId: string) => void;
}

export default function BlockProperties({ block, childBlock, onChange, onChangeChild, onDelete, onDeleteChild }: BlockPropertiesProps) {
  const [uploading, setUploading] = useState(false);

  const editingChild = childBlock && onChangeChild;
  const activeBlock = editingChild ? childBlock : block;
  const activeType = activeBlock?.block_type;

  if (!block) {
    return (
      <div className="w-64 flex-shrink-0 border-l border-border/30 bg-card p-4 flex items-center justify-center text-sm text-muted-foreground">
        Selecione um bloco
      </div>
    );
  }

  const updateContent = (key: string, value: any) => {
    if (editingChild) {
      onChangeChild!({ ...childBlock, content: { ...childBlock.content, [key]: value } });
    } else {
      onChange({ ...block, content: { ...block.content, [key]: value } });
    }
  };

  const updateStyles = (key: string, value: any) => {
    if (editingChild) {
      onChangeChild!({ ...childBlock, styles: { ...childBlock.styles, [key]: value } });
    } else {
      onChange({ ...block, styles: { ...block.styles, [key]: value } });
    }
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

  const activeContent = activeBlock?.content || {};
  const activeStyles = activeBlock?.styles || {};
  const isSection = block.block_type.startsWith("section_") && block.block_type !== "section_hero" && !editingChild;

  // Helper for list-based items
  const updateItemAt = (key: string, idx: number, val: any) => {
    const items = [...(activeContent[key] || [])];
    items[idx] = val;
    updateContent(key, items);
  };
  const removeItemAt = (key: string, idx: number) => {
    const items = [...(activeContent[key] || [])];
    items.splice(idx, 1);
    updateContent(key, items);
  };
  const addItem = (key: string, defaultItem: any) => {
    const items = [...(activeContent[key] || []), defaultItem];
    updateContent(key, items);
  };

  return (
    <div className="w-64 flex-shrink-0 border-l border-border/30 bg-card p-4 overflow-y-auto space-y-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {editingChild ? `Bloco filho — ${activeType}` : `Propriedades — ${block.block_type}`}
      </p>

      {/* Visibility (top level only) */}
      {!editingChild && (
        <div className="flex items-center justify-between">
          <Label className="text-xs">Visível</Label>
          <Switch checked={block.is_visible} onCheckedChange={(v) => onChange({ ...block, is_visible: v })} />
        </div>
      )}

      {/* === Section Properties (all sections except hero) === */}
      {isSection && (
        <>
          <div>
            <Label className="text-xs">Título da Seção</Label>
            <Input value={block.content.title || ""} onChange={(e) => onChange({ ...block, content: { ...block.content, title: e.target.value } })} className="mt-1 text-xs h-8" />
          </div>
          <div>
            <Label className="text-xs">Estilo do Card</Label>
            <Select value={block.content.sectionStyle || "premium"} onValueChange={(v) => onChange({ ...block, content: { ...block.content, sectionStyle: v } })}>
              <SelectTrigger className="mt-1 text-xs h-8"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {SECTION_STYLE_VARIANTS.map((sv) => (
                  <SelectItem key={sv.value} value={sv.value}>
                    <span className="font-medium">{sv.label}</span>
                    <span className="ml-1 text-muted-foreground text-[10px]">— {sv.description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-[10px] text-muted-foreground">Use "Blocos da Seção" na barra lateral para adicionar conteúdo.</p>
        </>
      )}

      {/* Hero section info */}
      {block.block_type === "section_hero" && !editingChild && (
        <p className="text-[11px] text-muted-foreground leading-relaxed">Seção Hero é fixa e vinculada ao resultado do quiz. Reordene ou oculte usando os controles.</p>
      )}

      {/* === heading / text === */}
      {(activeType === "heading" || activeType === "text") && (
        <>
          <div>
            <Label className="text-xs">Texto</Label>
            <Textarea value={activeContent.text || ""} onChange={(e) => updateContent("text", e.target.value)} className="mt-1 text-xs min-h-[60px]" />
          </div>
          {activeType === "heading" && (
            <div>
              <Label className="text-xs">Nível</Label>
              <Select value={activeContent.level || "h2"} onValueChange={(v) => updateContent("level", v)}>
                <SelectTrigger className="mt-1 text-xs h-8"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="h1">H1</SelectItem>
                  <SelectItem value="h2">H2</SelectItem>
                  <SelectItem value="h3">H3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </>
      )}

      {/* === headline_icon === */}
      {activeType === "headline_icon" && (
        <>
          <div><Label className="text-xs">Texto</Label><Input value={activeContent.text || ""} onChange={(e) => updateContent("text", e.target.value)} className="mt-1 text-xs h-8" /></div>
          <div><Label className="text-xs">Subtítulo</Label><Input value={activeContent.subtitle || ""} onChange={(e) => updateContent("subtitle", e.target.value)} className="mt-1 text-xs h-8" /></div>
          <LucideIconPicker value={activeContent.icon || "Sparkles"} onChange={(v) => updateContent("icon", v)} />
          <div>
            <Label className="text-xs">Nível</Label>
            <Select value={activeContent.level || "h2"} onValueChange={(v) => updateContent("level", v)}>
              <SelectTrigger className="mt-1 text-xs h-8"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="h2">H2</SelectItem>
                <SelectItem value="h3">H3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* === headline_trigger === */}
      {activeType === "headline_trigger" && (
        <>
          <div><Label className="text-xs">Texto principal</Label><Input value={activeContent.text || ""} onChange={(e) => updateContent("text", e.target.value)} className="mt-1 text-xs h-8" /></div>
          <div><Label className="text-xs">Texto do badge</Label><Input value={activeContent.badgeText || ""} onChange={(e) => updateContent("badgeText", e.target.value)} className="mt-1 text-xs h-8" /></div>
          <div>
            <Label className="text-xs">Cor do badge</Label>
            <Select value={activeContent.badgeColor || "accent"} onValueChange={(v) => updateContent("badgeColor", v)}>
              <SelectTrigger className="mt-1 text-xs h-8"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {BADGE_VARIANTS.map((v) => <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <LucideIconPicker value={activeContent.icon || "Zap"} onChange={(v) => updateContent("icon", v)} />
        </>
      )}

      {/* === icon_block === */}
      {activeType === "icon_block" && (
        <>
          <LucideIconPicker value={activeContent.icon || "Sparkles"} onChange={(v) => updateContent("icon", v)} />
          <div>
            <Label className="text-xs">Tamanho</Label>
            <Select value={activeContent.size || "md"} onValueChange={(v) => updateContent("size", v)}>
              <SelectTrigger className="mt-1 text-xs h-8"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="sm">Pequeno</SelectItem>
                <SelectItem value="md">Médio</SelectItem>
                <SelectItem value="lg">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* === image === */}
      {activeType === "image" && (
        <>
          <div><Label className="text-xs">URL da imagem</Label><Input value={activeContent.src || ""} onChange={(e) => updateContent("src", e.target.value)} className="mt-1 text-xs h-8" /></div>
          <div>
            <Label className="text-xs">Upload</Label>
            <label className="mt-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border cursor-pointer hover:bg-muted/50 text-xs text-muted-foreground">
              <Upload className="w-3.5 h-3.5" />{uploading ? "Enviando..." : "Escolher arquivo"}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
          <div><Label className="text-xs">Alt text</Label><Input value={activeContent.alt || ""} onChange={(e) => updateContent("alt", e.target.value)} className="mt-1 text-xs h-8" /></div>
        </>
      )}

      {/* === button === */}
      {activeType === "button" && (
        <>
          <div><Label className="text-xs">Texto</Label><Input value={activeContent.text || ""} onChange={(e) => updateContent("text", e.target.value)} className="mt-1 text-xs h-8" /></div>
          <LucideIconPicker value={activeContent.icon || "Sparkles"} onChange={(v) => updateContent("icon", v)} label="Ícone do botão" />
          <div>
            <Label className="text-xs">Ação</Label>
            <Select value={activeContent.action || "checkout"} onValueChange={(v) => updateContent("action", v)}>
              <SelectTrigger className="mt-1 text-xs h-8"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="checkout">Checkout</SelectItem>
                <SelectItem value="scroll">Scroll</SelectItem>
                <SelectItem value="link">Link externo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* === checklist === */}
      {activeType === "checklist" && (
        <div>
          <Label className="text-xs">Estilo do marcador</Label>
          <Select value={activeContent.bulletStyle || "check"} onValueChange={(v) => updateContent("bulletStyle", v)}>
            <SelectTrigger className="mt-1 text-xs h-8"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="check">✓ Check</SelectItem>
              <SelectItem value="dot">● Ponto</SelectItem>
              <SelectItem value="dash">— Traço</SelectItem>
              <SelectItem value="number">1. Número</SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-2">
            <Label className="text-xs">Cor do marcador</Label>
            <div className="flex gap-2 mt-1">
              <input type="color" value={activeContent.checkColor || "#10b981"} onChange={(e) => updateContent("checkColor", e.target.value)} className="w-8 h-8 rounded border cursor-pointer" />
              <Input value={activeContent.checkColor || ""} onChange={(e) => updateContent("checkColor", e.target.value)} className="text-xs h-8 flex-1" placeholder="Padrão" />
            </div>
          </div>
          <Label className="text-xs mt-3 block">Itens do checklist</Label>
          <div className="space-y-1.5 mt-2">
            {(activeContent.items || []).map((item: string, i: number) => (
              <div key={i} className="flex gap-1">
                <Input value={item} onChange={(e) => updateItemAt("items", i, e.target.value)} className="text-xs h-7 flex-1" />
                <button onClick={() => removeItemAt("items", i)} className="p-1 hover:bg-destructive/10 rounded"><X className="w-3 h-3 text-destructive" /></button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-2 text-xs h-7" onClick={() => addItem("items", "Novo item")}>
            <Plus className="w-3 h-3 mr-1" />Adicionar item
          </Button>
        </div>
      )}

      {/* === checklist_emoji === */}
      {activeType === "checklist_emoji" && (
        <div>
          <Label className="text-xs">Itens com emoji</Label>
          <div className="space-y-1.5 mt-2">
            {(activeContent.items || []).map((item: any, i: number) => (
              <div key={i} className="flex gap-1">
                <Input value={item.emoji || ""} onChange={(e) => updateItemAt("items", i, { ...item, emoji: e.target.value })} className="text-xs h-7 w-12 text-center" />
                <Input value={item.text || ""} onChange={(e) => updateItemAt("items", i, { ...item, text: e.target.value })} className="text-xs h-7 flex-1" />
                <button onClick={() => removeItemAt("items", i)} className="p-1 hover:bg-destructive/10 rounded"><X className="w-3 h-3 text-destructive" /></button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-2 text-xs h-7" onClick={() => addItem("items", { emoji: "✨", text: "Novo item" })}>
            <Plus className="w-3 h-3 mr-1" />Adicionar item
          </Button>
        </div>
      )}

      {/* === pricing === */}
      {activeType === "pricing" && (
        <>
          <div className="flex gap-2">
            <div className="flex-1"><Label className="text-xs">Preço original</Label><Input value={activeContent.originalPrice || ""} onChange={(e) => updateContent("originalPrice", e.target.value)} className="mt-1 text-xs h-8" placeholder="59" /></div>
            <div className="flex-1"><Label className="text-xs">Preço atual</Label><Input value={activeContent.price || ""} onChange={(e) => updateContent("price", e.target.value)} className="mt-1 text-xs h-8" placeholder="29" /></div>
          </div>
          <div><Label className="text-xs">Sufixo</Label><Input value={activeContent.suffix || ""} onChange={(e) => updateContent("suffix", e.target.value)} className="mt-1 text-xs h-8" placeholder="/mês" /></div>
          <div><Label className="text-xs">Legenda</Label><Input value={activeContent.caption || ""} onChange={(e) => updateContent("caption", e.target.value)} className="mt-1 text-xs h-8" /></div>
        </>
      )}

      {/* === badge_label === */}
      {activeType === "badge_label" && (
        <>
          <div><Label className="text-xs">Texto</Label><Input value={activeContent.text || ""} onChange={(e) => updateContent("text", e.target.value)} className="mt-1 text-xs h-8" /></div>
          <div>
            <Label className="text-xs">Variante</Label>
            <Select value={activeContent.variant || "accent"} onValueChange={(v) => updateContent("variant", v)}>
              <SelectTrigger className="mt-1 text-xs h-8"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {BADGE_VARIANTS.map((v) => <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* === testimonial === */}
      {activeType === "testimonial" && (
        <div>
          <div className="mb-3"><Label className="text-xs">Título da seção</Label><Input value={activeContent.headerText || ""} onChange={(e) => updateContent("headerText", e.target.value)} className="mt-1 text-xs h-8" /></div>
          <Label className="text-xs">Depoimentos</Label>
          <div className="space-y-3 mt-2">
            {(activeContent.items || []).map((t: any, i: number) => (
              <div key={i} className="border border-border/30 rounded-lg p-2 space-y-1.5 relative">
                <button onClick={() => removeItemAt("items", i)} className="absolute top-1 right-1 p-0.5 hover:bg-destructive/10 rounded"><X className="w-3 h-3 text-destructive" /></button>
                <Input value={t.name || ""} onChange={(e) => updateItemAt("items", i, { ...t, name: e.target.value })} placeholder="Nome" className="text-xs h-7" />
                <Textarea value={t.text || ""} onChange={(e) => updateItemAt("items", i, { ...t, text: e.target.value })} placeholder="Texto" className="text-xs min-h-[40px]" />
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-[10px]">Estrelas</Label>
                    <Select value={String(t.stars || 5)} onValueChange={(v) => updateItemAt("items", i, { ...t, stars: Number(v) })}>
                      <SelectTrigger className="text-xs h-7"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {[1,2,3,4,5].map((n) => <SelectItem key={n} value={String(n)}>{n} ★</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1"><Label className="text-[10px]">Imagem URL</Label><Input value={t.image || ""} onChange={(e) => updateItemAt("items", i, { ...t, image: e.target.value })} className="text-xs h-7" /></div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-2 text-xs h-7" onClick={() => addItem("items", { name: "Nome", text: "Depoimento...", stars: 5, image: "" })}>
            <Plus className="w-3 h-3 mr-1" />Adicionar depoimento
          </Button>
        </div>
      )}

      {/* === trust_badges === */}
      {activeType === "trust_badges" && (
        <div>
          <Label className="text-xs">Trust Badges</Label>
          <div className="space-y-1.5 mt-2">
            {(activeContent.items || []).map((badge: any, i: number) => (
              <div key={i} className="flex gap-1 items-end">
                <div className="w-24">
                  <LucideIconPicker value={badge.icon || "ShieldCheck"} onChange={(v) => updateItemAt("items", i, { ...badge, icon: v })} label="" />
                </div>
                <Input value={badge.text || ""} onChange={(e) => updateItemAt("items", i, { ...badge, text: e.target.value })} className="text-xs h-8 flex-1" />
                <button onClick={() => removeItemAt("items", i)} className="p-1 hover:bg-destructive/10 rounded"><X className="w-3 h-3 text-destructive" /></button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-2 text-xs h-7" onClick={() => addItem("items", { icon: "ShieldCheck", text: "Novo badge" })}>
            <Plus className="w-3 h-3 mr-1" />Adicionar badge
          </Button>
        </div>
      )}

      {/* === faq_item === */}
      {activeType === "faq_item" && (
        <div>
          <div className="mb-3"><Label className="text-xs">Título</Label><Input value={activeContent.headerText || ""} onChange={(e) => updateContent("headerText", e.target.value)} className="mt-1 text-xs h-8" /></div>
          <Label className="text-xs">Perguntas & Respostas</Label>
          <div className="space-y-2 mt-2">
            {(activeContent.items || []).map((item: any, i: number) => (
              <div key={i} className="border border-border/30 rounded-lg p-2 space-y-1 relative">
                <button onClick={() => removeItemAt("items", i)} className="absolute top-1 right-1 p-0.5 hover:bg-destructive/10 rounded"><X className="w-3 h-3 text-destructive" /></button>
                <Input value={item.question || ""} onChange={(e) => updateItemAt("items", i, { ...item, question: e.target.value })} placeholder="Pergunta" className="text-xs h-7" />
                <Textarea value={item.answer || ""} onChange={(e) => updateItemAt("items", i, { ...item, answer: e.target.value })} placeholder="Resposta" className="text-xs min-h-[40px]" />
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-2 text-xs h-7" onClick={() => addItem("items", { question: "Nova pergunta?", answer: "Resposta..." })}>
            <Plus className="w-3 h-3 mr-1" />Adicionar pergunta
          </Button>
        </div>
      )}

      {/* === social_proof === */}
      {activeType === "social_proof" && (
        <>
          <LucideIconPicker value={activeContent.icon || "Users"} onChange={(v) => updateContent("icon", v)} />
          <div><Label className="text-xs">Contagem</Label><Input value={activeContent.count || ""} onChange={(e) => updateContent("count", e.target.value)} className="mt-1 text-xs h-8" placeholder="12.400" /></div>
          <div><Label className="text-xs">Texto</Label><Input value={activeContent.text || ""} onChange={(e) => updateContent("text", e.target.value)} className="mt-1 text-xs h-8" placeholder="mulheres já transformaram..." /></div>
        </>
      )}

      {/* === spacer === */}
      {activeType === "spacer" && (
        <div><Label className="text-xs">Altura (px)</Label><Input type="number" value={activeContent.height || 24} onChange={(e) => updateContent("height", Number(e.target.value))} className="mt-1 text-xs h-8" /></div>
      )}

      {/* === inner_section === */}
      {activeType === "inner_section" && (
        <>
          <div>
            <Label className="text-xs">Fundo da seção</Label>
            <Select value={activeContent.bgVariant || "warm"} onValueChange={(v) => updateContent("bgVariant", v)}>
              <SelectTrigger className="mt-1 text-xs h-8"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {INNER_SECTION_BG_VARIANTS.map((sv) => (
                  <SelectItem key={sv.value} value={sv.value}>
                    <span className="font-medium">{sv.label}</span>
                    <span className="ml-1 text-muted-foreground text-[10px]">— {sv.description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {activeContent.bgVariant === "custom" && (
            <div>
              <Label className="text-xs">Cor de fundo</Label>
              <div className="flex gap-2 mt-1">
                <input type="color" value={activeContent.customBgColor || "#FDF8F3"} onChange={(e) => updateContent("customBgColor", e.target.value)} className="w-8 h-8 rounded border cursor-pointer" />
                <Input value={activeContent.customBgColor || ""} onChange={(e) => updateContent("customBgColor", e.target.value)} className="text-xs h-8 flex-1" />
              </div>
            </div>
          )}
          <p className="text-[10px] text-muted-foreground">Os blocos dentro desta seção interna são editados diretamente no painel de propriedades ao selecioná-los.</p>
        </>
      )}

      {/* === code === */}
      {activeType === "code" && (
        <>
          <div><Label className="text-xs">HTML</Label><Textarea value={activeContent.html || ""} onChange={(e) => updateContent("html", e.target.value)} className="mt-1 text-xs min-h-[100px] font-mono" /></div>
          <div><Label className="text-xs">CSS</Label><Textarea value={activeContent.css || ""} onChange={(e) => updateContent("css", e.target.value)} className="mt-1 text-xs min-h-[60px] font-mono" /></div>
        </>
      )}

      {/* === divider === */}
      {activeType === "divider" && (
        <div>
          <Label className="text-xs">Estilo</Label>
          <Select value={activeContent.style || "line"} onValueChange={(v) => updateContent("style", v)}>
            <SelectTrigger className="mt-1 text-xs h-8"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="line">Linha</SelectItem>
              <SelectItem value="dots">Pontos</SelectItem>
              <SelectItem value="gradient">Gradiente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* === sticky_cta === */}
      {activeType === "sticky_cta" && !editingChild && (
        <>
          <div><Label className="text-xs">Texto da oferta</Label><Input value={activeContent.offerText || ""} onChange={(e) => updateContent("offerText", e.target.value)} className="mt-1 text-xs h-8" placeholder="Plano hoje com" /></div>
          <div><Label className="text-xs">Texto do desconto</Label><Input value={activeContent.discountText || ""} onChange={(e) => updateContent("discountText", e.target.value)} className="mt-1 text-xs h-8" placeholder="-52%" /></div>
          <div><Label className="text-xs">Preço</Label><Input value={activeContent.priceText || ""} onChange={(e) => updateContent("priceText", e.target.value)} className="mt-1 text-xs h-8" placeholder="R$ 29/mês" /></div>
          <div><Label className="text-xs">Subtítulo</Label><Input value={activeContent.subtitleText || ""} onChange={(e) => updateContent("subtitleText", e.target.value)} className="mt-1 text-xs h-8" placeholder="Cancele quando quiser" /></div>
          <div><Label className="text-xs">Texto do botão</Label><Input value={activeContent.buttonText || ""} onChange={(e) => updateContent("buttonText", e.target.value)} className="mt-1 text-xs h-8" placeholder="Desbloquear" /></div>
          <div>
            <Label className="text-xs">Badges (separados por vírgula)</Label>
            <Input
              value={(activeContent.badges || []).join(", ")}
              onChange={(e) => updateContent("badges", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
              className="mt-1 text-xs h-8"
              placeholder="Checkout seguro, Acesso imediato, Suporte"
            />
          </div>
        </>
      )}

      {/* === Legacy types === */}
      {activeType === "offer" && (
        <>
          <div><Label className="text-xs">Título</Label><Input value={activeContent.title || ""} onChange={(e) => updateContent("title", e.target.value)} className="mt-1 text-xs h-8" /></div>
          <div className="flex gap-2">
            <div className="flex-1"><Label className="text-xs">Preço</Label><Input value={activeContent.price || ""} onChange={(e) => updateContent("price", e.target.value)} className="mt-1 text-xs h-8" /></div>
            <div className="flex-1"><Label className="text-xs">De</Label><Input value={activeContent.originalPrice || ""} onChange={(e) => updateContent("originalPrice", e.target.value)} className="mt-1 text-xs h-8" /></div>
          </div>
          <div><Label className="text-xs">Itens (um por linha)</Label><Textarea value={(activeContent.items || []).join("\n")} onChange={(e) => updateContent("items", e.target.value.split("\n").filter(Boolean))} className="mt-1 text-xs min-h-[80px]" /></div>
        </>
      )}

      {activeType === "testimonials" && (
        <div><Label className="text-xs">Depoimentos (JSON)</Label><Textarea value={JSON.stringify(activeContent.items || [], null, 2)} onChange={(e) => { try { updateContent("items", JSON.parse(e.target.value)); } catch {} }} className="mt-1 text-xs min-h-[120px] font-mono" /></div>
      )}

      {activeType === "faq" && (
        <div><Label className="text-xs">FAQ (JSON)</Label><Textarea value={JSON.stringify(activeContent.items || [], null, 2)} onChange={(e) => { try { updateContent("items", JSON.parse(e.target.value)); } catch {} }} className="mt-1 text-xs min-h-[120px] font-mono" /></div>
      )}

      {/* === Style fields === */}
      {!isSection && !block.block_type.startsWith("section_") || editingChild ? (
        <div className="border-t border-border/30 pt-3 space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Tipografia</p>

          {/* Font Family */}
          <div>
            <Label className="text-xs">Fonte</Label>
            <Select value={activeStyles.fontFamily || "__default__"} onValueChange={(v) => updateStyles("fontFamily", v === "__default__" ? "" : v)}>
              <SelectTrigger className="mt-1 text-xs h-8"><SelectValue placeholder="Padrão" /></SelectTrigger>
              <SelectContent className="bg-popover z-50 max-h-60">
                {FONT_OPTIONS.map((f) => (
                  <SelectItem key={f.value || "__default__"} value={f.value || "__default__"}>
                    <span style={{ fontFamily: f.value || "inherit" }}>{f.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div><Label className="text-xs">Tamanho fonte</Label><Input value={activeStyles.fontSize || ""} onChange={(e) => updateStyles("fontSize", e.target.value)} placeholder="16px" className="mt-1 text-xs h-8" /></div>

          {/* Font Weight */}
          <div>
            <Label className="text-xs">Peso da fonte</Label>
            <Select value={activeStyles.fontWeight || "__default__"} onValueChange={(v) => updateStyles("fontWeight", v === "__default__" ? "" : v)}>
              <SelectTrigger className="mt-1 text-xs h-8"><SelectValue placeholder="Padrão" /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {FONT_WEIGHT_OPTIONS.map((w) => (
                  <SelectItem key={w.value || "__default__"} value={w.value || "__default__"}>{w.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Italic toggle */}
          <div className="flex items-center justify-between">
            <Label className="text-xs">Itálico</Label>
            <Switch checked={activeStyles.fontStyle === "italic"} onCheckedChange={(v) => updateStyles("fontStyle", v ? "italic" : "")} />
          </div>

          {/* Letter Spacing */}
          <div>
            <Label className="text-xs">Espaçamento letras</Label>
            <Select value={activeStyles.letterSpacing || "__default__"} onValueChange={(v) => updateStyles("letterSpacing", v === "__default__" ? "" : v)}>
              <SelectTrigger className="mt-1 text-xs h-8"><SelectValue placeholder="Padrão" /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {LETTER_SPACING_OPTIONS.map((ls) => (
                  <SelectItem key={ls.value || "__default__"} value={ls.value || "__default__"}>{ls.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Line Height */}
          <div>
            <Label className="text-xs">Altura da linha</Label>
            <Select value={activeStyles.lineHeight || "__default__"} onValueChange={(v) => updateStyles("lineHeight", v === "__default__" ? "" : v)}>
              <SelectTrigger className="mt-1 text-xs h-8"><SelectValue placeholder="Padrão" /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {LINE_HEIGHT_OPTIONS.map((lh) => (
                  <SelectItem key={lh.value || "__default__"} value={lh.value || "__default__"}>{lh.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Text Transform */}
          <div>
            <Label className="text-xs">Transformação de texto</Label>
            <Select value={activeStyles.textTransform || "__default__"} onValueChange={(v) => updateStyles("textTransform", v === "__default__" ? "" : v)}>
              <SelectTrigger className="mt-1 text-xs h-8"><SelectValue placeholder="Padrão" /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {TEXT_TRANSFORM_OPTIONS.map((tt) => (
                  <SelectItem key={tt.value || "__default__"} value={tt.value || "__default__"}>{tt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Alignment */}
          <div>
            <Label className="text-xs">Alinhamento</Label>
            <Select value={activeStyles.textAlign || "left"} onValueChange={(v) => updateStyles("textAlign", v)}>
              <SelectTrigger className="mt-1 text-xs h-8"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="left">Esquerda</SelectItem>
                <SelectItem value="center">Centro</SelectItem>
                <SelectItem value="right">Direita</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* === Colors Section === */}
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground pt-2">Cores</p>

          {/* Text Color */}
          <div>
            <Label className="text-xs">Cor do texto</Label>
            <div className="flex gap-2 mt-1">
              <input type="color" value={activeStyles.color || "#000000"} onChange={(e) => updateStyles("color", e.target.value)} className="w-8 h-8 rounded border cursor-pointer" />
              <Input value={activeStyles.color || ""} onChange={(e) => updateStyles("color", e.target.value)} className="text-xs h-8 flex-1" placeholder="#hex ou hsl()" />
            </div>
          </div>

          {/* Background Color */}
          <div>
            <Label className="text-xs">Cor de fundo</Label>
            <div className="flex gap-2 mt-1">
              <input type="color" value={activeStyles.bgColor || "#ffffff"} onChange={(e) => updateStyles("bgColor", e.target.value)} className="w-8 h-8 rounded border cursor-pointer" />
              <Input value={activeStyles.bgColor || ""} onChange={(e) => updateStyles("bgColor", e.target.value)} className="text-xs h-8 flex-1" placeholder="#hex ou hsl()" />
            </div>
          </div>

          {/* Background Gradient */}
          <div>
            <Label className="text-xs">Gradiente de fundo</Label>
            <Select value={activeStyles.bgGradient || "__none__"} onValueChange={(v) => updateStyles("bgGradient", v === "__none__" ? "" : v)}>
              <SelectTrigger className="mt-1 text-xs h-8"><SelectValue placeholder="Nenhum" /></SelectTrigger>
              <SelectContent className="bg-popover z-50 max-h-60">
                {GRADIENT_PRESETS.map((g) => (
                  <SelectItem key={g.value || "__none__"} value={g.value || "__none__"}>
                    <div className="flex items-center gap-2">
                      {g.value && <div className="w-4 h-4 rounded-full border border-border/50 flex-shrink-0" style={{ background: g.value }} />}
                      <span>{g.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input value={activeStyles.bgGradient || ""} onChange={(e) => updateStyles("bgGradient", e.target.value)} placeholder="linear-gradient(135deg, #cor1, #cor2)" className="mt-1 text-xs h-8" />
          </div>

          {/* Gradient text toggle */}
          <div className="flex items-center justify-between">
            <Label className="text-xs">Texto gradiente</Label>
            <Switch
              checked={activeStyles.WebkitBackgroundClip === "text"}
              onCheckedChange={(v) => {
                updateStyles("WebkitBackgroundClip", v ? "text" : "");
              }}
            />
          </div>

          {/* Text Shadow */}
          <div>
            <Label className="text-xs">Sombra do texto</Label>
            <Input value={activeStyles.textShadow || ""} onChange={(e) => updateStyles("textShadow", e.target.value)} placeholder="0 2px 4px rgba(0,0,0,0.3)" className="mt-1 text-xs h-8" />
          </div>

          {/* Opacity */}
          <div>
            <Label className="text-xs">Opacidade</Label>
            <Select value={activeStyles.opacity || "__default__"} onValueChange={(v) => updateStyles("opacity", v === "__default__" ? "" : v)}>
              <SelectTrigger className="mt-1 text-xs h-8"><SelectValue placeholder="100%" /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {OPACITY_OPTIONS.map((o) => (
                  <SelectItem key={o.value || "__default__"} value={o.value || "__default__"}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* === Box Section === */}
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground pt-2">Caixa & Bordas</p>

          {/* Padding */}
          <div><Label className="text-xs">Padding</Label><Input value={activeStyles.padding || ""} onChange={(e) => updateStyles("padding", e.target.value)} placeholder="8px 0" className="mt-1 text-xs h-8" /></div>

          {/* Margin */}
          <div><Label className="text-xs">Margem</Label><Input value={activeStyles.margin || ""} onChange={(e) => updateStyles("margin", e.target.value)} placeholder="0 auto" className="mt-1 text-xs h-8" /></div>

          {/* Border Radius */}
          <div><Label className="text-xs">Border radius</Label><Input value={activeStyles.borderRadius || ""} onChange={(e) => updateStyles("borderRadius", e.target.value)} placeholder="16px" className="mt-1 text-xs h-8" /></div>

          {/* Border Style */}
          <div>
            <Label className="text-xs">Estilo da borda</Label>
            <Select value={activeStyles.borderStyle || "__none__"} onValueChange={(v) => updateStyles("borderStyle", v === "__none__" ? "" : v)}>
              <SelectTrigger className="mt-1 text-xs h-8"><SelectValue placeholder="Nenhuma" /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {BORDER_STYLE_OPTIONS.map((bs) => (
                  <SelectItem key={bs.value || "__none__"} value={bs.value || "__none__"}>{bs.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Border Width */}
          {activeStyles.borderStyle && (
            <div><Label className="text-xs">Espessura da borda</Label><Input value={activeStyles.borderWidth || ""} onChange={(e) => updateStyles("borderWidth", e.target.value)} placeholder="1px" className="mt-1 text-xs h-8" /></div>
          )}

          {/* Border Color */}
          {activeStyles.borderStyle && (
            <div>
              <Label className="text-xs">Cor da borda</Label>
              <div className="flex gap-2 mt-1">
                <input type="color" value={activeStyles.borderColor || "#e0e0e0"} onChange={(e) => updateStyles("borderColor", e.target.value)} className="w-8 h-8 rounded border cursor-pointer" />
                <Input value={activeStyles.borderColor || ""} onChange={(e) => updateStyles("borderColor", e.target.value)} className="text-xs h-8 flex-1" />
              </div>
            </div>
          )}

          {/* Box Shadow */}
          <div>
            <Label className="text-xs">Sombra</Label>
            <Select value={activeStyles.boxShadow || "__none__"} onValueChange={(v) => updateStyles("boxShadow", v === "__none__" ? "" : v)}>
              <SelectTrigger className="mt-1 text-xs h-8"><SelectValue placeholder="Nenhuma" /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {SHADOW_PRESETS.map((sh) => (
                  <SelectItem key={sh.value || "__none__"} value={sh.value || "__none__"}>{sh.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input value={activeStyles.boxShadow || ""} onChange={(e) => updateStyles("boxShadow", e.target.value)} placeholder="0 4px 12px rgba(0,0,0,0.1)" className="mt-1 text-xs h-8" />
          </div>

          {/* Max Width */}
          <div><Label className="text-xs">Largura máxima</Label><Input value={activeStyles.maxWidth || ""} onChange={(e) => updateStyles("maxWidth", e.target.value)} placeholder="100%" className="mt-1 text-xs h-8" /></div>

          {/* Backdrop Filter */}
          <div><Label className="text-xs">Backdrop blur</Label><Input value={activeStyles.backdropFilter || ""} onChange={(e) => updateStyles("backdropFilter", e.target.value)} placeholder="blur(8px)" className="mt-1 text-xs h-8" /></div>
        </div>
      ) : null}

      {/* Delete */}
      {editingChild ? (
        <Button variant="destructive" size="sm" onClick={() => onDeleteChild?.(childBlock.id)} className="w-full mt-4">
          <Trash2 className="w-3.5 h-3.5 mr-1" />Excluir bloco filho
        </Button>
      ) : (
        <Button variant="destructive" size="sm" onClick={() => onDelete(block.id)} className="w-full mt-4">
          <Trash2 className="w-3.5 h-3.5 mr-1" />Excluir bloco
        </Button>
      )}
    </div>
  );
}
