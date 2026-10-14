import React, { useState } from 'react';
import { AlertCircle, RotateCcw, Trash2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BannerAviso: React.FC = () => {
  const { resetDemoToInitialState, clearAllLocalStorage } = useApp();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="bg-[#1C2647] text-white border-b border-[#25B2C5]/30 text-xs sm:text-sm py-2 px-4 relative z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-slate-200">
          <AlertCircle className="w-4 h-4 text-[#F2B705] shrink-0" aria-hidden="true" />
          <span className="leading-tight">
            <strong>Demonstração Acadêmica:</strong> Cadastro, autenticação, documentos e preparação de inscrições são simulados. Não insira dados pessoais ou documentos reais.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-[#25B2C5] text-[#1C2647] hover:bg-[#1FA0B2] transition-colors focus-ring"
            title="Restaura o estado inicial da demonstração (Lucas a 60%)"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reiniciar demonstração</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus-ring"
            title="Limpar todos os dados do localStorage"
          >
            <Trash2 className="w-3 h-3 text-red-400" aria-hidden="true" />
            <span className="hidden sm:inline">Excluir dados locais</span>
          </button>
        </div>
      </div>

      {/* Modal de Confirmação para Reiniciar Demo */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1C2647] text-[#1C2647] dark:text-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-[#1C2647] dark:text-white mb-2">
              Reiniciar demonstração de Lucas?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Isso restaurará o usuário Lucas, o perfil de Banda/Grupo, o cofre com 1 documento vencido e o checklist de inscrição em exatamente 60%, ideal para iniciar a apresentação do início.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  resetDemoToInitialState();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-[#25B2C5] text-[#1C2647] hover:bg-[#1FA0B2] transition-colors"
              >
                Confirmar reinício
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação para Limpar LocalStorage */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1C2647] text-[#1C2647] dark:text-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-[#D64545] mb-2">
              Excluir todos os dados locais?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Esta ação removerá todos os registros armazenados no navegador (localStorage). Você será deslogado e retornará à tela inicial.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  clearAllLocalStorage();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-[#D64545] text-white hover:bg-[#B53636] transition-colors"
              >
                Excluir dados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
