import { Button } from '@/components/ui/button';
import { Sparkles, Shield, Zap, HeadphonesIcon } from 'lucide-react';

interface OfferCardProps {
  onAccess: () => void;
}

export default function OfferCard({ onAccess }: OfferCardProps) {
  return (
    <section className="px-5">
      <div
        className="rounded-3xl border border-primary/20 p-6 shadow-elegant overflow-hidden relative"
        style={{ background: 'linear-gradient(160deg, hsl(var(--card)), hsl(var(--secondary) / 0.4))' }}
      >
        {/* Header with badge */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground font-['Playfair_Display'] leading-snug pr-3">
            Desbloqueio do Protocolo<br />Pele de Porcelana™
          </h3>
          <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
            -52% HOJE
          </span>
        </div>

        <p className="text-[13px] text-muted-foreground leading-relaxed mb-5">
          Comece agora o tratamento e acompanhe diariamente a evolução da sua pele.
        </p>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm text-muted-foreground line-through">R$ 59/mês</span>
          <span className="text-3xl font-bold text-foreground font-['Playfair_Display']">R$ 29</span>
          <span className="text-sm text-muted-foreground">/mês</span>
        </div>

        <p className="text-[11px] text-muted-foreground mb-6">
          Cancele quando quiser • Acesso imediato
        </p>

        {/* CTA */}
        <Button
          onClick={onAccess}
          className="w-full rounded-2xl h-14 text-base font-semibold shadow-elegant"
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
