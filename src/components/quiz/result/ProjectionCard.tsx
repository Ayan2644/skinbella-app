import { Check } from 'lucide-react';
import ResultCard from './ResultCard';

interface ProjectionCardProps {
  skinAge: number;
}

export default function ProjectionCard({ skinAge }: ProjectionCardProps) {
  return (
    <section className="px-5">
      <ResultCard title="Projeção com o Protocolo" subtitle="Resultados estimados em 20 dias">
        <div
          className="rounded-2xl p-4 mb-5"
          style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.07), hsl(var(--primary) / 0.02))' }}
        >
          <p className="text-[15px] font-semibold text-foreground leading-snug">
            Você pode reverter de{' '}
            <span className="text-primary font-bold">2 a 5 anos</span>{' '}
            na aparência da pele
          </p>
        </div>

        <ul className="space-y-3">
          {[
            'Plano diário guiado passo a passo',
            'Checklist + streak de consistência',
            'Selfie semanal para comparar evolução',
          ].map((text) => (
            <li key={text} className="flex items-center gap-3 text-[13px] text-foreground/80">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-primary" />
              </div>
              {text}
            </li>
          ))}
        </ul>
      </ResultCard>
    </section>
  );
}
