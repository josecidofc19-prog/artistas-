import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, ChevronRight, FileText, HelpCircle, Shield, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GuiaArtistaPage: React.FC = () => {
  const { setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'passos' | 'formatos' | 'glossario' | 'portfolio'>('passos');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Cabeçalho */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 border-b border-slate-200/80 dark:border-white/5 pb-8"
      >
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-mono uppercase">
          <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
          <span>Manual Prático para Artistas Independentes</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Guia do Artista
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Tudo o que você precisa saber para entender as regras dos editais culturais, organizar seus documentos e submeter projetos com segurança, mesmo sem equipe de produção profissional.
        </p>

        {/* Abas com design limpo */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {[
            { id: 'passos', label: 'Como Ler um Edital' },
            { id: 'formatos', label: 'PF, MEI, Empresa e Coletivo' },
            { id: 'glossario', label: 'Glossário Cultural' },
            { id: 'portfolio', label: 'Dicas de Portfólio' },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer focus-ring ${
                  isActive 
                    ? 'btn-primary' 
                    : 'btn-secondary'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Conteúdo Aba 1: Como Ler um Edital */}
      {activeTab === 'passos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bento-card space-y-2.5">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">ETAPA 1</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Objeto e Linhas de Fomento</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Descubra com exatidão o que o edital quer financiar: circulação musical, montagem cênica, publicação de livro ou oficinas didáticas. Seu projeto deve responder diretamente a esse objetivo central.
              </p>
            </div>

            <div className="bento-card space-y-2.5">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">ETAPA 2</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">2. Elegibilidade e Restrições</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Verifique se o edital exige CNPJ ou aceita Pessoa Física/Coletivo, além de comprovação de domicílio na cidade/estado há pelo menos 1 ou 2 anos. Uma restrição não observada desclassifica sumariamente.
              </p>
            </div>

            <div className="bento-card space-y-2.5">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">ETAPA 3</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">3. Critérios de Avaliação e Pesos</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Bancas examinadoras atribuem notas ponderadas (ex: 35% excelência artística, 35% viabilidade do cronograma, 30% contrapartida social). Dedique maior esforço de redação aos critérios com maior peso percentual.
              </p>
            </div>

            <div className="bento-card space-y-2.5">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">ETAPA 4</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">4. Prazos e Validade de Certidões</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Certidões negativas e comprovantes de endereço costumam ter validade de 30 a 90 dias. Use o <strong>Cofre de Documentos</strong> do Cultura em Cena para alertá-lo antes que qualquer item expire.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: Formatos Jurídicos */}
      {activeTab === 'formatos' && (
        <div className="space-y-4">
          <div className="bento-card space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">PF</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Pessoa Física (CPF Próprio)</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Ideal para artistas solo e criadores iniciantes. O valor recebido sofre retenção de Imposto de Renda na fonte conforme a tabela progressiva, mas dispensa custos de contador ou manutenção de CNPJ.
            </p>
          </div>

          <div className="bento-card space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-bold">MEI</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Microempreendedor Individual (MEI Cultural)</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Excelente para músicos, atores e produtores que emitem nota fiscal com tributação reduzida (Simples Nacional). Atenção ao teto anual de faturamento e às atividades culturais elegíveis no CNAE.
            </p>
          </div>

          <div className="bento-card space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 text-xs font-bold">Coletivo</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Coletivo Cultural sem CNPJ</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Muito aceito em editais de cidades paulistas e premiações comunitárias. Exige uma <strong>Carta de Representação</strong> assinada por todos os membros delegando poderes para um integrante receber e prestar contas.
            </p>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Glossário */}
      {activeTab === 'glossario' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bento-card">
            <h4 className="font-bold text-sm text-teal-600 dark:text-teal-400 mb-1">Contrapartida Social</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Ação gratuita de retorno à sociedade, como oficinas didáticas, ensaios abertos para estudantes ou ingressos para entidades assistenciais.
            </p>
          </div>

          <div className="bento-card">
            <h4 className="font-bold text-sm text-teal-600 dark:text-teal-400 mb-1">Dossiê e Clipping</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Conjunto de reportagens, cartazes de shows, links de vídeos e certificados comprovando a trajetória artística contínua nos anos anteriores.
            </p>
          </div>

          <div className="bento-card">
            <h4 className="font-bold text-sm text-teal-600 dark:text-teal-400 mb-1">Homologação de Resultado</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Publicação oficial em Diário Oficial tornando definitiva a lista de selecionados após a fase de recursos e julgamento das contestações.
            </p>
          </div>

          <div className="bento-card">
            <h4 className="font-bold text-sm text-teal-600 dark:text-teal-400 mb-1">CND (Certidão Negativa)</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Documentos que comprovam que o proponente não possui pendências fiscais federais, estaduais, municipais ou trabalhistas.
            </p>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Dicas de Portfólio */}
      {activeTab === 'portfolio' && (
        <div className="bento-card space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Como Estruturar um Portfólio Vencedor
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Ordem cronológica inversa:</strong> Apresente os trabalhos mais recentes e expressivos logo nas primeiras páginas.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Links funcionais e abertos:</strong> Vídeos e áudios devem estar no YouTube/Vimeo/Drive com acesso liberado (sem exigir login).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Fichas técnicas completas:</strong> Indique o papel exato do artista em cada projeto (ex: diretor musical, arranjador, ator principal).</span>
            </li>
          </ul>
        </div>
      )}

      {/* Ação Inferior */}
      <div className="flex justify-between items-center pt-6 border-t border-slate-200/80 dark:border-white/5">
        <button
          onClick={() => {
            setCurrentView('como_funciona');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="btn-secondary px-4 py-2 text-xs"
        >
          Ver Como Funciona a Plataforma
        </button>
        <button
          onClick={() => {
            setCurrentView('catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="btn-primary px-5 py-2 text-xs"
        >
          <span>Ir para o Catálogo de Editais</span>
          <ArrowRight className="w-3.5 h-3.5 inline ml-1.5" />
        </button>
      </div>

    </div>
  );
};
