import React from 'react';
import { X, Sparkles, UserPlus, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PrepChoiceModal: React.FC = () => {
  const { 
    prepModalOpen, 
    setPrepModalOpen, 
    selectedGrantId, 
    grants, 
    loginAsLucas,
    setAuthModalOpen,
    setAuthModalMode,
    selectedProfile
  } = useApp();

  if (!prepModalOpen) return null;

  const activeGrant = grants.find(g => g.id === selectedGrantId) || grants[0];

  const handleChooseLucas = () => {
    loginAsLucas();
    // Context já continuará para a preparação do edital ativo
  };

  const handleChooseRegister = () => {
    setPrepModalOpen(false);
    setAuthModalMode('register');
    setAuthModalOpen(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prep-choice-title"
    >
      <div className="bg-white dark:bg-[#1C2647] text-[#1C2647] dark:text-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 relative">
        <button
          onClick={() => setPrepModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg focus-ring"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#25B2C5] block mb-1">
            Preparação de Edital
          </span>
          <h2 id="prep-choice-title" className="text-xl sm:text-2xl font-bold tracking-tight">
            Como deseja acessar a plataforma?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Você está se preparando para: <strong className="text-[#1C2647] dark:text-white">{activeGrant?.title}</strong>. A seleção deste edital será mantida em qualquer opção.
          </p>
        </div>

        <div className="space-y-4">
          {/* Opção 1: Lucas (Demonstração Universitária) */}
          <button
            onClick={handleChooseLucas}
            className="w-full text-left p-5 rounded-xl border-2 border-[#25B2C5] bg-[#25B2C5]/5 hover:bg-[#25B2C5]/10 dark:bg-[#25B2C5]/10 dark:hover:bg-[#25B2C5]/20 transition-all flex items-start gap-4 group focus-ring cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-[#25B2C5] text-[#1C2647] flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-xs">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-[#1C2647] dark:text-white group-hover:text-[#25B2C5] transition-colors">
                  Entrar como Lucas (demonstração)
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#25B2C5] text-[#1C2647] shrink-0">
                  Recomendado
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Carrega o cenário acadêmico pronto de 2 minutos: banda autoral de Indaiatuba com checklist em 60% e 1 documento para testar a renovação em tempo real.
              </p>
              <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-[#25B2C5]">
                <span>Continuar preparação imediata</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          {/* Opção 2: Criar Conta Simulada */}
          <button
            onClick={handleChooseRegister}
            className="w-full text-left p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-start gap-4 group focus-ring cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 text-[#1C2647] dark:text-white flex items-center justify-center shrink-0 mt-0.5 font-bold">
              <UserPlus className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-[#1C2647] dark:text-white group-hover:text-[#25B2C5] transition-colors">
                Criar conta
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Cadastre seus dados e perfil artístico ({selectedProfile === 'banda_grupo' ? 'Banda ou grupo' : selectedProfile}). Ao concluir, você voltará diretamente para a preparação desta mesma oportunidade.
              </p>
              <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-slate-500 group-hover:text-[#25B2C5] transition-colors">
                <span>Preencher cadastro simulado</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Sem backend nem envio externo de dados</span>
          <button 
            onClick={() => setPrepModalOpen(false)}
            className="hover:underline text-slate-600 dark:text-slate-300"
          >
            Voltar aos detalhes
          </button>
        </div>
      </div>
    </div>
  );
};
