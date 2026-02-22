import { quizQuestions } from "@/lib/quizData";
import marbleTexture from "@/assets/result/marble-texture.jpg";

interface HeroResultProps {
  skinAge: number;
  scores: { hidratacao: number; textura: number };
}

function getColor(v: number) {
  if (v >= 70) return "text-primary";
  if (v >= 40) return "text-accent";
  return "text-destructive";
}

export default function HeroResult({ skinAge, scores }: HeroResultProps) {
  return (
    <section className="text-center pt-10 pb-4 px-5 relative">
      {/* Marble texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: `url(${marbleTexture})`, backgroundSize: 'cover' }}
      />

      <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-muted-foreground mb-5 relative z-10">
        Seu resultado
      </p>

      {/* Age circle — 180px porcelain */}
      <div
        className="w-[180px] h-[180px] mx-auto mb-4 rounded-full flex flex-col items-center justify-center relative z-10"
        style={{
          background: 'linear-gradient(145deg, #FFFFFF, #EFE8E1)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <span className="text-[64px] font-bold text-foreground font-display leading-none">{skinAge}</span>
        <span className="text-[12px] text-muted-foreground font-medium mt-1">anos</span>
      </div>

      <h1 className="text-[20px] font-semibold text-foreground font-display leading-tight relative z-10">
        Idade da sua pele: {skinAge} anos
      </h1>
      <p className="text-[13px] text-muted-foreground mt-1.5 relative z-10">
        Baseado na análise de {quizQuestions.length} fatores
      </p>

      {/* Metrics — single horizontal card with divider */}
      <div
        className="mt-6 mx-auto result-card-premium p-0 flex items-center relative z-10"
        style={{ height: 110 }}
      >
        <div className="flex-1 flex flex-col items-center justify-center py-3">
          <span className={`text-[36px] font-bold font-display leading-none ${getColor(scores.hidratacao)}`}>
            {scores.hidratacao}%
          </span>
          <span className="text-[14px] text-muted-foreground mt-1.5 font-medium">Hidratação</span>
        </div>
        <div className="w-px h-16 bg-foreground/[0.06]" />
        <div className="flex-1 flex flex-col items-center justify-center py-3">
          <span className={`text-[36px] font-bold font-display leading-none ${getColor(scores.textura)}`}>
            {scores.textura}%
          </span>
          <span className="text-[14px] text-muted-foreground mt-1.5 font-medium">Textura</span>
        </div>
      </div>
    </section>
  );
}
