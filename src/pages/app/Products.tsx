import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { ExternalLink, Sparkles } from 'lucide-react';

const products = [
  {
    id: 'caps',
    name: 'SkinBella Caps',
    desc: 'Suplemento com colágeno hidrolisado, vitamina C e ácido hialurônico para firmeza e luminosidade.',
    tag: 'Suplemento oral',
    link: '#',
  },
  {
    id: 'serum',
    name: 'SkinBella Sérum',
    desc: 'Sérum facial com vitamina C, niacinamida e ácido hialurônico para uniformizar e hidratar.',
    tag: 'Uso tópico',
    link: '#',
  },
];

const Products = () => {
  const profile = storage.getProfile();

  return (
    <section>
      <h1 className="text-2xl font-bold text-foreground font-['Playfair_Display'] mb-2">Produtos</h1>
      <p className="text-sm text-muted-foreground mb-6">Recomendados para o seu perfil</p>

      {profile && (
        <div className="app-card gradient-porcelain mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <h3 className="font-semibold text-accent-foreground text-sm">Recomendado para você</h3>
          </div>
          <p className="text-xs text-accent-foreground/80">
            Com base nas suas prioridades: {profile.prioridadesTop3.join(', ')}.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {products.map((p) => (
          <div key={p.id} className="app-card">
            <span className="inline-block text-xs font-medium bg-secondary text-secondary-foreground px-2.5 py-1 rounded-xl mb-3">
              {p.tag}
            </span>
            <h3 className="text-lg font-semibold text-foreground mb-1">{p.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{p.desc}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-xl" asChild>
                <a href={p.link}>Saiba mais</a>
              </Button>
              <Button size="sm" className="rounded-xl" asChild>
                <a href={p.link} target="_blank" rel="noopener noreferrer">
                  Comprar <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;
