import { Button } from "@/components/ui/button";
import { RotateCcw, ArrowRight } from "lucide-react";
import { usePublicPageBlocks } from "@/hooks/usePageBlocks";
import { STRUCTURED_LAYOUT_BLOCKS } from "@/components/page-editor/blockTypes";
import BlockRenderer from "@/components/page-editor/BlockRenderer";

import HeroResult from "./result/HeroResult";
import MeaningCard from "./result/MeaningCard";
import ProjectionCard from "./result/ProjectionCard";
import ProtocolBrandCard from "./result/ProtocolBrandCard";
import LockedReportCard from "./result/LockedReportCard";
import OfferCard from "./result/OfferCard";
import Testimonials from "./result/Testimonials";
import MiniFAQ from "./result/MiniFAQ";

interface ResultScreenProps {
  profile: any;
  onRedo: () => void;
  onAccess: () => void;
}

export default function ResultScreen({ profile, onRedo, onAccess }: ResultScreenProps) {
  const { data: blocks, isLoading } = usePublicPageBlocks();

  if (!profile) return null;

  const useCustomLayout =
    !isLoading &&
    Array.isArray(blocks) &&
    blocks.some((block) =>
      STRUCTURED_LAYOUT_BLOCKS.includes(block.block_type as (typeof STRUCTURED_LAYOUT_BLOCKS)[number])
    );

  // Find sticky_cta block from saved blocks
  const stickyCta = Array.isArray(blocks) ? blocks.find((b) => b.block_type === "sticky_cta" && b.is_visible) : null;
  const ctaContent = stickyCta?.content || {};

  const handleAction = (action: string) => {
    if (action === "checkout") onAccess();
  };

  // Render sticky CTA (from block or fallback)
  const renderStickyCta = () => {
    const offerText = ctaContent.offerText || "Plano hoje com";
    const discountText = ctaContent.discountText || "-52%";
    const priceText = ctaContent.priceText || "R$ 19/mês";
    const subtitleText = ctaContent.subtitleText || "Cancele quando quiser";
    const buttonText = ctaContent.buttonText || "Desbloquear";
    const badges: string[] = ctaContent.badges || ["Checkout seguro", "Acesso imediato", "Suporte"];

    return (
      <div className="absolute bottom-0 left-0 right-0 z-50">
        <div className="px-4 pb-4">
          <div className="bg-background/92 backdrop-blur-md border border-border/40 rounded-[var(--radius-card)] shadow-elegant px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-foreground truncate">
                  {offerText} <span className="text-destructive font-bold">{discountText}</span>
                </p>
                <p className="text-[11px] text-muted-foreground">{priceText} • {subtitleText}</p>
              </div>
              <Button onClick={onAccess} className="rounded-2xl h-11 px-5 text-sm font-semibold shadow-elegant flex-shrink-0">
                {buttonText}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            {badges.length > 0 && (
              <div className="mt-2 flex items-center justify-center gap-3 text-[11px] text-muted-foreground">
                {badges.map((badge, i) => (
                  <span key={i} className="inline-flex items-center gap-1">
                    {i > 0 && <span className="opacity-50 mr-3">•</span>}
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />{badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="relative w-full max-w-[520px] min-h-screen bg-background overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.9]">
          <div className="absolute inset-0 gradient-hero" />
          <div
            className="absolute -top-24 left-1/2 h-[320px] w-[520px] -translate-x-1/2 rounded-full blur-3xl opacity-[0.35]"
            style={{ background: "radial-gradient(circle at 50% 50%, hsl(var(--surface-strong) / 0.35), transparent 60%)" }}
          />
          <div
            className="absolute top-[220px] left-[-160px] h-[360px] w-[360px] rounded-full blur-3xl opacity-[0.25]"
            style={{ background: "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.14), transparent 62%)" }}
          />
        </div>

        <div className="relative z-10 flex flex-col pb-28">
          {useCustomLayout ? (
            <div className="px-2 pt-2 space-y-4">
              {blocks
                .filter((block) => block.block_type !== "sticky_cta")
                .map((block) => (
                  <BlockRenderer
                    key={block.id}
                    block={block}
                    profile={{ skinAge: profile.skinAge, scores: profile.scores }}
                    onAction={handleAction}
                  />
                ))}
              {/* REDO */}
              <div className="pb-6 px-3">
                <Button variant="ghost" onClick={onRedo} className="w-full rounded-2xl h-11 text-muted-foreground text-sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Refazer quiz
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="px-2 pt-2">
                <HeroResult skinAge={profile.skinAge} scores={profile.scores} />
              </div>
              <div className="mt-4 space-y-6 px-2">
                <MeaningCard skinAge={profile.skinAge} />
                <ProjectionCard skinAge={profile.skinAge} />
                <ProtocolBrandCard />
                <LockedReportCard />
                <OfferCard onAccess={onAccess} />
                <Testimonials />
                <MiniFAQ />
                <div className="pb-6">
                  <Button variant="ghost" onClick={onRedo} className="w-full rounded-2xl h-11 text-muted-foreground text-sm">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Refazer quiz
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* STICKY CTA */}
        {renderStickyCta()}
      </div>
    </div>
  );
}
