import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { KIWIFY_CHECKOUT_URL } from '@/lib/auth';
import comboHero from '@/assets/skinbella-caps-serum/skinbelacapseserum.jpeg';

interface ComboModalProps {
  open: boolean;
  onClose: () => void;
}

const TIMER_SECONDS = 15 * 60; // 15 minutos

function useCountdown(active: boolean) {
  const [secs, setSecs] = useState(TIMER_SECONDS);

  useEffect(() => {
    if (!active) return;
    setSecs(TIMER_SECONDS);
    const id = setInterval(() => setSecs(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [active]);

  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function ComboModal({ open, onClose }: ComboModalProps) {
  const timer = useCountdown(open);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal — ocupa ~90vh para a imagem aparecer bem */}
      <div
        className="relative z-10 w-full max-w-sm mx-auto rounded-t-3xl overflow-hidden shadow-2xl flex flex-col"
        style={{ maxHeight: '92vh', background: '#FFF8F4' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Hero image — ocupa bastante espaço */}
        <div className="relative w-full flex-shrink-0" style={{ height: '52vw', minHeight: 220, maxHeight: 320 }}>
          <img
            src={comboHero}
            alt="Skinbella Caps + Sérum"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          {/* Gradiente sutil só na borda inferior, sem cobrir o rosto */}
          <div
            className="absolute inset-x-0 bottom-0"
            style={{
              height: '35%',
              background: 'linear-gradient(to bottom, transparent 0%, #FFF8F4 100%)',
            }}
          />

          {/* Badge topo */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span
              className="text-[10px] font-bold tracking-widest px-3 py-1 rounded-full"
              style={{ background: '#C9A96E', color: '#fff' }}
            >
              ✦ COMBO DA BELEZA
            </span>
          </div>
        </div>

        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/25 hover:bg-black/35 transition-colors"
        >
          <X size={16} className="text-white" />
        </button>

        {/* Conteúdo */}
        <div className="px-5 pb-5 pt-1 overflow-y-auto">

          {/* Produto */}
          <p
            className="text-center text-[11px] font-bold tracking-widest uppercase mb-1"
            style={{ color: '#C9A96E' }}
          >
            SKINBELLA CAPS + SKINBELLA SÉRUM
          </p>

          {/* Headline */}
          <h2
            className="text-[22px] font-bold text-center leading-tight mb-3 font-['Playfair_Display']"
            style={{ color: '#2C1F14' }}
          >
            Volte a ter o Rosto dos 20
          </h2>

          {/* Bullets diretos */}
          <div className="space-y-1.5 mb-4">
            {[
              '✦ Sérum — apaga manchas e firma a pele em 3 semanas',
              '✦ Caps — colágeno, zinco e biotina de dentro pra fora',
              '✦ Juntos: resultado que você vê no espelho',
            ].map((b, i) => (
              <p key={i} className="text-[13px]" style={{ color: '#6B5544' }}>{b}</p>
            ))}
          </div>

          {/* Timer UX */}
          <div
            className="flex items-center justify-center gap-2 py-2 rounded-xl mb-4"
            style={{ background: '#FFF0E8', border: '1px solid #F5D0B8' }}
          >
            <span className="text-base">⏱</span>
            <p className="text-[12px] font-semibold" style={{ color: '#C8623A' }}>
              Oferta reservada por{' '}
              <span className="font-extrabold text-[14px]">{timer}</span>
            </p>
          </div>

          {/* Preço */}
          <div className="text-center mb-4">
            <span className="text-xs line-through" style={{ color: '#bbb' }}>De R$200+</span>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-[32px] font-extrabold leading-none" style={{ color: '#E8667A' }}>
                R$199
              </span>
              <span className="text-xs" style={{ color: '#999' }}>= R$6,63/dia</span>
            </div>
          </div>

          {/* CTA */}
          <a
            href={KIWIFY_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-4 rounded-2xl font-bold text-white text-[15px] transition-transform active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #E8667A 0%, #C9A96E 100%)',
              boxShadow: '0 6px 20px rgba(232,102,122,0.4)',
              textDecoration: 'none',
            }}
            onClick={onClose}
          >
            Quero o Combo Agora →
          </a>

          <p className="text-center text-[11px] mt-2" style={{ color: '#ccc' }}>
            Frete grátis · 30 dias de garantia · Sem risco
          </p>
        </div>
      </div>
    </div>
  );
}
