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
];

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

  return DEFAULT_LAYOUT_ORDER.map((block_type, index) => ({
    ...base,
    id: crypto.randomUUID(),
    block_type,
    sort_order: index,
    content: {},
    styles: {},
  }));
}
