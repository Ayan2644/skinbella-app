interface RejuvenationChartProps {
  skinAge: number;
}

export default function RejuvenationChart({ skinAge }: RejuvenationChartProps) {
  const targetAge = Math.max(skinAge - 5, 18);
  const midAge = Math.round(skinAge - 2);

  // Chart dimensions
  const w = 320;
  const h = 160;
  const px = 40; // padding x
  const py = 20; // padding y
  const chartW = w - px * 2;
  const chartH = h - py * 2;

  // Y scale (inverted — lower age = higher on chart)
  const yMin = targetAge - 2;
  const yMax = skinAge + 2;
  const yScale = (age: number) => py + chartH * ((age - yMin) / (yMax - yMin));

  // Points
  const p1 = { x: px, y: yScale(skinAge) };
  const p2 = { x: px + chartW / 2, y: yScale(midAge) };
  const p3 = { x: px + chartW, y: yScale(targetAge) };

  // Bézier curve (green — with protocol)
  const curvePath = `M ${p1.x} ${p1.y} C ${p1.x + chartW * 0.25} ${p1.y}, ${p2.x - chartW * 0.15} ${p2.y}, ${p2.x} ${p2.y} C ${p2.x + chartW * 0.15} ${p2.y}, ${p3.x - chartW * 0.25} ${p3.y}, ${p3.x} ${p3.y}`;

  // Dashed line (gold — without protocol, stays flat)
  const flatY = yScale(skinAge - 1);
  const dashPath = `M ${px} ${flatY} L ${px + chartW} ${flatY}`;

  // Grid lines
  const gridAges = [skinAge, midAge, targetAge];

  return (
    <div className="result-card-premium p-4" style={{ background: 'linear-gradient(145deg, #FDFBF8, #F3EEE8)' }}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: 180 }}>
        {/* Grid lines */}
        {gridAges.map((age) => (
          <g key={age}>
            <line
              x1={px} y1={yScale(age)} x2={px + chartW} y2={yScale(age)}
              stroke="rgba(0,0,0,0.06)" strokeWidth={1}
            />
            <text x={px - 6} y={yScale(age) + 4} textAnchor="end" fontSize={10} fill="#9B9B9B" fontFamily="Inter">
              {age}
            </text>
          </g>
        ))}

        {/* Dashed gold line (sem protocolo) */}
        <path d={dashPath} stroke="#C8A96B" strokeWidth={2} strokeDasharray="6 4" fill="none" opacity={0.5} />

        {/* Green curve (com protocolo) */}
        <path d={curvePath} stroke="#4E6B57" strokeWidth={3} fill="none" strokeLinecap="round" />

        {/* Points */}
        <circle cx={p1.x} cy={p1.y} r={5} fill="#4E6B57" />
        <circle cx={p3.x} cy={p3.y} r={5} fill="#4E6B57" />

        {/* X-axis labels */}
        <text x={px} y={h - 2} textAnchor="middle" fontSize={11} fill="#9B9B9B" fontFamily="Inter">Dia 1</text>
        <text x={px + chartW / 2} y={h - 2} textAnchor="middle" fontSize={11} fill="#9B9B9B" fontFamily="Inter">Dia 10</text>
        <text x={px + chartW} y={h - 2} textAnchor="middle" fontSize={11} fill="#9B9B9B" fontFamily="Inter">Dia 20</text>
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-[3px] rounded-full" style={{ backgroundColor: '#4E6B57' }} />
          Com protocolo
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-[2px] rounded-full border-t-2 border-dashed" style={{ borderColor: '#C8A96B' }} />
          Sem protocolo
        </span>
      </div>
    </div>
  );
}
