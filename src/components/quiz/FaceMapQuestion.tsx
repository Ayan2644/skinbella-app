import { useRef, useEffect, useState } from 'react';
import type { QuizQuestion, FaceRegion } from '@/lib/quizData';
import faceImage from '@/assets/face-map-female.png';

interface Props {
  question: QuizQuestion;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}

/* Coordinates relative to SVG viewBox 320×400 */
const REGION_COORDS: Record<FaceRegion, { x: number; y: number }> = {
  whole_face: { x: 160, y: 200 },
  forehead:   { x: 160, y: 75 },
  eyebrows:   { x: 160, y: 115 },
  eyes:       { x: 160, y: 140 },
  nose:       { x: 160, y: 195 },
  mouth:      { x: 160, y: 245 },
  neck:       { x: 160, y: 320 },
};

export default function FaceMapQuestion({ question, value, onChange }: Props) {
  const selected = value ?? [];
  const optionsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [optionPositions, setOptionPositions] = useState<{ y: number }[]>([]);

  const options = question.options ?? [];

  /* Measure option Y positions relative to the SVG area */
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const positions = optionsRef.current.map((el) => {
        if (!el) return { y: 200 };
        const rect = el.getBoundingClientRect();
        const relativeY = ((rect.top + rect.height / 2 - containerRect.top) / containerRect.height) * 400;
        return { y: relativeY };
      });
      setOptionPositions(positions);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [options.length]);

  const toggle = (val: string) => {
    const next = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];
    onChange(next);
  };

  const buildPath = (optionY: number, region: FaceRegion) => {
    const target = REGION_COORDS[region] ?? REGION_COORDS.whole_face;
    const startX = 320;
    const cp1x = 260;
    const cp2x = 200;
    return `M ${startX} ${optionY} C ${cp1x} ${optionY}, ${cp2x} ${target.y}, ${target.x} ${target.y}`;
  };

  return (
    <div ref={containerRef} className="flex gap-4 items-stretch w-full min-h-[400px]">
      {/* Face image with SVG overlay */}
      <div className="relative w-[40%] flex-shrink-0">
        <svg
          viewBox="0 0 320 400"
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 2 }}
        >
          {/* Background lines (gray) */}
          {options.map((opt, i) => {
            const region = opt.faceRegion ?? 'whole_face';
            const optY = optionPositions[i]?.y ?? 200;
            return (
              <path
                key={`bg-${opt.value}`}
                d={buildPath(optY, region)}
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="1.5"
                opacity="0.4"
              />
            );
          })}

          {/* Active lines (animated) */}
          {options.map((opt, i) => {
            const region = opt.faceRegion ?? 'whole_face';
            const isActive = selected.includes(opt.value);
            const optY = optionPositions[i]?.y ?? 200;
            const target = REGION_COORDS[region] ?? REGION_COORDS.whole_face;
            return (
              <g key={`active-${opt.value}`}>
                <path
                  d={buildPath(optY, region)}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  pathLength="1"
                  strokeDasharray="1"
                  strokeDashoffset={isActive ? 0 : 1}
                  style={{
                    transition: 'stroke-dashoffset 0.4s ease-out',
                  }}
                />
                <circle
                  cx={target.x}
                  cy={target.y}
                  r="6"
                  fill="hsl(var(--primary))"
                  opacity={isActive ? 1 : 0}
                  style={{
                    transform: isActive ? 'scale(1)' : 'scale(0)',
                    transformOrigin: `${target.x}px ${target.y}px`,
                    transition: 'transform 0.3s ease-out 0.3s, opacity 0.2s ease-out 0.3s',
                  }}
                />
                {isActive && (
                  <circle
                    cx={target.x}
                    cy={target.y}
                    r="12"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="1.5"
                    opacity="0.4"
                    style={{
                      transform: 'scale(1)',
                      transformOrigin: `${target.x}px ${target.y}px`,
                      transition: 'transform 0.4s ease-out 0.35s',
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>
        <img
          src={faceImage}
          alt="Face map"
          className="w-full h-full object-contain rounded-2xl"
          style={{ zIndex: 1, position: 'relative' }}
        />
      </div>

      {/* Options list */}
      <div className="flex-1 flex flex-col justify-center gap-3">
        {options.map((opt, i) => {
          const isActive = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              ref={(el) => { optionsRef.current[i] = el; }}
              onClick={() => toggle(opt.value)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                border-2
                ${isActive
                  ? 'border-primary bg-primary/10 shadow-md'
                  : 'border-border bg-card hover:border-primary/40'
                }
              `}
            >
              {opt.emoji && <span className="text-xl">{opt.emoji}</span>}
              <div className="flex-1">
                <span className={`font-medium text-sm ${isActive ? 'text-primary' : 'text-foreground'}`}>
                  {opt.label}
                </span>
                {opt.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                )}
              </div>
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                ${isActive ? 'border-primary bg-primary' : 'border-muted-foreground/30'}
              `}>
                {isActive && (
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path d="M2 5 L4 7 L8 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
