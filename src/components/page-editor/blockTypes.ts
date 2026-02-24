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

/** Available font families for the editor */
export const FONT_OPTIONS = [
  { value: "", label: "Padrão" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Inter", label: "Inter" },
  { value: "Georgia", label: "Georgia" },
  { value: "Lora", label: "Lora" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Cormorant Garamond", label: "Cormorant Garamond" },
  { value: "DM Serif Display", label: "DM Serif Display" },
  { value: "Libre Baskerville", label: "Libre Baskerville" },
  { value: "Poppins", label: "Poppins" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Raleway", label: "Raleway" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Roboto", label: "Roboto" },
  { value: "Nunito", label: "Nunito" },
  { value: "Quicksand", label: "Quicksand" },
  { value: "Dancing Script", label: "Dancing Script" },
  { value: "Pacifico", label: "Pacifico" },
  { value: "system-ui", label: "System UI" },
] as const;

/** Font weight options */
export const FONT_WEIGHT_OPTIONS = [
  { value: "300", label: "Light (300)" },
  { value: "400", label: "Regular (400)" },
  { value: "500", label: "Medium (500)" },
  { value: "600", label: "Semibold (600)" },
  { value: "700", label: "Bold (700)" },
  { value: "800", label: "Extra Bold (800)" },
  { value: "900", label: "Black (900)" },
] as const;

/** Predefined gradient presets */
export const GRADIENT_PRESETS = [
  { value: "", label: "Nenhum" },
  { value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", label: "Violeta Suave" },
  { value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", label: "Rosa Quente" },
  { value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", label: "Azul Cristal" },
  { value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", label: "Verde Menta" },
  { value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", label: "Pôr do Sol" },
  { value: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", label: "Lavanda" },
  { value: "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)", label: "Pêssego Roxo" },
  { value: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", label: "Dourado Coral" },
  { value: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)", label: "Céu Azul" },
  { value: "linear-gradient(135deg, #c3cfe2 0%, #f5f7fa 100%)", label: "Prata Suave" },
  { value: "linear-gradient(135deg, #C8A96B 0%, #4E6B57 100%)", label: "Dourado → Verde" },
  { value: "linear-gradient(135deg, #F6F2ED 0%, #E8DFD4 100%)", label: "Porcelana" },
  { value: "linear-gradient(180deg, rgba(78,107,87,0.1) 0%, transparent 100%)", label: "Verde Fade" },
  { value: "linear-gradient(180deg, rgba(200,169,107,0.15) 0%, transparent 100%)", label: "Dourado Fade" },
  { value: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)", label: "Noite Escura" },
  { value: "linear-gradient(135deg, #2d1b69 0%, #11998e 100%)", label: "Cosmos" },
] as const;

/** Shadow presets */
export const SHADOW_PRESETS = [
  { value: "", label: "Nenhuma" },
  { value: "0 1px 3px rgba(0,0,0,0.1)", label: "Sutil" },
  { value: "0 4px 12px rgba(0,0,0,0.1)", label: "Suave" },
  { value: "0 8px 24px rgba(0,0,0,0.12)", label: "Média" },
  { value: "0 12px 40px rgba(0,0,0,0.15)", label: "Forte" },
  { value: "0 20px 60px rgba(0,0,0,0.2)", label: "Dramática" },
  { value: "0 0 20px rgba(78,107,87,0.3)", label: "Glow Verde" },
  { value: "0 0 20px rgba(200,169,107,0.3)", label: "Glow Dourado" },
  { value: "0 0 30px rgba(167,139,250,0.3)", label: "Glow Violeta" },
  { value: "inset 0 2px 6px rgba(0,0,0,0.1)", label: "Interna" },
] as const;

/** Border style options */
export const BORDER_STYLE_OPTIONS = [
  { value: "", label: "Nenhuma" },
  { value: "solid", label: "Sólida" },
  { value: "dashed", label: "Tracejada" },
  { value: "dotted", label: "Pontilhada" },
  { value: "double", label: "Dupla" },
] as const;

/** Letter spacing presets */
export const LETTER_SPACING_OPTIONS = [
  { value: "", label: "Padrão" },
  { value: "-0.05em", label: "Compacto" },
  { value: "0", label: "Normal" },
  { value: "0.05em", label: "Suave" },
  { value: "0.1em", label: "Espaçado" },
  { value: "0.2em", label: "Largo" },
  { value: "0.3em", label: "Muito Largo" },
] as const;

/** Text transform options */
export const TEXT_TRANSFORM_OPTIONS = [
  { value: "", label: "Padrão" },
  { value: "none", label: "Normal" },
  { value: "uppercase", label: "MAIÚSCULAS" },
  { value: "lowercase", label: "minúsculas" },
  { value: "capitalize", label: "Capitalizar" },
] as const;

/** Line height options */
export const LINE_HEIGHT_OPTIONS = [
  { value: "", label: "Padrão" },
  { value: "1", label: "1.0 — Compacto" },
  { value: "1.2", label: "1.2 — Justo" },
  { value: "1.4", label: "1.4 — Normal" },
  { value: "1.6", label: "1.6 — Confortável" },
  { value: "1.8", label: "1.8 — Espaçoso" },
  { value: "2", label: "2.0 — Duplo" },
] as const;

/** Opacity presets */
export const OPACITY_OPTIONS = [
  { value: "", label: "100%" },
  { value: "0.9", label: "90%" },
  { value: "0.8", label: "80%" },
  { value: "0.7", label: "70%" },
  { value: "0.6", label: "60%" },
  { value: "0.5", label: "50%" },
  { value: "0.4", label: "40%" },
  { value: "0.3", label: "30%" },
  { value: "0.2", label: "20%" },
  { value: "0.1", label: "10%" },
] as const;

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
