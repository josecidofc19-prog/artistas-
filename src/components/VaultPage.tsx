import React, { useState } from 'react';
import { 
  FolderLock, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VaultDocument } from '../types';
import { DocUpdateModal } from './DocUpdateModal';
import { DocAddModal } from './DocAddModal';

export const VaultPage: React.FC = () => {
  const { vaultDocuments, removeVaultDocument, setCurrentView } = useApp();
  
  const [editingDoc, setEditingDoc] = useState<VaultDocument | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'identificacao': return 'Identificação / Residência';
      case 'juridico': return 'Jurídico / Representação';
      case 'artistico': return 'Artístico / Portfólio';
      case 'financeiro_fiscal': return 'Fiscal / Tributário';
      default: return cat;
    }
  };

  const getStatusBadge = (status: string, expiryDate: string | null) => {
    if (!expiryDate) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-[#2E9E63] text-[#1C2647]">
          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Permanente / Em dia</span>
        </span>
      );
    }

    if (status === 'vencido') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-[#D64545] text-white">
          <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Vencido</span>
        </span>
      );
    }

    if (status === 'vence_breve') {
      const days = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-[#F2B705] text-[#1C2647]">
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Vence em {days} dias</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-[#2E9E63] text-[#1C2647]">
        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Em dia</span>
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      
      {/* Topo do Cofre */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-[#25B2C5]">
            <FolderLock className="w-4 h-4" />
            <span>GESTÃO DOCUMENTAL INTELIGENTE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C2647] dark:text-white">
            Cofre de Documentos
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Armazene certidões, cartas de anuência e portfólios uma única vez. Ao atualizar um documento com prazo vencido, seu checklist de inscrição avança automaticamente de 60% para 80%.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-[#25B2C5] text-[#1C2647] hover:bg-[#1FA0B2] transition-colors focus-ring shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar documento</span>
          </button>
        </div>
      </div>

      {/* Aviso Explicativo de Privacidade e Simulação Local */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] flex items-start gap-3">
        <Info className="w-5 h-5 text-[#25B2C5] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <p className="font-semibold text-[#1C2647] dark:text-white">
            Simulação de Armazenamento Local
          </p>
          <p>
            Nenhum arquivo ou dado confidencial é enviado para servidores externos ou serviços de nuvem. Esta ferramenta visa demonstrar o cálculo automatizado de conformidade documental em feiras acadêmicas.
          </p>
        </div>
      </div>

      {/* Tabela de Documentos */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Documento</th>
                <th className="py-3.5 px-4">Categoria</th>
                <th className="py-3.5 px-4">Inclusão</th>
                <th className="py-3.5 px-4">Validade</th>
                <th className="py-3.5 px-4">Situação</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {vaultDocuments.map(doc => {
                const addedDateFormatted = new Date(doc.addedDate).toLocaleDateString('pt-BR');
                const expiryFormatted = doc.expiryDate 
                  ? new Date(doc.expiryDate).toLocaleDateString('pt-BR') 
                  : 'Permanente (Sem vencimento)';

                return (
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 font-semibold text-[#1C2647] dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <p className="font-bold text-sm text-[#1C2647] dark:text-white">{doc.name}</p>
                          {doc.notes && (
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{doc.notes}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {getCategoryLabel(doc.category)}
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-500">
                      {addedDateFormatted}
                    </td>
                    <td className="py-4 px-4 font-mono font-medium">
                      {expiryFormatted}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(doc.status, doc.expiryDate)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingDoc(doc)}
                          className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#1C2647] dark:text-white transition-colors focus-ring"
                          title="Atualizar validade ou substituir arquivo"
                        >
                          <span className="flex items-center gap-1">
                            <Edit3 className="w-3.5 h-3.5 text-[#25B2C5]" />
                            <span>Atualizar</span>
                          </span>
                        </button>

                        <button
                          onClick={() => setDocToDelete(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-[#D64545] rounded-lg transition-colors focus-ring"
                          title="Remover documento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Destaque para o Momento Principal da Demonstração */}
      <div className="p-5 rounded-xl border border-[#25B2C5]/30 bg-[#25B2C5]/5 dark:bg-[#25B2C5]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#1C2647] dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#25B2C5]" />
            Dica para a Demonstração Universitária
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Localize o documento <strong>"Comprovante de Residência e Sede do Grupo (Indaiatuba)"</strong> com status <em>Vencido</em>. Clique em <strong>Atualizar</strong> e renove a validade para ver a mágica: a etapa documental é concluída e o progresso da inscrição salta automaticamente de <strong>60% para 80%</strong>!
          </p>
        </div>

        <button
          onClick={() => setCurrentView('checklist')}
          className="px-4 py-2 text-xs font-bold rounded-lg bg-[#25B2C5] text-[#1C2647] hover:bg-[#1FA0B2] transition-colors whitespace-nowrap shadow-xs focus-ring"
        >
          Acompanhar checklist
        </button>
      </div>

      {/* Modal de Atualização */}
      {editingDoc && (
        <DocUpdateModal
          document={editingDoc}
          onClose={() => setEditingDoc(null)}
        />
      )}

      {/* Modal de Adição */}
      <DocAddModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />

      {/* Confirmação de Exclusão */}
      {docToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1C2647] rounded-xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-700 shadow-xl">
            <h4 className="text-base font-bold text-[#D64545] mb-2">Remover documento do cofre?</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              Essa ação pode desqualificar etapas em andamento que exijam este arquivo.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDocToDelete(null)}
                className="px-3 py-1.5 text-xs font-semibold rounded border border-slate-300 dark:border-slate-600"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  removeVaultDocument(docToDelete);
                  setDocToDelete(null);
                }}
                className="px-3 py-1.5 text-xs font-bold rounded bg-[#D64545] text-white"
              >
                Confirmar remoção
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
