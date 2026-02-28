import { useRef, useEffect, useState, useCallback } from 'react';
import type { QuizQuestion, FaceRegion } from '@/lib/quizData';
import faceImage from '@/assets/face-map-female.png';

interface Props {
  question: QuizQuestion;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}

/*
 * Face region coordinates as PERCENTAGES of the face image dimensions.
 * These are calibrated for the 3/4 profile photo (face turned slightly left).
 * x% from left of face image, y% from top of face image.
 */
const FACE_REGIONS: Record<FaceRegion, { xPct: number; yPct: number }> = {
  whole_face: { xPct: 58, yPct: 40 },
  forehead:   { xPct: 65, yPct: 16 },
  eyebrows:   { xPct: 72, yPct: 27 },
  eyes:       { xPct: 73, yPct: 35 },
  nose:       { xPct: 60, yPct: 50 },
  mouth:      { xPct: 55, yPct: 64 },
  neck:       { xPct: 50, yPct: 80 },
};

export default function FaceMapQuestion({ question, value, onChange }: Props) {
  const selected = value ?? [];
  const options = question.options ?? [];

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [lines, setLines] = useState<
    { x1: number; y1: number; x2: number; y2: number; region: FaceRegion }[]
  >([]);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    const cRect = container.getBoundingClientRect();
    const iRect = image.getBoundingClientRect();

    const newLines = options.map((opt, i) => {
      const region = (opt.faceRegion ?? 'whole_face') as FaceRegion;
      const coords = FACE_REGIONS[region] ?? FACE_REGIONS.whole_face;

      // Target point on the face image (absolute → relative to container)
      const x1 = iRect.left - cRect.left + iRect.width * (coords.xPct / 100);
      const y1 = iRect.top - cRect.top + iRect.height * (coords.yPct / 100);

      // Source point: left edge center of the option button
      const btn = optionRefs.current[i];
      let x2 = cRect.width * 0.5;
      let y2 = cRect.height * 0.5;
      if (btn) {
        const bRect = btn.getBoundingClientRect();
        x2 = bRect.left - cRect.left;
        y2 = bRect.top - cRect.top + bRect.height / 2;
      }

      return { x1, y1, x2, y2, region };
    });

    setLines(newLines);
  }, [options]);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    // Re-measure after image loads
    const img = imageRef.current;
    if (img) {
      img.addEventListener('load', measure);
    }
    return () => {
      window.removeEventListener('resize', measure);
      if (img) img.removeEventListener('load', measure);
    };
  }, [measure]);

  // Re-measure when options change
  useEffect(() => {
    const timer = setTimeout(measure, 100);
    return () => clearTimeout(timer);
  }, [options.length, measure]);

  const toggle = (val: string) => {
    const next = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];
    onChange(next);
  };

  const buildPath = (line: typeof lines[0]) => {
    const { x1, y1, x2, y2 } = line;
    const midX = x1 + (x2 - x1) * 0.6;
    return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
  };

  return (
    <div ref={containerRef} className="relative flex items-stretch w-full gap-0" style={{ minHeight: 400 }}>
      {/* Face image */}
      <div className="w-[42%] flex-shrink-0 self-stretch relative">
        <img
          ref={imageRef}
          src={faceImage}
          alt="Face map"
          className="w-full h-full object-cover object-top rounded-l-2xl"
          draggable={false}
        />
      </div>

      {/* Options */}
      <div className="flex-1 flex flex-col justify-center gap-2 pl-4 py-2 relative" style={{ zIndex: 3 }}>
        {options.map((opt, i) => {
          const isActive = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              ref={(el) => { optionRefs.current[i] = el; }}
              onClick={() => toggle(opt.value)}
              className={`
                flex items-center justify-between px-4 py-2.5 rounded-xl text-left transition-all duration-200
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

      {/* SVG overlay for connection lines — covers entire container */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 2 }}
      >
        {lines.map((line, i) => {
          const opt = options[i];
          if (!opt) return null;
          const isActive = selected.includes(opt.value);
          const path = buildPath(line);

          return (
            <g key={opt.value}>
              {/* Background line */}
              <path
                d={path}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                opacity="0.35"
              />
              {/* Active line */}
              <path
                d={path}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={isActive ? 0 : 1}
                style={{ transition: 'stroke-dashoffset 0.4s ease-out' }}
              />
              {/* Dot on face */}
              <circle
                cx={line.x1}
                cy={line.y1}
                r="4"
                fill="white"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
                opacity={isActive ? 1 : 0}
                style={{
                  transform: isActive ? 'scale(1)' : 'scale(0)',
                  transformOrigin: `${line.x1}px ${line.y1}px`,
                  transition: 'transform 0.3s ease-out 0.3s, opacity 0.2s ease-out 0.3s',
                }}
              />
              {/* Outer ring */}
              {isActive && (
                <circle
                  cx={line.x1}
                  cy={line.y1}
                  r="9"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  opacity="0.3"
                  style={{
                    transformOrigin: `${line.x1}px ${line.y1}px`,
                    transition: 'transform 0.4s ease-out 0.35s',
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
