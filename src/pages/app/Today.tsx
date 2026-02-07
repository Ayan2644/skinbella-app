import { storage } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, CheckSquare, Flame, Camera, ChevronRight, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRef } from 'react';
import skincareBowlImg from '@/assets/skincare-bowl.jpg';
import rotinaManha2Img from '@/assets/rotina-manha-2.jpg';
import womanPortraitImg from '@/assets/woman-portrait.jpg';
import avatarImg from '@/assets/avatar-woman.jpg';

/* Small circular progress for checklist */
const CircleProgress = ({ value, total }: { value: number; total: number }) => {
  const size = 40;
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

/* Geometric diamond pattern SVG overlay */
const DiamondPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="diamonds" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#diamonds)" />
  </svg>
);

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
  const totalCount = checklist.length || 4;
  const streakPct = Math.min((streak / 7) * 100, 100);

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
      {/* ── Greeting ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[1.6rem] font-bold text-foreground leading-tight">
            Olá, {auth?.name ?? 'Júlia'} <span className="inline-block">✨</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Este é seu painel de cuidados diários</p>
        </div>
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-accent/30 shadow-soft shrink-0">
          <img src={avatarImg} alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* ── Idade da Pele ── */}
      {profile && (
        <button onClick={() => navigate('/app/relatorio')} className="w-full text-left group">
          <div className="relative overflow-hidden rounded-2xl gradient-warm-rich p-6 shadow-soft border border-border/10">
            <DiamondPattern />
            <div className="relative z-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/50 mb-1">
                Idade <span className="text-foreground/70">DA PELE</span>
              </p>
              <p className="text-5xl font-bold text-foreground leading-none mt-1">
                {profile.skinAge} <span className="text-lg font-normal text-foreground/40">anos</span>
              </p>
            </div>
          </div>
        </button>
      )}

      {/* ── Checklist do dia ── */}
      <button onClick={() => navigate('/app/checklist')} className="w-full text-left group">
        <div className="app-card flex items-center gap-4 !py-4 !px-5">
          <CheckSquare className="w-5 h-5 text-primary/70 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Checklist do dia</p>
            <p className="text-xs text-muted-foreground mt-0.5">{doneCount}/{totalCount} tarefas cumpridas</p>
          </div>
          <CircleProgress value={doneCount} total={totalCount} />
        </div>
      </button>

      {/* ── Rotina Manhã ── */}
      <button onClick={() => navigate('/app/rotina')} className="w-full text-left group">
        <div className="relative overflow-hidden rounded-2xl shadow-card border border-border/20 transition-all duration-300 group-hover:shadow-soft gradient-warm-rich flex items-center gap-3 py-4 px-5 pr-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-accent" />
              <p className="text-sm font-semibold text-foreground">Rotina Manhã</p>
            </div>
            <p className="text-[11px] text-muted-foreground mb-2">Meta diária</p>
            <div className="w-full h-2 rounded-full bg-primary/15 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: morningDone ? '100%' : '30%' }}
              />
            </div>
          </div>
          <div className="w-[68px] h-[68px] rounded-2xl overflow-hidden shrink-0">
            <img src={skincareBowlImg} alt="Rotina" className="w-full h-full object-cover" />
          </div>
        </div>
      </button>

      {/* ── Streak ── */}
      <button onClick={() => navigate('/app/checklist')} className="w-full text-left group">
        <div className="app-card flex items-center gap-4 !py-4 !px-5 !pr-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <Flame className="w-4 h-4 text-destructive" />
              <p className="text-sm font-semibold text-foreground">Streak</p>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {streak} {streak === 1 ? 'dia seguido' : 'dias seguidos'}
            </p>
            {/* Progress bar */}
            <div className="w-full h-2.5 rounded-full bg-primary/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${streakPct}%` }}
              />
            </div>
          </div>
          <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden shrink-0 shadow-card">
            <img src={womanPortraitImg} alt="Streak" className="w-full h-full object-cover" />
          </div>
        </div>
      </button>

      {/* ── Registrar selfie semanal ── */}
      <button onClick={() => fileRef.current?.click()} className="w-full text-left group">
        <div className="app-card flex items-center gap-4 !py-4 !px-5">
          <Camera className="w-5 h-5 text-muted-foreground/70 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Registrar selfie semanal</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
        </div>
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleSelfie} />
    </section>
  );
};

export default Today;
