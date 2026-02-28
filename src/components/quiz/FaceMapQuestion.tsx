import { useRef, useEffect, useState } from 'react';
import type { QuizQuestion, FaceRegion } from '@/lib/quizData';
import faceImage from '@/assets/face-map-female.png';

interface Props {
  question: QuizQuestion;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}

/* Coordinates relative to SVG viewBox 400×500 — tuned for a 3/4 face photo */
const REGION_COORDS: Record<FaceRegion, { x: number; y: number }> = {
  whole_face: { x: 180, y: 230 },
  forehead:   { x: 195, y: 95 },
  eyebrows:   { x: 210, y: 145 },
  eyes:       { x: 215, y: 175 },
  nose:       { x: 200, y: 240 },
  mouth:      { x: 195, y: 305 },
  neck:       { x: 185, y: 395 },
};

export default function FaceMapQuestion({ question, value, onChange }: Props) {
  const selected = value ?? [];
  const optionsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [optionPositions, setOptionPositions] = useState<{ y: number }[]>([]);

  const options = question.options ?? [];

  /* Measure option Y positions relative to the container mapped to SVG viewBox */
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const positions = optionsRef.current.map((el) => {
        if (!el) return { y: 250 };
        const rect = el.getBoundingClientRect();
        const relativeY = ((rect.top + rect.height / 2 - containerRect.top) / containerRect.height) * 500;
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
    // Line starts from right edge (option side) and curves to the face point
    const startX = 400;
    const cp1x = 340;
    const cp2x = 260;
    return `M ${startX} ${optionY} C ${cp1x} ${optionY}, ${cp2x} ${target.y}, ${target.x} ${target.y}`;
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-[560px] mx-auto" style={{ minHeight: 420 }}>
      {/* Face image — left side, absolute positioned */}
      <div className="absolute left-0 top-0 bottom-0 w-[45%] pointer-events-none select-none">
        <img
          src={faceImage}
          alt="Face map"
          className="w-full h-full object-cover object-top rounded-2xl"
          draggable={false}
        />
      </div>

      {/* SVG overlay for lines — covers the full area */}
      <svg
        viewBox="0 0 400 500"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 2 }}
        preserveAspectRatio="none"
      >
        {/* Background lines (subtle) */}
        {options.map((opt, i) => {
          const region = opt.faceRegion ?? 'whole_face';
          const optY = optionPositions[i]?.y ?? 250;
          return (
            <path
              key={`bg-${opt.value}`}
              d={buildPath(optY, region)}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.5"
            />
          );
        })}

        {/* Active lines (animated) */}
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
                strokeWidth="1.5"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={isActive ? 0 : 1}
                style={{
                  transition: 'stroke-dashoffset 0.4s ease-out',
                }}
              />
              {/* Dot on face */}
              <circle
                cx={target.x}
                cy={target.y}
                r="5"
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
              {/* Outer ring */}
              {isActive && (
                <circle
                  cx={target.x}
                  cy={target.y}
                  r="10"
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

        {/* Small dots at option connection points */}
        {options.map((opt, i) => {
          const optY = optionPositions[i]?.y ?? 250;
          const isActive = selected.includes(opt.value);
          return (
            <circle
              key={`dot-${opt.value}`}
              cx="400"
              cy={optY}
              r="3"
              fill={isActive ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
              style={{ transition: 'fill 0.2s ease' }}
            />
          );
        })}
      </svg>

      {/* Options list — right side */}
      <div className="relative ml-[46%] flex flex-col justify-center gap-2 py-2" style={{ zIndex: 3, minHeight: 420 }}>
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
