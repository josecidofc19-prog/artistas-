import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  Clock, 
  ArrowUpDown, 
  Building, 
  MapPin, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getGrantDeadlineInfo } from '../data/mockGrants';
import { ArtisticArea, Sphere, LegalEligibility } from '../types';

export const CatalogPage: React.FC = () => {
  const { 
    grants, 
    searchTerm, 
    setSearchTerm, 
    setSelectedGrantId, 
    setCurrentView,
    startPreparationForGrant 
  } = useApp();

  // Estados de Filtros
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedSphere, setSelectedSphere] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedValueRange, setSelectedValueRange] = useState<string>('all');
  const [selectedDeadlineRange, setSelectedDeadlineRange] = useState<string>('all');
  const [selectedLegal, setSelectedLegal] = useState<string>('all');
  
  // Status padrão: "abertos" (exibe exatamente os 10 abertos; os 2 encerrados só aparecem em "encerrados" ou "todos")
  const [selectedStatus, setSelectedStatus] = useState<'abertos' | 'encerrados' | 'todos'>('abertos');
  
  // Ordenação
  const [sortBy, setSortBy] = useState<'prazo' | 'valor' | 'publicacao'>('prazo');

  // Filtragem combinada em tempo real sobre os dados do estado
  const filteredGrants = useMemo(() => {
    return grants.filter(grant => {
      const deadlineInfo = getGrantDeadlineInfo(grant.deadlineDate);

      // Regra obrigatória: por padrão, mostrar apenas os 10 abertos.
      // Encerrados aparecem somente quando o filtro "encerrados" ou "todos" for selecionado.
      if (selectedStatus === 'abertos' && deadlineInfo.isClosed) {
        return false;
      }
      if (selectedStatus === 'encerrados' && !deadlineInfo.isClosed) {
        return false;
      }

      // Busca por texto
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = grant.title.toLowerCase().includes(query);
        const matchesSummary = grant.summary.toLowerCase().includes(query);
        const matchesBody = grant.issuingBody.toLowerCase().includes(query);
        const matchesArea = grant.artisticArea.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSummary && !matchesBody && !matchesArea) {
          return false;
        }
      }

      // Filtro por Área Artística
      if (selectedArea !== 'all' && grant.artisticArea !== selectedArea) {
        return false;
      }

      // Filtro por Esfera
      if (selectedSphere !== 'all' && grant.sphere !== selectedSphere) {
        return false;
      }

      // Filtro por Cidade / Território
      if (selectedCity !== 'all') {
        if (selectedCity === 'Indaiatuba' && grant.city !== 'Indaiatuba') return false;
        if (selectedCity === 'Campinas' && grant.city !== 'Campinas') return false;
        if (selectedCity === 'SP' && grant.state !== 'SP') return false;
        if (selectedCity === 'ate_50k' && !grant.maxCityPopulation) return false;
      }

      // Filtro por Valor
      if (selectedValueRange !== 'all') {
        if (selectedValueRange === 'ate_30k' && grant.grantValue > 30000) return false;
        if (selectedValueRange === '30k_60k' && (grant.grantValue <= 30000 || grant.grantValue > 60000)) return false;
        if (selectedValueRange === 'acima_60k' && grant.grantValue <= 60000) return false;
      }

      // Filtro por Prazo
      if (selectedDeadlineRange !== 'all') {
        if (deadlineInfo.isClosed) return false;
        if (selectedDeadlineRange === '15d' && deadlineInfo.daysRemaining > 15) return false;
        if (selectedDeadlineRange === '30d' && deadlineInfo.daysRemaining > 30) return false;
      }

      // Filtro por Elegibilidade Jurídica
      if (selectedLegal !== 'all') {
        if (!grant.eligibleLegal.includes(selectedLegal as LegalEligibility)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'prazo') {
        const diffA = new Date(a.deadlineDate).getTime();
        const diffB = new Date(b.deadlineDate).getTime();
        return diffA - diffB;
      }
      if (sortBy === 'valor') {
        return b.grantValue - a.grantValue;
      }
      if (sortBy === 'publicacao') {
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      }
      return 0;
    });
  }, [
    grants, 
    selectedStatus, 
    searchTerm, 
    selectedArea, 
    selectedSphere, 
    selectedCity, 
    selectedValueRange, 
    selectedDeadlineRange, 
    selectedLegal, 
    sortBy
  ]);

  const clearAllFilters = () => {
    setSelectedArea('all');
    setSelectedSphere('all');
    setSelectedCity('all');
    setSelectedValueRange('all');
    setSelectedDeadlineRange('all');
    setSelectedLegal('all');
    setSelectedStatus('abertos');
    setSearchTerm('');
  };

  const hasActiveFilters = 
    selectedArea !== 'all' ||
    selectedSphere !== 'all' ||
    selectedCity !== 'all' ||
    selectedValueRange !== 'all' ||
    selectedDeadlineRange !== 'all' ||
    selectedLegal !== 'all' ||
    selectedStatus !== 'abertos' ||
    searchTerm.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      
      {/* Topo do Catálogo */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#25B2C5] block mb-1">
            Catálogo Oficial de Editais
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C2647] dark:text-white">
            Oportunidades Culturais
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Editais modelados com requisitos detalhados de elegibilidade, cotas de municípios, formatos de coletivo e prazos consistentes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span>Total cadastrado: <strong>12 editais</strong></span>
          <span>·</span>
          <span>Exibindo: <strong className="text-[#25B2C5]">{filteredGrants.length}</strong></span>
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] shadow-xs space-y-4">
        
        {/* Linha 1: Input de Busca com Ícone */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome do edital, órgão, área artística ou palavra-chave..."
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-[#1C2647] dark:text-white placeholder:text-slate-400 focus-ring"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Linha 2: Dropdowns de Filtro */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          
          {/* Status */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1C2647] dark:text-white focus-ring text-xs"
            >
              <option value="abertos">Abertos (Padrão: 10)</option>
              <option value="encerrados">Encerrados (2)</option>
              <option value="todos">Todos os status (12)</option>
            </select>
          </div>

          {/* Área Artística */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Área Artística
            </label>
            <select
              value={selectedArea}
              onChange={e => setSelectedArea(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1C2647] dark:text-white focus-ring text-xs"
            >
              <option value="all">Todas as áreas</option>
              <option value="Música">Música (2)</option>
              <option value="Teatro">Teatro (2)</option>
              <option value="Artes Visuais">Artes Visuais (1)</option>
              <option value="Dança">Dança (1)</option>
              <option value="Literatura">Literatura (1)</option>
              <option value="Audiovisual">Audiovisual (1)</option>
              <option value="Circo">Circo (1)</option>
              <option value="Patrimônio Cultural">Patrimônio (2)</option>
            </select>
          </div>

          {/* Esfera */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Esfera
            </label>
            <select
              value={selectedSphere}
              onChange={e => setSelectedSphere(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1C2647] dark:text-white focus-ring text-xs"
            >
              <option value="all">Todas as esferas</option>
              <option value="Municipal">Municipal</option>
              <option value="Estadual">Estadual (SP)</option>
              <option value="Federal">Federal</option>
            </select>
          </div>

          {/* Cidade / População */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Localidade / Cota
            </label>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1C2647] dark:text-white focus-ring text-xs"
            >
              <option value="all">Qualquer local</option>
              <option value="Indaiatuba">Indaiatuba</option>
              <option value="Campinas">Campinas</option>
              <option value="SP">Estado de SP</option>
              <option value="ate_50k">Cidades &le; 50 mil hab.</option>
            </select>
          </div>

          {/* Elegibilidade */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Elegibilidade
            </label>
            <select
              value={selectedLegal}
              onChange={e => setSelectedLegal(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1C2647] dark:text-white focus-ring text-xs"
            >
              <option value="all">Qualquer formato</option>
              <option value="pf">Pessoa Física (PF)</option>
              <option value="coletivo">Coletivo sem CNPJ</option>
              <option value="mei">MEI</option>
              <option value="empresa">Empresa (PJ)</option>
            </select>
          </div>

          {/* Ordenação */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Ordenar Por
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1C2647] dark:text-white focus-ring text-xs font-semibold"
            >
              <option value="prazo">Prazo mais urgente</option>
              <option value="valor">Maior valor (R$)</option>
              <option value="publicacao">Mais recentes</option>
            </select>
          </div>

        </div>

        {/* Linha 3: Tags ativas e Limpar Filtros */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 text-slate-500">
              <span>Filtros ativos:</span>
              {selectedStatus !== 'abertos' && (
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#1C2647] dark:text-white flex items-center gap-1 text-[11px]">
                  Status: {selectedStatus}
                  <button onClick={() => setSelectedStatus('abertos')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedArea !== 'all' && (
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#1C2647] dark:text-white flex items-center gap-1 text-[11px]">
                  Área: {selectedArea}
                  <button onClick={() => setSelectedArea('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedSphere !== 'all' && (
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#1C2647] dark:text-white flex items-center gap-1 text-[11px]">
                  Esfera: {selectedSphere}
                  <button onClick={() => setSelectedSphere('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedCity !== 'all' && (
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#1C2647] dark:text-white flex items-center gap-1 text-[11px]">
                  Território: {selectedCity}
                  <button onClick={() => setSelectedCity('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedLegal !== 'all' && (
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#1C2647] dark:text-white flex items-center gap-1 text-[11px]">
                  Legal: {selectedLegal.toUpperCase()}
                  <button onClick={() => setSelectedLegal('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>

            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-[#D64545] hover:underline"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}

      </div>

      {/* Lista de Resultados */}
      {filteredGrants.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] space-y-3">
          <AlertCircle className="w-10 h-10 mx-auto text-slate-400" />
          <h3 className="text-base font-bold text-[#1C2647] dark:text-white">
            Nenhum edital encontrado para estes critérios
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tente remover alguns filtros ou selecionar "Todos os status" para visualizar oportunidades encerradas.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-[#25B2C5] text-[#1C2647]"
          >
            Restaurar catálogo inicial
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredGrants.map(grant => {
            const { isClosed, daysRemaining, label } = getGrantDeadlineInfo(grant.deadlineDate);

            return (
              <div
                key={grant.id}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-3">
                  {/* Metadados Limpos sem Pill Candy */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-[#6A4BBF] dark:text-[#8263D8]">{grant.artisticArea}</span>
                    <span aria-hidden="true">·</span>
                    <span>{grant.sphere}</span>
                    <span aria-hidden="true">·</span>
                    <span className={`font-mono font-bold ${isClosed ? 'text-[#D64545]' : 'text-[#F2B705]'}`}>
                      {label}
                    </span>
                  </div>

                  <div>
                    <h2 
                      onClick={() => {
                        setSelectedGrantId(grant.id);
                        setCurrentView('grant_detail');
                      }}
                      className="text-lg font-bold text-[#1C2647] dark:text-white hover:text-[#25B2C5] transition-colors cursor-pointer leading-snug line-clamp-2"
                    >
                      {grant.title}
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {grant.issuingBody}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {grant.summary}
                  </p>

                  {/* Restrições Especiais / Tags discretas */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {grant.maxCityPopulation && (
                      <span className="text-[#6A4BBF] font-semibold">
                        Cidades até 50 mil hab.
                      </span>
                    )}
                    {grant.eligibleLegal.includes('coletivo') && (
                      <span>· Aceita coletivo sem CNPJ</span>
                    )}
                    {grant.eligibleLegal.includes('mei') && (
                      <span>· Aceita MEI</span>
                    )}
                  </div>
                </div>

                {/* Rodapé do Card com Valor e Ações */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Valor Ilustrativo
                    </span>
                    <span className="text-base font-extrabold text-[#1C2647] dark:text-white font-mono tabular-nums">
                      R$ {grant.grantValue.toLocaleString('pt-BR')},00
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedGrantId(grant.id);
                        setCurrentView('grant_detail');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Detalhes
                    </button>
                    <button
                      onClick={() => startPreparationForGrant(grant.id)}
                      disabled={isClosed}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#25B2C5] text-[#1C2647] hover:bg-[#1FA0B2] disabled:opacity-50 transition-colors focus-ring shadow-xs"
                    >
                      {isClosed ? 'Encerrado' : 'Preparar'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
