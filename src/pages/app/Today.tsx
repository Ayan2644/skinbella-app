import { storage } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Sun, Flame, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRef, useState, useEffect } from 'react';
import { OnboardingModal } from '@/components/OnboardingModal';

import cardChecklistBg from '@/assets/card-checklist-bg.jpg';
import cardRotinaBg    from '@/assets/card-rotina-bg.jpg';
import heroSkinbella   from '@/assets/hero-skinbella.jpg';
import avatarWoman     from '@/assets/avatar-woman.jpg';
import streakWoman     from '@/assets/streak-woman.jpg';

/* ─── mini componente: barra de progresso animada ─── */
const ProgressBar = ({
  percent,
  color = '#8fa48f',
  trackColor = 'rgba(0,0,0,0.08)',
  height = 6,
  delay = 0,
}: {
  percent: number;
  color?: string;
  trackColor?: string;
  height?: number;
  delay?: number;
}) => {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setActive(true), delay + 300);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ background: trackColor, height }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: active ? `${percent}%` : '0%',
          background: color,
          transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
          minWidth: active && percent > 0 ? height : 0,
        }}
      />
    </div>
  );
};

/* ─── componente principal ─── */
const Today = () => {
  const profile    = storage.getProfile();
  const auth       = storage.getAuth();
  const navigate   = useNavigate();
  const { toast }  = useToast();
  const streak     = storage.getStreak();
  const morningDone = storage.getRoutineStatus('morning');
  const checklist  = storage.getChecklist();
  const safeChecklist = Array.isArray(checklist) ? checklist : [];
  const doneCount  = safeChecklist.filter(c => c.done).length;
  const totalCount = safeChecklist.length || 4;
  const checklistPercent = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;
  const fileRef    = useRef<HTMLInputElement>(null);

  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const done =
      localStorage.getItem('onboarding_completed') === 'true' ||
      sessionStorage.getItem('onboarding_completed') === 'true';
    if (!done) setShowOnboarding(true);
  }, []);

  const routineSteps      = profile?.rotina?.manha?.length ?? 4;
  const routineDoneCount  = morningDone ? routineSteps : 0;
  const routinePercent    = (routineDoneCount / routineSteps) * 100;

  const streakTarget  = 7;
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

  const firstName = auth?.name?.split(' ')[0] ?? 'linda';

  return (
    <>
      <OnboardingModal open={showOnboarding} onClose={() => setShowOnboarding(false)} />

      <section className="space-y-4 pb-6">

        {/* ── Header: saudação + avatar ── */}
        <div
          className="flex items-start justify-between pt-1 animate-fade-in"
          style={{ animationFillMode: 'both' }}
        >
          <div>
            <h1
              className="text-[24px] font-semibold leading-tight font-['Playfair_Display']"
              style={{ color: '#2C1F14' }}
            >
              Olá, {firstName}{' '}
              <span style={{ color: '#C8913F' }}>✨</span>
            </h1>
            <p className="text-[13px] mt-0.5" style={{ color: '#8C7B6B' }}>
              Este é seu painel de cuidados diários
            </p>
          </div>

          {/* Avatar */}
          <div
            className="w-[52px] h-[52px] rounded-full overflow-hidden shrink-0 mt-0.5"
            style={{
              border: '2.5px solid #FFFFFF',
              boxShadow: '0 4px 14px rgba(44,31,20,0.18)',
            }}
          >
            <img
              src={avatarWoman}
              alt="Perfil"
              className="w-full h-full object-cover object-[50%_20%]"
            />
          </div>
        </div>

        {/* ── Hero: Idade da Pele ── */}
        {profile && (
          <button
            onClick={() => navigate('/app/relatorio')}
            className="relative w-full overflow-hidden text-left active:scale-[0.985] transition-transform duration-150 animate-fade-in-up"
            style={{
              borderRadius: 28,
              background: 'linear-gradient(135deg, #f8f3ec 0%, #ede5d8 55%, #e6dccf 100%)',
              border: '1px solid rgba(255,255,255,0.85)',
              boxShadow: '0 12px 36px rgba(46,41,36,0.14)',
              animationDelay: '60ms',
              animationFillMode: 'both',
            }}
          >
            {/* Conteúdo */}
            <div className="relative z-10 px-6 py-6">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5"
                style={{ color: '#8C7B6B' }}
              >
                Idade da pele
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-[58px] leading-none font-semibold font-['Playfair_Display']"
                  style={{ color: '#2C1F14' }}
                >
                  {profile.skinAge}
                </span>
                <span
                  className="text-[22px] font-normal font-['Playfair_Display']"
                  style={{ color: '#8C7B6B' }}
                >
                  anos
                </span>
              </div>
              <p
                className="text-[11px] mt-2 font-medium"
                style={{ color: '#8C7B6B' }}
              >
                Ver diagnóstico completo →
              </p>
            </div>

            {/* Foto circular */}
            <div
              className="absolute right-5 top-1/2 -translate-y-1/2 overflow-hidden"
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.9)',
                boxShadow: '0 8px 20px rgba(46,41,36,0.18)',
              }}
            >
              <img
                src={heroSkinbella}
                alt=""
                className="w-full h-full object-cover object-[50%_20%]"
              />
            </div>

            {/* Decoração */}
            <div
              className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.35)' }}
            />
            <div
              className="absolute -bottom-6 left-8 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            />
          </button>
        )}

        {/* ── 2 mini stats: Streak + Rotina ── */}
        <div className="grid grid-cols-2 gap-3">
          {/* Streak mini */}
          <div
            className="rounded-[22px] px-4 py-4 animate-fade-in-up"
            style={{
              background: 'linear-gradient(135deg, #FDF0C8 0%, #F5CF80 100%)',
              border: '1px solid #F0D8A8',
              boxShadow: '0 6px 18px rgba(44,31,20,0.09)',
              animationDelay: '140ms',
              animationFillMode: 'both',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl select-none">🔥</span>
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#7A5020' }}>
                Streak
              </p>
            </div>
            <p
              className="text-[26px] font-bold leading-none font-['Playfair_Display'] mb-0.5"
              style={{ color: '#2C1F14' }}
            >
              {streak}
            </p>
            <p className="text-[11px]" style={{ color: '#8C7B6B' }}>
              {streak === 1 ? 'dia consecutivo' : 'dias consecutivos'}
            </p>
          </div>

          {/* Rotina status mini */}
          <div
            className="rounded-[22px] px-4 py-4 animate-fade-in-up"
            style={{
              background: morningDone
                ? 'linear-gradient(135deg, #E8EFDF 0%, #D0E4C0 100%)'
                : 'linear-gradient(135deg, #F7F3EE 0%, #EDE8E1 100%)',
              border: morningDone ? '1px solid #C8E0A8' : '1px solid #EDE8E1',
              boxShadow: '0 6px 18px rgba(44,31,20,0.09)',
              animationDelay: '180ms',
              animationFillMode: 'both',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl select-none">{morningDone ? '✅' : '☀️'}</span>
              <p
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: morningDone ? '#3A5A2A' : '#8C7B6B' }}
              >
                Manhã
              </p>
            </div>
            <p
              className="text-[15px] font-bold leading-snug font-['Playfair_Display']"
              style={{ color: '#2C1F14' }}
            >
              {morningDone ? 'Concluída!' : 'Pendente'}
            </p>
            <p className="text-[11px]" style={{ color: '#8C7B6B' }}>
              {morningDone ? 'Rotina da manhã feita' : 'Faça sua rotina'}
            </p>
          </div>
        </div>

        {/* ── Checklist do dia ── */}
        <button
          onClick={() => navigate('/app/checklist')}
          className="w-full overflow-hidden text-left active:scale-[0.985] transition-transform duration-150 animate-fade-in-up"
          style={{
            borderRadius: 24,
            background: '#FFFFFF',
            border: '1px solid #EDE8E1',
            boxShadow: '0 8px 24px rgba(46,41,36,0.10)',
            animationDelay: '220ms',
            animationFillMode: 'both',
          }}
        >
          <div className="flex items-stretch">
            <div className="flex-1 px-5 py-5">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: '#E8EFDF' }}
                >
                  <CheckSquare className="w-5 h-5" style={{ color: '#4A5C3A' }} />
                </div>
                <div>
                  <p className="text-[17px] font-semibold" style={{ color: '#2C1F14' }}>
                    Checklist do dia
                  </p>
                  <p className="text-[12px]" style={{ color: '#8C7B6B' }}>
                    {doneCount}/{totalCount} tarefas cumpridas
                  </p>
                </div>
              </div>

              <ProgressBar
                percent={checklistPercent}
                color="#4A5C3A"
                trackColor="#EDE8E1"
                height={6}
                delay={100}
              />
            </div>

            {/* Imagem lateral */}
            <div
              className="w-[100px] shrink-0 relative pointer-events-none"
              style={{ borderRadius: '0 24px 24px 0', overflow: 'hidden' }}
            >
              <img
                src={cardChecklistBg}
                alt=""
                className="w-full h-full object-cover object-center"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to right, #FFFFFF 0%, rgba(255,255,255,0.2) 55%, transparent 100%)',
                }}
              />
            </div>
          </div>
        </button>

        {/* ── Rotina da manhã ── */}
        <button
          onClick={() => navigate('/app/rotina')}
          className="w-full overflow-hidden text-left active:scale-[0.985] transition-transform duration-150 animate-fade-in-up"
          style={{
            borderRadius: 24,
            background: 'linear-gradient(135deg, #FDF5E6 0%, #F5E8CC 60%, #F0DDB8 100%)',
            border: '1px solid #F0D8A8',
            boxShadow: '0 8px 24px rgba(46,41,36,0.10)',
            animationDelay: '280ms',
            animationFillMode: 'both',
          }}
        >
          <div className="flex items-center px-5 py-5 gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(255,255,255,0.7)' }}
                >
                  <Sun className="w-5 h-5" style={{ color: '#C8913F' }} />
                </div>
                <div>
                  <p className="text-[17px] font-semibold" style={{ color: '#2C1F14' }}>
                    Rotina Manhã
                  </p>
                  <p className="text-[12px]" style={{ color: '#8C7B6B' }}>
                    {morningDone ? 'Concluída hoje ✓' : 'Meta diária'}
                  </p>
                </div>
              </div>

              <ProgressBar
                percent={routinePercent}
                color="#C8913F"
                trackColor="rgba(255,255,255,0.5)"
                height={6}
                delay={200}
              />
            </div>

            {/* Imagem circular */}
            <div
              className="shrink-0 overflow-hidden"
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.85)',
                boxShadow: '0 6px 16px rgba(46,41,36,0.16)',
              }}
            >
              <img
                src={cardRotinaBg}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </button>

        {/* ── Streak card ── */}
        <button
          onClick={() => navigate('/app/checklist')}
          className="w-full overflow-hidden text-left active:scale-[0.985] transition-transform duration-150 animate-fade-in-up"
          style={{
            borderRadius: 24,
            background: 'linear-gradient(135deg, #faf7f1 0%, #f2ebe0 100%)',
            border: '1px solid #EDE8E1',
            boxShadow: '0 8px 24px rgba(46,41,36,0.10)',
            animationDelay: '340ms',
            animationFillMode: 'both',
          }}
        >
          <div className="flex items-stretch">
            <div className="flex-1 px-5 py-5">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: '#FDF0C8' }}
                >
                  <Flame className="w-5 h-5" style={{ color: '#C8913F' }} />
                </div>
                <div>
                  <p className="text-[17px] font-semibold" style={{ color: '#2C1F14' }}>
                    Streak
                  </p>
                  <p className="text-[12px]" style={{ color: '#8C7B6B' }}>
                    {streak} {streak === 1 ? 'dia consecutivo' : 'dias consecutivos'}
                  </p>
                </div>
              </div>

              <ProgressBar
                percent={streakPercent}
                color="#C8913F"
                trackColor="#EDE8E1"
                height={6}
                delay={300}
              />

              <p className="text-[11px] mt-1.5" style={{ color: '#8C7B6B' }}>
                Meta: {streakTarget} dias seguidos
              </p>
            </div>

            {/* Imagem lateral */}
            <div
              className="w-[110px] shrink-0 relative pointer-events-none"
              style={{ borderRadius: '0 24px 24px 0', overflow: 'hidden' }}
            >
              <img
                src={streakWoman}
                alt=""
                className="w-full h-full object-cover object-top"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to right, #f5ede0 0%, rgba(245,237,224,0.6) 40%, transparent 100%)',
                }}
              />
            </div>
          </div>
        </button>

        {/* ── Selfie semanal ── */}
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full text-left active:scale-[0.985] transition-transform duration-150 animate-fade-in-up"
          style={{
            borderRadius: 22,
            background: '#FFFFFF',
            border: '1px solid #EDE8E1',
            boxShadow: '0 6px 18px rgba(46,41,36,0.08)',
            animationDelay: '400ms',
            animationFillMode: 'both',
          }}
        >
          <div className="flex items-center gap-4 px-5 py-4">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: '#E8EFDF' }}
            >
              <Camera className="w-5 h-5" style={{ color: '#4A5C3A' }} />
            </div>
            <div>
              <p className="text-[16px] font-semibold" style={{ color: '#2C1F14' }}>
                Registrar selfie semanal
              </p>
              <p className="text-[12px]" style={{ color: '#8C7B6B' }}>
                Acompanhe sua evolução com fotos
              </p>
            </div>
            <span
              className="ml-auto text-lg shrink-0"
              style={{ color: '#8C7B6B' }}
            >
              →
            </span>
          </div>
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleSelfie}
        />

      </section>
    </>
  );
};

export default Today;
