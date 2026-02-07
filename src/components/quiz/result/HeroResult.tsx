import { quizQuestions } from '@/lib/quizData';

interface HeroResultProps {
  skinAge: number;
  scores: { hidratacao: number; textura: number };
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  const getColor = (v: number) => {
    if (v >= 70) return 'text-success';
    if (v >= 40) return 'text-accent';
    return 'text-destructive';
  };

  return (
    <div className="bg-card rounded-3xl border border-border/20 p-4 text-center shadow-card">
      <p className={`text-3xl font-bold ${getColor(value)} font-['Playfair_Display']`}>{value}%</p>
      <p className="text-[12px] text-muted-foreground mt-1.5 font-medium tracking-wide">{label}</p>
    </div>
  );
}

export default function HeroResult({ skinAge, scores }: HeroResultProps) {
  return (
    <section className="text-center pt-10 pb-2 px-6">
      <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-5">
        Seu resultado
      </p>

      {/* Age circle */}
      <div
        className="w-36 h-36 mx-auto mb-5 rounded-full flex flex-col items-center justify-center shadow-elegant border border-border/20"
        style={{ background: 'linear-gradient(145deg, hsl(var(--card)), hsl(var(--secondary) / 0.4))' }}
      >
        <span className="text-[52px] font-bold text-foreground font-['Playfair_Display'] leading-none">
          {skinAge}
        </span>
        <span className="text-[12px] text-muted-foreground font-medium mt-1">anos</span>
      </div>

      <h1 className="text-[22px] font-bold text-foreground font-['Playfair_Display'] mb-1 leading-tight">
        Idade da sua pele: {skinAge} anos
      </h1>
      <p className="text-[13px] text-muted-foreground">
        Baseado na análise de {quizQuestions.length} fatores
      </p>

      {/* Score cards */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <ScoreCard label="Hidratação" value={scores.hidratacao} />
        <ScoreCard label="Textura" value={scores.textura} />
      </div>
    </section>
  );
}
