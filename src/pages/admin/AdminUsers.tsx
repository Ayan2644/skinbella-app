import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { generateMockUsers, MockUser } from '@/lib/adminData';
import { Search, Ban, CheckCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const statusColors: Record<MockUser['status'], string> = {
  active: 'bg-primary/10 text-primary',
  inactive: 'bg-muted text-muted-foreground',
  blocked: 'bg-destructive/10 text-destructive',
};
const subColors: Record<MockUser['subscription'], string> = {
  free: 'bg-muted text-muted-foreground',
  premium: 'bg-primary/10 text-primary',
  vip: 'bg-accent/20 text-accent-foreground',
};

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(() => generateMockUsers());
  const [search, setSearch] = useState('');
  const [filterSub, setFilterSub] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState<MockUser | null>(null);

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
      const matchSub = filterSub === 'all' || u.subscription === filterSub;
      const matchStatus = filterStatus === 'all' || u.status === filterStatus;
      return matchSearch && matchSub && matchStatus;
    });
  }, [users, search, filterSub, filterStatus]);

  const toggleBlock = (userId: string) => {
    setUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, status: u.status === 'blocked' ? 'active' : 'blocked' as MockUser['status'] } : u
    ));
    toast({ title: 'Status atualizado' });
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('pt-BR');

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
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
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
              <TableHead>Plano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Quiz</TableHead>
              <TableHead className="hidden md:table-cell">Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`${subColors[user.subscription]} text-xs capitalize rounded-full`}>{user.subscription}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`${statusColors[user.status]} text-xs capitalize rounded-full`}>{user.status === 'active' ? 'Ativo' : user.status === 'inactive' ? 'Inativo' : 'Bloqueado'}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.quizCompleted ? <CheckCircle className="w-4 h-4 text-primary" /> : <span className="text-xs text-muted-foreground">—</span>}
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected(user)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleBlock(user.id)}>
                      <Ban className={`w-4 h-4 ${user.status === 'blocked' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
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
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">{selected.email}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Plano</span><Badge variant="secondary" className={`${subColors[selected.subscription]} capitalize rounded-full`}>{selected.subscription}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant="secondary" className={`${statusColors[selected.status]} capitalize rounded-full`}>{selected.status}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Quiz completo</span><span className="text-foreground">{selected.quizCompleted ? 'Sim' : 'Não'}</span></div>
              {selected.skinAge && <div className="flex justify-between"><span className="text-muted-foreground">Idade da pele</span><span className="text-foreground">{selected.skinAge} anos</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Cadastro</span><span className="text-foreground">{formatDate(selected.createdAt)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Último acesso</span><span className="text-foreground">{formatDate(selected.lastActive)}</span></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
