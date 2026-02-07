import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import QuizProgress from '@/components/quiz/QuizProgress';
import QuestionRenderer from '@/components/quiz/QuestionRenderer';
import { quizQuestions } from '@/lib/quizData';
import { generateProfile } from '@/lib/skinEngine';
import { storage } from '@/lib/storage';
import heroImage from '@/assets/hero-skinbella.jpg';
import { Sparkles, Lock, RotateCcw, Shield, Star, Users, ArrowRight } from 'lucide-react';

type Phase = 'intro' | 'quiz' | 'processing' | 'result';

const Quiz = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [profile, setProfile] = useState<any>(null);

  const currentQ = quizQuestions[step];
  const totalSteps = quizQuestions.length;

  const handleAnswer = useCallback((value: any) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));
  }, [currentQ?.id]);

  const canProceed = () => {
    const val = answers[currentQ?.id];
    if (!val) return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  };

  const next = () => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      storage.saveAnswers(answers);
      setPhase('processing');
    }
  };

  const prev = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  useEffect(() => {
    if (phase === 'processing') {
      const timer = setTimeout(() => {
        const p = generateProfile(answers);
        storage.saveProfile(p);
        setProfile(p);
        setPhase('result');
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [phase, answers]);

  if (phase === 'intro') return <IntroScreen onStart={() => setPhase('quiz')} />;
  if (phase === 'processing') return <ProcessingScreen />;
  if (phase === 'result') return (
    <ResultScreen
      profile={profile}
      onRedo={() => { setPhase('intro'); setStep(0); setAnswers({}); }}
      onAccess={() => navigate('/login')}
    />
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with progress */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border/30">
        <div className="max-w-lg mx-auto">
          <QuizProgress current={step + 1} total={totalSteps} />
        </div>
      </header>

      {/* Question */}
      <main className="flex-1 flex flex-col max-w-lg mx-auto w-full px-5 py-8 animate-fade-in" key={step}>
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground font-['Playfair_Display'] mb-2 leading-tight">
            {currentQ.title}
          </h2>
          {currentQ.subtitle && (
            <p className="text-sm text-muted-foreground leading-relaxed">{currentQ.subtitle}</p>
          )}
        </div>

        <div className="flex-1">
          <QuestionRenderer question={currentQ} value={answers[currentQ.id]} onChange={handleAnswer} />
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-background/95 backdrop-blur-md border-t border-border/30 p-4">
        <div className="max-w-lg mx-auto flex gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={prev} className="flex-1 rounded-2xl h-13 text-sm">
              Voltar
            </Button>
          )}
          <Button
            onClick={next}
            disabled={!canProceed()}
            className="flex-1 rounded-2xl h-13 font-semibold text-base shadow-elegant"
          >
            {step === totalSteps - 1 ? 'Ver resultado' : 'Continuar'}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

/* ── Intro Screen ── */
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="relative h-[55vh] min-h-[320px] overflow-hidden">
        <img src={heroImage} alt="SkinBella" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-background" />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center px-6 -mt-16 relative z-10 animate-fade-in-up">
        <div className="text-center max-w-md">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-3">SkinBella App</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground font-['Playfair_Display'] mb-4 leading-tight">
            Operação Pele<br />de Porcelana
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed text-[15px]">
            Descubra a idade real da sua pele e receba um plano personalizado de skincare, nutrição e rotina.
          </p>
          <Button onClick={onStart} className="rounded-2xl h-14 px-10 text-base font-semibold shadow-elegant w-full max-w-xs">
            <Sparkles className="w-5 h-5 mr-2" />
            Começar análise gratuita
          </Button>
          <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Leva menos de 2 minutos • 100% gratuito
          </p>
        </div>
      </main>
    </div>
  );
}

/* ── Processing Screen ── */
function ProcessingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);
  const msgs = [
    'Analisando suas respostas...',
    'Calculando idade da pele...',
    'Avaliando fatores de envelhecimento...',
    'Gerando seu diagnóstico...',
    'Montando plano personalizado...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % msgs.length);
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-porcelain flex items-center justify-center shadow-elegant">
          <Sparkles className="w-8 h-8 text-accent animate-pulse" />
        </div>
        <h2 className="text-xl font-semibold text-foreground font-['Playfair_Display'] mb-3">
          Gerando seu relatório…
        </h2>
        <p className="text-sm text-muted-foreground h-5">{msgs[msgIndex]}</p>
        <div className="mt-8 w-56 mx-auto h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full animate-[progress-fill_7s_ease-out_forwards]"
            style={{
              background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))',
              '--progress-width': '100%',
            } as any}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Result Screen ── */
function ResultScreen({ profile, onRedo, onAccess }: { profile: any; onRedo: () => void; onAccess: () => void }) {
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col animate-fade-in-up">
      {/* Hero result */}
      <div className="text-center pt-12 pb-6 px-6">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">Resultado da análise</p>
        <div className="w-28 h-28 mx-auto mb-4 rounded-full flex items-center justify-center shadow-elegant"
          style={{ background: 'linear-gradient(145deg, hsl(var(--accent) / 0.15), hsl(var(--secondary)))' }}>
          <span className="text-4xl font-bold text-foreground font-['Playfair_Display']">{profile.skinAge}</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground font-['Playfair_Display'] mb-1">
          Idade da sua pele: {profile.skinAge} anos
        </h2>
        <p className="text-sm text-muted-foreground">Baseado na análise de {quizQuestions.length} fatores</p>
      </div>

      {/* Score cards */}
      <div className="px-5 max-w-lg mx-auto w-full">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <ScoreCard label="Hidratação" value={profile.scores.hidratacao} />
          <ScoreCard label="Textura" value={profile.scores.textura} />
        </div>

        {/* Locked content */}
        <div className="rounded-2xl border-2 border-dashed border-accent/40 bg-accent/5 p-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
              <Lock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-[15px]">Relatório completo bloqueado</h3>
              <p className="text-xs text-muted-foreground">Desbloqueie seu plano personalizado</p>
            </div>
          </div>
          <ul className="space-y-2 mb-4">
            {['Plano de skincare personalizado', 'Dieta anti-envelhecimento', 'Rotina matinal e noturna', 'Checklist diário', 'Nutrientes recomendados'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Social proof */}
        <div className="rounded-2xl bg-card border border-border/40 p-5 mb-6">
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-primary mb-3 text-center">
            O que dizem nossas usuárias
          </p>
          <div className="space-y-3">
            <TestimonialCard
              name="Ana C."
              text="Minha pele mudou completamente em 30 dias seguindo o plano!"
              stars={5}
            />
            <TestimonialCard
              name="Mariana S."
              text="O diagnóstico foi super preciso. Nunca me cuidei tão bem!"
              stars={5}
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>+12.400 mulheres já fizeram a análise</span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3 pb-10">
          <Button onClick={onAccess} className="rounded-2xl h-14 text-base font-semibold shadow-elegant">
            <Sparkles className="w-5 h-5 mr-2" />
            Desbloquear meu plano completo
          </Button>
          <Button variant="ghost" onClick={onRedo} className="rounded-2xl h-12 text-muted-foreground">
            <RotateCcw className="w-4 h-4 mr-2" />
            Refazer quiz
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Helper Components ── */
function ScoreCard({ label, value }: { label: string; value: number }) {
  const getColor = (v: number) => {
    if (v >= 70) return 'text-success';
    if (v >= 40) return 'text-accent';
    return 'text-destructive';
  };

  return (
    <div className="rounded-2xl bg-card border border-border/40 p-4 text-center shadow-soft">
      <p className={`text-3xl font-bold ${getColor(value)} font-['Playfair_Display']`}>{value}%</p>
      <p className="text-xs text-muted-foreground mt-1 font-medium">{label}</p>
    </div>
  );
}

function TestimonialCard({ name, text, stars }: { name: string; text: string; stars: number }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground flex-shrink-0">
        {name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-sm font-semibold text-foreground">{name}</span>
          <div className="flex gap-0.5">
            {Array.from({ length: stars }).map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-accent text-accent" />
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">"{text}"</p>
      </div>
    </div>
  );
}

export default Quiz;
