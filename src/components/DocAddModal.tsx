import React, { useState } from 'react';
import { X, Plus, UploadCloud, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DocAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocAddModal: React.FC<DocAddModalProps> = ({ isOpen, onClose }) => {
  const { addVaultDocument } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<'identificacao' | 'juridico' | 'artistico' | 'financeiro_fiscal'>('identificacao');
  const [hasExpiry, setHasExpiry] = useState(true);
  const [expiryDate, setExpiryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 180);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');
  const [simulatedFileName, setSimulatedFileName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addVaultDocument({
      name: name.trim(),
      category,
      fileType: 'PDF',
      fileSize: '1.1 MB',
      addedDate: new Date().toISOString(),
      expiryDate: hasExpiry ? new Date(`${expiryDate}T23:59:59`).toISOString() : null,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-add-title"
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
            Novo Arquivo
          </span>
          <h2 id="doc-add-title" className="text-xl sm:text-2xl font-bold tracking-tight">
            Adicionar Documento ao Cofre
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Guarde certidões, cartas e portfólios para reutilizar em múltiplos editais.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Nome do Documento *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Certidão Negativa Municipal ou Portfólio 2026"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1C2647] dark:text-white focus-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Categoria
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1C2647] dark:text-white focus-ring"
            >
              <option value="identificacao">Identificação Pessoal / Residência</option>
              <option value="juridico">Jurídico / Atas / Representação</option>
              <option value="artistico">Artístico / Portfólio / Clipping</option>
              <option value="financeiro_fiscal">Fiscal / Certidões Tributárias</option>
            </select>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="hasExpiry"
                checked={hasExpiry}
                onChange={e => setHasExpiry(e.target.checked)}
                className="w-4 h-4 rounded text-[#25B2C5] focus-ring"
              />
              <label htmlFor="hasExpiry" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Este documento possui prazo de validade (ex: certidões, comprovantes)
              </label>
            </div>

            {hasExpiry && (
              <div>
                <input
                  type="date"
                  required={hasExpiry}
                  value={expiryDate}
                  onChange={e => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1C2647] dark:text-white focus-ring"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Arquivo Digitalizado (Simulação)
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-3 text-center relative cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <input
                type="file"
                accept=".pdf,.png,.jpg"
                onChange={e => e.target.files?.[0] && setSimulatedFileName(e.target.files[0].name)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-6 h-6 mx-auto text-slate-400 mb-1" />
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                {simulatedFileName || 'Selecionar PDF de exemplo'}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#25B2C5] mt-0.5" />
            <span>
              Simulação acadêmica. Os metadados são salvos no navegador para demonstrar o controle de prazos.
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
              className="px-5 py-2 text-xs font-bold rounded-lg bg-[#25B2C5] text-[#1C2647] hover:bg-[#1FA0B2] transition-colors focus-ring"
            >
              Adicionar ao cofre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
