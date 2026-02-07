// Mock data for admin panel

export interface MockUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  quizCompleted: boolean;
  subscription: 'free' | 'premium' | 'vip';
  skinAge: number | null;
  lastActive: string;
  status: 'active' | 'inactive' | 'blocked';
}

export interface QuizMetric {
  date: string;
  started: number;
  completed: number;
  conversionRate: number;
}

export interface SubscriptionMetric {
  plan: 'free' | 'premium' | 'vip';
  count: number;
  revenue: number;
  color: string;
}

const ADMIN_KEY = 'skinbella.admin';

export const ADMIN_CREDENTIALS = {
  email: 'admin@skinbella.com',
  password: 'admin123',
};

export const adminStorage = {
  login: () => localStorage.setItem(ADMIN_KEY, JSON.stringify({ loggedIn: true })),
  logout: () => localStorage.removeItem(ADMIN_KEY),
  isLoggedIn: () => {
    try {
      const v = localStorage.getItem(ADMIN_KEY);
      return v ? JSON.parse(v).loggedIn === true : false;
    } catch { return false; }
  },
};

// Generate mock users
export function generateMockUsers(count = 48): MockUser[] {
  const names = [
    'Ana Silva', 'Beatriz Costa', 'Camila Oliveira', 'Diana Santos', 'Elena Ferreira',
    'Fernanda Lima', 'Gabriela Souza', 'Helena Martins', 'Isabela Rocha', 'Julia Almeida',
    'Karen Ribeiro', 'Larissa Gomes', 'Marina Barbosa', 'Natália Cardoso', 'Olívia Pereira',
    'Patrícia Araújo', 'Rafaela Correia', 'Sofia Mendes', 'Tatiana Reis', 'Vanessa Dias',
    'Amanda Carvalho', 'Bruna Nascimento', 'Carolina Pinto', 'Daniela Moreira', 'Eduarda Castro',
    'Flávia Teixeira', 'Giovanna Vieira', 'Heloísa Nunes', 'Ingrid Monteiro', 'Juliana Melo',
    'Letícia Azevedo', 'Manuela Franco', 'Nicole Lopes', 'Priscila Duarte', 'Raquel Campos',
    'Simone Andrade', 'Tainá Freitas', 'Úrsula Machado', 'Vitória Cunha', 'Yasmin Ramos',
    'Alice Borges', 'Bianca Tavares', 'Cláudia Fonseca', 'Débora Sampaio', 'Elisa Nogueira',
    'Fabiana Moura', 'Gisele Brito', 'Hanna Marques',
  ];
  const subs: MockUser['subscription'][] = ['free', 'premium', 'vip'];
  const statuses: MockUser['status'][] = ['active', 'active', 'active', 'inactive', 'blocked'];

  return names.slice(0, count).map((name, i) => {
    const daysAgo = Math.floor(Math.random() * 90);
    const created = new Date(Date.now() - daysAgo * 86400000);
    const quizDone = Math.random() > 0.2;
    return {
      id: `user-${i + 1}`,
      name,
      email: name.toLowerCase().replace(/\s/g, '.').normalize('NFD').replace(/[\u0300-\u036f]/g, '') + '@email.com',
      createdAt: created.toISOString(),
      quizCompleted: quizDone,
      subscription: subs[Math.floor(Math.random() * (i < 10 ? 3 : 2))],
      skinAge: quizDone ? Math.floor(Math.random() * 15) + 22 : null,
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 14) * 86400000).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };
  });
}

// Generate daily metrics for last N days
export function generateDailyMetrics(days = 30): QuizMetric[] {
  const metrics: QuizMetric[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    const started = Math.floor(Math.random() * 40) + 10;
    const completed = Math.floor(started * (0.4 + Math.random() * 0.35));
    metrics.push({
      date: date.toISOString().split('T')[0],
      started,
      completed,
      conversionRate: Math.round((completed / started) * 100),
    });
  }
  return metrics;
}

export function getSubscriptionBreakdown(users: MockUser[]): SubscriptionMetric[] {
  const counts = { free: 0, premium: 0, vip: 0 };
  users.forEach(u => counts[u.subscription]++);
  return [
    { plan: 'free', count: counts.free, revenue: 0, color: 'hsl(var(--muted))' },
    { plan: 'premium', count: counts.premium, revenue: counts.premium * 49.9, color: 'hsl(var(--primary))' },
    { plan: 'vip', count: counts.vip, revenue: counts.vip * 99.9, color: 'hsl(var(--accent))' },
  ];
}
