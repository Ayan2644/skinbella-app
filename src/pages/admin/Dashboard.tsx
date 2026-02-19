/**
 * Admin Dashboard - REAL DATA with fallback
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, TrendingUp, DollarSign, Activity, Ban, Loader2, AlertCircle, Webhook, Clock } from 'lucide-react';
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

  // Fetch metrics with fallback to direct count
  const { data: metrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ['admin-metrics-latest'],
    queryFn: async () => {
      // Try admin_metrics table first
      const { data } = await supabase
        .from('admin_metrics')
        .select('*')
        .eq('metric_date', new Date().toISOString().split('T')[0])
        .order('calculated_at', { ascending: false })
        .limit(1)
        .single();

      if (data) return data as AdminMetrics;

      // Fallback: calculate directly from tables
      const [usersRes, activeSubsRes, cancelledSubsRes, mrrRes] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('subscriptions').select('id', { count: 'exact', head: true }).in('status', ['cancelled', 'chargedback', 'refunded']),
        supabase.from('subscriptions').select('amount_cents').eq('status', 'active'),
      ]);

      const mrr = mrrRes.data?.reduce((sum, s) => sum + (s.amount_cents || 0), 0) || 0;

      return {
        metric_date: new Date().toISOString().split('T')[0],
        total_users: usersRes.count || 0,
        active_subscriptions: activeSubsRes.count || 0,
        cancelled_subscriptions: cancelledSubsRes.count || 0,
        mrr_cents: mrr,
        new_users_today: 0,
        quiz_completions_today: 0,
        calculated_at: new Date().toISOString(),
      } as AdminMetrics;
    },
    refetchInterval: 30000,
  });

  // Metrics history
  const { data: metricsHistory } = useQuery({
    queryKey: ['admin-metrics-history', period],
    queryFn: async () => {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - Number(period));

      const { data } = await supabase
        .from('admin_metrics')
        .select('*')
        .gte('metric_date', daysAgo.toISOString().split('T')[0])
        .order('metric_date', { ascending: true });

      return (data || []) as AdminMetrics[];
    },
    refetchInterval: 60000,
  });

  // Subscription distribution
  const { data: subscriptionStats } = useQuery({
    queryKey: ['subscription-stats'],
    queryFn: async () => {
      const { data } = await supabase.from('subscriptions').select('status');

      const stats = data?.reduce((acc, sub) => {
        acc[sub.status] = (acc[sub.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      return [
        { name: 'Ativa', count: stats.active || 0, color: 'hsl(155, 25%, 38%)' },
        { name: 'Cancelada', count: stats.cancelled || 0, color: 'hsl(0, 65%, 55%)' },
        { name: 'Atrasada', count: stats.late || 0, color: 'hsl(42, 55%, 62%)' },
        { name: 'Reembolsada', count: stats.refunded || 0, color: 'hsl(220, 8%, 50%)' },
        { name: 'Chargeback', count: stats.chargedback || 0, color: 'hsl(0, 40%, 40%)' },
      ].filter(s => s.count > 0);
    },
    refetchInterval: 60000,
  });

  // Recent webhook events from user_activity
  const { data: recentEvents } = useQuery({
    queryKey: ['recent-webhook-events'],
    queryFn: async () => {
      const { data } = await supabase
        .from('user_activity')
        .select('activity_type, activity_data, created_at, user_id')
        .in('activity_type', ['purchase_approved', 'subscription_canceled', 'subscription_renewed', 'subscription_late', 'refund', 'chargeback'])
        .order('created_at', { ascending: false })
        .limit(10);

      return data || [];
    },
    refetchInterval: 15000,
  });

  if (loadingMetrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando métricas...</p>
        </div>
      </div>
    );
  }

  const m = metrics || {
    total_users: 0, active_subscriptions: 0, cancelled_subscriptions: 0,
    mrr_cents: 0, new_users_today: 0, calculated_at: new Date().toISOString()
  };

  const kpis = [
    { label: 'Total Usuários', value: m.total_users, icon: Users, accent: 'text-primary' },
    { label: 'Assinaturas Ativas', value: m.active_subscriptions, icon: Activity, accent: 'text-accent' },
    { label: 'Canceladas', value: m.cancelled_subscriptions, icon: Ban, accent: 'text-destructive' },
    { label: 'MRR (Mensal)', value: `R$ ${(m.mrr_cents / 100).toFixed(2)}`, icon: DollarSign, accent: 'text-primary' },
    { label: 'Novos Hoje', value: m.new_users_today, icon: TrendingUp, accent: 'text-accent' },
  ];

  const chartData = metricsHistory?.map(h => ({
    date: new Date(h.metric_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    users: h.total_users,
    active: h.active_subscriptions,
    mrr: h.mrr_cents / 100,
  })) || [];

  const eventLabels: Record<string, string> = {
    purchase_approved: '✅ Compra Aprovada',
    subscription_canceled: '❌ Cancelamento',
    subscription_renewed: '🔄 Renovação',
    subscription_late: '⚠️ Atrasada',
    refund: '💰 Reembolso',
    chargeback: '🚨 Chargeback',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Admin</h1>
          <p className="text-sm text-muted-foreground">
            Dados em tempo real do webhook Kiwify
            <span className="ml-2 text-xs text-primary">
              • Atualizado: {new Date(m.calculated_at).toLocaleTimeString('pt-BR')}
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
        {/* Area Chart */}
        <Card className="lg:col-span-2 rounded-2xl border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Evolução - Usuários vs Assinaturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {chartData.length > 0 ? (
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
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Aguardando dados do webhook para exibir gráfico
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="rounded-2xl border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Status de Assinaturas</CardTitle>
          </CardHeader>
          <CardContent>
            {subscriptionStats && subscriptionStats.length > 0 ? (
              <>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={subscriptionStats} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} strokeWidth={2}>
                        {subscriptionStats.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(35, 15%, 88%)', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {subscriptionStats.map(s => (
                    <div key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                      <span>{s.name} ({s.count})</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                Nenhuma assinatura registrada
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Webhook Events + MRR */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Events */}
        <Card className="rounded-2xl border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Webhook className="w-4 h-4" />
              Últimos Eventos do Webhook
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentEvents && recentEvents.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentEvents.map((ev, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                    <div>
                      <span className="text-sm font-medium">
                        {eventLabels[ev.activity_type] || ev.activity_type}
                      </span>
                      {ev.activity_data && typeof ev.activity_data === 'object' && (ev.activity_data as any).plan && (
                        <p className="text-xs text-muted-foreground">{(ev.activity_data as any).plan}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(ev.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                <Webhook className="w-4 h-4 mr-2" />
                Nenhum evento recebido ainda
              </div>
            )}
          </CardContent>
        </Card>

        {/* MRR Chart */}
        <Card className="rounded-2xl border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Receita Mensal (MRR)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              {chartData.length > 0 ? (
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
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Aguardando dados históricos
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
