/**
 * Funnel Analysis v3 — Granular tracking with per-preset breakdown
 */

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDown, Users, FileText, UserPlus, CreditCard, Loader2, AlertCircle, Eye, MousePointerClick, TrendingDown, BarChart3 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface FunnelMetrics {
  quizStarted: number;
  quizCompleted: number;
  resultViewed: number;
  ctaClicked: number;
  signups: number;
  paid: number;
  productsPageViewed: number;
  productSectionScrolled: number;
  comboCTAClicked: number;
  comboCTAStickyClicked: number;
  comboPurchased: number;
}

interface PresetInfo {
  preset_id: string;
  name: string;
  is_active: boolean;
}

interface DropOffDetail {
  questionIndex: number;
  questionId: string;
  answeredCount: number;
}

const Funnel = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('all');

  // Fetch presets
  const { data: presets } = useQuery({
    queryKey: ['funnel-presets'],
    queryFn: async () => {
      const { data } = await supabase.from('quiz_presets').select('preset_id, name, is_active').order('created_at');
      return (data ?? []) as PresetInfo[];
    },
  });

  // Fetch funnel metrics
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['admin-funnel-v3', selectedPreset],
    queryFn: async (): Promise<FunnelMetrics> => {
      let query = supabase.from('quiz_events').select('event_type', { count: 'exact', head: false });
      if (selectedPreset !== 'all') {
        query = query.eq('preset_id', selectedPreset);
      }
      const { data: events } = await query;

      const counts: Record<string, number> = {};
      (events ?? []).forEach((e: any) => {
        counts[e.event_type] = (counts[e.event_type] || 0) + 1;
      });

      // Signups and paid from existing tables
      let signups = 0, paid = 0;
      try {
        const res = await supabase.from('users').select('*', { count: 'exact', head: true });
        signups = res.count || 0;
      } catch { /* ignore */ }
      try {
        const res = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active');
        paid = res.count || 0;
      } catch { /* ignore */ }

      return {
        quizStarted: counts['quiz_started'] || 0,
        quizCompleted: counts['quiz_completed'] || 0,
        resultViewed: counts['result_viewed'] || 0,
        ctaClicked: counts['cta_clicked'] || 0,
        signups,
        paid,
        productsPageViewed: counts['products_page_viewed'] || 0,
        productSectionScrolled: counts['product_section_scrolled'] || 0,
        comboCTAClicked: counts['combo_cta_clicked'] || 0,
        comboCTAStickyClicked: counts['combo_cta_sticky_clicked'] || 0,
        comboPurchased: counts['combo_purchased'] || 0,
      };
    },
    refetchInterval: 30000,
  });

  // Fetch drop-off details (per-question)
  const { data: dropOffData } = useQuery({
    queryKey: ['funnel-dropoff', selectedPreset],
    queryFn: async (): Promise<DropOffDetail[]> => {
      let query = supabase.from('quiz_events').select('question_index, question_id').eq('event_type', 'question_answered');
      if (selectedPreset !== 'all') {
        query = query.eq('preset_id', selectedPreset);
      }
      const { data } = await query;
      if (!data || data.length === 0) return [];

      const byIndex = new Map<number, { questionId: string; count: number }>();
      data.forEach((e: any) => {
        if (e.question_index == null) return;
        const existing = byIndex.get(e.question_index);
        if (existing) {
          existing.count++;
        } else {
          byIndex.set(e.question_index, { questionId: e.question_id || '', count: 1 });
        }
      });

      return Array.from(byIndex.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([idx, info]) => ({
          questionIndex: idx,
          questionId: info.questionId,
          answeredCount: info.count,
        }));
    },
    refetchInterval: 30000,
  });

  const steps = useMemo(() => {
    if (!metrics) return [];
    const { quizStarted, quizCompleted, resultViewed, ctaClicked, signups, paid } = metrics;
    const base = quizStarted || 1;
    return [
      { label: 'Iniciaram Quiz', value: quizStarted, icon: Users, pct: 100 },
      { label: 'Completaram Quiz', value: quizCompleted, icon: FileText, pct: Math.round((quizCompleted / base) * 100) },
      { label: 'Viram Resultado', value: resultViewed, icon: Eye, pct: Math.round((resultViewed / base) * 100) },
      { label: 'Clicaram CTA', value: ctaClicked, icon: MousePointerClick, pct: Math.round((ctaClicked / base) * 100) },
      { label: 'Criaram Conta', value: signups, icon: UserPlus, pct: Math.round((signups / base) * 100) },
      { label: 'Assinaram', value: paid, icon: CreditCard, pct: Math.round((paid / base) * 100) },
    ];
  }, [metrics]);

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

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
          <h3 className="font-semibold text-lg">Erro ao carregar funil</h3>
          <p className="text-sm text-muted-foreground">{error instanceof Error ? error.message : 'Erro desconhecido'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Preset Filter */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Funil de Conversão</h1>
          <p className="text-sm text-muted-foreground">Tracking milimétrico • Atualização a cada 30s</p>
        </div>
        <Select value={selectedPreset} onValueChange={setSelectedPreset}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Predefinição" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as predefinições</SelectItem>
            {presets?.map((p) => (
              <SelectItem key={p.preset_id} value={p.preset_id}>
                {p.name} {p.is_active ? '(ativa)' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                    width: `${100 - i * 10}%`,
                    background: `hsl(155, 25%, ${38 + i * 8}% / ${0.18 + (5 - i) * 0.03})`,
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

      {/* Drop-off Analysis Between Steps */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-destructive" />
          Drop-off entre etapas
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {steps.slice(0, steps.length - 1).map((s, i) => {
            const next = steps[i + 1];
            if (!next) return null;
            const convRate = s.value > 0 ? Math.round((next.value / s.value) * 100) : 0;
            const dropOff = s.value - next.value;
            return (
              <Card key={s.label} className="rounded-2xl border-border/30">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1 truncate">{s.label} → {next.label}</p>
                  <p className="text-2xl font-bold text-foreground">{convRate}%</p>
                  <p className="text-xs text-destructive">-{dropOff} perdidos</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Per-Question Drop-off */}
      {dropOffData && dropOffData.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Respostas por pergunta
          </h2>
          <Card className="rounded-2xl border-border/30">
            <CardContent className="p-4">
              <div className="space-y-3">
                {dropOffData.map((item, i) => {
                  const maxCount = dropOffData[0]?.answeredCount || 1;
                  const pct = Math.round((item.answeredCount / maxCount) * 100);
                  const prevCount = i > 0 ? dropOffData[i - 1].answeredCount : metrics?.quizStarted || item.answeredCount;
                  const dropPct = prevCount > 0 ? Math.round(((prevCount - item.answeredCount) / prevCount) * 100) : 0;

                  return (
                    <div key={item.questionIndex} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground font-medium">
                          Pergunta {item.questionIndex + 1}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-foreground font-semibold">{item.answeredCount}</span>
                          {dropPct > 0 && (
                            <span className="text-xs text-destructive">-{dropPct}%</span>
                          )}
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Products Page Funnel */}
      {metrics && (metrics.productsPageViewed > 0 || metrics.comboCTAClicked > 0) && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <MousePointerClick className="w-5 h-5 text-primary" />
            Funil de Produtos
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: 'Viram Página Produtos', value: metrics.productsPageViewed },
              { label: 'Rolaram até Produto', value: metrics.productSectionScrolled },
              { label: 'CTA Combo (principal)', value: metrics.comboCTAClicked },
              { label: 'CTA Combo (sticky)', value: metrics.comboCTAStickyClicked },
              { label: 'Compraram Combo', value: metrics.comboPurchased },
            ].map((item) => {
              const base = metrics.productsPageViewed || 1;
              const pct = Math.round((item.value / base) * 100);
              return (
                <Card key={item.label} className="rounded-2xl border-border/30">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-2xl font-bold text-foreground">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{pct}% dos que viram</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {metrics && metrics.quizStarted === 0 && (
        <div className="flex items-center justify-center h-32">
          <div className="text-center space-y-2">
            <AlertCircle className="w-10 h-10 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nenhum evento registrado ainda. Os dados aparecerão assim que alguém iniciar o quiz.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funnel;
