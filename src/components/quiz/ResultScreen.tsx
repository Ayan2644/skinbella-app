import { Button } from '@/components/ui/button';
import { RotateCcw, ArrowRight } from 'lucide-react';
import HeroResult from '@/components/quiz/result/HeroResult';
import MeaningCard from '@/components/quiz/result/MeaningCard';
import ProjectionCard from '@/components/quiz/result/ProjectionCard';
import ProtocolBrandCard from '@/components/quiz/result/ProtocolBrandCard';
import LockedReportCard from '@/components/quiz/result/LockedReportCard';
import OfferCard from '@/components/quiz/result/OfferCard';
import Testimonials from '@/components/quiz/result/Testimonials';
import MiniFAQ from '@/components/quiz/result/MiniFAQ';

interface ResultScreenProps {
  profile: any;
  onRedo: () => void;
  onAccess: () => void;
}

export default function ResultScreen({ profile, onRedo, onAccess }: ResultScreenProps) {
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="app-frame relative safe-bottom animate-fade-in-up">
        <HeroResult skinAge={profile.skinAge} scores={profile.scores} />

        <div className="w-full space-y-6 mt-4">
          <MeaningCard skinAge={profile.skinAge} />
          <ProjectionCard skinAge={profile.skinAge} />
          <ProtocolBrandCard />
          <LockedReportCard />
          <OfferCard onAccess={onAccess} />
          <Testimonials />
          <MiniFAQ />

          <div className="px-5 pb-4">
            <Button variant="ghost" onClick={onRedo} className="w-full rounded-2xl h-11 text-muted-foreground text-sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Refazer quiz
            </Button>
          </div>
        </div>

        {/* sticky preso no frame */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="app-frame bg-background/95 backdrop-blur-md border-t border-border/30 px-5 py-3">
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
          </div>
        </div>
      </div>
    </div>
  );
}
