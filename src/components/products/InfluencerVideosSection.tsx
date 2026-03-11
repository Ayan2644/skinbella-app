import { useState, useRef } from 'react';

interface Video {
  id: string;
  title: string;
}

interface InfluencerVideosSectionProps {
  videos: Video[];
  animationDelay?: number;
}

// Dimensões do card visual
const CARD_W = 160;
const CARD_H = Math.round(CARD_W * (16 / 9)); // 284px — proporção 9:16
const CARD_GAP = 12;

// Iframe renderizado em 2× para que a UI do YouTube apareça menor após scale(0.5)
const IFRAME_W = CARD_W * 2; // 320
const IFRAME_H = CARD_H * 2; // 568

function VideoCard({
  video,
  cardKey,
  isActive,
  onActivate,
}: {
  video: Video;
  cardKey: string;
  isActive: boolean;
  onActivate: (key: string) => void;
}) {
  const base = `https://www.youtube.com/embed/${video.id}`;
  const common = `rel=0&modestbranding=1&playsinline=1&iv_load_policy=3`;

  // Preview: mudo, loop, sem controles
  const previewSrc = `${base}?autoplay=1&mute=1&loop=1&playlist=${video.id}&controls=0&${common}`;

  // Ativo: com áudio, sem controles (mantém UI menor via scale trick)
  const activeSrc  = `${base}?autoplay=1&mute=0&controls=0&${common}`;

  return (
    <div
      className="shrink-0"
      style={{
        width:  CARD_W,
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: isActive
          ? '0 12px 28px rgba(232,102,122,0.35)'
          : '0 8px 20px rgba(44,31,20,0.18)',
        border: isActive
          ? '1.5px solid rgba(232,102,122,0.6)'
          : '1px solid rgba(201,169,110,0.2)',
        background: '#1a1a1a',
        transform: isActive ? 'scale(1.03)' : 'scale(1)',
        transition: 'transform 300ms ease, box-shadow 300ms ease',
      }}
    >
      {/* Área do vídeo com altura fixa */}
      <div
        className="relative overflow-hidden"
        style={{ width: CARD_W, height: CARD_H }}
      >
        {/*
          SCALE TRICK: iframe renderizado em 2× (320×568) e escalado para 0.5×
          → YouTube renderiza canal/inscreva-se para player de 320px
          → Visualmente aparecem em 160px = metade do tamanho
        */}
        <iframe
          key={isActive ? 'active' : 'preview'}
          src={isActive ? activeSrc : previewSrc}
          width={IFRAME_W}
          height={IFRAME_H}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={video.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            border: 'none',
            display: 'block',
            transform: 'scale(0.5)',
            transformOrigin: 'top left',
          }}
        />

        {/* Overlay transparente — captura toque para ativar áudio no preview */}
        {!isActive && (
          <div
            className="absolute inset-0 cursor-pointer flex flex-col items-center justify-end pb-3"
            onClick={() => onActivate(cardKey)}
          >
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-full"
              style={{
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <span style={{ fontSize: 10 }}>🔊</span>
              <span
                className="font-semibold"
                style={{ fontSize: 9, color: 'rgba(255,255,255,0.92)' }}
              >
                Toque para áudio
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Legenda */}
      <div className="px-2.5 py-2" style={{ background: '#FFF8F4' }}>
        <p
          className="text-[10px] font-medium leading-snug"
          style={{
            color: '#2C1F14',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {video.title}
        </p>
      </div>
    </div>
  );
}

export function InfluencerVideosSection({
  videos,
  animationDelay = 0,
}: InfluencerVideosSectionProps) {
  // activeKey = "${video.id}-${idx}" — único por instância no loop, evita áudio duplo
  const [activeKey, setActiveKey] = useState('');
  const [isPaused,  setIsPaused]  = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Duplica para loop infinito seamless
  const loopedVideos = [...videos, ...videos];

  // Ativar vídeo NÃO pausa o carrosel
  const handleActivate = (key: string) => setActiveKey(key);

  // Hover (desktop): pausa para browsing
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Touch (mobile): pausa temporariamente, retoma após 3s
  const handleTouchStart = () => {
    setIsPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setIsPaused(false), 3000);
  };

  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms`, animationFillMode: 'both' }}
    >
      {/* Header */}
      <div className="mb-4">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.25em] mb-1"
          style={{ color: '#C9A96E' }}
        >
          ✦ QUEM JÁ USA
        </p>
        <h3
          className="text-[20px] font-semibold font-['Playfair_Display'] leading-tight"
          style={{ color: '#2C1F14' }}
        >
          Resultados reais, pessoas reais
        </h3>
        <p className="text-[12px] mt-0.5" style={{ color: '#8C7B6B' }}>
          Skinbella Caps + Sérum em ação
        </p>
      </div>

      {/* Carrosel — overflow hidden para o loop infinito */}
      <div
        className="overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
      >
        <div
          className={`flex carousel-track${isPaused ? ' paused' : ''}`}
          style={{ gap: CARD_GAP }}
        >
          {loopedVideos.map((video, idx) => {
            const cardKey = `${video.id}-${idx}`;
            return (
              <VideoCard
                key={cardKey}
                video={video}
                cardKey={cardKey}
                isActive={activeKey === cardKey}
                onActivate={handleActivate}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
