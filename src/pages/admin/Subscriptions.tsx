/**
 * Subscriptions Management - REAL DATA VERSION
 *
 * @author @dev (Dex) - Full Stack Developer
 * @version 2.0.0 (Real Data)
 * @date 2026-02-18
 *
 * Conectado com:
 * - subscriptions (dados reais da Kiwify via Supabase)
 * - users (dados de usuários)
 */

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp, Users, ArrowUpCircle, Loader2, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { supabase } from '@/lib/supabase';

interface SubscriptionRow {
  id: string;
  user_id: string;
  status: string;
  plan_name: string | null;
  amount_cents: number;
  started_at: string | null;
  expires_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  user_email: string;
  user_name: string | null;
}

const PIE_COLORS = ['hsl(155, 25%, 38%)', 'hsl(0, 65%, 55%)', 'hsl(42, 55%, 62%)', 'hsl(220, 8%, 50%)', 'hsl(35, 15%, 80%)'];

const statusLabels: Record<string, string> = {
  active: 'Ativa',
  cancelled: 'Cancelada',
  expired: 'Expirada',
  paused: 'Pausada',
  refunded: 'Reembolsada',
};

const Subscriptions = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  // Buscar assinaturas reais do Supabase
  const { data: subscriptions = [], isLoading, error } = useQuery({
    queryKey: ['admin-subscriptions'],
    
    queryFn: async (): Promise<SubscriptionRow[]> => {
      console.log('[Subscriptions] Buscando...');

      // Query simples primeiro (sem join que pode falhar)
      const { data, error } = await supabase
        .from('subscriptions')
        .select('id, user_id, status, plan_name, amount_cents, started_at, expires_at, cancelled_at, created_at')
        .order('created_at', { ascending: false });

      console.log('[Subscriptions] Resultado:', { data, error });

      if (error) throw new Error(`Erro: ${error.message} (code: ${error.code})`);
      if (!data) return [];

      // Buscar emails dos usuários separadamente
      const userIds = [...new Set(data.map(s => s.user_id))];
      let usersMap = new Map<string, { email: string; full_name: string | null }>();
      try {
        const { data: usersData } = await supabase
          .from('users')
          .select('id, email, full_name')
          .in('id', userIds);
        usersData?.forEach(u => usersMap.set(u.id, { email: u.email, full_name: u.full_name }));
      } catch (e) { console.warn('[Subscriptions] Users query failed:', e); }

      return data.map((sub: any) => ({
        id: sub.id,
        user_id: sub.user_id,
        status: sub.status,
        plan_name: sub.plan_name,
        amount_cents: sub.amount_cents || 0,
        started_at: sub.started_at,
        expires_at: sub.expires_at,
        cancelled_at: sub.cancelled_at,
        created_at: sub.created_at,
        user_email: usersMap.get(sub.user_id)?.email || 'N/A',
        user_name: usersMap.get(sub.user_id)?.full_name || null,
      }));
    },
    retry: 1,
    refetchInterval: 30000,
  });

  // Buscar total de usuários para conversão
  const { data: totalUsers = 0 } = useQuery({
    queryKey: ['admin-total-users'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      if (error) throw new Error(`Erro ao contar usuários: ${error.message}`);
      return count || 0;
    },
    retry: 1,
    refetchInterval: 60000,
  });

  // Calcular métricas
  const metrics = useMemo(() => {
    const activeCount = subscriptions.filter(s => s.status === 'active').length;
    const totalRevenue = subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + s.amount_cents, 0) / 100;
    const avgTicket = activeCount > 0 ? totalRevenue / activeCount : 0;
    const conversionPct = totalUsers > 0 ? Math.round((activeCount / totalUsers) * 100) : 0;

    return { activeCount, totalRevenue, avgTicket, conversionPct };
  }, [subscriptions, totalUsers]);

  // Distribuição por status para pie chart
  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    subscriptions.forEach(s => {
      counts[s.status] = (counts[s.status] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([status, count]) => ({
        name: statusLabels[status] || status,
        status,
        count,
      }))
      .filter(s => s.count > 0);
  }, [subscriptions]);

  // Receita por plano
  const revenueByPlan = useMemo(() => {
    const planMap: Record<string, { count: number; revenue: number }> = {};
    subscriptions.forEach(s => {
      const plan = s.plan_name || 'Sem plano';
      if (!planMap[plan]) planMap[plan] = { count: 0, revenue: 0 };
      planMap[plan].count++;
      if (s.status === 'active') {
        planMap[plan].revenue += s.amount_cents / 100;
      }
    });
    return Object.entries(planMap).map(([plan, data]) => ({
      plan,
      ...data,
    }));
  }, [subscriptions]);

  const filtered = useMemo(() => {
    if (filterStatus === 'all') return subscriptions;
    return subscriptions.filter(s => s.status === filterStatus);
  }, [subscriptions, filterStatus]);

  const formatDate = (iso: string | null) => iso ? new Date(iso).toLocaleDateString('pt-BR') : '—';
  const formatCurrency = (cents: number) => `R$ ${(cents / 100).toFixed(2)}`;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando assinaturas...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
          <div>
            <h3 className="font-semibold text-lg">Erro ao carregar assinaturas</h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : 'Erro desconhecido'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Assinaturas</h1>
        <p className="text-sm text-muted-foreground">Gerenciamento de planos e receita</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="rounded-2xl border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-accent" /><span className="text-xs text-muted-foreground">Receita Mensal</span></div>
            <p className="text-xl font-bold text-foreground">R$ {metrics.totalRevenue.toFixed(0)}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Assinaturas Ativas</span></div>
            <p className="text-xl font-bold text-foreground">{metrics.activeCount}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Ticket Médio</span></div>
            <p className="text-xl font-bold text-foreground">R$ {metrics.avgTicket.toFixed(0)}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1"><ArrowUpCircle className="w-4 h-4 text-accent" /><span className="text-xs text-muted-foreground">% Conversão</span></div>
            <p className="text-xl font-bold text-foreground">{metrics.conversionPct}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Pie */}
        <Card className="rounded-2xl border-border/30">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Distribuição por Status</CardTitle></CardHeader>
          <CardContent>
            {statusBreakdown.length > 0 ? (
              <>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusBreakdown} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} strokeWidth={2}>
                        {statusBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {statusBreakdown.map((s, i) => (
                    <div key={s.status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span>{s.name} ({s.count})</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Nenhuma assinatura encontrada</div>
            )}
          </CardContent>
        </Card>

        {/* Revenue per plan */}
        <Card className="lg:col-span-2 rounded-2xl border-border/30">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Receita por Plano</CardTitle></CardHeader>
          <CardContent>
            {revenueByPlan.length > 0 ? (
              <div className="space-y-4">
                {revenueByPlan.map((s, i) => (
                  <div key={s.plan} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{s.plan}</p>
                        <p className="text-xs text-muted-foreground">{s.count} assinaturas</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-foreground">R$ {s.revenue.toFixed(0)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">Nenhum dado de receita</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <Card className="rounded-2xl border-border/30">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Assinaturas ({filtered.length})</CardTitle>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
                <SelectItem value="expired">Expiradas</SelectItem>
                <SelectItem value="paused">Pausadas</SelectItem>
                <SelectItem value="refunded">Reembolsadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Plano</TableHead>
                <TableHead className="hidden md:table-cell">Valor</TableHead>
                <TableHead className="hidden lg:table-cell">Início</TableHead>
                <TableHead className="hidden lg:table-cell">Expira</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 50).map(sub => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium text-foreground">{sub.user_name || sub.user_email.split('@')[0]}</TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{sub.user_email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize rounded-full text-xs">
                      {statusLabels[sub.status] || sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{sub.plan_name || '—'}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs font-medium text-foreground">{formatCurrency(sub.amount_cents)}</TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{formatDate(sub.started_at)}</TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{formatDate(sub.expires_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">Nenhuma assinatura encontrada</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscriptions;
