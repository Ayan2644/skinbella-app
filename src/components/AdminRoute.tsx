/**
 * Admin Route Protection
 * Uses user_roles table via checkIsAdmin for proper RBAC.
 * Mock users with isAdmin=true bypass checks.
 */

import { useEffect, useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, getMockUser } from '@/hooks/useAuth';
import { checkIsAdmin } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading } = useAuth();
  const mockUser = useMemo(() => getMockUser(), []);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const [timedOut, setTimedOut] = useState(false);

  // Safety timeout
  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Mock user with isAdmin bypass
    if (mockUser?.isAdmin) {
      setIsAdmin(true);
      setChecking(false);
      return;
    }

    if (loading) return;

    if (!user?.id) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }

    checkIsAdmin(user.id)
      .then((result) => {
        setIsAdmin(result);
        setChecking(false);
      })
      .catch(() => {
        setIsAdmin(false);
        setChecking(false);
      });
  }, [user?.id, loading, mockUser]);

  // Mock user with isAdmin — always allow
  if (mockUser?.isAdmin) {
    return <>{children}</>;
  }

  if ((loading || checking) && !timedOut) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4 max-w-md px-6">
          <div className="text-6xl">🚫</div>
          <h2 className="text-2xl font-bold">Acesso Negado</h2>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar esta área.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
