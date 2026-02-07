export interface SkinProfile {
  skinAge: number;
  scores: {
    manchas: number;
    textura: number;
    elasticidade: number;
    poros: number;
    oleosidade: number;
    hidratacao: number;
  };
  prioridadesTop3: string[];
  nutrientesTop4: { nome: string; porque: string; acao: string; recomendacao: string }[];
  rotina: { manha: string[]; noite: string[] };
  dieta: { priorizar: string[]; reduzir: string[]; plano: string[] };
}

export function generateProfile(answers: Record<string, any>): SkinProfile {
  const realAge = answers.idade ?? 28;
  const sono = answers.sono ?? 5;
  const agua = answers.agua ?? 5;
  const sol = answers.sol ?? 'media';
  const estresse = answers.estresse ?? 'medio';
  const alimentacao = answers.alimentacao ?? 'ok';
  const acucar = answers.acucar ?? 'as_vezes';
  const skincare = answers.skincare ?? 'as_vezes';
  const protetor = answers.protetor ?? 'as_vezes';
  const tipoPele = answers.tipo_pele ?? 'mista';

  // Skin age is always real age + 3 to 5 years
  // Use habits to determine where in the 3-5 range
  let habitScore = 0;
  if (sono < 4) habitScore += 2; else if (sono < 7) habitScore += 1;
  if (agua < 4) habitScore += 1;
  if (sol === 'alta') habitScore += 2; else if (sol === 'media') habitScore += 1;
  if (estresse === 'alto') habitScore += 1;
  if (alimentacao === 'ruim') habitScore += 1;
  if (acucar === 'frequente') habitScore += 1;
  if (skincare === 'nunca') habitScore += 1;
  if (protetor === 'nunca') habitScore += 2; else if (protetor === 'as_vezes') habitScore += 1;
  // habitScore max ~12, map to 3-5 range
  const offset = Math.min(5, Math.max(3, 3 + Math.round((habitScore / 12) * 2)));
  const skinAge = realAge + offset;

  const ageOffset = offset;

  const rand = (base: number, variance: number) => Math.min(100, Math.max(20, base + Math.floor(Math.random() * variance - variance / 2)));
  const baseScore = Math.max(30, 85 - ageOffset * 3);

  const scores = {
    manchas: rand(baseScore - (sol === 'alta' ? 15 : 0), 15),
    textura: rand(baseScore - (skincare === 'nunca' ? 10 : 0), 12),
    elasticidade: rand(baseScore - (sono < 5 ? 10 : 0), 10),
    poros: rand(baseScore - (tipoPele === 'oleosa' ? 15 : 0), 15),
    oleosidade: tipoPele === 'oleosa' ? rand(45, 15) : tipoPele === 'seca' ? rand(80, 10) : rand(65, 15),
    hidratacao: rand(baseScore - (agua < 5 ? 15 : 0), 12),
  };

  const incomodosArr: string[] = answers.incomodos ?? [];
  const allPriorities = [
    { key: 'Proteção Solar', score: protetor === 'nunca' ? 100 : protetor === 'as_vezes' ? 60 : 20 },
    { key: 'Hidratação Profunda', score: 100 - scores.hidratacao },
    { key: 'Controle de Manchas', score: 100 - scores.manchas + (incomodosArr.includes('manchas') ? 20 : 0) },
    { key: 'Renovação Celular', score: 100 - scores.textura },
    { key: 'Controle de Oleosidade', score: tipoPele === 'oleosa' ? 80 : 30 },
    { key: 'Anti-idade', score: ageOffset > 5 ? 80 : 40 },
  ].sort((a, b) => b.score - a.score);

  const prioridadesTop3 = allPriorities.slice(0, 3).map(p => p.key);

  const nutrientesTop4 = [
    { nome: 'Vitamina C (Antioxidante)', porque: 'Neutraliza radicais livres e uniformiza o tom da pele.', acao: 'Use sérum com vitamina C pela manhã.', recomendacao: 'SkinBella Sérum' },
    { nome: 'Colágeno Hidrolisado', porque: 'Sustenta a firmeza e elasticidade da pele.', acao: 'Suplementação diária com colágeno.', recomendacao: 'SkinBella Caps' },
    { nome: 'Ácido Hialurônico', porque: 'Atrai e retém água, mantendo a hidratação profunda.', acao: 'Aplique hidratante com ácido hialurônico.', recomendacao: 'SkinBella Sérum' },
    { nome: 'Niacinamida (Barreira)', porque: 'Fortalece a barreira cutânea e controla oleosidade.', acao: 'Inclua produtos com niacinamida na rotina.', recomendacao: 'SkinBella Sérum' },
  ];

  const rotina = {
    manha: [
      'Limpar o rosto com sabonete facial suave',
      'Aplicar sérum de vitamina C',
      'Hidratar com creme leve',
      'Aplicar protetor solar FPS 50+',
    ],
    noite: [
      'Remover maquiagem com demaquilante',
      'Lavar o rosto com sabonete facial',
      'Aplicar sérum de retinol ou niacinamida',
      'Hidratar com creme nutritivo',
      'Aplicar creme para área dos olhos',
    ],
  };

  const dieta = {
    priorizar: ['Frutas ricas em vitamina C (laranja, kiwi, morango)', 'Peixes ricos em ômega-3 (salmão, sardinha)', 'Vegetais verde-escuros (espinafre, couve)', 'Água (mín. 2L/dia)', 'Chá verde e antioxidantes'],
    reduzir: ['Açúcar refinado e doces', 'Frituras e alimentos ultraprocessados', 'Álcool em excesso', 'Laticínios (se acne frequente)', 'Refrigerantes'],
    plano: [
      'Café da manhã: Smoothie de morango + colágeno + aveia',
      'Lanche: Mix de castanhas + chá verde',
      'Almoço: Salmão grelhado + salada de folhas verdes + batata doce',
      'Lanche: Frutas vermelhas com iogurte natural',
      'Jantar: Sopa de legumes + frango grelhado',
    ],
  };

  return { skinAge, scores, prioridadesTop3, nutrientesTop4, rotina, dieta };
}
