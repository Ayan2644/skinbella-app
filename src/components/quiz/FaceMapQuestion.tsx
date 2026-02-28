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
 * Calibrated for the 3/4 profile photo.
 */
const FACE_REGIONS: Record<FaceRegion, { xPct: number; yPct: number }> = {
  whole_face: { xPct: 50, yPct: 45 },
  forehead:   { xPct: 58, yPct: 30 },
  eyebrows:   { xPct: 55, yPct: 38 },
  eyes:       { xPct: 58, yPct: 44 },
  nose:       { xPct: 48, yPct: 55 },
  mouth:      { xPct: 42, yPct: 68 },
  neck:       { xPct: 38, yPct: 82 },
};

/* Face contour as % of image — smoother oval following the jaw/forehead */
const FACE_CONTOUR_POINTS = [
  { x: 48, y: 20 },
  { x: 56, y: 17 },
  { x: 65, y: 18 },
  { x: 73, y: 23 },
  { x: 79, y: 31 },
  { x: 82, y: 41 },
  { x: 79, y: 51 },
  { x: 72, y: 59 },
  { x: 62, y: 65 },
  { x: 52, y: 71 },
  { x: 42, y: 76 },
  { x: 33, y: 73 },
  { x: 26, y: 66 },
  { x: 21, y: 57 },
  { x: 19, y: 47 },
  { x: 21, y: 37 },
  { x: 26, y: 29 },
  { x: 34, y: 22 },
  { x: 42, y: 19 },
  { x: 48, y: 20 },
];

export default function FaceMapQuestion({ question, value, onChange }: Props) {
  const selected = value ?? [];
  const options = question.options ?? [];

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [lines, setLines] = useState<
    { x1: number; y1: number; x2: number; y2: number; region: FaceRegion }[]
  >([]);
  const [imgRect, setImgRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  const isWholeface = selected.includes('rosto_todo');

  const measure = useCallback(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    const cRect = container.getBoundingClientRect();
    const iRect = image.getBoundingClientRect();

    setImgRect({
      left: iRect.left - cRect.left,
      top: iRect.top - cRect.top,
      width: iRect.width,
      height: iRect.height,
    });

    const newLines = options.map((opt, i) => {
      const region = (opt.faceRegion ?? 'whole_face') as FaceRegion;
      const coords = FACE_REGIONS[region] ?? FACE_REGIONS.whole_face;

      const x1 = iRect.left - cRect.left + iRect.width * (coords.xPct / 100);
      const y1 = iRect.top - cRect.top + iRect.height * (coords.yPct / 100);

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
    const img = imageRef.current;
    if (img) img.addEventListener('load', measure);
    return () => {
      window.removeEventListener('resize', measure);
      if (img) img.removeEventListener('load', measure);
    };
  }, [measure]);

  useEffect(() => {
    const timer = setTimeout(measure, 100);
    return () => clearTimeout(timer);
  }, [options.length, measure]);

  const toggle = (val: string) => {
    if (val === 'rosto_todo') {
      if (selected.includes('rosto_todo')) {
        onChange([]);
      } else {
        onChange(['rosto_todo']);
      }
      return;
    }
    let next = selected.filter((v) => v !== 'rosto_todo');
    if (next.includes(val)) {
      next = next.filter((v) => v !== val);
    } else {
      next = [...next, val];
    }
    onChange(next);
  };

  const buildPath = (line: typeof lines[0]) => {
    const { x1, y1, x2, y2 } = line;
    const midX = x1 + (x2 - x1) * 0.6;
    return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
  };

  // Build smooth closed contour path using catmull-rom-like curves
  const buildContourPath = () => {
    if (!imgRect) return '';
    const pts = FACE_CONTOUR_POINTS.map((p) => ({
      x: imgRect.left + imgRect.width * (p.x / 100),
      y: imgRect.top + imgRect.height * (p.y / 100),
    }));
    if (pts.length < 3) return '';

    // Smooth closed path using quadratic bezier through midpoints
    let path = `M ${(pts[0].x + pts[1].x) / 2} ${(pts[0].y + pts[1].y) / 2}`;
    for (let i = 1; i < pts.length; i++) {
      const curr = pts[i];
      const next = pts[(i + 1) % pts.length];
      const midX = (curr.x + next.x) / 2;
      const midY = (curr.y + next.y) / 2;
      path += ` Q ${curr.x} ${curr.y}, ${midX} ${midY}`;
    }
    path += ' Z';
    return path;
  };

  return (
    <div ref={containerRef} className="relative flex items-stretch w-full gap-0" style={{ minHeight: 420 }}>
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

      {/* SVG overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 2 }}
      >
        {/* Face contour — ALWAYS rendered, animated via strokeDashoffset */}
        <path
          d={buildContourPath()}
          fill={isWholeface ? 'hsl(var(--primary) / 0.06)' : 'none'}
          stroke="hsl(var(--primary))"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={isWholeface ? 0 : 1}
          style={{
            transition: 'stroke-dashoffset 0.6s ease-in-out, fill 0.3s ease',
          }}
        />

        {/* Background lines (gray, always visible unless whole face) */}
        {lines.map((line, i) => {
          const opt = options[i];
          if (!opt || opt.value === 'rosto_todo') return null;
          return (
            <path
              key={`bg-${opt.value}`}
              d={buildPath(line)}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity={isWholeface ? 0 : 0.35}
              style={{ transition: 'opacity 0.3s ease' }}
            />
          );
        })}

        {/* Active lines (colored, drawn on click) */}
        {lines.map((line, i) => {
          const opt = options[i];
          if (!opt || opt.value === 'rosto_todo') return null;
          const isActive = selected.includes(opt.value);

          return (
            <g key={`active-${opt.value}`}>
              {/* Colored line — always rendered, animated */}
              <path
                d={buildPath(line)}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={isActive ? 0 : 1}
                style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
              />
              {/* Dot on face — always rendered, animated via opacity/scale */}
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
                  transition: 'transform 0.3s ease-out 0.35s, opacity 0.2s ease-out 0.35s',
                }}
              />
              {/* Outer ring */}
              <circle
                cx={line.x1}
                cy={line.y1}
                r="9"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                opacity={isActive ? 0.3 : 0}
                style={{
                  transform: isActive ? 'scale(1)' : 'scale(0)',
                  transformOrigin: `${line.x1}px ${line.y1}px`,
                  transition: 'transform 0.4s ease-out 0.4s, opacity 0.3s ease-out 0.4s',
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
