import { storage } from '@/lib/storage';

const labels: Record<string, string> = {
  manchas: 'Manchas', textura: 'Textura', elasticidade: 'Elasticidade',
  poros: 'Poros', oleosidade: 'Oleosidade', hidratacao: 'Hidratação',
};

const Report = () => {
  const profile = storage.getProfile();
  if (!profile) return <p className="text-muted-foreground">Faça o quiz para ver seu relatório.</p>;

  return (
    <section>
      <h1 className="text-2xl font-bold text-foreground font-['Playfair_Display'] mb-6">Seu diagnóstico de pele</h1>

      <div className="app-card gradient-porcelain text-center mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-foreground/70 mb-1">Idade estimada da pele</p>
        <p className="text-5xl font-bold text-accent-foreground font-['Playfair_Display']">{profile.skinAge}</p>
        <p className="text-sm text-accent-foreground/70 mt-1">anos</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {Object.entries(profile.scores).map(([key, val]) => (
          <div key={key} className="metric-card text-center">
            <p className="text-2xl font-bold text-primary">{val as number}%</p>
            <p className="text-xs text-muted-foreground mt-1">{labels[key] ?? key}</p>
            <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${val}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="app-card">
        <h2 className="text-lg font-semibold text-foreground font-['Playfair_Display'] mb-3">Prioridades (Top 3)</h2>
        <ol className="space-y-2">
          {profile.prioridadesTop3.map((p: string, i: number) => (
            <li key={i} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <span className="text-sm text-foreground">{p}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Report;
