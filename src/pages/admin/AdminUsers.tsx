/**
 * Admin Users - REAL DATA VERSION
 *
 * @author @dev (Dex) - Full Stack Developer
 * @version 2.0.0 (Real Data)
 * @date 2026-02-18
 *
 * Conectado com:
 * - users (dados reais do Supabase)
 * - subscriptions (status de assinatura)
 * - quiz_results (skin age)
 */

import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Ban, CheckCircle, Eye, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
  is_admin: boolean;
  is_blocked: boolean;
  subscription_status: string | null;
  plan_name: string | null;
  skin_age: number | null;
  quiz_completed: boolean;
}

const statusColors: Record<string, string> = {
  active: 'bg-primary/10 text-primary',
  inactive: 'bg-muted text-muted-foreground',
  blocked: 'bg-destructive/10 text-destructive',
};

const subColors: Record<string, string> = {
  free: 'bg-muted text-muted-foreground',
  active: 'bg-primary/10 text-primary',
  cancelled: 'bg-destructive/10 text-destructive',
  expired: 'bg-muted text-muted-foreground',
  paused: 'bg-accent/20 text-accent-foreground',
};

const AdminUsers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterSub, setFilterSub] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState<AdminUser | null>(null);

  // Buscar usuários reais do Supabase
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async (): Promise<AdminUser[]> => {
      console.log('[AdminUsers] Buscando usuários...');

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('[AdminUsers] Resultado:', JSON.stringify({ usersData, usersError }, null, 2));

      if (usersError) throw new Error(`Erro: ${usersError.message} (code: ${usersError.code}, details: ${usersError.details}, hint: ${usersError.hint})`);
      if (!usersData || usersData.length === 0) return [];

      // Buscar dados complementares (podem falhar sem bloquear)
      let subsMap = new Map<string, { status: string; plan_name: string | null }>();
      let quizMap = new Map<string, number | null>();

      try {
        const { data: subsData } = await supabase
          .from('subscriptions')
          .select('user_id, status, plan_name');
        subsData?.forEach(sub => {
          if (!subsMap.has(sub.user_id)) {
            subsMap.set(sub.user_id, { status: sub.status, plan_name: sub.plan_name });
          }
        });
      } catch (e) { console.warn('[AdminUsers] Subscriptions query failed:', e); }

      try {
        const { data: quizData } = await supabase
          .from('quiz_results')
          .select('user_id, skin_age');
        quizData?.forEach(q => {
          if (!quizMap.has(q.user_id)) quizMap.set(q.user_id, q.skin_age);
        });
      } catch (e) { console.warn('[AdminUsers] Quiz query failed:', e); }

      return usersData.map((user: any) => ({
        id: user.id,
        email: user.email,
        full_name: user.full_name || null,
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at,
        is_admin: user.is_admin ?? false,
        is_blocked: user.is_blocked ?? false,
        subscription_status: subsMap.get(user.id)?.status || null,
        plan_name: subsMap.get(user.id)?.plan_name || null,
        skin_age: quizMap.get(user.id) ?? null,
        quiz_completed: quizMap.has(user.id),
      }));
    },
    retry: false,
    refetchInterval: 30000,
  });

  // Mutation para bloquear/desbloquear
  const blockMutation = useMutation({
    mutationFn: async ({ userId, blocked }: { userId: string; blocked: boolean }) => {
      const { error } = await supabase
        .from('users')
        .update({ is_blocked: blocked })
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: 'Status atualizado' });
    },
    onError: (err) => {
      toast({ title: 'Erro ao atualizar', description: err instanceof Error ? err.message : 'Erro desconhecido', variant: 'destructive' });
    },
  });

  const getUserStatus = (user: AdminUser): string => {
    if (user.is_blocked) return 'blocked';
    if (user.subscription_status === 'active') return 'active';
    return 'inactive';
  };

  const getSubLabel = (user: AdminUser): string => {
    if (!user.subscription_status) return 'free';
    return user.subscription_status;
  };

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchSearch = !search ||
        (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchSub = filterSub === 'all' ||
        (filterSub === 'free' ? !u.subscription_status : u.subscription_status === filterSub);
      const userStatus = getUserStatus(u);
      const matchStatus = filterStatus === 'all' || userStatus === filterStatus;
      return matchSearch && matchSub && matchStatus;
    });
  }, [users, search, filterSub, filterStatus]);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('pt-BR');

  const toggleBlock = (user: AdminUser) => {
    blockMutation.mutate({ userId: user.id, blocked: !user.is_blocked });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando usuários...</p>
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
            <h3 className="font-semibold text-lg">Erro ao carregar usuários</h3>
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
        <h1 className="text-2xl font-bold text-foreground">Usuários</h1>
        <p className="text-sm text-muted-foreground">{users.length} usuários registrados</p>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border-border/30">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou email..." className="pl-9 rounded-xl" />
            </div>
            <Select value={filterSub} onValueChange={setFilterSub}>
              <SelectTrigger className="w-36 rounded-xl"><SelectValue placeholder="Plano" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos planos</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
                <SelectItem value="expired">Expirada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36 rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="blocked">Bloqueado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="rounded-2xl border-border/30 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead>Assinatura</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Quiz</TableHead>
              <TableHead className="hidden md:table-cell">Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(user => {
              const userStatus = getUserStatus(user);
              const subLabel = getSubLabel(user);
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-foreground">{user.full_name || user.email.split('@')[0]}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${subColors[subLabel] || subColors.free} text-xs capitalize rounded-full`}>{subLabel}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${statusColors[userStatus]} text-xs capitalize rounded-full`}>
                      {userStatus === 'active' ? 'Ativo' : userStatus === 'inactive' ? 'Inativo' : 'Bloqueado'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.quiz_completed ? <CheckCircle className="w-4 h-4 text-primary" /> : <span className="text-xs text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{formatDate(user.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected(user)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleBlock(user)} disabled={blockMutation.isPending}>
                        <Ban className={`w-4 h-4 ${user.is_blocked ? 'text-primary' : 'text-muted-foreground'}`} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm">Nenhum usuário encontrado</div>
        )}
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{selected?.full_name || selected?.email}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">{selected.email}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Assinatura</span>
                <Badge variant="secondary" className={`${subColors[getSubLabel(selected)] || subColors.free} capitalize rounded-full`}>{getSubLabel(selected)}</Badge>
              </div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span>
                <Badge variant="secondary" className={`${statusColors[getUserStatus(selected)]} capitalize rounded-full`}>
                  {getUserStatus(selected) === 'active' ? 'Ativo' : getUserStatus(selected) === 'inactive' ? 'Inativo' : 'Bloqueado'}
                </Badge>
              </div>
              <div className="flex justify-between"><span className="text-muted-foreground">Quiz completo</span><span className="text-foreground">{selected.quiz_completed ? 'Sim' : 'Não'}</span></div>
              {selected.skin_age && <div className="flex justify-between"><span className="text-muted-foreground">Idade da pele</span><span className="text-foreground">{selected.skin_age} anos</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Cadastro</span><span className="text-foreground">{formatDate(selected.created_at)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Admin</span><span className="text-foreground">{selected.is_admin ? 'Sim' : 'Não'}</span></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
