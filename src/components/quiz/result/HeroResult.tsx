import { quizQuestions } from "@/lib/quizData";

interface HeroResultProps {
  skinAge: number;
  scores: {
    hidratacao: number;
    textura: number;
  };
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card rounded-2xl border border-border/20 p-3 shadow-card text-center">
      <div className="text-[22px] font-bold text-foreground font-['Playfair_Display']">{value}%</div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

export default function HeroResult({ skinAge, scores }: HeroResultProps) {
  return (
    <section className="text-center pt-6 pb-1 px-5">
      <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-muted-foreground mb-3">Seu resultado</p>

      <div
        className="w-[118px] h-[118px] mx-auto mb-3 rounded-full flex flex-col items-center justify-center shadow-card border border-border/20"
        style={{
          background: "linear-gradient(145deg, hsl(var(--card)), hsl(var(--secondary) / 0.45))",
        }}
      >
        <span className="text-[44px] font-bold text-foreground font-['Playfair_Display'] leading-none">{skinAge}</span>
        <span className="text-[11px] text-muted-foreground font-medium mt-1">anos</span>
      </div>

      <h1 className="text-[18px] font-bold text-foreground font-['Playfair_Display'] leading-tight">
        Idade da sua pele: {skinAge} anos
      </h1>
      <p className="text-[12px] text-muted-foreground mt-1">Baseado na análise de {quizQuestions.length} fatores</p>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <ScoreCard label="Hidratação" value={scores.hidratacao} />
        <ScoreCard label="Textura" value={scores.textura} />
      </div>
    </section>
  );
}
