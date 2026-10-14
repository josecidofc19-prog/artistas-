import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, ShieldCheck, Sparkles, AlertCircle, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ArtistProfileType, ArtisticArea } from '../types';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    selectedProfile,
    registerSimulatedUser,
    loginAsLucas,
    showToast
  } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [profileType, setProfileType] = useState<ArtistProfileType>(selectedProfile);
  const [city, setCity] = useState('Indaiatuba');
  const [artisticArea, setArtisticArea] = useState<ArtisticArea>('Música');
  const [consent, setConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  // Sincroniza o perfil pré-selecionado na Home
  useEffect(() => {
    if (selectedProfile) {
      setProfileType(selectedProfile);
    }
  }, [selectedProfile]);

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRecoveryMode) {
      if (!email.includes('@')) {
        setErrorMsg('Informe um endereço de e-mail válido.');
        return;
      }
      setRecoverySent(true);
      showToast('Recuperação simulada', `Instruções de redefinição foram simuladas para ${email}.`, 'info');
      return;
    }

    if (authModalMode === 'login') {
      if (!email.trim() || !password.trim()) {
        setErrorMsg('Preencha seu e-mail e senha simulados.');
        return;
      }
      // Se for o login simulado simples, carrega Lucas ou cria sessão de demonstração
      loginAsLucas();
      return;
    }

    // Cadastro
    if (!name.trim()) {
      setErrorMsg('Por favor, informe seu nome ou nome artístico.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Informe um e-mail válido.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('A senha simulada deve ter no mínimo 6 caracteres.');
      return;
    }
    if (!consent) {
      setErrorMsg('É necessário concordar com os termos da demonstração acadêmica.');
      return;
    }

    registerSimulatedUser({
      name: name.trim(),
      email: email.trim(),
      profileType,
      city: city.trim(),
      artisticArea,
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white dark:bg-[#1C2647] text-[#1C2647] dark:text-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            setAuthModalOpen(false);
            setIsRecoveryMode(false);
            setRecoverySent(false);
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg focus-ring"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#25B2C5]">
              Acesso Acadêmico
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F2B705] text-[#1C2647]">
              100% Simulado
            </span>
          </div>

          <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight">
            {isRecoveryMode 
              ? 'Recuperar Senha' 
              : authModalMode === 'login' 
                ? 'Entrar na Plataforma' 
                : 'Criar Conta de Artista'}
          </h2>
          
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {isRecoveryMode
              ? 'Digite o e-mail cadastrado para simular a redefinição.'
              : authModalMode === 'login'
                ? 'Acesse seu painel com suas credenciais ou carregue a conta de demonstração.'
                : 'Seu perfil artístico será pré-configurado no checklist e no cofre.'}
          </p>
        </div>

        {/* Atalho de Demonstração Rápida */}
        {!isRecoveryMode && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#25B2C5]/10 border border-[#25B2C5]/30 flex items-center justify-between gap-3">
            <div className="text-xs">
              <p className="font-bold text-[#1C2647] dark:text-white flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#25B2C5]" />
                Atalho de Demonstração (Lucas)
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Pule o formulário e teste o checklist em 60% imediatamente.
              </p>
            </div>
            <button
              type="button"
              onClick={loginAsLucas}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#25B2C5] text-[#1C2647] hover:bg-[#1FA0B2] transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              Usar Lucas
            </button>
          </div>
        )}

        {/* Mensagem de Erro */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-[#D64545] text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Recuperação simulada concluída */}
        {recoverySent ? (
          <div className="space-y-4 py-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-[#2E9E63] mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1C2647] dark:text-white">
              E-mail de recuperação simulado!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
              Em um ambiente de produção, um link seguro seria enviado para {email}. Nesta simulação acadêmica, sua senha permanece válida.
            </p>
            <button
              onClick={() => {
                setIsRecoveryMode(false);
                setRecoverySent(false);
              }}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-[#25B2C5] text-[#1C2647]"
            >
              Voltar ao login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalMode === 'register' && !isRecoveryMode && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Nome Completo ou Nome Artístico *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Lucas Silva ou Banda Sinfonia Sonora"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1C2647] dark:text-white focus-ring"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Tipo de Artista *
                    </label>
                    <select
                      value={profileType}
                      onChange={e => setProfileType(e.target.value as ArtistProfileType)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1C2647] dark:text-white focus-ring"
                    >
                      <option value="artista_solo">Artista solo</option>
                      <option value="banda_grupo">Banda ou grupo</option>
                      <option value="coletivo_cultural">Coletivo cultural</option>
                      <option value="produtor_cultural">Produtor cultural</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Área Artística *
                    </label>
                    <select
                      value={artisticArea}
                      onChange={e => setArtisticArea(e.target.value as ArtisticArea)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1C2647] dark:text-white focus-ring"
                    >
                      <option value="Música">Música</option>
                      <option value="Teatro">Teatro</option>
                      <option value="Dança">Dança</option>
                      <option value="Artes Visuais">Artes Visuais</option>
                      <option value="Literatura">Literatura</option>
                      <option value="Audiovisual">Audiovisual</option>
                      <option value="Circo">Circo</option>
                      <option value="Patrimônio Cultural">Patrimônio Cultural</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Cidade / Município *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Indaiatuba, Campinas, São Paulo..."
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1C2647] dark:text-white focus-ring"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                E-mail *
              </label>
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1C2647] dark:text-white focus-ring"
              />
            </div>

            {!isRecoveryMode && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Senha Simulada *
                  </label>
                  {authModalMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setIsRecoveryMode(true)}
                      className="text-xs text-[#25B2C5] hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1C2647] dark:text-white focus-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {authModalMode === 'register' && !isRecoveryMode && (
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={e => setConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#25B2C5] focus-ring"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Compreendo que esta aplicação é um <strong>protótipo acadêmico para feira universitária</strong>. Nenhuma senha real ou dado sigiloso deve ser inserido.
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-bold rounded-lg bg-[#25B2C5] text-[#1C2647] hover:bg-[#1FA0B2] transition-colors focus-ring shadow-xs"
            >
              {isRecoveryMode 
                ? 'Enviar link de recuperação simulado' 
                : authModalMode === 'login' 
                  ? 'Entrar na Demonstração' 
                  : 'Concluir Cadastro e Ir para Preparação'}
            </button>
          </form>
        )}

        {/* Rodapé Alternador entre Login / Cadastro */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400">
          {isRecoveryMode ? (
            <button
              type="button"
              onClick={() => setIsRecoveryMode(false)}
              className="text-[#25B2C5] font-semibold hover:underline"
            >
              Voltar para o formulário de login
            </button>
          ) : authModalMode === 'login' ? (
            <span>
              Ainda não tem cadastro?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('register')}
                className="text-[#25B2C5] font-bold hover:underline"
              >
                Criar conta grátis
              </button>
            </span>
          ) : (
            <span>
              Já tem cadastro ou prefere o acesso demo?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('login')}
                className="text-[#25B2C5] font-bold hover:underline"
              >
                Fazer login
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
