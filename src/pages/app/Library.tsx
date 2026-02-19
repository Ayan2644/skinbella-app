import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const contents = [
  { title: 'Ebook: Rotina e Cuidados', desc: 'Guia completo de skincare para iniciantes e avançadas.', link: '#' },
  { title: 'Guia: Manchas na Pele', desc: 'Entenda os tipos de manchas e como tratar cada uma.', link: '#' },
  { title: 'Guia: Pele Opaca', desc: 'Dicas práticas para recuperar o viço e luminosidade.', link: '#' },
  { title: 'Checklist Imprimível', desc: 'Seu checklist diário para imprimir e acompanhar.', link: '#' },
  { title: 'Guia: Proteção Solar', desc: 'Tudo sobre protetor solar e como escolher o ideal.', link: '#' },
  { title: 'Receitas Skin-Friendly', desc: 'Receitas práticas ricas em antioxidantes.', link: '#' },
];

const Library = () => {
  return (
    <section>
      <h1 className="text-2xl font-bold text-foreground font-['Playfair_Display'] mb-2">Biblioteca</h1>
      <p className="text-sm text-muted-foreground mb-6">Conteúdos exclusivos para você</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contents.map((c, i) => (
          <div key={i} className="app-card flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground mb-1">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.desc}</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl w-fit" asChild>
              <a href={c.link} target="_blank" rel="noopener noreferrer">
                Abrir <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </a>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Library;
