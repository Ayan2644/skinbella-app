import { useRef, useEffect, useState } from 'react';
import type { QuizQuestion, FaceRegion } from '@/lib/quizData';
import faceImage from '@/assets/face-map-female.png';

interface Props {
  question: QuizQuestion;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}

/* Coordinates relative to SVG viewBox 320×500 — tuned for the 3/4 profile photo */
const REGION_COORDS: Record<FaceRegion, { x: number; y: number }> = {
  whole_face: { x: 120, y: 220 },
  forehead:   { x: 130, y: 65 },
  eyebrows:   { x: 145, y: 120 },
  eyes:       { x: 150, y: 155 },
  nose:       { x: 135, y: 230 },
  mouth:      { x: 125, y: 300 },
  neck:       { x: 110, y: 400 },
};

export default function FaceMapQuestion({ question, value, onChange }: Props) {
  const selected = value ?? [];
  const optionsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [optionPositions, setOptionPositions] = useState<{ y: number }[]>([]);

  const options = question.options ?? [];

  useEffect(() => {
    const measure = () => {
      if (!wrapperRef.current) return;
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const positions = optionsRef.current.map((el) => {
        if (!el) return { y: 250 };
        const rect = el.getBoundingClientRect();
        const relativeY = ((rect.top + rect.height / 2 - wrapperRect.top) / wrapperRect.height) * 500;
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
    const cp1x = 270;
    const cp2x = 190;
    return `M ${startX} ${optionY} C ${cp1x} ${optionY}, ${cp2x} ${target.y}, ${target.x} ${target.y}`;
  };

  return (
    <div ref={wrapperRef} className="flex items-stretch w-full gap-0" style={{ minHeight: 420 }}>
      {/* Left: face photo with SVG overlay */}
      <div className="relative w-[42%] flex-shrink-0 self-stretch">
        <img
          src={faceImage}
          alt="Face map"
          className="w-full h-full object-cover object-top rounded-l-2xl"
          draggable={false}
        />

        {/* SVG overlay spanning the FULL width of the wrapper */}
        <svg
          viewBox="0 0 320 500"
          className="absolute inset-0 pointer-events-none overflow-visible"
          style={{ zIndex: 2, width: '238%', height: '100%' }}
          preserveAspectRatio="none"
        >
          {/* Background lines */}
          {options.map((opt, i) => {
            const region = opt.faceRegion ?? 'whole_face';
            const optY = optionPositions[i]?.y ?? 250;
            return (
              <path
                key={`bg-${opt.value}`}
                d={buildPath(optY, region)}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.8"
                opacity="0.4"
              />
            );
          })}

          {/* Active lines */}
          {options.map((opt, i) => {
            const region = opt.faceRegion ?? 'whole_face';
            const isActive = selected.includes(opt.value);
            const optY = optionPositions[i]?.y ?? 250;
            const target = REGION_COORDS[region] ?? REGION_COORDS.whole_face;
            return (
              <g key={`active-${opt.value}`}>
                <path
                  d={buildPath(optY, region)}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1.2"
                  pathLength="1"
                  strokeDasharray="1"
                  strokeDashoffset={isActive ? 0 : 1}
                  style={{ transition: 'stroke-dashoffset 0.4s ease-out' }}
                />
                <circle
                  cx={target.x}
                  cy={target.y}
                  r="4"
                  fill="white"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1.5"
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
                    r="8"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="1"
                    opacity="0.3"
                    style={{
                      transformOrigin: `${target.x}px ${target.y}px`,
                      transition: 'transform 0.4s ease-out 0.35s',
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Right: options */}
      <div className="flex-1 flex flex-col justify-center gap-2 pl-4 py-2" style={{ zIndex: 3 }}>
        {options.map((opt, i) => {
          const isActive = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              ref={(el) => { optionsRef.current[i] = el; }}
              onClick={() => toggle(opt.value)}
              className={`
                flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200
                border
                ${isActive
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-card/80 hover:border-primary/30'
                }
              `}
            >
              <span className={`font-medium text-sm ${isActive ? 'text-primary' : 'text-foreground'}`}>
                {opt.label}
              </span>
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0
                ${isActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'}
              `}>
                {isActive && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
