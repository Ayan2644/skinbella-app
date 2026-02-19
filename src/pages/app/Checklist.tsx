import { useState, useEffect, useRef } from 'react';
import { storage } from '@/lib/storage';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Flame } from 'lucide-react';

const Checklist = () => {
  const { toast } = useToast();
  const [items, setItems] = useState(storage.getChecklist());
  const [streak, setStreak] = useState(storage.getStreak());
  const hasCompletedRef = useRef(storage.getStreakData().completedToday);

  useEffect(() => {
    // Salvar checklist com data de hoje
    storage.saveChecklist(items);

    const allDone = items.length > 0 && items.every((i) => i.done);

    if (allDone && !hasCompletedRef.current) {
      // Incrementar streak apenas 1x por dia
      const didIncrement = storage.incrementStreakIfNewDay();
      if (didIncrement) {
        hasCompletedRef.current = true;
        const newStreak = storage.getStreak();
        setStreak(newStreak);
        toast({
          title: 'Checklist completo! 🔥',
          description: `Streak: ${newStreak} ${newStreak === 1 ? 'dia seguido' : 'dias seguidos'}!`,
        });
      }
    }
  }, [items]);

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i))
    );
  };

  const doneCount = items.filter((i) => i.done).length;
  const today = new Date();
  const dayName = today.toLocaleDateString('pt-BR', { weekday: 'long' });
  const dayNumber = today.getDate();
  const monthName = today.toLocaleDateString('pt-BR', { month: 'long' });

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-['Playfair_Display']">
            Checklist diário
          </h1>
          <p className="text-sm text-muted-foreground capitalize">
            {dayName}, {dayNumber} de {monthName}
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-2xl">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-bold text-foreground">{streak}</span>
        </div>
      </div>

      {/* Barra de progresso do dia */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-muted-foreground">Progresso do dia</p>
          <p className="text-xs font-medium text-primary">{doneCount}/{items.length}</p>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${items.length > 0 ? (doneCount / items.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <label
            key={item.id}
            className="app-card flex items-center gap-3 cursor-pointer !p-4"
          >
            <Checkbox
              checked={item.done}
              onCheckedChange={() => toggle(item.id)}
            />
            <span
              className={`text-sm transition-all ${
                item.done
                  ? 'line-through text-muted-foreground'
                  : 'text-foreground'
              }`}
            >
              {item.label}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
};

export default Checklist;
