import { VaultDocument, DocumentStatus, User, Application } from '../types';

function createDateOffset(days: number): string {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days, 12, 0, 0);
  return target.toISOString();
}

function createPastDateOffset(days: number): string {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days, 12, 0, 0);
  return target.toISOString();
}

/**
 * Avalia o status de um documento com base na data de validade atual
 * - Sem validade definida (null): 'em_dia'
 * - Vencido (< 0 dias): 'vencido'
 * - Vence em até 30 dias (>= 0 e <= 30 dias): 'vence_breve'
 * - Em dia (> 30 dias): 'em_dia'
 */
export function calculateDocumentStatus(expiryDate: string | null): DocumentStatus {
  if (!expiryDate) return 'em_dia';
  const now = Date.now();
  const exp = new Date(expiryDate).getTime();
  const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'vencido';
  if (diffDays <= 30) return 'vence_breve';
  return 'em_dia';
}

/**
 * Usuário padrão da demonstração acadêmica
 */
export const LUCAS_DEMO_USER: User = {
  id: 'user-lucas-demo',
  name: 'Lucas',
  email: 'lucas.musica@exemplo-demo.org',
  profileType: 'banda_grupo',
  city: 'Indaiatuba',
  artisticArea: 'Música',
  isDemo: true,
};

/**
 * Cofre inicial de documentos do Lucas:
 * 1. Em dia (+180 dias)
 * 2. Vence em 12 dias (+12 dias)
 * 3. Vencido (-15 dias)
 */
export function getDefaultLucasDocuments(): VaultDocument[] {
  return [
    {
      id: 'doc-lucas-1',
      name: 'Carta de Representação do Grupo e Responsável',
      category: 'juridico',
      fileType: 'PDF',
      fileSize: '1.2 MB',
      addedDate: createPastDateOffset(60),
      expiryDate: createDateOffset(180), // Em dia (> 30 dias)
      status: 'em_dia',
      notes: 'Assinada por todos os 4 integrantes com firma reconhecida digitalmente.',
    },
    {
      id: 'doc-lucas-2',
      name: 'Lista e Anuência dos Integrantes da Banda',
      category: 'juridico',
      fileType: 'PDF',
      fileSize: '840 KB',
      addedDate: createPastDateOffset(45),
      expiryDate: createDateOffset(12), // Vence em 12 dias (alerta amarelo)
      status: 'vence_breve',
      notes: 'Anuência semestral dos músicos com dados de contato e cachê.',
    },
    {
      id: 'doc-lucas-3',
      name: 'Comprovante de Residência e Sede do Grupo (Indaiatuba)',
      category: 'identificacao',
      fileType: 'PDF',
      fileSize: '620 KB',
      addedDate: createPastDateOffset(120),
      expiryDate: createPastDateOffset(15), // Vencido há 15 dias! (alerta vermelho)
      status: 'vencido',
      notes: 'Conta de consumo da sede de ensaio em Indaiatuba com prazo expirado de 90 dias.',
    },
  ];
}

/**
 * Aplicação inicial do Lucas para o Edital Principal:
 * "Edital de Circulação Musical Interior Paulista 2026"
 * 
 * Estado inicial do checklist:
 * - Conferir requisitos: Concluída (20%)
 * - Separar documentos: Pendente (0% - pois doc-lucas-3 está vencido!)
 * - Preparar portfólio: Concluída (20%)
 * - Elaborar projeto: Concluída (20%)
 * - Enviar inscrição: Pendente (0%)
 * Total: exatamente 60%!
 */
export function getDefaultLucasApplication(): Application {
  return {
    id: 'app-lucas-circulacao-musical',
    grantId: 'edital-circulacao-musical-sp',
    userId: 'user-lucas-demo',
    profileType: 'banda_grupo',
    status: 'em_preparacao',
    steps: [
      {
        id: 'requisitos',
        title: '1. Conferir requisitos',
        description: 'Revisão das regras de elegibilidade, restrições e adequação do perfil de banda/grupo.',
        isCompleted: true,
        isAutoCalculated: false,
        lastUpdated: createPastDateOffset(3),
      },
      {
        id: 'documentos',
        title: '2. Separar documentos',
        description: 'Conferência de todos os documentos obrigatórios do cofre (identificação, jurídicos e fiscais).',
        isCompleted: false, // Inicia pendente pelo doc vencido!
        isAutoCalculated: true,
      },
      {
        id: 'portfolio',
        title: '3. Preparar portfólio',
        description: 'Seleção de repertório autoral, links de gravações ao vivo e histórico de shows.',
        isCompleted: true,
        isAutoCalculated: false,
        lastUpdated: createPastDateOffset(2),
      },
      {
        id: 'projeto',
        title: '4. Elaborar projeto',
        description: 'Redação da justificativa, plano de circulação pelas cidades do interior e cronograma.',
        isCompleted: true,
        isAutoCalculated: false,
        lastUpdated: createPastDateOffset(1),
      },
      {
        id: 'envio',
        title: '5. Enviar inscrição',
        description: 'Revisão geral do pacote de inscrição e envio formal do dossiê para avaliação.',
        isCompleted: false,
        isAutoCalculated: false,
      },
    ],
    progressPercentage: 60, // Exatamente 60% inicial!
    updatedAt: new Date().toISOString(),
  };
}
