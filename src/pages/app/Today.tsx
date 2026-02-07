import { storage } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import { Sun, Flame, Camera, ChevronRight, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRef } from 'react';
import rotinaManha from '@/assets/rotina-manha.jpg';
import streakImg from '@/assets/streak-card.jpg';
import avatarImg from '@/assets/avatar-woman.jpg';

/* SVG circle progress */
const CircleProgress = ({ value, total }: { value: number; total: number }) => {
  const size = 48;
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = total > 0 ? value / total : 0;
  const offset = circ - pct * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke="#10B981" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }}
      />
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
  const fileRef = useRef<HTMLInputElement>(null);

  const checklist = storage.getChecklist() ?? [];
  const doneCount = checklist.filter(i => i.done).length;
  const totalCount = checklist.length || 4;
  const streakPct = Math.min((streak / 7) * 100, 100);
  const morningPct = morningDone ? 100 : 70;

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

  const cardBase = "rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 cursor-pointer hover:scale-[1.01]";

  return (
    <section className="max-w-[448px] mx-auto space-y-4 px-5 py-5" style={{ background: '#F5F3F0' }}>
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[1.6rem] font-bold leading-tight" style={{ color: '#1F2937', fontFamily: "'Playfair Display', serif" }}>
            Olá, {auth?.name ?? 'Júlia'} <span className="inline-block">✨</span>
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>Este é seu painel de cuidados diários</p>
        </div>
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#E5E7EB] shadow-sm shrink-0">
          <img src={avatarImg} alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Card 1 — Idade da Pele */}
      {profile && (
        <button onClick={() => navigate('/app/relatorio')} className={`w-full text-left ${cardBase} p-6`} style={{ background: '#F5EFE7' }}>
          <p className="uppercase text-[11px] font-semibold tracking-[1.5px] mb-2" style={{ color: '#6B7280' }}>
            Idade da pele
          </p>
          <div className="flex items-baseline">
            <span className="text-[96px] font-bold leading-none" style={{ color: '#1F2937' }}>
              {profile.skinAge}
            </span>
            <span className="text-[32px] ml-2" style={{ color: '#6B7280' }}>anos</span>
          </div>
        </button>
      )}

      {/* Card 2 — Checklist do dia */}
      <button onClick={() => navigate('/app/checklist')} className={`w-full text-left ${cardBase} flex items-center justify-between bg-white py-5 px-6`}>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: '#D1FAE5' }}>
            <Check className="w-4 h-4" style={{ color: '#10B981' }} />
          </div>
          <div>
            <p className="text-[18px] font-semibold" style={{ color: '#1F2937' }}>Checklist do dia</p>
            <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>{doneCount}/{totalCount} tarefas cumpridas</p>
          </div>
        </div>
        <CircleProgress value={doneCount} total={totalCount} />
      </button>

      {/* Card 3 — Rotina Manhã */}
      <button onClick={() => navigate('/app/rotina')} className={`w-full text-left ${cardBase} flex items-center justify-between bg-white py-5 px-6`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#FEF3C7' }}>
            <Sun className="w-4 h-4" style={{ color: '#F59E0B' }} />
          </div>
          <div>
            <p className="text-[18px] font-semibold" style={{ color: '#1F2937' }}>Rotina Manhã</p>
            <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>Meta diária</p>
            <div className="w-[180px] h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: '#E5E7EB' }}>
              <div
                className="h-full rounded-full"
                style={{ background: '#10B981', width: `${morningPct}%`, transition: 'width 0.3s ease' }}
              />
            </div>
          </div>
        </div>
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
          <img src={rotinaManha} alt="Rotina" className="w-full h-full object-cover" />
        </div>
      </button>

      {/* Card 4 — Streak */}
      <button onClick={() => navigate('/app/checklist')} className={`w-full text-left ${cardBase} flex items-center justify-between bg-white py-5 px-6`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#FEE2E2' }}>
            <Flame className="w-4 h-4" style={{ color: '#EF4444' }} />
          </div>
          <div>
            <p className="text-[18px] font-semibold" style={{ color: '#1F2937' }}>Streak</p>
            <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
              {streak} {streak === 1 ? 'dia seguido' : 'dias seguidos'}
            </p>
            <div className="w-[180px] h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: '#E5E7EB' }}>
              <div
                className="h-full rounded-full"
                style={{ background: '#10B981', width: `${streakPct}%`, transition: 'width 0.3s ease' }}
              />
            </div>
          </div>
        </div>
        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
          <img src={streakImg} alt="Streak" className="w-full h-full object-cover" />
        </div>
      </button>

      {/* Card 5 — Registrar Selfie */}
      <button
        onClick={() => fileRef.current?.click()}
        className={`w-full text-left ${cardBase} flex items-center gap-3 bg-white py-5 px-6 hover:bg-[#F9FAFB]`}
      >
        <Camera className="w-6 h-6 shrink-0" style={{ color: '#9CA3AF' }} />
        <span className="flex-1 text-base font-medium" style={{ color: '#1F2937' }}>Registrar selfie semanal</span>
        <ChevronRight className="w-5 h-5" style={{ color: '#D1D5DB' }} />
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleSelfie} />
    </section>
  );
};

export default Today;
