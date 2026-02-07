import { Lock } from 'lucide-react';
import ResultCard from './ResultCard';

const items = [
  { icon: '💆', text: 'Plano de skincare personalizado' },
  { icon: '🥗', text: 'Dieta anti-envelhecimento' },
  { icon: '🌅', text: 'Rotina matinal e noturna guiada' },
  { icon: '✅', text: 'Checklist diário interativo' },
  { icon: '💊', text: 'Nutrientes e suplementos recomendados' },
  { icon: '📸', text: 'Acompanhamento com selfie semanal' },
];

export default function LockedReportCard() {
  return (
    <section className="px-5">
      <ResultCard className="relative overflow-hidden">
        {/* Subtle locked overlay gradient */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{ background: 'linear-gradient(180deg, transparent 40%, hsl(var(--accent) / 0.06))' }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Lock className="w-[18px] h-[18px] text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-[15px] font-['Playfair_Display']">
                Relatório completo bloqueado
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Incluso no Protocolo Pele de Porcelana™
              </p>
            </div>
          </div>

          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.text} className="flex items-center gap-3 text-[13px] text-foreground/80">
                <span className="text-base leading-none">{item.icon}</span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </ResultCard>
    </section>
  );
}
