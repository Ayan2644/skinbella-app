import { useState, useEffect, useRef } from 'react';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { ComboModal } from '@/components/ComboModal';
import { useComboModal } from '@/hooks/useComboModal';

/* ─── Helpers de emoji ─── */
function getItemEmoji(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('água') || l.includes('agua'))           return '💧';
  if (l.includes('solar') || l.includes('protetor'))      return '☀️';
  if (l.includes('manhã') || l.includes('manha'))         return '🌅';
  if (l.includes('noite'))                                return '🌙';
  if (l.includes('dormir') || l.includes('hora'))         return '😴';
  if (l.includes('açúcar') || l.includes('aliment'))      return '🥗';
  if (l.includes('exerc') || l.includes('atividade'))     return '🏃';
  if (l.includes('medic') || l.includes('suplemento'))    return '💊';
  if (l.includes('hidrat'))                               return '🧴';
  return '✅';
}

function getCleanLabel(label: string): string {
  return label
    .replace(/💧|☀️|🌅|🌙|😴|🥗|🏃|💊|🧴|✅/g, '')
    .trim();
}

/* ─── Componente principal ─── */
const Checklist = () => {
  const { toast } = useToast();

  const [items, setItems] = useState(() => {
    const data = storage.getChecklist();
    return Array.isArray(data) ? data : [];
  });
  const [streak, setStreak]       = useState(storage.getStreak());
  const [ringActive, setRingActive] = useState(false);
  const hasCompletedRef            = useRef(storage.getStreakData().completedToday);

  /* Ativa o anel de progresso ao montar */
  useEffect(() => {
    const t = setTimeout(() => setRingActive(true), 350);
    return () => clearTimeout(t);
  }, []);

  /* Salva + verifica streak */
  useEffect(() => {
    storage.saveChecklist(items);
    const allDone = items.length > 0 && items.every(i => i.done);
    if (allDone && !hasCompletedRef.current) {
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
    setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  };

  /* Dados de progresso */
  const doneCount   = items.filter(i => i.done).length;
  const totalCount  = items.length;
  const percent     = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const ringDeg     = ringActive ? percent * 3.6 : 0;
  const allDone     = totalCount > 0 && doneCount === totalCount;

  /* Data */
  const today     = new Date();
  const dayName   = today.toLocaleDateString('pt-BR', { weekday: 'long' });
  const dayNumber = today.getDate();
  const monthName = today.toLocaleDateString('pt-BR', { month: 'long' });

  const combo = useComboModal('checklist', 6000);

  return (
    <>
    <ComboModal open={combo.open} onClose={combo.close} />
    <section className="space-y-4 pb-8">

      {/* ── Header: data + streak ── */}
      <div
        className="flex items-start justify-between animate-fade-in"
        style={{ animationFillMode: 'both' }}
      >
        <div>
          <p className="text-[12px] capitalize" style={{ color: '#8C7B6B' }}>
            {dayName}
          </p>
          <h1
            className="text-[26px] font-semibold leading-tight font-['Playfair_Display']"
            style={{ color: '#2C1F14' }}
          >
            {dayNumber} de {monthName}
          </h1>
        </div>

        {/* Streak pill */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-2xl mt-1"
          style={{
            background: 'linear-gradient(135deg, #FDF0C8 0%, #F5CF80 100%)',
            border: '1px solid #F0D8A8',
            boxShadow: '0 4px 12px rgba(200,145,63,0.2)',
          }}
        >
          <span className="text-lg select-none">🔥</span>
          <span
            className="text-[18px] font-bold leading-none font-['Playfair_Display']"
            style={{ color: '#7A5020' }}
          >
            {streak}
          </span>
          <span className="text-[11px] font-medium" style={{ color: '#9A7040' }}>
            {streak === 1 ? 'dia' : 'dias'}
          </span>
        </div>
      </div>

      {/* ── Card Hero de Progresso ── */}
      <div
        className="animate-fade-in-up"
        style={{
          borderRadius: 28,
          background: 'linear-gradient(135deg, #f8f3ec 0%, #ede5d8 55%, #e6dccf 100%)',
          border: '1px solid rgba(255,255,255,0.85)',
          boxShadow: '0 10px 30px rgba(46,41,36,0.12)',
          animationDelay: '60ms',
          animationFillMode: 'both',
        }}
      >
        <div className="px-6 py-6 flex flex-col items-center">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4"
            style={{ color: '#8C7B6B' }}
          >
            Progresso do dia
          </p>

          {/* Anel conic-gradient */}
          <div
            className="flex items-center justify-center mb-4"
            style={{
              width: 128,
              height: 128,
              borderRadius: '50%',
              background: `conic-gradient(${allDone ? '#4A5C3A' : '#8fa48f'} ${ringDeg}deg, #e5dfd5 0deg)`,
              transition: 'background 0.7s cubic-bezier(0.4,0,0.2,1)',
              boxShadow: '0 8px 24px rgba(46,41,36,0.15)',
            }}
          >
            <div
              className="flex flex-col items-center justify-center"
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: '#fbf8f3',
                border: '2px solid rgba(255,255,255,0.9)',
              }}
            >
              {allDone ? (
                <span className="text-[32px] leading-none">✅</span>
              ) : (
                <>
                  <span
                    className="text-[28px] font-bold leading-none font-['Playfair_Display']"
                    style={{ color: '#2C1F14' }}
                  >
                    {doneCount}/{totalCount}
                  </span>
                  <span className="text-[11px] mt-0.5" style={{ color: '#8C7B6B' }}>
                    tarefas
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Barra linear */}
          <div className="w-full">
            <div className="flex justify-between mb-1.5">
              <span className="text-[11px]" style={{ color: '#8C7B6B' }}>
                {allDone ? 'Todas concluídas!' : `${doneCount} de ${totalCount} concluídas`}
              </span>
              <span className="text-[11px] font-bold" style={{ color: '#4A5C3A' }}>
                {percent}%
              </span>
            </div>
            <div
              className="w-full rounded-full overflow-hidden"
              style={{ height: 8, background: 'rgba(0,0,0,0.08)' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: ringActive ? `${percent}%` : '0%',
                  background: allDone
                    ? '#4A5C3A'
                    : 'linear-gradient(90deg, #8fa48f 0%, #4A5C3A 100%)',
                  transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1) 0.4s',
                  minWidth: ringActive && percent > 0 ? 8 : 0,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Separador ── */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: '#EDE8E1' }} />
        <span
          className="text-[10px] font-bold uppercase tracking-[0.22em] shrink-0"
          style={{ color: '#8C7B6B' }}
        >
          Suas tarefas de hoje
        </span>
        <div className="h-px flex-1" style={{ background: '#EDE8E1' }} />
      </div>

      {/* ── Items ── */}
      <div className="space-y-3">
        {items.map((item, idx) => {
          const emoji      = getItemEmoji(item.label);
          const cleanLabel = getCleanLabel(item.label);

          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className="w-full text-left active:scale-[0.98] transition-all duration-200 animate-fade-in-up"
              style={{
                borderRadius: 20,
                background: item.done ? '#E8EFDF' : '#FFFFFF',
                border: `1px solid ${item.done ? '#d0e4c0' : '#EDE8E1'}`,
                boxShadow: item.done
                  ? '0 4px 12px rgba(74,92,58,0.10)'
                  : '0 6px 18px rgba(46,41,36,0.08)',
                transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                animationDelay: `${120 + idx * 60}ms`,
                animationFillMode: 'both',
              }}
            >
              <div className="flex items-center gap-4 px-4 py-4">
                {/* Ícone emoji */}
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-xl"
                  style={{
                    background: item.done ? 'rgba(74,92,58,0.15)' : '#F7F3EE',
                    border: `1px solid ${item.done ? '#c0d8a8' : '#EDE8E1'}`,
                    transition: 'background 0.3s ease',
                  }}
                >
                  {item.done ? '✓' : emoji}
                </div>

                {/* Texto */}
                <span
                  className="flex-1 text-[14px] font-medium leading-snug"
                  style={{
                    color: item.done ? '#8C7B6B' : '#2C1F14',
                    textDecoration: item.done ? 'line-through' : 'none',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {cleanLabel || item.label}
                </span>

                {/* Pill de status */}
                {item.done ? (
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0"
                    style={{
                      background: '#4A5C3A',
                      color: '#FFFFFF',
                    }}
                  >
                    ✓ feito
                  </span>
                ) : (
                  <div
                    className="w-6 h-6 rounded-full shrink-0"
                    style={{
                      border: '2px solid #D0C8BE',
                    }}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Banner de celebração ── */}
      {allDone && (
        <div
          className="animate-fade-in-up"
          style={{
            borderRadius: 24,
            background: 'linear-gradient(135deg, #FDF0C8 0%, #F5CF80 60%, #EDB84A 100%)',
            border: '1px solid #F0D8A8',
            boxShadow: '0 10px 28px rgba(200,145,63,0.25)',
            animationFillMode: 'both',
          }}
        >
          <div className="px-6 py-5 text-center">
            <p className="text-[28px] mb-1">🎉</p>
            <h2
              className="text-[20px] font-semibold font-['Playfair_Display'] mb-1"
              style={{ color: '#2C1F14' }}
            >
              Dia completo!
            </h2>
            <p className="text-[13px] mb-3" style={{ color: '#7A5020' }}>
              Você completou todas as tarefas de hoje
            </p>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: 'rgba(44,31,20,0.12)' }}
            >
              <span className="text-base">🔥</span>
              <span className="text-[13px] font-bold" style={{ color: '#2C1F14' }}>
                Streak: {streak} {streak === 1 ? 'dia' : 'dias'} seguidos
              </span>
            </div>
            <p className="text-[12px] mt-3" style={{ color: '#7A5020' }}>
              Sua pele agradece 💚
            </p>
          </div>
        </div>
      )}

    </section>
    </>
  );
};

export default Checklist;
