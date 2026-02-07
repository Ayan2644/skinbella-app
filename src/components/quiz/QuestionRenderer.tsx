import { useState, useRef, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import type { QuizQuestion } from '@/lib/quizData';
import { Camera, Upload, ScanFace } from 'lucide-react';

interface QuestionRendererProps {
  question: QuizQuestion;
  value: any;
  onChange: (value: any) => void;
}

const QuestionRenderer = ({ question, value, onChange }: QuestionRendererProps) => {
  switch (question.type) {
    case 'cards-emoji':
    case 'cards-image':
      return <CardsQuestion question={question} value={value} onChange={onChange} />;
    case 'chips':
      return <CardsQuestion question={question} value={value} onChange={onChange} />;
    case 'multi-chips':
      return <MultiChipsQuestion question={question} value={value as string[] | undefined} onChange={onChange} />;
    case 'slider':
      return <SliderQuestion question={question} value={value} onChange={onChange} />;
    case 'selfie':
      return <SelfieQuestion value={value} onChange={onChange} />;
    default:
      return null;
  }
};

/* ── Full-width cards with emoji + label + description ── */
function CardsQuestion({ question, value, onChange }: QuestionRendererProps) {
  return (
    <div className="flex flex-col gap-3">
      {question.options?.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`group relative w-full flex items-start gap-4 rounded-2xl p-4 text-left transition-all duration-200 border-2 ${
              isSelected
                ? 'border-primary bg-primary/5 shadow-elegant'
                : 'border-border/60 bg-card hover:border-primary/30 hover:shadow-soft'
            }`}
          >
            <span className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-secondary/60">
              {opt.emoji}
            </span>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className={`font-semibold text-[15px] leading-tight ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                {opt.label}
              </p>
              {opt.description && (
                <p className="text-[13px] text-muted-foreground mt-0.5 leading-snug">
                  {opt.description}
                </p>
              )}
            </div>
            <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mt-1 transition-all ${
              isSelected
                ? 'border-primary bg-primary'
                : 'border-muted-foreground/30'
            }`}>
              {isSelected && (
                <svg viewBox="0 0 20 20" className="w-full h-full text-primary-foreground">
                  <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ── Multi-select chips with emoji ── */
function MultiChipsQuestion({ question, value, onChange }: { question: QuizQuestion; value?: string[]; onChange: (v: string[]) => void }) {
  const selected = value ?? [];
  const toggle = (v: string) => {
    onChange(selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v]);
  };
  return (
    <div className="flex flex-col gap-3">
      {question.options?.map((opt) => {
        const isSelected = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className={`group relative w-full flex items-center gap-4 rounded-2xl p-4 text-left transition-all duration-200 border-2 ${
              isSelected
                ? 'border-primary bg-primary/5 shadow-elegant'
                : 'border-border/60 bg-card hover:border-primary/30 hover:shadow-soft'
            }`}
          >
            <span className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-secondary/60">
              {opt.emoji}
            </span>
            <span className={`font-semibold text-[15px] flex-1 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
              {opt.label}
            </span>
            <div className={`flex-shrink-0 w-5 h-5 rounded-md border-2 transition-all ${
              isSelected
                ? 'border-primary bg-primary'
                : 'border-muted-foreground/30'
            }`}>
              {isSelected && (
                <svg viewBox="0 0 20 20" className="w-full h-full text-primary-foreground">
                  <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ── Slider ── */
function SliderQuestion({ question, value, onChange }: QuestionRendererProps) {
  const val = value ?? question.sliderMin ?? 0;
  const max = question.sliderMax ?? 10;
  const pct = Math.round((val / max) * 100);

  return (
    <div className="space-y-8 px-2">
      <div className="text-center">
        <div className="inline-flex items-baseline gap-1">
          <span className="text-5xl font-bold text-primary font-['Playfair_Display']">{val}</span>
          <span className="text-lg text-muted-foreground font-medium">{question.sliderUnit}</span>
        </div>
        <div className="mt-3 mx-auto w-32 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))',
            }}
          />
        </div>
      </div>
      <Slider
        value={[val]}
        onValueChange={([v]) => onChange(v)}
        min={question.sliderMin ?? 0}
        max={max}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground font-medium">
        <span>{question.sliderMin ?? 0}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

/* ── Selfie with face scanner ── */
function SelfieQuestion({ value, onChange }: { value: any; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisDone, setAnalysisDone] = useState(!!value);

  const analysisLabels = [
    'Detectando rosto...',
    'Analisando textura da pele...',
    'Mapeando poros e manchas...',
    'Avaliando hidratação...',
    'Medindo linhas de expressão...',
    'Análise concluída ✓',
  ];

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreview(url);
      setAnalyzing(true);
      setAnalysisStep(0);
      setAnalysisDone(false);
      // don't call onChange yet — wait for "analysis" to finish
      setTimeout(() => {
        onChange(url);
      }, 100);
    };
    reader.readAsDataURL(file);
  };

  // Fake analysis animation
  useEffect(() => {
    if (!analyzing) return;
    if (analysisStep >= analysisLabels.length - 1) {
      const t = setTimeout(() => {
        setAnalyzing(false);
        setAnalysisDone(true);
      }, 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setAnalysisStep((s) => s + 1), 1200);
    return () => clearTimeout(t);
  }, [analyzing, analysisStep]);

  return (
    <div className="flex flex-col items-center gap-4">
      {preview ? (
        <div className="relative w-72 h-80 rounded-2xl overflow-hidden border-2 border-primary/40 shadow-elegant">
          {/* Photo */}
          <img src={preview} alt="Selfie" className="w-full h-full object-cover" />

          {/* Scanner overlay */}
          {analyzing && (
            <div className="absolute inset-0">
              {/* Scan line */}
              <div className="absolute left-0 right-0 h-0.5 animate-scan-line"
                style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)), transparent)' }}
              />
              {/* Face oval guide */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-44 h-56 border-2 border-primary/50 rounded-[50%] animate-pulse" />
              </div>
              {/* Corner markers */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary/70 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary/70 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary/70 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary/70 rounded-br-lg" />
              {/* Grid lines */}
              <div className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
              {/* Detection dots */}
              <div className="absolute top-[30%] left-[35%] w-2 h-2 rounded-full bg-accent animate-pulse-soft" />
              <div className="absolute top-[30%] right-[35%] w-2 h-2 rounded-full bg-accent animate-pulse-soft" style={{ animationDelay: '0.3s' }} />
              <div className="absolute top-[50%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" style={{ animationDelay: '0.6s' }} />
              <div className="absolute top-[65%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent animate-pulse-soft" style={{ animationDelay: '0.9s' }} />
            </div>
          )}

          {/* Status bar */}
          {(analyzing || analysisDone) && (
            <div className="absolute bottom-0 left-0 right-0 bg-foreground/80 backdrop-blur-md px-4 py-3">
              <div className="flex items-center gap-2 mb-1.5">
                <ScanFace className={`w-4 h-4 ${analysisDone ? 'text-green-400' : 'text-accent animate-pulse'}`} />
                <span className="text-xs font-semibold text-white">
                  {analysisDone ? 'Análise concluída ✓' : analysisLabels[analysisStep]}
                </span>
              </div>
              {analyzing && (
                <div className="w-full h-1 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${((analysisStep + 1) / analysisLabels.length) * 100}%`,
                      background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))',
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Refazer button */}
          {analysisDone && (
            <button
              onClick={() => { setPreview(null); setAnalysisDone(false); onChange(''); }}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-card/90 text-xs font-semibold text-card-foreground backdrop-blur-sm border border-border/50"
            >
              Refazer
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.capture = 'user';
              input.onchange = (e) => {
                const f = (e.target as HTMLInputElement).files?.[0];
                if (f) handleFile(f);
              };
              input.click();
            }}
            className="w-full flex items-center gap-4 rounded-2xl p-4 border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all"
          >
            <span className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Camera className="w-5 h-5 text-primary" />
            </span>
            <div className="text-left">
              <p className="font-semibold text-[15px] text-foreground">Tirar foto agora</p>
              <p className="text-[13px] text-muted-foreground">Usar a câmera frontal</p>
            </div>
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center gap-4 rounded-2xl p-4 border-2 border-border/60 bg-card hover:border-primary/30 transition-all"
          >
            <span className="w-11 h-11 rounded-xl bg-secondary/60 flex items-center justify-center">
              <Upload className="w-5 h-5 text-muted-foreground" />
            </span>
            <div className="text-left">
              <p className="font-semibold text-[15px] text-foreground">Enviar da galeria</p>
              <p className="text-[13px] text-muted-foreground">Escolher uma foto existente</p>
            </div>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default QuestionRenderer;
