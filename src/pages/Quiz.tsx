import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import QuizProgress from '@/components/quiz/QuizProgress';
import QuestionRenderer from '@/components/quiz/QuestionRenderer';
import { quizQuestions } from '@/lib/quizData';
import { generateProfile } from '@/lib/skinEngine';
import { storage } from '@/lib/storage';
import heroImage from '@/assets/hero-skinbella.jpg';
import { Sparkles, Lock, RotateCcw } from 'lucide-react';

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
  if (phase === 'result') return <ResultScreen profile={profile} onRedo={() => { setPhase('intro'); setStep(0); setAnswers({}); }} onAccess={() => navigate('/login')} />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-lg mx-auto">
          <QuizProgress current={step + 1} total={totalSteps} />
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-6 animate-fade-in" key={step}>
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-foreground font-['Playfair_Display'] mb-1">
            {currentQ.title}
          </h2>
          {currentQ.subtitle && (
            <p className="text-sm text-muted-foreground">{currentQ.subtitle}</p>
          )}
        </div>

        <div className="flex-1 flex items-start justify-center">
          <div className="w-full">
            <QuestionRenderer question={currentQ} value={answers[currentQ.id]} onChange={handleAnswer} />
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t border-border/50 p-4">
        <div className="max-w-lg mx-auto flex gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={prev} className="flex-1 rounded-2xl h-12">
              Voltar
            </Button>
          )}
          <Button
            onClick={next}
            disabled={!canProceed()}
            className="flex-1 rounded-2xl h-12 font-semibold"
          >
            {step === totalSteps - 1 ? 'Ver resultado' : 'Próximo'}
          </Button>
        </div>
      </footer>
    </div>
  );
};

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="relative h-[50vh] min-h-[300px] overflow-hidden">
        <img src={heroImage} alt="SkinBella" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center px-6 -mt-12 relative z-10 animate-fade-in-up">
        <div className="text-center max-w-md">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">SkinBella App</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground font-['Playfair_Display'] mb-4 leading-tight">
            Operação Pele de Porcelana
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Descubra a idade real da sua pele e receba um plano personalizado de skincare, nutrição e rotina.
          </p>
          <Button onClick={onStart} className="rounded-2xl h-14 px-10 text-base font-semibold shadow-elegant">
            <Sparkles className="w-5 h-5 mr-2" />
            Começar análise
          </Button>
        </div>
      </main>
    </div>
  );
}

function ProcessingScreen() {
  const [text, setText] = useState('Analisando suas respostas...');
  useEffect(() => {
    const msgs = [
      'Analisando suas respostas...',
      'Calculando idade da pele...',
      'Gerando seu diagnóstico...',
      'Montando plano personalizado...',
      'Quase pronto...',
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % msgs.length;
      setText(msgs[i]);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-porcelain flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-accent animate-pulse-soft" />
        </div>
        <h2 className="text-xl font-semibold text-foreground font-['Playfair_Display'] mb-3">
          Gerando seu relatório…
        </h2>
        <p className="text-sm text-muted-foreground animate-pulse-soft">{text}</p>
        <div className="mt-8 w-48 mx-auto h-1.5 rounded-full bg-secondary overflow-hidden">
          <div className="h-full rounded-full bg-primary animate-[progress-fill_7s_ease-out_forwards]" style={{ '--progress-width': '100%' } as any} />
        </div>
      </div>
    </div>
  );
}

function ResultScreen({ profile, onRedo, onAccess }: { profile: any; onRedo: () => void; onAccess: () => void }) {
  if (!profile) return null;
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 animate-fade-in-up">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-porcelain flex items-center justify-center shadow-elegant">
          <span className="text-3xl font-bold text-accent-foreground font-['Playfair_Display']">{profile.skinAge}</span>
        </div>
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-primary mb-2">Idade estimada da pele</p>
        <h2 className="text-2xl font-bold text-foreground font-['Playfair_Display'] mb-6">{profile.skinAge} anos</h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="metric-card text-center">
            <p className="text-2xl font-bold text-primary">{profile.scores.hidratacao}%</p>
            <p className="text-xs text-muted-foreground mt-1">Hidratação</p>
          </div>
          <div className="metric-card text-center">
            <p className="text-2xl font-bold text-primary">{profile.scores.textura}%</p>
            <p className="text-xs text-muted-foreground mt-1">Textura</p>
          </div>
        </div>

        <div className="app-card mb-6 text-left">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Relatório completo bloqueado</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Acesse seu diagnóstico detalhado, plano de nutrientes, rotina personalizada, dieta e checklist diário.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={onAccess} className="rounded-2xl h-14 text-base font-semibold shadow-elegant">
            Criar acesso / Entrar
          </Button>
          <Button variant="outline" onClick={onRedo} className="rounded-2xl h-12">
            <RotateCcw className="w-4 h-4 mr-2" />
            Refazer quiz
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
