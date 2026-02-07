import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { adminStorage } from '@/lib/adminData';
import { LayoutDashboard, Users, CreditCard, LogOut, Shield, BarChart3 } from 'lucide-react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/usuarios', label: 'Usuários', icon: Users },
  { path: '/admin/assinaturas', label: 'Assinaturas', icon: CreditCard },
  { path: '/admin/funil', label: 'Funil', icon: BarChart3 },
];

const AdminShell = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!adminStorage.isLoggedIn()) return <Navigate to="/admin/login" replace />;

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    adminStorage.logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border bg-card/60 p-4 shrink-0">
        <div className="flex items-center gap-2 mb-8 px-3">
          <Shield className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-bold tracking-wide text-foreground">SkinBella</p>
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive(item.path)
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-destructive transition-colors">
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-foreground">Admin</span>
          </div>
          <button onClick={handleLogout} className="text-xs text-muted-foreground hover:text-destructive">Sair</button>
        </div>
        <div className="flex gap-1 mt-2 overflow-x-auto pb-1">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                isActive(item.path) ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 pt-28 md:pt-6 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminShell;
