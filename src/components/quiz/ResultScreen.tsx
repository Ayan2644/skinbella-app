import { Button } from "@/components/ui/button";
import { RotateCcw, ArrowRight } from "lucide-react";
import marbleBg from "@/assets/result/marble-bg.png";
import HeroResult from "./result/HeroResult";
import MeaningCard from "./result/MeaningCard";
import ProjectionCard from "./result/ProjectionCard";
import ProductShowcaseCard from "./result/ProductShowcaseCard";
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
    <div className="min-h-screen result-bg flex justify-center relative">
      {/* Marble background image */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url(${marbleBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.18,
        }}
      />
      {/* PHONE FRAME */}
      <div className="relative z-10 w-full max-w-[420px] min-h-screen flex flex-col animate-fade-in-up pb-28">
        {/* HERO */}
        <HeroResult skinAge={profile.skinAge} scores={profile.scores} />

        {/* CONTENT — conversion-optimized order */}
        <div className="w-full space-y-8 mt-6">
          <MeaningCard skinAge={profile.skinAge} />
          <ProjectionCard skinAge={profile.skinAge} onAccess={onAccess} />
          <ProductShowcaseCard />
          <OfferCard onAccess={onAccess} />
          <Testimonials />
          <MiniFAQ />

          {/* REDO */}
          <div className="px-5 pb-4">
            <Button variant="ghost" onClick={onRedo} className="w-full rounded-[20px] h-11 text-muted-foreground text-sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Refazer quiz
            </Button>
          </div>
        </div>

        {/* STICKY CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div
            className="mx-auto w-full max-w-[420px] px-5 py-3"
            style={{
              background: 'rgba(246,242,237,0.95)',
              backdropFilter: 'blur(12px)',
              borderTop: '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-foreground truncate">
                  Plano hoje com <span className="font-bold" style={{ color: '#C8A96B' }}>-52%</span>
                </p>
                <p className="text-[11px] text-muted-foreground">R$ 29/mês • Cancele quando quiser</p>
              </div>
              <Button
                onClick={onAccess}
                className="rounded-[20px] h-11 px-5 text-sm font-semibold text-white flex-shrink-0"
                style={{ backgroundColor: '#4E6B57', boxShadow: '0 4px 16px rgba(78,107,87,0.25)' }}
              >
                Desbloquear
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
