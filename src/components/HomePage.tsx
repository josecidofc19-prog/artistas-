import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  FolderLock, 
  ListTodo, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  ShieldCheck, 
  Music, 
  Drama, 
  Palette, 
  Film, 
  BookOpen, 
  Flame, 
  Landmark, 
  Footprints,
  Users,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ArtistProfileType, ArtisticArea } from '../types';
import { getGrantDeadlineInfo } from '../data/mockGrants';

export const HomePage: React.FC = () => {
  const { 
    selectedProfile, 
    setSelectedProfile, 
    searchTerm, 
    setSearchTerm, 
    setCurrentView,
    setSelectedGrantId,
    startPreparationForGrant,
    grants,
    setAuthModalOpen,
    setAuthModalMode,
    loginAsLucas
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchTerm(localSearch.trim());
    }
    setCurrentView('catalog');
  };

  const handleAreaClick = (area: string) => {
    setSearchTerm(area);
    setCurrentView('catalog');
  };

  const profiles = [
    { id: 'artista_solo' as ArtistProfileType, label: 'Artista solo', desc: 'Pessoa física com CPF próprio' },
    { id: 'banda_grupo' as ArtistProfileType, label: 'Banda ou grupo', desc: 'Músicos e grupos com representação' },
    { id: 'coletivo_cultural' as ArtistProfileType, label: 'Coletivo cultural', desc: 'Grupos e trupes com ou sem CNPJ' },
    { id: 'produtor_cultural' as ArtistProfileType, label: 'Produtor cultural', desc: 'MEI ou produtoras independentes' },
  ];

  const artisticAreas = [
    { name: 'Música', icon: Music, count: '3 editais' },
    { name: 'Teatro', icon: Drama, count: '2 editais' },
    { name: 'Artes Visuais', icon: Palette, count: '1 edital' },
    { name: 'Audiovisual', icon: Film, count: '1 edital' },
    { name: 'Literatura', icon: BookOpen, count: '1 edital' },
    { name: 'Dança', icon: Footprints, count: '1 edital' },
    { name: 'Circo', icon: Flame, count: '1 edital' },
    { name: 'Patrimônio Cultural', icon: Landmark, count: '2 editais' },
  ];

  // 3 oportunidades em destaque (abertas)
  const featuredGrants = grants.filter(g => !getGrantDeadlineInfo(g.deadlineDate).isClosed).slice(0, 3);

  const faqs = [
    {
      q: 'Os editais e valores apresentados são reais?',
      a: 'Não. Todos os 12 editais, órgãos e quantias são registros didáticos fictícios concebidos exclusivamente para a demonstração funcional em feiras acadêmicas e universitárias. Não representam chamamentos governamentais oficiais.',
    },
    {
      q: 'Como funciona o momento principal da demonstração com o Lucas?',
      a: 'Ao carregar a demonstração, o usuário Lucas inicia com checklist em exatamente 60% e 1 comprovante de residência vencido no cofre. Ao clicar em atualizar o documento com nova validade, a etapa documental é concluída automaticamente e a barra de progresso avança em tempo real para 80%.',
    },
    {
      q: 'Meus documentos ou senhas são enviados para algum servidor?',
      a: 'Não. A plataforma opera 100% no navegador (Client-Side) utilizando localStorage. Nenhum dado pessoal, senha real ou arquivo é transmitido pela internet.',
    },
    {
      q: 'O que significa o botão "Enviar para revisão"?',
      a: 'É uma simulação pedagógica da revisão técnica de conformidade do projeto antes da submissão definitiva, auxiliando o artista a conferir todos os campos.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 animate-in fade-in duration-200">
      
      {/* HERO SECTION COM ILUMINAÇÃO DE PALCO CÊNICA */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800">
        
        {/* Spotlights Cênicos Suaves */}
        <div className="absolute inset-0 stage-spotlight pointer-events-none" />
        <div className="absolute -top-24 right-0 w-96 h-96 stage-spotlight-teal pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-80 h-80 stage-spotlight-purple pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-8 text-center sm:text-left">
          
          {/* Título e Subtítulo Obrigatórios (EXATOS) */}
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#25B2C5]">
              <Sparkles className="w-4 h-4" />
              <span>Plataforma para Artistas Independentes</span>
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1C2647] dark:text-white leading-[1.15] text-balance">
              Encontre o edital certo. Chegue preparado para se inscrever.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl text-balance">
              Organizamos editais, documentos e prazos em um só lugar, com apoio humano para quem não tem equipe de produção.
            </p>
          </div>

          {/* Seletor de Perfil do Artista (Persistido e Reutilizado) */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#141B33]/90 backdrop-blur-md shadow-xs max-w-3xl">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Selecione seu formato artístico para personalizar editais e documentos:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {profiles.map(p => {
                const isSelected = selectedProfile === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProfile(p.id)}
                    className={`p-3 rounded-xl border text-left transition-all focus-ring cursor-pointer ${
                      isSelected
                        ? 'border-[#25B2C5] bg-[#25B2C5]/10 dark:bg-[#25B2C5]/20 text-[#1C2647] dark:text-white font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-xs font-bold leading-tight">{p.label}</p>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{p.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Campo de Busca Funcional que transfere para o Catálogo */}
          <div className="max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={e => setLocalSearch(e.target.value)}
                  placeholder="Pesquise por música, teatro, circo, Indaiatuba, Campinas..."
                  className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#141B33] text-[#1C2647] dark:text-white placeholder:text-slate-400 focus-ring shadow-xs"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 text-xs sm:text-sm font-bold rounded-xl bg-[#25B2C5] text-[#1C2647] hover:bg-[#1FA0B2] transition-colors focus-ring shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Explorar editais</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Botões de Ação Principal e Demonstração */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                setAuthModalMode('register');
                setAuthModalOpen(true);
              }}
              className="px-5 py-2.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#1C2647] dark:text-white transition-colors focus-ring"
            >
              Criar conta grátis
            </button>
            <button
              onClick={loginAsLucas}
              className="px-5 py-2.5 text-xs font-bold rounded-lg bg-[#6A4BBF] text-white hover:bg-[#8263D8] transition-colors focus-ring shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Acessar demonstração pronta (Lucas · 60%)</span>
            </button>
          </div>

          {/* 3 Indicadores de Demonstração */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl border-t border-slate-200 dark:border-slate-800">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Indicador de Demonstração</span>
              <p className="text-xl font-extrabold text-[#1C2647] dark:text-white font-mono tabular-nums">12 editais</p>
              <p className="text-[11px] text-slate-500 mt-0.5">10 abertos e 2 encerrados calculados em tempo real</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Cálculo de Checklist</span>
              <p className="text-xl font-extrabold text-[#25B2C5] font-mono tabular-nums">60% &rarr; 80%</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Conclusão automática reativa ao renovar documento vencido</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Privacidade Total</span>
              <p className="text-xl font-extrabold text-[#2E9E63] font-mono tabular-nums">100% Local</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Sem envio externo nem armazenamento em nuvem</p>
            </div>
          </div>

        </div>
      </section>

      {/* SEÇÃO: 3 CARTÕES DE OPORTUNIDADES EM DESTAQUE NO HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#25B2C5] block mb-1">
              Oportunidades Abertas
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-[#1C2647] dark:text-white">
              Editais em Destaque no Momento
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('catalog')}
            className="text-xs font-bold text-[#25B2C5] hover:underline flex items-center gap-1"
          >
            <span>Ver os 12 editais modelados</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredGrants.map(grant => {
            const { label } = getGrantDeadlineInfo(grant.deadlineDate);

            return (
              <div
                key={grant.id}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-[#6A4BBF] dark:text-[#8263D8]">{grant.artisticArea}</span>
                    <span aria-hidden="true">·</span>
                    <span>{grant.sphere}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[#F2B705] font-semibold">{label}</span>
                  </div>

                  <h3 
                    onClick={() => {
                      setSelectedGrantId(grant.id);
                      setCurrentView('grant_detail');
                    }}
                    className="text-base font-bold text-[#1C2647] dark:text-white hover:text-[#25B2C5] transition-colors cursor-pointer leading-snug line-clamp-2"
                  >
                    {grant.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {grant.summary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Prêmio / Fomento</span>
                    <span className="text-base font-extrabold text-[#1C2647] dark:text-white font-mono tabular-nums">
                      R$ {grant.grantValue.toLocaleString('pt-BR')},00
                    </span>
                  </div>

                  <button
                    onClick={() => startPreparationForGrant(grant.id)}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#25B2C5] text-[#1C2647] hover:bg-[#1FA0B2] transition-colors focus-ring shadow-xs"
                  >
                    Preparar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SEÇÃO: COMO FUNCIONA (4 PASSOS EDITORIAIS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#25B2C5] block mb-1">
            Metodologia Sem Burocracia
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#1C2647] dark:text-white">
            Como funciona a Cultura em Cena
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Projetada para que artistas independentes dediquem tempo à criação em vez de formulários confusos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] space-y-3">
            <span className="text-2xl font-black text-[#25B2C5] font-mono">01.</span>
            <h3 className="text-base font-bold text-[#1C2647] dark:text-white">
              Escolha seu formato
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Defina se atua como artista solo, banda, coletivo ou produtor. A plataforma ajusta os requisitos automaticamente.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] space-y-3">
            <span className="text-2xl font-black text-[#25B2C5] font-mono">02.</span>
            <h3 className="text-base font-bold text-[#1C2647] dark:text-white">
              Filtre oportunidades reais
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Consulte editais por município, área e prazos. Saiba de antemão se seu formato é elegível sem ler 40 páginas.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] space-y-3">
            <span className="text-2xl font-black text-[#25B2C5] font-mono">03.</span>
            <h3 className="text-base font-bold text-[#1C2647] dark:text-white">
              Cofre de documentos
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Mantenha certidões e cartas no cofre local. O sistema alerta sobre certidões vencendo em menos de 30 dias.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] space-y-3">
            <span className="text-2xl font-black text-[#25B2C5] font-mono">04.</span>
            <h3 className="text-base font-bold text-[#1C2647] dark:text-white">
              Checklist guiado
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Acompanhe 5 etapas claras de 20% cada. Atualizou o documento? A etapa documental conclui na hora.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO: CARTÕES DE ÁREAS ARTÍSTICAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#25B2C5] block mb-1">
            Segmentos Contemplados
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#1C2647] dark:text-white">
            Navegue pelas Áreas Culturais
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {artisticAreas.map((area, i) => (
            <button
              key={i}
              onClick={() => handleAreaClick(area.name)}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] hover:border-[#25B2C5] dark:hover:border-[#25B2C5] transition-all text-left group focus-ring cursor-pointer"
            >
              <area.icon className="w-6 h-6 text-[#6A4BBF] dark:text-[#8263D8] group-hover:text-[#25B2C5] transition-colors mb-2" />
              <p className="text-sm font-bold text-[#1C2647] dark:text-white group-hover:text-[#25B2C5] transition-colors">
                {area.name}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">{area.count}</p>
            </button>
          ))}
        </div>
      </section>

      {/* SEÇÃO: BENEFÍCIOS DA PLATAFORMA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-[#141B33] dark:to-[#1C2647] space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#25B2C5]">
              Por Que Cultura em Cena?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C2647] dark:text-white">
              Menos burocracia, mais tempo no palco e no ateliê
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#25B2C5]/20 text-[#25B2C5] flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1C2647] dark:text-white text-base">
                Sem surpresas de última hora
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Você sabe exatamente quais certidões precisa antes de escrever o projeto, evitando desclassificações formais.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#6A4BBF]/20 text-[#6A4BBF] dark:text-[#8263D8] flex items-center justify-center font-bold">
                <FolderLock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1C2647] dark:text-white text-base">
                Cofre reutilizável
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Cadastre a declaração dos integrantes ou comprovante de residência uma vez e aproveite em dezenas de inscrições.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-[#2E9E63] flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1C2647] dark:text-white text-base">
                Prazos em dias reais
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Contagem regressiva dinâmica para você não perder datas de retificação de documentos e homologação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: PERGUNTAS FREQUENTES (FAQ) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#25B2C5]">
            Tire Suas Dúvidas
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#1C2647] dark:text-white">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141B33] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#1C2647] dark:text-white hover:text-[#25B2C5] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SEÇÃO FINAL: CHAMADA À AÇÃO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#1C2647] text-white text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 stage-spotlight pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Pronto para ver a demonstração em ação?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Em menos de dois minutos, você testa a atualização do comprovante vencido de Lucas e observa a etapa documental do checklist se concluir automaticamente.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={loginAsLucas}
                className="px-6 py-3 text-xs sm:text-sm font-bold rounded-xl bg-[#25B2C5] text-[#1C2647] hover:bg-[#1FA0B2] transition-colors focus-ring shadow-xs"
              >
                Iniciar Demonstração (Lucas)
              </button>
              <button
                onClick={() => setCurrentView('catalog')}
                className="px-6 py-3 text-xs sm:text-sm font-semibold rounded-xl border border-white/20 hover:bg-white/10 text-white transition-colors focus-ring"
              >
                Explorar Catálogo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#10162A] py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-bold text-[#1C2647] dark:text-white text-base">Cultura em Cena</p>
            <p>Projeto de demonstração curricular para feira universitária de inovação cultural.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <button onClick={() => setCurrentView('catalog')} className="hover:underline">Editais</button>
            <button onClick={() => setCurrentView('vault')} className="hover:underline">Cofre Local</button>
            <button onClick={() => setCurrentView('dashboard')} className="hover:underline">Performance</button>
            <button onClick={() => setCurrentView('checklist')} className="hover:underline">Inscrição</button>
          </div>

          <div className="text-center md:text-right space-y-0.5 text-[11px]">
            <p>Simulação acadêmica sem backend nem armazenamento em nuvem.</p>
            <p>Privacidade local garantida via localStorage.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};
