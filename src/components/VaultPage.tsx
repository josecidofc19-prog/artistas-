import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Sparkles, 
  Info, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VaultDocument } from '../types';
import { DocUpdateModal } from './DocUpdateModal';
import { DocAddModal } from './DocAddModal';
import { 
  calculateDocumentStatus, 
  isExpiringBeforeGrantDeadline, 
  formatDayMonth 
} from '../data/defaultVault';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

export const VaultPage: React.FC = () => {
  const { 
    vaultDocuments, 
    removeVaultDocument, 
    setCurrentView,
    user,
    selectedGrantId,
    grants,
    selectedProfile
  } = useApp();
  
  const [editingDoc, setEditingDoc] = useState<VaultDocument | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<VaultDocument | null>(null);

  const activeGrant = grants.find(g => g.id === selectedGrantId) || grants[0];
  const activeProfileType = user?.profileType || selectedProfile;

  // Lista de IDs de exigências obrigatórias do edital ativo
  const mandatoryReqIds = activeGrant.requiredDocuments
    .filter(r => r.mandatory && r.appliesToProfiles.includes(activeProfileType))
    .map(r => r.id);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'identificacao': return 'Identificação / Residência';
      case 'juridico': return 'Jurídico / Representação';
      case 'artistico': return 'Artístico / Portfólio';
      case 'financeiro_fiscal': return 'Fiscal / Tributário';
      default: return cat;
    }
  };

  /**
   * Selo de status com alto contraste e tokens limpos
   */
  const getStatusBadge = (expiryDate: string | null | undefined) => {
    const computedStatus = calculateDocumentStatus(expiryDate);

    if (!expiryDate) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Permanente</span>
        </span>
      );
    }

    if (computedStatus === 'vencido') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
          <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Vencido</span>
        </span>
      );
    }

    if (computedStatus === 'vence_breve') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Vence em breve</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Em dia</span>
      </span>
    );
  };

  // Modal acessível para confirmação de exclusão
  const DeleteConfirmModal: React.FC<{ doc: VaultDocument; onClose: () => void }> = ({ doc, onClose }) => {
    const modalRef = useModalAccessibility(true, onClose, '#cancel-delete-btn');

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-confirm-title"
      >
        <div 
          ref={modalRef}
          className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-4"
        >
          <h4 id="delete-confirm-title" className="text-base font-bold text-red-600 dark:text-red-400">
            Remover documento do cofre?
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Você está prestes a remover <strong>"{doc.name}"</strong>. Esta ação pode desqualificar etapas em andamento que exijam este documento.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              id="cancel-delete-btn"
              type="button"
              onClick={onClose}
              className="btn-secondary px-3.5 py-2 text-xs focus-ring min-h-[40px]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                removeVaultDocument(doc.id);
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors focus-ring min-h-[40px] cursor-pointer"
            >
              Confirmar remoção
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Topo do Cofre */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/5 pb-8"
      >
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-mono uppercase">
            <FolderLock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Gestão Documental Inteligente</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Cofre de Documentos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Mantenha certidões e comprovantes válidos para que suas inscrições em editais sejam preparadas com rapidez e sem surpresas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddOpen(true)}
            className="btn-primary px-4 py-2.5 text-xs focus-ring min-h-[42px]"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Adicionar documento</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Aviso Explicativo de Privacidade e Simulação Local */}
      <div className="bento-card p-5 sm:p-6 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <p className="font-semibold text-slate-900 dark:text-white text-sm">
            Simulação de Armazenamento Local Seguro
          </p>
          <p className="leading-relaxed">
            Nenhum arquivo ou dado confidencial é enviado para servidores externos ou serviços de nuvem. Esta ferramenta visa demonstrar o cálculo automatizado de conformidade documental com privacidade total do artista.
          </p>
        </div>
      </div>

      {/* VERIFICAÇÃO DE ESTADO VAZIO (EMPTY STATE) */}
      {vaultDocuments.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 space-y-4 shadow-xs"
        >
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-2">
            <FolderLock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Seu cofre está vazio</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              A maioria dos editais exige, no mínimo, um Comprovante de Residência e um Documento de Identificação. Que tal começar por eles para agilizar suas futuras inscrições?
            </p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2 cursor-pointer shadow-xs focus-ring"
          >
            <Plus className="w-4 h-4" /> Adicionar Primeiro Documento
          </button>
        </motion.div>
      ) : (
        <>
          {/* VISÃO CELULAR / MOBILE (< 768px): CARTÕES INDIVIDUAIS BENTO */}
          <div className="space-y-4 md:hidden">
            {vaultDocuments.map(doc => {
              const addedDateFormatted = new Date(doc.addedDate).toLocaleDateString('pt-BR');
              const expiryFormatted = doc.expiryDate 
                ? new Date(doc.expiryDate).toLocaleDateString('pt-BR') 
                : 'Permanente (Sem vencimento)';

              const isMandatoryLinked = doc.requirementId && mandatoryReqIds.includes(doc.requirementId);
              const showWarningBeforeDeadline = isMandatoryLinked && isExpiringBeforeGrantDeadline(doc.expiryDate, activeGrant.deadlineDate);

              return (
                <div 
                  key={doc.id}
                  className="p-5 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-white dark:bg-slate-900 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                        <span>{getCategoryLabel(doc.category)}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {doc.name}
                      </h3>
                    </div>
                    <div className="shrink-0">
                      {getStatusBadge(doc.expiryDate)}
                    </div>
                  </div>

                  {/* Alerta: Vence antes do prazo do edital */}
                  {showWarningBeforeDeadline && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2 font-medium">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        Vence antes do prazo do edital ({formatDayMonth(doc.expiryDate)}). Renove antes de enviar.
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-white/5">
                    <div>
                      <span className="text-xs uppercase font-medium text-slate-400 block tracking-wider">Validade</span>
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{expiryFormatted}</span>
                    </div>
                    <div>
                      <span className="text-xs uppercase font-medium text-slate-400 block tracking-wider">Arquivo</span>
                      <span className="truncate block font-mono text-slate-500">{doc.fileName || 'documento.pdf'}</span>
                    </div>
                  </div>

                  {doc.requirementId && (
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                      Vinculado à exigência do edital
                    </p>
                  )}

                  {/* Botões de Ação */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setEditingDoc(doc)}
                      className="btn-secondary flex-1 py-2 text-xs flex items-center justify-center gap-1.5 focus-ring"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                      <span>Atualizar</span>
                    </button>
                    <button
                      onClick={() => setDocToDelete(doc)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors focus-ring"
                      title="Remover documento"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* VISÃO DESKTOP E TABLET (>= 768px): TABELA BENTO */}
          <div className="hidden md:block rounded-3xl border border-slate-200/80 dark:border-white/5 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                    <th scope="col" className="py-4 px-5">Documento</th>
                    <th scope="col" className="py-4 px-4">Categoria</th>
                    <th scope="col" className="py-4 px-4">Inclusão</th>
                    <th scope="col" className="py-4 px-4">Validade</th>
                    <th scope="col" className="py-4 px-4">Situação</th>
                    <th scope="col" className="py-4 px-5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-600 dark:text-slate-300">
                  {vaultDocuments.map(doc => {
                    const addedDateFormatted = new Date(doc.addedDate).toLocaleDateString('pt-BR');
                    const expiryFormatted = doc.expiryDate 
                      ? new Date(doc.expiryDate).toLocaleDateString('pt-BR') 
                      : 'Permanente (Sem vencimento)';

                    const isMandatoryLinked = doc.requirementId && mandatoryReqIds.includes(doc.requirementId);
                    const showWarningBeforeDeadline = isMandatoryLinked && isExpiringBeforeGrantDeadline(doc.expiryDate, activeGrant.deadlineDate);

                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-900 dark:text-white">
                          <div className="flex items-start gap-3">
                            <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                            <div>
                              <p className="font-bold text-sm text-slate-900 dark:text-white">{doc.name}</p>
                              <p className="text-xs text-slate-400 font-mono mt-0.5">
                                {doc.fileName || 'arquivo.pdf'} ({doc.fileSize || '1.0 MB'})
                              </p>
                              {showWarningBeforeDeadline && (
                                <p className="text-xs font-semibold text-amber-500 mt-1 flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                  <span>Vence antes do edital ({formatDayMonth(doc.expiryDate)}). Renove antes de enviar.</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-500 text-xs">
                          {getCategoryLabel(doc.category)}
                        </td>
                        <td className="py-4 px-4 font-mono text-slate-400 text-xs">
                          {addedDateFormatted}
                        </td>
                        <td className="py-4 px-4 font-mono font-medium text-xs text-slate-700 dark:text-slate-300">
                          {expiryFormatted}
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(doc.expiryDate)}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingDoc(doc)}
                              className="btn-secondary px-3 py-1.5 text-xs focus-ring min-h-[34px]"
                              title="Atualizar validade ou substituir arquivo"
                            >
                              <span className="flex items-center gap-1.5">
                                <Edit3 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                                <span>Atualizar</span>
                              </span>
                            </button>

                            <button
                              onClick={() => setDocToDelete(doc)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors focus-ring"
                              title="Remover documento"
                              aria-label={`Remover ${doc.name}`}
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
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
        </>
      )}

      {/* Destaque para o Momento Principal da Demonstração */}
      {user?.isDemo && (
        <div className="p-6 rounded-2xl sm:rounded-3xl border border-teal-500/25 bg-teal-50/40 dark:bg-teal-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              Dica para a Demonstração Universitária
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Localize o documento <strong>"Comprovante de Residência e Sede do Grupo (Indaiatuba)"</strong> com status <em>Vencido</em>. Clique em <strong>Atualizar</strong> e renove a validade para ver a mágica: a etapa documental é concluída e o progresso da inscrição salta automaticamente de <strong>60% para 80%</strong>!
            </p>
          </div>

          <button
            onClick={() => setCurrentView('checklist')}
            className="btn-primary px-4 py-2.5 text-xs whitespace-nowrap shadow-xs focus-ring min-h-[42px]"
          >
            Acompanhar checklist
          </button>
        </div>
      )}

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

      {/* Confirmação de Exclusão Acessível */}
      {docToDelete && (
        <DeleteConfirmModal
          doc={docToDelete}
          onClose={() => setDocToDelete(null)}
        />
      )}

    </div>
  );
};
