import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  FileCheck, 
  Send, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getGrantDeadlineInfo } from '../data/mockGrants';
import { DocUpdateModal } from './DocUpdateModal';
import { VaultDocument } from '../types';

export const ChecklistPage: React.FC = () => {
  const { 
    activeApplication, 
    grants, 
    toggleChecklistStep, 
    submitApplicationForReview,
    vaultDocuments,
    setCurrentView,
    setSelectedGrantId
  } = useApp();

  const [documentToUpdate, setDocumentToUpdate] = useState<VaultDocument | null>(null);

  if (!activeApplication) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#1C2647] dark:text-white">
          Nenhuma inscrição em preparação no momento
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Escolha um edital no catálogo para iniciar o checklist passo a passo.
        </p>
        <button
          onClick={() => setCurrentView('catalog')}
          className="px-4 py-2 text-xs font-bold rounded-lg bg-[#25B2C5] text-[#1C2647]"
        >
          Explorar editais
        </button>
      </div>
    );
  }

  const currentGrant = grants.find(g => g.id === activeApplication.grantId) || grants[0];
  const { isClosed, daysRemaining, label } = getGrantDeadlineInfo(currentGrant.deadlineDate);

  // Documentos obrigatórios deste edital para o perfil atual
  const mandatoryDocsForProfile = currentGrant.requiredDocuments.filter(
    doc => doc.mandatory && doc.appliesToProfiles.includes(activeApplication.profileType)
  );

  // Documento vencido no cofre
  const expiredDoc = vaultDocuments.find(d => d.status === 'vencido');
  const isDocStepComplete = activeApplication.steps.find(s => s.id === 'documentos')?.isCompleted;

  // Próxima ação recomendada dinâmica
  const getNextRecommendedAction = () => {
    if (!isDocStepComplete && expiredDoc) {
      return {
        title: 'Atualizar comprovante de residência vencido',
        description: 'Seu comprovante de residência está expirado no cofre. Ao renová-lo, a etapa documental será aprovada automaticamente.',
        actionLabel: 'Renovar comprovante agora',
        action: () => setDocumentToUpdate(expiredDoc),
        isUrgent: true,
      };
    }

    const firstPending = activeApplication.steps.find(s => !s.isCompleted);
    if (!firstPending) {
      return {
        title: 'Inscrição 100% pronta para envio',
        description: 'Todas as 5 etapas foram finalizadas com sucesso. Clique no botão abaixo para enviar para a revisão simulada.',
        actionLabel: 'Enviar para revisão',
        action: () => submitApplicationForReview(),
        isUrgent: false,
      };
    }

    if (firstPending.id === 'envio') {
      return {
        title: 'Revisar dossiê final e submeter',
        description: 'Requisitos conferidos, documentos em dia, portfólio montado e projeto redigido. Agora basta enviar para a banca simulada.',
        actionLabel: 'Enviar para revisão simulada',
        action: () => submitApplicationForReview(),
        isUrgent: false,
      };
    }

    return {
      title: `Finalizar: ${firstPending.title}`,
      description: firstPending.description,
      actionLabel: 'Completar etapa',
      action: () => toggleChecklistStep(firstPending.id),
      isUrgent: false,
    };
  };

  const nextAction = getNextRecommendedAction();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      
      {/* Cabeçalho da Inscrição */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#25B2C5]">
            <FileCheck className="w-4 h-4" />
            <span>MINHA INSCRIÇÃO & CHECKLIST PREPARATÓRIO</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C2647] dark:text-white leading-tight">
            {currentGrant.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
            <span>Órgão: <strong className="text-[#1C2647] dark:text-white">{currentGrant.issuingBody}</strong></span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              R$ {currentGrant.grantValue.toLocaleString('pt-BR')},00
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-mono text-[#F2B705] font-semibold">
              <Clock className="w-3.5 h-3.5" />
              {label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setSelectedGrantId(currentGrant.id);
              setCurrentView('grant_detail');
            }}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-ring"
          >
            Ver regulamento
          </button>
          
          <button
            onClick={submitApplicationForReview}
            disabled={activeApplication.status === 'revisao_solicitada'}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-[#25B2C5] text-[#1C2647] hover:bg-[#1FA0B2] disabled:opacity-60 transition-colors focus-ring shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{activeApplication.status === 'revisao_solicitada' ? 'Em revisão simulada' : 'Enviar para revisão'}</span>
          </button>
        </div>
      </div>

      {/* Cartão de Progresso & Próxima Ação (Momento Central da Demonstração) */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] shadow-sm space-y-6">
        
        {/* Barra de Progresso com Transição Suave (150-250ms) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Progresso Geral da Preparação
              </span>
              <p className="text-xs text-slate-500">
                5 etapas ponderadas com peso de 20% cada uma
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-[#1C2647] dark:text-white font-mono tabular-nums">
                {activeApplication.progressPercentage}%
              </span>
              <p className="text-[11px] font-semibold text-[#25B2C5]">
                {activeApplication.steps.filter(s => s.isCompleted).length} de 5 concluídas
              </p>
            </div>
          </div>

          <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700/50">
            <div
              style={{ width: `${activeApplication.progressPercentage}%` }}
              className="h-full rounded-full bg-gradient-to-r from-[#25B2C5] to-[#2E9E63] transition-all duration-300 ease-out shadow-xs"
            />
          </div>
        </div>

        {/* Bloco de Próxima Ação Recomendada */}
        <div className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
          nextAction.isUrgent 
            ? 'border-[#D64545]/40 bg-red-500/5 dark:bg-red-950/20' 
            : 'border-[#25B2C5]/30 bg-[#25B2C5]/5 dark:bg-[#25B2C5]/10'
        }`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                nextAction.isUrgent ? 'bg-[#D64545] text-white' : 'bg-[#25B2C5] text-[#1C2647]'
              }`}>
                {nextAction.isUrgent ? 'Ação Crítica' : 'Próxima Ação Recomendada'}
              </span>
              <h3 className="text-sm font-bold text-[#1C2647] dark:text-white">
                {nextAction.title}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              {nextAction.description}
            </p>
          </div>

          <button
            onClick={nextAction.action}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-all focus-ring shadow-xs whitespace-nowrap flex items-center gap-1.5 self-start sm:self-auto cursor-pointer ${
              nextAction.isUrgent 
                ? 'bg-[#D64545] text-white hover:bg-[#B53636]' 
                : 'bg-[#25B2C5] text-[#1C2647] hover:bg-[#1FA0B2]'
            }`}
          >
            <span>{nextAction.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Lista das 5 Etapas do Checklist */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#1C2647] dark:text-white">
          Etapas da Inscrição (20% cada)
        </h2>

        <div className="space-y-3">
          {activeApplication.steps.map((step, index) => {
            const isDocStep = step.id === 'documentos';
            const isEnvioStep = step.id === 'envio';

            return (
              <div
                key={step.id}
                className={`p-5 rounded-xl border transition-all ${
                  step.isCompleted
                    ? 'border-[#2E9E63]/30 bg-emerald-500/5 dark:bg-emerald-950/15'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => toggleChecklistStep(step.id)}
                      disabled={isDocStep}
                      className={`mt-0.5 shrink-0 rounded-full transition-colors focus-ring ${
                        isDocStep ? 'cursor-default' : 'cursor-pointer hover:opacity-80'
                      }`}
                      aria-label={step.isCompleted ? `Marcar ${step.title} como pendente` : `Marcar ${step.title} como concluída`}
                    >
                      {step.isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-[#2E9E63]" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-base font-bold leading-tight ${
                          step.isCompleted ? 'text-[#1C2647] dark:text-white' : 'text-slate-800 dark:text-slate-200'
                        }`}>
                          {step.title}
                        </h3>
                        <span className="text-xs font-mono font-semibold text-slate-400">
                          (20%)
                        </span>
                        {isDocStep && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            Avaliação automática por validade do cofre
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Detalhes específicos da Etapa 2 (Documental) */}
                      {isDocStep && (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Documentos Obrigatórios Exigidos para Banda/Grupo:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {mandatoryDocsForProfile.map(req => {
                              // Verifica no cofre
                              const match = vaultDocuments.find(d => 
                                d.name.toLowerCase().includes(req.name.toLowerCase().substring(0, 15)) ||
                                req.name.toLowerCase().includes(d.name.toLowerCase().substring(0, 15))
                              );
                              const isDocExpired = match?.status === 'vencido';

                              return (
                                <div 
                                  key={req.id}
                                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 ${
                                    isDocExpired 
                                      ? 'border-[#D64545]/40 bg-red-500/5 text-red-900 dark:text-red-300' 
                                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-200'
                                  }`}
                                >
                                  <div className="min-w-0 flex-1">
                                    <p className="font-semibold truncate">{req.name}</p>
                                    <p className="text-[10px] text-slate-500">
                                      {match ? (isDocExpired ? 'Expirado no cofre' : 'Válido no cofre') : 'Ausente no cofre'}
                                    </p>
                                  </div>

                                  {match && isDocExpired && (
                                    <button
                                      onClick={() => setDocumentToUpdate(match)}
                                      className="px-2 py-1 text-[11px] font-bold rounded bg-[#D64545] text-white hover:bg-[#B53636] shrink-0"
                                    >
                                      Atualizar
                                    </button>
                                  )}
                                  {match && !isDocExpired && (
                                    <CheckCircle2 className="w-4 h-4 text-[#2E9E63] shrink-0" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ação rápida da etapa */}
                  <div className="shrink-0">
                    {!isDocStep && !isEnvioStep && (
                      <button
                        onClick={() => toggleChecklistStep(step.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        {step.isCompleted ? 'Desmarcar' : 'Concluir'}
                      </button>
                    )}
                    {isDocStep && (
                      <button
                        onClick={() => setCurrentView('vault')}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#1C2647] dark:text-white transition-colors"
                      >
                        Ir ao cofre
                      </button>
                    )}
                    {isEnvioStep && !step.isCompleted && (
                      <button
                        onClick={submitApplicationForReview}
                        className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#25B2C5] text-[#1C2647] hover:bg-[#1FA0B2] transition-colors"
                      >
                        Enviar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Esclarecimento de Envio Simulado */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141B33] text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <p className="font-semibold text-[#1C2647] dark:text-white">
          Aviso sobre o envio para revisão
        </p>
        <p>
          O botão "Enviar para revisão" executa uma simulação interna da plataforma para validação acadêmica do dossiê. Não substitui o envio oficial no sistema eletrônico do órgão público licitante.
        </p>
      </div>

      {/* Modal de Atualização Rápida de Documento */}
      {documentToUpdate && (
        <DocUpdateModal
          document={documentToUpdate}
          onClose={() => setDocumentToUpdate(null)}
        />
      )}

    </div>
  );
};
