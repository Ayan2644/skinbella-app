import { Button } from '@/components/ui/button';
import { quizQuestions } from '@/lib/quizData';
import { Sparkles, Lock, RotateCcw, Star, Users, Check, Shield, Zap, HeadphonesIcon, ArrowRight } from 'lucide-react';
import OfferCard from './OfferCard';
import ProjectionCard from './ProjectionCard';

interface ResultScreenProps {
  profile: any;
  onRedo: () => void;
  onAccess: () => void;
}

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
    <div className="rounded-2xl bg-card border border-border/40 p-4 shadow-soft">
      <div className="flex gap-3 items-start">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground flex-shrink-0">
          {name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm font-semibold text-foreground">{name}</span>
            <div className="flex gap-0.5">
              {Array.from({ length: stars }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-accent text-accent" />
              ))}
            </div>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed italic">"{text}"</p>
        </div>
      </div>
    </div>
  );
}

function DiagnosticInsights({ skinAge }: { skinAge: number }) {
  const insights = skinAge > 30
    ? [
        'Sua pele apresenta sinais de envelhecimento precoce que podem ser revertidos com cuidados direcionados.',
        'A hidratação e proteção solar são prioridades imediatas para o seu perfil.',
        'Com o protocolo correto, é possível recuperar a vitalidade em poucas semanas.',
      ]
    : [
        'Sua pele tem boa base, mas precisa de manutenção para preservar a juventude.',
        'Investir em prevenção agora evita tratamentos caros no futuro.',
        'Um protocolo diário consistente potencializa seus resultados naturais.',
      ];

  return (
    <div className="rounded-2xl bg-card border border-border/40 p-5 shadow-soft">
      <h3 className="text-base font-bold text-foreground font-['Playfair_Display'] mb-3">
        O que isso significa
      </h3>
      <ul className="space-y-2.5">
        {insights.map((text, i) => (
          <li key={i} className="flex gap-2.5 items-start text-[13px] text-muted-foreground leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LockedContentCard() {
  const items = [
    { icon: '💆', text: 'Plano de skincare personalizado' },
    { icon: '🥗', text: 'Dieta anti-envelhecimento' },
    { icon: '🌅', text: 'Rotina matinal e noturna guiada' },
    { icon: '✅', text: 'Checklist diário interativo' },
    { icon: '💊', text: 'Nutrientes e suplementos recomendados' },
    { icon: '📸', text: 'Acompanhamento com selfie semanal' },
  ];

  return (
    <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 shadow-soft">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center">
          <Lock className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-[15px]">Relatório completo bloqueado</h3>
          <p className="text-xs text-muted-foreground">Incluso no Protocolo Pele de Porcelana™</p>
        </div>
      </div>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.text} className="flex items-center gap-3 text-[13px] text-foreground/80">
            <span className="text-base">{item.icon}</span>
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ResultScreen({ profile, onRedo, onAccess }: ResultScreenProps) {
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col animate-fade-in-up pb-24">
      {/* Hero branding */}
      <div className="text-center pt-10 pb-2 px-6">
        <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary mb-2">SkinBella App</p>
        <h1 className="text-2xl font-bold text-foreground font-['Playfair_Display'] mb-1 leading-tight">
          Protocolo Pele de Porcelana™
        </h1>
        <p className="text-sm text-muted-foreground mb-3">
          Tratamento intensivo de recuperação da idade da pele
        </p>
        <span className="inline-block bg-destructive text-destructive-foreground text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">
          HOJE: -52% NO PLANO
        </span>
      </div>

      {/* Skin age circle */}
      <div className="text-center pt-6 pb-4 px-6">
        <div
          className="w-32 h-32 mx-auto mb-3 rounded-full flex flex-col items-center justify-center shadow-elegant border-2 border-accent/20"
          style={{ background: 'linear-gradient(145deg, hsl(var(--accent) / 0.12), hsl(var(--secondary)))' }}
        >
          <span className="text-4xl font-bold text-foreground font-['Playfair_Display'] leading-none">{profile.skinAge}</span>
          <span className="text-[11px] text-muted-foreground font-medium mt-0.5">anos</span>
        </div>
        <h2 className="text-lg font-bold text-foreground font-['Playfair_Display'] mb-0.5">
          Idade da sua pele: {profile.skinAge} anos
        </h2>
        <p className="text-xs text-muted-foreground">
          Baseado na análise de {quizQuestions.length} fatores
        </p>
      </div>

      {/* Content */}
      <div className="px-5 max-w-lg mx-auto w-full space-y-4">
        {/* Score cards */}
        <div className="grid grid-cols-2 gap-3">
          <ScoreCard label="Hidratação" value={profile.scores.hidratacao} />
          <ScoreCard label="Textura" value={profile.scores.textura} />
        </div>

        {/* Diagnostic insights */}
        <DiagnosticInsights skinAge={profile.skinAge} />

        {/* Projection */}
        <ProjectionCard skinAge={profile.skinAge} />

        {/* Locked content */}
        <LockedContentCard />

        {/* Offer */}
        <OfferCard onAccess={onAccess} />

        {/* Social proof */}
        <div className="pt-2">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-primary mb-3 text-center">
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
            <TestimonialCard
              name="Juliana R."
              text="Achei que era mais um quiz, mas o plano diário realmente funciona. Estou no dia 18!"
              stars={5}
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>+12.400 mulheres já fizeram a análise</span>
          </div>
        </div>

        {/* Final CTA */}
        <div className="flex flex-col gap-3 pt-4 pb-4">
          <Button onClick={onAccess} className="rounded-2xl h-14 text-base font-semibold shadow-elegant">
            <Sparkles className="w-5 h-5 mr-2" />
            Começar tratamento agora
          </Button>
          <Button variant="ghost" onClick={onRedo} className="rounded-2xl h-11 text-muted-foreground text-sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Refazer quiz
          </Button>
        </div>
      </div>

      {/* Sticky footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/40 px-5 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              Plano hoje com <span className="text-destructive font-bold">-52%</span>
            </p>
            <p className="text-[11px] text-muted-foreground">R$ 29/mês • Cancele quando quiser</p>
          </div>
          <Button onClick={onAccess} className="rounded-2xl h-11 px-5 text-sm font-semibold shadow-elegant flex-shrink-0">
            Desbloquear
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
