import React, { useState } from 'react';
import { X, UploadCloud, Calendar, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { VaultDocument } from '../types';
import { useApp } from '../context/AppContext';

interface DocUpdateModalProps {
  document: VaultDocument | null;
  onClose: () => void;
}

export const DocUpdateModal: React.FC<DocUpdateModalProps> = ({ document: doc, onClose }) => {
  const { updateVaultDocument } = useApp();

  if (!doc) return null;

  // Data futura padrão para renovação rápida (+180 dias)
  const defaultFutureDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 180);
    return d.toISOString().split('T')[0];
  };

  const [name, setName] = useState(doc.name);
  const [expiryDate, setExpiryDate] = useState(
    doc.expiryDate ? doc.expiryDate.split('T')[0] : defaultFutureDate()
  );
  const [notes, setNotes] = useState(doc.notes || '');
  const [simulatedFileName, setSimulatedFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSimulatedFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSimulatedFileName(e.target.files[0].name);
    }
  };

  const handleQuickRenew = () => {
    setExpiryDate(defaultFutureDate());
    setSimulatedFileName('comprovante_recente_atualizado_2026.pdf');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullIsoDate = expiryDate ? new Date(`${expiryDate}T23:59:59`).toISOString() : null;

    setTimeout(() => {
      updateVaultDocument(doc.id, {
        name,
        expiryDate: fullIsoDate,
        notes,
        fileType: 'PDF',
      });
      setIsSubmitting(false);
      onClose();
    }, 250);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-update-title"
    >
      <div className="bg-white dark:bg-[#1C2647] text-[#1C2647] dark:text-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg focus-ring"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#25B2C5] block mb-1">
            Cofre de Documentos
          </span>
          <h2 id="doc-update-title" className="text-xl sm:text-2xl font-bold tracking-tight">
            Atualizar e Renovar Documento
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Simulação local. A renovação da validade reavalia automaticamente o checklist de inscrição.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Nome do Documento
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1C2647] dark:text-white focus-ring"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Data de Validade (Vencimento)
              </label>
              <button
                type="button"
                onClick={handleQuickRenew}
                className="text-xs font-bold text-[#25B2C5] hover:underline"
              >
                + Renovar para 6 meses (Em dia)
              </button>
            </div>
            <div className="relative">
              <input
                type="date"
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1C2647] dark:text-white focus-ring"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Validades com mais de 30 dias à frente são consideradas com status "Em dia".
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Substituir Arquivo Digitalizado (Simulação)
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors relative cursor-pointer">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleSimulatedFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-8 h-8 mx-auto text-slate-400 mb-1" aria-hidden="true" />
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                {simulatedFileName || 'Clique ou arraste um PDF ou imagem'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Nenhum arquivo real é enviado para a internet.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Observações ou Número de Protocolo
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Conta de luz recente atestando sede da banda em Indaiatuba."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1C2647] dark:text-white focus-ring"
            />
          </div>

          {/* Aviso de Privacidade e Não-Armazenamento Remoto */}
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#F2B705] mt-0.5" />
            <span>
              <strong>Atenção:</strong> Esta é uma simulação didática local. Nenhum documento é transmitido para servidores remotos e a ferramenta não constitui custódia jurídica oficial.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold rounded-lg bg-[#25B2C5] text-[#1C2647] hover:bg-[#1FA0B2] transition-colors focus-ring shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar e Atualizar Checklist</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
