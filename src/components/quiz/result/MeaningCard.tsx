import ResultCard from "./ResultCard";
import beforeAfterImg from "@/assets/result/before-after.jpg";

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
        <div className="flex gap-5">
          {/* Left: bullets */}
          <div className="flex-1 min-w-0">
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
          </div>

          {/* Right: before/after image */}
          <div className="w-[120px] flex-shrink-0">
            <img
              src={beforeAfterImg}
              alt="Antes e depois"
              className="w-full rounded-2xl object-cover"
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
            />
            <div className="flex justify-between mt-2 px-1">
              <span className="text-[11px] text-muted-foreground">Antes</span>
              <span className="text-[11px] font-medium" style={{ color: '#4E6B57' }}>20 dias</span>
            </div>
          </div>
        </div>
      </ResultCard>
    </section>
  );
}
