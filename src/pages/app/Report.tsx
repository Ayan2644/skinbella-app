import { storage } from '@/lib/storage';
import { Leaf, Lock } from 'lucide-react';

import heroSkinbella from '@/assets/hero-skinbella.jpg';

const labels: Record<string, string> = {
  manchas: 'Manchas',
  textura: 'Textura',
  elasticidade: 'Elasticidade',
  poros: 'Poros',
  oleosidade: 'Oleosidade',
  hidratacao: 'Hidratação',
};

const Report = () => {
  const profile = storage.getProfile();
  if (!profile) return <p className="text-muted-foreground">Faça o quiz para ver seu relatório.</p>;

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Leaf className="w-4 h-4 text-[#b9a27a]" />
          <span className="font-semibold text-foreground/70">SkinBella App</span>
        </div>
        <div className="w-9 h-9 rounded-full border border-[#e6dccc] bg-white/70 flex items-center justify-center shadow-[0_6px_16px_rgba(46,41,36,0.12)]">
          <Lock className="w-4 h-4 text-[#b7a27b]" />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[26px] border border-white/80 shadow-[0_14px_32px_rgba(46,41,36,0.14)] bg-[#f7f2ec]">
        <div className="relative z-10 px-6 py-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/50 mb-2">
            Seu diagnóstico de pele
          </p>
          <p className="text-[22px] font-semibold text-foreground font-['Playfair_Display'] leading-tight max-w-[210px]">
            O seu, comparado com você, mostra sinais sutis.
          </p>
          <div className="mt-5 inline-flex items-baseline gap-2 rounded-full bg-white/90 px-5 py-2.5 border border-white shadow-[0_10px_18px_rgba(46,41,36,0.12)]">
            <span className="text-[30px] font-semibold text-foreground font-['Playfair_Display'] leading-none">
              {profile.skinAge}
            </span>
            <span className="text-[14px] text-foreground/60 leading-none">anos</span>
          </div>
        </div>
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(214,200,175,0.7), transparent 55%)',
          }}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-[136px] h-[136px] rounded-full overflow-hidden border border-white/90 shadow-[0_14px_24px_rgba(46,41,36,0.2)] bg-white">
          <img
            src={heroSkinbella}
            alt=""
            className="h-full w-full object-cover object-[50%_28%]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Object.entries(profile.scores).map(([key, val]) => {
          const value = val as number;
          const safeValue = Math.min(100, Math.max(0, value));
          return (
            <div
              key={key}
              className="relative rounded-[20px] border border-white/80 bg-[#f7f2ec] px-4 py-4 shadow-[0_10px_20px_rgba(46,41,36,0.12)]"
            >
              <div
                className="mx-auto flex h-[78px] w-[78px] items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#8fa48f ${safeValue * 3.6}deg, #e5dfd5 0deg)`,
                }}
              >
                <div className="flex h-[64px] w-[64px] flex-col items-center justify-center rounded-full bg-[#fbf8f3] border border-white/80">
                  <span className="text-[18px] font-semibold text-foreground">{safeValue}%</span>
                </div>
              </div>
              <p className="mt-3 text-center text-[12px] text-muted-foreground">
                {labels[key] ?? key}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-[22px] border border-white/80 bg-[#f7f2ec] px-5 py-5 shadow-[0_12px_24px_rgba(46,41,36,0.12)]">
        <h2 className="text-lg font-semibold text-foreground font-['Playfair_Display'] mb-3">
          Prioridades (Top 3)
        </h2>
        <ol className="space-y-2">
          {profile.prioridadesTop3.map((p: string, i: number) => (
            <li key={i} className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#e8e0d2] text-[#7a967f] text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-sm text-foreground">{p}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Report;
