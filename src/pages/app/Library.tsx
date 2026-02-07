import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, FileText, Sun, Printer, Shield, Apple } from 'lucide-react';

const contents = [
  { title: 'Ebook: Rotina e Cuidados', desc: 'Guia completo de skincare para iniciantes e avançadas.', link: '#', icon: BookOpen, color: 'bg-primary/10 text-primary' },
  { title: 'Guia: Manchas na Pele', desc: 'Entenda os tipos de manchas e como tratar cada uma.', link: '#', icon: FileText, color: 'bg-accent/15 text-accent' },
  { title: 'Guia: Pele Opaca', desc: 'Dicas práticas para recuperar o viço e luminosidade.', link: '#', icon: Sun, color: 'bg-accent/15 text-accent' },
  { title: 'Checklist Imprimível', desc: 'Seu checklist diário para imprimir e acompanhar.', link: '#', icon: Printer, color: 'bg-primary/10 text-primary' },
  { title: 'Guia: Proteção Solar', desc: 'Tudo sobre protetor solar e como escolher o ideal.', link: '#', icon: Shield, color: 'bg-destructive/10 text-destructive' },
  { title: 'Receitas Skin-Friendly', desc: 'Receitas práticas ricas em antioxidantes.', link: '#', icon: Apple, color: 'bg-primary/10 text-primary' },
];

const Library = () => {
  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Biblioteca</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Conteúdos exclusivos para você</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {contents.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="app-card flex flex-col justify-between">
              <div className="mb-4">
                <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{c.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl w-fit text-xs" asChild>
                <a href={c.link} target="_blank" rel="noopener noreferrer">
                  Abrir <ExternalLink className="w-3 h-3 ml-1.5" />
                </a>
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Library;
