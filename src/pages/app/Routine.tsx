import { useState } from 'react';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Sun, Moon } from 'lucide-react';

const Routine = () => {
  const profile = storage.getProfile();
  const { toast } = useToast();
  const [tab, setTab] = useState<'manha' | 'noite'>('manha');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  if (!profile) return <p className="text-muted-foreground">Complete o quiz primeiro.</p>;

  const steps = tab === 'manha' ? profile.rotina.manha : profile.rotina.noite;
  const isDone = storage.getRoutineStatus(tab === 'manha' ? 'morning' : 'night');

  const toggle = (i: number) => {
    setChecked((prev) => ({ ...prev, [`${tab}-${i}`]: !prev[`${tab}-${i}`] }));
  };

  const markDone = () => {
    storage.saveRoutineStatus(tab === 'manha' ? 'morning' : 'night', true);
    toast({ title: 'Rotina concluída! ✨', description: `Rotina da ${tab === 'manha' ? 'manhã' : 'noite'} marcada.` });
  };

  return (
    <section>
      <h1 className="text-2xl font-bold text-foreground font-['Playfair_Display'] mb-4">Sua rotina</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('manha')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
            tab === 'manha' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border border-border'
          }`}
        >
          <Sun className="w-4 h-4" /> Manhã
        </button>
        <button
          onClick={() => setTab('noite')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
            tab === 'noite' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border border-border'
          }`}
        >
          <Moon className="w-4 h-4" /> Noite
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {steps.map((step: string, i: number) => (
          <label key={i} className="app-card flex items-center gap-3 cursor-pointer !p-4">
            <Checkbox checked={checked[`${tab}-${i}`] ?? false} onCheckedChange={() => toggle(i)} />
            <span className={`text-sm ${checked[`${tab}-${i}`] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {step}
            </span>
          </label>
        ))}
      </div>

      <Button onClick={markDone} disabled={isDone} className="w-full rounded-2xl h-12">
        {isDone ? 'Rotina concluída ✅' : 'Marcar rotina como feita'}
      </Button>
    </section>
  );
};

export default Routine;
