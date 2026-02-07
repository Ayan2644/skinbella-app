import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ADMIN_CREDENTIALS, adminStorage } from '@/lib/adminData';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      adminStorage.login();
      toast({ title: 'Bem-vindo, Admin! 🛡️' });
      navigate('/admin');
    } else {
      toast({ title: 'Credenciais inválidas', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-sm w-full animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Acesso restrito ao administrador</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@skinbella.com" className="mt-1 rounded-xl h-12" required />
          </div>
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-foreground">Senha</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="mt-1 rounded-xl h-12" required />
          </div>
          <Button type="submit" className="w-full rounded-2xl h-14 text-base font-semibold shadow-elegant">
            Entrar
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Credenciais de teste: <span className="font-mono text-foreground">admin@skinbella.com</span> / <span className="font-mono text-foreground">admin123</span>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
