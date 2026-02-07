import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { Home, FileText, Droplets, Sun, CheckSquare, Apple, BookOpen, ShoppingBag, HelpCircle, LogOut, Menu, X, Shield, LayoutDashboard, Users, CreditCard, BarChart3 } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/app', label: 'Hoje', icon: Home },
  { path: '/app/relatorio', label: 'Relatório', icon: FileText },
  { path: '/app/nutrientes', label: 'Nutrientes', icon: Droplets },
  { path: '/app/rotina', label: 'Rotina', icon: Sun },
  { path: '/app/checklist', label: 'Checklist', icon: CheckSquare },
  { path: '/app/dieta', label: 'Dieta', icon: Apple },
  { path: '/app/biblioteca', label: 'Biblioteca', icon: BookOpen },
  { path: '/app/produtos', label: 'Produtos', icon: ShoppingBag },
  { path: '/app/faq', label: 'FAQ', icon: HelpCircle },
];

const adminNavItems = [
  { path: '/app/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/app/admin/usuarios', label: 'Usuários', icon: Users },
  { path: '/app/admin/assinaturas', label: 'Assinaturas', icon: CreditCard },
  { path: '/app/admin/funil', label: 'Funil', icon: BarChart3 },
];

const AppShell = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = storage.getAuth();
  const isAdmin = storage.isAdmin();
  const [menuOpen, setMenuOpen] = useState(false);
  const allNavItems = isAdmin ? [...navItems, ...adminNavItems] : navItems;

  if (!auth?.loggedIn) return <Navigate to="/login" replace />;
  if (location.pathname.startsWith('/app/admin') && !isAdmin) return <Navigate to="/app" replace />;

  const isActive = (path: string) => {
    if (path === '/app') return location.pathname === '/app';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    storage.logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-border bg-card/50 p-4">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-primary">SkinBella</p>
            {isAdmin && <Shield className="w-3.5 h-3.5 text-accent" />}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Olá, {auth.name} {isAdmin ? '🛡️' : '✨'}</p>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
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
          {isAdmin && (
            <>
              <div className="my-3 border-t border-border/50" />
              <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent mb-1">Admin</p>
              {adminNavItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    isActive(item.path)
                      ? 'bg-accent/15 text-accent font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </>
          )}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-destructive transition-colors">
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-primary">SkinBella</p>
          <p className="text-xs text-muted-foreground">Olá, {auth.name}</p>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-xl bg-muted">
          {menuOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
        </button>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-background/95 backdrop-blur-sm animate-fade-in pt-16 px-6">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
            {isAdmin && (
              <>
                <div className="my-2 border-t border-border/50" />
                <p className="px-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">Admin</p>
                {adminNavItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                      isActive(item.path)
                        ? 'bg-accent/15 text-accent font-medium'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </>
            )}
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive">
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </nav>
        </div>
      )}

      {/* Mobile bottom nav (5 main items) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-card/90 backdrop-blur-md border-t border-border/50 px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
                isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 pb-20 md:pb-0 overflow-auto">
        <div className={`mx-auto px-4 py-6 animate-fade-in ${location.pathname.startsWith('/app/admin') ? 'max-w-6xl md:px-8' : 'max-w-2xl'}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppShell;
