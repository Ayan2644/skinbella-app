import { storage } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Sun, Flame, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRef } from 'react';

import cardChecklistBg from '@/assets/card-checklist-bg.jpg';
import cardRotinaBg from '@/assets/card-rotina-bg.jpg';
import streakWomanImg from '@/assets/streak-woman.jpg';

/* Circular progress ring */
const CircleProgress = ({ value, total }: { value: number; total: number }) => {
  const size = 46;
  const stroke = 3.5;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = total > 0 ? value / total : 0;
  const offset = circ - pct * circ;
  return (
    <svg width={size} height={size} className="progress-ring shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(46,41,36,0.08)" strokeWidth={stroke} />
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

  const routineSteps = profile?.rotina?.manha?.length ?? 4;
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

  const cardShadow = '0 10px 30px rgba(46,41,36,0.10)';

  return (
    <section className="space-y-4 pb-2">
      {/* ── Header ── */}
      <div className="px-0.5">
        <h1 className="text-[1.65rem] font-bold text-foreground leading-tight tracking-tight">
          Olá, {auth?.name ?? 'linda'}{' '}
          <span className="inline-block animate-pulse">✨</span>
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1 font-medium">
          Este é seu painel de cuidados diários
        </p>
      </div>

      {/* ── Card Idade da Pele ── */}
      {profile && (
        <button
          onClick={() => navigate('/app/relatorio')}
          className="relative w-full overflow-hidden rounded-[26px] text-left border border-white/70 active:scale-[0.985] transition-transform duration-150"
          style={{
            background: 'linear-gradient(135deg, #f8f3ec 0%, #efe8dd 55%, #ebe2d4 100%)',
            boxShadow: cardShadow,
          }}
        >
          <div className="relative z-10 p-7 pb-8">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-foreground/45 mb-1.5">
              Idade da pele
            </p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-[3.2rem] font-bold text-foreground leading-none tracking-tight">
                {profile.skinAge}
              </span>
              <span className="text-base font-normal text-foreground/35">
                anos
              </span>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-5 -top-5 w-32 h-32 rounded-full bg-accent/8" />
          <div className="absolute -right-1 bottom-3 w-20 h-20 rounded-full bg-accent/6" />
          <div className="absolute right-16 -bottom-3 w-12 h-12 rounded-full bg-accent/5" />
        </button>
      )}

      {/* ── Card Checklist do dia ── */}
      <button
        onClick={() => navigate('/app/checklist')}
        className="relative w-full overflow-hidden rounded-[24px] text-left border border-white/70 active:scale-[0.985] transition-transform duration-150"
        style={{
          background: '#f7f2ec',
          boxShadow: cardShadow,
        }}
      >
        <div className="relative z-10 flex items-center gap-4 p-5 pr-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-primary" />
              </div>
              <p className="text-[14px] font-semibold text-foreground tracking-tight">Checklist do dia</p>
            </div>
            <p className="text-[12px] text-muted-foreground font-medium pl-[42px]">
              {doneCount}/{totalCount} tarefas cumpridas
            </p>
          </div>
          {/* Circular progress */}
          <div className="relative shrink-0">
            <CircleProgress value={doneCount} total={totalCount} />
          </div>
        </div>
      </button>

      {/* ── Card Rotina Manhã ── */}
      <button
        onClick={() => navigate('/app/rotina')}
        className="relative w-full overflow-hidden rounded-[24px] text-left border border-white/70 active:scale-[0.985] transition-transform duration-150"
        style={{
          background: 'linear-gradient(135deg, #faf7f1 0%, #f2ebe0 100%)',
          boxShadow: cardShadow,
        }}
      >
        <div className="relative z-10 p-5 pr-[38%]">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center">
              <Sun className="w-4 h-4 text-accent" />
            </div>
            <p className="text-[14px] font-semibold text-foreground tracking-tight">Rotina Manhã</p>
          </div>
          <p className="text-[11px] text-muted-foreground font-medium mt-1 mb-3 pl-[42px]">Meta diária</p>
          {/* Progress bar */}
          <div className="w-full h-[7px] rounded-full bg-foreground/[0.06] overflow-hidden ml-[42px]" style={{ width: 'calc(100% - 42px)' }}>
            <div
              className="h-full rounded-full bg-primary/80 transition-all duration-700"
              style={{ width: `${routinePercent}%`, borderRadius: routinePercent > 0 ? '8px' : '0' }}
            />
          </div>
        </div>
        {/* Decorative image */}
        <div className="absolute right-0 top-0 bottom-0 w-[36%] overflow-hidden rounded-r-[24px]">
          <img src={cardRotinaBg} alt="" className="w-full h-full object-cover opacity-50" />
        </div>
      </button>

      {/* ── Card Streak ── */}
      <button
        onClick={() => navigate('/app/checklist')}
        className="relative w-full overflow-hidden rounded-[24px] text-left border border-white/70 active:scale-[0.985] transition-transform duration-150"
        style={{
          background: 'linear-gradient(135deg, #faf7f1 0%, #f2ebe0 100%)',
          boxShadow: cardShadow,
        }}
      >
        <div className="relative z-10 p-5 pr-[38%]">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Flame className="w-4 h-4 text-destructive" />
            </div>
            <p className="text-[14px] font-semibold text-foreground tracking-tight">Streak</p>
          </div>
          <p className="text-[12px] text-muted-foreground font-medium mt-1 mb-3 pl-[42px]">
            {streak} {streak === 1 ? 'tarefa certa hoje' : 'tarefas certas hoje'}
          </p>
          {/* Progress bar */}
          <div className="w-full h-[7px] rounded-full bg-foreground/[0.06] overflow-hidden ml-[42px]" style={{ width: 'calc(100% - 42px)' }}>
            <div
              className="h-full rounded-full bg-primary/80 transition-all duration-700"
              style={{ width: `${streakPercent}%`, borderRadius: streakPercent > 0 ? '8px' : '0' }}
            />
          </div>
        </div>
        {/* Woman image on right */}
        <div className="absolute right-0 top-0 bottom-0 w-[34%] overflow-hidden rounded-r-[24px]">
          <img src={streakWomanImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f2ebe0]/60 to-transparent" />
        </div>
      </button>

      {/* ── Card Registrar selfie semanal ── */}
      <button
        onClick={() => fileRef.current?.click()}
        className="w-full rounded-[22px] px-6 py-5 text-left border border-white/70 active:scale-[0.985] transition-transform duration-150"
        style={{
          background: '#f7f2ec',
          boxShadow: cardShadow,
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center shrink-0">
            <Camera className="w-[18px] h-[18px] text-muted-foreground" />
          </div>
          <p className="text-[14px] font-semibold text-foreground tracking-tight">Registrar selfie semanal</p>
        </div>
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleSelfie} />
    </section>
  );
};

export default Today;
