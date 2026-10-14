import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { BannerAviso } from './components/BannerAviso';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { CatalogPage } from './components/CatalogPage';
import { GrantDetailPage } from './components/GrantDetailPage';
import { VaultPage } from './components/VaultPage';
import { ChecklistPage } from './components/ChecklistPage';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { PrepChoiceModal } from './components/PrepChoiceModal';
import { AuthModal } from './components/AuthModal';
import { ToastNotification } from './components/ToastNotification';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <main className="min-h-[calc(100vh-140px)]">
      {currentView === 'home' && <HomePage />}
      {currentView === 'catalog' && <CatalogPage />}
      {currentView === 'grant_detail' && <GrantDetailPage />}
      {currentView === 'vault' && <VaultPage />}
      {currentView === 'checklist' && <ChecklistPage />}
      {currentView === 'dashboard' && <PerformanceDashboard />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-[#F5F7FB] dark:bg-[#10162A] text-[#1C2647] dark:text-slate-100 transition-colors">
        {/* Banner de Aviso Acadêmico e Ações de Demonstração */}
        <BannerAviso />

        {/* Barra de Navegação Superior */}
        <Navbar />

        {/* Conteúdo Principal com Troca de Telas */}
        <div className="flex-1">
          <MainContent />
        </div>

        {/* Modais Globais e Notificações Flutuantes */}
        <PrepChoiceModal />
        <AuthModal />
        <ToastNotification />
      </div>
    </AppProvider>
  );
}
