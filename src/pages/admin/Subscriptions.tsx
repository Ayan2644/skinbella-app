import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { generateMockUsers, getSubscriptionBreakdown, MockUser } from '@/lib/adminData';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, TrendingUp, Users, ArrowUpCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const PIE_COLORS = ['hsl(35, 15%, 80%)', 'hsl(155, 25%, 38%)', 'hsl(42, 55%, 62%)'];

const Subscriptions = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(() => generateMockUsers());
  const [filterPlan, setFilterPlan] = useState('all');
  const subs = useMemo(() => getSubscriptionBreakdown(users), [users]);
  const totalRevenue = subs.reduce((s, m) => s + m.revenue, 0);
  const paidUsers = users.filter(u => u.subscription !== 'free').length;

  const filtered = useMemo(() => {
    if (filterPlan === 'all') return users;
    return users.filter(u => u.subscription === filterPlan);
  }, [users, filterPlan]);

  const changePlan = (userId: string, plan: MockUser['subscription']) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, subscription: plan } : u));
    toast({ title: `Plano atualizado para ${plan.toUpperCase()}` });
  };

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
            <p className="text-xl font-bold text-foreground">R$ {totalRevenue.toFixed(0)}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Pagantes</span></div>
            <p className="text-xl font-bold text-foreground">{paidUsers}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Ticket Médio</span></div>
            <p className="text-xl font-bold text-foreground">R$ {paidUsers > 0 ? (totalRevenue / paidUsers).toFixed(0) : 0}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1"><ArrowUpCircle className="w-4 h-4 text-accent" /><span className="text-xs text-muted-foreground">% Conversão</span></div>
            <p className="text-xl font-bold text-foreground">{users.length > 0 ? Math.round((paidUsers / users.length) * 100) : 0}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Pie */}
        <Card className="rounded-2xl border-border/30">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Distribuição</CardTitle></CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={subs} dataKey="count" nameKey="plan" cx="50%" cy="50%" outerRadius={70} innerRadius={40} strokeWidth={2}>
                    {subs.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
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

        {/* Revenue per plan */}
        <Card className="lg:col-span-2 rounded-2xl border-border/30">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Receita por Plano</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subs.map((s, i) => (
                <div key={s.plan} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i] }} />
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">{s.plan}</p>
                      <p className="text-xs text-muted-foreground">{s.count} usuários</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-foreground">R$ {s.revenue.toFixed(0)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table with plan management */}
      <Card className="rounded-2xl border-border/30">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Gerenciar Planos</CardTitle>
            <Select value={filterPlan} onValueChange={setFilterPlan}>
              <SelectTrigger className="w-32 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead>Plano Atual</TableHead>
                <TableHead className="text-right">Alterar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 20).map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize rounded-full text-xs">{user.subscription}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select value={user.subscription} onValueChange={(v) => changePlan(user.id, v as MockUser['subscription'])}>
                      <SelectTrigger className="w-28 h-8 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscriptions;
