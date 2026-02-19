import { storage } from '@/lib/storage';

const Nutrients = () => {
  const profile = storage.getProfile();
  if (!profile) return <p className="text-muted-foreground">Complete o quiz primeiro.</p>;

  return (
    <section>
      <h1 className="text-2xl font-bold text-foreground font-['Playfair_Display'] mb-2">Nutrientes essenciais</h1>
      <p className="text-sm text-muted-foreground mb-6">O que sua pele precisa agora</p>

      <div className="space-y-4">
        {profile.nutrientesTop4.map((n: any, i: number) => (
          <div key={i} className="app-card">
            <h3 className="font-semibold text-foreground mb-1">{n.nome}</h3>
            <p className="text-sm text-muted-foreground mb-2">{n.porque}</p>
            <div className="bg-muted rounded-xl p-3 mb-2">
              <p className="text-xs font-medium text-foreground">💡 {n.acao}</p>
            </div>
            <p className="text-xs text-primary font-medium">Recomendação: {n.recomendacao}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Nutrients;
