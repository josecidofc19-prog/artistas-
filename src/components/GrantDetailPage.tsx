import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Sparkles, 
  Send,
  Building,
  MapPin,
  Users,
  Shield,
  HelpCircle,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getGrantDeadlineInfo } from '../data/mockGrants';
import { ArtistProfileType } from '../types';

export const GrantDetailPage: React.FC = () => {
  const { 
    selectedGrantId, 
    grants, 
    user, 
    selectedProfile, 
    startPreparationForGrant, 
    setCurrentView,
    activeApplication
  } = useApp();

  const [showOfficialUrlInfo, setShowOfficialUrlInfo] = useState(false);

  const grant = grants.find(g => g.id === selectedGrantId) || grants[0];
  const { isClosed, daysRemaining, label } = getGrantDeadlineInfo(grant.deadlineDate);

  const activeProfile = user?.profileType || selectedProfile;
  const isEligibleProfile = grant.eligibleProfiles.includes(activeProfile);
  const isPreparingThis = activeApplication?.grantId === grant.id;

  // Análise de Elegibilidade
  const getEligibilityDiagnosis = () => {
    const fulfilled: string[] = [];
    const pending: string[] = [];

    if (isEligibleProfile) {
      fulfilled.push(`Perfil artístico compatível (${activeProfile === 'banda_grupo' ? 'Banda ou grupo' : activeProfile}).`);
    } else {
      pending.push(`Este edital restringe-se aos perfis: ${grant.eligibleProfiles.join(', ')}.`);
    }

    if (grant.city) {
      if (user?.city && user.city.toLowerCase() === grant.city.toLowerCase()) {
        fulfilled.push(`Sede no município de ${grant.city} compatível com o cadastro.`);
      } else {
        pending.push(`Exige comprovação de sede ou residência no município de ${grant.city}.`);
      }
    } else if (grant.state === 'SP') {
      fulfilled.push('Abrangência em todo o Estado de São Paulo.');
    } else {
      fulfilled.push('Abrangência nacional (esfera federal).');
    }

    if (grant.maxCityPopulation) {
      pending.push(`Restrito a projetos oriundos de municípios com até ${grant.maxCityPopulation.toLocaleString('pt-BR')} habitantes.`);
    }

    if (grant.eligibleLegal.includes('pf') || grant.eligibleLegal.includes('coletivo')) {
      fulfilled.push('Aceita pessoas físicas e coletivos sem exigência obrigatória de CNPJ.');
    } else if (grant.eligibleLegal.includes('mei') || grant.eligibleLegal.includes('empresa')) {
      pending.push('Exige cadastro societário ativo como MEI ou microempresa cultural.');
    }

    return { fulfilled, pending };
  };

  const diagnosis = getEligibilityDiagnosis();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      
      {/* Botão Voltar */}
      <button
        onClick={() => setCurrentView('catalog')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#1C2647] dark:hover:text-white transition-colors focus-ring"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar ao catálogo de editais</span>
      </button>

      {/* Cartão de Identificação Principal */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] shadow-sm space-y-6">
        
        {/* Metadados sem pill candy */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-bold text-[#6A4BBF] dark:text-[#8263D8]">{grant.artisticArea}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Building className="w-3.5 h-3.5" />
            {grant.sphere}
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {grant.city ? `${grant.city}, ${grant.state}` : `Estado de ${grant.state}`}
          </span>
          <span aria-hidden="true">·</span>
          <span className={`font-mono font-bold ${isClosed ? 'text-[#D64545]' : 'text-[#F2B705]'}`}>
            {label}
          </span>
        </div>

        {/* Título do Edital */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#1C2647] dark:text-white leading-tight">
            {grant.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Publicado por: <strong className="text-[#1C2647] dark:text-white">{grant.issuingBody}</strong>
          </p>
        </div>

        {/* Tira de Valores e Prazos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-0.5">
              Valor por Projeto
            </span>
            <p className="text-2xl font-extrabold text-[#1C2647] dark:text-white font-mono tabular-nums">
              R$ {grant.grantValue.toLocaleString('pt-BR')},00
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">{grant.totalBudgetFormatted}</p>
          </div>

          <div>
            <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-0.5">
              Encerramento das Inscrições
            </span>
            <p className="text-sm font-bold text-[#1C2647] dark:text-white font-mono">
              {new Date(grant.deadlineDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
            <p className={`text-[11px] font-semibold font-mono ${isClosed ? 'text-[#D64545]' : 'text-[#F2B705]'}`}>
              {label}
            </p>
          </div>

          <div>
            <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-0.5">
              Enquadramento Legal
            </span>
            <p className="text-sm font-bold text-[#1C2647] dark:text-white">
              {grant.eligibleLegal.map(l => l.toUpperCase()).join(' · ')}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {grant.eligibleProfiles.length} perfis aceitos
            </p>
          </div>
        </div>

        {/* Barra de Ações */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => startPreparationForGrant(grant.id)}
            disabled={isClosed}
            className="px-6 py-3 text-xs sm:text-sm font-bold rounded-lg bg-[#25B2C5] text-[#1C2647] hover:bg-[#1FA0B2] disabled:opacity-50 transition-all focus-ring shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isPreparingThis ? 'Continuar preparação (Checklist)' : 'Começar preparação'}</span>
          </button>

          {/* Botão Ver edital oficial com fallback informativo */}
          <button
            onClick={() => {
              if (grant.officialUrl) {
                window.open(grant.officialUrl, '_blank', 'noopener,noreferrer');
              } else {
                setShowOfficialUrlInfo(true);
              }
            }}
            className="px-4 py-3 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-ring flex items-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>Ver edital oficial</span>
          </button>
        </div>

        {/* Aviso Fictício Obrigatório */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>Identificação Fictícia:</strong> {grant.isFictitiousNotice}
        </div>

      </div>

      {/* Diagnóstico de Elegibilidade para o Usuário Ativo */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#1C2647] dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#25B2C5]" />
              Diagnóstico de Elegibilidade
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Análise comparativa para o perfil de <strong>{activeProfile === 'banda_grupo' ? 'Banda ou grupo' : activeProfile}</strong>
            </p>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded ${
            diagnosis.pending.length === 0 ? 'bg-[#2E9E63] text-[#1C2647]' : 'bg-[#F2B705] text-[#1C2647]'
          }`}>
            {diagnosis.pending.length === 0 ? 'Alta compatibilidade' : 'Atenção aos requisitos'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          {/* Requisitos Atendidos */}
          <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/15 border border-[#2E9E63]/30 space-y-2">
            <h3 className="font-bold text-[#2E9E63] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <CheckCircle2 className="w-4 h-4" />
              Requisitos que parecem atendidos
            </h3>
            <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
              {diagnosis.fulfilled.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E63] mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pendências ou Restrições a Conferir */}
          <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-950/15 border border-[#F2B705]/30 space-y-2">
            <h3 className="font-bold text-[#F2B705] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <AlertTriangle className="w-4 h-4" />
              Pontos de atenção / Pendências conhecidas
            </h3>
            {diagnosis.pending.length > 0 ? (
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                {diagnosis.pending.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F2B705] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-600 dark:text-slate-300">
                Nenhuma pendência estrutural identificada. Recomendamos conferir o regulamento integral antes da submissão.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo Detalhado: Objetivo, Restrições, Documentos e Critérios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna Esquerda: Objetivo, Descrição e Restrições (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] space-y-4">
            <h2 className="text-base font-bold text-[#1C2647] dark:text-white">
              Objetivo e Justificativa
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {grant.objective}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
              {grant.description}
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] space-y-4">
            <h2 className="text-base font-bold text-[#1C2647] dark:text-white">
              Público Elegível & Restrições Formais
            </h2>
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <p><strong>Público-Alvo:</strong> {grant.eligiblePublic}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Restrições Regulamentares
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {grant.restrictions.map((res, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D64545] mt-1.5 shrink-0" />
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Documentos Exigidos */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] space-y-4">
            <h2 className="text-base font-bold text-[#1C2647] dark:text-white">
              Documentos Necessários Especificados no Edital
            </h2>
            <div className="space-y-3">
              {grant.requiredDocuments.map(doc => (
                <div key={doc.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-[#1C2647] dark:text-white">
                      {doc.name}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      doc.mandatory ? 'bg-[#D64545] text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {doc.mandatory ? 'Obrigatório' : 'Opcional'}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    {doc.description}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Aplica-se a: {doc.appliesToProfiles.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Critérios de Avaliação (1/3) */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] space-y-4">
            <h2 className="text-base font-bold text-[#1C2647] dark:text-white">
              Critérios de Avaliação e Pesos
            </h2>
            <div className="space-y-4">
              {grant.evaluationCriteria.map((crit, i) => (
                <div key={i} className="text-xs space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between font-bold text-[#1C2647] dark:text-white">
                    <span>{crit.title}</span>
                    <span className="font-mono text-[#25B2C5]">{crit.weight}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div style={{ width: `${crit.weight}%` }} className="h-full bg-[#25B2C5] rounded-full" />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed pt-0.5">
                    {crit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Modal Educado quando o usuário clica em "Ver edital oficial" */}
      {showOfficialUrlInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1C2647] text-[#1C2647] dark:text-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 relative">
            <button
              onClick={() => setShowOfficialUrlInfo(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-[#25B2C5]/20 text-[#25B2C5] flex items-center justify-center mb-3">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Endereço Oficial Não Aplicável</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Este edital é um <strong>registro didático modelado para a feira universitária</strong>. Não inventamos links para sites governamentais fictícios. Todas as regras, exigências e cálculos de pontuação estão disponíveis nesta própria interface para testes de ponta a ponta.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowOfficialUrlInfo(false)}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-[#25B2C5] text-[#1C2647]"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
