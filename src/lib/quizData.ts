export type QuestionType = 'cards-emoji' | 'cards-image' | 'chips' | 'slider' | 'multi-chips' | 'selfie';

export interface QuizOption {
  value: string;
  label: string;
  description?: string;
  emoji?: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  title: string;
  subtitle?: string;
  options?: QuizOption[];
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
    subtitle: 'Escolha o que mais te incomoda hoje',
    options: [
      { value: 'manchas', label: 'Manchas', description: 'Marcas escuras, melasma ou hiperpigmentação', emoji: '🔵' },
      { value: 'textura', label: 'Textura', description: 'Pele irregular, áspera ou com cravos', emoji: '✨' },
      { value: 'vico', label: 'Viço', description: 'Pele sem brilho, opaca e cansada', emoji: '🌿' },
      { value: 'poros', label: 'Poros', description: 'Poros dilatados e aparentes', emoji: '🔍' },
      { value: 'oleosidade', label: 'Oleosidade', description: 'Excesso de brilho e pele grudenta', emoji: '💧' },
      { value: 'ressecamento', label: 'Ressecamento', description: 'Pele repuxando e descamando', emoji: '🏜️' },
    ],
  },
  {
    id: 'tipo_pele',
    type: 'cards-image',
    title: 'Qual o seu tipo de pele?',
    subtitle: 'Selecione a opção que mais se aproxima',
    options: [
      { value: 'oleosa', label: 'Oleosa', description: 'Brilho excessivo na zona T e bochechas', emoji: '💦' },
      { value: 'mista', label: 'Mista', description: 'Oleosa na zona T, normal nas bochechas', emoji: '⚖️' },
      { value: 'seca', label: 'Seca', description: 'Pele repuxa, sem brilho natural', emoji: '🌵' },
      { value: 'sensivel', label: 'Sensível', description: 'Vermelhidão e irritação frequente', emoji: '🌸' },
    ],
  },
  {
    id: 'rotina_atual',
    type: 'cards-emoji',
    title: 'Como é sua rotina de skincare atual?',
    subtitle: 'Seja honesta — sem julgamentos 😊',
    options: [
      { value: 'nenhuma', label: 'Nenhuma', description: 'Não uso nada além de água', emoji: '🚿' },
      { value: 'basica', label: 'Básica', description: 'Sabonete e hidratante no máximo', emoji: '🧴' },
      { value: 'avancada', label: 'Avançada', description: 'Sérum, ácidos, protetor e mais', emoji: '💎' },
    ],
  },
  {
    id: 'sono',
    type: 'slider',
    title: 'Como está a qualidade do seu sono?',
    subtitle: 'O sono é essencial para a renovação celular',
    sliderMin: 0,
    sliderMax: 10,
    sliderUnit: '/10',
  },
  {
    id: 'agua',
    type: 'slider',
    title: 'Quantos copos de água por dia?',
    subtitle: 'A hidratação interna reflete diretamente na pele',
    sliderMin: 0,
    sliderMax: 10,
    sliderUnit: ' copos',
  },
  {
    id: 'sol',
    type: 'cards-emoji',
    title: 'Qual sua exposição ao sol diária?',
    subtitle: 'O sol é o fator #1 de envelhecimento precoce',
    options: [
      { value: 'baixa', label: 'Baixa', description: 'Fico em ambientes fechados a maior parte', emoji: '☀️' },
      { value: 'media', label: 'Média', description: 'Saio algumas vezes durante o dia', emoji: '🌤️' },
      { value: 'alta', label: 'Alta', description: 'Trabalho ou pratico atividades ao ar livre', emoji: '🔥' },
    ],
  },
  {
    id: 'estresse',
    type: 'cards-emoji',
    title: 'Qual seu nível de estresse?',
    subtitle: 'O cortisol acelera o envelhecimento da pele',
    options: [
      { value: 'baixo', label: 'Baixo', description: 'Me sinto tranquila na maior parte do tempo', emoji: '😌' },
      { value: 'medio', label: 'Médio', description: 'Tenho dias difíceis mas consigo lidar', emoji: '😐' },
      { value: 'alto', label: 'Alto', description: 'Vivo estressada e isso afeta minha saúde', emoji: '😰' },
    ],
  },
  {
    id: 'alimentacao',
    type: 'cards-emoji',
    title: 'Como você avalia sua alimentação?',
    subtitle: 'Sua pele é reflexo do que você come',
    options: [
      { value: 'boa', label: 'Boa', description: 'Priorizo frutas, verduras e proteínas', emoji: '🥗' },
      { value: 'ok', label: 'Poderia melhorar', description: 'Como bem às vezes, mas não sempre', emoji: '🍕' },
      { value: 'ruim', label: 'Preciso de ajuda', description: 'Muita comida processada e fast food', emoji: '🍔' },
    ],
  },
  {
    id: 'acucar',
    type: 'cards-emoji',
    title: 'Com que frequência consome açúcar?',
    subtitle: 'O açúcar causa glicação — que danifica o colágeno',
    options: [
      { value: 'raro', label: 'Raramente', description: 'Evito ao máximo doces e açúcar', emoji: '🚫' },
      { value: 'as_vezes', label: 'Às vezes', description: 'Consumo moderado durante a semana', emoji: '🍬' },
      { value: 'frequente', label: 'Frequentemente', description: 'Difícil passar um dia sem doce', emoji: '🧁' },
    ],
  },
  {
    id: 'skincare',
    type: 'cards-emoji',
    title: 'Com que frequência faz skincare?',
    subtitle: 'Consistência é mais importante que produtos caros',
    options: [
      { value: 'nunca', label: 'Nunca', description: 'Não tenho o hábito de cuidar da pele', emoji: '❌' },
      { value: 'as_vezes', label: 'Às vezes', description: 'Quando lembro ou tenho tempo', emoji: '⏰' },
      { value: 'sempre', label: 'Sempre', description: 'Faço minha rotina todos os dias', emoji: '✅' },
    ],
  },
  {
    id: 'protetor',
    type: 'cards-emoji',
    title: 'Usa protetor solar diariamente?',
    subtitle: '90% do envelhecimento visível vem do sol',
    options: [
      { value: 'nunca', label: 'Nunca', description: 'Não uso protetor solar', emoji: '🚫' },
      { value: 'as_vezes', label: 'Às vezes', description: 'Só quando saio ou quando lembro', emoji: '🌥️' },
      { value: 'sempre', label: 'Sempre', description: 'Uso todos os dias, até em casa', emoji: '🛡️' },
    ],
  },
  {
    id: 'incomodos',
    type: 'multi-chips',
    title: 'O que mais te incomoda na pele?',
    subtitle: 'Selecione todos que se aplicam',
    multiSelect: true,
    options: [
      { value: 'manchas', label: 'Manchas', emoji: '🟤' },
      { value: 'poros', label: 'Poros dilatados', emoji: '🔎' },
      { value: 'linhas', label: 'Linhas finas', emoji: '〰️' },
      { value: 'acne', label: 'Acne', emoji: '🔴' },
      { value: 'olheiras', label: 'Olheiras', emoji: '👁️' },
    ],
  },
  {
    id: 'selfie',
    type: 'selfie',
    title: 'Tire uma selfie para análise',
    subtitle: 'Sua foto será usada apenas para o diagnóstico visual',
  },
];
