import { storage } from '@/lib/storage';

const Diet = () => {
  const profile = storage.getProfile();
  if (!profile) return <p className="text-muted-foreground">Complete o quiz primeiro.</p>;

  return (
    <section>
      <h1 className="text-2xl font-bold text-foreground font-['Playfair_Display'] mb-6">Dieta para sua pele</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-primary mb-3">✅ Priorizar</h2>
          <div className="space-y-2">
            {profile.dieta.priorizar.map((item: string, i: number) => (
              <div key={i} className="app-card !p-3">
                <p className="text-sm text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-destructive mb-3">⛔ Reduzir</h2>
          <div className="space-y-2">
            {profile.dieta.reduzir.map((item: string, i: number) => (
              <div key={i} className="app-card !p-3">
                <p className="text-sm text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground font-['Playfair_Display'] mb-3">🍽️ Plano simples de 1 dia</h2>
          <div className="space-y-2">
            {profile.dieta.plano.map((item: string, i: number) => (
              <div key={i} className="app-card !p-3">
                <p className="text-sm text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Diet;
