import type { PageBlock } from "@/hooks/usePageBlocks";

/** 
 * Default blocks that mirror the existing static ResultScreen layout.
 * These are loaded into the editor when no blocks exist in the database yet.
 */
export function getDefaultBlocks(): PageBlock[] {
  const now = new Date().toISOString();
  const base = { page_id: "quiz_result", is_visible: true, created_at: now, updated_at: now };
  let order = 0;

  return [
    // 1. Diagnóstico / Significado
    {
      ...base, id: crypto.randomUUID(), sort_order: order++,
      block_type: "heading",
      content: { text: "O que isso significa", level: "h2" },
      styles: { fontSize: "20px", fontFamily: "Playfair Display", textAlign: "left", padding: "8px 20px" },
    },
    {
      ...base, id: crypto.randomUUID(), sort_order: order++,
      block_type: "text",
      content: { text: "Sua pele apresenta sinais de envelhecimento precoce que podem ser revertidos." },
      styles: { fontSize: "13px", textAlign: "left", padding: "2px 20px" },
    },
    {
      ...base, id: crypto.randomUUID(), sort_order: order++,
      block_type: "text",
      content: { text: "Hidratação e proteção solar são prioridades imediatas." },
      styles: { fontSize: "13px", textAlign: "left", padding: "2px 20px" },
    },
    {
      ...base, id: crypto.randomUUID(), sort_order: order++,
      block_type: "text",
      content: { text: "Com um protocolo consistente, é possível recuperar vitalidade em semanas." },
      styles: { fontSize: "13px", textAlign: "left", padding: "2px 20px" },
    },

    // 2. Divisor
    {
      ...base, id: crypto.randomUUID(), sort_order: order++,
      block_type: "divider",
      content: { style: "gradient" },
      styles: { padding: "12px 20px" },
    },

    // 3. Projeção com Gráfico
    {
      ...base, id: crypto.randomUUID(), sort_order: order++,
      block_type: "heading",
      content: { text: "Projeção com o Protocolo", level: "h2" },
      styles: { fontSize: "20px", fontFamily: "Playfair Display", textAlign: "left", padding: "8px 20px" },
    },
    {
      ...base, id: crypto.randomUUID(), sort_order: order++,
      block_type: "text",
      content: { text: "Resultados estimados em 20 dias" },
      styles: { fontSize: "12px", textAlign: "left", padding: "0 20px", color: "hsl(var(--muted-foreground))" },
    },
    {
      ...base, id: crypto.randomUUID(), sort_order: order++,
      block_type: "chart",
      content: { chartType: "rejuvenation", config: {} },
      styles: { padding: "16px 20px" },
    },
    {
      ...base, id: crypto.randomUUID(), sort_order: order++,
      block_type: "text",
      content: { text: "Você pode reverter de 2 a 4 anos na aparência da sua pele." },
      styles: { fontSize: "17px", fontFamily: "Playfair Display", textAlign: "center", padding: "16px 20px", bgColor: "#FDF8F3", borderRadius: "20px" },
    },

    // 4. Checklist
    {
      ...base, id: crypto.randomUUID(), sort_order: order++,
      block_type: "text",
      content: { text: "✅ Plano diário guiado passo a passo" },
      styles: { fontSize: "13px", textAlign: "left", padding: "4px 20px" },
    },
    {
      ...base, id: crypto.randomUUID(), sort_order: order++,
      block_type: "text",
      content: { text: "✅ Checklist + streak de consistência" },
      styles: { fontSize: "13px", textAlign: "left", padding: "4px 20px" },
    },
    {
      ...base, id: crypto.randomUUID(), sort_order: order++,
      block_type: "text",
      content: { text: "✅ Selfie semanal para comparar evolução" },
      styles: { fontSize: "13px", textAlign: "left", padding: "4px 20px" },
    },

    // 5. CTA
    {
      ...base, id: crypto.randomUUID(), sort_order: order++,
      block_type: "button",
      content: { text: "Começar protocolo agora", action: "checkout", icon: "sparkles" },
      styles: { fontSize: "16px", padding: "12px 24px", borderRadius: "20px", textAlign: "center" },
    },

    // 6. Divisor
    {
      ...base, id: crypto.randomUUID(), sort_order: order++,
      block_type: "divider",
      content: { style: "gradient" },
      styles: { padding: "16px 20px" },
    },

    // 7. Protocolo Personalizado
    {
      ...base, id: crypto.randomUUID(), sort_order: order++,
      block_type: "heading",
      content: { text: "Protocolo Personalizado", level: "h3" },
      styles: { fontSize: "16px", textAlign: "left", padding: "8px 20px" },
    },
    {
      ...base, id: crypto.randomUUID(), sort_order: order++,
      block_type: "text",
      content: { text: "Com base na sua análise, criamos um protocolo exclusivo para rejuvenescer e proteger sua pele." },
      styles: { fontSize: "13px", textAlign: "left", padding: "4px 20px" },
    },

    // 8. Oferta
    {
      ...base, id: crypto.randomUUID(), sort_order: order++,
      block_type: "offer",
      content: {
        title: "Relatório completo bloqueado",
        price: "29",
        originalPrice: "59",
        items: [
          "💆 Plano de skincare personalizado",
          "🥗 Dieta anti-envelhecimento",
          "🌅 Rotina matinal e noturna guiada",
          "✅ Checklist diário interativo",
          "💊 Nutrientes e suplementos recomendados",
          "📸 Acompanhamento com selfie semanal",
        ],
      },
      styles: { padding: "16px 20px" },
    },

    // 9. Depoimentos
    {
      ...base, id: crypto.randomUUID(), sort_order: order++,
      block_type: "testimonials",
      content: {
        items: [
          { name: "Ana C.", text: "Minha pele mudou completamente em 30 dias seguindo o plano!", stars: 5 },
          { name: "Mariana S.", text: "O diagnóstico foi super preciso. Nunca me cuidei tão bem!", stars: 5 },
          { name: "Juliana R.", text: "Achei que era mais um quiz, mas o plano diário realmente funciona. Estou no dia 18!", stars: 5 },
        ],
      },
      styles: { padding: "16px 20px" },
    },

    // 10. FAQ
    {
      ...base, id: crypto.randomUUID(), sort_order: order++,
      block_type: "faq",
      content: {
        items: [
          { q: "Posso cancelar quando quiser?", a: "Sim! Você pode cancelar a qualquer momento, sem burocracia. Sem fidelidade." },
          { q: "Em quanto tempo vejo resultado?", a: "A maioria das usuárias percebe melhora visível na textura e hidratação em 7 a 14 dias." },
          { q: "Preciso comprar produtos caros?", a: "Não. O protocolo funciona com produtos acessíveis de farmácia. Nada de marcas premium obrigatórias." },
        ],
      },
      styles: { padding: "16px 20px" },
    },
  ];
}
