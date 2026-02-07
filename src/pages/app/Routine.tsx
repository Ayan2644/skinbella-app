import { useState } from 'react';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Sun, Moon, Sparkles, Clock, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const stepIcons = ['🧴', '✨', '💧', '☀️', '🌙', '👁️'];

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
  const progressPercent = (checkedCount / steps.length) * 100;

  const toggle = (i: number) => {
    setChecked((prev) => ({ ...prev, [`${tab}-${i}`]: !prev[`${tab}-${i}`] }));
  };

  const markDone = () => {
    storage.saveRoutineStatus(tab === 'manha' ? 'morning' : 'night', true);
    toast({ title: 'Rotina concluída! ✨', description: `Rotina da ${tab === 'manha' ? 'manhã' : 'noite'} marcada.` });
  };

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Sua rotina</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Siga os passos para uma pele perfeita</p>
      </div>

      {/* Tab selector */}
      <div className="flex gap-2 p-1 bg-muted/60 rounded-2xl">
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

      {/* Progress */}
      <div className="flex items-center gap-3">
        <Progress value={progressPercent} className="h-2 flex-1" />
        <span className="text-xs font-medium text-muted-foreground shrink-0">{checkedCount}/{steps.length}</span>
      </div>

      {/* Steps */}
      <div className="space-y-2.5">
        {steps.map((step: string, i: number) => {
          const isChecked = checked[`${tab}-${i}`] ?? false;
          return (
            <label key={i} className={`app-card flex items-center gap-4 cursor-pointer !p-4 transition-all duration-200 ${isChecked ? 'bg-primary/5 border-primary/20' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                isChecked ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {isChecked ? <Check className="w-4 h-4" /> : <span className="text-sm">{stepIcons[i] ?? '💆'}</span>}
              </div>
              <div className="flex-1">
                <span className={`text-sm font-medium transition-all duration-200 ${isChecked ? 'text-primary line-through' : 'text-foreground'}`}>
                  Passo {i + 1}
                </span>
                <p className={`text-xs mt-0.5 transition-all duration-200 ${isChecked ? 'text-muted-foreground line-through' : 'text-muted-foreground'}`}>
                  {step}
                </p>
              </div>
              <Checkbox checked={isChecked} onCheckedChange={() => toggle(i)} className="shrink-0" />
            </label>
          );
        })}
      </div>

      {/* CTA */}
      <Button
        onClick={markDone}
        disabled={isDone}
        className="w-full rounded-2xl h-14 text-base font-semibold shadow-elegant"
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
