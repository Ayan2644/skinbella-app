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
    <ResultCard title="Projeção com o Protocolo" subtitle="Resultados estimados em 20 dias">
      {/* Chart + Before/After side by side */}
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <RejuvenationChart skinAge={skinAge} />
        </div>

        {/* Before/After circle */}
        <div className="w-24 flex flex-col items-center gap-2 flex-shrink-0">
          <div
            className="relative w-20 h-20 rounded-full overflow-hidden flex items-center justify-center"
            style={{
              border: '2px solid rgba(78,107,87,0.2)',
              background: 'linear-gradient(135deg, #F6F2ED, #EDE8E1)',
            }}
          >
            {/* Vertical divider */}
            <div className="absolute top-2 bottom-2 left-1/2 w-px -translate-x-1/2" style={{ backgroundColor: 'rgba(78,107,87,0.25)' }} />
            <span className="text-[9px] font-bold tracking-wide" style={{ color: '#4E6B57' }}>
              ANTES | DEPOIS
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Evolução</span>
        </div>
      </div>

      {/* Impact banner */}
      <div
        className="rounded-xl p-4 my-4 text-center"
        style={{
          background: '#FDF8F3',
          border: '1px solid rgba(200,169,107,0.2)',
        }}
      >
        <p className="font-display italic text-lg" style={{ color: '#4E6B57' }}>
          Você pode reverter de{' '}
          <span className="font-bold underline">2 a 4 anos</span>{' '}
          na aparência da sua pele.
        </p>
      </div>

      {/* Checklist */}
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
  );
}
