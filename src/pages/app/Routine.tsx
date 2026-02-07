import { useState } from 'react';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Sun, Moon, Sparkles, Check, Leaf, ShieldCheck, Droplets, Eye, ChevronRight } from 'lucide-react';
import routineProductsImg from '@/assets/routine-products.jpg';

const stepMeta = [
  { icon: Leaf, color: 'hsl(var(--primary))' },
  { icon: Sparkles, color: 'hsl(var(--accent))' },
  { icon: Droplets, color: 'hsl(var(--primary))' },
  { icon: ShieldCheck, color: 'hsl(var(--accent))' },
  { icon: Eye, color: 'hsl(var(--primary))' },
  { icon: Moon, color: 'hsl(var(--accent))' },
];

const Routine = () => {
  const profile = storage.getProfile();
  const { toast } = useToast();
  const [tab, setTab] = useState<'manha' | 'noite'>('manha');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  if (!profile) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Sparkles className="w-10 h-10 text-accent mb-4" />
      <p className="text-lg font-semibold text-foreground mb-1">Rotina indisponível</p>
      <p className="text-sm text-muted-foreground">Complete o quiz primeiro.</p>
    </div>
  );

  const steps = tab === 'manha' ? profile.rotina.manha : profile.rotina.noite;
  const isDone = storage.getRoutineStatus(tab === 'manha' ? 'morning' : 'night');
  const checkedCount = steps.filter((_: string, i: number) => checked[`${tab}-${i}`]).length;
  const allChecked = checkedCount === steps.length;

  const toggle = (i: number) => {
    setChecked((prev) => ({ ...prev, [`${tab}-${i}`]: !prev[`${tab}-${i}`] }));
  };

  const markDone = () => {
    storage.saveRoutineStatus(tab === 'manha' ? 'morning' : 'night', true);
    toast({ title: 'Rotina concluída! ✨', description: `Rotina da ${tab === 'manha' ? 'manhã' : 'noite'} marcada.` });
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Sua rotina</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Plano personalizado para sua pele
        </p>
      </div>

      {/* Tab selector — pill style */}
      <div className="flex gap-2 p-1.5 bg-muted/60 rounded-2xl">
        <button
          onClick={() => setTab('manha')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
            tab === 'manha'
              ? 'bg-card text-primary shadow-card'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sun className="w-4 h-4" /> Manhã
        </button>
        <button
          onClick={() => setTab('noite')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
            tab === 'noite'
              ? 'bg-card text-primary shadow-card'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Moon className="w-4 h-4" /> Noite
        </button>
      </div>

      {/* Step progress dots */}
      <div className="flex items-center gap-2 px-1">
        {steps.map((_: string, i: number) => {
          const done = checked[`${tab}-${i}`] ?? false;
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`relative flex items-center justify-center transition-all duration-300 ${
                done
                  ? 'w-9 h-9 rounded-full bg-primary text-primary-foreground shadow-soft'
                  : 'w-9 h-9 rounded-full bg-muted text-muted-foreground'
              }`}
            >
              {done ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-xs font-semibold">{i + 1}</span>
              )}
            </button>
          );
        })}
        <div className="flex-1" />
        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
          {checkedCount}/{steps.length}
        </span>
      </div>

      {/* Steps list */}
      <div className="space-y-3">
        {steps.map((step: string, i: number) => {
          const isChecked = checked[`${tab}-${i}`] ?? false;
          const meta = stepMeta[i] ?? stepMeta[0];
          const Icon = meta.icon;

          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`w-full text-left app-card flex items-start gap-4 !p-4 transition-all duration-300 ${
                isChecked ? 'bg-primary/5 border-primary/20' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isChecked
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'bg-muted/80'
                }`}
              >
                {isChecked ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" style={{ color: meta.color }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold transition-all duration-200 ${
                  isChecked ? 'text-primary line-through opacity-70' : 'text-foreground'
                }`}>
                  {step.split(' ').slice(0, 4).join(' ')}
                </p>
                <p className={`text-xs mt-0.5 transition-all duration-200 ${
                  isChecked ? 'text-muted-foreground/50 line-through' : 'text-muted-foreground'
                }`}>
                  {step}
                </p>
              </div>
              <ChevronRight className={`w-4 h-4 mt-1 shrink-0 transition-all duration-200 ${
                isChecked ? 'text-primary/40' : 'text-muted-foreground/40'
              }`} />
            </button>
          );
        })}
      </div>

      {/* Product showcase card */}
      <div className="relative overflow-hidden rounded-2xl shadow-card border border-border/20">
        <img
          src={routineProductsImg}
          alt="Produtos recomendados"
          className="w-full h-44 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="font-bold text-white text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
            SkinBella Caps
          </p>
          <p className="text-white/80 text-xs mt-0.5">
            Suplemento com ativos para potencializar sua rotina.
          </p>
          <div className="flex gap-2 mt-3">
            <button className="text-xs font-medium text-white/90 border border-white/30 rounded-full px-4 py-1.5 hover:bg-white/10 transition-colors">
              Saiba mais
            </button>
            <button className="text-xs font-semibold text-foreground bg-white rounded-full px-4 py-1.5 hover:bg-white/90 transition-colors flex items-center gap-1">
              Comprar <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Button
        onClick={markDone}
        disabled={isDone}
        className={`w-full rounded-2xl h-14 text-base font-semibold shadow-elegant transition-all duration-300 ${
          allChecked && !isDone ? 'animate-pulse' : ''
        }`}
        size="lg"
      >
        {isDone ? (
          <>
            <Check className="w-5 h-5 mr-2" />
            Rotina concluída
          </>
        ) : (
          'Marcar rotina como feita'
        )}
      </Button>
    </section>
  );
};

export default Routine;
