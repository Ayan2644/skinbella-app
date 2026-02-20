/**
 * Dev Login - Bypass Magic Link for Development
 *
 * @author @dev (Dex) - Backend Developer
 * APENAS PARA DESENVOLVIMENTO - Remover em produção!
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { setMockUser } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const DevLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('yan.barcelosbp@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock login — works offline / without Supabase
  const handleMockLogin = () => {
    setMockUser({
      id: 'mock-' + Date.now(),
      email: email || 'dev@skinbella.com',
      isAdmin: true,
    });
    toast({ title: 'Mock login realizado!' });
    window.location.href = '/app';
  };

  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result = await supabase.auth.signInWithPassword({
        email,
        password: password || 'dev123456',
      });

      if (result.error) {
        result = await supabase.auth.signUp({
          email,
          password: password || 'dev123456',
          options: { emailRedirectTo: window.location.origin },
        });
      }

      if (result.error) throw result.error;

      if (result.data.user) {
        await supabase.from('users').upsert({
          email: result.data.user.email,
          full_name: 'Yan Barcelos',
          is_admin: true,
        }, { onConflict: 'email' });
      }

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
            <Label htmlFor="password">Senha (opcional)</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Padrão: dev123456" disabled={loading} />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Entrando...</> : 'Login Supabase'}
          </Button>
        </form>

        <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">ou</span></div></div>

        <Button variant="outline" className="w-full" onClick={handleMockLogin}>
          🧪 Mock Login (localStorage)
        </Button>

        <p className="text-center text-xs text-muted-foreground">⚠️ Apenas para desenvolvimento</p>
      </div>
    </div>
  );
};

export default DevLogin;
