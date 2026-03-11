interface SynergyProps {
  prioridade: string;
  animationDelay?: number;
}

const SYNERGY_MAP: Record<string, string> = {
  'manchas':       'A Vitamina C do Sérum apaga manchas na superfície. O Licopeno das Caps protege de dentro. Juntos, agem nos dois níveis.',
  'acne':          'A Niacinamida do Sérum controla sebo e inflama por fora. O Zinco das Caps regula hormônios e cicatriza por dentro.',
  'firmeza':       'Os Peptídeos Matrixyl do Sérum estimulam colágeno na derme. O Colágeno Hidrolisado das Caps reforça por dentro.',
  'oleosidade':    'A Niacinamida 10% do Sérum fecha poros visivelmente. O Zinco das Caps controla a produção de sebo na raiz.',
  'hidratação':    'O Ácido Hialurônico Duplo do Sérum hidrata a superfície. O Hialurônico Oral das Caps hidrata as camadas profundas.',
  'envelhecimento':'Os Peptídeos do Sérum firmam e preenchem. O Silício Orgânico das Caps reconstrói a elastina de dentro para fora.',
  'sensibilidade': 'A Alantoína do Sérum acalma a pele na superfície. A Biotina das Caps fortalece a barreira cutânea de dentro.',
  'default':       'O Sérum age na superfície com ativos concentrados. As Caps nutrem de dentro para fora. Juntos, o resultado é completo e duradouro.',
};

function getSynergyText(prioridade: string): string {
  const key = Object.keys(SYNERGY_MAP).find(k =>
    prioridade.toLowerCase().includes(k)
  );
  return SYNERGY_MAP[key ?? 'default'];
}

export function SynergySection({ prioridade, animationDelay = 0 }: SynergyProps) {
  const synergyText = getSynergyText(prioridade);

  return (
    <div
      className="overflow-hidden animate-fade-in-up"
      style={{
        borderRadius: 24,
        boxShadow: '0 12px 32px rgba(36,51,24,0.18)',
        animationDelay: `${animationDelay}ms`,
        animationFillMode: 'both',
      }}
    >
      {/* Header com gradiente fusão verde → dourado */}
      <div
        className="px-5 pt-5 pb-4"
        style={{
          background: 'linear-gradient(135deg, #1e2e14 0%, #2f4220 40%, #b8903a 70%, #EDB84A 100%)',
        }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#C9A96E' }}>
          ✦ A COMBINAÇÃO IDEAL
        </p>
        <h3 className="text-[20px] font-semibold font-['Playfair_Display'] leading-tight text-white">
          Para {prioridade || 'sua pele'}: o protocolo completo
        </h3>
      </div>

      {/* Diagrama visual de fusão */}
      <div
        className="px-5 py-4 flex items-center gap-2"
        style={{ background: '#f8f3ec' }}
      >
        {/* Sérum */}
        <div
          className="flex-1 px-3 py-3 rounded-2xl text-center"
          style={{ background: '#2f4220' }}
        >
          <p className="text-[13px] font-bold" style={{ color: '#d0e4b8' }}>🌿 Sérum</p>
          <p className="text-[10px] mt-0.5" style={{ color: '#88a878' }}>Ação tópica</p>
        </div>

        {/* Conector ⚡ */}
        <div className="flex flex-col items-center shrink-0">
          <span className="text-[18px]">⚡</span>
          <span className="text-[9px] font-bold mt-0.5" style={{ color: '#C9A96E' }}>SINERGIA</span>
        </div>

        {/* Caps */}
        <div
          className="flex-1 px-3 py-3 rounded-2xl text-center"
          style={{ background: '#EDB84A' }}
        >
          <p className="text-[13px] font-bold" style={{ color: '#2C1F14' }}>💊 Caps</p>
          <p className="text-[10px] mt-0.5" style={{ color: '#7A5020' }}>Ação interna</p>
        </div>

        {/* Resultado */}
        <div className="flex flex-col items-center shrink-0">
          <span style={{ color: '#8C7B6B', fontSize: 18 }}>→</span>
        </div>
        <div
          className="flex-1 px-3 py-3 rounded-2xl text-center"
          style={{ background: '#E8EFDF' }}
        >
          <p className="text-[13px] font-bold" style={{ color: '#4A5C3A' }}>✨ Resultado</p>
          <p className="text-[10px] mt-0.5" style={{ color: '#6A7C5A' }}>Completo</p>
        </div>
      </div>

      {/* Texto de sinergia personalizado */}
      <div
        className="px-5 py-4"
        style={{ background: '#FFF8F4', borderTop: '1px solid #EDE8E1' }}
      >
        <p className="text-[13px] leading-relaxed" style={{ color: '#5A3810' }}>
          {synergyText}
        </p>
      </div>
    </div>
  );
}
