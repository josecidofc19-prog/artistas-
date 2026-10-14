import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastNotification: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isWarning = toast.type === 'warning';

  return (
    <div 
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-5 duration-200"
    >
      <div 
        className={`p-4 rounded-xl shadow-2xl border flex items-start gap-3 backdrop-blur-md transition-all ${
          isSuccess 
            ? 'bg-[#1C2647]/95 border-[#2E9E63] text-white shadow-[#2E9E63]/10' 
            : isWarning 
              ? 'bg-[#1C2647]/95 border-[#F2B705] text-white shadow-[#F2B705]/10' 
              : 'bg-[#1C2647]/95 border-[#25B2C5] text-white shadow-[#25B2C5]/10'
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#2E9E63]" aria-hidden="true" />}
          {isWarning && <AlertTriangle className="w-5 h-5 text-[#F2B705]" aria-hidden="true" />}
          {!isSuccess && !isWarning && <Info className="w-5 h-5 text-[#25B2C5]" aria-hidden="true" />}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <p className="text-sm font-bold text-white mb-0.5 leading-snug">
            {toast.title}
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            {toast.message}
          </p>
        </div>
      </div>
    </div>
  );
};
