import { storage } from '@/lib/storage';
import CircularProgress from '@/components/CircularProgress';
import { TrendingUp, Shield, Sparkles } from 'lucide-react';

const labels: Record<string, string> = {
  manchas: 'Manchas', textura: 'Textura', elasticidade: 'Elasticidade',
  poros: 'Poros', oleosidade: 'Oleosidade', hidratacao: 'Hidratação',
};

const Report = () => {
  const profile = storage.getProfile();
  if (!profile) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Sparkles className="w-10 h-10 text-accent mb-4" />
      <p className="text-lg font-semibold text-foreground mb-1">Diagnóstico indisponível</p>
      <p className="text-sm text-muted-foreground">Faça o quiz para ver seu relatório completo.</p>
    </div>
  );

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Seu diagnóstico de pele</h1>
        <p className="text-sm text-muted-foreground">Análise completa baseada no seu perfil</p>
      </div>

      {/* Skin Age Hero */}
      <div className="app-card gradient-porcelain text-center">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-accent-foreground/60 mb-2">Idade estimada da pele</p>
        <p className="text-5xl font-bold text-accent-foreground">{profile.skinAge}</p>
        <p className="text-sm text-accent-foreground/60 mt-1">anos</p>
      </div>

      {/* Circular Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(profile.scores).map(([key, val]) => (
          <div key={key} className="app-card flex flex-col items-center !p-4">
            <CircularProgress
              value={val as number}
              size={80}
              strokeWidth={5}
              label={labels[key] ?? key}
              color={
                (val as number) >= 70 ? 'hsl(var(--primary))' :
                (val as number) >= 50 ? 'hsl(var(--accent))' :
                'hsl(var(--destructive))'
              }
            />
          </div>
        ))}
      </div>

      {/* Priorities */}
      <div className="app-card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Prioridades (Top 3)</h2>
        </div>
        <div className="space-y-3">
          {profile.prioridadesTop3.map((p: string, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="text-sm font-medium text-foreground">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Report;
