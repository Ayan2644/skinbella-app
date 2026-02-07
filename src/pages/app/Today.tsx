import { storage } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, CheckSquare, Flame, Camera, ChevronRight, Sparkles, Droplets } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRef } from 'react';
import routineMorningImg from '@/assets/routine-morning.jpg';
import streakImg from '@/assets/streak-lifestyle.jpg';
import skincareImg from '@/assets/skincare-products.jpg';

const SmallCircleProgress = ({ value, total }: { value: number; total: number }) => {
  const size = 36;
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / total) * circ;
  return (
    <svg width={size} height={size} className="progress-ring">
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="hsl(var(--primary))" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} className="progress-ring__circle" />
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
  const nightDone = storage.getRoutineStatus('night');
  const fileRef = useRef<HTMLInputElement>(null);

  const checklist = storage.getChecklist() ?? [];
  const doneCount = checklist.filter(i => i.done).length;
  const totalCount = checklist.length || 5;

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
      {/* Greeting with avatar */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[1.6rem] font-bold text-foreground leading-tight">
            Olá, {auth?.name ?? 'linda'} ✨
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Este é seu painel de cuidados diários</p>
        </div>
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent/30 shadow-soft shrink-0">
          <img src={skincareImg} alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Skin Age Hero */}
      {profile && (
        <button onClick={() => navigate('/app/relatorio')} className="w-full text-left">
          <div className="relative overflow-hidden rounded-2xl gradient-warm-rich p-5 shadow-soft border border-border/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/50 mb-1">Idade da pele</p>
                <p className="text-4xl font-bold text-foreground leading-none">{profile.skinAge} <span className="text-base font-normal text-foreground/50">anos</span></p>
              </div>
              <div className="w-20 h-20 rounded-full overflow-hidden border-[3px] border-card/80 shadow-elegant">
                <img src={skincareImg} alt="Skincare" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </button>
      )}

      {/* Checklist do dia */}
      <button onClick={() => navigate('/app/checklist')} className="w-full text-left">
        <div className="app-card flex items-center gap-4 !py-4">
          <div className="relative">
            <SmallCircleProgress value={doneCount} total={totalCount} />
            <CheckSquare className="w-4 h-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transform: 'translate(-50%, -50%) rotate(90deg)' }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Checklist do dia</p>
            <p className="text-xs text-muted-foreground mt-0.5">{doneCount}/{totalCount} tarefas cumpridas</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
        </div>
      </button>

      {/* Rotina Manhã */}
      <button onClick={() => navigate('/app/rotina')} className="w-full text-left">
        <div className="app-card flex items-center gap-4 !py-4 !pr-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sun className="w-4 h-4 text-accent" />
              <p className="text-sm font-semibold text-foreground">Rotina Manhã</p>
            </div>
            {morningDone ? (
              <span className="inline-block text-[10px] font-semibold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">Concluída ✓</span>
            ) : (
              <span className="inline-block text-[10px] font-medium bg-accent/10 text-accent px-2.5 py-0.5 rounded-full">Fazer rotina</span>
            )}
          </div>
          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-card">
            <img src={routineMorningImg} alt="Rotina" className="w-full h-full object-cover" />
          </div>
        </div>
      </button>

      {/* Rotina Noite */}
      <button onClick={() => navigate('/app/rotina')} className="w-full text-left">
        <div className="app-card flex items-center gap-4 !py-4 !pr-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Moon className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Rotina Noite</p>
            </div>
            {nightDone ? (
              <span className="inline-block text-[10px] font-semibold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">Concluída ✓</span>
            ) : (
              <span className="inline-block text-[10px] font-medium bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full">Fazer rotina</span>
            )}
          </div>
          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-card bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <Moon className="w-7 h-7 text-primary/40" />
          </div>
        </div>
      </button>

      {/* Streak */}
      <div className="app-card flex items-center gap-4 !py-4 !pr-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-destructive" />
            <p className="text-sm font-semibold text-foreground">Streak</p>
          </div>
          <p className="text-xs text-muted-foreground">{streak} {streak === 1 ? 'dia seguido' : 'dias seguidos'}</p>
        </div>
        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-card">
          <img src={streakImg} alt="Streak" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Selfie */}
      <button onClick={() => fileRef.current?.click()} className="w-full text-left">
        <div className="app-card flex items-center gap-4 !py-4">
          <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
            <Camera className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Registrar selfie semanal</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
        </div>
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleSelfie} />
    </section>
  );
};

export default Today;
