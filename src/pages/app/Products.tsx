import { useRef, useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { KIWIFY_CHECKOUT_URL } from '@/lib/auth';
import { trackFunnelEvent } from '@/lib/funnelTracker';
import { ComboModal } from '@/components/ComboModal';
import { useComboModal } from '@/hooks/useComboModal';
import { ProductEducationCard } from '@/components/products/ProductEducationCard';
import { SynergySection } from '@/components/products/SynergySection';
import { InfluencerVideosSection } from '@/components/products/InfluencerVideosSection';
import { ComboCtaBlock } from '@/components/products/ComboCtaBlock';
import { ComboStickyCta } from '@/components/products/ComboStickyCta';

import imgSerum from '@/assets/skinbella-caps-serum/Design sem nome (18).png';
import imgCaps  from '@/assets/skinbella-caps-serum/Design-sem-nome-13.png';
import imgCombo from '@/assets/skinbella-caps-serum/skinbelacapseserum.jpeg';

// ── Dados dos produtos ────────────────────────────────────────────────────────
const SERUM = {
  id: 'serum' as const,
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
  imageUrl: imgSerum,
  matchKeywords: [
    'vitamina c', 'niacinamida', 'hialurônico', 'hialuronico',
    'peptídeos', 'matrixyl', 'rosa mosqueta', 'vitamina e',
    'glicerina', 'pantenol', 'alantoína', 'alantoin',
  ],
};

const CAPS = {
  id: 'caps' as const,
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
  imageUrl: imgCaps,
  matchKeywords: [
    'colágeno', 'colageno', 'biotina', 'zinco',
    'hialurônico', 'hialuronico', 'vitamina e',
    'licopeno', 'silício', 'silicio', 'vitamina c',
  ],
};

// ── Vídeos das influenciadoras ────────────────────────────────────────────────
const INFLUENCER_VIDEOS = [
  { id: 't7HiVlUpvKc', title: 'SkinBella Caps para rejuvenescimento' },
  { id: 'U-Ov3mhPak0', title: 'Serum + Caps funciona mesmo — Relato Real' },
  { id: 'YkgOPxIKobM', title: 'O melhor que já usei — Skinbella Serum' },
  { id: 'XBbyr_nKukw', title: 'Ela recomenda o Serum antes da maquiagem' },
  { id: 'no91evcuWek', title: 'Teste Skinbella Serum + Caps — NutraAds' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getMatchedIngredients(
  keywords: string[],
  nutrientes: { nome: string }[]
): string[] {
  return nutrientes
    .filter(n => keywords.some(kw => n.nome.toLowerCase().includes(kw)))
    .map(n => n.nome);
}

function getRecommendedFirst(
  nutrientes: { nome: string; recomendacao: string }[]
): 'serum' | 'caps' {
  const capsCount = nutrientes.filter(n => n.recomendacao === 'SkinBella Caps').length;
  const serumCount = nutrientes.filter(n => n.recomendacao === 'SkinBella Sérum').length;
  return capsCount > serumCount ? 'caps' : 'serum';
}

// ── Componente principal ──────────────────────────────────────────────────────
const Products = () => {
  const profile    = storage.getProfile();
  const nutrientes = profile?.nutrientesTop4 ?? [];
  const prioridades = profile?.prioridadesTop3 ?? [];
  const prioridade1 = prioridades[0] ?? 'sua pele';

  const serumMatches = getMatchedIngredients(SERUM.matchKeywords, nutrientes);
  const capsMatches  = getMatchedIngredients(CAPS.matchKeywords,  nutrientes);
  const firstProduct = profile ? getRecommendedFirst(nutrientes) : 'serum';
  const orderedProducts = firstProduct === 'caps'
    ? [{ product: CAPS, matches: capsMatches }, { product: SERUM, matches: serumMatches }]
    : [{ product: SERUM, matches: serumMatches }, { product: CAPS, matches: capsMatches }];

  // ── IntersectionObserver para sticky CTA ───────────────────────────────────
  const comboCtaRef  = useRef<HTMLDivElement>(null);
  const synergyRef   = useRef<HTMLDivElement>(null);
  const scrolledRef  = useRef(false);
  const [isComboVisible, setIsComboVisible] = useState(false);
  const [hasScrolled,    setHasScrolled]    = useState(false);
  const sectionScrolledFired = useRef(false);

  useEffect(() => {
    // Tracking: página visualizada
    trackFunnelEvent('products_page_viewed', {
      metadata: { hasPerfil: !!profile, prioridade1 },
    });
  }, []);

  useEffect(() => {
    // Sticky: detectar scroll mínimo
    const onScroll = () => {
      if (!scrolledRef.current && window.scrollY > 200) {
        scrolledRef.current = true;
        setHasScrolled(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Observer no CTA principal (some o sticky quando visível)
    const observer = new IntersectionObserver(
      ([entry]) => setIsComboVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (comboCtaRef.current) observer.observe(comboCtaRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Observer na seção de sinergia (dispara product_section_scrolled 1x)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !sectionScrolledFired.current) {
          sectionScrolledFired.current = true;
          trackFunnelEvent('product_section_scrolled', {
            metadata: { prioridade1 },
          });
        }
      },
      { threshold: 0.3 }
    );
    if (synergyRef.current) observer.observe(synergyRef.current);
    return () => observer.disconnect();
  }, []);

  // ── ComboModal popup ────────────────────────────────────────────────────────
  const combo = useComboModal('products', 5000);

  const handleComboCtaClick = () => {
    trackFunnelEvent('combo_cta_clicked', { metadata: { source: 'inline', prioridade1 } });
  };

  const handleComboCstatickyClick = () => {
    trackFunnelEvent('combo_cta_sticky_clicked', { metadata: { source: 'sticky', prioridade1 } });
  };

  const showSticky = hasScrolled && !isComboVisible;

  return (
    <>
      <section className="space-y-5 pb-24">

        {/* ── Header ── */}
        <div className="animate-fade-in" style={{ animationFillMode: 'both' }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-1" style={{ color: '#8C7B6B' }}>
            SkinBella
          </p>
          <h1 className="text-[26px] font-semibold leading-tight font-['Playfair_Display']" style={{ color: '#2C1F14' }}>
            Seu protocolo para{' '}
            <span style={{ color: '#C9A96E' }}>{prioridade1}</span>
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: '#8C7B6B' }}>
            Formulado para o seu perfil de pele
          </p>
        </div>

        {/* ── Banner de perfil ── */}
        {profile && prioridades.length > 0 && (
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
                Ativos selecionados para suas prioridades
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: '#4A5C3A' }}>
                {prioridades.join(' · ')}
              </p>
            </div>
          </div>
        )}

        {/* ── Cards educacionais dos produtos ── */}
        {orderedProducts.map(({ product, matches }, idx) => (
          <ProductEducationCard
            key={product.id}
            id={product.id}
            name={product.name}
            tag={product.tag}
            tagline={product.tagline}
            desc={product.desc}
            ingredients={product.ingredients}
            how={product.how}
            imageUrl={product.imageUrl}
            matchedIngredients={matches}
            animationDelay={80 + idx * 80}
          />
        ))}

        {/* ── Seção de sinergia ── */}
        <div ref={synergyRef}>
          <SynergySection prioridade={prioridade1} animationDelay={260} />
        </div>

        {/* ── Influenciadoras ── */}
        <InfluencerVideosSection videos={INFLUENCER_VIDEOS} animationDelay={320} />

        {/* ── CTA Combo — único ponto de venda ── */}
        <ComboCtaBlock
          ref={comboCtaRef}
          prioridade={prioridade1}
          imageUrl={imgCombo}
          checkoutUrl={KIWIFY_CHECKOUT_URL}
          onCtaClick={handleComboCtaClick}
          animationDelay={380}
        />

      </section>

      {/* ── Sticky CTA ── */}
      <ComboStickyCta
        visible={showSticky}
        checkoutUrl={KIWIFY_CHECKOUT_URL}
        onCtaClick={handleComboCstatickyClick}
      />

      {/* ── ComboModal popup ── */}
      <ComboModal open={combo.open} onClose={combo.close} />
    </>
  );
};

export default Products;
