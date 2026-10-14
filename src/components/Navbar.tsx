import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  Sparkles,
  TrendingUp,
  FolderLock,
  ListTodo,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    user, 
    logout, 
    currentView, 
    setCurrentView,
    setAuthModalOpen,
    setAuthModalMode,
    loginAsLucas,
    activeApplication
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Início', icon: Compass },
    { id: 'catalog', label: 'Explorar editais', icon: Compass },
    { id: 'vault', label: 'Cofre de documentos', icon: FolderLock },
    { 
      id: 'checklist', 
      label: 'Minha inscrição', 
      icon: ListTodo,
      badge: activeApplication ? `${activeApplication.progressPercentage}%` : null 
    },
    { id: 'dashboard', label: 'Performance', icon: TrendingUp },
  ];

  const handleNavClick = (viewId: any) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#1C2647]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Wordmark puro (sem subtítulos ou tags adjacent) */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#1C2647] dark:text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity focus-ring"
          >
            Cultura em Cena
          </button>

          {/* Zone 2: 4–5 links de texto concisos em linha única */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
            {navItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors text-xs lg:text-sm ${
                    isActive 
                      ? 'text-[#25B2C5] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#25B2C5]' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#1C2647] dark:hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.badge && (
                      <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded bg-[#25B2C5]/15 text-[#25B2C5] dark:text-[#25B2C5]">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Ação primária / Estado do Usuário + Tema */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Botão de Tema Claro/Escuro */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-ring"
              aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
              title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#F2B705]" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-[#1C2647]" aria-hidden="true" />
              )}
            </button>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-[#1C2647] dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus-ring"
                  title="Acessar painel de performance de Lucas"
                >
                  <div className="w-2 h-2 rounded-full bg-[#2E9E63]" aria-hidden="true" />
                  <span className="truncate max-w-[130px]">
                    {user.name} ({user.profileType === 'banda_grupo' ? 'Banda' : user.profileType})
                  </span>
                </button>

                <button
                  onClick={logout}
                  className="p-1.5 text-slate-500 hover:text-[#D64545] rounded-lg transition-colors focus-ring"
                  title="Sair da conta"
                  aria-label="Sair da conta"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={loginAsLucas}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg text-[#1C2647] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap focus-ring"
                >
                  Entrar como Lucas
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#25B2C5] text-[#1C2647] hover:bg-[#1FA0B2] transition-colors whitespace-nowrap shadow-xs focus-ring"
                >
                  Criar conta grátis
                </button>
              </div>
            )}

            {/* Menu Hambúrguer para Telas Pequenas (<= 768px e 375px) */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg focus-ring"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Gaveta Móvel Responsiva */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#1C2647] border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium ${
                  currentView === item.id 
                    ? 'bg-[#25B2C5]/15 text-[#25B2C5] font-bold' 
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </span>
                {item.badge && (
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#25B2C5]/20 text-[#25B2C5]">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {user ? (
              <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <div className="text-xs">
                  <p className="font-bold text-[#1C2647] dark:text-white">{user.name}</p>
                  <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="p-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    loginAsLucas();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-bold text-center rounded-lg border border-slate-300 dark:border-slate-700 text-[#1C2647] dark:text-white"
                >
                  Entrar como Lucas
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-bold text-center rounded-lg bg-[#25B2C5] text-[#1C2647]"
                >
                  Criar conta
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
