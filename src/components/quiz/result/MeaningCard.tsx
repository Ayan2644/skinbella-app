import ResultCard from "./ResultCard";

interface MeaningCardProps {
  skinAge: number;
}

export default function MeaningCard({ skinAge }: MeaningCardProps) {
  const insights =
    skinAge > 30
      ? [
          "Sua pele apresenta sinais de envelhecimento precoce que podem ser revertidos.",
          "Hidratação e proteção solar são prioridades imediatas.",
          "Com um protocolo consistente, é possível recuperar vitalidade em semanas.",
        ]
      : [
          "Sua pele tem boa base, mas precisa de manutenção preventiva.",
          "Investir agora evita tratamentos caros no futuro.",
          "Um protocolo consistente potencializa seus resultados naturais.",
        ];

  return (
    <section className="px-5">
      <ResultCard title="O que isso significa">
        <ul className="space-y-3">
          {insights.map((text, i) => (
            <li key={i} className="flex gap-3 items-start text-[13px] text-muted-foreground leading-relaxed">
              <span
                className="w-[6px] h-[6px] rounded-full flex-shrink-0 mt-[7px]"
                style={{ backgroundColor: '#C8A96B' }}
              />
              {text}
            </li>
          ))}
        </ul>
      </ResultCard>
    </section>
  );
}
