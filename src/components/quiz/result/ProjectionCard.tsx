import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResultCard from './ResultCard';
import RejuvenationChart from './RejuvenationChart';

interface ProjectionCardProps {
  skinAge: number;
  onAccess?: () => void;
}

export default function ProjectionCard({ skinAge, onAccess }: ProjectionCardProps) {
  return (
    <section className="px-5 space-y-4">
      <ResultCard title="Projeção com o Protocolo" subtitle="Resultados estimados em 20 dias">
        <RejuvenationChart skinAge={skinAge} />

        <div className="mt-5">
          <ul className="space-y-3">
            {[
              'Plano diário guiado passo a passo',
              'Checklist + streak de consistência',
              'Selfie semanal para comparar evolução',
            ].map((text) => (
              <li key={text} className="flex items-center gap-3 text-[13px] text-foreground/80">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(78,107,87,0.1)' }}
                >
                  <Check className="w-3 h-3" style={{ color: '#4E6B57' }} />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {onAccess && (
          <Button
            onClick={onAccess}
            className="w-full mt-5 rounded-[20px] h-14 text-base font-semibold text-white"
            style={{ backgroundColor: '#4E6B57', boxShadow: '0 4px 16px rgba(78,107,87,0.25)' }}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Começar protocolo agora
          </Button>
        )}
      </ResultCard>
    </section>
  );
}
