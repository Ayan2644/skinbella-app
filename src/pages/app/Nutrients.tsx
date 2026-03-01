import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';

interface Nutrient {
  nome: string;
  porque: string;
  acao: string;
  recomendacao: string;
  urgencia: number;
}

interface SkinProfile {
  skinAge: number;
  prioridadesTop3: string[];
  nutrientesTop4: Nutrient[];
}

/* ─── Gradientes visuais por posição (decorativo, reflete ranking) ─── */
const POSITION_META = [
  {
    headerGradient: 'linear-gradient(135deg, #F5DEB5 0%, #EEC97D 60%, #E8B860 100%)',
    cardBorder: '#F0D8A8',
    imageUrl: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=500&h=180&fit=crop&q=80',
    decorCircle1: 'rgba(255,255,255,0.25)',
    decorCircle2: 'rgba(255,255,255,0.15)',
  },
  {
    headerGradient: 'linear-gradient(135deg, #F5D5D5 0%, #EEB8B8 60%, #E8A8A8 100%)',
    cardBorder: '#F0C8C8',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=180&fit=crop&q=80',
    decorCircle1: 'rgba(255,255,255,0.25)',
    decorCircle2: 'rgba(255,255,255,0.15)',
  },
  {
    headerGradient: 'linear-gradient(135deg, #C8DFF2 0%, #A8C8E8 60%, #90B8E0 100%)',
    cardBorder: '#B8D8F0',
    imageUrl: 'https://images.unsplash.com/photo-1559181567-c3190b004823?w=500&h=180&fit=crop&q=80',
    decorCircle1: 'rgba(255,255,255,0.25)',
    decorCircle2: 'rgba(255,255,255,0.15)',
  },
  {
    headerGradient: 'linear-gradient(135deg, #C8E8D8 0%, #A8D8B8 60%, #90C8A8 100%)',
    cardBorder: '#B8D8C8',
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&h=180&fit=crop&q=80',
    decorCircle1: 'rgba(255,255,255,0.25)',
    decorCircle2: 'rgba(255,255,255,0.15)',
  },
];

/* ─── Emoji por nome do nutriente ─── */
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
  return '🌿';
}

/* ─── Label e cor de urgência baseados no valor dinâmico ─── */
function getUrgencyStyle(urgencia: number): { label: string; color: string; bg: string } {
  if (urgencia >= 70) return { label: 'URGENTE',    color: '#C4472A', bg: '#FDF0EE' };
  if (urgencia >= 50) return { label: 'IMPORTANTE', color: '#C8913F', bg: '#FDF6EE' };
  return                     { label: 'RECOMENDADO', color: '#4A5C3A', bg: '#E8EFDF' };
}

const Nutrients = () => {
  const profile = storage.getProfile() as SkinProfile | null;
  const [barsActive, setBarsActive] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBarsActive(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (!profile) {
    return <p className="text-muted-foreground">Complete o quiz primeiro.</p>;
  }

  const { skinAge, prioridadesTop3, nutrientesTop4 } = profile;

  return (
    <section className="pb-10">

      {/* ── Header ── */}
      <div className="mb-6 animate-fade-in" style={{ animationFillMode: 'both' }}>
        <p
          className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2"
          style={{ color: '#8C7B6B' }}
        >
          — seu protocolo —
        </p>
        <h1
          className="text-[30px] font-bold leading-tight font-['Playfair_Display'] mb-1"
          style={{ color: '#2C1F14' }}
        >
          Nutrientes<br />essenciais
        </h1>
        <p className="text-sm" style={{ color: '#8C7B6B' }}>
          Para sua pele de <strong style={{ color: '#2C1F14' }}>{skinAge} anos</strong>
        </p>
      </div>

      {/* ── Banner contextual ── */}
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3.5 mb-7 animate-fade-in-up"
        style={{
          background: 'linear-gradient(135deg, #F0EBE3 0%, #E8E0D5 100%)',
          border: '1px solid #E0D8CD',
          animationDelay: '80ms',
          animationFillMode: 'both',
        }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
          style={{ background: '#4A5C3A' }}
        >
          📊
        </div>
        <div>
          <p className="text-xs font-semibold mb-0.5" style={{ color: '#2C1F14' }}>
            Baseado no seu diagnóstico
          </p>
          <p className="text-xs" style={{ color: '#8C7B6B' }}>
            {prioridadesTop3.join(' · ')}
          </p>
        </div>
      </div>

      {/* ── Separador ── */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1" style={{ background: '#EDE8E1' }} />
        <span
          className="text-[9px] font-bold tracking-[0.2em] uppercase"
          style={{ color: '#8C7B6B' }}
        >
          prioridade alta
        </span>
        <div className="h-px flex-1" style={{ background: '#EDE8E1' }} />
      </div>

      {/* ── Cards de Nutrientes ── */}
      <div className="space-y-5 mb-8">
        {nutrientesTop4.map((n, i) => {
          const pos      = POSITION_META[i] ?? POSITION_META[2];
          const urgStyle = getUrgencyStyle(n.urgencia);
          const emoji    = getNutrientEmoji(n.nome);
          const cardDelay = 120 + i * 130;
          const barDelay  = 400 + i * 120;

          return (
            <div
              key={i}
              className="rounded-3xl overflow-hidden animate-fade-in-up"
              style={{
                border: `1px solid ${pos.cardBorder}`,
                boxShadow: '0 6px 24px rgba(44,31,20,0.09)',
                animationDelay: `${cardDelay}ms`,
                animationFillMode: 'both',
              }}
            >
              {/* ── Card Header — imagem + gradiente ── */}
              <div
                className="relative h-[148px] overflow-hidden"
                style={{ background: pos.headerGradient }}
              >
                <img
                  src={pos.imageUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: 0.45, mixBlendMode: 'multiply' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />

                {/* Círculos decorativos */}
                <div
                  className="absolute -top-6 -right-6 w-36 h-36 rounded-full"
                  style={{ background: pos.decorCircle1 }}
                />
                <div
                  className="absolute top-4 right-8 w-20 h-20 rounded-full"
                  style={{ background: pos.decorCircle2 }}
                />
                <div
                  className="absolute -bottom-8 -left-4 w-28 h-28 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                />

                {/* Emoji dinâmico por nutriente */}
                <span
                  className="absolute top-4 left-5 text-5xl drop-shadow-sm select-none"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
                >
                  {emoji}
                </span>

                {/* Fade branco na base */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.4) 40%, transparent 70%)',
                  }}
                />

                {/* Barra de urgência — valor dinâmico */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-[10px] font-bold tracking-widest uppercase"
                      style={{ color: urgStyle.color }}
                    >
                      {urgStyle.label}
                    </span>
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: urgStyle.color }}
                    >
                      {n.urgencia}%
                    </span>
                  </div>

                  {/* Track */}
                  <div
                    className="w-full h-[5px] rounded-full overflow-hidden"
                    style={{ background: 'rgba(0,0,0,0.1)' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        background: urgStyle.color,
                        width: barsActive ? `${n.urgencia}%` : '0%',
                        transition: `width 0.9s cubic-bezier(0.4, 0, 0.2, 1) ${barDelay}ms`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ── Card Body ── */}
              <div className="px-5 pt-4 pb-5" style={{ background: '#FFFFFF' }}>

                {/* Nome + badge produto */}
                <div className="flex items-start justify-between mb-2">
                  <h3
                    className="font-['Playfair_Display'] font-semibold text-[18px] leading-snug flex-1 pr-2"
                    style={{ color: '#2C1F14' }}
                  >
                    {n.nome}
                  </h3>
                  <span
                    className="text-[10px] font-semibold rounded-full px-2.5 py-1 shrink-0 mt-0.5"
                    style={{
                      background: n.recomendacao === 'SkinBella Sérum' ? '#E8EFDF' : '#FDF6EE',
                      color: n.recomendacao === 'SkinBella Sérum' ? '#4A5C3A' : '#C8913F',
                    }}
                  >
                    ◉ Ativo
                  </span>
                </div>

                {/* Porque */}
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: '#8C7B6B' }}
                >
                  {n.porque}
                </p>

                {/* Dica em destaque */}
                <div
                  className="rounded-2xl px-4 py-3.5 mb-4"
                  style={{
                    background: '#E8EFDF',
                    border: '1px solid #D0E4C0',
                  }}
                >
                  <p
                    className="text-xs font-medium leading-relaxed"
                    style={{ color: '#2C1F14' }}
                  >
                    💡 {n.acao}
                  </p>
                </div>

                {/* Produto recomendado */}
                <div
                  className="flex items-center justify-between rounded-2xl px-4 py-3"
                  style={{
                    background: '#F7F3EE',
                    border: '1px solid #EDE8E1',
                  }}
                >
                  <div>
                    <p
                      className="text-[10px] uppercase tracking-wider font-semibold mb-0.5"
                      style={{ color: '#8C7B6B' }}
                    >
                      Produto recomendado
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: '#4A5C3A' }}
                    >
                      ✦ {n.recomendacao}
                    </p>
                  </div>
                  <span
                    className="text-lg font-light"
                    style={{ color: '#4A5C3A' }}
                  >
                    →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default Nutrients;
