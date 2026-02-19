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
import { Loader2 } from 'lucide-react';

const DevLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('yan.barcelosbp@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Tentar login com senha (se já tem conta)
      let result = await supabase.auth.signInWithPassword({
        email,
        password: password || 'dev123456', // Senha padrão dev
      });

      // Se falhar, tentar criar conta
      if (result.error) {
        console.log('Tentando criar conta...');
        result = await supabase.auth.signUp({
          email,
          password: password || 'dev123456',
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
      }

      if (result.error) throw result.error;

      // Garantir que user existe na tabela users com is_admin
      if (result.data.user) {
        const { error: dbError } = await supabase
          .from('users')
          .upsert({
            email: result.data.user.email,
            full_name: 'Yan Barcelos',
            is_admin: true,
          }, { onConflict: 'email' });

        if (dbError) {
          console.warn('Warning updating user:', dbError);
        }
      }

      toast({
        title: 'Login realizado!',
        description: 'Redirecionando para o dashboard admin...',
      });

      setTimeout(() => {
        navigate('/app/admin');
      }, 1000);

    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Erro no login',
        description: error.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">🔧 Dev Login</h1>
          <p className="text-sm text-muted-foreground">
            Login de desenvolvimento (bypass magic link)
          </p>
        </div>

        <form onSubmit={handleDevLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu-email@exemplo.com"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha (opcional)</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Deixe vazio para usar: dev123456"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Senha padrão: dev123456
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar como Admin'
            )}
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          <p>⚠️ Apenas para desenvolvimento</p>
          <p>Produção usará Magic Link</p>
        </div>
      </div>
    </div>
  );
};

export default DevLogin;
