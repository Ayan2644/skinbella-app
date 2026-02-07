import { storage } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Sun, Flame, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRef } from 'react';

import cardChecklistBg from '@/assets/card-checklist-bg.jpg';
import cardRotinaBg from '@/assets/card-rotina-bg.jpg';
import streakWomanImg from '@/assets/streak-woman.jpg';

/* Small circular progress ring */
const CircleProgress = ({ value, total }: { value: number; total: number }) => {
  const size = 44;
  const stroke = 3.5;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = total > 0 ? value / total : 0;
  const offset = circ - pct * circ;
  return (
    <svg width={size} height={size} className="progress-ring shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--primary))" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} className="progress-ring__circle" />
    </svg>
  );
};

const Today = () => {
  const profile = storage.getProfile();
  const auth = storage.getAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const streak = storage.getStreak();
  const morningDone = storage.getRoutineStatus('morning');
  const checklist = storage.getChecklist() ?? [];
  const doneCount = checklist.filter(c => c.done).length;
  const totalCount = checklist.length || 4;
  const fileRef = useRef<HTMLInputElement>(null);

  const routineSteps = 4;
  const routineDoneCount = morningDone ? routineSteps : 0;
  const routinePercent = (routineDoneCount / routineSteps) * 100;

  const streakTarget = 4;
  const streakPercent = Math.min(100, (streak / streakTarget) * 100);

  const handleSelfie = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      storage.saveSelfie(ev.target?.result as string);
      toast({ title: 'Selfie salva! 📸', description: 'Seu histórico foi atualizado.' });
    };
    reader.readAsDataURL(f);
  };

  return (
    <section className="space-y-4">
      {/* ── Header ── */}
      <div className="px-1">
        <h1 className="text-[1.6rem] font-bold text-foreground leading-tight">
          Olá, {auth?.name ?? 'linda'}{' '}
          <span className="inline-block">✨</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Este é seu painel de cuidados diários
        </p>
      </div>

      {/* ── Card Idade da Pele ── */}
      {profile && (
        <button
          onClick={() => navigate('/app/relatorio')}
          className="relative w-full overflow-hidden rounded-[20px] text-left active:scale-[0.98] transition-transform duration-150"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--accent)/0.3) 0%, hsl(var(--accent)/0.15) 50%, hsl(var(--accent)/0.08) 100%)',
          }}
        >
          <div className="relative z-10 p-6 pb-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/50 mb-1">
              Idade da pele
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-5xl font-bold text-foreground leading-none">
                {profile.skinAge}
              </span>
              <span className="text-lg font-normal text-foreground/40">
                anos
              </span>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-accent/10" />
          <div className="absolute -right-2 bottom-2 w-16 h-16 rounded-full bg-accent/8" />
          <div className="absolute right-14 -bottom-4 w-10 h-10 rounded-full bg-accent/6" />
        </button>
      )}

      {/* ── Card Checklist do dia ── */}
      <button
        onClick={() => navigate('/app/checklist')}
        className="relative w-full overflow-hidden rounded-[20px] bg-card text-left active:scale-[0.98] transition-transform duration-150 shadow-card border border-border/20"
      >
        <div className="relative z-10 flex items-center gap-4 p-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CheckSquare className="w-4 h-4 text-primary/70" />
              <p className="text-sm font-semibold text-foreground">Checklist do dia</p>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {doneCount}/{totalCount} tarefas cumpridas
            </p>
          </div>
          {/* Circular progress */}
          <div className="relative shrink-0">
            <CircleProgress value={doneCount} total={totalCount} />
          </div>
        </div>
        {/* Decorative background image */}
        <div className="absolute right-0 top-0 bottom-0 w-[40%] overflow-hidden">
          <img src={cardChecklistBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent" />
        </div>
      </button>

      {/* ── Card Rotina Manhã ── */}
      <button
        onClick={() => navigate('/app/rotina')}
        className="relative w-full overflow-hidden rounded-[20px] text-left active:scale-[0.98] transition-transform duration-150 shadow-card border border-border/20"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--accent)/0.12) 0%, hsl(var(--accent)/0.06) 100%)',
        }}
      >
        <div className="relative z-10 p-5 pr-[35%]">
          <div className="flex items-center gap-2 mb-1">
            <Sun className="w-4 h-4 text-accent" />
            <p className="text-sm font-semibold text-foreground">Rotina Manhã</p>
          </div>
          <p className="text-[11px] text-muted-foreground mb-3">Meta diária</p>
          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-primary/10 overflow-hidden">
            <div className="h-full rounded-full bg-primary/70 transition-all duration-500" />
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 -mt-2"
              style={{ width: `${routinePercent}%`, borderRadius: routinePercent > 0 ? '8px' : '0' }}
            />
          </div>
        </div>
        {/* Decorative image */}
        <div className="absolute right-0 top-0 bottom-0 w-[38%] overflow-hidden rounded-r-[20px]">
          <img src={cardRotinaBg} alt="" className="w-full h-full object-cover opacity-40" />
        </div>
      </button>

      {/* ── Card Streak ── */}
      <button
        onClick={() => navigate('/app/checklist')}
        className="relative w-full overflow-hidden rounded-[20px] text-left active:scale-[0.98] transition-transform duration-150 shadow-card border border-border/20"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--accent)/0.12) 0%, hsl(var(--accent)/0.06) 100%)',
        }}
      >
        <div className="relative z-10 p-5 pr-[35%]">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-7 h-7 rounded-full bg-destructive/15 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 text-destructive" />
            </div>
            <p className="text-sm font-semibold text-foreground">Streak</p>
          </div>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            {streak} {streak === 1 ? 'tarefa certa hoje' : 'tarefas certas hoje'}
          </p>
          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-primary/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${streakPercent}%`, borderRadius: streakPercent > 0 ? '8px' : '0' }}
            />
          </div>
        </div>
        {/* Woman image on right */}
        <div className="absolute right-0 top-0 bottom-0 w-[35%] overflow-hidden rounded-r-[20px]">
          <img src={streakWomanImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-card/40" />
        </div>
      </button>

      {/* ── Card Registrar selfie semanal ── */}
      <button
        onClick={() => fileRef.current?.click()}
        className="w-full rounded-[20px] bg-card px-5 py-5 shadow-card border border-border/20 text-left active:scale-[0.98] transition-transform duration-150"
      >
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
            <Camera className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground">Registrar selfie semanal</p>
        </div>
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleSelfie} />
    </section>
  );
};

export default Today;
