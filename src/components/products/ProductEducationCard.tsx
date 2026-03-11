interface Ingredient {
  name: string;
  benefit: string;
}

interface ProductEducationCardProps {
  id: 'serum' | 'caps';
  name: string;
  tag: string;
  tagline: string;
  desc: string;
  ingredients: Ingredient[];
  how: string;
  imageUrl: string;
  matchedIngredients: string[];
  animationDelay?: number;
}

export function ProductEducationCard({
  id,
  name,
  tag,
  tagline,
  desc,
  ingredients,
  how,
  imageUrl,
  matchedIngredients,
  animationDelay = 0,
}: ProductEducationCardProps) {
  const isDark = id === 'serum';

  const colors = isDark
    ? {
        bg: 'linear-gradient(160deg, #1e2e14 0%, #2f4220 50%, #3a5228 100%)',
        shadow: '0 16px 40px rgba(30,46,20,0.38)',
        overlayImg: 'linear-gradient(to bottom, rgba(30,46,20,0.15) 0%, #2f4220 100%)',
        tagBg: 'rgba(255,255,255,0.12)',
        tagColor: '#b8d8a0',
        tagline: '#a8c898',
        title: '#FFFFFF',
        metaTag: '#88a878',
        desc: '#c8e0b8',
        activesLabel: '#88a878',
        matchBg: 'rgba(160,220,130,0.18)',
        matchBorder: 'rgba(160,220,130,0.3)',
        matchBadgeBg: 'rgba(160,220,130,0.2)',
        matchBadgeColor: '#a0dc82',
        ingName: '#e0f0d0',
        ingBenefit: '#a8c898',
        dotBg: 'rgba(255,255,255,0.1)',
        dotColor: '#d0e4b8',
        howBg: 'rgba(255,255,255,0.07)',
        howBorder: 'rgba(255,255,255,0.1)',
        howLabel: '#88a878',
        howText: '#c8e0b8',
        badge: '🌿 Uso tópico',
      }
    : {
        bg: 'linear-gradient(160deg, #f5e8c0 0%, #F0D080 50%, #E8B840 100%)',
        shadow: '0 14px 36px rgba(200,145,63,0.32)',
        overlayImg: 'linear-gradient(to bottom, rgba(240,208,128,0.1) 0%, #F0D080 100%)',
        tagBg: 'rgba(44,31,20,0.12)',
        tagColor: '#7A5020',
        tagline: '#9A7040',
        title: '#2C1F14',
        metaTag: '#9A7040',
        desc: '#5A3810',
        activesLabel: '#9A7040',
        matchBg: 'rgba(120,80,20,0.12)',
        matchBorder: 'rgba(180,120,40,0.3)',
        matchBadgeBg: '#E8EFDF',
        matchBadgeColor: '#4A5C3A',
        ingName: '#2C1F14',
        ingBenefit: '#7A5020',
        dotBg: 'rgba(44,31,20,0.08)',
        dotColor: '#7A5020',
        howBg: 'rgba(44,31,20,0.07)',
        howBorder: 'rgba(44,31,20,0.1)',
        howLabel: '#9A7040',
        howText: '#5A3810',
        badge: '💊 Suplemento oral',
      };

  return (
    <div
      className="overflow-hidden animate-fade-in-up"
      style={{
        borderRadius: 28,
        background: colors.bg,
        boxShadow: colors.shadow,
        animationDelay: `${animationDelay}ms`,
        animationFillMode: 'both',
      }}
    >
      {/* Hero image — preenche todo o card (igual ao combo) */}
      <div className="relative w-full">
        <img
          src={imageUrl}
          alt={name}
          className="w-full block"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: 72,
            background: `linear-gradient(to bottom, transparent 0%, ${isDark ? '#2f4220' : '#F0D080'} 100%)`,
          }}
        />
        <div className="absolute top-4 left-4">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(6px)',
              color: '#ffffff',
            }}
          >
            {colors.badge}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: colors.tagline }}>
          {tagline}
        </p>
        <h2 className="text-[24px] font-semibold font-['Playfair_Display'] mb-1 leading-tight" style={{ color: colors.title }}>
          {name}
        </h2>
        <p className="text-[11px] mb-4" style={{ color: colors.metaTag }}>{tag}</p>
        <p className="text-[13px] leading-relaxed mb-5" style={{ color: colors.desc }}>{desc}</p>

        {/* Ativos principais */}
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: colors.activesLabel }}>
            Ativos principais
          </p>
          <div className="space-y-2.5">
            {ingredients.map((ing, idx) => {
              const isMatch = matchedIngredients.some(m =>
                m.toLowerCase().includes(ing.name.toLowerCase().split(' ')[0])
              );
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 px-3 py-2 rounded-xl transition-colors"
                  style={isMatch ? { background: colors.matchBg, border: `1px solid ${colors.matchBorder}` } : {}}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: colors.dotBg }}
                  >
                    <span className="text-[10px] font-bold" style={{ color: colors.dotColor }}>✓</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-semibold" style={{ color: colors.ingName }}>
                        {ing.name}
                      </span>
                      {isMatch && (
                        <span
                          className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full"
                          style={{ background: colors.matchBadgeBg, color: colors.matchBadgeColor }}
                        >
                          ✦ indicado para você
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: colors.ingBenefit }}>{ing.benefit}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Como usar */}
        <div
          className="px-4 py-3"
          style={{
            borderRadius: 14,
            background: colors.howBg,
            border: `1px solid ${colors.howBorder}`,
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.howLabel }}>
            💡 Como usar
          </p>
          <p className="text-[12px] leading-relaxed" style={{ color: colors.howText }}>{how}</p>
        </div>
      </div>
    </div>
  );
}
