import { storage } from '@/lib/storage';
import { Sparkles, Shield, Droplets, Sun } from 'lucide-react';

const nutrientIcons = [Sparkles, Shield, Droplets, Sun];

const Nutrients = () => {
  const profile = storage.getProfile();
  if (!profile) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Droplets className="w-10 h-10 text-primary mb-4" />
      <p className="text-lg font-semibold text-foreground mb-1">Nutrientes indisponível</p>
      <p className="text-sm text-muted-foreground">Complete o quiz primeiro.</p>
    </div>
  );

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nutrientes essenciais</h1>
        <p className="text-sm text-muted-foreground mt-0.5">O que sua pele precisa agora</p>
      </div>

      <div className="space-y-3">
        {profile.nutrientesTop4.map((n: any, i: number) => {
          const Icon = nutrientIcons[i % nutrientIcons.length];
          return (
            <div key={i} className="app-card space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm">{n.nome}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.porque}</p>
                </div>
              </div>
              <div className="bg-muted/60 rounded-xl p-3">
                <p className="text-xs font-medium text-foreground">💡 {n.acao}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {n.recomendacao}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Nutrients;
