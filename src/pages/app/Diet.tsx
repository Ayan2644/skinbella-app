import { storage } from '@/lib/storage';

interface NutrientRef { nome: string; recomendacao: string; }

function buildCapsTip(capsNutrients: NutrientRef[]): string {
  const names = capsNutrients.map(n => n.nome);
  if (names.length === 0)
    return 'O SkinBella Caps complementa os nutrientes desta dieta com ativos de alta biodisponibilidade oral.';
  const pair = names.slice(0, 2).join(' e ');
  return `O SkinBella Caps — com ${pair} — age de dentro para potencializar cada nutriente desta dieta.`;
}

/* ─── Emojis por keyword ─── */
function getPriorizarEmoji(item: string): string {
  const t = item.toLowerCase();
  if (t.includes('fruta') || t.includes('vitamina c') || t.includes('laranja') || t.includes('kiwi')) return '🍊';
  if (t.includes('peixe') || t.includes('salmão') || t.includes('ômega') || t.includes('sardinha')) return '🐟';
  if (t.includes('vegetal') || t.includes('verde') || t.includes('espinafre') || t.includes('couve')) return '🥬';
  if (t.includes('água') || t.includes('agua'))                                                       return '💧';
  if (t.includes('chá') || t.includes('cha') || t.includes('antioxidante'))                           return '🍵';
  if (t.includes('castanha') || t.includes('oleaginosa') || t.includes('nozes'))                      return '🥜';
  if (t.includes('iogurte') || t.includes('probiótico'))                                              return '🥛';
  if (t.includes('ovo'))                                                                               return '🥚';
  if (t.includes('azeite') || t.includes('oliva'))                                                    return '🫒';
  return '🌿';
}

function getReduzirEmoji(item: string): string {
  const t = item.toLowerCase();
  if (t.includes('açúcar') || t.includes('acucar') || t.includes('doce'))  return '🍬';
  if (t.includes('fritura') || t.includes('processado') || t.includes('ultraprocessado')) return '🍟';
  if (t.includes('álcool') || t.includes('alcool'))                          return '🍷';
  if (t.includes('laticínio') || t.includes('laticinios'))                   return '🥛';
  if (t.includes('refrigerante'))                                             return '🥤';
  if (t.includes('sal') || t.includes('sódio'))                              return '🧂';
  if (t.includes('cafeína') || t.includes('cafe'))                           return '☕';
  return '🚫';
}

function getMealEmoji(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('café') || t.includes('cafe') || t.includes('manhã') || t.includes('manha')) return '☕';
  if (t.includes('almoço') || t.includes('almoco'))                                             return '🥗';
  if (t.includes('jantar'))                                                                      return '🍲';
  if (t.includes('ceia'))                                                                        return '🌙';
  if (t.includes('lanche'))                                                                      return '🍎';
  return '🍽️';
}

/* Parseia "Refeição: descrição" em { title, desc } */
function parseMeal(item: string): { title: string; desc: string } {
  const colonIdx = item.indexOf(':');
  if (colonIdx !== -1) {
    return {
      title: item.slice(0, colonIdx).trim(),
      desc:  item.slice(colonIdx + 1).trim(),
    };
  }
  return { title: item, desc: '' };
}

/* ─── Separador de seção ─── */
const SectionLabel = ({
  text,
  color = '#8C7B6B',
}: {
  text: string;
  color?: string;
}) => (
  <div className="flex items-center gap-3 pt-1">
    <div className="h-px flex-1" style={{ background: '#EDE8E1' }} />
    <span
      className="text-[10px] font-bold uppercase tracking-[0.22em] shrink-0"
      style={{ color }}
    >
      {text}
    </span>
    <div className="h-px flex-1" style={{ background: '#EDE8E1' }} />
  </div>
);

/* ─── Componente principal ─── */
const Diet = () => {
  const profile = storage.getProfile();

  if (!profile) {
    return (
      <p className="text-center py-10 text-[14px]" style={{ color: '#8C7B6B' }}>
        Complete o quiz primeiro.
      </p>
    );
  }

  const { dieta, skinAge, prioridadesTop3 } = profile;

  const capsNutrients: NutrientRef[] = (profile.nutrientesTop4 ?? []).filter(
    (n: NutrientRef) => n.recomendacao === 'SkinBella Caps'
  );
  const capsTip = buildCapsTip(capsNutrients);

  return (
    <section className="space-y-4 pb-10">

      {/* ── Header contextual ── */}
      <div
        className="animate-fade-in"
        style={{ animationFillMode: 'both' }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-1" style={{ color: '#8C7B6B' }}>
          Personalizado para você
        </p>
        <h1
          className="text-[24px] font-semibold leading-tight font-['Playfair_Display'] mb-1"
          style={{ color: '#2C1F14' }}
        >
          Protocolo Nutricional
        </h1>
        <p className="text-[13px]" style={{ color: '#8C7B6B' }}>
          Para uma pele de {skinAge} anos
        </p>
      </div>

      {/* Banner de prioridades */}
      <div
        className="flex items-start gap-3 px-4 py-3 animate-fade-in-up"
        style={{
          borderRadius: 16,
          background: '#F0EBE3',
          border: '1px solid #EDE8E1',
          animationDelay: '60ms',
          animationFillMode: 'both',
        }}
      >
        <span className="text-base shrink-0 mt-0.5">📊</span>
        <div>
          <p className="text-[11px] font-semibold mb-0.5" style={{ color: '#2C1F14' }}>
            Baseado nas suas prioridades de pele
          </p>
          <p className="text-[11px]" style={{ color: '#8C7B6B' }}>
            {prioridadesTop3.join(' · ')}
          </p>
        </div>
      </div>

      {/* ── Aliados da Pele ── */}
      <SectionLabel text="Aliados da Sua Pele" color="#4A5C3A" />

      <div className="space-y-2.5">
        {dieta.priorizar.map((item: string, i: number) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3.5 animate-fade-in-up"
            style={{
              borderRadius: 18,
              background: '#E8EFDF',
              border: '1px solid #d0e4c0',
              boxShadow: '0 4px 12px rgba(74,92,58,0.08)',
              animationDelay: `${80 + i * 55}ms`,
              animationFillMode: 'both',
            }}
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0"
              style={{ background: 'rgba(74,92,58,0.12)', border: '1px solid #c0d8a8' }}
            >
              {getPriorizarEmoji(item)}
            </div>
            <p className="text-[13px] font-medium leading-snug flex-1" style={{ color: '#2C1F14' }}>
              {item}
            </p>
            <span className="text-[11px] font-bold shrink-0" style={{ color: '#4A5C3A' }}>✓</span>
          </div>
        ))}
      </div>

      {/* ── Evitar ── */}
      <SectionLabel text="Evitar para Melhores Resultados" color="#C4472A" />

      <div className="space-y-2.5">
        {dieta.reduzir.map((item: string, i: number) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3.5 animate-fade-in-up"
            style={{
              borderRadius: 18,
              background: '#FDF0EE',
              border: '1px solid #f0c0b8',
              boxShadow: '0 4px 12px rgba(196,71,42,0.07)',
              animationDelay: `${80 + i * 55}ms`,
              animationFillMode: 'both',
            }}
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0"
              style={{ background: 'rgba(196,71,42,0.10)', border: '1px solid #f0c0b8' }}
            >
              {getReduzirEmoji(item)}
            </div>
            <p className="text-[13px] font-medium leading-snug flex-1" style={{ color: '#2C1F14' }}>
              {item}
            </p>
            <span className="text-[11px] font-bold shrink-0" style={{ color: '#C4472A' }}>✗</span>
          </div>
        ))}
      </div>

      {/* ── Plano do Dia — Timeline ── */}
      <SectionLabel text="Plano de Hoje" color="#C8913F" />

      <div className="relative">
        {/* Linha vertical da timeline */}
        <div
          className="absolute left-[19px] top-4 bottom-4"
          style={{ width: 2, background: 'linear-gradient(to bottom, #F0D8A8, #C8913F, #F0D8A8)' }}
        />

        <div className="space-y-3">
          {dieta.plano.map((item: string, i: number) => {
            const { title, desc } = parseMeal(item);
            const isLast = i === dieta.plano.length - 1;

            return (
              <div
                key={i}
                className="flex gap-4 animate-fade-in-up"
                style={{
                  animationDelay: `${100 + i * 80}ms`,
                  animationFillMode: 'both',
                }}
              >
                {/* Dot da timeline */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg z-10 shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #FDF0C8 0%, #F5CF80 100%)',
                      border: '2px solid #F0D8A8',
                      boxShadow: '0 4px 10px rgba(200,145,63,0.2)',
                    }}
                  >
                    {getMealEmoji(title)}
                  </div>
                  {!isLast && <div className="w-0.5 flex-1 mt-1" style={{ background: 'transparent' }} />}
                </div>

                {/* Card da refeição */}
                <div
                  className="flex-1 mb-1"
                  style={{
                    borderRadius: 18,
                    background: '#FFFFFF',
                    border: '1px solid #EDE8E1',
                    boxShadow: '0 4px 14px rgba(46,41,36,0.08)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Header da refeição */}
                  <div
                    className="px-4 py-2.5"
                    style={{
                      background: 'linear-gradient(135deg, #FDF6EE 0%, #F5EEDD 100%)',
                      borderBottom: '1px solid #F0E8D8',
                    }}
                  >
                    <p
                      className="text-[13px] font-bold font-['Playfair_Display']"
                      style={{ color: '#C8913F' }}
                    >
                      {title}
                    </p>
                  </div>

                  {/* Descrição */}
                  {desc && (
                    <div className="px-4 py-3">
                      <p className="text-[13px] leading-relaxed" style={{ color: '#2C1F14' }}>
                        {desc}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Dica final — dinâmica com Caps nutrients ── */}
      <div
        className="animate-fade-in-up"
        style={{
          borderRadius: 20,
          background: 'linear-gradient(135deg, #FDF0C8 0%, #F5E8A8 100%)',
          border: '1px solid #F0D8A8',
          boxShadow: '0 6px 18px rgba(200,145,63,0.15)',
          animationDelay: '500ms',
          animationFillMode: 'both',
        }}
      >
        <div className="flex gap-3 items-start px-4 py-4">
          <span className="text-xl shrink-0 mt-0.5">💊</span>
          <div>
            <p className="text-[13px] font-semibold mb-0.5" style={{ color: '#2C1F14' }}>
              Potencialize com SkinBella Caps
            </p>
            <p className="text-[12px] leading-relaxed" style={{ color: '#7A5020' }}>
              {capsTip}
            </p>
          </div>
        </div>
        <div
          className="flex gap-3 items-start px-4 pb-4"
          style={{ marginTop: -4 }}
        >
          <span className="text-xl shrink-0 opacity-0">💡</span>
          <p className="text-[11px] leading-relaxed" style={{ color: '#9A7040' }}>
            Dieta + suplemento + sérum tópico = protocolo completo de dentro para fora.
          </p>
        </div>
      </div>

    </section>
  );
};

export default Diet;
