/**
 * Quick Login - Ultra Simples para Dev
 * Bypassa completamente autenticação para testes
 */

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

const QuickLogin = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Auto-login ao carregar página
    autoLogin();
  }, []);

  const autoLogin = async () => {
    try {
      setStatus('🔧 Criando conta de desenvolvimento...');

      // Criar usuário diretamente na tabela (bypass Auth)
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'yan.barcelosbp@gmail.com')
        .single();

      if (!existingUser) {
        setStatus('📝 Criando usuário admin...');
        const { error } = await supabase
          .from('users')
          .insert({
            email: 'yan.barcelosbp@gmail.com',
            full_name: 'Yan Barcelos',
            is_admin: true,
          });

        if (error) {
          setStatus(`❌ Erro: ${error.message}`);
          return;
        }
      } else {
        setStatus('✅ Usuário já existe!');
      }

      setStatus('🚀 Redirecionando para dashboard...');

      // Redirecionar após 1 segundo
      setTimeout(() => {
        window.location.href = '/app/admin';
      }, 1000);

    } catch (error: any) {
      setStatus(`❌ Erro: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-6">
        <div className="text-6xl mb-4">⚡</div>
        <h1 className="text-3xl font-bold">Quick Login</h1>
        <p className="text-lg text-muted-foreground">{status}</p>

        <div className="text-xs text-muted-foreground space-y-2 pt-4">
          <p>⚠️ Modo de desenvolvimento</p>
          <p>Bypass de autenticação ativo</p>
        </div>

        <Button onClick={autoLogin} variant="outline" className="mt-4">
          Tentar Novamente
        </Button>
      </div>
    </div>
  );
};

export default QuickLogin;
