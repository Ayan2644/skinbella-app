import { quizQuestions } from "@/lib/quizData";
import marbleBg from "@/assets/result/marble-bg.png";

interface HeroResultProps {
  skinAge: number;
  scores: { hidratacao: number; textura: number };
}

export default function HeroResult({ skinAge, scores }: HeroResultProps) {
  return (
    <section className="px-5 pt-12 pb-6">
      <div className="max-w-[420px] mx-auto text-center">

        {/* ── SEU RESULTADO with decorative lines ── */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px flex-1 max-w-[60px]" style={{ background: 'linear-gradient(90deg, transparent, #C8A96B)' }} />
          <p className="text-[11px] uppercase tracking-[0.28em] font-semibold" style={{ color: '#8B7355' }}>
            SEU RESULTADO
          </p>
          <div className="h-px flex-1 max-w-[60px]" style={{ background: 'linear-gradient(90deg, #C8A96B, transparent)' }} />
        </div>

        {/* ── Main title ── */}
        <h1 className="font-display leading-tight font-semibold" style={{ fontSize: '42px', color: '#2B2B2B' }}>
          Idade da sua pele:
          <br />
          <span style={{ fontSize: '48px' }}>{skinAge} anos</span>
        </h1>

        <p className="mt-3 text-[14px]" style={{ color: '#8B7B6B' }}>
          Baseado na análise de {quizQuestions.length} fatores
        </p>

        {/* ── Decorative dots ── */}
        <div className="flex items-center justify-center gap-2 mt-6 mb-8">
          <div className="w-[60px] h-px" style={{ background: 'linear-gradient(90deg, transparent, #C8A96B80)' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C8A96B' }} />
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#C8A96B80' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C8A96B' }} />
          <div className="w-[60px] h-px" style={{ background: 'linear-gradient(90deg, #C8A96B80, transparent)' }} />
        </div>

        {/* ── Porcelain circle with marble texture ── */}
        <div className="flex justify-center mb-10">
          <div
            className="relative rounded-full flex flex-col items-center justify-center overflow-hidden"
            style={{
              width: 180,
              height: 180,
              background: 'linear-gradient(145deg, #FFFFFF 0%, #EFE8E1 100%)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.06), inset 0 2px 8px rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,255,255,0.7)',
            }}
          >
            {/* marble texture inside circle */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url(${marbleBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.25,
              }}
            />
            {/* highlight */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.85) 0%, transparent 55%)',
              }}
            />
            <div className="relative z-10 font-display leading-none font-semibold" style={{ fontSize: 64, color: '#2B2B2B' }}>
              {skinAge}
            </div>
            <div className="relative z-10 mt-1 font-display" style={{ fontSize: 18, color: '#6B5E50' }}>
              anos
            </div>
          </div>
        </div>

        {/* ── Metrics card — glassmorphism unified card ── */}
        <div
          className="mx-auto overflow-hidden"
          style={{
            borderRadius: 24,
            background: 'linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(243,238,232,0.6) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.5)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          }}
        >
          <p className="text-[13px] font-medium pt-5 pb-3 px-5" style={{ color: '#5A4F44' }}>
            Baseado na análise de {quizQuestions.length} fatores
          </p>

          <div className="flex">
            {/* Hidratação */}
            <div className="flex-1 py-4 px-5 text-center">
              <div className="font-display font-semibold leading-none" style={{ fontSize: 36, color: '#2B2B2B' }}>
                {scores.hidratacao}%
              </div>
              <div className="mt-2 text-[14px]" style={{ color: '#8B7B6B' }}>Hidratação</div>
            </div>

            {/* Divider */}
            <div className="w-px my-4" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }} />

            {/* Textura */}
            <div className="flex-1 py-4 px-5 text-center">
              <div className="font-display font-semibold leading-none" style={{ fontSize: 36, color: '#2B2B2B' }}>
                {scores.textura}%
              </div>
              <div className="mt-2 text-[14px]" style={{ color: '#8B7B6B' }}>Textura</div>
            </div>
          </div>

          <p className="text-[12px] pb-4 px-5 text-center" style={{ color: '#A0968B' }}>
            Baseado na análise de {quizQuestions.length} fatores
          </p>
        </div>
      </div>
    </section>
  );
}
