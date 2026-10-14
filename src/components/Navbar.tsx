import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Compass,
  BookOpen,
  LifeBuoy,
  Info,
  Settings,
  ChevronRight
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
    { id: 'catalog', label: 'Editais', icon: Compass },
    { id: 'vault', label: 'Cofre', icon: FolderLock },
    { id: 'guia', label: 'Guia do Artista', icon: BookOpen },
    { id: 'apoio', label: 'Apoio', icon: LifeBuoy },
    { id: 'como_funciona', label: 'Como Funciona', icon: Info },
    { 
      id: 'checklist', 
      label: 'Inscrição', 
      icon: ListTodo,
      badge: activeApplication ? `${activeApplication.progressPercentage}%` : null 
    }
  ];

  const handleNavClick = (viewId: any) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/80 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          
          {/* Logo e Marca */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white shrink-0 hover:opacity-90 transition-opacity focus-ring rounded-lg cursor-pointer"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <span>Cultura em Cena</span>
          </button>

          {/* Links de Navegação Desktop com indicador suave */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
            {navItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-1.5 rounded-xl whitespace-nowrap text-xs xl:text-sm font-medium transition-colors cursor-pointer ${
                    isActive 
                      ? 'text-teal-600 dark:text-teal-400 font-semibold bg-teal-500/10 dark:bg-teal-500/15' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.badge && (
                      <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded-md bg-teal-600 text-white dark:bg-teal-500 dark:text-slate-950">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Ações da Direita: Tema + Usuário / Login */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Alternador de Tema com spring */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-ring cursor-pointer"
              aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
              title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" aria-hidden="true" />
              )}
            </motion.button>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors focus-ring border border-slate-200/60 dark:border-white/5 cursor-pointer"
                  title="Acessar painel de performance de Lucas"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                  <span className="truncate max-w-[130px]">
                    {user.name} ({user.profileType === 'banda_grupo' ? 'Banda' : user.profileType})
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('perfil')}
                  className="p-2 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-ring cursor-pointer"
                  title="Configurações e Perfil"
                  aria-label="Configurações e Perfil"
                >
                  <Settings className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors focus-ring cursor-pointer"
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
                  className="px-3 py-1.5 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap focus-ring cursor-pointer"
                >
                  Entrar como Lucas
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="btn-primary px-3.5 py-1.5 text-xs focus-ring"
                >
                  Criar conta grátis
                </button>
              </div>
            )}

            {/* Menu Hambúrguer para Telas Pequenas */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl focus-ring cursor-pointer"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Gaveta Móvel com Framer Motion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 px-4 pt-3 pb-6 space-y-3 overflow-hidden shadow-lg"
          >
            <div className="flex flex-col space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    currentView === item.id 
                      ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold' 
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                  </span>
                  {item.badge && (
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-teal-600 text-white dark:bg-teal-500 dark:text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-2">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/5">
                    <div className="text-xs">
                      <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleNavClick('perfil')}
                        className="p-1.5 text-slate-500 hover:text-teal-600 rounded-lg"
                        title="Configurações e Perfil"
                        aria-label="Configurações e Perfil"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                        title="Sair"
                        aria-label="Sair da conta"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className="w-full py-2.5 text-xs font-bold text-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-200/80 transition-colors"
                  >
                    <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Acessar Painel de Performance</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      loginAsLucas();
                      setMobileMenuOpen(false);
                    }}
                    className="btn-secondary w-full py-2.5 text-xs text-center"
                  >
                    Entrar como Lucas
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalMode('register');
                      setAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="btn-primary w-full py-2.5 text-xs text-center"
                  >
                    Criar conta grátis
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
