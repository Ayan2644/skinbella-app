import { quizQuestions } from "@/lib/quizData";

interface HeroResultProps {
  skinAge: number;
  scores: { hidratacao: number; textura: number };
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="sb-card sb-grain py-4 px-4 text-center">
      <p className="font-display text-[28px] leading-none text-foreground font-semibold">{value}%</p>
      <p className="text-[11px] text-muted-foreground mt-1 font-medium">{label}</p>
    </div>
  );
}

export default function HeroResult({ skinAge, scores }: HeroResultProps) {
  return (
    <section className="sb-section pt-8">
      <div className="sb-container text-center">
        <p className="sb-label mb-3">SEU RESULTADO</p>

        <h1 className="sb-h1">
          Idade da sua pele:
          <span className="block font-display text-[30px] mt-1">{skinAge} anos</span>
        </h1>

        <p className="sb-body mt-2">
          Baseado na análise de <span className="font-semibold text-foreground/80">{quizQuestions.length}</span> fatores
        </p>

        {/* Age Circle (hero) */}
        <div className="mt-6">
          <div className="mx-auto w-[132px] h-[132px] rounded-full border border-border/40 shadow-soft bg-[hsl(var(--card))] relative overflow-hidden">
            {/* subtle porcelain shine */}
            <div
              className="absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(120px 90px at 25% 18%, hsl(var(--shine) / 0.85), transparent 60%), linear-gradient(145deg, hsl(var(--surface-strong)), hsl(var(--surface-soft)))",
              }}
            />
            <div className="relative z-10 h-full w-full flex flex-col items-center justify-center">
              <span className="font-display text-[46px] leading-none text-foreground font-semibold">{skinAge}</span>
              <span className="text-[11px] text-muted-foreground mt-1 font-medium">anos</span>
            </div>
          </div>
        </div>

        {/* Score cards row */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <ScoreCard label="Hidratação" value={scores.hidratacao} />
          <ScoreCard label="Textura" value={scores.textura} />
        </div>

        {/* Divider like landing page */}
        <div className="mt-7 sb-divider" />
      </div>
    </section>
  );
}
