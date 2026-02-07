import { useState, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import type { QuizQuestion } from '@/lib/quizData';
import { Camera, Upload } from 'lucide-react';

interface QuestionRendererProps {
  question: QuizQuestion;
  value: any;
  onChange: (value: any) => void;
}

const QuestionRenderer = ({ question, value, onChange }: QuestionRendererProps) => {
  switch (question.type) {
    case 'cards-emoji':
      return <CardsEmojiQuestion question={question} value={value} onChange={onChange} />;
    case 'cards-image':
      return <CardsImageQuestion question={question} value={value} onChange={onChange} />;
    case 'chips':
      return <ChipsQuestion question={question} value={value} onChange={onChange} />;
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

function CardsEmojiQuestion({ question, value, onChange }: QuestionRendererProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {question.options?.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`quiz-card flex flex-col items-center gap-2 py-5 ${value === opt.value ? 'selected' : ''}`}
        >
          <span className="text-2xl">{opt.emoji}</span>
          <span className="text-sm font-medium text-card-foreground">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

function CardsImageQuestion({ question, value, onChange }: QuestionRendererProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {question.options?.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`quiz-card flex flex-col items-center gap-3 py-6 ${value === opt.value ? 'selected' : ''}`}
        >
          <span className="text-3xl">{opt.emoji}</span>
          <span className="text-sm font-medium text-card-foreground">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

function ChipsQuestion({ question, value, onChange }: QuestionRendererProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {question.options?.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 border ${
            value === opt.value
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card text-card-foreground border-border hover:border-primary/40'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function MultiChipsQuestion({ question, value, onChange }: { question: QuizQuestion; value?: string[]; onChange: (v: string[]) => void }) {
  const selected = value ?? [];
  const toggle = (v: string) => {
    onChange(selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v]);
  };
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {question.options?.map((opt) => (
        <button
          key={opt.value}
          onClick={() => toggle(opt.value)}
          className={`px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 border ${
            selected.includes(opt.value)
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card text-card-foreground border-border hover:border-primary/40'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function SliderQuestion({ question, value, onChange }: QuestionRendererProps) {
  const val = value ?? question.sliderMin ?? 0;
  return (
    <div className="space-y-6 px-4">
      <div className="text-center">
        <span className="text-4xl font-bold text-primary font-['Playfair_Display']">{val}</span>
        <span className="text-lg text-muted-foreground">{question.sliderUnit}</span>
      </div>
      <Slider
        value={[val]}
        onValueChange={([v]) => onChange(v)}
        min={question.sliderMin ?? 0}
        max={question.sliderMax ?? 10}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{question.sliderMin ?? 0}</span>
        <span>{question.sliderMax ?? 10}</span>
      </div>
    </div>
  );
}

function SelfieQuestion({ value, onChange }: { value: any; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreview(url);
      onChange(url);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {preview ? (
        <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-primary/30">
          <img src={preview} alt="Selfie" className="w-full h-full object-cover" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 -translate-x-1/2 w-48 h-64 border border-accent/40 rounded-[50%]" />
            <div className="absolute w-full h-0.5 bg-accent/50 animate-scan-line" />
          </div>
          <button
            onClick={() => { setPreview(null); onChange(''); }}
            className="absolute bottom-2 right-2 px-3 py-1 rounded-xl bg-card/80 text-xs font-medium text-card-foreground backdrop-blur-sm"
          >
            Refazer
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-full max-w-xs">
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
            className="quiz-card flex items-center justify-center gap-3 py-8"
          >
            <Camera className="w-6 h-6 text-primary" />
            <span className="font-medium text-card-foreground">Tirar foto</span>
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="quiz-card flex items-center justify-center gap-3 py-8"
          >
            <Upload className="w-6 h-6 text-primary" />
            <span className="font-medium text-card-foreground">Enviar foto</span>
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
