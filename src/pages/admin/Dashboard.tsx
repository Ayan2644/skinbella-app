/**
 * Admin Dashboard - REAL DATA VERSION
 *
 * @author @dev (Dex) - Backend Developer
 * @version 3.0.0 (Real Data)
 * @date 2026-02-17
 *
 * Conectado com:
 * - admin_metrics (métricas em tempo real do webhook)
 * - users (usuários reais)
 * - subscriptions (assinaturas reais da Kiwify)
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, TrendingUp, DollarSign, Activity, Ban, Loader2, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/lib/supabase';

interface AdminMetrics {
  metric_date: string;
  total_users: number;
  active_subscriptions: number;
  cancelled_subscriptions: number;
  mrr_cents: number;
  new_users_today: number;
  quiz_completions_today: number;
  calculated_at: string;
}

const Dashboard = () => {
  const [period, setPeriod] = useState('30');

  // Buscar métricas em tempo real
  const { data: latestMetrics, isLoading: loadingMetrics, error: metricsError } = useQuery({
    queryKey: ['admin-metrics-latest'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_metrics')
        .select('*')
        .eq('metric_date', new Date().toISOString().split('T')[0])
        .order('calculated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data as AdminMetrics;
    },
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });

  // Buscar histórico de métricas
  const { data: metricsHistory, isLoading: loadingHistory } = useQuery({
    queryKey: ['admin-metrics-history', period],
    queryFn: async () => {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - Number(period));

      const { data, error } = await supabase
        .from('admin_metrics')
        .select('*')
        .gte('metric_date', daysAgo.toISOString().split('T')[0])
        .order('metric_date', { ascending: true });

      if (error) throw error;
      return data as AdminMetrics[];
    },
    refetchInterval: 60000, // Atualiza a cada 1 minuto
  });

  // Buscar status de subscriptions para gráfico de pizza
  const { data: subscriptionStats } = useQuery({
    queryKey: ['subscription-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('status')
        .then(result => {
          if (result.error) throw result.error;

          const stats = result.data?.reduce((acc, sub) => {
            acc[sub.status] = (acc[sub.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>) || {};

          return [
            { name: 'Ativa', count: stats.active || 0, color: 'hsl(155, 25%, 38%)' },
            { name: 'Cancelada', count: stats.cancelled || 0, color: 'hsl(0, 65%, 55%)' },
            { name: 'Atrasada', count: stats.late || 0, color: 'hsl(42, 55%, 62%)' },
            { name: 'Reembolsada', count: stats.refunded || 0, color: 'hsl(220, 8%, 50%)' },
          ].filter(s => s.count > 0);
        });

      if (error) throw error;
      return data;
    },
    refetchInterval: 60000,
  });

  // Loading state
  if (loadingMetrics || loadingHistory) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando métricas em tempo real...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (metricsError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
          <div>
            <h3 className="font-semibold text-lg">Erro ao carregar métricas</h3>
            <p className="text-sm text-muted-foreground">
              {metricsError instanceof Error ? metricsError.message : 'Erro desconhecido'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Se não há dados, mostrar estado vazio
  if (!latestMetrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="font-semibold text-lg">Nenhuma métrica encontrada</h3>
            <p className="text-sm text-muted-foreground">
              Aguardando o primeiro evento do webhook...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // KPIs com dados REAIS
  const kpis = [
    {
      label: 'Total Usuários',
      value: latestMetrics.total_users,
      icon: Users,
      accent: 'text-primary'
    },
    {
      label: 'Assinaturas Ativas',
      value: latestMetrics.active_subscriptions,
      icon: Activity,
      accent: 'text-accent'
    },
    {
      label: 'Canceladas',
      value: latestMetrics.cancelled_subscriptions,
      icon: Ban,
      accent: 'text-destructive'
    },
    {
      label: 'MRR (Mensal)',
      value: `R$ ${(latestMetrics.mrr_cents / 100).toFixed(2)}`,
      icon: DollarSign,
      accent: 'text-primary'
    },
    {
      label: 'Novos Hoje',
      value: latestMetrics.new_users_today,
      icon: TrendingUp,
      accent: 'text-accent'
    },
  ];

  // Preparar dados do histórico para gráficos
  const chartData = metricsHistory?.map(m => ({
    date: new Date(m.metric_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    users: m.total_users,
    active: m.active_subscriptions,
    cancelled: m.cancelled_subscriptions,
    mrr: m.mrr_cents / 100,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Admin</h1>
          <p className="text-sm text-muted-foreground">
            Dados em tempo real do webhook Kiwify
            <span className="ml-2 text-xs text-primary">
              • Atualizado: {new Date(latestMetrics.calculated_at).toLocaleTimeString('pt-BR')}
            </span>
          </p>
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
        {/* Area Chart - Users & Subscriptions */}
        <Card className="lg:col-span-2 rounded-2xl border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Evolução - Usuários vs Assinaturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(155, 25%, 38%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(155, 25%, 38%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(42, 55%, 62%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(42, 55%, 62%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 15%, 88%)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(220, 8%, 50%)" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(220, 8%, 50%)" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(35, 15%, 88%)', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="users" stroke="hsl(155, 25%, 38%)" fill="url(#gUsers)" name="Total Usuários" />
                  <Area type="monotone" dataKey="active" stroke="hsl(42, 55%, 62%)" fill="url(#gActive)" name="Assinaturas Ativas" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Subscription Status */}
        <Card className="rounded-2xl border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Status de Assinaturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subscriptionStats}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={40}
                    strokeWidth={2}
                  >
                    {subscriptionStats?.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(35, 15%, 88%)', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {subscriptionStats?.map(s => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span>{s.name} ({s.count})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MRR Chart */}
      <Card className="rounded-2xl border-border/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Receita Mensal Recorrente (MRR)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gMRR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(155, 25%, 38%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(155, 25%, 38%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 15%, 88%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(220, 8%, 50%)" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(220, 8%, 50%)" tickFormatter={v => `R$ ${v}`} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid hsl(35, 15%, 88%)', fontSize: '12px' }}
                  formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'MRR']}
                />
                <Area type="monotone" dataKey="mrr" stroke="hsl(155, 25%, 38%)" fill="url(#gMRR)" name="MRR (R$)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
