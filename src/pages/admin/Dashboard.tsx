import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateMockUsers, generateDailyMetrics, getSubscriptionBreakdown } from '@/lib/adminData';
import { Users, FileText, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [period, setPeriod] = useState('30');
  const users = useMemo(() => generateMockUsers(), []);
  const metrics = useMemo(() => generateDailyMetrics(Number(period)), [period]);
  const subs = useMemo(() => getSubscriptionBreakdown(users), [users]);

  const totalStarted = metrics.reduce((s, m) => s + m.started, 0);
  const totalCompleted = metrics.reduce((s, m) => s + m.completed, 0);
  const avgConversion = totalStarted > 0 ? Math.round((totalCompleted / totalStarted) * 100) : 0;
  const totalRevenue = subs.reduce((s, m) => s + m.revenue, 0);
  const activeUsers = users.filter(u => u.status === 'active').length;

  const kpis = [
    { label: 'Total Usuários', value: users.length, icon: Users, accent: 'text-primary' },
    { label: 'Quiz Preenchidos', value: totalCompleted, icon: FileText, accent: 'text-accent' },
    { label: 'Taxa Conversão', value: `${avgConversion}%`, icon: TrendingUp, accent: 'text-primary' },
    { label: 'Receita Mensal', value: `R$ ${totalRevenue.toFixed(0)}`, icon: DollarSign, accent: 'text-accent' },
    { label: 'Ativos Agora', value: activeUsers, icon: Activity, accent: 'text-primary' },
  ];

  const PIE_COLORS = ['hsl(35, 15%, 80%)', 'hsl(155, 25%, 38%)', 'hsl(42, 55%, 62%)'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Visão geral do SkinBella App</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Últimos 7 dias</SelectItem>
            <SelectItem value="14">Últimos 14 dias</SelectItem>
            <SelectItem value="30">Últimos 30 dias</SelectItem>
            <SelectItem value="90">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis.map(kpi => (
          <Card key={kpi.label} className="rounded-2xl border-border/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className={`w-4 h-4 ${kpi.accent}`} />
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Area Chart - Quiz starts vs completions */}
        <Card className="lg:col-span-2 rounded-2xl border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Quiz: Iniciados vs Completos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gStart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(155, 25%, 38%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(155, 25%, 38%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gComp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(42, 55%, 62%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(42, 55%, 62%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 15%, 88%)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(5)} stroke="hsl(220, 8%, 50%)" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(220, 8%, 50%)" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(35, 15%, 88%)', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="started" stroke="hsl(155, 25%, 38%)" fill="url(#gStart)" name="Iniciados" />
                  <Area type="monotone" dataKey="completed" stroke="hsl(42, 55%, 62%)" fill="url(#gComp)" name="Completos" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Subscriptions */}
        <Card className="rounded-2xl border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Assinaturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={subs} dataKey="count" nameKey="plan" cx="50%" cy="50%" outerRadius={70} innerRadius={40} strokeWidth={2}>
                    {subs.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(35, 15%, 88%)', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {subs.map((s, i) => (
                <div key={s.plan} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  <span className="capitalize">{s.plan} ({s.count})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Bar Chart */}
      <Card className="rounded-2xl border-border/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Taxa de Conversão Diária (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 15%, 88%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(5)} stroke="hsl(220, 8%, 50%)" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(220, 8%, 50%)" domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(35, 15%, 88%)', fontSize: '12px' }} />
                <Bar dataKey="conversionRate" fill="hsl(155, 25%, 38%)" radius={[4, 4, 0, 0]} name="Conversão %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
