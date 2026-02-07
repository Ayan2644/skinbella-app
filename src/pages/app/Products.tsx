import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { ExternalLink, Sparkles, ShoppingBag, Star } from 'lucide-react';

const products = [
  {
    id: 'caps',
    name: 'SkinBella Caps',
    desc: 'Suplemento com colágeno hidrolisado, vitamina C e ácido hialurônico para firmeza e luminosidade.',
    tag: 'Suplemento oral',
    tagColor: 'bg-accent/15 text-accent',
    features: ['Colágeno hidrolisado', 'Vitamina C', 'Ácido hialurônico'],
    link: '#',
  },
  {
    id: 'serum',
    name: 'SkinBella Sérum',
    desc: 'Sérum facial com vitamina C, niacinamida e ácido hialurônico para uniformizar e hidratar.',
    tag: 'Uso tópico',
    tagColor: 'bg-primary/10 text-primary',
    features: ['Vitamina C', 'Niacinamida', 'Ácido hialurônico'],
    link: '#',
  },
];

const Products = () => {
  const profile = storage.getProfile();

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Produtos</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Recomendados para o seu perfil</p>
      </div>

      {profile && (
        <div className="app-card gradient-porcelain !p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-accent-foreground text-sm">Recomendado para você</h3>
              <p className="text-xs text-accent-foreground/70 mt-0.5">
                Baseado nas suas prioridades: {profile.prioridadesTop3.slice(0, 2).join(', ')}.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {products.map((p) => (
          <div key={p.id} className="app-card space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className={`inline-block text-[11px] font-semibold ${p.tagColor} px-2.5 py-1 rounded-full mb-2`}>
                  {p.tag}
                </span>
                <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <ShoppingBag className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {p.features.map((f, i) => (
                <span key={i} className="text-[11px] font-medium bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                  {f}
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" className="rounded-xl flex-1" asChild>
                <a href={p.link}>Saiba mais</a>
              </Button>
              <Button size="sm" className="rounded-xl flex-1" asChild>
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
