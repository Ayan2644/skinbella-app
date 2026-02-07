interface MeaningCardProps {
  skinAge: number;
}

export default function MeaningCard({ skinAge }: MeaningCardProps) {
  const insights = skinAge > 30
    ? [
        'Sua pele apresenta sinais de envelhecimento precoce que podem ser revertidos com cuidados direcionados.',
        'A hidratação e proteção solar são prioridades imediatas para o seu perfil.',
        'Com o protocolo correto, é possível recuperar a vitalidade em poucas semanas.',
      ]
    : [
        'Sua pele tem boa base, mas precisa de manutenção para preservar a juventude.',
        'Investir em prevenção agora evita tratamentos caros no futuro.',
        'Um protocolo diário consistente potencializa seus resultados naturais.',
      ];

  return (
    <section className="px-5">
      <div className="bg-card rounded-3xl border border-border/20 p-5 shadow-card">
        <h3 className="text-lg font-bold text-foreground font-['Playfair_Display'] mb-4">
          O que isso significa
        </h3>
        <ul className="space-y-3">
          {insights.map((text, i) => (
            <li key={i} className="flex gap-3 items-start text-[13px] text-muted-foreground leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-[7px]" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
