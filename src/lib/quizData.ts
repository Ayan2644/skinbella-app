export type QuestionType = 'cards-emoji' | 'cards-image' | 'chips' | 'slider' | 'multi-chips' | 'selfie';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  title: string;
  subtitle?: string;
  options?: { value: string; label: string; emoji?: string }[];
  sliderMin?: number;
  sliderMax?: number;
  sliderUnit?: string;
  multiSelect?: boolean;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'objetivo',
    type: 'cards-emoji',
    title: 'Qual o seu principal objetivo?',
    subtitle: 'Escolha o que mais te incomoda',
    multiSelect: false,
    options: [
      { value: 'manchas', label: 'Manchas', emoji: '🔵' },
      { value: 'textura', label: 'Textura', emoji: '✨' },
      { value: 'vico', label: 'Viço', emoji: '🌿' },
      { value: 'poros', label: 'Poros', emoji: '🔍' },
      { value: 'oleosidade', label: 'Oleosidade', emoji: '💧' },
      { value: 'ressecamento', label: 'Ressecamento', emoji: '🏜️' },
    ],
  },
  {
    id: 'tipo_pele',
    type: 'cards-image',
    title: 'Qual o seu tipo de pele?',
    subtitle: 'Selecione a opção que mais se aproxima',
    options: [
      { value: 'oleosa', label: 'Oleosa', emoji: '💦' },
      { value: 'mista', label: 'Mista', emoji: '⚖️' },
      { value: 'seca', label: 'Seca', emoji: '🌵' },
      { value: 'sensivel', label: 'Sensível', emoji: '🌸' },
    ],
  },
  {
    id: 'rotina_atual',
    type: 'chips',
    title: 'Como é sua rotina de skincare atual?',
    options: [
      { value: 'nenhuma', label: 'Nenhuma' },
      { value: 'basica', label: 'Básica' },
      { value: 'avancada', label: 'Avançada' },
    ],
  },
  {
    id: 'sono',
    type: 'slider',
    title: 'Como está a qualidade do seu sono?',
    subtitle: 'De 0 (péssimo) a 10 (excelente)',
    sliderMin: 0,
    sliderMax: 10,
    sliderUnit: '/10',
  },
  {
    id: 'agua',
    type: 'slider',
    title: 'Quantos copos de água você bebe por dia?',
    subtitle: 'De 0 a 10+ copos',
    sliderMin: 0,
    sliderMax: 10,
    sliderUnit: ' copos',
  },
  {
    id: 'sol',
    type: 'chips',
    title: 'Qual sua exposição ao sol diária?',
    options: [
      { value: 'baixa', label: '☀️ Baixa' },
      { value: 'media', label: '🌤️ Média' },
      { value: 'alta', label: '🔥 Alta' },
    ],
  },
  {
    id: 'estresse',
    type: 'chips',
    title: 'Qual seu nível de estresse?',
    options: [
      { value: 'baixo', label: '😌 Baixo' },
      { value: 'medio', label: '😐 Médio' },
      { value: 'alto', label: '😰 Alto' },
    ],
  },
  {
    id: 'alimentacao',
    type: 'chips',
    title: 'Como você avalia sua alimentação?',
    options: [
      { value: 'boa', label: '🥗 Boa' },
      { value: 'ok', label: '🍕 OK' },
      { value: 'ruim', label: '🍔 Ruim' },
    ],
  },
  {
    id: 'acucar',
    type: 'chips',
    title: 'Com que frequência consome açúcar?',
    options: [
      { value: 'raro', label: 'Raramente' },
      { value: 'as_vezes', label: 'Às vezes' },
      { value: 'frequente', label: 'Frequentemente' },
    ],
  },
  {
    id: 'skincare',
    type: 'chips',
    title: 'Com que frequência faz skincare?',
    options: [
      { value: 'nunca', label: 'Nunca' },
      { value: 'as_vezes', label: 'Às vezes' },
      { value: 'sempre', label: 'Sempre' },
    ],
  },
  {
    id: 'protetor',
    type: 'chips',
    title: 'Usa protetor solar diariamente?',
    options: [
      { value: 'nunca', label: 'Nunca' },
      { value: 'as_vezes', label: 'Às vezes' },
      { value: 'sempre', label: 'Sempre' },
    ],
  },
  {
    id: 'incomodos',
    type: 'multi-chips',
    title: 'O que mais te incomoda na pele?',
    subtitle: 'Selecione todos que se aplicam',
    multiSelect: true,
    options: [
      { value: 'manchas', label: 'Manchas' },
      { value: 'poros', label: 'Poros dilatados' },
      { value: 'linhas', label: 'Linhas finas' },
      { value: 'acne', label: 'Acne' },
      { value: 'olheiras', label: 'Olheiras' },
    ],
  },
  {
    id: 'selfie',
    type: 'selfie',
    title: 'Tire uma selfie para análise',
    subtitle: 'Sua foto será usada apenas para o diagnóstico visual',
  },
];
