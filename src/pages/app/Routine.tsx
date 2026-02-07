import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Sun, Moon, Sparkles, Check, Leaf, ShieldCheck, Droplets, ChevronRight, Clock, Target } from 'lucide-react';
import skinbellaBannerImg from '@/assets/skinbella-caps-banner.jpg';

/* ── Countdown Timer ── */
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calcTime = () => {
      const now = new Date();
      const hour = now.getHours();
      // Next routine: if before 20:00, target is 20:00 (noite). If after, target is tomorrow 07:00 (manhã)
      let target: Date;
      if (hour < 7) {
        target = new Date(now);
        target.setHours(7, 0, 0, 0);
      } else if (hour < 20) {
        target = new Date(now);
        target.setHours(20, 0, 0, 0);
      } else {
        target = new Date(now);
        target.setDate(target.getDate() + 1);
        target.setHours(7, 0, 0, 0);
      }
      const diff = Math.max(0, target.getTime() - now.getTime());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ hours: h, minutes: m, seconds: s });
    };
    calcTime();
    const interval = setInterval(calcTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  const timeSlots = [
    { label: 'h', value: pad(timeLeft.hours) },
    { label: 'm', value: pad(timeLeft.minutes) },
    { label: 's', value: pad(timeLeft.seconds) },
  ];

  return (
    <div className="flex items-center gap-1.5">
      {timeSlots.map((slot, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="bg-primary/10 rounded-lg px-2.5 py-1.5 min-w-[40px] text-center">
            <span className="text-lg font-bold text-primary tabular-nums">{slot.value}</span>
            <span className="text-[9px] text-primary/60 ml-0.5">{slot.label}</span>
          </div>
          {i < timeSlots.length - 1 && (
            <span className="text-primary/40 font-bold text-sm">:</span>
          )}
        </div>
      ))}
    </div>
  );
};

/* ── Skin Age Thermometer ── */
const SkinAgeThermometer = ({ currentAge, targetAge, realAge }: { currentAge: number; targetAge: number; realAge: number }) => {
  const minAge = Math.min(targetAge - 5, currentAge - 3);
  const maxAge = Math.max(realAge + 5, currentAge + 5);
  const range = maxAge - minAge;

  const currentPct = Math.max(0, Math.min(100, ((currentAge - minAge) / range) * 100));
  const targetPct = Math.max(0, Math.min(100, ((targetAge - minAge) / range) * 100));
  const diff = currentAge - targetAge;

  // Generate scale markers
  const markers = [];
  const step = Math.ceil(range / 6);
  for (let age = Math.ceil(minAge / step) * step; age <= maxAge; age += step) {
    const pct = ((age - minAge) / range) * 100;
    if (pct >= 0 && pct <= 100) markers.push({ age, pct });
  }

  return (
    <div className="app-card !p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            Termômetro da Pele
          </h3>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          Faltam <span className="text-primary font-bold">{diff > 0 ? diff : 0}</span> anos
        </span>
      </div>

      {/* Thermometer bar */}
      <div className="relative pt-6 pb-3">
        {/* Scale markers */}
        <div className="relative h-3 w-full">
          {markers.map((m, i) => (
            <div key={i} className="absolute -top-5" style={{ left: `${m.pct}%`, transform: 'translateX(-50%)' }}>
              <span className="text-[10px] text-muted-foreground tabular-nums">{m.age}</span>
            </div>
          ))}

          {/* Track */}
          <div className="absolute inset-0 rounded-full overflow-hidden bg-muted">
            {/* Filled portion (from target to current) */}
            <div
              className="absolute inset-y-0 rounded-full transition-all duration-700"
              style={{
                left: `${targetPct}%`,
                width: `${Math.max(0, currentPct - targetPct)}%`,
                background: 'linear-gradient(90deg, hsl(var(--primary)/0.3), hsl(var(--primary)/0.6))',
              }}
            />
            {/* Green zone (0 to target) */}
            <div
              className="absolute inset-y-0 left-0 rounded-l-full bg-primary/15"
              style={{ width: `${targetPct}%` }}
            />
          </div>

          {/* Target marker */}
          <div className="absolute top-1/2 -translate-y-1/2 z-10" style={{ left: `${targetPct}%`, transform: `translateX(-50%) translateY(-50%)` }}>
            <div className="w-4 h-4 rounded-full border-2 border-primary bg-card shadow-sm" />
          </div>

          {/* Current marker */}
          <div className="absolute top-1/2 -translate-y-1/2 z-20" style={{ left: `${currentPct}%`, transform: `translateX(-50%) translateY(-50%)` }}>
            <div className="w-5 h-5 rounded-full bg-primary shadow-soft flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Labels below */}
        <div className="flex justify-between mt-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-card" />
            <span className="text-[11px] text-muted-foreground">Meta: <span className="font-semibold text-primary">{targetAge} anos</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-[11px] text-muted-foreground">Atual: <span className="font-semibold text-foreground">{currentAge} anos</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Activity tips data ── */
const activityTips = [
  {
    icon: Leaf,
    title: 'Reforçar o colágeno',
    description: 'Use peptídeos e vitamina C pela manhã.',
    color: 'hsl(var(--primary))',
    bgColor: 'hsl(var(--primary)/0.08)',
  },
  {
    icon: ShieldCheck,
    title: 'Proteger contra o sol',
    description: 'Reaplique protetor solar a cada 2 horas.',
    color: 'hsl(var(--accent))',
    bgColor: 'hsl(var(--accent)/0.1)',
  },
  {
    icon: Droplets,
    title: 'Controlar manchas',
    description: 'Aplique sérum com ácido hialurônico.',
    color: 'hsl(var(--primary))',
    bgColor: 'hsl(var(--primary)/0.08)',
  },
];

/* ── Step meta for icons ── */
const stepMeta = [
  { icon: Leaf, color: 'hsl(var(--primary))' },
  { icon: Sparkles, color: 'hsl(var(--accent))' },
  { icon: Droplets, color: 'hsl(var(--primary))' },
  { icon: ShieldCheck, color: 'hsl(var(--accent))' },
  { icon: Leaf, color: 'hsl(var(--primary))' },
  { icon: Moon, color: 'hsl(var(--accent))' },
];

const Routine = () => {
  const profile = storage.getProfile();
  const { toast } = useToast();
  const [tab, setTab] = useState<'manha' | 'noite'>('manha');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  if (!profile) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Sparkles className="w-10 h-10 text-accent mb-4" />
      <p className="text-lg font-semibold text-foreground mb-1">Rotina indisponível</p>
      <p className="text-sm text-muted-foreground">Complete o quiz primeiro.</p>
    </div>
  );

  const steps = tab === 'manha' ? profile.rotina.manha : profile.rotina.noite;
  const isDone = storage.getRoutineStatus(tab === 'manha' ? 'morning' : 'night');
  const checkedCount = steps.filter((_: string, i: number) => checked[`${tab}-${i}`]).length;
  const allChecked = checkedCount === steps.length;

  const skinAge = profile.skinAge ?? 28;
  const realAge = profile.age ?? 25;
  const targetAge = Math.max(realAge - 3, skinAge - 8);

  const toggle = (i: number) => {
    setChecked((prev) => ({ ...prev, [`${tab}-${i}`]: !prev[`${tab}-${i}`] }));
  };

  const markDone = () => {
    storage.saveRoutineStatus(tab === 'manha' ? 'morning' : 'night', true);
    toast({ title: 'Rotina concluída! ✨', description: `Rotina da ${tab === 'manha' ? 'manhã' : 'noite'} marcada.` });
  };

  return (
    <section className="space-y-5">
      {/* ── Header with countdown ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sua rotina</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Plano personalizado</p>
        </div>
        <CountdownTimer />
      </div>

      {/* ── Tab selector ── */}
      <div className="flex gap-2 p-1.5 bg-muted/60 rounded-2xl">
        <button
          onClick={() => setTab('manha')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
            tab === 'manha'
              ? 'bg-card text-primary shadow-card'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sun className="w-4 h-4" /> Manhã
        </button>
        <button
          onClick={() => setTab('noite')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
            tab === 'noite'
              ? 'bg-card text-primary shadow-card'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Moon className="w-4 h-4" /> Noite
        </button>
      </div>

      {/* ── Step progress dots ── */}
      <div className="flex items-center gap-2 px-1">
        {steps.map((_: string, i: number) => {
          const done = checked[`${tab}-${i}`] ?? false;
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`relative flex items-center justify-center transition-all duration-300 ${
                done
                  ? 'w-9 h-9 rounded-full bg-primary text-primary-foreground shadow-soft'
                  : 'w-9 h-9 rounded-full bg-muted text-muted-foreground'
              }`}
            >
              {done ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-xs font-semibold">{i + 1}</span>
              )}
            </button>
          );
        })}
        <div className="flex-1" />
        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
          {checkedCount}/{steps.length}
        </span>
      </div>

      {/* ── Activity tips / dicas ── */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 px-1">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Dicas & Atividades</span>
        </div>
        {activityTips.map((tip, i) => {
          const Icon = tip.icon;
          return (
            <div key={i} className="app-card flex items-start gap-4 !p-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: tip.bgColor }}
              >
                <Icon className="w-5 h-5" style={{ color: tip.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{tip.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{tip.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Steps list ── */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Passos da Rotina</span>
        </div>
        {steps.map((step: string, i: number) => {
          const isChecked = checked[`${tab}-${i}`] ?? false;
          const meta = stepMeta[i] ?? stepMeta[0];
          const Icon = meta.icon;

          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`w-full text-left app-card flex items-start gap-4 !p-4 transition-all duration-300 ${
                isChecked ? 'bg-primary/5 border-primary/20' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isChecked
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'bg-muted/80'
                }`}
              >
                {isChecked ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" style={{ color: meta.color }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold transition-all duration-200 ${
                  isChecked ? 'text-primary line-through opacity-70' : 'text-foreground'
                }`}>
                  {step.split(' ').slice(0, 4).join(' ')}
                </p>
                <p className={`text-xs mt-0.5 transition-all duration-200 ${
                  isChecked ? 'text-muted-foreground/50 line-through' : 'text-muted-foreground'
                }`}>
                  {step}
                </p>
              </div>
              <ChevronRight className={`w-4 h-4 mt-1 shrink-0 transition-all duration-200 ${
                isChecked ? 'text-primary/40' : 'text-muted-foreground/40'
              }`} />
            </button>
          );
        })}
      </div>

      {/* ── Skin Age Thermometer ── */}
      <SkinAgeThermometer currentAge={skinAge} targetAge={targetAge} realAge={realAge} />

      {/* ── SkinBella Caps Banner ── */}
      <div className="relative overflow-hidden rounded-2xl shadow-card border border-border/20">
        <img
          src={skinbellaBannerImg}
          alt="SkinBella Caps"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="font-bold text-white text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
            SkinBella Caps
          </p>
          <p className="text-white/80 text-xs mt-0.5 max-w-[70%]">
            Suplemento com astaxantina e colágeno para potencializar sua rotina.
          </p>
          <div className="flex gap-2 mt-3">
            <button className="text-xs font-medium text-white/90 border border-white/30 rounded-full px-4 py-2 hover:bg-white/10 transition-colors">
              Saiba mais
            </button>
            <button className="text-xs font-semibold text-foreground bg-white rounded-full px-4 py-2 hover:bg-white/90 transition-colors flex items-center gap-1">
              Comprar <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <Button
        onClick={markDone}
        disabled={isDone}
        className={`w-full rounded-2xl h-14 text-base font-semibold shadow-elegant transition-all duration-300 ${
          allChecked && !isDone ? 'animate-pulse' : ''
        }`}
        size="lg"
      >
        {isDone ? (
          <>
            <Check className="w-5 h-5 mr-2" />
            Rotina concluída
          </>
        ) : (
          'Marcar rotina como feita'
        )}
      </Button>
    </section>
  );
};

export default Routine;
