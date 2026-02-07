import { Check } from 'lucide-react';

interface ProjectionCardProps {
  skinAge: number;
}

export default function ProjectionCard({ skinAge }: ProjectionCardProps) {
  return (
    <div className="rounded-2xl bg-card border border-border/40 p-5 shadow-soft">
      <h3 className="text-base font-bold text-foreground font-['Playfair_Display'] mb-1">
        Projeção com o Protocolo
      </h3>
      <p className="text-[11px] text-muted-foreground mb-4">Resultados estimados em 20 dias</p>

      {/* Projection highlight */}
      <div
        className="rounded-xl p-4 mb-4"
        style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(var(--primary) / 0.03))' }}
      >
        <p className="text-[15px] font-semibold text-foreground leading-snug">
          Você pode reverter de{' '}
          <span className="text-primary font-bold">2 a 5 anos</span>{' '}
          na aparência da pele
        </p>
      </div>

      {/* Features */}
      <ul className="space-y-2.5">
        {[
          'Plano diário guiado passo a passo',
          'Checklist + streak de consistência',
          'Selfie semanal para comparar evolução',
        ].map((text) => (
          <li key={text} className="flex items-center gap-2.5 text-[13px] text-foreground/80">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-primary" />
            </div>
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
