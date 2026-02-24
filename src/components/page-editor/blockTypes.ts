import { Type, AlignLeft, Image, MousePointer, Minus, BarChart3, Code, Tag, MessageSquare, HelpCircle, SeparatorHorizontal } from "lucide-react";

export const BLOCK_TYPES = [
  { type: "heading", label: "Título", icon: Type, defaultContent: { text: "Novo Título", level: "h2" }, defaultStyles: { fontSize: "28px", fontFamily: "Playfair Display", textAlign: "center", padding: "8px 0" } },
  { type: "text", label: "Texto", icon: AlignLeft, defaultContent: { text: "Parágrafo de texto...", html: false }, defaultStyles: { fontSize: "14px", textAlign: "left", padding: "4px 0" } },
  { type: "image", label: "Imagem", icon: Image, defaultContent: { src: "", alt: "Imagem", objectFit: "cover" }, defaultStyles: { maxWidth: "100%", borderRadius: "16px", padding: "8px 0" } },
  { type: "button", label: "Botão", icon: MousePointer, defaultContent: { text: "Clique aqui", action: "checkout", icon: "sparkles" }, defaultStyles: { fontSize: "16px", padding: "12px 24px", borderRadius: "20px", textAlign: "center" } },
  { type: "spacer", label: "Espaço", icon: Minus, defaultContent: { height: 32 }, defaultStyles: {} },
  { type: "chart", label: "Gráfico", icon: BarChart3, defaultContent: { chartType: "rejuvenation", config: {} }, defaultStyles: { padding: "16px 0" } },
  { type: "code", label: "Código", icon: Code, defaultContent: { html: "<div>Widget customizado</div>", css: "", description: "Bloco de código" }, defaultStyles: { padding: "8px 0" } },
  { type: "offer", label: "Oferta", icon: Tag, defaultContent: { title: "Oferta especial", price: "29", originalPrice: "59", items: ["Item 1", "Item 2"] }, defaultStyles: { padding: "16px 0" } },
  { type: "testimonials", label: "Depoimentos", icon: MessageSquare, defaultContent: { items: [{ name: "Ana", text: "Incrível!", stars: 5 }] }, defaultStyles: { padding: "16px 0" } },
  { type: "faq", label: "FAQ", icon: HelpCircle, defaultContent: { items: [{ q: "Pergunta?", a: "Resposta." }] }, defaultStyles: { padding: "16px 0" } },
  { type: "divider", label: "Divisor", icon: SeparatorHorizontal, defaultContent: { style: "line" }, defaultStyles: { padding: "16px 0" } },
] as const;

export type BlockType = typeof BLOCK_TYPES[number]["type"];
