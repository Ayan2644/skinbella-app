import { storage } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Sun, Flame, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRef, useState, useEffect } from 'react';
import { OnboardingModal } from '@/components/OnboardingModal';

import cardChecklistBg from '@/assets/card-checklist-bg.jpg';
import cardRotinaBg from '@/assets/card-rotina-bg.jpg';

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
  const progressPercent = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;
  const fileRef = useRef<HTMLInputElement>(null);

  // Onboarding modal state
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Verificar se é primeiro acesso
    const hasCompleted = localStorage.getItem('onboarding_completed') === 'true' ||
                         sessionStorage.getItem('onboarding_completed') === 'true';

    if (!hasCompleted) {
      setShowOnboarding(true);
    }
  }, []);

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
      toast({ title: 'Selfie salva!', description: 'Seu histórico foi atualizado.' });
    };
    reader.readAsDataURL(f);
  };

  return (
    <>
      <OnboardingModal
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      <section className="space-y-4 pb-2">
        <div className="pt-1 pb-1">
          <h1 className="text-[22px] font-semibold text-foreground font-['Playfair_Display'] leading-tight">
            Olá, {auth?.name ?? 'linda'}{' '}
            <span className="text-accent">✨</span>
        </h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Este é seu painel de cuidados diários
        </p>
      </div>

      {profile && (
        <button
          onClick={() => navigate('/app/relatorio')}
          className="relative w-full overflow-hidden rounded-[26px] text-left shadow-[0_10px_30px_rgba(46,41,36,0.12)] border border-white/70 active:scale-[0.985] transition-transform duration-150"
          style={{
            background: 'linear-gradient(135deg, #f8f3ec 0%, #efe8dd 55%, #ebe2d4 100%)',
          }}
        >
          <div className="relative z-10 px-6 py-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-foreground/50 mb-2">
              Idade da pele
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-[56px] leading-none font-semibold text-foreground font-['Playfair_Display']">
                {profile.skinAge}
              </span>
              <span className="text-[24px] font-normal text-foreground/60 font-['Playfair_Display']">
                anos
              </span>
            </div>
          </div>
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='84' height='84' viewBox='0 0 84 84' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M42 0C18.8 0 0 18.8 0 42s18.8 42 42 42 42-18.8 42-42S65.2 0 42 0zm0 80C20.2 80 4 63.8 4 42S20.2 4 42 4s38 16.2 38 38-16.2 38-38 38z' fill='%23c8b9a3' fill-opacity='0.45'/%3E%3C/svg%3E")`,
              backgroundSize: '120px 120px',
            }}
          />
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/40" />
          <div className="absolute -bottom-6 right-8 w-20 h-20 rounded-full bg-white/35" />
        </button>
      )}

      <button
        onClick={() => navigate('/app/checklist')}
        className="relative w-full overflow-hidden rounded-[24px] bg-[#f7f2ec] text-left shadow-[0_10px_24px_rgba(46,41,36,0.12)] border border-white/70 active:scale-[0.985] transition-transform duration-150"
      >
        <div className="relative z-10 flex items-center px-6 py-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-white/70 border border-[#d6c9b8] flex items-center justify-center">
                <CheckSquare className="w-[22px] h-[22px] text-[#6f8a72]" />
              </div>
              <p className="text-[18px] font-semibold text-foreground">Checklist do dia</p>
            </div>
            <p className="text-[13px] text-muted-foreground ml-[52px]">
              {doneCount}/{totalCount} tarefas cumpridas
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block h-[2px] w-[52px] rounded-full bg-[#b7c1b6]/60" />
            <div className="relative w-[66px] h-[30px] rounded-full bg-white/60 border border-[#cdd4c6] shadow-inner overflow-hidden">
              <div
                className="absolute left-0 top-0 bottom-0 rounded-full bg-[#9bb19a]/70 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
              <div
                className="absolute top-[3px] w-[24px] h-[24px] rounded-full bg-[#6f8a72] shadow-md transition-all duration-500"
                style={{ left: `${Math.max(3, (progressPercent / 100) * 36)}px` }}
              />
            </div>
          </div>
        </div>
      </button>

      <button
        onClick={() => navigate('/app/rotina')}
        className="relative w-full overflow-hidden rounded-[24px] text-left shadow-[0_10px_24px_rgba(46,41,36,0.12)] border border-white/70 active:scale-[0.985] transition-transform duration-150"
        style={{
          background: 'linear-gradient(135deg, #faf7f1 0%, #f2ebe0 100%)',
        }}
      >
        <div className="relative z-10 px-6 py-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-white/70 border border-[#e1d4c2] flex items-center justify-center">
              <Sun className="w-[22px] h-[22px] text-[#d2a24f]" />
            </div>
            <p className="text-[18px] font-semibold text-foreground">Rotina Manhã</p>
          </div>
          <p className="text-[13px] text-muted-foreground ml-[52px] mb-3">
            Meta diária
          </p>
          <div className="ml-[52px] mr-[120px]">
            <div className="h-[8px] rounded-full bg-[#d9d3c9]/70 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#7a967f] transition-all duration-700 ease-out"
                style={{ width: `${routinePercent}%`, minWidth: routinePercent > 0 ? '8px' : '0' }}
              />
            </div>
          </div>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-[92px] h-[92px] rounded-full overflow-hidden shadow-[0_8px_16px_rgba(46,41,36,0.18)]">
          <img
            src={cardRotinaBg}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </button>

      <button
        onClick={() => navigate('/app/checklist')}
        className="relative w-full overflow-hidden rounded-[24px] text-left shadow-[0_10px_24px_rgba(46,41,36,0.12)] border border-white/70 active:scale-[0.985] transition-transform duration-150"
        style={{
          background: 'linear-gradient(135deg, #faf7f1 0%, #f2ebe0 100%)',
        }}
      >
        <div className="relative z-10 px-6 py-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-white/70 border border-[#e6d7c3] flex items-center justify-center">
              <Flame className="w-[22px] h-[22px] text-[#d08547]" />
            </div>
            <p className="text-[18px] font-semibold text-foreground">Streak</p>
          </div>
          <p className="text-[13px] text-muted-foreground ml-[52px] mb-3">
            {streak} {streak === 1 ? 'tarefa certa hoje' : 'tarefas certas hoje'}
          </p>
          <div className="ml-[52px] mr-[120px]">
            <div className="h-[8px] rounded-full bg-[#d9d3c9]/70 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#7a967f] transition-all duration-700 ease-out"
                style={{ width: `${streakPercent}%`, minWidth: streakPercent > 0 ? '8px' : '0' }}
              />
            </div>
          </div>
        </div>
        <div className="absolute -right-1 -bottom-1 w-[130px] h-[130px] overflow-hidden rounded-tr-[24px] pointer-events-none">
          <img
            src={cardChecklistBg}
            alt=""
            className="h-full w-full object-cover object-[70%_20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f2ebe0]/85 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f2ebe0]/70 via-transparent to-transparent" />
        </div>
      </button>

      <button
        onClick={() => fileRef.current?.click()}
        className="w-full rounded-[22px] bg-[#f7f2ec] px-6 py-5 shadow-[0_10px_24px_rgba(46,41,36,0.12)] border border-white/70 text-left active:scale-[0.985] transition-transform duration-150"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/80 border border-[#d6c9b8] flex items-center justify-center flex-shrink-0">
            <Camera className="w-5 h-5 text-[#6f8a72]" />
          </div>
          <p className="text-[18px] font-semibold text-foreground">Registrar selfie semanal</p>
        </div>
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleSelfie} />
    </section>
    </>
  );
};

export default Today;
