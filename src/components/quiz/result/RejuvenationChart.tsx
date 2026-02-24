import React from 'react';

interface RejuvenationChartProps {
  skinAge: number;
}

export default function RejuvenationChart({ skinAge }: RejuvenationChartProps) {
  const targetAge = Math.max(18, skinAge - 4);

  return (
    <div className="w-full h-[200px] mt-4 relative">
      <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
        <defs>
          {/* Gradiente para o efeito de preenchimento abaixo da curva */}
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4E6B57" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#4E6B57" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Linha de fundo (Idade Cronológica) - Tracejada sutil */}
        <line 
          x1="40" y1="160" x2="360" y2="160" 
          stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" 
        />
        
        {/* Curva de Rejuvenescimento (Idade Biológica) */}
        <path
          d="M 40 140 Q 200 135, 360 60"
          fill="none"
          stroke="#4E6B57"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Preenchimento degradê abaixo da curva */}
        <path
          d="M 40 140 Q 200 135, 360 60 L 360 160 L 40 160 Z"
          fill="url(#chartGradient)"
        />

        {/* Pontos de destaque */}
        <circle cx="40" cy="140" r="6" fill="#4E6B57" stroke="white" strokeWidth="2" />
        <circle cx="360" cy="60" r="6" fill="#4E6B57" stroke="white" strokeWidth="2" />

        {/* Textos de Idade */}
        <text x="35" y="125" className="text-[14px] font-bold fill-[#4E6B57]">{skinAge} anos</text>
        <text x="355" y="45" className="text-[14px] font-bold fill-[#4E6B57]">{targetAge} anos</text>

        {/* Eixo X Labels */}
        <text x="40" y="185" textAnchor="middle" className="text-[11px] fill-muted-foreground uppercase tracking-tighter">Hoje</text>
        <text x="360" y="185" textAnchor="middle" className="text-[11px] fill-muted-foreground uppercase tracking-tighter">20 Dias</text>
      </svg>
    </div>
  );
}