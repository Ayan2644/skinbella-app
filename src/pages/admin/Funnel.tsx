/**
 * Funnel Analysis - REAL DATA VERSION
 *
 * @author @dev (Dex) - Full Stack Developer
 * @version 2.0.0 (Real Data)
 * @date 2026-02-18
 *
 * Conectado com:
 * - leads (visitantes e quiz)
 * - users (cadastros)
 * - subscriptions (conversões)
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, Users, FileText, UserPlus, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface FunnelData {
  totalLeads: number;
  quizCompleted: number;
  signups: number;
  paid: number;
}

const Funnel = () => {
  const { data: funnelData, isLoading, error } = useQuery({
    queryKey: ['admin-funnel'],
    retry: false,
    queryFn: async (): Promise<FunnelData> => {
      console.log('[Funnel] Buscando dados...');

      // Buscar cada contagem individualmente com tratamento de erro
      let totalLeads = 0, quizCompleted = 0, signups = 0, paid = 0;

      try {
        const res = await supabase.from('leads').select('*', { count: 'exact', head: true });
        totalLeads = res.count || 0;
      } catch (e) { console.warn('[Funnel] leads query failed:', e); }

      try {
        const res = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('quiz_completed', true);
        quizCompleted = res.count || 0;
      } catch (e) { console.warn('[Funnel] quiz leads query failed:', e); }

      try {
        const res = await supabase.from('users').select('*', { count: 'exact', head: true });
        signups = res.count || 0;
      } catch (e) { console.warn('[Funnel] users query failed:', e); }

      try {
        const res = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active');
        paid = res.count || 0;
      } catch (e) { console.warn('[Funnel] subscriptions query failed:', e); }

      console.log('[Funnel] Resultado:', { totalLeads, quizCompleted, signups, paid });

      return { totalLeads, quizCompleted, signups, paid };
    },
    refetchInterval: 60000,
  });

  const steps = useMemo(() => {
    if (!funnelData) return [];

    const { totalLeads, quizCompleted, signups, paid } = funnelData;
    const base = totalLeads || 1; // evitar divisão por zero

    return [
      { label: 'Visitantes do Quiz', value: totalLeads, icon: Users, pct: 100 },
      { label: 'Quiz Completos', value: quizCompleted, icon: FileText, pct: Math.round((quizCompleted / base) * 100) },
      { label: 'Criaram Conta', value: signups, icon: UserPlus, pct: Math.round((signups / base) * 100) },
      { label: 'Assinaram', value: paid, icon: CreditCard, pct: Math.round((paid / base) * 100) },
    ];
  }, [funnelData]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando funil...</p>
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
            <h3 className="font-semibold text-lg">Erro ao carregar funil</h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : 'Erro desconhecido'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!funnelData || funnelData.totalLeads === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Funil de Conversão</h1>
          <p className="text-sm text-muted-foreground">Análise do funil de conversão</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="font-semibold text-lg">Nenhum dado no funil</h3>
              <p className="text-sm text-muted-foreground">
                Aguardando os primeiros visitantes...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Funil de Conversão</h1>
        <p className="text-sm text-muted-foreground">Dados em tempo real do funil</p>
      </div>

      {/* Visual Funnel */}
      <Card className="rounded-2xl border-border/30">
        <CardContent className="py-8">
          <div className="max-w-md mx-auto space-y-2">
            {steps.map((step, i) => (
              <div key={step.label}>
                <div
                  className="relative mx-auto rounded-2xl p-4 flex items-center gap-3 transition-all"
                  style={{
                    width: `${100 - i * 15}%`,
                    background: `hsl(155, 25%, ${38 + i * 10}% / ${0.15 + (3 - i) * 0.05})`,
                    border: '1px solid hsl(155, 25%, 38% / 0.15)',
                  }}
                >
                  <step.icon className="w-5 h-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.pct}% do total</p>
                  </div>
                  <p className="text-lg font-bold text-foreground">{step.value}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Drop-off Analysis */}
      <div className="grid sm:grid-cols-3 gap-3">
        {steps.slice(0, 3).map((step, i) => {
          const next = steps[i + 1];
          if (!next) return null;
          const dropOff = step.value - next.value;
          const conversionRate = step.value > 0 ? Math.round((next.value / step.value) * 100) : 0;
          const dropPct = 100 - conversionRate;
          return (
            <Card key={step.label} className="rounded-2xl border-border/30">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{step.label} → {next.label}</p>
                <p className="text-xl font-bold text-foreground">{conversionRate}%</p>
                <p className="text-xs text-destructive">-{dropOff} perdidos ({dropPct}%)</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Funnel;
