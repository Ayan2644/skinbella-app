import { ExternalLink } from 'lucide-react';

interface ComboStickyCtaProps {
  visible: boolean;
  checkoutUrl: string;
  onCtaClick: () => void;
}

export function ComboStickyCta({ visible, checkoutUrl, onCtaClick }: ComboStickyCtaProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 350ms cubic-bezier(0.34,1.56,0.64,1), opacity 250ms ease',
      }}
    >
      <div
        className="pointer-events-auto"
        style={{
          background: 'rgba(255,248,244,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(201,169,110,0.25)',
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 12,
          paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
        }}
      >
        <div className="flex items-center gap-3 max-w-sm mx-auto">
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold truncate" style={{ color: '#2C1F14' }}>
              Protocolo Dupla Ação
            </p>
            <p className="text-[11px]" style={{ color: '#8C7B6B' }}>
              R$199/mês · Caps + Sérum
            </p>
          </div>

          {/* Botão */}
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onCtaClick}
            className="flex items-center gap-1.5 font-bold text-white text-[14px] active:scale-95 transition-transform shrink-0"
            style={{
              background: 'linear-gradient(135deg, #E8667A 0%, #C9A96E 100%)',
              borderRadius: 14,
              paddingLeft: 20,
              paddingRight: 20,
              height: 44,
              boxShadow: '0 4px 14px rgba(232,102,122,0.40)',
              textDecoration: 'none',
            }}
          >
            Quero
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
