/**
 * Dev Login - Password login for admin access.
 * Blocked in production — use /login with magic link instead.
 */

import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const DevLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Bloquear em produção — rota só disponível em desenvolvimento
  if (import.meta.env.PROD) {
    return <Navigate to="/login" replace />;
  }

  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      toast({ title: 'Login realizado!', description: 'Redirecionando...' });
      setTimeout(() => navigate('/app/admin'), 1000);
    } catch (error: any) {
      console.error('Login error:', error);
      toast({ title: 'Erro no login', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">🔧 Dev Login</h1>
          <p className="text-sm text-muted-foreground">Login de desenvolvimento</p>
        </div>

        <form onSubmit={handleDevLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" disabled={loading} />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Entrando...</> : 'Login'}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">⚠️ Apenas para desenvolvimento — bloqueado em produção</p>
      </div>
    </div>
  );
};

export default DevLogin;
