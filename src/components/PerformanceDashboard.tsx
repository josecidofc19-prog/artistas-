import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowUpRight, 
  FileText, 
  Calendar, 
  Award, 
  Sparkles, 
  ChevronRight, 
  ShieldAlert, 
  ArrowRight,
  ShieldCheck,
  FolderLock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getGrantDeadlineInfo } from '../data/mockGrants';
import { DocUpdateModal } from './DocUpdateModal';
import { VaultDocument } from '../types';
import { calculateDocumentStatus, getCivilDaysRemaining } from '../data/defaultVault';

import { Variants } from 'framer-motion';

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
  const docsValid = vaultDocuments.filter(d => calculateDocumentStatus(d.expiryDate) === 'em_dia').length;
  const docsExpiringSoon = vaultDocuments.filter(d => calculateDocumentStatus(d.expiryDate) === 'vence_breve').length;
  const docsExpired = vaultDocuments.filter(d => calculateDocumentStatus(d.expiryDate) === 'vencido').length;

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
  const expiredDoc = vaultDocuments.find(d => calculateDocumentStatus(d.expiryDate) === 'vencido');

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24,
        delay: i * 0.05
      }
    })
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Cabeçalho do Dashboard - Estilo Linear/Vercel */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 dark:border-white/5 pb-8"
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="tracking-wide uppercase font-mono text-xs">Gestão Artística & Performance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Performance de {activeArtistName}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Perfil: <strong className="text-slate-800 dark:text-slate-200">{activeProfileType === 'banda_grupo' ? 'Banda ou grupo musical' : activeProfileType}</strong></span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span>Sede: <strong className="text-slate-800 dark:text-slate-200">{activeCity}, SP</strong></span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span>Segmento: <strong className="text-slate-800 dark:text-slate-200">{activeArea}</strong></span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => setCurrentView('catalog')}
            className="btn-secondary focus-ring"
          >
            Explorar catálogo completo
          </motion.button>
          
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => setCurrentView('checklist')}
            className="btn-primary px-5 py-2.5 focus-ring"
          >
            <span>Inscrição ativa ({activeApplication?.progressPercentage || 60}%)</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Alerta de Ação Crítica no Cofre (Se houver documento vencido) */}
      {expiredDoc && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-red-500/20 bg-red-50/60 dark:bg-red-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-red-500 text-white shrink-0 mt-0.5 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-700 dark:text-red-400">
                Ação Crítica Requerida: Documento obrigatório expirado no cofre
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                O documento <strong className="text-slate-900 dark:text-white">{expiredDoc.name}</strong> está vencido e impede a conclusão da etapa "Separar documentos" na sua inscrição ativa.
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDocumentToUpdate(expiredDoc)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors whitespace-nowrap shadow-xs focus-ring"
          >
            Renovar documento agora
          </motion.button>
        </motion.div>
      )}

      {/* Bento Grid: 4 Cards de Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Inscrições */}
        <motion.div 
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bento-card relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider">Inscrições Realizadas</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
              {totalSubmissions}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({historicalSubmissions.length} históricas + 1 ativa)
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {approvedCount} selecionadas
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span>1 em preparação</span>
          </div>
        </motion.div>

        {/* Card 2: Taxa de Sucesso Histórica */}
        <motion.div 
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bento-card relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider">Taxa de Aprovação</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
              {successRate}%
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              +12% média estadual
            </span>
          </div>
          <p className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Baseado em conformidade de dossiês e pontuação técnica de bancas.
          </p>
        </motion.div>

        {/* Card 3: Recursos Financeiros Mapeados */}
        <motion.div 
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bento-card relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider">Recursos Elegíveis</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-amber-500">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs font-semibold text-slate-400">R$</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
              {totalFinancialMapped.toLocaleString('pt-BR')},00
            </span>
          </div>
          <p className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Soma de <strong className="text-slate-800 dark:text-slate-200">{recommendedOpportunities.length} editais abertos</strong> compatíveis com seu perfil.
          </p>
        </motion.div>

        {/* Card 4: Conformidade do Cofre de Documentos */}
        <motion.div 
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bento-card relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider">Conformidade do Cofre</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
              {vaultHealthPercent}%
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              docsExpired === 0 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
            }`}>
              {docsExpired === 0 ? 'Regularizado' : `${docsExpired} vencido`}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">{docsValid} em dia</span>
            <span>·</span>
            <span className="text-amber-500 font-medium">{docsExpiringSoon} alerta</span>
            <span>·</span>
            <span className="text-red-500 font-medium">{docsExpired} vencido</span>
          </div>
        </motion.div>

      </div>

      {/* Layout Bento Principal: 2 Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna Esquerda: Oportunidades Recomendadas (2/3 da largura) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Oportunidades Recomendadas
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Classificadas por afinidade técnica com seu perfil artístico ({activeProfileType})
              </p>
            </div>
            <motion.button
              whileHover={{ x: 2 }}
              onClick={() => setCurrentView('catalog')}
              className="text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1 transition-colors"
            >
              <span>Ver catálogo completo ({grants.length})</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="space-y-4">
            {recommendedOpportunities.map(({ grant, matchScore, reasons }, idx) => {
              const { daysRemaining, label } = getGrantDeadlineInfo(grant.deadlineDate);
              const isCurrentApp = activeApplication?.grantId === grant.id;

              return (
                <motion.div 
                  key={grant.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24, delay: idx * 0.04 }}
                  whileHover={{ y: -2 }}
                  className={`p-6 rounded-2xl sm:rounded-3xl border transition-all ${
                    isCurrentApp 
                      ? 'border-teal-500/50 bg-teal-50/40 dark:bg-teal-950/20 shadow-xs' 
                      : 'border-slate-200/80 dark:border-white/5 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-50/40 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Metadados Limpos sem Pill Candy */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-teal-600 dark:text-teal-400">{grant.artisticArea}</span>
                        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                        <span>{grant.sphere}</span>
                        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          R$ {grant.grantValue.toLocaleString('pt-BR')},00
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                        {grant.title}
                      </h3>
                      
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {grant.summary}
                      </p>

                      {/* Motivos da afinidade */}
                      <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Motivos de match:</span>
                        {reasons.slice(0, 3).map((r, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Ação e afinidade */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                      <div className="text-right">
                        <div className="flex items-center gap-1 font-mono text-sm font-bold text-teal-600 dark:text-teal-400">
                          <span>{matchScore}%</span>
                          <span className="text-xs text-slate-400 font-normal">afinidade</span>
                        </div>
                        <div className="text-xs font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>{label}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedGrantId(grant.id);
                            setCurrentView('grant_detail');
                          }}
                          className="btn-secondary px-3.5 py-1.5 text-xs focus-ring"
                        >
                          Ver edital
                        </button>
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            if (isCurrentApp) {
                              setCurrentView('checklist');
                            } else {
                              startPreparationForGrant(grant.id);
                            }
                          }}
                          className="btn-primary px-4 py-1.5 text-xs focus-ring"
                        >
                          {isCurrentApp ? 'Abrir checklist' : 'Preparar'}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Coluna Direita: Status de Documentos & Prazos Críticos (1/3 da largura) */}
        <div className="space-y-6">
          
          {/* Caixa 1: Resumo do Status de Documentos */}
          <div className="bento-card space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                Status do Cofre
              </h3>
              <button
                onClick={() => setCurrentView('vault')}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
              >
                Gerenciar cofre
              </button>
            </div>

            {/* Barra de distribuição animada com Framer Motion */}
            <div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(docsValid / (docsTotal || 1)) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="bg-emerald-500" 
                  title={`${docsValid} em dia`}
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(docsExpiringSoon / (docsTotal || 1)) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                  className="bg-amber-400" 
                  title={`${docsExpiringSoon} vencendo em breve`}
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(docsExpired / (docsTotal || 1)) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                  className="bg-red-500" 
                  title={`${docsExpired} vencidos`}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2.5 font-mono">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Em dia ({docsValid})
                </span>
                <span className="flex items-center gap-1.5 text-amber-500">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  &le; 30d ({docsExpiringSoon})
                </span>
                <span className="flex items-center gap-1.5 text-red-500">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Vencidos ({docsExpired})
                </span>
              </div>
            </div>

            {/* Lista dos Documentos com Botão de Ação Direta */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
              {vaultDocuments.slice(0, 5).map(doc => {
                const docStatus = calculateDocumentStatus(doc.expiryDate);
                const isExp = docStatus === 'vencido';
                const isWarn = docStatus === 'vence_breve';
                const daysRemaining = getCivilDaysRemaining(doc.expiryDate);

                return (
                  <div 
                    key={doc.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {doc.name}
                      </p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {doc.expiryDate ? `Validade: ${new Date(doc.expiryDate).toLocaleDateString('pt-BR')}` : 'Sem validade fixa'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isExp && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                          Vencido
                        </span>
                      )}
                      {isWarn && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {daysRemaining !== null ? `${daysRemaining}d` : 'Alerta'}
                        </span>
                      )}
                      {!isExp && !isWarn && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Em dia
                        </span>
                      )}

                      <button
                        onClick={() => setDocumentToUpdate(doc)}
                        className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 ml-1"
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
          <div className="bento-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              Prazos Críticos (Próximos Encerramentos)
            </h3>

            <div className="space-y-3">
              {criticalDeadlines.map(({ grant, daysRemaining, label }) => (
                <motion.div 
                  key={grant.id}
                  whileHover={{ x: 2 }}
                  onClick={() => {
                    setSelectedGrantId(grant.id);
                    setCurrentView('grant_detail');
                  }}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">{grant.artisticArea}</span>
                    <span className={`font-mono font-bold text-xs ${
                      daysRemaining <= 10 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {label}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {grant.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    R$ {grant.grantValue.toLocaleString('pt-BR')},00 · {grant.sphere}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Seção Inferior: Histórico de Inscrições & Pareceres Técnicos */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.15 }}
        className="bento-card space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Histórico de Inscrições & Pareceres de Bancas
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Registro das submissões simuladas com notas técnicas de bancas examinadoras e conformidade.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {historicalSubmissions.length} registros avaliados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-white/5 text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Edital / Oportunidade</th>
                <th className="py-3 px-3">Ano</th>
                <th className="py-3 px-3 text-right">Valor Pleiteado</th>
                <th className="py-3 px-3 text-center">Nota Técnica</th>
                <th className="py-3 px-3">Resultado</th>
                <th className="py-3 px-3">Parecer da Comissão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-600 dark:text-slate-300">
              {historicalSubmissions.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                    {item.grantTitle}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-500">
                    {item.year}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-right font-medium text-slate-800 dark:text-slate-200">
                    R$ {item.value.toLocaleString('pt-BR')},00
                  </td>
                  <td className="py-3.5 px-3 font-mono text-center font-bold text-teal-600 dark:text-teal-400">
                    {item.technicalScore.toFixed(1)} / 100
                  </td>
                  <td className="py-3.5 px-3">
                    {item.status === 'aprovado' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Aprovado
                      </span>
                    )}
                    {item.status === 'suplente' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        Suplente
                      </span>
                    )}
                    {item.status === 'nao_selecionado' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5">
                        Não selecionado
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 text-xs max-w-md leading-relaxed">
                    {item.feedback}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

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
