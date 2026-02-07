import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { Home, FileText, Droplets, Sun, CheckSquare, Apple, BookOpen, ShoppingBag, HelpCircle, LogOut, Menu, X, Shield, LayoutDashboard, Users, CreditCard, BarChart3, Bell, Sparkles } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/app', label: 'Home', icon: Home },
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

const bottomNavItems = [
  { path: '/app', label: 'Home', icon: Home },
  { path: '/app/relatorio', label: 'Relatório', icon: FileText },
  { path: '/app/nutrientes', label: 'Nutrientes', icon: Droplets },
  { path: '/app/rotina', label: 'Rotina', icon: Sun },
  { path: '/app/faq', label: 'Mais', icon: Menu },
];

const AppShell = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = storage.getAuth();
  const isAdmin = storage.isAdmin();
  const [menuOpen, setMenuOpen] = useState(false);

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
      <aside className="hidden md:flex flex-col w-60 border-r border-border/50 bg-card p-5">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-accent" />
            <p className="text-sm font-semibold tracking-[0.12em] uppercase text-primary">SkinBella</p>
            {isAdmin && <Shield className="w-3.5 h-3.5 text-accent" />}
          </div>
          <p className="text-sm text-muted-foreground">Olá, {auth.name} {isAdmin ? '🛡️' : '✨'}</p>
        </div>
        <nav className="flex-1 space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              }`}
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </button>
          ))}
          {isAdmin && (
            <>
              <div className="my-4 border-t border-border/50" />
              <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent mb-2">Admin</p>
              {adminNavItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-accent/15 text-accent font-medium'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-[18px] h-[18px]" />
                  {item.label}
                </button>
              ))}
            </>
          )}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-destructive transition-colors mt-4">
          <LogOut className="w-[18px] h-[18px]" />
          Sair
        </button>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-20 bg-card/90 backdrop-blur-xl border-b border-border/30 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <p className="text-sm font-semibold tracking-[0.12em] uppercase text-primary">SkinBella</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl hover:bg-muted/60 transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-xl hover:bg-muted/60 transition-colors">
            {menuOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-card/98 backdrop-blur-xl animate-fade-in pt-16 px-6 overflow-y-auto">
          <div className="pb-4 mb-4 border-b border-border/30">
            <p className="text-lg font-semibold text-foreground">Olá, {auth.name} ✨</p>
            <p className="text-sm text-muted-foreground">Seu painel de cuidados</p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted/60'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
            {isAdmin && (
              <>
                <div className="my-3 border-t border-border/30" />
                <p className="px-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent mb-1">Admin</p>
                {adminNavItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-accent/15 text-accent font-medium'
                        : 'text-muted-foreground hover:bg-muted/60'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </>
            )}
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-destructive">
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </nav>
        </div>
      )}

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-card/95 backdrop-blur-xl border-t border-border/30 px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around py-1.5">
          {bottomNavItems.map((item) => {
            const active = item.path === '/app/faq' 
              ? ['/app/checklist', '/app/dieta', '/app/biblioteca', '/app/produtos', '/app/faq'].some(p => location.pathname.startsWith(p))
              : isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => item.label === 'Mais' ? setMenuOpen(true) : navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 pb-20 md:pb-0 overflow-auto">
        <div className={`mx-auto px-5 py-6 animate-fade-in ${location.pathname.startsWith('/app/admin') ? 'max-w-6xl md:px-8' : 'max-w-2xl'}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppShell;
