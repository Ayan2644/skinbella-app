import { ExternalLink } from 'lucide-react';
import { ComboModal } from '@/components/ComboModal';
import { useComboModal } from '@/hooks/useComboModal';

/* ─── Conteúdo da biblioteca ─── */
const CONTENTS = [
  {
    emoji: '📚',
    category: 'Ebook',
    categoryColor: '#4A5C3A',
    categoryBg: '#E8EFDF',
    categoryBorder: '#d0e4c0',
    title: 'Ebook: Rotina e Cuidados',
    desc: 'Guia completo de skincare para iniciantes e avançadas.',
    cardBg: 'linear-gradient(135deg, #F0F5EB 0%, #E4EFD8 100%)',
    border: '#d0e4c0',
    link: '#',
  },
  {
    emoji: '🔬',
    category: 'Guia Científico',
    categoryColor: '#C4472A',
    categoryBg: '#FDF0EE',
    categoryBorder: '#f0c0b8',
    title: 'Guia: Manchas na Pele',
    desc: 'Entenda os tipos de manchas e como tratar cada uma.',
    cardBg: '#FFFFFF',
    border: '#EDE8E1',
    link: '#',
  },
  {
    emoji: '✨',
    category: 'Guia de Beleza',
    categoryColor: '#C8913F',
    categoryBg: '#FDF6EE',
    categoryBorder: '#f0d8a8',
    title: 'Guia: Pele Opaca',
    desc: 'Dicas práticas para recuperar o viço e a luminosidade.',
    cardBg: 'linear-gradient(135deg, #FFFBF3 0%, #FDF6E8 100%)',
    border: '#f0d8a8',
    link: '#',
  },
  {
    emoji: '✅',
    category: 'Ferramenta',
    categoryColor: '#4A5C3A',
    categoryBg: '#E8EFDF',
    categoryBorder: '#d0e4c0',
    title: 'Checklist Imprimível',
    desc: 'Seu checklist diário para imprimir e acompanhar a evolução.',
    cardBg: '#FFFFFF',
    border: '#EDE8E1',
    link: '#',
  },
  {
    emoji: '☀️',
    category: 'Guia Científico',
    categoryColor: '#C4472A',
    categoryBg: '#FDF0EE',
    categoryBorder: '#f0c0b8',
    title: 'Guia: Proteção Solar',
    desc: 'Tudo sobre protetor solar e como escolher o ideal para seu tipo de pele.',
    cardBg: 'linear-gradient(135deg, #FFFBF3 0%, #FDF6E8 100%)',
    border: '#f0d8a8',
    link: '#',
  },
  {
    emoji: '🥗',
    category: 'Receitas',
    categoryColor: '#4A5C3A',
    categoryBg: '#E8EFDF',
    categoryBorder: '#d0e4c0',
    title: 'Receitas Skin-Friendly',
    desc: 'Receitas práticas e ricas em antioxidantes para nutrir a pele de dentro.',
    cardBg: '#FFFFFF',
    border: '#EDE8E1',
    link: '#',
  },
];

const Library = () => {
  const combo = useComboModal('library', 5000);

  return (
    <>
    <ComboModal open={combo.open} onClose={combo.close} />
    <section className="space-y-4 pb-10">

      {/* ── Header ── */}
      <div
        className="animate-fade-in"
        style={{ animationFillMode: 'both' }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-1" style={{ color: '#8C7B6B' }}>
          Conteúdo exclusivo
        </p>
        <h1
          className="text-[26px] font-semibold leading-tight font-['Playfair_Display']"
          style={{ color: '#2C1F14' }}
        >
          Biblioteca
        </h1>
        <p className="text-[13px] mt-0.5" style={{ color: '#8C7B6B' }}>
          Guias e ferramentas para cuidar da sua pele
        </p>
      </div>

      {/* ── Grid de conteúdos ── */}
      <div className="space-y-3">
        {CONTENTS.map((c, i) => (
          <a
            key={i}
            href={c.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 animate-fade-in-up active:scale-[0.98] transition-transform duration-150"
            style={{
              borderRadius: 20,
              background: c.cardBg,
              border: `1px solid ${c.border}`,
              boxShadow: '0 6px 18px rgba(46,41,36,0.08)',
              animationDelay: `${60 + i * 70}ms`,
              animationFillMode: 'both',
              display: 'flex',
              padding: '16px',
              textDecoration: 'none',
            }}
          >
            {/* Ícone */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{
                background: 'rgba(255,255,255,0.85)',
                border: `1px solid ${c.border}`,
                boxShadow: '0 2px 8px rgba(46,41,36,0.07)',
              }}
            >
              {c.emoji}
            </div>

            {/* Texto */}
            <div className="flex-1 min-w-0">
              {/* Badge de categoria */}
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  background: c.categoryBg,
                  color: c.categoryColor,
                  border: `1px solid ${c.categoryBorder}`,
                }}
              >
                {c.category}
              </span>

              <p
                className="text-[15px] font-semibold font-['Playfair_Display'] mt-1.5 mb-0.5 leading-snug"
                style={{ color: '#2C1F14' }}
              >
                {c.title}
              </p>
              <p className="text-[12px] leading-snug" style={{ color: '#8C7B6B' }}>
                {c.desc}
              </p>
            </div>

            {/* Seta */}
            <ExternalLink
              className="w-4 h-4 shrink-0"
              style={{ color: '#8C7B6B' }}
            />
          </a>
        ))}
      </div>

      {/* ── Banner de novidades ── */}
      <div
        className="flex items-start gap-3 px-5 py-4 animate-fade-in-up"
        style={{
          borderRadius: 20,
          background: 'linear-gradient(135deg, #f8f3ec 0%, #ede5d8 100%)',
          border: '1px solid #EDE8E1',
          boxShadow: '0 6px 18px rgba(46,41,36,0.08)',
          animationDelay: '520ms',
          animationFillMode: 'both',
        }}
      >
        <span className="text-xl shrink-0 mt-0.5">🔔</span>
        <div>
          <p className="text-[13px] font-semibold" style={{ color: '#2C1F14' }}>
            Novos conteúdos em breve
          </p>
          <p className="text-[12px] mt-0.5 leading-relaxed" style={{ color: '#8C7B6B' }}>
            A biblioteca SkinBella é atualizada mensalmente com novos guias, receitas e ferramentas exclusivas.
          </p>
        </div>
      </div>

    </section>
    </>
  );
};

export default Library;
