import { Button } from '@/components/ui/button';
import { Sparkles, Shield, Zap, HeadphonesIcon, Lock } from 'lucide-react';

interface OfferCardProps {
  onAccess: () => void;
}

const items = [
  { icon: '💆', text: 'Plano de skincare personalizado' },
  { icon: '🥗', text: 'Dieta anti-envelhecimento' },
  { icon: '🌅', text: 'Rotina matinal e noturna guiada' },
  { icon: '✅', text: 'Checklist diário interativo' },
  { icon: '💊', text: 'Nutrientes e suplementos recomendados' },
  { icon: '📸', text: 'Acompanhamento com selfie semanal' },
];

export default function OfferCard({ onAccess }: OfferCardProps) {
  return (
    <section className="px-5">
      <div
        className="rounded-[24px] p-6 overflow-hidden relative"
        style={{
          background: 'linear-gradient(160deg, #FFFFFF, hsl(30 25% 88% / 0.4))',
          border: '1px solid rgba(78,107,87,0.15)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(200,169,107,0.1)' }}
          >
            <Lock className="w-[18px] h-[18px]" style={{ color: '#C8A96B' }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[22px] font-semibold text-foreground font-display leading-snug">
              Relatório completo bloqueado
            </h3>
          </div>
          <span
            className="text-[10px] font-bold px-3 py-1.5 whitespace-nowrap flex-shrink-0"
            style={{
              backgroundColor: '#C8A96B',
              color: '#FFFFFF',
              borderRadius: 999,
            }}
          >
            -52% HOJE
          </span>
        </div>

        {/* Items list */}
        <ul className="space-y-2.5 mb-5">
          {items.map((item) => (
            <li key={item.text} className="flex items-center gap-3 text-[13px] text-foreground/80">
              <span className="text-base leading-none">{item.icon}</span>
              {item.text}
            </li>
          ))}
        </ul>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm text-muted-foreground line-through">R$ 59/mês</span>
          <span className="text-[44px] font-bold text-foreground font-display leading-none">R$ 29</span>
          <span className="text-sm text-muted-foreground">/mês</span>
        </div>

        <p className="text-[11px] text-muted-foreground mb-6">
          Cancele quando quiser • Acesso imediato
        </p>

        {/* CTA */}
        <Button
          onClick={onAccess}
          className="w-full rounded-[20px] h-14 text-base font-semibold text-white"
          style={{ backgroundColor: '#4E6B57', boxShadow: '0 4px 16px rgba(78,107,87,0.25)' }}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Começar tratamento agora
        </Button>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 mt-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            Checkout seguro
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            Acesso imediato
          </span>
          <span className="flex items-center gap-1">
            <HeadphonesIcon className="w-3.5 h-3.5" />
            Suporte
          </span>
        </div>
      </div>
    </section>
  );
}
