import { quizQuestions } from "@/lib/quizData";

interface HeroResultProps {
  skinAge: number;
  scores: { hidratacao: number; textura: number };
}

function ScorePill({ label, value }: { label: string; value: number }) {
  return (
    <div className="sb-card !p-4 text-center rounded-[22px] shadow-card">
      <div className="font-display text-[28px] leading-none text-foreground font-semibold">{value}%</div>
      <div className="mt-1 text-[11px] text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

export default function HeroResult({ skinAge, scores }: HeroResultProps) {
  return (
    <section className="px-5 pt-8 pb-4">
      {/* container central com “cara de landing” */}
      <div className="max-w-[420px] mx-auto text-center">
        <p className="sb-label mb-3">SEU RESULTADO</p>

        <h1 className="font-display text-[28px] leading-tight text-foreground font-semibold">
          Idade da sua pele:
          <br />
          <span className="font-display text-[34px] font-semibold">{skinAge} anos</span>
        </h1>

        <p className="mt-2 text-[13px] text-muted-foreground">Baseado na análise de {quizQuestions.length} fatores</p>

        {/* círculo porcelana */}
        <div className="mt-5 flex justify-center">
          <div
            className="
              relative w-[128px] h-[128px] rounded-full
              flex flex-col items-center justify-center
              border border-border/30
              shadow-card
              overflow-hidden
            "
            style={{
              background:
                "radial-gradient(circle at 30% 25%, hsl(var(--card)) 0%, hsl(var(--background)) 55%, hsl(var(--secondary) / 0.35) 100%)",
            }}
          >
            {/* highlight */}
            <div
              className="absolute inset-0 opacity-60 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 55%)",
              }}
            />
            <div className="relative z-10 font-display text-[46px] leading-none text-foreground font-semibold">
              {skinAge}
            </div>
            <div className="relative z-10 text-[11px] text-muted-foreground mt-1">anos</div>
          </div>
        </div>

        {/* scores */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <ScorePill label="Hidratação" value={scores.hidratacao} />
          <ScorePill label="Textura" value={scores.textura} />
        </div>
      </div>
    </section>
  );
}
