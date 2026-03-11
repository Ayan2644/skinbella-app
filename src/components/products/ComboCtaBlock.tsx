import { forwardRef, useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

interface ComboCtaBlockProps {
  prioridade: string;
  imageUrl: string;
  checkoutUrl: string;
  onCtaClick: () => void;
  animationDelay?: number;
}

const TIMER_SECONDS = 15 * 60;

function useCountdown() {
  const [secs, setSecs] = useState(TIMER_SECONDS);
  useEffect(() => {
    const id = setInterval(() => setSecs(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export const ComboCtaBlock = forwardRef<HTMLDivElement, ComboCtaBlockProps>(
  ({ prioridade, imageUrl, checkoutUrl, onCtaClick, animationDelay = 0 }, ref) => {
    const timer = useCountdown();

    return (
      <div
        ref={ref}
        className="overflow-hidden animate-fade-in-up"
        style={{
          borderRadius: 24,
          border: '1px solid #EDE8E1',
          boxShadow: '0 8px 28px rgba(46,41,36,0.14)',
          background: '#FFF8F4',
          animationDelay: `${animationDelay}ms`,
          animationFillMode: 'both',
        }}
      >
        {/* Hero image — tamanho natural, sem corte */}
        <div className="relative w-full">
          <img
            src={imageUrl}
            alt="Skinbella Caps + Sérum"
            className="w-full block"
          />
          {/* Fade inferior para transição suave com o conteúdo */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: 72,
              background: 'linear-gradient(to bottom, transparent 0%, #FFF8F4 100%)',
            }}
          />
          {/* Badge topo */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span
              className="text-[10px] font-bold tracking-widest px-4 py-1.5 rounded-full"
              style={{ background: '#C9A96E', color: '#fff' }}
            >
              ✦ PROTOCOLO DUPLA AÇÃO
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="px-6 pb-6 pt-4">
          {/* Identidade */}
          <p
            className="text-center text-[11px] font-bold uppercase tracking-widest mb-1"
            style={{ color: '#C9A96E' }}
          >
            SKINBELLA SÉRUM + SKINBELLA CAPS
          </p>
          <h2
            className="text-[22px] font-semibold text-center leading-snug mb-4 font-['Playfair_Display']"
            style={{ color: '#2C1F14' }}
          >
            Seu Protocolo para Rejuvenescimento Celular da Pele e Controle de Manchas
          </h2>

          {/* Prova social */}
          <div
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-2xl mb-4"
            style={{ background: '#E8EFDF', border: '1px solid #d0e4c0' }}
          >
            <span className="text-[13px]">⭐⭐⭐⭐⭐</span>
            <p className="text-[11px] font-semibold" style={{ color: '#4A5C3A' }}>
              +2.400 protocolos ativos
            </p>
          </div>

          {/* Timer */}
          <div
            className="flex items-center justify-center gap-2 py-2.5 rounded-2xl mb-4"
            style={{ background: '#FFF0E8', border: '1px solid #F5D0B8' }}
          >
            <span className="text-base">⏱</span>
            <p className="text-[12px] font-semibold" style={{ color: '#C8623A' }}>
              Oferta reservada por{' '}
              <span className="font-extrabold text-[15px]">{timer}</span>
            </p>
          </div>

          {/* Preço */}
          <div className="text-center mb-5">
            <span className="text-xs line-through" style={{ color: '#bbb' }}>De R$250+</span>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-[36px] font-extrabold leading-none" style={{ color: '#E8667A' }}>
                R$199
              </span>
              <div className="flex flex-col items-start">
                <span className="text-[13px] font-semibold" style={{ color: '#8C7B6B' }}>/mês</span>
                <span className="text-[11px]" style={{ color: '#aaa' }}>R$6,63/dia</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onCtaClick}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-[20px] font-bold text-white text-[16px] active:scale-[0.97] transition-transform"
            style={{
              background: 'linear-gradient(135deg, #E8667A 0%, #C9A96E 100%)',
              boxShadow: '0 8px 24px rgba(232,102,122,0.45)',
              textDecoration: 'none',
              minHeight: 56,
            }}
          >
            Quero o Protocolo Completo
            <ExternalLink className="w-4 h-4" />
          </a>

          <p className="text-center text-[11px] mt-3" style={{ color: '#ccc' }}>
            Frete grátis · 30 dias de garantia · Sem risco
          </p>
        </div>
      </div>
    );
  }
);

ComboCtaBlock.displayName = 'ComboCtaBlock';
