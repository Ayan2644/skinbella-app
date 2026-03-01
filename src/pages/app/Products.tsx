import { storage } from '@/lib/storage';
import { ExternalLink } from 'lucide-react';

/* ─── Dados dos produtos — 8 ativos reais de cada fórmula ─── */
const SERUM = {
  id: 'serum',
  name: 'SkinBella Sérum',
  tag: 'Uso tópico · Aplicação facial',
  tagline: 'Ação concentrada diretamente na pele',
  desc: 'Sérum com 8 ativos de alta concentração que agem na uniformização, hidratação, firmeza e renovação celular. Resultado visível a partir da 3ª semana de uso consistente.',
  ingredients: [
    { name: 'Vitamina C Estabilizada 10%', benefit: 'Apaga manchas e devolve o brilho natural' },
    { name: 'Ácido Hialurônico Duplo PM',  benefit: 'Hidratação profunda e efeito preenchimento' },
    { name: 'Niacinamida 10%',             benefit: 'Fecha poros, controla oleosidade e uniformiza' },
    { name: 'Peptídeos Matrixyl 3000',      benefit: 'Estimula colágeno e restaura a firmeza' },
    { name: 'Rosa Mosqueta 5%',            benefit: 'Renovação celular e suaviza cicatrizes' },
    { name: 'Vitamina E 1%',               benefit: 'Antioxidante que potencializa a Vitamina C' },
    { name: 'Glicerina + Pantenol',        benefit: 'Hidratação imediata e conforto sensorial' },
    { name: 'Alantoína 0,5%',             benefit: 'Calmante — seguro para todos os tipos de pele' },
  ],
  how: 'Aplique 3–4 gotas no rosto limpo pela manhã e à noite. Pressione suavemente sobre a pele e aguarde 60s antes do hidratante. Pela manhã, finalize com protetor solar FPS 50+.',
  imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=400&fit=crop&q=80',
  matchKeywords: [
    'vitamina c', 'niacinamida', 'hialurônico', 'hialuronico',
    'peptídeos', 'matrixyl', 'rosa mosqueta', 'vitamina e',
    'glicerina', 'pantenol', 'alantoína', 'alantoin',
  ],
  link: '#',
};

const CAPS = {
  id: 'caps',
  name: 'SkinBella Caps',
  tag: 'Suplemento oral · 60 cápsulas',
  tagline: 'Nutrição de dentro para fora',
  desc: 'Suplemento com 8 ativos que agem na firmeza, elasticidade, oleosidade, fotoproteção interna e hidratação profunda — a parceria essencial com o sérum tópico.',
  ingredients: [
    { name: 'Colágeno Hidrolisado 2500mg', benefit: 'Firmeza e elasticidade na derme profunda' },
    { name: 'Vitamina C',                  benefit: 'Síntese de colágeno e antioxidante sistêmico' },
    { name: 'Biotina (B7)',                benefit: 'Barreira cutânea, pele seca, cabelo e unhas' },
    { name: 'Zinco',                       benefit: 'Anti-acne, controle de sebo e cicatrização' },
    { name: 'Ácido Hialurônico Oral',      benefit: 'Hidratação profunda interna e volume dérmico' },
    { name: 'Vitamina E',                  benefit: 'Proteção antioxidante e sinergia com Vitamina C' },
    { name: 'Licopeno',                    benefit: 'Fotoproteção interna e clareia manchas solares' },
    { name: 'Silício Orgânico',            benefit: 'Estimula elastina e reconstrói a firmeza' },
  ],
  how: 'Tome 2 cápsulas por dia, preferencialmente com o café da manhã, acompanhadas de água. Para máxima síntese de colágeno, tome junto com a Vitamina C da dieta ou do suplemento.',
  imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=400&fit=crop&q=80',
  matchKeywords: [
    'colágeno', 'colageno', 'biotina', 'zinco',
    'hialurônico', 'hialuronico', 'vitamina e',
    'licopeno', 'silício', 'silicio', 'vitamina c',
  ],
  link: '#',
};

/* ─── Helpers ─── */
function getRecommendedProduct(
  nutrientesTop4: { nome: string; recomendacao: string }[]
): 'serum' | 'caps' | null {
  const serumCount = nutrientesTop4.filter(n => n.recomendacao === 'SkinBella Sérum').length;
  const capsCount  = nutrientesTop4.filter(n => n.recomendacao === 'SkinBella Caps').length;
  if (serumCount > capsCount) return 'serum';
  if (capsCount > serumCount) return 'caps';
  return 'serum'; // empate → sérum em destaque
}

function getMatchedIngredients(
  productKeywords: string[],
  nutrientesTop4: { nome: string }[]
): string[] {
  return nutrientesTop4
    .filter(n => productKeywords.some(kw => n.nome.toLowerCase().includes(kw)))
    .map(n => n.nome);
}

/* ─── Sub-componente: card de produto ─── */
interface ProductCardProps {
  product: typeof SERUM;
  isHighlighted: boolean;
  matchedIngredients: string[];
  delay: number;
}

const ProductCard = ({ product: p, isHighlighted, matchedIngredients, delay }: ProductCardProps) => {
  const isDark = p.id === 'serum';

  return (
    <div
      className="overflow-hidden animate-fade-in-up"
      style={{
        borderRadius: 28,
        background: isDark
          ? 'linear-gradient(145deg, #243318 0%, #2f4220 60%, #3a5228 100%)'
          : 'linear-gradient(145deg, #FDF0C8 0%, #F5CF80 60%, #EDB84A 100%)',
        boxShadow: isDark
          ? '0 16px 40px rgba(36,51,24,0.35)'
          : '0 14px 36px rgba(200,145,63,0.28)',
        border: isDark ? 'none' : '1px solid #F0D8A8',
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
      }}
    >
      {/* Imagem de capa */}
      <div className="relative w-full overflow-hidden" style={{ height: 160 }}>
        <img
          src={p.imageUrl}
          alt={p.name}
          className="w-full h-full object-cover"
          onError={e => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {/* Gradiente sobre a imagem */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'linear-gradient(to bottom, rgba(36,51,24,0.2) 0%, rgba(36,51,24,0.85) 100%)'
              : 'linear-gradient(to bottom, rgba(253,240,200,0.1) 0%, rgba(237,184,74,0.8) 100%)',
          }}
        />

        {/* Badges sobre a imagem */}
        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
          {isHighlighted && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
              style={{
                background: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(44,31,20,0.15)',
                color: isDark ? '#d0e4b8' : '#7A5020',
              }}
            >
              ✦ Mais indicado para você
            </span>
          )}
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
            style={{
              background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(44,31,20,0.1)',
              color: isDark ? '#b8d8a0' : '#5A3810',
            }}
          >
            {p.id === 'serum' ? '🌿 Uso tópico' : '💊 Suplemento'}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-5">
        {/* Nome + tagline */}
        <p
          className="text-[11px] font-semibold uppercase tracking-wider mb-1"
          style={{ color: isDark ? '#a8c898' : '#9A7040' }}
        >
          {p.tagline}
        </p>
        <h2
          className="text-[24px] font-semibold font-['Playfair_Display'] mb-1"
          style={{ color: isDark ? '#FFFFFF' : '#2C1F14' }}
        >
          {p.name}
        </h2>
        <p
          className="text-[11px] mb-4"
          style={{ color: isDark ? '#88a878' : '#9A7040' }}
        >
          {p.tag}
        </p>

        <p
          className="text-[13px] leading-relaxed mb-5"
          style={{ color: isDark ? '#c8e0b8' : '#5A3810' }}
        >
          {p.desc}
        </p>

        {/* Ingredientes ativos */}
        <div className="mb-5">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
            style={{ color: isDark ? '#88a878' : '#9A7040' }}
          >
            Ativos principais
          </p>
          <div className="space-y-2.5">
            {p.ingredients.map((ing, idx) => {
              const isMatch = matchedIngredients.some(m =>
                m.toLowerCase().includes(ing.name.toLowerCase().split(' ')[0])
              );
              return (
                <div key={idx} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: isMatch
                        ? (isDark ? 'rgba(160,220,130,0.25)' : 'rgba(74,92,58,0.15)')
                        : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(44,31,20,0.08)'),
                    }}
                  >
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: isDark ? '#d0e4b8' : '#7A5020' }}
                    >
                      ✓
                    </span>
                  </div>
                  <div className="flex-1">
                    <span
                      className="text-[13px] font-semibold"
                      style={{ color: isDark ? '#e0f0d0' : '#2C1F14' }}
                    >
                      {ing.name}
                    </span>
                    {isMatch && (
                      <span
                        className="ml-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full"
                        style={{
                          background: isDark ? 'rgba(160,220,130,0.2)' : '#E8EFDF',
                          color: isDark ? '#a0dc82' : '#4A5C3A',
                        }}
                      >
                        ✦ indicado para você
                      </span>
                    )}
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: isDark ? '#a8c898' : '#7A5020' }}
                    >
                      {ing.benefit}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Como usar */}
        <div
          className="px-4 py-3 mb-5"
          style={{
            borderRadius: 14,
            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(44,31,20,0.07)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(44,31,20,0.1)'}`,
          }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-wider mb-1"
            style={{ color: isDark ? '#88a878' : '#9A7040' }}
          >
            💡 Como usar
          </p>
          <p className="text-[12px] leading-relaxed" style={{ color: isDark ? '#c8e0b8' : '#5A3810' }}>
            {p.how}
          </p>
        </div>

        {/* CTA */}
        <a
          href={p.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-semibold text-[15px] active:scale-[0.97] transition-transform duration-150"
          style={{
            background: isDark ? '#FFFFFF' : '#2C1F14',
            color: isDark ? '#243318' : '#FFFFFF',
            boxShadow: isDark
              ? '0 6px 18px rgba(0,0,0,0.25)'
              : '0 6px 18px rgba(44,31,20,0.3)',
            textDecoration: 'none',
          }}
        >
          Comprar {p.name}
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

/* ─── Componente principal ─── */
const Products = () => {
  const profile = storage.getProfile();
  const nutrientes = profile?.nutrientesTop4 ?? [];
  const prioridades = profile?.prioridadesTop3 ?? [];

  const highlightedId = profile ? getRecommendedProduct(nutrientes) : 'serum';

  const serumMatches = getMatchedIngredients(SERUM.matchKeywords, nutrientes);
  const capsMatches  = getMatchedIngredients(CAPS.matchKeywords,  nutrientes);

  /* Produto mais indicado fica primeiro */
  const orderedProducts = highlightedId === 'caps'
    ? [
        { product: CAPS,  isHighlighted: true,  matches: capsMatches,  delay: 100 },
        { product: SERUM, isHighlighted: false,  matches: serumMatches, delay: 180 },
      ]
    : [
        { product: SERUM, isHighlighted: true,  matches: serumMatches, delay: 100 },
        { product: CAPS,  isHighlighted: false, matches: capsMatches,  delay: 180 },
      ];

  return (
    <section className="space-y-5 pb-10">

      {/* ── Header ── */}
      <div
        className="animate-fade-in"
        style={{ animationFillMode: 'both' }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-1" style={{ color: '#8C7B6B' }}>
          SkinBella
        </p>
        <h1
          className="text-[26px] font-semibold leading-tight font-['Playfair_Display']"
          style={{ color: '#2C1F14' }}
        >
          Produtos
        </h1>
        <p className="text-[13px] mt-0.5" style={{ color: '#8C7B6B' }}>
          Formulados para o seu perfil de pele
        </p>
      </div>

      {/* ── Banner de contexto (se tiver perfil) ── */}
      {profile && (
        <div
          className="flex items-start gap-3 px-4 py-3.5 animate-fade-in-up"
          style={{
            borderRadius: 18,
            background: '#E8EFDF',
            border: '1px solid #d0e4c0',
            animationDelay: '40ms',
            animationFillMode: 'both',
          }}
        >
          <span className="text-base shrink-0 mt-0.5">✦</span>
          <div>
            <p className="text-[12px] font-semibold" style={{ color: '#2C1F14' }}>
              Selecionados para suas prioridades
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: '#4A5C3A' }}>
              {prioridades.join(' · ')}
            </p>
          </div>
        </div>
      )}

      {/* ── Cards dos produtos ── */}
      {orderedProducts.map(({ product, isHighlighted, matches, delay }) => (
        <ProductCard
          key={product.id}
          product={product}
          isHighlighted={isHighlighted}
          matchedIngredients={matches}
          delay={delay}
        />
      ))}

      {/* ── Combinação sugerida ── */}
      <div
        className="px-5 py-5 animate-fade-in-up"
        style={{
          borderRadius: 22,
          background: 'linear-gradient(135deg, #f8f3ec 0%, #ede5d8 100%)',
          border: '1px solid #EDE8E1',
          boxShadow: '0 8px 22px rgba(46,41,36,0.09)',
          animationDelay: '280ms',
          animationFillMode: 'both',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">💡</span>
          <h3
            className="text-[16px] font-semibold font-['Playfair_Display']"
            style={{ color: '#2C1F14' }}
          >
            Combinação ideal
          </h3>
        </div>
        <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#8C7B6B' }}>
          Para resultados mais completos, use o <strong style={{ color: '#2C1F14' }}>Sérum</strong> pela manhã (ação tópica) e as <strong style={{ color: '#2C1F14' }}>Caps</strong> no café da manhã (ação interna). Os ativos se complementam e potencializam o resultado.
        </p>
        <div className="flex items-center gap-3">
          <div
            className="flex-1 px-3 py-2 rounded-xl text-center"
            style={{ background: '#2f4220' }}
          >
            <p className="text-[11px] font-bold" style={{ color: '#d0e4b8' }}>🌿 Sérum</p>
            <p className="text-[10px]" style={{ color: '#a8c898' }}>Manhã</p>
          </div>
          <span className="text-lg" style={{ color: '#8C7B6B' }}>+</span>
          <div
            className="flex-1 px-3 py-2 rounded-xl text-center"
            style={{ background: '#F5CF80' }}
          >
            <p className="text-[11px] font-bold" style={{ color: '#7A5020' }}>💊 Caps</p>
            <p className="text-[10px]" style={{ color: '#9A7040' }}>Café da manhã</p>
          </div>
          <span style={{ color: '#8C7B6B' }}>=</span>
          <div
            className="flex-1 px-3 py-2 rounded-xl text-center"
            style={{ background: '#E8EFDF' }}
          >
            <p className="text-[11px] font-bold" style={{ color: '#4A5C3A' }}>✨ Resultado</p>
            <p className="text-[10px]" style={{ color: '#6A7C5A' }}>Completo</p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Products;
