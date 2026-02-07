import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateDailyMetrics } from '@/lib/adminData';
import { ArrowDown, Users, FileText, UserPlus, CreditCard } from 'lucide-react';

const Funnel = () => {
  const metrics = useMemo(() => generateDailyMetrics(30), []);
  const totalStarted = metrics.reduce((s, m) => s + m.started, 0);
  const totalCompleted = metrics.reduce((s, m) => s + m.completed, 0);
  const signups = Math.round(totalCompleted * 0.65);
  const paid = Math.round(signups * 0.22);

  const steps = [
    { label: 'Visitantes do Quiz', value: totalStarted, icon: Users, pct: 100 },
    { label: 'Quiz Completos', value: totalCompleted, icon: FileText, pct: Math.round((totalCompleted / totalStarted) * 100) },
    { label: 'Criaram Acesso', value: signups, icon: UserPlus, pct: Math.round((signups / totalStarted) * 100) },
    { label: 'Assinaram', value: paid, icon: CreditCard, pct: Math.round((paid / totalStarted) * 100) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Funil de Conversão</h1>
        <p className="text-sm text-muted-foreground">Análise do funil nos últimos 30 dias</p>
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
          const dropOff = step.value - next.value;
          const dropPct = Math.round((dropOff / step.value) * 100);
          return (
            <Card key={step.label} className="rounded-2xl border-border/30">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{step.label} → {next.label}</p>
                <p className="text-xl font-bold text-foreground">{100 - dropPct}%</p>
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
