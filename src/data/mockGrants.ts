import { Grant, ArtistProfileType } from '../types';

/**
 * Utilitário para gerar datas relativas precisas baseadas na data atual da execução.
 */
function getDateOffset(days: number): string {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days, 23, 59, 59);
  return target.toISOString();
}

function getPastDateOffset(days: number): string {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days, 18, 0, 0);
  return target.toISOString();
}

export const FICTITIOUS_NOTICE = "Aviso: Registro fictício concebido para fins de demonstração acadêmica e curricular. Não representa edital oficial de órgão público.";

/**
 * Exatamente 12 editais fictícios:
 * - 10 abertos (prazos entre 7 e 90 dias)
 * - 2 encerrados (-5 e -20 dias)
 * 
 * Atende às especificidades:
 * 1. Restrito a cidades <= 50 mil habitantes
 * 2. Exclusivos MEI/Empresa
 * 3. Abertos a Pessoa Física
 * 4. Que aceitam Coletivo sem CNPJ
 * 5. Pelo menos 2 de Música (o edital principal do Lucas é o edital-1)
 * 6. Pelo menos 1 de Teatro
 * 7. Pelo menos 1 de Artes Visuais
 * 8. Mistura de Esferas Municipal, Estadual e Federal
 */
export function getMockGrants(): Grant[] {
  return [
    // 1. EDITAL PRINCIPAL DO LUCAS (Música, Banda/Grupo, Estadual/SP, aceita Coletivo e MEI/PF) - Aberto (+28 dias)
    {
      id: 'edital-circulacao-musical-sp',
      title: 'Edital de Circulação Musical Interior Paulista 2026',
      issuingBody: 'Secretaria de Cultura, Economia e Indústria Criativas de SP (Simulado)',
      sphere: 'Estadual',
      state: 'SP',
      eligibleProfiles: ['banda_grupo', 'artista_solo', 'coletivo_cultural'],
      eligibleLegal: ['pf', 'mei', 'coletivo'],
      artisticArea: 'Música',
      grantValue: 45000,
      totalBudgetFormatted: 'R$ 1.800.000,00 total (40 grupos)',
      publishedDate: getPastDateOffset(25),
      deadlineDate: getDateOffset(28), // 28 dias à frente
      summary: 'Apoio a apresentações e circulação musical em municípios do interior e litoral de São Paulo para grupos autorais e instrumentais.',
      description: 'O Edital de Circulação Musical Paulista visa descentralizar a difusão sonora e contemplar bandas, grupos e duos com apresentações públicas gratuitas em centros comunitários, praças e teatros municipais.',
      objective: 'Fomentar 40 turnês e mini-temporadas no interior paulista com oficinas didáticas e registro audiovisual.',
      eligiblePublic: 'Bandas e grupos com histórico de atuação mínima de 1 ano comprovada no Estado de SP.',
      restrictions: [
        'Projetos já beneficiados integralmente por outros editais de circulação na mesma vigência.',
        'Membros da comissão organizadora ou servidores públicos do órgão emissor.',
      ],
      evaluationCriteria: [
        { title: 'Excelência artística e repertório', weight: 35, description: 'Coerência melódica, arranjos e originalidade composicional.' },
        { title: 'Plano de circulação e viabilidade', weight: 35, description: 'Logística, acessibilidade física e cronograma exequível.' },
        { title: 'Ações de formação e contrapartida', weight: 30, description: 'Oficina didática gratuita para estudantes e público local.' },
      ],
      requiredDocuments: [
        {
          id: 'doc-req-rep',
          name: 'Carta de Representação do Grupo e Responsável',
          category: 'juridico',
          mandatory: true,
          appliesToProfiles: ['banda_grupo'],
          description: 'Documento assinado por todos os integrantes delegando representação artística e administrativa.',
        },
        {
          id: 'doc-req-integrantes',
          name: 'Lista e Anuência dos Integrantes da Banda',
          category: 'juridico',
          mandatory: true,
          appliesToProfiles: ['banda_grupo'],
          description: 'Relação nominal com RG, CPF, instrumento e autorização formal de participação.',
        },
        {
          id: 'doc-req-residencia',
          name: 'Comprovante de Residência e Sede do Grupo (Indaiatuba)',
          category: 'identificacao',
          mandatory: true,
          appliesToProfiles: ['banda_grupo', 'artista_solo', 'coletivo_cultural', 'produtor_cultural'],
          description: 'Comprovante emitido nos últimos 90 dias atestando endereço no estado de SP.',
        },
        {
          id: 'doc-req-portfolio',
          name: 'Portfólio Artístico Consolidado',
          category: 'artistico',
          mandatory: false,
          appliesToProfiles: ['banda_grupo', 'artista_solo'],
          description: 'Histórico com clipping, fotos de apresentações anteriores e links de áudio/vídeo.',
        },
      ],
      officialUrl: null, // Propositalmente null: o botão mostrará mensagem informativa clara
      isFictitiousNotice: FICTITIOUS_NOTICE,
    },

    // 2. MUNICÍPIOS ATÉ 50 MIL HABITANTES (Restrição específica requerida) - Aberto (+45 dias)
    {
      id: 'edital-cidades-criativas-pequenas',
      title: 'Prêmio Cidades Criativas — Municípios até 50 mil hab.',
      issuingBody: 'Rede Nacional de Cidades Históricas e Criativas (Simulado)',
      sphere: 'Federal',
      state: 'Nacional',
      maxCityPopulation: 50000,
      eligibleProfiles: ['artista_solo', 'coletivo_cultural', 'banda_grupo'],
      eligibleLegal: ['pf', 'coletivo'],
      artisticArea: 'Patrimônio Cultural',
      grantValue: 30000,
      totalBudgetFormatted: 'R$ 900.000,00 total',
      publishedDate: getPastDateOffset(10),
      deadlineDate: getDateOffset(45), // 45 dias
      summary: 'Destinado exclusivamente a iniciativas culturais originadas em pequenas cidades brasileiras com até 50.000 habitantes.',
      description: 'Premiação direta para mestres populares, contadores de histórias e coletivos de pequenos municípios com foco na preservação das tradições orais e memória local.',
      objective: 'Fortalecer a permanência cultural e a juventude criativa em localidades rurais e pequenas comunas.',
      eligiblePublic: 'Artistas residentes e com atuação contínua comprovada em municípios com população de até 50 mil habitantes pelo Censo.',
      restrictions: [
        'Iniciativas sediadas em capitais ou cidades com mais de 50.000 habitantes.',
        'Empresas de grande porte.',
      ],
      evaluationCriteria: [
        { title: 'Impacto na comunidade de origem', weight: 40, description: 'Relevância para a preservação da identidade cultural local.' },
        { title: 'Trajetória do coletivo ou artista', weight: 35, description: 'Tempo e consistência de dedicação cultural.' },
        { title: 'Plano de compartilhamento comunitário', weight: 25, description: 'Retorno para escolas ou praças do município.' },
      ],
      requiredDocuments: [
        {
          id: 'doc-req-residencia-rural',
          name: 'Comprovante de Residência em Município Elegível',
          category: 'identificacao',
          mandatory: true,
          appliesToProfiles: ['artista_solo', 'coletivo_cultural', 'banda_grupo'],
          description: 'Certidão ou declaração atestando domicílio em cidade de até 50 mil moradores.',
        },
        {
          id: 'doc-req-atuacao-comunitaria',
          name: 'Comprovante de Atuação Cultural Local',
          category: 'artistico',
          mandatory: true,
          appliesToProfiles: ['artista_solo', 'coletivo_cultural', 'banda_grupo'],
          description: 'Reportagens locais, declarações de associações comunitárias ou fotografias datadas.',
        },
      ],
      officialUrl: null,
      isFictitiousNotice: FICTITIOUS_NOTICE,
    },

    // 3. EXCLUSIVO MEI OU EMPRESA (CNPJ) #1 - Aberto (+18 dias)
    {
      id: 'edital-producao-audiovisual-empresas',
      title: 'Fundo Setorial Audiovisual: Curtas-Metragens Independentes',
      issuingBody: 'Agência Nacional do Cinema e Inovação (Simulado)',
      sphere: 'Federal',
      state: 'Nacional',
      eligibleProfiles: ['produtor_cultural'],
      eligibleLegal: ['mei', 'empresa'],
      artisticArea: 'Audiovisual',
      grantValue: 120000,
      totalBudgetFormatted: 'R$ 3.600.000,00 total',
      publishedDate: getPastDateOffset(30),
      deadlineDate: getDateOffset(18), // 18 dias
      summary: 'Exclusivo para produtoras audiovisuais e MEIs registrados no segmento audiovisual para finalização de curtas de ficção e animação.',
      description: 'Financiamento para pós-produção, edição de som, color grading e acessibilidade comunicacional (Libras e audiodescrição).',
      objective: 'Possibilitar a conclusão técnica de filmes brasileiros inéditos para estreia em mostras nacionais e internacionais.',
      eligiblePublic: 'Pessoas jurídicas com CNAE audiovisual ativo há mais de 12 meses.',
      restrictions: [
        'Pessoas físicas e coletivos sem registro societário ou MEI.',
        'Projetos sem registro de roteiro na Biblioteca Nacional.',
      ],
      evaluationCriteria: [
        { title: 'Roteiro e proposta estética', weight: 40, description: 'Potência narrativa e domínio de linguagem.' },
        { title: 'Capacidade técnica da produtora', weight: 35, description: 'Currículo da equipe de pós-produção.' },
        { title: 'Plano de acessibilidade e distribuição', weight: 25, description: 'Estratégia de festivais e acessibilidade plena.' },
      ],
      requiredDocuments: [
        {
          id: 'doc-req-cnpj',
          name: 'Comprovante de CNPJ ou Certificado de MEI',
          category: 'juridico',
          mandatory: true,
          appliesToProfiles: ['produtor_cultural'],
          description: 'Documento cadastral ativo com CNAE de produção cultural ou audiovisual.',
        },
        {
          id: 'doc-req-cndt',
          name: 'Certidão Negativa de Débitos Trabalhistas (CNDT)',
          category: 'financeiro_fiscal',
          mandatory: true,
          appliesToProfiles: ['produtor_cultural'],
          description: 'Certidão emitida pelo TST dentro do prazo de validade.',
        },
        {
          id: 'doc-req-certidao-federal',
          name: 'Certidão Conjunta de Tributos Federais',
          category: 'financeiro_fiscal',
          mandatory: true,
          appliesToProfiles: ['produtor_cultural'],
          description: 'Certidão da Receita Federal e PGFN.',
        },
      ],
      officialUrl: null,
      isFictitiousNotice: FICTITIOUS_NOTICE,
    },

    // 4. EXCLUSIVO MEI OU EMPRESA (CNPJ) #2 - Aberto (+60 dias)
    {
      id: 'edital-infraestrutura-galpoes-culturais',
      title: 'Edital Modernização de Espaços Cênicos e Galpões Culturais',
      issuingBody: 'Secretaria Municipal de Cultura de Campinas (Simulado)',
      sphere: 'Municipal',
      city: 'Campinas',
      state: 'SP',
      eligibleProfiles: ['produtor_cultural'],
      eligibleLegal: ['mei', 'empresa'],
      artisticArea: 'Teatro',
      grantValue: 80000,
      totalBudgetFormatted: 'R$ 800.000,00 total',
      publishedDate: getPastDateOffset(15),
      deadlineDate: getDateOffset(60), // 60 dias
      summary: 'Destinado a espaços culturais geridos por microempresas ou MEI para reformas de acústica, iluminação cênica e acessibilidade.',
      description: 'Recurso específico para equipamentos teatrais, refletores LED, climatização de salas e melhorias para recepção de plateia PCD.',
      objective: 'Qualificar a infraestrutura técnica de espaços teatrais independentes da Região Metropolitana de Campinas.',
      eligiblePublic: 'Empresas culturais e MEIs com sede no município de Campinas com espaço físico aberto à comunidade há pelo menos 2 anos.',
      restrictions: [
        'Pessoas físicas sem personalidade jurídica.',
        'Espaços públicos geridos diretamente pela prefeitura.',
      ],
      evaluationCriteria: [
        { title: 'Relevância da modernização proposta', weight: 45, description: 'Ganho efetivo de segurança, acústica e acessibilidade.' },
        { title: 'Programação pública oferecida', weight: 35, description: 'Compromisso com sessões a preços populares e contrapartidas.' },
        { title: 'Orçamento detalhado e cotações', weight: 20, description: 'Rigor e precisão nos orçamentos técnicos.' },
      ],
      requiredDocuments: [
        {
          id: 'doc-req-cnpj-campinas',
          name: 'Comprovante de Inscrição e CNPJ Municipal',
          category: 'juridico',
          mandatory: true,
          appliesToProfiles: ['produtor_cultural'],
          description: 'Comprovante da sede com alvará ou contrato de locação do espaço cênico.',
        },
        {
          id: 'doc-req-fgts',
          name: 'Certificado de Regularidade do FGTS',
          category: 'financeiro_fiscal',
          mandatory: true,
          appliesToProfiles: ['produtor_cultural'],
          description: 'CRF Caixa Econômica Federal em dia.',
        },
      ],
      officialUrl: null,
      isFictitiousNotice: FICTITIOUS_NOTICE,
    },

    // 5. TEATRO — Aberto (+35 dias, aceita Coletivos sem CNPJ e PF)
    {
      id: 'edital-teatro-montagens-independentes',
      title: 'Prêmio Nelson Rodrigues de Montagens Teatrais Contemporâneas',
      issuingBody: 'Fundação Nacional das Artes Cênicas (Simulado)',
      sphere: 'Federal',
      state: 'Nacional',
      eligibleProfiles: ['banda_grupo', 'coletivo_cultural', 'artista_solo'],
      eligibleLegal: ['pf', 'coletivo'],
      artisticArea: 'Teatro',
      grantValue: 55000,
      totalBudgetFormatted: 'R$ 1.100.000,00 total',
      publishedDate: getPastDateOffset(20),
      deadlineDate: getDateOffset(35), // 35 dias
      summary: 'Estímulo à pesquisa cênica, dramaturgia autoral e temporadas teatrais populares para grupos e coletivos independentes.',
      description: 'Apoio à produção, cenografia, figurino e estreia de espetáculos inéditos ou remontagens que debatam a cena brasileira contemporânea.',
      objective: 'Garantir a subsistência de atores e diretores independentes durante a etapa de ensaios e temporada de estreia.',
      eligiblePublic: 'Coletivos cênicos com ou sem CNPJ e artistas solos representados por pessoa física.',
      restrictions: [
        'Obras comerciais com ingressos com valores acima do teto social definido no regulamento.',
      ],
      evaluationCriteria: [
        { title: 'Conceito de encenação e dramaturgia', weight: 40, description: 'Originalidade na abordagem textual e corpo cênico.' },
        { title: 'Histórico artístico do elenco', weight: 30, description: 'Experiência prévia em montagens independentes.' },
        { title: 'Plano de acessibilidade de plateia', weight: 30, description: 'Sessões com interpretação em Libras e debate aberto.' },
      ],
      requiredDocuments: [
        {
          id: 'doc-req-carta-coletivo',
          name: 'Carta de Apresentação e Histórico do Coletivo',
          category: 'juridico',
          mandatory: true,
          appliesToProfiles: ['coletivo_cultural', 'banda_grupo'],
          description: 'Documento assinado com a trajetória cênica e divisão de funções da equipe.',
        },
        {
          id: 'doc-req-direitos-autorais',
          name: 'Autorização de Texto / Direitos Autorais ou Declaração de Domínio Público',
          category: 'artistico',
          mandatory: true,
          appliesToProfiles: ['coletivo_cultural', 'banda_grupo', 'artista_solo'],
          description: 'Autorização do autor ou comprovação de texto autoral ou em domínio público.',
        },
      ],
      officialUrl: null,
      isFictitiousNotice: FICTITIOUS_NOTICE,
    },

    // 6. ARTES VISUAIS — Aberto (+14 dias, Pessoa Física)
    {
      id: 'edital-artes-visuais-residencia',
      title: 'Bolsa de Residência e Pesquisa em Artes Visuais 2026',
      issuingBody: 'Museu de Arte e Cultura Contemporânea do Interior (Simulado)',
      sphere: 'Estadual',
      state: 'SP',
      eligibleProfiles: ['artista_solo'],
      eligibleLegal: ['pf'],
      artisticArea: 'Artes Visuais',
      grantValue: 25000,
      totalBudgetFormatted: 'R$ 250.000,00 total (10 bolsas)',
      publishedDate: getPastDateOffset(18),
      deadlineDate: getDateOffset(14), // 14 dias
      summary: 'Bolsa individual de pesquisa poética para artistas visuais, gravuristas, fotógrafos e escultores com exposição coletiva final.',
      description: 'O programa oferece 3 meses de acompanhamento curatorial, verba de produção para compra de materiais e montagem de ateliê aberto.',
      objective: 'Viabilizar a produção material de novas séries artísticas por criadores emergentes do estado.',
      eligiblePublic: 'Artistas visuais maiores de 18 anos inscritos como pessoa física (CPF próprio).',
      restrictions: [
        'Inscrição por pessoa jurídica ou múltiplos autores em projeto individual.',
        'Estudantes de graduação com dedicação exclusiva em bolsa FAPESP/CNPq.',
      ],
      evaluationCriteria: [
        { title: 'Coerência da pesquisa poética', weight: 45, description: 'Rigor investigativo do projeto visual e materiais previstos.' },
        { title: 'Portfólio e trajetória', weight: 35, description: 'Qualidade das séries anteriores e consistência.' },
        { title: 'Memorial descritivo da exposição', weight: 20, description: 'Viabilidade de instalação no espaço físico do museu.' },
      ],
      requiredDocuments: [
        {
          id: 'doc-req-cpf-rg',
          name: 'Documento de Identificação Oficial com CPF',
          category: 'identificacao',
          mandatory: true,
          appliesToProfiles: ['artista_solo'],
          description: 'RG, CNH ou Passaporte digitalizado.',
        },
        {
          id: 'doc-req-portfolio-visual',
          name: 'Portfólio de Obras e Séries Visuais',
          category: 'artistico',
          mandatory: true,
          appliesToProfiles: ['artista_solo'],
          description: 'Documento PDF com até 15 imagens de obras catalogadas e ficha técnica.',
        },
      ],
      officialUrl: null,
      isFictitiousNotice: FICTITIOUS_NOTICE,
    },

    // 7. MÚSICA #2 — Aberto (+75 dias, Coletivos sem CNPJ e PF)
    {
      id: 'edital-orquestras-coros-comunitarios',
      title: 'Circuito de Música Instrumental, Fanfarras e Corais da Comunidade',
      issuingBody: 'Secretaria de Cultura e Juventude de Indaiatuba (Simulado)',
      sphere: 'Municipal',
      city: 'Indaiatuba',
      state: 'SP',
      eligibleProfiles: ['banda_grupo', 'coletivo_cultural'],
      eligibleLegal: ['pf', 'coletivo'],
      artisticArea: 'Música',
      grantValue: 35000,
      totalBudgetFormatted: 'R$ 280.000,00 total',
      publishedDate: getPastDateOffset(5),
      deadlineDate: getDateOffset(75), // 75 dias
      summary: 'Apoio a fanfarras juvenis, conjuntos instrumentais e corais populares da comarca de Indaiatuba e bacia do Capivari.',
      description: 'Subsídio para aquisição de palhetas, cordas, partituras e realização de concertos didáticos nas praças dos bairros.',
      objective: 'Preservar a rica tradição musical e filarmônica do interior, incentivando novos músicos em fase de aprendizado.',
      eligiblePublic: 'Grupos musicais com pelo menos 5 integrantes residentes na cidade ou região imediata.',
      restrictions: [
        'Projetos com cobrança de ingressos.',
      ],
      evaluationCriteria: [
        { title: 'Caráter comunitário e pedagógico', weight: 40, description: 'Inserção comunitária e oportunidade para jovens instrumentistas.' },
        { title: 'Qualidade do plano de ensaios e concertos', weight: 35, description: 'Locais acessíveis e repertório didático.' },
        { title: 'Relação de custos com instrumentos e insumos', weight: 25, description: 'Economicidade e transparência nos gastos.' },
      ],
      requiredDocuments: [
        {
          id: 'doc-req-membros-indaiatuba',
          name: 'Lista de Músicos Integrantes e Comprovantes Locais',
          category: 'identificacao',
          mandatory: true,
          appliesToProfiles: ['banda_grupo', 'coletivo_cultural'],
          description: 'Relação dos músicos participantes comprovando residência local.',
        },
      ],
      officialUrl: null,
      isFictitiousNotice: FICTITIOUS_NOTICE,
    },

    // 8. DANÇA — Aberto (+21 dias, Pessoa Física)
    {
      id: 'edital-danca-corpo-e-territorio',
      title: 'Prêmio Dança: Territórios e Movimento Urbano',
      issuingBody: 'Departamento de Ação Cultural e Cidadania (Simulado)',
      sphere: 'Estadual',
      state: 'SP',
      eligibleProfiles: ['artista_solo', 'coletivo_cultural'],
      eligibleLegal: ['pf', 'coletivo'],
      artisticArea: 'Dança',
      grantValue: 28000,
      totalBudgetFormatted: 'R$ 420.000,00 total',
      publishedDate: getPastDateOffset(12),
      deadlineDate: getDateOffset(21), // 21 dias
      summary: 'Estímulo a solos de dança contemporânea, danças urbanas (breaking, hip-hop) e expressões afro-brasileiras.',
      description: 'Financiamento para desenvolvimento de coreografias com apresentação em espaços abertos, pistas de skate e centros culturais.',
      objective: 'Fortalecer a cena das danças periféricas e a pesquisa de movimento autoral no estado.',
      eligiblePublic: 'Dançarinos e coreógrafos independentes atuantes há mais de 2 anos.',
      restrictions: ['Eventos de competição com premiação em dinheiro oriunda dos recursos do projeto.'],
      evaluationCriteria: [
        { title: 'Expressividade coreográfica e pesquisa corporal', weight: 40, description: 'Inovação nos movimentos e diálogo com o espaço público.' },
        { title: 'Acessibilidade estética e conexão comunitária', weight: 35, description: 'Capacidade de envolver o público de rua.' },
        { title: 'Cronograma e plano de ensaios', weight: 25, description: 'Planejamento de produção e segurança física dos dançarinos.' },
      ],
      requiredDocuments: [
        {
          id: 'doc-req-video-danca',
          name: 'Link de Registro em Vídeo de Ensaios ou Apresentações',
          category: 'artistico',
          mandatory: true,
          appliesToProfiles: ['artista_solo', 'coletivo_cultural'],
          description: 'Link permanente para gravação em vídeo sem cortes evidenciando técnica.',
        },
      ],
      officialUrl: null,
      isFictitiousNotice: FICTITIOUS_NOTICE,
    },

    // 9. LITERATURA — Aberto (+7 dias, Pessoa Física, URGENTE)
    {
      id: 'edital-literatura-publicacoes-independentes',
      title: 'Bolsa Criação Literária e Zines: Vozes do Interior',
      issuingBody: 'Secretaria Municipal de Cultura e Turismo (Simulado)',
      sphere: 'Municipal',
      city: 'Indaiatuba',
      state: 'SP',
      eligibleProfiles: ['artista_solo'],
      eligibleLegal: ['pf'],
      artisticArea: 'Literatura',
      grantValue: 15000,
      totalBudgetFormatted: 'R$ 150.000,00 total (10 autores)',
      publishedDate: getPastDateOffset(23),
      deadlineDate: getDateOffset(7), // 7 dias (o mais próximo aberto)
      summary: 'Publicação impressa de contos, poesia, dramaturgia e cordel por autores estreantes e independentes.',
      description: 'Concessão de bolsa para tiragem mínima de 300 exemplares com distribuição gratuita em bibliotecas públicas da rede municipal.',
      objective: 'Incentivar novos escritores e ampliar o acervo de literatura autoral contemporânea.',
      eligiblePublic: 'Escritores residentes em Indaiatuba inscritos como pessoa física.',
      restrictions: ['Obras já editadas por editoras comerciais com ISBN anterior.'],
      evaluationCriteria: [
        { title: 'Originalidade estilística e literária', weight: 50, description: 'Qualidade do texto poético ou narrativo.' },
        { title: 'Plano de distribuição em bibliotecas e escolas', weight: 30, description: 'Compromisso com o acesso público aos exemplares.' },
        { title: 'Memorial descritivo da publicação', weight: 20, description: 'Especificações gráficas e formato do livro.' },
      ],
      requiredDocuments: [
        {
          id: 'doc-req-manuscrito',
          name: 'Amostra de Manuscrito Inédito (PDF)',
          category: 'artistico',
          mandatory: true,
          appliesToProfiles: ['artista_solo'],
          description: 'Trecho representativo de 10 a 20 páginas da obra a ser impressa.',
        },
      ],
      officialUrl: null,
      isFictitiousNotice: FICTITIOUS_NOTICE,
    },

    // 10. CIRCO — Aberto (+88 dias, Coletivos sem CNPJ)
    {
      id: 'edital-circo-itinerante-lonas',
      title: 'Fomento à Arte Circense e Trupes Itinerantes',
      issuingBody: 'Ministério da Cultura e Secretaria de Artes Tradicionais (Simulado)',
      sphere: 'Federal',
      state: 'Nacional',
      eligibleProfiles: ['coletivo_cultural', 'banda_grupo'],
      eligibleLegal: ['pf', 'coletivo', 'mei'],
      artisticArea: 'Circo',
      grantValue: 65000,
      totalBudgetFormatted: 'R$ 1.950.000,00 total',
      publishedDate: getPastDateOffset(1),
      deadlineDate: getDateOffset(88), // 88 dias
      summary: 'Apoio a trupes de palhaçaria, malabares, acrobacia e manutenção de lonas circenses itinerantes.',
      description: 'Recurso para compra de aparelhos de segurança, lona antichamas, som móvel e realização de festivais comunitários de circo.',
      objective: 'Preservar a tradição de famílias e trupes circenses que levam entretenimento popular aos quatro cantos do país.',
      eligiblePublic: 'Trupes familiares e coletivos circenses com itinerância comprovada.',
      restrictions: ['Projetos sem profissional responsável pela segurança de aparelhos de altura.'],
      evaluationCriteria: [
        { title: 'Medidas de segurança cênica e técnica', weight: 35, description: 'Atestados de segurança de aparelhos e rigging.' },
        { title: 'Valor comunitário das apresentações', weight: 35, description: 'Espetáculos gratuitos e abertos a crianças e famílias.' },
        { title: 'Tradição e histórico da trupe', weight: 30, description: 'Anos de atuação e preservação da linguagem circense.' },
      ],
      requiredDocuments: [
        {
          id: 'doc-req-circo-seguranca',
          name: 'Laudo ou Declaração de Segurança dos Aparelhos',
          category: 'juridico',
          mandatory: true,
          appliesToProfiles: ['coletivo_cultural', 'banda_grupo'],
          description: 'Declaração formal assinada atestando inspeção periódica de cabos e mastros.',
        },
      ],
      officialUrl: null,
      isFictitiousNotice: FICTITIOUS_NOTICE,
    },

    // 11. ENCERRADO #1 — Vencido há exatamente 5 dias
    {
      id: 'edital-encerrado-microprojetos-musica',
      title: 'Microprojetos Sonoros: Gravando o Primeiro Single',
      issuingBody: 'Secretaria de Cultura do Interior (Simulado)',
      sphere: 'Estadual',
      state: 'SP',
      eligibleProfiles: ['banda_grupo', 'artista_solo'],
      eligibleLegal: ['pf', 'mei'],
      artisticArea: 'Música',
      grantValue: 12000,
      totalBudgetFormatted: 'R$ 240.000,00 total',
      publishedDate: getPastDateOffset(45),
      deadlineDate: getPastDateOffset(5), // Encerrado há 5 dias
      summary: 'Edital de apoio a horas de estúdio para gravação, mixagem e masterização de fonograma de estreia.',
      description: 'Financiamento emergencial para músicos sem gravação profissional lançarem sua primeira faixa em serviços de streaming.',
      objective: 'Propiciar a primeira experiência em estúdio fonográfico de alta fidelidade com produtor profissional.',
      eligiblePublic: 'Músicos com menos de 3 faixas lançadas comercialmente.',
      restrictions: ['Artistas que já possuam contrato fonográfico ativo com gravadoras multinacionais.'],
      evaluationCriteria: [
        { title: 'Potencial criativo da canção demo', weight: 50, description: 'Letra, melodia e mensagem da obra musical.' },
        { title: 'Plano de estúdio e equipe técnica', weight: 50, description: 'Relação do estúdio escolhido e proposta de arranjo.' },
      ],
      requiredDocuments: [
        {
          id: 'doc-req-demo',
          name: 'Gravação Demo em Celular ou MP3',
          category: 'artistico',
          mandatory: true,
          appliesToProfiles: ['banda_grupo', 'artista_solo'],
          description: 'Áudio simples gravado em ensaio ou voz e violão.',
        },
      ],
      officialUrl: null,
      isFictitiousNotice: FICTITIOUS_NOTICE,
    },

    // 12. ENCERRADO #2 — Vencido há exatamente 20 dias
    {
      id: 'edital-encerrado-pesquisa-patrimonio',
      title: 'Mapeamento das Raízes Caipiras e Tradições Fluviais',
      issuingBody: 'Instituto do Patrimônio Histórico e Paisagístico (Simulado)',
      sphere: 'Federal',
      state: 'SP',
      eligibleProfiles: ['coletivo_cultural', 'produtor_cultural'],
      eligibleLegal: ['coletivo', 'empresa'],
      artisticArea: 'Patrimônio Cultural',
      grantValue: 50000,
      totalBudgetFormatted: 'R$ 500.000,00 total',
      publishedDate: getPastDateOffset(60),
      deadlineDate: getPastDateOffset(20), // Encerrado há 20 dias
      summary: 'Inventário participativo das festas religiosas, folias de reis e saberes culinários do Médio Tietê.',
      description: 'Registro etnográfico em vídeo e fotografia com depoimentos de mestres artesãos e cozinheiras tradicionais.',
      objective: 'Publicar cartilha educativa e banco digital de registros orais em acesso livre.',
      eligiblePublic: 'Pesquisadores comunitários e coletivos de patrimônio imaterial.',
      restrictions: ['Trabalhos acadêmicos que não prevejam devolução direta das informações às comunidades ouvidas.'],
      evaluationCriteria: [
        { title: 'Metodologia de escuta comunitária', weight: 45, description: 'Ética na pesquisa com idosos e comunidades tradicionais.' },
        { title: 'Plano de arquivamento digital', weight: 35, description: 'Acesso público e gratuito às gravações.' },
        { title: 'Equipe multidisciplinar', weight: 20, description: 'Presença de moradores locais na equipe de campo.' },
      ],
      requiredDocuments: [
        {
          id: 'doc-req-anuencia-comunidade',
          name: 'Termo de Consentimento das Comunidades Mapeadas',
          category: 'juridico',
          mandatory: true,
          appliesToProfiles: ['coletivo_cultural', 'produtor_cultural'],
          description: 'Anuência prévia dos líderes comunitários.',
        },
      ],
      officialUrl: null,
      isFictitiousNotice: FICTITIOUS_NOTICE,
    },
  ];
}

/**
 * Helper para verificar o status e dias restantes de um edital
 */
export function getGrantDeadlineInfo(deadlineDateStr: string) {
  const deadline = new Date(deadlineDateStr).getTime();
  const now = Date.now();
  const diffMs = deadline - now;
  const daysDiff = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const isClosed = daysDiff < 0;
  return {
    isClosed,
    daysRemaining: isClosed ? Math.abs(daysDiff) : daysDiff,
    label: isClosed 
      ? `Encerrado há ${Math.abs(daysDiff)} dias` 
      : daysDiff === 0 
        ? 'Encerra hoje' 
        : `Encerra em ${daysDiff} dias`,
  };
}
