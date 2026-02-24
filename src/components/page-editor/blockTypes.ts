import {
  LayoutTemplate,
  CircleDot,
  TrendingUp,
  Sparkles,
  Lock,
  Tag,
  MessageSquare,
  HelpCircle,
  Type,
  AlignLeft,
  Image,
  MousePointer,
  Minus,
  BarChart3,
  Code,
  SeparatorHorizontal,
  SquarePlus,
} from "lucide-react";

export const STRUCTURED_LAYOUT_BLOCKS = [
  "section_hero",
  "section_meaning",
  "section_projection",
  "section_protocol",
  "section_locked_report",
  "section_offer",
  "section_testimonials",
  "section_faq",
  "section_custom",
] as const;

export type StructuredLayoutBlockType = (typeof STRUCTURED_LAYOUT_BLOCKS)[number];

/** Style variants for custom sections */
export const SECTION_STYLE_VARIANTS = [
  { value: "premium", label: "Card Premium", description: "Marble texture + porcelain" },
  { value: "simple", label: "Card Simples", description: "Fundo limpo com borda" },
  { value: "transparent", label: "Transparente", description: "Sem fundo, sem borda" },
  { value: "gradient", label: "Gradiente", description: "Gradiente accent suave" },
] as const;

export type SectionStyleVariant = (typeof SECTION_STYLE_VARIANTS)[number]["value"];

/** Child block types that can be placed inside a section_custom */
export const CHILD_BLOCK_TYPES = [
  {
    type: "heading",
    label: "Título",
    icon: Type,
    defaultContent: { text: "Novo Título", level: "h2" },
    defaultStyles: { fontSize: "20px", fontFamily: "Playfair Display", textAlign: "center", padding: "4px 0" },
  },
  {
    type: "text",
    label: "Texto",
    icon: AlignLeft,
    defaultContent: { text: "Parágrafo de texto..." },
    defaultStyles: { fontSize: "14px", textAlign: "left", padding: "4px 0" },
  },
  {
    type: "image",
    label: "Imagem",
    icon: Image,
    defaultContent: { src: "", alt: "Imagem", objectFit: "cover" },
    defaultStyles: { maxWidth: "100%", borderRadius: "16px", padding: "8px 0" },
  },
  {
    type: "button",
    label: "Botão",
    icon: MousePointer,
    defaultContent: { text: "Clique aqui", action: "checkout", icon: "sparkles" },
    defaultStyles: { fontSize: "16px", padding: "12px 24px", borderRadius: "20px", textAlign: "center" },
  },
  {
    type: "spacer",
    label: "Espaço",
    icon: Minus,
    defaultContent: { height: 24 },
    defaultStyles: {},
  },
  {
    type: "chart",
    label: "Gráfico",
    icon: BarChart3,
    defaultContent: { chartType: "rejuvenation", config: {} },
    defaultStyles: { padding: "8px 0" },
  },
  {
    type: "code",
    label: "Código",
    icon: Code,
    defaultContent: { html: "<div>Widget</div>", css: "" },
    defaultStyles: { padding: "4px 0" },
  },
  {
    type: "divider",
    label: "Divisor",
    icon: SeparatorHorizontal,
    defaultContent: { style: "gradient" },
    defaultStyles: { padding: "8px 0" },
  },
] as const;

/** Top-level blocks shown in the toolbar (sections) */
export const BLOCK_TYPES = [
  // === Seções pré-montadas ===
  { type: "section_hero", label: "Seção: Hero", icon: LayoutTemplate, defaultContent: {}, defaultStyles: {} },
  { type: "section_meaning", label: "Seção: Significado", icon: CircleDot, defaultContent: {}, defaultStyles: {} },
  { type: "section_projection", label: "Seção: Projeção", icon: TrendingUp, defaultContent: {}, defaultStyles: {} },
  { type: "section_protocol", label: "Seção: Protocolo", icon: Sparkles, defaultContent: {}, defaultStyles: {} },
  { type: "section_locked_report", label: "Seção: Relatório", icon: Lock, defaultContent: {}, defaultStyles: {} },
  { type: "section_offer", label: "Seção: Oferta", icon: Tag, defaultContent: {}, defaultStyles: {} },
  { type: "section_testimonials", label: "Seção: Depoimentos", icon: MessageSquare, defaultContent: {}, defaultStyles: {} },
  { type: "section_faq", label: "Seção: FAQ", icon: HelpCircle, defaultContent: {}, defaultStyles: {} },
  // === Nova Seção Customizada ===
  {
    type: "section_custom",
    label: "✨ Nova Seção",
    icon: SquarePlus,
    defaultContent: {
      title: "Nova Seção",
      sectionStyle: "premium" as SectionStyleVariant,
      children: [] as any[],
    },
    defaultStyles: { padding: "20px" },
  },
] as const;

export type BlockType = typeof BLOCK_TYPES[number]["type"];
