import { Button } from "@/components/ui/button";
import { RotateCcw, ArrowRight } from "lucide-react";

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
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background flex justify-center">
      {/* FRAME */}
      <div className="relative w-full max-w-[420px] min-h-screen bg-background overflow-hidden">
        {/* Background texture / gradient (sutil, estilo porcelana) */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.9]">
          <div className="absolute inset-0 gradient-hero" />
          <div
            className="absolute -top-24 left-1/2 h-[320px] w-[520px] -translate-x-1/2 rounded-full blur-3xl opacity-[0.35]"
            style={{
              background: "radial-gradient(circle at 50% 50%, hsl(var(--porcelain) / 0.22), transparent 60%)",
            }}
          />
          <div
            className="absolute top-[220px] left-[-160px] h-[360px] w-[360px] rounded-full blur-3xl opacity-[0.25]"
            style={{
              background: "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.14), transparent 62%)",
            }}
          />
        </div>

        {/* CONTENT SCROLL */}
        <div className="relative z-10 flex flex-col pb-28">
          {/* HERO */}
          <div className="px-4 pt-2">
            <HeroResult skinAge={profile.skinAge} scores={profile.scores} />
          </div>

          {/* STACKED SECTIONS */}
          <div className="mt-4 space-y-6 px-4">
            <MeaningCard skinAge={profile.skinAge} />
            <ProjectionCard skinAge={profile.skinAge} />
            <ProtocolBrandCard />
            <LockedReportCard />
            <OfferCard onAccess={onAccess} />
            <Testimonials />
            <MiniFAQ />

            {/* REDO */}
            <div className="pb-6">
              <Button
                variant="ghost"
                onClick={onRedo}
                className="w-full rounded-2xl h-11 text-muted-foreground text-sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Refazer quiz
              </Button>
            </div>
          </div>
        </div>

        {/* STICKY CTA (preso ao frame) */}
        <div className="absolute bottom-0 left-0 right-0 z-50">
          <div className="px-4 pb-4">
            <div className="bg-background/92 backdrop-blur-md border border-border/40 rounded-[var(--radius-card)] shadow-elegant px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-foreground truncate">
                    Plano hoje com <span className="text-destructive font-bold">-52%</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">R$ 29/mês • Cancele quando quiser</p>
                </div>

                <Button
                  onClick={onAccess}
                  className="rounded-2xl h-11 px-5 text-sm font-semibold shadow-elegant flex-shrink-0"
                >
                  Desbloquear
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {/* micro trust row */}
              <div className="mt-2 flex items-center justify-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                  Checkout seguro
                </span>
                <span className="opacity-50">•</span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                  Acesso imediato
                </span>
                <span className="opacity-50">•</span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                  Suporte
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
