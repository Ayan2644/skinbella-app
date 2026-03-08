import { storage } from '@/lib/storage';
import { Leaf, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import heroSkinbella from '@/assets/hero-skinbella.jpg';

/* ─── Mapeamento de labels e emojis ─── */
const SCORE_META: Record<string, { label: string; emoji: string }> = {
  manchas:      { label: 'Manchas',      emoji: '🎯' },
  textura:      { label: 'Textura',      emoji: '✨' },
  elasticidade: { label: 'Elasticidade', emoji: '🌸' },
  poros:        { label: 'Poros',        emoji: '🔬' },
  oleosidade:   { label: 'Oleosidade',   emoji: '💧' },
  hidratacao:   { label: 'Hidratação',   emoji: '🌊' },
};

const PRIORITY_COLORS = [
  { dot: '#C4472A', bg: '#FDF0EE', border: '#f0c0b8' },
  { dot: '#C8913F', bg: '#FDF6EE', border: '#f0d8a8' },
  { dot: '#4A5C3A', bg: '#E8EFDF', border: '#d0e4c0' },
];

function getScoreStyle(v: number) {
  if (v >= 75) return { ring: '#4A5C3A', track: '#d0e4c0', bg: '#E8EFDF', label: 'Ótimo',    labelColor: '#4A5C3A', statusIcon: '✓' };
  if (v >= 50) return { ring: '#C8913F', track: '#f0d8a8', bg: '#FDF6EE', label: 'Atenção',  labelColor: '#C8913F', statusIcon: '⚠' };
  return             { ring: '#C4472A', track: '#f0c0b8', bg: '#FDF0EE', label: 'Crítico',  labelColor: '#C4472A', statusIcon: '✗' };
}

function getNutrientEmoji(nome: string): string {
  const n = nome.toLowerCase();
  if (n.includes('vitamina c'))                                    return '🍋';
  if (n.includes('niacinamida'))                                   return '🔬';
  if (n.includes('peptídeos') || n.includes('matrixyl'))           return '🌸';
  if (n.includes('hialurônico') || n.includes('hialuronico'))      return '💧';
  if (n.includes('rosa mosqueta'))                                 return '🌹';
  if (n.includes('colágeno') || n.includes('colageno'))            return '💊';
  if (n.includes('zinco'))                                         return '⚡';
  if (n.includes('biotina'))                                       return '💫';
  if (n.includes('licopeno'))                                      return '🍅';
  if (n.includes('silício') || n.includes('silicio'))              return '💎';
  if (n.includes('vitamina e'))                                    return '🌻';
  if (n.includes('vitamina'))                                      return '🌿';
  return '🧬';
}

/* ─── Separador de seção ─── */
const SectionLabel = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3 pt-1">
    <div className="h-px flex-1" style={{ background: '#EDE8E1' }} />
    <span
      className="text-[10px] font-bold uppercase tracking-[0.22em] shrink-0"
      style={{ color: '#8C7B6B' }}
    >
      {text}
    </span>
    <div className="h-px flex-1" style={{ background: '#EDE8E1' }} />
  </div>
);

/* ─── Card SkinBella Sérum ─── */
const SerumCard = ({ ingredients }: { ingredients: string[] }) => (
  <div
    className="animate-fade-in-up"
    style={{
      borderRadius: 24,
      background: 'linear-gradient(145deg, #243318 0%, #2f4220 60%, #3a5228 100%)',
      boxShadow: '0 14px 36px rgba(36,51,24,0.35)',
      animationDelay: '600ms',
      animationFillMode: 'both',
    }}
  >
    <div className="px-6 py-6">
      {/* Badge */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.15)', color: '#d0e4b8' }}
        >
          ✦ Mais Vendido
        </span>
        <span className="text-2xl">🌿</span>
      </div>

      <h3
        className="text-[22px] font-semibold font-['Playfair_Display'] mb-1"
        style={{ color: '#FFFFFF' }}
      >
        SkinBella Sérum
      </h3>
      <p className="text-[13px] mb-5" style={{ color: '#a8c898' }}>
        Contém as substâncias que sua pele precisa
      </p>

      {/* Ingredients */}
      <div className="space-y-2 mb-6">
        {ingredients.slice(0, 4).map((ing, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,255,255,0.12)' }}
            >
              <span className="text-[10px] font-bold" style={{ color: '#d0e4b8' }}>✓</span>
            </div>
            <span className="text-[13px]" style={{ color: '#e0f0d0' }}>{ing}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="w-full py-3.5 rounded-2xl font-semibold text-[15px] active:scale-[0.97] transition-transform duration-150"
        style={{
          background: '#FFFFFF',
          color: '#243318',
          boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
        }}
      >
        Quero o SkinBella Sérum →
      </button>
    </div>
  </div>
);

/* ─── Card SkinBella Caps ─── */
const CapsCard = ({ ingredients }: { ingredients: string[] }) => (
  <div
    className="animate-fade-in-up"
    style={{
      borderRadius: 24,
      background: 'linear-gradient(145deg, #FDF0C8 0%, #F5CF80 60%, #EDB84A 100%)',
      border: '1px solid #F0D8A8',
      boxShadow: '0 12px 30px rgba(200,145,63,0.25)',
      animationDelay: '680ms',
      animationFillMode: 'both',
    }}
  >
    <div className="px-6 py-6">
      {/* Badge */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ background: 'rgba(44,31,20,0.12)', color: '#7A5020' }}
        >
          💊 Suplemento Oral
        </span>
        <span className="text-2xl">✨</span>
      </div>

      <h3
        className="text-[22px] font-semibold font-['Playfair_Display'] mb-1"
        style={{ color: '#2C1F14' }}
      >
        SkinBella Caps
      </h3>
      <p className="text-[13px] mb-5" style={{ color: '#7A5020' }}>
        Age de dentro para fora — colágeno + vitaminas
      </p>

      {/* Ingredients */}
      <div className="space-y-2 mb-6">
        {ingredients.slice(0, 4).map((ing, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(44,31,20,0.12)' }}
            >
              <span className="text-[10px] font-bold" style={{ color: '#7A5020' }}>✓</span>
            </div>
            <span className="text-[13px]" style={{ color: '#5A3810' }}>{ing}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="w-full py-3.5 rounded-2xl font-semibold text-[15px] active:scale-[0.97] transition-transform duration-150"
        style={{
          background: '#2C1F14',
          color: '#FFFFFF',
          boxShadow: '0 6px 18px rgba(44,31,20,0.3)',
        }}
      >
        Quero o SkinBella Caps →
      </button>
    </div>
  </div>
);

/* ─── Componente principal ─── */
const Report = () => {
  const profile = storage.getProfile();
  const answers = storage.getAnswers();
  const streak  = storage.getStreak();

  const [ringsActive, setRingsActive] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRingsActive(true), 350);
    return () => clearTimeout(t);
  }, []);

  if (!profile) {
    return (
      <p className="text-center py-10 text-[14px]" style={{ color: '#8C7B6B' }}>
        Faça o quiz para ver seu relatório.
      </p>
    );
  }

  const realAge        = (answers?.idade as number) ?? 28;
  const skinAge        = profile.skinAge;
  const ageGap         = skinAge - realAge;
  const targetDays     = 90;
  const progressRaw    = Math.round((streak / targetDays) * 100);
  const progressPct    = Math.min(95, Math.max(streak > 0 ? 4 : 0, progressRaw));

  /* Separar ingredientes por produto */
  const allNutrients: { nome: string; porque: string; acao: string; recomendacao: string }[] =
    profile.nutrientesTop4 ?? [];

  const serumIngredients = [
    ...allNutrients.filter(n => n.recomendacao === 'SkinBella Sérum').map(n => n.nome),
  ];
  const capsIngredients  = [
    ...allNutrients.filter(n => n.recomendacao === 'SkinBella Caps').map(n => n.nome),
  ];

  // Garante ao menos 1 ingrediente por produto (apenas ativos reais da fórmula)
  if (serumIngredients.length === 0) serumIngredients.push('Vitamina C Estabilizada', 'Ácido Hialurônico Duplo PM', 'Niacinamida 10%');
  if (capsIngredients.length  === 0) capsIngredients.push('Colágeno Hidrolisado', 'Vitamina E', 'Biotina (B7)');

  const serumFirst = serumIngredients.length >= capsIngredients.length;

  return (
    <section className="space-y-4 pb-10">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4" style={{ color: '#b9a27a' }} />
          <span className="text-[13px] font-semibold" style={{ color: '#8C7B6B' }}>SkinBella App</span>
        </div>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: '#FFFFFF',
            border: '1px solid #EDE8E1',
            boxShadow: '0 6px 16px rgba(46,41,36,0.12)',
          }}
        >
          <Lock className="w-4 h-4" style={{ color: '#b7a27b' }} />
        </div>
      </div>

      {/* ── Hero: Comparativo de Idades ── */}
      <div
        className="relative overflow-hidden animate-fade-in-up"
        style={{
          borderRadius: 28,
          background: 'linear-gradient(135deg, #f8f3ec 0%, #ede5d8 55%, #e6dccf 100%)',
          border: '1px solid rgba(255,255,255,0.85)',
          boxShadow: '0 12px 36px rgba(46,41,36,0.14)',
          animationDelay: '60ms',
          animationFillMode: 'both',
        }}
      >
        {/* Foto circular no topo-direito */}
        <div
          className="absolute right-5 top-5 overflow-hidden"
          style={{
            width: 68,
            height: 68,
            borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.9)',
            boxShadow: '0 8px 20px rgba(46,41,36,0.18)',
          }}
        >
          <img src={storage.getLatestSelfie() || heroSkinbella} alt="" className="w-full h-full object-cover object-[50%_20%]" />
        </div>

        {/* Decorações */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.28)' }} />
        <div className="absolute -bottom-5 left-4 w-20 h-20 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.15)' }} />

        <div className="px-6 pt-6 pb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-1" style={{ color: '#8C7B6B' }}>
            Diagnóstico completo
          </p>
          <h1
            className="text-[20px] font-semibold leading-tight font-['Playfair_Display'] mb-5"
            style={{ color: '#2C1F14', maxWidth: 190 }}
          >
            Sua análise de pele
          </h1>

          {/* Dois badges: sua idade + pele aparenta */}
          <div className="flex gap-3 mb-4">
            <div
              className="flex-1 px-4 py-3.5 text-center"
              style={{
                background: 'rgba(255,255,255,0.88)',
                borderRadius: 18,
                border: '1px solid rgba(255,255,255,0.9)',
                boxShadow: '0 4px 12px rgba(46,41,36,0.09)',
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#8C7B6B' }}>
                Sua idade
              </p>
              <p
                className="text-[42px] leading-none font-semibold font-['Playfair_Display']"
                style={{ color: '#2C1F14' }}
              >
                {realAge}
              </p>
              <p className="text-[12px] mt-0.5" style={{ color: '#8C7B6B' }}>anos</p>
            </div>

            <div
              className="flex-1 px-4 py-3.5 text-center"
              style={{
                background: 'rgba(255,255,255,0.88)',
                borderRadius: 18,
                border: '1.5px solid #f0c0b8',
                boxShadow: '0 4px 12px rgba(196,71,42,0.12)',
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#C4472A' }}>
                Pele aparenta
              </p>
              <p
                className="text-[42px] leading-none font-semibold font-['Playfair_Display']"
                style={{ color: '#C4472A' }}
              >
                {skinAge}
              </p>
              <p className="text-[12px] mt-0.5" style={{ color: '#C4472A' }}>anos</p>
            </div>
          </div>

          {/* Pill de diferença */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: '#FDF0EE', border: '1px solid #f0c0b8' }}
          >
            <span className="text-[13px]">⚠️</span>
            <span className="text-[12px] font-semibold" style={{ color: '#C4472A' }}>
              Sua pele aparenta {ageGap > 0 ? `+${ageGap}` : ageGap} anos a mais
            </span>
          </div>
        </div>
      </div>

      {/* ── Meta de Rejuvenescimento ── */}
      <div
        className="animate-fade-in-up"
        style={{
          borderRadius: 24,
          background: '#FFFFFF',
          border: '1px solid #EDE8E1',
          boxShadow: '0 8px 24px rgba(46,41,36,0.09)',
          animationDelay: '130ms',
          animationFillMode: 'both',
        }}
      >
        <div className="px-5 py-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🎯</span>
            <h2 className="text-[16px] font-semibold font-['Playfair_Display']" style={{ color: '#2C1F14' }}>
              Meta de Rejuvenescimento
            </h2>
          </div>
          <p className="text-[12px] mb-4" style={{ color: '#8C7B6B' }}>
            Objetivo: sua pele aparentar {realAge} anos ou menos
          </p>

          {/* Labels extremos */}
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] font-semibold" style={{ color: '#C4472A' }}>
              {skinAge} anos (hoje)
            </span>
            <span className="text-[11px] font-semibold" style={{ color: '#4A5C3A' }}>
              {realAge} anos (meta)
            </span>
          </div>

          {/* Barra de progresso */}
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: 10, background: '#EDE8E1' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: ringsActive ? `${progressPct}%` : '0%',
                background: 'linear-gradient(90deg, #C4472A 0%, #C8913F 50%, #4A5C3A 100%)',
                transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1) 0.5s',
                minWidth: ringsActive && progressPct > 0 ? 10 : 0,
              }}
            />
          </div>
          <p className="text-[11px] mt-1.5 text-right" style={{ color: '#8C7B6B' }}>
            {progressPct}% da jornada concluída ({streak} dias de streak)
          </p>

          {/* Box motivacional */}
          <div
            className="flex gap-3 items-start px-4 py-3 mt-4"
            style={{
              background: '#E8EFDF',
              borderRadius: 14,
              border: '1px solid #d0e4c0',
            }}
          >
            <span className="text-base shrink-0 mt-0.5">🌱</span>
            <p className="text-[12px] leading-relaxed" style={{ color: '#2C1F14' }}>
              Com a rotina SkinBella, sua pele pode aparentar até{' '}
              <strong>{ageGap} anos a menos</strong> em 90 dias de uso consistente.
            </p>
          </div>
        </div>
      </div>

      {/* ── Diagnóstico Detalhado (scores) ── */}
      <SectionLabel text="Diagnóstico Detalhado" />

      <div
        className="grid grid-cols-3 gap-2.5 animate-fade-in-up"
        style={{ animationDelay: '190ms', animationFillMode: 'both' }}
      >
        {Object.entries(profile.scores).map(([key, val], idx) => {
          const value   = Math.min(100, Math.max(0, val as number));
          const s       = getScoreStyle(value);
          const meta    = SCORE_META[key] ?? { label: key, emoji: '📊' };
          const deg     = ringsActive ? value * 3.6 : 0;

          return (
            <div
              key={key}
              className="rounded-[18px] px-2 py-4 flex flex-col items-center animate-fade-in-up"
              style={{
                background: s.bg,
                border: `1px solid ${s.track}`,
                boxShadow: '0 6px 16px rgba(46,41,36,0.08)',
                animationDelay: `${200 + idx * 70}ms`,
                animationFillMode: 'both',
              }}
            >
              {/* Anel conic-gradient */}
              <div
                className="flex items-center justify-center"
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  background: `conic-gradient(${s.ring} ${deg}deg, ${s.track} 0deg)`,
                  transition: 'background 0.9s cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                <div
                  className="flex flex-col items-center justify-center"
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: '50%',
                    background: '#FDFAF6',
                    border: '1.5px solid rgba(255,255,255,0.9)',
                  }}
                >
                  <span className="text-[14px] font-bold leading-none" style={{ color: s.ring }}>
                    {value}%
                  </span>
                </div>
              </div>

              <p className="mt-2 text-[11px] font-semibold text-center" style={{ color: '#2C1F14' }}>
                {meta.label}
              </p>
              <span
                className="mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.75)',
                  color: s.labelColor,
                }}
              >
                {s.statusIcon} {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Prioridades ── */}
      <SectionLabel text="Prioridades da Sua Pele" />

      <div
        className="animate-fade-in-up"
        style={{
          borderRadius: 22,
          background: '#FFFFFF',
          border: '1px solid #EDE8E1',
          boxShadow: '0 8px 22px rgba(46,41,36,0.09)',
          animationDelay: '330ms',
          animationFillMode: 'both',
        }}
      >
        <div className="px-5 py-5 space-y-3">
          {profile.prioridadesTop3.map((p: string, i: number) => {
            const cfg = PRIORITY_COLORS[i] ?? PRIORITY_COLORS[2];
            return (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-[14px]"
                style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                  style={{ background: cfg.dot, color: '#FFFFFF' }}
                >
                  {i + 1}
                </span>
                <span className="text-[14px] font-medium" style={{ color: '#2C1F14' }}>{p}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Substâncias Sugeridas ── */}
      <SectionLabel text="Substâncias Sugeridas" />

      <div className="space-y-3">
        {allNutrients.map((n, i) => (
          <div
            key={i}
            className="animate-fade-in-up"
            style={{
              borderRadius: 20,
              background: '#FFFFFF',
              border: '1px solid #EDE8E1',
              boxShadow: '0 6px 18px rgba(46,41,36,0.08)',
              animationDelay: `${390 + i * 90}ms`,
              animationFillMode: 'both',
            }}
          >
            <div className="px-5 py-4">
              {/* Nome + badge produto */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl leading-none">{getNutrientEmoji(n.nome)}</span>
                  <p className="text-[15px] font-semibold font-['Playfair_Display']" style={{ color: '#2C1F14' }}>
                    {n.nome}
                  </p>
                </div>
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 mt-0.5"
                  style={{
                    background: n.recomendacao === 'SkinBella Sérum' ? '#E8EFDF' : '#FDF6EE',
                    color:      n.recomendacao === 'SkinBella Sérum' ? '#4A5C3A' : '#C8913F',
                    border:    `1px solid ${n.recomendacao === 'SkinBella Sérum' ? '#d0e4c0' : '#f0d8a8'}`,
                  }}
                >
                  {n.recomendacao}
                </span>
              </div>

              {/* Por que */}
              <p className="text-[13px] mb-3" style={{ color: '#8C7B6B' }}>{n.porque}</p>

              {/* Dica de ação */}
              <div
                className="flex gap-2 items-start px-3 py-2.5 rounded-[10px]"
                style={{ background: '#E8EFDF', border: '1px solid #d0e4c0' }}
              >
                <span className="text-sm shrink-0">💡</span>
                <p className="text-[12px]" style={{ color: '#2C1F14' }}>{n.acao}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Produto Recomendado ── */}
      <SectionLabel text="Produto Recomendado" />

      {serumFirst ? (
        <>
          <SerumCard ingredients={serumIngredients} />
          <CapsCard  ingredients={capsIngredients} />
        </>
      ) : (
        <>
          <CapsCard  ingredients={capsIngredients} />
          <SerumCard ingredients={serumIngredients} />
        </>
      )}

    </section>
  );
};

export default Report;
