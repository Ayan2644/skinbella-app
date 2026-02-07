import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { storage } from '@/lib/storage';
import { ADMIN_CREDENTIALS } from '@/lib/adminData';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    const isAdmin = email.trim() === ADMIN_CREDENTIALS.email && password.trim() === ADMIN_CREDENTIALS.password;
    const displayName = email.trim().split('@')[0];
    storage.login(displayName, email.trim(), isAdmin);

    if (!isAdmin && !storage.getProfile()) {
      toast({ title: 'Faça o quiz primeiro', description: 'Complete a análise para acessar seu painel.' });
      navigate('/');
      return;
    }

    toast({ title: isAdmin ? 'Bem-vindo, Admin! 🛡️' : 'Bem-vinda ao SkinBella! ✨', description: isAdmin ? 'Acesso administrativo ativado.' : 'Seu painel está pronto.' });
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-sm w-full animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl gradient-porcelain flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-foreground font-['Playfair_Display'] mb-1">
            {isLogin ? 'Entrar' : 'Criar acesso'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLogin ? 'Acesse seu painel SkinBella' : 'Crie seu acesso gratuito'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="mt-1 rounded-xl h-12"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-foreground">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 rounded-xl h-12"
              required
            />
          </div>
          <Button type="submit" className="w-full rounded-2xl h-14 text-base font-semibold shadow-elegant">
            {isLogin ? 'Entrar' : 'Criar acesso'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLogin ? 'Não tem conta?' : 'Já tem acesso?'}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium underline underline-offset-2">
            {isLogin ? 'Criar acesso' : 'Entrar'}
          </button>
        </p>

        <button onClick={() => navigate('/')} className="block mx-auto mt-4 text-xs text-muted-foreground underline underline-offset-2">
          Voltar ao quiz
        </button>
      </div>
    </div>
  );
};

export default Login;
