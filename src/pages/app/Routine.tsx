import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Sun, Moon } from 'lucide-react';

const Routine = () => {
  const profile = storage.getProfile();
  const { toast } = useToast();
  const [tab, setTab] = useState<'manha' | 'noite'>('manha');
  const storageType = tab === 'manha' ? 'morning' : 'night';

  // Carregar passos persistidos do storage
  const [checked, setChecked] = useState<Record<string, boolean>>(
    storage.getRoutineSteps(storageType)
  );

  // Quando muda de tab, recarregar do storage
  useEffect(() => {
    const type = tab === 'manha' ? 'morning' : 'night';
    setChecked(storage.getRoutineSteps(type));
  }, [tab]);

  if (!profile) {
    return <p className="text-muted-foreground">Complete o quiz primeiro.</p>;
  }

  const steps = tab === 'manha' ? profile.rotina.manha : profile.rotina.noite;
  const isDone = storage.getRoutineStatus(storageType);

  const toggle = (i: number) => {
    const key = `${tab}-${i}`;
    const newChecked = { ...checked, [key]: !checked[key] };
    setChecked(newChecked);
    // Persistir no storage
    const type = tab === 'manha' ? 'morning' : 'night';
    storage.saveRoutineSteps(type, newChecked);
  };

  const markDone = () => {
    const type = tab === 'manha' ? 'morning' : 'night';
    storage.saveRoutineStatus(type, true);
    toast({
      title: 'Rotina concluída! ✨',
      description: `Rotina da ${tab === 'manha' ? 'manhã' : 'noite'} marcada.`,
    });
  };

  const checkedCount = steps.filter((_: string, i: number) => checked[`${tab}-${i}`]).length;
  const progressPercent = steps.length > 0 ? (checkedCount / steps.length) * 100 : 0;

  return (
    <section>
      <h1 className="text-2xl font-bold text-foreground font-['Playfair_Display'] mb-4">
        Sua rotina
      </h1>

      {/* Tabs manhã/noite */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('manha')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
            tab === 'manha'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground border border-border'
          }`}
        >
          <Sun className="w-4 h-4" /> Manhã
        </button>
        <button
          onClick={() => setTab('noite')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
            tab === 'noite'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground border border-border'
          }`}
        >
          <Moon className="w-4 h-4" /> Noite
        </button>
      </div>

      {/* Barra de progresso */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-muted-foreground">Progresso</p>
          <p className="text-xs font-medium text-primary">{checkedCount}/{steps.length}</p>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3 mb-6">
        {steps.map((step: string, i: number) => (
          <label key={i} className="app-card flex items-center gap-3 cursor-pointer !p-4">
            <Checkbox
              checked={checked[`${tab}-${i}`] ?? false}
              onCheckedChange={() => toggle(i)}
            />
            <span
              className={`text-sm transition-all ${
                checked[`${tab}-${i}`]
                  ? 'line-through text-muted-foreground'
                  : 'text-foreground'
              }`}
            >
              {step}
            </span>
          </label>
        ))}
      </div>

      {/* Botão marcar como feita */}
      <Button
        onClick={markDone}
        disabled={isDone}
        className="w-full rounded-2xl h-12"
      >
        {isDone ? 'Rotina concluída ✅' : 'Marcar rotina como feita'}
      </Button>
    </section>
  );
};

export default Routine;
