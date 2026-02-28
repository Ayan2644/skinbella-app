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
 * Calibrated for the 3/4 profile photo — shifted DOWN to match actual facial features.
 */
const FACE_REGIONS: Record<FaceRegion, { xPct: number; yPct: number }> = {
  whole_face: { xPct: 55, yPct: 42 },
  forehead:   { xPct: 60, yPct: 22 },
  eyebrows:   { xPct: 58, yPct: 32 },
  eyes:       { xPct: 62, yPct: 39 },
  nose:       { xPct: 52, yPct: 53 },
  mouth:      { xPct: 46, yPct: 65 },
  neck:       { xPct: 38, yPct: 95 },
};

/* SVG path for face contour outline (relative to image %, will be scaled) */
const FACE_CONTOUR_POINTS = [
  { x: 48, y: 10 },   // top of forehead center
  { x: 58, y: 8 },    // forehead right
  { x: 68, y: 12 },
  { x: 76, y: 20 },   // temple right
  { x: 80, y: 30 },
  { x: 78, y: 40 },   // cheekbone
  { x: 72, y: 50 },   // cheek
  { x: 64, y: 60 },   // jaw
  { x: 54, y: 68 },   // chin side
  { x: 46, y: 72 },   // chin bottom
  { x: 38, y: 68 },   // chin left
  { x: 30, y: 60 },   // jaw left
  { x: 26, y: 50 },   // cheek left
  { x: 26, y: 40 },
  { x: 30, y: 30 },   // temple left
  { x: 36, y: 20 },
  { x: 42, y: 12 },
  { x: 48, y: 10 },   // close
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
      // "Whole face" toggles: if already selected, deselect it; otherwise select ONLY it
      if (selected.includes('rosto_todo')) {
        onChange([]);
      } else {
        onChange(['rosto_todo']);
      }
      return;
    }
    // If selecting a specific region, remove "rosto_todo" if present
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

  // Build face contour SVG path from percentage points
  const buildContourPath = () => {
    if (!imgRect) return '';
    const points = FACE_CONTOUR_POINTS.map((p) => ({
      x: imgRect.left + imgRect.width * (p.x / 100),
      y: imgRect.top + imgRect.height * (p.y / 100),
    }));
    if (points.length < 3) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx1 = prev.x + (curr.x - prev.x) * 0.5;
      const cpy1 = prev.y;
      const cpx2 = prev.x + (curr.x - prev.x) * 0.5;
      const cpy2 = curr.y;
      path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
    }
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
          const isWholeOpt = opt.value === 'rosto_todo';
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
        {/* Face contour when "whole face" is selected */}
        {isWholeface && (
          <path
            d={buildContourPath()}
            fill="hsl(var(--primary) / 0.08)"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="0"
            style={{
              transition: 'stroke-dashoffset 0.6s ease-out',
            }}
          />
        )}

        {/* Connection lines for individual regions */}
        {lines.map((line, i) => {
          const opt = options[i];
          if (!opt || opt.value === 'rosto_todo') return null;
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
                opacity={isWholeface ? 0 : 0.35}
                style={{ transition: 'opacity 0.3s ease' }}
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
