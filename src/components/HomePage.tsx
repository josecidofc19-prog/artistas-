import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown,
  User,
  Building2,
  FileCheck2,
  Layers
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAreaClick = (area: string) => {
    setSearchTerm(area);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const profiles = [
    { 
      id: 'artista_solo' as ArtistProfileType, 
      label: 'Artista Solo', 
      desc: 'Pessoa física com CPF próprio',
      icon: User 
    },
    { 
      id: 'banda_grupo' as ArtistProfileType, 
      label: 'Banda ou Grupo', 
      desc: 'Músicos com representação coletiva',
      icon: Music 
    },
    { 
      id: 'coletivo_cultural' as ArtistProfileType, 
      label: 'Coletivo Cultural', 
      desc: 'Grupos e trupes com ou sem CNPJ',
      icon: Users 
    },
    { 
      id: 'produtor_cultural' as ArtistProfileType, 
      label: 'Produtor Cultural', 
      desc: 'MEI ou produtoras independentes',
      icon: Building2 
    },
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
      a: 'Não. Todos os 12 editais, órgãos e quantias são registros didáticos concebidos exclusivamente para demonstração funcional em feiras acadêmicas e universitárias. Não representam chamamentos governamentais oficiais em andamento.',
    },
    {
      q: 'Como funciona o momento principal da demonstração com o Lucas?',
      a: 'Ao carregar a demonstração, o usuário Lucas inicia com checklist em exatamente 60% e 1 comprovante de residência vencido no cofre. Ao clicar em atualizar o documento com nova validade, a etapa documental é concluída automaticamente e a barra de progresso avança em tempo real para 80%.',
    },
    {
      q: 'Meus documentos ou senhas são enviados para algum servidor externo?',
      a: 'Não. A plataforma opera 100% no navegador (Client-Side) utilizando armazenamento local seguro (localStorage). Nenhum dado pessoal, senha real ou arquivo é transmitido pela internet.',
    },
    {
      q: 'O que significa a ação "Enviar para revisão simulada"?',
      a: 'É uma simulação pedagógica da revisão técnica de conformidade antes da submissão definitiva, auxiliando o artista a conferir todos os campos obrigatórios e documentos requeridos pela banca examinadora.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* HERO SECTION COM DESIGN EDITORIAL E MINIMALISTA */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-white/5">
        
        {/* Glow sutil monocromático de fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-teal-500/5 via-teal-500/0 to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 space-y-10">
          
          {/* Headline & Subtitle */}
          <div className="space-y-4 text-center sm:text-left max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="font-mono uppercase tracking-wider text-xs">Gestão Descomplicada de Editais Culturais</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]"
            >
              Encontre o edital certo. Chegue preparado para se inscrever.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl"
            >
              Organizamos editais, documentos e prazos em um só lugar, com apoio prático para quem não tem equipe de produção cultural.
            </motion.p>
          </div>

          {/* Seletor de Perfil do Artista (Bento Segmented Selector) */}
          <motion.div 
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="bento-card p-5 sm:p-6 space-y-3"
          >
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Selecione seu formato artístico para calibrar editais e requisitos:
              </label>
              <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-semibold hidden sm:inline">
                Filtro em tempo real
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {profiles.map(p => {
                const isSelected = selectedProfile === p.id;
                const IconComponent = p.icon;

                return (
                  <motion.button
                    key={p.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedProfile(p.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer focus-ring ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/30 text-slate-900 dark:text-white shadow-xs'
                        : 'border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <IconComponent className={`w-4 h-4 ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                      <p className="text-xs font-bold leading-tight">{p.label}</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{p.desc}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Campo de Busca Rápida + Ações Principais */}
          <motion.div 
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={e => setLocalSearch(e.target.value)}
                  placeholder="Pesquise por música, teatro, circo, Indaiatuba, Campinas..."
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring shadow-xs"
                />
              </div>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn-primary px-6 py-3 text-sm focus-ring"
              >
                <span>Explorar editais</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>

            {/* Ações de Demonstração */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setAuthModalOpen(true);
                }}
                className="btn-secondary px-4 py-2 text-xs focus-ring"
              >
                Criar conta gratuita
              </button>
              <button
                onClick={loginAsLucas}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors focus-ring border border-slate-200/60 dark:border-white/5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Iniciar simulação pronta (Lucas · 60%)</span>
              </button>
            </div>
          </motion.div>

          {/* 3 Indicadores Bento da Demonstração */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-200/80 dark:border-white/5">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/5 shadow-xs">
              <span className="text-xs uppercase font-semibold text-slate-400 block tracking-wider">Catálogo Modelado</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums mt-1">12 editais</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">10 oportunidades abertas e 2 encerradas</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/5 shadow-xs">
              <span className="text-xs uppercase font-semibold text-slate-400 block tracking-wider">Checklist Reativo</span>
              <p className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 font-mono tabular-nums mt-1">60% &rarr; 80%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Conclusão reativa ao renovar o documento vencido</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/5 shadow-xs">
              <span className="text-xs uppercase font-semibold text-slate-400 block tracking-wider">Privacidade do Artista</span>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-1">100% Local</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Armazenamento seguro em localStorage sem nuvem</p>
            </div>
          </div>

        </div>
      </section>

      {/* SEÇÃO: 3 CARTÕES DE OPORTUNIDADES EM DESTAQUE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-1">
              Oportunidades Abertas
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Editais em Destaque no Momento
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentView('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Ver os 12 editais modelados</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredGrants.map((grant, index) => {
            const { label } = getGrantDeadlineInfo(grant.deadlineDate);

            return (
              <motion.div
                key={grant.id}
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bento-card flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/10 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-teal-600 dark:text-teal-400">{grant.artisticArea}</span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                    <span>{grant.sphere}</span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="font-mono text-amber-500 font-semibold">{label}</span>
                  </div>

                  <h3 
                    onClick={() => {
                      setSelectedGrantId(grant.id);
                      setCurrentView('grant_detail');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-base font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer leading-snug line-clamp-2"
                  >
                    {grant.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {grant.summary}
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs uppercase font-medium text-slate-400 block tracking-wider">Fomento</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                      R$ {grant.grantValue.toLocaleString('pt-BR')},00
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      startPreparationForGrant(grant.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="btn-primary px-3.5 py-1.5 text-xs focus-ring"
                  >
                    Preparar
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SEÇÃO: COMO FUNCIONA (4 PASSOS EDITORIAIS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-1">
            Metodologia Sem Burocracia
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Como funciona a Cultura em Cena
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Projetada para que artistas independentes dediquem tempo à criação artística em vez de formulários confusos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bento-card space-y-3">
            <span className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono">01.</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Escolha seu formato
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Defina se atua como artista solo, banda, coletivo ou produtor. A plataforma ajusta os requisitos automaticamente.
            </p>
          </div>

          <div className="bento-card space-y-3">
            <span className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono">02.</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Filtre oportunidades
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Consulte editais por município, área e prazos. Saiba de antemão se seu formato é elegível sem ler 40 páginas de Diário Oficial.
            </p>
          </div>

          <div className="bento-card space-y-3">
            <span className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono">03.</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Cofre de documentos
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Mantenha certidões e cartas no cofre local. O sistema alerta sobre certidões vencendo em menos de 30 dias civis.
            </p>
          </div>

          <div className="bento-card space-y-3">
            <span className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono">04.</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Checklist guiado
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Acompanhe 5 etapas claras de 20% cada. Atualizou o documento? A etapa documental conclui na mesma hora.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO: CARTÕES DE ÁREAS ARTÍSTICAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-1">
            Segmentos Contemplados
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Navegue pelas Áreas Culturais
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {artisticAreas.map((area, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAreaClick(area.name)}
              className="p-5 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-white dark:bg-slate-900 hover:border-teal-500/60 dark:hover:border-teal-500/60 transition-colors text-left group focus-ring cursor-pointer shadow-xs"
            >
              <area.icon className="w-5 h-5 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors mb-2.5" />
              <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {area.name}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{area.count}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* SEÇÃO: BENEFÍCIOS DA PLATAFORMA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bento-card p-8 sm:p-12 space-y-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Por Que Cultura em Cena?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Menos burocracia, mais tempo no palco e no ateliê
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Sem surpresas de última hora
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Você sabe exatamente quais certidões precisa antes de escrever o projeto, evitando desclassificações formais.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <FolderLock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Cofre reutilizável
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Cadastre a declaração dos integrantes ou comprovante de residência uma vez e aproveite em dezenas de inscrições.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Prazos em dias reais
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Contagem regressiva dinâmica para você não perder datas de retificação de documentos e homologação final.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: PERGUNTAS FREQUENTES (FAQ) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Tire Suas Dúvidas
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/80 dark:border-white/5 bg-white dark:bg-slate-900 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-teal-600 dark:text-teal-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3.5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SEÇÃO FINAL: CHAMADA À AÇÃO (BENTO HERO BANNER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-slate-900 text-white text-center space-y-6 relative overflow-hidden border border-white/10 shadow-lg">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulação Pronta para Bancas</span>
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Pronto para ver a demonstração em ação?
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Em menos de dois minutos, você testa a atualização do comprovante vencido de Lucas e observa a etapa documental do checklist se concluir automaticamente para 80%.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  loginAsLucas();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-primary px-6 py-3 text-sm focus-ring"
              >
                Iniciar Demonstração (Lucas)
              </motion.button>
              <button
                onClick={() => {
                  setCurrentView('catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-secondary px-6 py-3 text-sm focus-ring"
              >
                Explorar Catálogo
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
