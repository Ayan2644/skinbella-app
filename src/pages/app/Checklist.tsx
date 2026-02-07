import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Flame, CheckCircle2, Circle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const defaultItems = [
  { id: 'water', label: 'Beber 2L de água', done: false },
  { id: 'sunscreen', label: 'Aplicar protetor solar', done: false },
  { id: 'skincare-am', label: 'Rotina da manhã', done: false },
  { id: 'skincare-pm', label: 'Rotina da noite', done: false },
  { id: 'sleep', label: 'Dormir 7h+', done: false },
];

const Checklist = () => {
  const { toast } = useToast();
  const [items, setItems] = useState(storage.getChecklist() ?? defaultItems);
  const streak = storage.getStreak();

  const doneCount = items.filter(i => i.done).length;
  const progressPercent = (doneCount / items.length) * 100;

  useEffect(() => {
    storage.saveChecklist(items);
    const allDone = items.every((i) => i.done);
    if (allDone && items.length > 0) {
      storage.saveStreak(streak + 1);
      toast({ title: 'Checklist completo! 🔥', description: `Streak: ${streak + 1} dias seguidos.` });
    }
  }, [items]);

  const toggle = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  };

  return (
    <section className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Checklist diário</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Marque suas tarefas de hoje</p>
        </div>
        <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-2 rounded-2xl">
          <Flame className="w-4 h-4" />
          <span className="text-sm font-bold">{streak}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="app-card !p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Progresso do dia</span>
          <span className="text-xs font-semibold text-primary">{doneCount}/{items.length} tarefas</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map((item) => (
          <label
            key={item.id}
            className={`app-card flex items-center gap-4 cursor-pointer !p-4 transition-all duration-200 ${
              item.done ? 'bg-primary/5 border-primary/20' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
              item.done ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              {item.done ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
            </div>
            <span className={`text-sm font-medium flex-1 transition-all duration-200 ${
              item.done ? 'line-through text-muted-foreground' : 'text-foreground'
            }`}>
              {item.label}
            </span>
            <Checkbox checked={item.done} onCheckedChange={() => toggle(item.id)} className="shrink-0" />
          </label>
        ))}
      </div>
    </section>
  );
};

export default Checklist;
