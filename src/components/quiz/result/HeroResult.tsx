import { quizQuestions } from "@/lib/quizData";
import marbleTexture from "@/assets/result/marble-texture.jpg";

interface HeroResultProps {
  skinAge: number;
  scores: { hidratacao: number; textura: number };
}

function getColor(v: number) {
  if (v >= 70) return { color: '#4E6B57' };
  if (v >= 40) return { color: '#C8A96B' };
  return { color: 'hsl(0 70% 55%)' };
}

export default function HeroResult({ skinAge, scores }: HeroResultProps) {
  return (
    <section className="relative pt-8 pb-4 px-5">
      {/* Marble texture background */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{ backgroundImage: `url(${marbleTexture})`, backgroundSize: 'cover' }}
      />

      {/* Layout: circle left + text right */}
      <div className="relative z-10 flex items-center gap-5 mb-5">
        {/* Age circle */}
        <div
          className="w-[100px] h-[100px] rounded-full flex flex-col items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(145deg, #FFFFFF, #EFE8E1)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 1px 2px rgba(255,255,255,0.8)',
            border: '1px solid rgba(0,0,0,0.04)',
          }}
        >
          <span className="text-[40px] font-bold text-foreground font-display leading-none">{skinAge}</span>
          <span className="text-[11px] text-muted-foreground font-medium mt-0.5">anos</span>
        </div>

        {/* Title text */}
        <div className="flex-1 min-w-0">
          <h1 className="text-[22px] font-semibold text-foreground font-display leading-tight">
            Idade da sua pele:<br />{skinAge} anos
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Baseado na análise de {quizQuestions.length} fatores
          </p>
        </div>
      </div>

      {/* Metrics bar */}
      <div
        className="relative z-10 flex items-center rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #F0EAE2, #E8E0D6)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          height: 80,
        }}
      >
        <div className="flex-1 flex flex-col items-center justify-center py-3">
          <span className="text-[32px] font-bold font-display leading-none" style={getColor(scores.hidratacao)}>
            {scores.hidratacao}%
          </span>
          <span className="text-[13px] text-muted-foreground mt-1 font-medium">Hidratação</span>
        </div>
        <div className="w-px h-10 bg-foreground/[0.08]" />
        <div className="flex-1 flex flex-col items-center justify-center py-3">
          <span className="text-[32px] font-bold font-display leading-none" style={getColor(scores.textura)}>
            {scores.textura}%
          </span>
          <span className="text-[13px] text-muted-foreground mt-1 font-medium">Textura</span>
        </div>
      </div>
    </section>
  );
}
