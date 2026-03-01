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
  nutrientesTop4: { nome: string; porque: string; acao: string; recomendacao: string; urgencia: number }[];
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
  const incomodosArr: string[] = answers.incomodos ?? [];

  // ── Habit score → skin age offset ──
  let habitScore = 0;
  if (sono < 4) habitScore += 2; else if (sono < 7) habitScore += 1;
  if (agua < 4) habitScore += 1;
  if (sol === 'alta') habitScore += 2; else if (sol === 'media') habitScore += 1;
  if (estresse === 'alto') habitScore += 1;
  if (alimentacao === 'ruim') habitScore += 1;
  if (acucar === 'frequente') habitScore += 1;
  if (skincare === 'nunca') habitScore += 1;
  if (protetor === 'nunca') habitScore += 2; else if (protetor === 'as_vezes') habitScore += 1;
  // habitScore max ~12, mapped to 3–5 range
  const offset = Math.min(5, Math.max(3, 3 + Math.round((habitScore / 12) * 2)));
  const skinAge = realAge + offset;
  const ageOffset = offset;

  const rand = (base: number, variance: number) =>
    Math.min(100, Math.max(20, base + Math.floor(Math.random() * variance - variance / 2)));
  const baseScore = Math.max(30, 85 - ageOffset * 3);

  const scores = {
    manchas: rand(baseScore - (sol === 'alta' ? 15 : 0), 15),
    textura: rand(baseScore - (skincare === 'nunca' ? 10 : 0), 12),
    elasticidade: rand(baseScore - (sono < 5 ? 10 : 0), 10),
    poros: rand(baseScore - (tipoPele === 'oleosa' ? 15 : 0), 15),
    oleosidade: tipoPele === 'oleosa' ? rand(45, 15) : tipoPele === 'seca' ? rand(80, 10) : rand(65, 15),
    hidratacao: rand(baseScore - (agua < 5 ? 15 : 0), 12),
  };

  // ── Prioridades ──
  const allPriorities = [
    { key: 'Proteção Solar', score: protetor === 'nunca' ? 100 : protetor === 'as_vezes' ? 60 : 20 },
    { key: 'Hidratação Profunda', score: 100 - scores.hidratacao },
    { key: 'Controle de Manchas', score: 100 - scores.manchas + (incomodosArr.includes('manchas') ? 20 : 0) },
    { key: 'Renovação Celular', score: 100 - scores.textura },
    { key: 'Controle de Oleosidade', score: tipoPele === 'oleosa' ? 80 : 30 },
    { key: 'Anti-idade', score: ageOffset > 5 ? 80 : 40 },
  ].sort((a, b) => b.score - a.score);

  const prioridadesTop3 = allPriorities.slice(0, 3).map(p => p.key);

  // ── DYNAMIC NUTRIENT SELECTION ──
  // Pool de candidatos Sérum — cada um com score de urgência
  const serumCandidates = [
    {
      urgency:
        (100 - scores.manchas) +
        (sol === 'alta' ? 25 : sol === 'media' ? 12 : 0) +
        (protetor === 'nunca' ? 15 : 0),
      data: {
        nome: 'Vitamina C Estabilizada',
        porque:
          scores.manchas < 60
            ? `Seu score de Manchas indica hiperpigmentação ativa — a Vitamina C Estabilizada é o ativo que apaga manchas e devolve o brilho que o sol foi roubando.`
            : sol === 'alta'
            ? `Com alta exposição solar, sua pele precisa de defesa antioxidante diária. A Vitamina C bloqueia o dano UV e impede novas manchas de se formarem.`
            : `O ativo que uniformiza o tom, devolve o brilho e protege a pele dos danos ambientais. Resultado visível em 20–40 dias de uso consistente.`,
        acao: `Presente no SkinBella Sérum (L-Ascorbil Glucosídeo 10% estabilizado). Aplique 3–4 gotas pela manhã, antes do protetor solar, para máxima eficácia antioxidante.`,
        recomendacao: 'SkinBella Sérum',
      },
    },
    {
      urgency:
        (100 - scores.poros) +
        (tipoPele === 'oleosa' ? 30 : 0) +
        (incomodosArr.includes('cravos') ? 20 : 0) +
        (scores.manchas < 70 ? 10 : 0),
      data: {
        nome: 'Niacinamida 10%',
        porque:
          tipoPele === 'oleosa'
            ? `Pele oleosa produz sebo em excesso, o que dilata os poros. A Niacinamida 10% regula essa produção e fecha os poros visivelmente — resultado que você percebe no espelho em 4 semanas.`
            : scores.poros < 70
            ? `Seus poros estão dilatados. A Niacinamida contrai os poros e refina a textura — pele mais lisa e uniforme que você consegue ver no espelho.`
            : `A Niacinamida fortalece a barreira da pele, controla o brilho indesejado e uniformiza o tom. Um dos ativos mais versáteis da dermatologia moderna.`,
        acao: `No SkinBella Sérum com 10% de concentração — a dose terapêutica comprovada. Use manhã e noite para controle máximo de poros e oleosidade.`,
        recomendacao: 'SkinBella Sérum',
      },
    },
    {
      urgency:
        (100 - scores.elasticidade) +
        (ageOffset >= 4 ? 30 : 0) +
        (scores.textura < 70 ? 15 : 0),
      data: {
        nome: 'Peptídeos Matrixyl 3000',
        porque:
          ageOffset >= 4
            ? `Sua pele biológica está mais velha que sua idade real. Os Peptídeos Matrixyl enviam sinais para os fibroblastos produzirem colágeno — é como "reeditar" a pele de dentro para fora.`
            : scores.elasticidade < 65
            ? `Score de elasticidade abaixo do ideal. Os Peptídeos Matrixyl ativam a síntese de colágeno e elastina para restaurar a firmeza que a pele foi perdendo.`
            : `Anti-idade de alta performance. Os Peptídeos Matrixyl ensinam sua pele a produzir colágeno novamente — firmeza e textura melhoradas em 30–60 dias.`,
        acao: `Formulado no SkinBella Sérum em concentração ativa. Resultados visíveis em elasticidade e firmeza com uso consistente de 20–60 dias.`,
        recomendacao: 'SkinBella Sérum',
      },
    },
    {
      urgency:
        (100 - scores.hidratacao) +
        (tipoPele === 'seca' ? 30 : 0) +
        (agua < 5 ? 15 : 0),
      data: {
        nome: 'Ácido Hialurônico Duplo PM',
        porque:
          tipoPele === 'seca'
            ? `Pele seca precisa de hidratação em dois níveis. O Ácido Hialurônico Duplo PM age na superfície E nas camadas profundas — hidratação que você sente desde a primeira aplicação.`
            : scores.hidratacao < 65
            ? `Seu score de hidratação está abaixo do ideal. O Ácido Hialurônico Duplo PM atrai até 1000x seu peso em água para dentro da pele — efeito preenchimento visível e imediato.`
            : `Hidratação superficial + profunda em uma única fórmula. Efeito preenchimento imediato e hidratação prolongada por até 24h.`,
        acao: `No SkinBella Sérum com dupla cadeia molecular (Alta e Baixa PM). Aplique em pele levemente úmida para potencializar o efeito de preenchimento e maciez.`,
        recomendacao: 'SkinBella Sérum',
      },
    },
    {
      urgency:
        (100 - scores.textura) +
        (incomodosArr.includes('acne') ? 25 : 0) +
        (tipoPele === 'sensivel' ? 20 : 0),
      data: {
        nome: 'Rosa Mosqueta 5%',
        porque:
          incomodosArr.includes('acne')
            ? `A acne deixa marcas. A Rosa Mosqueta é rica em ácido linoleico e vitamina A natural — ativa a renovação celular e suaviza cicatrizes pós-acne sem irritar a pele.`
            : scores.textura < 65
            ? `Textura irregular pede renovação celular. A Rosa Mosqueta acelera o turnover natural e deixa a pele mais uniforme, suave e luminosa em poucas semanas.`
            : `Renovação celular natural com ácido linoleico e vitamina A. Ideal para suavizar marcas superficiais e melhorar a textura geral da pele.`,
        acao: `No SkinBella Sérum com 5% de extrato puro de Rosa Mosqueta. Use preferencialmente à noite para potencializar a regeneração enquanto você dorme.`,
        recomendacao: 'SkinBella Sérum',
      },
    },
  ].sort((a, b) => b.urgency - a.urgency);

  // Pool de candidatos Caps — cada um com score de urgência
  const capsCandidates = [
    {
      urgency:
        (100 - scores.elasticidade) +
        (ageOffset >= 3 ? 20 : 0) +
        (scores.textura < 70 ? 15 : 0) +
        (skinAge - realAge > 4 ? 15 : 0),
      data: {
        nome: 'Colágeno Hidrolisado',
        porque:
          ageOffset >= 4
            ? `Sua pele perde 1% de colágeno por ano a partir dos 25. Com seu perfil, a reposição oral é prioridade — é o único jeito de agir na derme profunda, onde cremes não chegam.`
            : scores.elasticidade < 70
            ? `Score de elasticidade em queda. O Colágeno Hidrolisado oral é absorvido diretamente pelos tecidos dérmicos para restaurar firmeza de dentro para fora.`
            : `Firmeza e elasticidade de dentro para fora. O Colágeno Hidrolisado oral chega onde os cosméticos não alcançam — na derme profunda.`,
        acao: `SkinBella Caps contém 2500mg de Colágeno Hidrolisado por dose. Tome diariamente — com Vitamina C para máxima síntese de colágeno endógeno.`,
        recomendacao: 'SkinBella Caps',
      },
    },
    {
      urgency:
        (tipoPele === 'oleosa' ? 60 : 20) +
        (incomodosArr.includes('acne') ? 50 : 0) +
        (incomodosArr.includes('cravos') ? 25 : 0),
      data: {
        nome: 'Zinco',
        porque:
          incomodosArr.includes('acne')
            ? `O Zinco é o mineral anti-acne mais estudado. Regula a produção de sebo, combate a bactéria da acne (P. acnes) e acelera a cicatrização — ação de dentro que potencializa o sérum tópico.`
            : tipoPele === 'oleosa'
            ? `Para pele oleosa, o Zinco oral é o complemento perfeito para quem usa Niacinamida tópica. Ação de dentro + fora para o controle de oleosidade mais completo.`
            : `Mineral anti-inflamatório que regula o sebo, apoia a cicatrização e mantém a pele em equilíbrio. Essencial para peles que reagem com facilidade.`,
        acao: `Presente no SkinBella Caps na dose diária otimizada. Tome com as refeições para melhor absorção e evitar desconforto gástrico.`,
        recomendacao: 'SkinBella Caps',
      },
    },
    {
      urgency:
        (tipoPele === 'seca' ? 50 : 0) +
        Math.round((100 - scores.hidratacao) * 0.7) +
        (agua < 4 ? 20 : 0),
      data: {
        nome: 'Biotina (B7)',
        porque:
          tipoPele === 'seca'
            ? `Pele seca com barreira comprometida precisa de Biotina. A vitamina B7 reconstrói a barreira cutânea de dentro para fora — resultado: pele menos ressecada e muito mais resistente.`
            : scores.hidratacao < 60
            ? `Hidratação baixa indica barreira cutânea enfraquecida. A Biotina fortalece essa barreira internamente, reduzindo a perda de água transepidérmica.`
            : `Vitamina da barreira cutânea. Fortalece a pele de dentro, melhorando hidratação e reduzindo descamação e vermelhidão.`,
        acao: `No SkinBella Caps com dose diária otimizada de Biotina. Efeito cumulativo — os primeiros resultados visíveis aparecem entre 3 e 4 semanas.`,
        recomendacao: 'SkinBella Caps',
      },
    },
    {
      urgency:
        (sol === 'alta' ? 60 : sol === 'media' ? 30 : 10) +
        (protetor === 'nunca' ? 30 : protetor === 'as_vezes' ? 15 : 0) +
        (scores.manchas < 70 ? 15 : 0),
      data: {
        nome: 'Licopeno',
        porque:
          (protetor === 'nunca' || protetor === 'as_vezes') && sol === 'alta'
            ? `Alta exposição solar sem proteção é a principal causa de manchas e envelhecimento precoce. O Licopeno é sua fotoproteção interna — reduz o dano solar de dentro e impede novas manchas.`
            : scores.manchas < 70
            ? `Manchas solares precisam de ação de dentro E de fora. O Licopeno age na melanogênese induzida pelo UV, clareando manchas existentes e impedindo novas.`
            : `Fotoproteção interna de alta performance. O carotenoide do tomate absorve radicais livres e protege a pele dos danos UV de dentro para fora.`,
        acao: `No SkinBella Caps combinado com Vitamina E — a dupla antioxidante mais eficaz contra fotodano. Tome diariamente, especialmente nos meses de maior exposição solar.`,
        recomendacao: 'SkinBella Caps',
      },
    },
    {
      urgency:
        (100 - scores.elasticidade) +
        (ageOffset >= 4 ? 25 : 0) +
        (skinAge - realAge >= 5 ? 20 : 0),
      data: {
        nome: 'Silício Orgânico',
        porque:
          ageOffset >= 4
            ? `Sua pele precisa reconstruir a matriz de suporte. O Silício Orgânico estimula a síntese de elastina e colágeno — a infraestrutura que dá firmeza e resistência real à pele.`
            : scores.elasticidade < 65
            ? `Score de elasticidade abaixo do ideal indica degradação da estrutura dérmica. O Silício Orgânico reconstrói essa estrutura de dentro, com resultados visíveis em 60 dias.`
            : `O mineral da firmeza e elasticidade. Estimula a produção de colágeno e elastina na derme profunda para uma pele mais firme e jovem.`,
        acao: `No SkinBella Caps em sinergia com Colágeno Hidrolisado — a combinação mais eficaz para firmeza. Use consistentemente por 60 dias para resultados duradouros.`,
        recomendacao: 'SkinBella Caps',
      },
    },
  ].sort((a, b) => b.urgency - a.urgency);

  // Top 2 Sérum + Top 2 Caps = 4 nutrientes dinâmicos
  // Normaliza urgência para exibição visual (28–92%), preservando ranking relativo
  const rawUrgencies = [
    serumCandidates[0].urgency,
    serumCandidates[1].urgency,
    capsCandidates[0].urgency,
    capsCandidates[1].urgency,
  ];
  const maxU = Math.max(...rawUrgencies, 1);
  const toDisplay = (u: number) => Math.min(92, Math.max(28, Math.round((u / maxU) * 88)));

  const nutrientesTop4 = [
    { ...serumCandidates[0].data, urgencia: toDisplay(serumCandidates[0].urgency) },
    { ...serumCandidates[1].data, urgencia: toDisplay(serumCandidates[1].urgency) },
    { ...capsCandidates[0].data, urgencia: toDisplay(capsCandidates[0].urgency) },
    { ...capsCandidates[1].data, urgencia: toDisplay(capsCandidates[1].urgency) },
  ];

  // ── ROTINA com SkinBella Sérum + Caps (1 cápsula manhã + 1 cápsula noite) ──
  const rotina = {
    manha: [
      'Lavar o rosto com sabonete suave',
      'Aplicar SkinBella Sérum (3–4 gotas, pressionar suavemente)',
      'Aguardar 60s para absorção completa',
      'Aplicar hidratante leve',
      'Protetor solar FPS 50+ — obrigatório com Vitamina C',
      'Tomar SkinBella Caps (1 cápsula com o café da manhã)',
    ],
    noite: [
      'Remover maquiagem com demaquilante',
      'Lavar o rosto com sabonete facial',
      'Aplicar SkinBella Sérum nas áreas de maior preocupação',
      'Finalizar com hidratante nutritivo',
      'Creme para área dos olhos (opcional)',
      'Tomar SkinBella Caps (1 cápsula com o jantar)',
    ],
  };

  // ── DIETA PERSONALIZADA por perfil dominante ──
  const manchasUrgency =
    (100 - scores.manchas) +
    (sol === 'alta' ? 25 : sol === 'media' ? 12 : 0) +
    (incomodosArr.includes('manchas') ? 20 : 0);
  const oleosaUrgency =
    (tipoPele === 'oleosa' ? 60 : 0) +
    (incomodosArr.includes('acne') ? 50 : 0) +
    (incomodosArr.includes('cravos') ? 30 : 0);
  const secaUrgency =
    (tipoPele === 'seca' ? 60 : 0) +
    Math.round((100 - scores.hidratacao) * 0.6) +
    (agua < 4 ? 20 : 0);
  const envelhecimentoUrgency =
    (100 - scores.elasticidade) + ageOffset * 12;

  const concerns = [
    { key: 'manchas', score: manchasUrgency },
    { key: 'oleosa_acne', score: oleosaUrgency },
    { key: 'seca', score: secaUrgency },
    { key: 'envelhecimento', score: envelhecimentoUrgency },
  ].sort((a, b) => b.score - a.score);

  const primaryConcern = concerns[0].key;

  const dietaProfiles: Record<string, { priorizar: string[]; reduzir: string[]; plano: string[] }> = {
    manchas: {
      priorizar: [
        'Tomate e licopeno — fotoproteção interna natural contra manchas',
        'Frutas cítricas ricas em Vitamina C (kiwi, laranja, acerola)',
        'Chá verde e polifenóis — antioxidantes que inibem a melanina',
        'Pimentão vermelho e cenoura — betacaroteno com efeito clareador',
        'Água (mín. 2L/dia) — hidratação que apoia a renovação celular',
      ],
      reduzir: [
        'Açúcar refinado — acelera a inflamação e agrava manchas',
        'Álcool — dilata vasos e aumenta hiperpigmentação',
        'Frituras e ultraprocessados — inflamação sistêmica piora o tom',
        'Cafeína em excesso — prejudica a microcirculação da pele',
      ],
      plano: [
        'Café da manhã: Suco de laranja natural + vitamina C + torrada integral',
        'Lanche: Tomate cereja + castanhas (licopeno + vitamina E)',
        'Almoço: Frango grelhado + salada colorida + arroz integral',
        'Lanche: Smoothie de acerola + banana (vitamina C + energia)',
        'Jantar: Salmão grelhado + purê de cenoura + legumes no vapor',
      ],
    },
    oleosa_acne: {
      priorizar: [
        'Sementes de abóbora e zinco — o mineral anti-acne fundamental',
        'Ômega-3 anti-inflamatório (salmão, sardinha, chia, linhaça)',
        'Vegetais verde-escuros — reguladores hormonais naturais',
        'Probióticos (iogurte natural, kefir) — microbioma e pele equilibrados',
        'Água (mín. 2L/dia) — elimina toxinas que pioram a acne',
      ],
      reduzir: [
        'Açúcar e doces — pico de insulina dispara a produção de sebo',
        'Laticínios convencionais — hormônios do leite agravam acne hormonal',
        'Frituras e óleos saturados — aumentam inflamação sistêmica',
        'Alimentos de alto índice glicêmico (pão branco, arroz branco)',
        'Álcool — desidrata e desequilibra o pH da pele',
      ],
      plano: [
        'Café da manhã: Ovos mexidos + aveia + suco de limão sem açúcar',
        'Lanche: Sementes de abóbora + iogurte natural sem açúcar',
        'Almoço: Sardinha grelhada + arroz integral + brócolis no vapor',
        'Lanche: Chá de camomila + castanhas (anti-inflamatório natural)',
        'Jantar: Frango grelhado + legumes assados + salada verde',
      ],
    },
    seca: {
      priorizar: [
        'Abacate e azeite de oliva — ácidos graxos que nutrem a pele de dentro',
        'Água e chás hidratantes (hibisco, camomila) — mín. 2L/dia',
        'Peixes gordurosos (salmão, atum) — ômega-3 fortalece a barreira',
        'Ovos e amêndoas — biotina natural para barreira cutânea forte',
        'Banana e batata-doce — potássio que auxilia na retenção hídrica',
      ],
      reduzir: [
        'Álcool — desidrata profundamente a pele de dentro para fora',
        'Cafeína em excesso — efeito diurético que resseca a pele',
        'Sal e sódio em excesso — prejudica a hidratação celular',
        'Alimentos ultraprocessados — inflamam e comprometem a barreira',
        'Açúcar refinado — glicação que destrói as proteínas da pele',
      ],
      plano: [
        'Café da manhã: Vitamina de abacate + aveia + mel',
        'Lanche: Amêndoas + tâmaras (biotina natural + energia)',
        'Almoço: Salmão ao molho de ervas + quinoa + abobrinha refogada',
        'Lanche: Iogurte natural + banana amassada (hidratação + probiótico)',
        'Jantar: Sopa cremosa de abóbora com azeite + torrada integral',
      ],
    },
    envelhecimento: {
      priorizar: [
        'Caldo de osso — colágeno alimentar natural de alta biodisponibilidade',
        'Salmão e atum — ômega-3 anti-inflamatório para firmeza',
        'Algas marinhas (nori, spirulina) — silício orgânico natural',
        'Frutas vermelhas (mirtilo, framboesa) — antioxidantes anti-glicação',
        'Oleaginosas (nozes, castanhas) — vitamina E + selênio antiage',
      ],
      reduzir: [
        'Açúcar — glicação que destrói colágeno e elastina da pele',
        'Álcool — acelera a quebra de colágeno e desidrata profundamente',
        'Frituras e gordura trans — inflamação que envelhece a pele',
        'Alimentos ultraprocessados — inflamação sistêmica crônica',
        'Refrigerantes e bebidas açucaradas — glicação acelerada',
      ],
      plano: [
        'Café da manhã: Caldo de osso quente + ovos mexidos + fruta vermelha',
        'Lanche: Mix de oleaginosas + chá de gengibre (antiage natural)',
        'Almoço: Salmão grelhado + salada de algas + quinoa com açafrão',
        'Lanche: Smoothie de mirtilo + spirulina (antioxidantes antiage)',
        'Jantar: Frango com cúrcuma + legumes assados + azeite extra virgem',
      ],
    },
  };

  const dieta = dietaProfiles[primaryConcern] ?? {
    priorizar: [
      'Frutas ricas em vitamina C (laranja, kiwi, morango)',
      'Peixes ricos em ômega-3 (salmão, sardinha)',
      'Vegetais verde-escuros (espinafre, couve)',
      'Água (mín. 2L/dia)',
      'Chá verde e antioxidantes',
    ],
    reduzir: [
      'Açúcar refinado e doces',
      'Frituras e alimentos ultraprocessados',
      'Álcool em excesso',
      'Laticínios (se acne frequente)',
      'Refrigerantes',
    ],
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
