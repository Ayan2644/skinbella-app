import ResultCard from './ResultCard';

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
      <ResultCard title="O que isso significa">
        <ul className="space-y-3">
          {insights.map((text, i) => (
            <li key={i} className="flex gap-3 items-start text-[13px] text-muted-foreground leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-[7px]" />
              {text}
            </li>
          ))}
        </ul>
      </ResultCard>
    </section>
  );
}
