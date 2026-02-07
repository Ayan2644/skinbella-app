import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw, ArrowRight } from 'lucide-react';
import HeroResult from './result/HeroResult';
import MeaningCard from './result/MeaningCard';
import ProjectionCard from './result/ProjectionCard';
import ProtocolBrandCard from './result/ProtocolBrandCard';
import LockedReportCard from './result/LockedReportCard';
import OfferCard from './result/OfferCard';
import Testimonials from './result/Testimonials';
import MiniFAQ from './result/MiniFAQ';

interface ResultScreenProps {
  profile: any;
  onRedo: () => void;
  onAccess: () => void;
}

export default function ResultScreen({ profile, onRedo, onAccess }: ResultScreenProps) {
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col animate-fade-in-up pb-28">
      {/* A) Hero: resultado + scores */}
      <HeroResult skinAge={profile.skinAge} scores={profile.scores} />

      <div className="max-w-[420px] mx-auto w-full space-y-7 mt-7">
        {/* B) O que isso significa */}
        <MeaningCard skinAge={profile.skinAge} />

        {/* C) Projeção com o Protocolo */}
        <ProjectionCard skinAge={profile.skinAge} />

        {/* D) Branding do programa */}
        <ProtocolBrandCard />

        {/* E) Relatório bloqueado */}
        <LockedReportCard />

        {/* F) Oferta */}
        <OfferCard onAccess={onAccess} />

        {/* G) Provas sociais */}
        <Testimonials />

        {/* H) FAQ + Garantia */}
        <MiniFAQ />

        {/* Redo */}
        <div className="px-5 pb-4">
          <Button variant="ghost" onClick={onRedo} className="w-full rounded-2xl h-11 text-muted-foreground text-sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Refazer quiz
          </Button>
        </div>
      </div>

      {/* Sticky footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/30 px-5 py-3">
        <div className="max-w-[420px] mx-auto flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-foreground truncate">
              Plano hoje com <span className="text-destructive font-bold">-52%</span>
            </p>
            <p className="text-[11px] text-muted-foreground">R$ 29/mês • Cancele quando quiser</p>
          </div>
          <Button onClick={onAccess} className="rounded-2xl h-11 px-5 text-sm font-semibold shadow-elegant flex-shrink-0">
            Desbloquear
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
