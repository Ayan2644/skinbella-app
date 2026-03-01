import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Sun, Moon, CheckCircle2 } from 'lucide-react';

interface SkinProfile {
  rotina: {
    manha: string[];
    noite: string[];
  };
  nutrientesTop4: { nome: string; recomendacao: string }[];
}

type TabType = 'manha' | 'noite';

const TAB_THEME = {
  manha: {
    headerGradient: 'linear-gradient(135deg, #FDF0C8 0%, #F5CF80 55%, #EDB84A 100%)',
    ringColor: '#C8913F',
    ringTrack: 'rgba(255,255,255,0.4)',
    accentBg: '#FDF6EE',
    accentBorder: '#F0D8A8',
    tabActiveGrad: 'linear-gradient(135deg, #F5CF80 0%, #EDB84A 100%)',
    tabActiveColor: '#7A5020',
    ctaGrad: 'linear-gradient(135deg, #C8913F 0%, #A87030 100%)',
    ctaShadow: 'rgba(200,145,63,0.4)',
    label: 'Manhã',
    tagline: 'Proteção & Vitalidade',
    emoji: '🌅',
    doneRingColor: '#C8913F',
  },
  noite: {
    headerGradient: 'linear-gradient(135deg, #EAE0F8 0%, #C8B8E8 55%, #A898D8 100%)',
    ringColor: '#7058B0',
    ringTrack: 'rgba(255,255,255,0.4)',
    accentBg: '#F0EAF8',
    accentBorder: '#D8C8F0',
    tabActiveGrad: 'linear-gradient(135deg, #C8B8E8 0%, #A898D8 100%)',
    tabActiveColor: '#3A2870',
    ctaGrad: 'linear-gradient(135deg, #7058B0 0%, #5040A0 100%)',
    ctaShadow: 'rgba(112,88,176,0.4)',
    label: 'Noite',
    tagline: 'Recuperação & Renovação',
    emoji: '🌙',
    doneRingColor: '#7058B0',
  },
} as const;

function getStepEmoji(step: string): string {
  const s = step.toLowerCase();
  if (s.includes('sabonete') || s.includes('lavar') || s.includes('limpar')) return '🧼';
  if (s.includes('skinbella caps') || s.includes('cápsulas') || s.includes('tomar')) return '💊';
  if (s.includes('skinbella sérum') || s.includes('skinbella serum'))                return '✨';
  if (s.includes('sérum') || s.includes('serum'))                                    return '✨';
  if (s.includes('hidratante') || s.includes('hidratar') || s.includes('creme leve')) return '💧';
  if (s.includes('protetor') || s.includes('solar'))                                  return '☀️';
  if (s.includes('demaquilante') || s.includes('maquiagem'))                          return '🌸';
  if (s.includes('nutritivo') || s.includes('noturno'))                               return '🌙';
  if (s.includes('olhos'))                                                             return '👁️';
  if (s.includes('absorção'))                                                          return '⏱️';
  return '✦';
}

const Routine = () => {
  const profile = storage.getProfile() as SkinProfile | null;
  const { toast } = useToast();
  const streak = storage.getStreak();

  const [tab, setTab] = useState<TabType>('manha');
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    storage.getRoutineSteps('morning')
  );
  const [ringActive, setRingActive] = useState(false);

  useEffect(() => {
    const storageType = tab === 'manha' ? 'morning' : 'night';
    setChecked(storage.getRoutineSteps(storageType));
    setRingActive(false);
    const t = setTimeout(() => setRingActive(true), 250);
    return () => clearTimeout(t);
  }, [tab]);

  useEffect(() => {
    const t = setTimeout(() => setRingActive(true), 400);
    return () => clearTimeout(t);
  }, []);

  if (!profile) {
    return <p className="text-muted-foreground">Complete o quiz primeiro.</p>;
  }

  const theme = TAB_THEME[tab];
  const storageType = tab === 'manha' ? 'morning' : 'night';
  const steps: string[] = tab === 'manha' ? profile.rotina.manha : profile.rotina.noite;
  const isDone = storage.getRoutineStatus(storageType);

  // Nutrientes por produto para o card informativo
  const serumNutrients = (profile.nutrientesTop4 ?? [])
    .filter(n => n.recomendacao === 'SkinBella Sérum')
    .map(n => n.nome);
  const capsNutrients = (profile.nutrientesTop4 ?? [])
    .filter(n => n.recomendacao === 'SkinBella Caps')
    .map(n => n.nome);

  const toggle = (i: number) => {
    const key = `${tab}-${i}`;
    const newChecked = { ...checked, [key]: !checked[key] };
    setChecked(newChecked);
    storage.saveRoutineSteps(storageType, newChecked);
  };

  const markDone = () => {
    storage.saveRoutineStatus(storageType, true);
    toast({
      title: 'Rotina concluída! ✨',
      description: `Rotina da ${tab === 'manha' ? 'manhã' : 'noite'} marcada com sucesso.`,
    });
  };

  const checkedCount = steps.filter((_, i) => checked[`${tab}-${i}`]).length;
  const progressPercent = steps.length > 0 ? (checkedCount / steps.length) * 100 : 0;
  const allDone = checkedCount === steps.length && steps.length > 0;
  const ringDeg = ringActive ? progressPercent * 3.6 : 0;

  return (
    <section className="pb-10">

      {/* ── Header ── */}
      <div className="mb-5 animate-fade-in" style={{ animationFillMode: 'both' }}>
        <p
          className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1"
          style={{ color: '#8C7B6B' }}
        >
          — protocolo diário —
        </p>
        <h1
          className="text-[30px] font-bold leading-tight font-['Playfair_Display'] mb-0.5"
          style={{ color: '#2C1F14' }}
        >
          Sua rotina
        </h1>
        <p className="text-xs font-medium" style={{ color: '#8C7B6B' }}>
          Protocolo Pele de Porcelana™
        </p>
      </div>

      {/* ── Streak banner ── */}
      {streak > 0 && (
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-5 animate-fade-in-up"
          style={{
            background: 'linear-gradient(135deg, #F0EBE3 0%, #E8E0D5 100%)',
            border: '1px solid #E0D8CD',
            animationDelay: '60ms',
            animationFillMode: 'both',
          }}
        >
          <span className="text-2xl select-none">🔥</span>
          <div className="flex-1">
            <p className="text-xs font-bold" style={{ color: '#2C1F14' }}>
              {streak} {streak === 1 ? 'dia' : 'dias'} consecutivos
            </p>
            <p className="text-[11px]" style={{ color: '#8C7B6B' }}>
              Continue mantendo sua rotina em dia!
            </p>
          </div>
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0"
            style={{ background: '#4A5C3A', color: '#FFFFFF' }}
          >
            Streak
          </span>
        </div>
      )}

      {/* ── Tab switcher ── */}
      <div
        className="flex gap-2 p-1.5 rounded-2xl mb-5 animate-fade-in-up"
        style={{
          background: '#F0EBE3',
          border: '1px solid #E0D8CD',
          animationDelay: '100ms',
          animationFillMode: 'both',
        }}
      >
        {(['manha', 'noite'] as TabType[]).map((t) => {
          const th = TAB_THEME[t];
          const isActive = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
              style={
                isActive
                  ? {
                      background: th.tabActiveGrad,
                      color: th.tabActiveColor,
                      boxShadow: '0 2px 10px rgba(44,31,20,0.14)',
                    }
                  : { color: '#8C7B6B' }
              }
            >
              {t === 'manha' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {th.label}
            </button>
          );
        })}
      </div>

      {/* ── Hero card (gradiente + progresso) ── */}
      <div
        className="relative rounded-3xl overflow-hidden mb-6 animate-fade-in-up"
        style={{
          background: theme.headerGradient,
          border: `1px solid ${theme.accentBorder}`,
          boxShadow: '0 8px 28px rgba(44,31,20,0.12)',
          animationDelay: '160ms',
          animationFillMode: 'both',
        }}
      >
        {/* Círculos decorativos */}
        <div
          className="absolute -top-8 -right-8 w-44 h-44 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.2)' }}
        />
        <div
          className="absolute top-6 right-14 w-20 h-20 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        />
        <div
          className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        />

        <div className="relative z-10 flex items-center gap-5 px-5 py-5">
          {/* Anel de progresso */}
          <div
            className="rounded-full flex items-center justify-center shrink-0"
            style={{
              width: 92,
              height: 92,
              background: `conic-gradient(${theme.ringColor} ${ringDeg}deg, ${theme.ringTrack} 0deg)`,
              transition: 'background 0.7s cubic-bezier(0.4,0,0.2,1)',
              boxShadow: '0 4px 16px rgba(44,31,20,0.12)',
            }}
          >
            <div
              className="flex flex-col items-center justify-center rounded-full"
              style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.92)' }}
            >
              {allDone ? (
                <span className="text-2xl select-none">✅</span>
              ) : (
                <>
                  <span className="text-[22px] font-bold leading-none" style={{ color: '#2C1F14' }}>
                    {checkedCount}
                  </span>
                  <span className="text-[9px] leading-none mt-0.5" style={{ color: '#8C7B6B' }}>
                    de {steps.length}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Info lateral */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xl select-none">{theme.emoji}</span>
              <p
                className="font-['Playfair_Display'] font-bold text-[22px] leading-tight"
                style={{ color: '#2C1F14' }}
              >
                {theme.label}
              </p>
            </div>
            <p className="text-[11px] mb-3" style={{ color: 'rgba(44,31,20,0.55)' }}>
              {theme.tagline}
            </p>

            {/* Mini barra de progresso */}
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.45)' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: ringActive ? `${progressPercent}%` : '0%',
                  background: theme.ringColor,
                  transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1) 300ms',
                }}
              />
            </div>
            <p className="text-[10px] mt-1" style={{ color: 'rgba(44,31,20,0.5)' }}>
              {checkedCount} de {steps.length} passos concluídos
            </p>
          </div>
        </div>

        {/* Banner de conclusão */}
        {allDone && (
          <div
            className="flex items-center gap-2.5 px-5 py-3"
            style={{
              background: 'rgba(255,255,255,0.65)',
              borderTop: '1px solid rgba(255,255,255,0.6)',
            }}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#4A5C3A' }} />
            <p className="text-xs font-semibold" style={{ color: '#2C1F14' }}>
              Parabéns! Rotina da {tab === 'manha' ? 'manhã' : 'noite'} concluída 🎉
            </p>
          </div>
        )}
      </div>

      {/* ── Steps ── */}
      <div className="space-y-3 mb-6">
        {steps.map((step, i) => {
          const key = `${tab}-${i}`;
          const isChecked = checked[key] ?? false;
          const emoji = getStepEmoji(step);
          const delay = 220 + i * 80;

          // Destaque visual para passos dos produtos SkinBella
          const isProductStep =
            step.toLowerCase().includes('skinbella sérum') ||
            step.toLowerCase().includes('skinbella serum') ||
            step.toLowerCase().includes('skinbella caps');

          return (
            <button
              key={key}
              onClick={() => toggle(i)}
              className="w-full text-left rounded-3xl overflow-hidden transition-all duration-200 active:scale-[0.98] animate-fade-in-up"
              style={{
                border: isChecked
                  ? `1px solid ${theme.accentBorder}`
                  : isProductStep
                  ? '1px solid #d0e4c0'
                  : '1px solid #EDE8E1',
                boxShadow: isProductStep && !isChecked
                  ? '0 4px 14px rgba(74,92,58,0.12)'
                  : isChecked
                  ? '0 2px 12px rgba(44,31,20,0.07)'
                  : '0 2px 8px rgba(44,31,20,0.05)',
                animationDelay: `${delay}ms`,
                animationFillMode: 'both',
              }}
            >
              <div
                className="flex items-center gap-4 px-4 py-4 transition-colors duration-300"
                style={{
                  background: isChecked
                    ? theme.accentBg
                    : isProductStep
                    ? '#F3F8EE'
                    : '#FFFFFF',
                }}
              >
                {/* Ícone / número */}
                <div
                  className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 transition-all duration-300"
                  style={{
                    background: isChecked
                      ? theme.ringColor
                      : isProductStep
                      ? '#4A5C3A'
                      : '#F0EBE3',
                  }}
                >
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <>
                      <span className="text-xl leading-none select-none">{emoji}</span>
                      <span
                        className="text-[9px] font-bold leading-none mt-0.5 tabular-nums"
                        style={{ color: isProductStep ? '#d0e4b8' : '#8C7B6B' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </>
                  )}
                </div>

                {/* Texto do step */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium leading-snug transition-all duration-300"
                    style={{
                      color: isChecked ? '#8C7B6B' : '#2C1F14',
                      textDecoration: isChecked ? 'line-through' : 'none',
                      opacity: isChecked ? 0.65 : 1,
                    }}
                  >
                    {step}
                  </p>
                  {isProductStep && !isChecked && (
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider"
                      style={{ color: '#4A5C3A' }}
                    >
                      ✦ produto SkinBella
                    </span>
                  )}
                </div>

                {/* Pill de status */}
                <div
                  className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300"
                  style={{
                    background: isChecked ? theme.ringColor : isProductStep ? '#4A5C3A' : '#F0EBE3',
                    color: isChecked || isProductStep ? '#FFFFFF' : '#8C7B6B',
                  }}
                >
                  {isChecked ? '✓' : '○'}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Card de produtos — manhã: Sérum + Caps | noite: Sérum ── */}
      <div
        className="mb-6 animate-fade-in-up"
        style={{ animationDelay: '680ms', animationFillMode: 'both' }}
      >
        <p
          className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1"
          style={{ color: '#8C7B6B' }}
        >
          Produtos desta rotina
        </p>

        <div className="flex gap-3">
          {/* SkinBella Sérum */}
          <div
            className="flex-1 px-4 py-3.5 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #243318 0%, #2f4220 100%)',
              boxShadow: '0 6px 18px rgba(36,51,24,0.25)',
            }}
          >
            <p className="text-[11px] font-bold mb-1.5" style={{ color: '#d0e4b8' }}>
              🌿 SkinBella Sérum
            </p>
            {serumNutrients.length > 0 && (
              <div className="space-y-0.5 mb-1.5">
                {serumNutrients.map((n, idx) => (
                  <p key={idx} className="text-[10px] leading-snug" style={{ color: '#88a878' }}>
                    · {n}
                  </p>
                ))}
              </div>
            )}
            <p
              className="text-[9px] font-bold uppercase tracking-wider"
              style={{ color: '#a8c898' }}
            >
              Manhã + Noite
            </p>
          </div>

          {/* SkinBella Caps — manhã e noite (1 cápsula cada) */}
          <div
            className="flex-1 px-4 py-3.5 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #FDF0C8 0%, #F5CF80 100%)',
              border: '1px solid #F0D8A8',
              boxShadow: '0 6px 18px rgba(200,145,63,0.2)',
            }}
          >
            <p className="text-[11px] font-bold mb-1.5" style={{ color: '#7A5020' }}>
              💊 SkinBella Caps
            </p>
            {capsNutrients.length > 0 && (
              <div className="space-y-0.5 mb-1.5">
                {capsNutrients.map((n, idx) => (
                  <p key={idx} className="text-[10px] leading-snug" style={{ color: '#9A7040' }}>
                    · {n}
                  </p>
                ))}
              </div>
            )}
            <p
              className="text-[9px] font-bold uppercase tracking-wider"
              style={{ color: '#C8913F' }}
            >
              {tab === 'manha' ? '1 cáp. café da manhã' : '1 cáp. com o jantar'}
            </p>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <button
        onClick={!isDone ? markDone : undefined}
        disabled={isDone}
        className="w-full rounded-2xl py-4 text-sm font-semibold text-white transition-all active:scale-[0.98] animate-fade-in-up"
        style={{
          background: isDone
            ? 'linear-gradient(135deg, #4A5C3A 0%, #3A4A2C 100%)'
            : theme.ctaGrad,
          boxShadow: isDone ? 'none' : `0 4px 18px ${theme.ctaShadow}`,
          opacity: isDone ? 0.75 : 1,
          animationDelay: '800ms',
          animationFillMode: 'both',
        }}
      >
        {isDone
          ? '✅ Rotina concluída!'
          : `Marcar rotina da ${tab === 'manha' ? 'manhã' : 'noite'} como feita`}
      </button>

    </section>
  );
};

export default Routine;
