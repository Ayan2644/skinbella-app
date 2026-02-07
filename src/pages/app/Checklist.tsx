import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Flame } from 'lucide-react';

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
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-['Playfair_Display']">Checklist diário</h1>
          <p className="text-sm text-muted-foreground">Marque suas tarefas de hoje</p>
        </div>
        <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-2xl">
          <Flame className="w-4 h-4 text-destructive" />
          <span className="text-sm font-bold text-foreground">{streak}</span>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <label key={item.id} className="app-card flex items-center gap-3 cursor-pointer !p-4">
            <Checkbox checked={item.done} onCheckedChange={() => toggle(item.id)} />
            <span className={`text-sm ${item.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {item.label}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
};

export default Checklist;
