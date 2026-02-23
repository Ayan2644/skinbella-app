interface RejuvenationChartProps {
  skinAge: number;
}

export default function RejuvenationChart({ skinAge }: RejuvenationChartProps) {
  const targetAge = Math.max(skinAge - 5, 18);
  const midAge = Math.round(skinAge - 2);

  // Chart dimensions (expanded)
  const w = 420;
  const h = 200;
  const px = 44;
  const py = 24;
  const chartW = w - px * 2;
  const chartH = h - py * 2 - 16;

  // Y scale (inverted — lower age = higher on chart)
  const yMin = targetAge - 2;
  const yMax = skinAge + 2;
  const yScale = (age: number) => py + chartH * ((age - yMin) / (yMax - yMin));

  // Points
  const p1 = { x: px, y: yScale(skinAge) };
  const p2 = { x: px + chartW / 2, y: yScale(midAge) };
  const p3 = { x: px + chartW, y: yScale(targetAge) };

  // Bézier curve path
  const curvePath = `M ${p1.x} ${p1.y} C ${p1.x + chartW * 0.25} ${p1.y}, ${p2.x - chartW * 0.15} ${p2.y}, ${p2.x} ${p2.y} C ${p2.x + chartW * 0.15} ${p2.y}, ${p3.x - chartW * 0.25} ${p3.y}, ${p3.x} ${p3.y}`;

  // Filled area path (curve + bottom edge)
  const areaPath = `${curvePath} L ${p3.x} ${py + chartH} L ${p1.x} ${py + chartH} Z`;

  // Dashed line (gold — chronological age, stays flat)
  const flatY = yScale(skinAge - 1);
  const dashPath = `M ${px} ${flatY} L ${px + chartW} ${flatY}`;

  // Grid lines
  const gridAges = [skinAge, midAge, targetAge];

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: 240 }}>
        <defs>
          <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4E6B57" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#4E6B57" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridAges.map((age) => (
          <g key={age}>
            <line
              x1={px} y1={yScale(age)} x2={px + chartW} y2={yScale(age)}
              stroke="rgba(0,0,0,0.06)" strokeWidth={1}
            />
            <text x={px - 8} y={yScale(age) + 4} textAnchor="end" fontSize={12} fill="#9B9B9B" fontFamily="Inter">
              {age}
            </text>
          </g>
        ))}

        {/* Gradient fill under green curve */}
        <path d={areaPath} fill="url(#curveGradient)" />

        {/* Dashed gold line (idade cronológica) */}
        <path d={dashPath} stroke="#C8A96B" strokeWidth={2} strokeDasharray="6 4" fill="none" opacity={0.5} />

        {/* Green curve (idade biológica com protocolo) */}
        <path d={curvePath} stroke="#4E6B57" strokeWidth={3.5} fill="none" strokeLinecap="round" />

        {/* Points */}
        <circle cx={p1.x} cy={p1.y} r={6} fill="#4E6B57" />
        <circle cx={p3.x} cy={p3.y} r={6} fill="#4E6B57" />

        {/* X-axis labels */}
        <text x={px} y={h - 4} textAnchor="middle" fontSize={13} fill="#4E6B57" fontFamily="Inter" fontWeight="600">Hoje</text>
        <text x={px + chartW / 2} y={h - 4} textAnchor="middle" fontSize={12} fill="#9B9B9B" fontFamily="Inter">Dia 10</text>
        <text x={px + chartW} y={h - 4} textAnchor="middle" fontSize={13} fill="#4E6B57" fontFamily="Inter" fontWeight="600">20 dias</text>
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-[3px] rounded-full" style={{ backgroundColor: '#4E6B57' }} />
          Idade Biológica
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-[2px] rounded-full border-t-2 border-dashed" style={{ borderColor: '#C8A96B' }} />
          Idade Cronológica
        </span>
      </div>
    </div>
  );
}
