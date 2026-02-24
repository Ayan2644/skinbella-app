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
  // New icons for expanded child blocks
  Heading,
  ListChecks,
  SmilePlus,
  DollarSign,
  ShieldCheck,
  Quote,
  Users,
  Award,
  BadgeCheck,
  Gem,
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

/** Background variants for inner_section child blocks */
export const INNER_SECTION_BG_VARIANTS = [
  { value: "warm", label: "Bege Quente", description: "Como a seção de projeção" },
  { value: "accent", label: "Accent Suave", description: "Fundo com cor accent" },
  { value: "dark", label: "Escuro", description: "Fundo escuro com texto claro" },
  { value: "muted", label: "Neutro", description: "Fundo muted sutil" },
  { value: "custom", label: "Cor Customizada", description: "Escolha sua cor" },
] as const;

export type InnerSectionBgVariant = (typeof INNER_SECTION_BG_VARIANTS)[number]["value"];

export type SectionStyleVariant = (typeof SECTION_STYLE_VARIANTS)[number]["value"];

/** Common Lucide icon names available in the icon selector */
export const ICON_OPTIONS = [
  "Sparkles", "Shield", "Zap", "Heart", "Star", "Check", "Lock", "Users",
  "Headphones", "Gift", "Award", "TrendingUp", "Eye", "Clock",
  "ThumbsUp", "Flame", "Crown", "Target", "Gem", "Coffee",
  "ShieldCheck", "BadgeCheck", "CircleDot", "Droplets", "Leaf",
] as const;

/** Badge/label color variants */
export const BADGE_VARIANTS = [
  { value: "accent", label: "Accent" },
  { value: "success", label: "Verde" },
  { value: "warning", label: "Amarelo" },
  { value: "muted", label: "Neutro" },
] as const;

/** Category grouping for child block toolbar */
export type ChildBlockCategory = "content" | "lists" | "conversion" | "social" | "layout";

interface ChildBlockDef {
  type: string;
  label: string;
  icon: any;
  category: ChildBlockCategory;
  defaultContent: Record<string, any>;
  defaultStyles: Record<string, any>;
}

/** Child block types that can be placed inside a section_custom */
export const CHILD_BLOCK_TYPES: readonly ChildBlockDef[] = [
  // ── Conteúdo ──
  {
    type: "heading",
    label: "Título",
    icon: Type,
    category: "content",
    defaultContent: { text: "Novo Título", level: "h2" },
    defaultStyles: { fontSize: "20px", fontFamily: "Playfair Display", textAlign: "center", padding: "4px 0" },
  },
  {
    type: "headline_icon",
    label: "Título + Ícone",
    icon: Heading,
    category: "content",
    defaultContent: { text: "Título com Ícone", subtitle: "", icon: "Sparkles", level: "h2" },
    defaultStyles: { textAlign: "center", padding: "8px 0" },
  },
  {
    type: "headline_trigger",
    label: "Título + Gatilho",
    icon: Award,
    category: "content",
    defaultContent: { text: "Oferta Especial", badgeText: "-52% HOJE", badgeColor: "accent", icon: "Zap" },
    defaultStyles: { textAlign: "center", padding: "8px 0" },
  },
  {
    type: "text",
    label: "Texto",
    icon: AlignLeft,
    category: "content",
    defaultContent: { text: "Parágrafo de texto..." },
    defaultStyles: { fontSize: "14px", textAlign: "left", padding: "4px 0" },
  },
  {
    type: "image",
    label: "Imagem",
    icon: Image,
    category: "content",
    defaultContent: { src: "", alt: "Imagem", objectFit: "cover" },
    defaultStyles: { maxWidth: "100%", borderRadius: "16px", padding: "8px 0" },
  },
  {
    type: "icon_block",
    label: "Ícone Decorativo",
    icon: Gem,
    category: "content",
    defaultContent: { icon: "Sparkles", size: "md", bgColor: "primary" },
    defaultStyles: { textAlign: "center", padding: "8px 0" },
  },

  // ── Listas ──
  {
    type: "checklist",
    label: "Checklist",
    icon: ListChecks,
    category: "lists",
    defaultContent: { items: ["Benefício número um", "Benefício número dois", "Benefício número três"] },
    defaultStyles: { padding: "8px 0" },
  },
  {
    type: "checklist_emoji",
    label: "Checklist Emoji",
    icon: SmilePlus,
    category: "lists",
    defaultContent: { items: [{ emoji: "💆", text: "Plano personalizado" }, { emoji: "✨", text: "Resultados visíveis" }] },
    defaultStyles: { padding: "8px 0" },
  },
  {
    type: "faq_item",
    label: "FAQ",
    icon: HelpCircle,
    category: "lists",
    defaultContent: { headerText: "Perguntas Frequentes", items: [{ question: "Como funciona?", answer: "Resposta aqui..." }] },
    defaultStyles: { padding: "8px 0" },
  },

  // ── Conversão ──
  {
    type: "button",
    label: "Botão",
    icon: MousePointer,
    category: "conversion",
    defaultContent: { text: "Clique aqui", action: "checkout", icon: "Sparkles" },
    defaultStyles: { fontSize: "16px", padding: "12px 24px", borderRadius: "20px", textAlign: "center" },
  },
  {
    type: "pricing",
    label: "Preço",
    icon: DollarSign,
    category: "conversion",
    defaultContent: { originalPrice: "59", price: "29", suffix: "/mês", caption: "Cancele quando quiser • Acesso imediato" },
    defaultStyles: { textAlign: "center", padding: "12px 0" },
  },
  {
    type: "badge_label",
    label: "Badge / Etiqueta",
    icon: BadgeCheck,
    category: "conversion",
    defaultContent: { text: "OFERTA LIMITADA", variant: "accent" },
    defaultStyles: { textAlign: "center", padding: "4px 0" },
  },

  // ── Prova Social ──
  {
    type: "testimonial",
    label: "Depoimentos",
    icon: Quote,
    category: "social",
    defaultContent: {
      headerText: "O que dizem nossas usuárias",
      items: [{ name: "Ana C.", text: "Minha pele mudou completamente!", stars: 5, image: "" }],
    },
    defaultStyles: { padding: "8px 0" },
  },
  {
    type: "trust_badges",
    label: "Trust Badges",
    icon: ShieldCheck,
    category: "social",
    defaultContent: { items: [{ icon: "ShieldCheck", text: "Compra segura" }, { icon: "Lock", text: "Dados protegidos" }] },
    defaultStyles: { padding: "8px 0" },
  },
  {
    type: "social_proof",
    label: "Prova Social",
    icon: Users,
    category: "social",
    defaultContent: { icon: "Users", count: "12.400", text: "mulheres já transformaram sua pele" },
    defaultStyles: { textAlign: "center", padding: "8px 0" },
  },

  // ── Layout ──
  {
    type: "spacer",
    label: "Espaço",
    icon: Minus,
    category: "layout",
    defaultContent: { height: 24 },
    defaultStyles: {},
  },
  {
    type: "inner_section",
    label: "Seção Interna",
    icon: LayoutTemplate,
    category: "layout",
    defaultContent: {
      bgVariant: "warm",
      children: [] as any[],
    },
    defaultStyles: { padding: "0" },
  },
  {
    type: "divider",
    label: "Divisor",
    icon: SeparatorHorizontal,
    category: "layout",
    defaultContent: { style: "gradient" },
    defaultStyles: { padding: "8px 0" },
  },
  {
    type: "chart",
    label: "Gráfico",
    icon: BarChart3,
    category: "layout",
    defaultContent: { chartType: "rejuvenation", config: {} },
    defaultStyles: { padding: "8px 0" },
  },
  {
    type: "code",
    label: "Código",
    icon: Code,
    category: "layout",
    defaultContent: { html: "<div>Widget</div>", css: "" },
    defaultStyles: { padding: "4px 0" },
  },
] as const;

export const CHILD_BLOCK_CATEGORIES: { key: ChildBlockCategory; label: string }[] = [
  { key: "content", label: "Conteúdo" },
  { key: "lists", label: "Listas" },
  { key: "conversion", label: "Conversão" },
  { key: "social", label: "Prova Social" },
  { key: "layout", label: "Layout" },
];

/** Top-level blocks shown in the toolbar (sections) */
export const BLOCK_TYPES = [
  { type: "section_hero", label: "Seção: Hero", icon: LayoutTemplate, defaultContent: {}, defaultStyles: {} },
  { type: "section_meaning", label: "Seção: Significado", icon: CircleDot, defaultContent: {}, defaultStyles: {} },
  { type: "section_projection", label: "Seção: Projeção", icon: TrendingUp, defaultContent: {}, defaultStyles: {} },
  { type: "section_protocol", label: "Seção: Protocolo", icon: Sparkles, defaultContent: {}, defaultStyles: {} },
  { type: "section_locked_report", label: "Seção: Relatório", icon: Lock, defaultContent: {}, defaultStyles: {} },
  { type: "section_offer", label: "Seção: Oferta", icon: Tag, defaultContent: {}, defaultStyles: {} },
  { type: "section_testimonials", label: "Seção: Depoimentos", icon: MessageSquare, defaultContent: {}, defaultStyles: {} },
  { type: "section_faq", label: "Seção: FAQ", icon: HelpCircle, defaultContent: {}, defaultStyles: {} },
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
