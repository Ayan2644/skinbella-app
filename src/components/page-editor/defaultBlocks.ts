import type { PageBlock } from "@/hooks/usePageBlocks";

const DEFAULT_LAYOUT_ORDER: PageBlock["block_type"][] = [
  "section_hero",
  "section_meaning",
  "section_projection",
  "section_protocol",
  "section_locked_report",
  "section_offer",
  "section_testimonials",
  "section_faq",
  "sticky_cta",
];

function uid() {
  return crypto.randomUUID();
}

function child(block_type: string, content: Record<string, any>, styles: Record<string, any> = {}) {
  return { id: uid(), block_type, is_visible: true, content, styles };
}

/**
 * Generate default children for each predefined section,
 * replicating the static components' content exactly.
 */
export function getDefaultChildrenForSection(sectionType: string): any[] {
  switch (sectionType) {
    case "section_meaning":
      return [
        child("checklist", {
          items: [
            "Sua pele apresenta sinais de envelhecimento precoce que podem ser revertidos.",
            "Hidratação e proteção solar são prioridades imediatas.",
            "Com um protocolo consistente, é possível recuperar vitalidade em semanas.",
          ],
          bulletStyle: "dot",
          checkColor: "#C8A96B",
        }),
      ];

    case "section_projection":
      return [
        child("chart", { chartType: "rejuvenation", config: {} }),
        child("inner_section", {
          bgVariant: "warm",
          children: [
            child("text", { text: "Você pode reverter de 2 a 4 anos na aparência da sua pele." }, { fontFamily: "Playfair Display", fontStyle: "italic", textAlign: "center", fontSize: "17px" }),
          ],
        }, { padding: "0" }),
        child("checklist", {
          items: [
            "Plano diário guiado passo a passo",
            "Checklist + streak de consistência",
            "Selfie semanal para comparar evolução",
          ],
          bulletStyle: "check",
          checkColor: "",
        }),
        child("button", { text: "Começar protocolo agora", action: "checkout", icon: "Sparkles" }, { textAlign: "center" }),
        child("trust_badges", {
          items: [
            { icon: "", text: "Acesso Imediato" },
            { icon: "", text: "Checkout Seguro" },
          ],
        }),
      ];

    case "section_protocol":
      return [
        child("icon_block", { icon: "Sparkles", size: "md", bgColor: "primary" }, { textAlign: "center" }),
        child("heading", { text: "Protocolo Pele de Porcelana™", level: "h2" }, { fontSize: "22px", fontFamily: "Playfair Display", textAlign: "center" }),
        child("text", { text: "Tratamento intensivo de recuperação da idade da pele" }, { textAlign: "center", fontSize: "14px" }),
        child("badge_label", { text: "Plano guiado + acompanhamento diário", variant: "muted" }, { textAlign: "center" }),
      ];

    case "section_locked_report":
      return [
        child("headline_icon", { text: "Relatório completo bloqueado", subtitle: "Incluso no Protocolo Pele de Porcelana™", icon: "Lock", level: "h3" }, { textAlign: "left" }),
        child("checklist_emoji", {
          items: [
            { emoji: "💆", text: "Plano de skincare personalizado" },
            { emoji: "🥗", text: "Dieta anti-envelhecimento" },
            { emoji: "🌅", text: "Rotina matinal e noturna guiada" },
            { emoji: "✅", text: "Checklist diário interativo" },
            { emoji: "💊", text: "Nutrientes e suplementos recomendados" },
            { emoji: "📸", text: "Acompanhamento com selfie semanal" },
          ],
        }),
      ];

    case "section_offer":
      return [
        child("headline_trigger", { text: "Relatório completo bloqueado", badgeText: "-52% HOJE", badgeColor: "accent", icon: "Lock" }),
        child("checklist_emoji", {
          items: [
            { emoji: "💆", text: "Plano de skincare personalizado" },
            { emoji: "🥗", text: "Dieta anti-envelhecimento" },
            { emoji: "🌅", text: "Rotina matinal e noturna guiada" },
            { emoji: "✅", text: "Checklist diário interativo" },
            { emoji: "💊", text: "Nutrientes e suplementos recomendados" },
            { emoji: "📸", text: "Acompanhamento com selfie semanal" },
          ],
        }),
        child("pricing", { originalPrice: "39", price: "19", suffix: "/mês", caption: "Cancele quando quiser • Acesso imediato" }, { textAlign: "center" }),
        child("button", { text: "Começar tratamento agora", action: "checkout", icon: "Sparkles" }, { textAlign: "center" }),
        child("trust_badges", {
          items: [
            { icon: "Shield", text: "Checkout seguro" },
            { icon: "Zap", text: "Acesso imediato" },
            { icon: "Headphones", text: "Suporte" },
          ],
        }),
      ];

    case "section_testimonials":
      return [
        child("heading", { text: "O que dizem nossas usuárias", level: "h3" }, { fontSize: "11px", textAlign: "center", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: "600" }),
        child("testimonial", {
          headerText: "",
          items: [
            { name: "Ana C.", text: "Minha pele mudou completamente em 30 dias seguindo o plano!", stars: 5, image: "" },
            { name: "Mariana S.", text: "O diagnóstico foi super preciso. Nunca me cuidei tão bem!", stars: 5, image: "" },
            { name: "Juliana R.", text: "Achei que era mais um quiz, mas o plano diário realmente funciona. Estou no dia 18!", stars: 5, image: "" },
          ],
        }),
        child("social_proof", { icon: "Users", count: "12.400", text: "mulheres já fizeram a análise" }),
      ];

    case "section_faq":
      return [
        child("heading", { text: "Dúvidas frequentes", level: "h3" }, { fontSize: "11px", textAlign: "center", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: "600" }),
        child("faq_item", {
          headerText: "",
          items: [
            { question: "Posso cancelar quando quiser?", answer: "Sim! Você pode cancelar a qualquer momento, sem burocracia. Sem fidelidade." },
            { question: "Em quanto tempo vejo resultado?", answer: "A maioria das usuárias percebe melhora visível na textura e hidratação em 7 a 14 dias." },
            { question: "Preciso comprar produtos caros?", answer: "Não. O protocolo funciona com produtos acessíveis de farmácia. Nada de marcas premium obrigatórias." },
          ],
        }),
        child("trust_badges", {
          items: [
            { icon: "Shield", text: "Pagamento 100% seguro • Garantia de 7 dias" },
          ],
        }),
      ];

    default:
      return [];
  }
}

/**
 * Default content map for each section type.
 */
const defaultContentMap: Record<string, Record<string, any>> = {
  section_meaning: {
    title: "O que isso significa",
    sectionStyle: "premium",
  },
  section_projection: {
    title: "Projeção com o Protocolo",
    sectionStyle: "premium",
  },
  section_protocol: {
    title: "",
    sectionStyle: "simple",
  },
  section_locked_report: {
    title: "",
    sectionStyle: "premium",
  },
  section_offer: {
    title: "",
    sectionStyle: "premium",
  },
  section_testimonials: {
    title: "",
    sectionStyle: "transparent",
  },
  section_faq: {
    title: "",
    sectionStyle: "transparent",
  },
  sticky_cta: {
    offerText: "Plano hoje com",
    discountText: "-52%",
    priceText: "R$ 19/mês",
    subtitleText: "Cancele quando quiser",
    buttonText: "Desbloquear",
    buttonAction: "checkout",
    badges: ["Checkout seguro", "Acesso imediato", "Suporte"],
  },
};

/**
 * Default blocks that mirror the premium static ResultScreen layout.
 * These are loaded into the editor when no valid structured blocks exist.
 */
export function getDefaultBlocks(): PageBlock[] {
  const now = new Date().toISOString();
  const base = {
    page_id: "quiz_result",
    is_visible: true,
    created_at: now,
    updated_at: now,
  };

  return DEFAULT_LAYOUT_ORDER.map((block_type, index) => {
    const content = { ...(defaultContentMap[block_type] || {}) };

    // Populate children for editable sections
    const children = getDefaultChildrenForSection(block_type);
    if (children.length > 0) {
      content.children = children;
    }

    return {
      ...base,
      id: uid(),
      block_type,
      sort_order: index,
      content,
      styles: {},
    };
  });
}
