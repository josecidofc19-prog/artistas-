import React, { useState } from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowUpRight, 
  FileText, 
  Calendar, 
  Award, 
  Filter,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getGrantDeadlineInfo } from '../data/mockGrants';
import { DocUpdateModal } from './DocUpdateModal';
import { VaultDocument } from '../types';

export const PerformanceDashboard: React.FC = () => {
  const { 
    user, 
    selectedProfile, 
    vaultDocuments, 
    activeApplication, 
    historicalSubmissions, 
    grants, 
    startPreparationForGrant,
    setCurrentView,
    setSelectedGrantId
  } = useApp();

  const [documentToUpdate, setDocumentToUpdate] = useState<VaultDocument | null>(null);

  // Perfil ativo
  const activeProfileType = user?.profileType || selectedProfile;
  const activeArtistName = user?.name || 'Lucas';
  const activeCity = user?.city || 'Indaiatuba';
  const activeArea = user?.artisticArea || 'Música';

  // Cálculos do Cofre em tempo real
  const docsTotal = vaultDocuments.length;
  const docsValid = vaultDocuments.filter(d => d.status === 'em_dia').length;
  const docsExpiringSoon = vaultDocuments.filter(d => d.status === 'vence_breve').length;
  const docsExpired = vaultDocuments.filter(d => d.status === 'vencido').length;

  const vaultHealthPercent = docsTotal > 0 ? Math.round((docsValid / docsTotal) * 100) : 100;

  // Cálculos de Inscrições
  const totalSubmissions = historicalSubmissions.length + (activeApplication?.status === 'revisao_solicitada' ? 1 : 0);
  const approvedCount = historicalSubmissions.filter(s => s.status === 'aprovado').length;
  const successRate = historicalSubmissions.length > 0 
    ? Math.round((approvedCount / historicalSubmissions.length) * 100) 
    : 0;

  // Editais recomendados com base no perfil ativo
  const recommendedOpportunities = grants
    .filter(grant => {
      const { isClosed } = getGrantDeadlineInfo(grant.deadlineDate);
      if (isClosed) return false;
      return grant.eligibleProfiles.includes(activeProfileType);
    })
    .map(grant => {
      let score = 70;
      const reasons: string[] = [];

      if (grant.artisticArea === activeArea) {
        score += 20;
        reasons.push(`Alinhado à sua área (${activeArea})`);
      }
      if (grant.eligibleProfiles.includes(activeProfileType)) {
        score += 10;
        reasons.push(`Elegível para ${activeProfileType === 'banda_grupo' ? 'Bandas e Grupos' : activeProfileType}`);
      }
      if (grant.city === activeCity || grant.state === 'SP') {
        score += 10;
        reasons.push('Território estadual ou regional direto');
      }
      if (grant.eligibleLegal.includes('coletivo') || grant.eligibleLegal.includes('pf')) {
        reasons.push('Não exige pessoa jurídica formal');
      }

      return {
        grant,
        matchScore: Math.min(score, 98),
        reasons,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  // Soma de recursos financeiros mapeados elegíveis
  const totalFinancialMapped = recommendedOpportunities.reduce((acc, curr) => acc + curr.grant.grantValue, 0);

  // Próximos prazos críticos (editais abertos ordenados por prazo mais curto)
  const criticalDeadlines = grants
    .map(g => ({ grant: g, ...getGrantDeadlineInfo(g.deadlineDate) }))
    .filter(item => !item.isClosed)
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 4);

  // Documento vencido prioritário para correção
  const expiredDoc = vaultDocuments.find(d => d.status === 'vencido');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      
      {/* Cabeçalho do Dashboard */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-[#25B2C5]">
            <Sparkles className="w-4 h-4" />
            <span>PAINEL DE PERFORMANCE E GESTÃO ARTÍSTICA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C2647] dark:text-white">
            Performance de {activeArtistName}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Perfil: <strong className="text-[#1C2647] dark:text-white">{activeProfileType === 'banda_grupo' ? 'Banda ou grupo musical' : activeProfileType}</strong> · Sede: <strong className="text-[#1C2647] dark:text-white">{activeCity}, SP</strong> · Segmento: <strong className="text-[#1C2647] dark:text-white">{activeArea}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('catalog')}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-ring"
          >
            Explorar catálogo completo
          </button>
          <button
            onClick={() => setCurrentView('checklist')}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-[#25B2C5] text-[#1C2647] hover:bg-[#1FA0B2] transition-colors focus-ring shadow-xs flex items-center gap-1.5"
          >
            <span>Ver inscrição atual ({activeApplication?.progressPercentage || 60}%)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Alerta de Ação Crítica no Cofre (Se houver documento vencido) */}
      {expiredDoc && (
        <div className="p-4 sm:p-5 rounded-xl border-2 border-[#D64545]/40 bg-red-500/5 dark:bg-red-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#D64545] text-white shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#D64545]">
                Ação Requerida: Documento obrigatório expirado no cofre
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                <strong>{expiredDoc.name}</strong> está vencido e impede a conclusão da etapa "Separar documentos" na sua inscrição ativa.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDocumentToUpdate(expiredDoc)}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-[#D64545] text-white hover:bg-[#B53636] transition-colors whitespace-nowrap shadow-xs focus-ring"
          >
            Renovar documento agora
          </button>
        </div>
      )}

      {/* Grid de 4 Cards de Métricas Principais (Tabular figures) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Inscrições */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Inscrições Realizadas</span>
            <Award className="w-4 h-4 text-[#25B2C5]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#1C2647] dark:text-white font-mono tabular-nums">
              {totalSubmissions}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({historicalSubmissions.length} históricas + 1 ativa)
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <span className="font-semibold text-[#2E9E63]">
              {approvedCount} selecionadas
            </span>
            <span>·</span>
            <span>1 em preparação</span>
          </div>
        </div>

        {/* Card 2: Taxa de Sucesso Histórica */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Taxa de Aprovação</span>
            <TrendingUp className="w-4 h-4 text-[#2E9E63]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#1C2647] dark:text-white font-mono tabular-nums">
              {successRate}%
            </span>
            <span className="text-xs font-semibold text-[#2E9E63] font-mono">
              +12% média estadual
            </span>
          </div>
          <p className="mt-3 text-[11px] text-slate-600 dark:text-slate-300">
            Baseado em conformidade de dossiês e pontuação de bancas técnicas.
          </p>
        </div>

        {/* Card 3: Recursos Financeiros Mapeados */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Recursos Elegíveis</span>
            <Sparkles className="w-4 h-4 text-[#F2B705]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-semibold text-slate-500">R$</span>
            <span className="text-2xl font-extrabold text-[#1C2647] dark:text-white font-mono tabular-nums">
              {totalFinancialMapped.toLocaleString('pt-BR')},00
            </span>
          </div>
          <p className="mt-3 text-[11px] text-slate-600 dark:text-slate-300">
            Soma de <strong>{recommendedOpportunities.length} editais abertos</strong> compatíveis com seu perfil.
          </p>
        </div>

        {/* Card 4: Saúde do Cofre de Documentos */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Conformidade do Cofre</span>
            <FileText className="w-4 h-4 text-[#6A4BBF]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#1C2647] dark:text-white font-mono tabular-nums">
              {vaultHealthPercent}%
            </span>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
              docsExpired === 0 ? 'bg-[#2E9E63]/20 text-[#2E9E63]' : 'bg-[#D64545]/20 text-[#D64545]'
            }`}>
              {docsExpired === 0 ? 'Regularizado' : `${docsExpired} vencido`}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
            <span className="text-[#2E9E63] font-semibold">{docsValid} em dia</span>
            <span>·</span>
            <span className="text-[#F2B705] font-semibold">{docsExpiringSoon} alerta</span>
            <span>·</span>
            <span className="text-[#D64545] font-semibold">{docsExpired} vencido</span>
          </div>
        </div>

      </div>

      {/* Grid Principal: 2 Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna Esquerda: Próximas Oportunidades Recomendadas (2/3 da largura) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1C2647] dark:text-white">
                Próximas Oportunidades Recomendadas
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Classificadas por afinidade técnica com seu perfil artístico ({activeProfileType})
              </p>
            </div>
            <button
              onClick={() => setCurrentView('catalog')}
              className="text-xs font-semibold text-[#25B2C5] hover:underline flex items-center gap-1"
            >
              <span>Ver todos os 12 editais</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recommendedOpportunities.map(({ grant, matchScore, reasons }) => {
              const { daysRemaining, label } = getGrantDeadlineInfo(grant.deadlineDate);
              const isCurrentApp = activeApplication?.grantId === grant.id;

              return (
                <div 
                  key={grant.id}
                  className={`p-5 rounded-xl border transition-all ${
                    isCurrentApp 
                      ? 'border-[#25B2C5] bg-[#25B2C5]/5 dark:bg-[#25B2C5]/10' 
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Metadados sem pill candy (anti-slop rule) */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <span className="font-semibold text-[#6A4BBF] dark:text-[#8263D8]">{grant.artisticArea}</span>
                        <span aria-hidden="true">·</span>
                        <span>{grant.sphere}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          R$ {grant.grantValue.toLocaleString('pt-BR')},00
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#1C2647] dark:text-white leading-snug">
                        {grant.title}
                      </h3>
                      
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {grant.summary}
                      </p>

                      {/* Motivos da afinidade */}
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-[#25B2C5]">Por que se candidatar:</span>
                        {reasons.slice(0, 3).map((r, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-[#25B2C5]" />
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Ação e afinidade */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <div className="text-right">
                        <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#25B2C5]">
                          <span>{matchScore}%</span>
                          <span className="text-[10px] text-slate-400 font-normal">afinidade</span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-[#F2B705]" />
                          <span>{label}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedGrantId(grant.id);
                            setCurrentView('grant_detail');
                          }}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          Ver edital
                        </button>
                        <button
                          onClick={() => startPreparationForGrant(grant.id)}
                          className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#25B2C5] text-[#1C2647] hover:bg-[#1FA0B2] transition-colors focus-ring shadow-xs"
                        >
                          {isCurrentApp ? 'Abrir checklist' : 'Preparar'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coluna Direita: Status de Documentos & Prazos Críticos (1/3 da largura) */}
        <div className="space-y-6">
          
          {/* Caixa 1: Resumo do Status de Documentos */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1C2647] dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#25B2C5]" />
                Status de Documentos
              </h3>
              <button
                onClick={() => setCurrentView('vault')}
                className="text-xs font-semibold text-[#25B2C5] hover:underline"
              >
                Gerenciar cofre
              </button>
            </div>

            {/* Barra de distribuição gráfica */}
            <div>
              <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                <div 
                  style={{ width: `${(docsValid / docsTotal) * 100}%` }} 
                  className="bg-[#2E9E63] transition-all duration-300" 
                  title={`${docsValid} em dia`}
                />
                <div 
                  style={{ width: `${(docsExpiringSoon / docsTotal) * 100}%` }} 
                  className="bg-[#F2B705] transition-all duration-300" 
                  title={`${docsExpiringSoon} vencendo em breve`}
                />
                <div 
                  style={{ width: `${(docsExpired / docsTotal) * 100}%` }} 
                  className="bg-[#D64545] transition-all duration-300" 
                  title={`${docsExpired} vencidos`}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
                <span className="flex items-center gap-1 text-[#2E9E63]">
                  <span className="w-2 h-2 rounded-full bg-[#2E9E63]" />
                  Em dia ({docsValid})
                </span>
                <span className="flex items-center gap-1 text-[#F2B705]">
                  <span className="w-2 h-2 rounded-full bg-[#F2B705]" />
                  &le; 30d ({docsExpiringSoon})
                </span>
                <span className="flex items-center gap-1 text-[#D64545]">
                  <span className="w-2 h-2 rounded-full bg-[#D64545]" />
                  Vencidos ({docsExpired})
                </span>
              </div>
            </div>

            {/* Lista dos Documentos com Botão de Ação Direta */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {vaultDocuments.map(doc => {
                const isExp = doc.status === 'vencido';
                const isWarn = doc.status === 'vence_breve';

                return (
                  <div 
                    key={doc.id}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#1C2647] dark:text-white truncate">
                        {doc.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {doc.expiryDate ? `Validade: ${new Date(doc.expiryDate).toLocaleDateString('pt-BR')}` : 'Sem validade fixa'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isExp && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D64545] text-white">
                          Vencido
                        </span>
                      )}
                      {isWarn && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F2B705] text-[#1C2647]">
                          Vence em 12d
                        </span>
                      )}
                      {!isExp && !isWarn && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2E9E63] text-[#1C2647]">
                          Em dia
                        </span>
                      )}

                      <button
                        onClick={() => setDocumentToUpdate(doc)}
                        className="text-[11px] font-bold text-[#25B2C5] hover:underline"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Caixa 2: Prazos Críticos do Catálogo */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] space-y-4">
            <h3 className="text-sm font-bold text-[#1C2647] dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#F2B705]" />
              Prazos Críticos (Próximos Encerramentos)
            </h3>

            <div className="space-y-3">
              {criticalDeadlines.map(({ grant, daysRemaining, label }) => (
                <div 
                  key={grant.id}
                  onClick={() => {
                    setSelectedGrantId(grant.id);
                    setCurrentView('grant_detail');
                  }}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-500">{grant.artisticArea}</span>
                    <span className={`font-mono font-bold text-[11px] ${
                      daysRemaining <= 10 ? 'text-[#D64545]' : 'text-[#F2B705]'
                    }`}>
                      {label}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#1C2647] dark:text-white line-clamp-1">
                    {grant.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    R$ {grant.grantValue.toLocaleString('pt-BR')},00 · {grant.sphere}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Seção Inferior: Histórico de Inscrições & Pareceres Técnicos */}
      <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#1C2647] dark:text-white">
              Histórico de Inscrições & Pareceres de Bancas
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Registro das submissões simuladas com pontuação de bancas examinadoras e histórico de conformidade.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {historicalSubmissions.length} registros avaliados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Edital / Oportunidade</th>
                <th className="py-3 px-3">Ano</th>
                <th className="py-3 px-3 text-right">Valor Pleiteado</th>
                <th className="py-3 px-3 text-center">Nota Técnica</th>
                <th className="py-3 px-3">Resultado</th>
                <th className="py-3 px-3">Parecer da Comissão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {historicalSubmissions.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#1C2647] dark:text-white max-w-xs truncate">
                    {item.grantTitle}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    {item.year}
                  </td>
                  <td className="py-3 px-3 font-mono text-right font-medium">
                    R$ {item.value.toLocaleString('pt-BR')},00
                  </td>
                  <td className="py-3 px-3 font-mono text-center font-bold text-[#25B2C5]">
                    {item.technicalScore.toFixed(1)} / 100
                  </td>
                  <td className="py-3 px-3">
                    {item.status === 'aprovado' && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#2E9E63] text-[#1C2647]">
                        Aprovado
                      </span>
                    )}
                    {item.status === 'suplente' && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#F2B705] text-[#1C2647]">
                        Suplente
                      </span>
                    )}
                    {item.status === 'nao_selecionado' && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        Não selecionado
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-[11px] max-w-md">
                    {item.feedback}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Atualização Rápida se acionado a partir do dashboard */}
      {documentToUpdate && (
        <DocUpdateModal
          document={documentToUpdate}
          onClose={() => setDocumentToUpdate(null)}
        />
      )}

    </div>
  );
};
