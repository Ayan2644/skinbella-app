import { storage } from '@/lib/storage';
import { Apple, Ban, UtensilsCrossed, Sparkles } from 'lucide-react';

const Diet = () => {
  const profile = storage.getProfile();
  if (!profile) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Apple className="w-10 h-10 text-primary mb-4" />
      <p className="text-lg font-semibold text-foreground mb-1">Dieta indisponível</p>
      <p className="text-sm text-muted-foreground">Complete o quiz primeiro.</p>
    </div>
  );

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dieta para sua pele</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Alimentação personalizada para resultados visíveis</p>
      </div>

      {/* Priorizar */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Priorizar</h2>
        </div>
        <div className="space-y-2">
          {profile.dieta.priorizar.map((item: string, i: number) => (
            <div key={i} className="app-card !p-3.5 flex items-center gap-3">
              <span className="text-primary text-sm">✓</span>
              <p className="text-sm text-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reduzir */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
            <Ban className="w-4 h-4 text-destructive" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Reduzir</h2>
        </div>
        <div className="space-y-2">
          {profile.dieta.reduzir.map((item: string, i: number) => (
            <div key={i} className="app-card !p-3.5 flex items-center gap-3">
              <span className="text-destructive text-sm">✗</span>
              <p className="text-sm text-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Plano */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
            <UtensilsCrossed className="w-4 h-4 text-accent" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Plano simples de 1 dia</h2>
        </div>
        <div className="space-y-2">
          {profile.dieta.plano.map((item: string, i: number) => (
            <div key={i} className="app-card !p-3.5 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-accent/15 text-accent text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
              <p className="text-sm text-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Diet;
