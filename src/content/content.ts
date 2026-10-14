/**
 * Todo o conteúdo do site mora aqui. Os componentes só leem deste arquivo.
 *
 * Fonte: o vault do meu currículo e o vault de análise da Agenda
 * (github.com/LuizKirsch/agenda-eletrecista-obsidian).
 *
 * Para adicionar um projeto: acrescente um objeto em `projects`. O nó no canvas,
 * a aresta do cluster, a rota /projetos/:slug e o item da versão semântica
 * são derivados daqui (ver src/diagram/model.ts).
 *
 * O que falta está marcado com TODO em comentário; a seção correspondente
 * não aparece no painel.
 */

export type Link = { label: string; href: string }

export type Camada = 'back' | 'front' | 'dados' | 'infra' | 'testes'

/** Colunas do frame de stack no canvas, nesta ordem. */
export const camadas: { id: Camada; label: string }[] = [
  { id: 'back', label: 'back' },
  { id: 'front', label: 'front' },
  { id: 'dados', label: 'dados' },
  { id: 'infra', label: 'infra/IA' },
  { id: 'testes', label: 'testes' },
]

/**
 * Tecnologias que aparecem nos projetos e nas experiências. A chave é o id
 * (vira a rota /stack/:id), então referência a um id que não existe não compila.
 * `porque`: por que eu escolho a tecnologia; sem texto, a seção não aparece.
 */
const techData = {
  php: { nome: 'PHP', camada: 'back' },
  laravel: { nome: 'Laravel', camada: 'back' },
  'stancl-tenancy': { nome: 'stancl/tenancy', camada: 'back' },
  nodejs: { nome: 'Node.js', camada: 'back' },
  express: { nome: 'Express', camada: 'back' },
  python: { nome: 'Python', camada: 'back' },
  fastapi: { nome: 'FastAPI', camada: 'back' },
  react: { nome: 'React', camada: 'front' },
  nextjs: { nome: 'Next.js', camada: 'front' },
  vite: { nome: 'Vite', camada: 'front' },
  livewire: { nome: 'Livewire', camada: 'front' },
  typescript: { nome: 'TypeScript', camada: 'front' },
  'react-flow': { nome: 'React Flow', camada: 'front' },
  'react-router': { nome: 'React Router', camada: 'front' },
  motion: { nome: 'Motion', camada: 'front' },
  mysql: { nome: 'MySQL', camada: 'dados' },
  sequelize: { nome: 'Sequelize', camada: 'dados' },
  chromadb: { nome: 'ChromaDB', camada: 'dados' },
  docker: { nome: 'Docker', camada: 'infra' },
  'cloud-run': { nome: 'Cloud Run', camada: 'infra' },
  langchain: { nome: 'LangChain', camada: 'infra' },
  'openai-api': { nome: 'OpenAI API', camada: 'infra' },
  'github-actions': { nome: 'GitHub Actions', camada: 'infra' },
  'github-pages': { nome: 'GitHub Pages', camada: 'infra' },
  cypress: { nome: 'Cypress', camada: 'testes' },
  selenium: { nome: 'Selenium', camada: 'testes' },
  codeceptjs: { nome: 'CodeceptJS', camada: 'testes' },
  vitest: { nome: 'Vitest', camada: 'testes' },
  'testing-library': { nome: 'Testing Library', camada: 'testes' },
  playwright: { nome: 'Playwright', camada: 'testes' },
  eslint: { nome: 'ESLint', camada: 'testes' },
} satisfies Record<string, { nome: string; camada: Camada; porque?: string }>

export type TechId = keyof typeof techData
export type Tech = { id: TechId; nome: string; camada: Camada; porque?: string }
export const techs: Tech[] = Object.entries(techData).map(([id, t]) => ({ id: id as TechId, ...t }))

/** Onde usei: trabalho (linha cheia no canvas), pessoal ou voluntário (tracejada). */
export type Contexto = 'trabalho' | 'pessoal' | 'voluntario'

/** Tecnologia de um projeto/experiência. `nota`: descrição curta do uso, opcional. */
export type StackRef = TechId | { tech: TechId; nota: string }

/**
 * Diagrama pequeno dentro do painel de projeto. As posições são uma grade
 * (col/row) em vez de pixels: é mais fácil de escrever à mão e o MiniDiagram
 * converte para coordenadas.
 */
export type ProjectDiagram = {
  caption: string
  nodes: { id: string; label: string; col: number; row: number; kind?: 'box' | 'database' }[]
  edges: { from: string; to: string; label?: string }[]
}

export type Project = {
  slug: string
  title: string
  summary: string
  diagrams: ProjectDiagram[]
  // Seções do estudo de caso. Lista vazia = seção não aparece.
  problem: string[]
  decisions: string[]
  role: string[]
  result: string[]
  stack: StackRef[]
  contexto: Contexto
  links: Link[]
  /** Prints do projeto, em /public/img (fora de /projetos, que são rotas). */
  images?: { src: string; alt: string }[]
}

export type Experience = {
  id: string
  /** Rótulo curto que aparece na fila do canvas. */
  label: string
  title: string
  org: string
  place: string
  period: string
  /** Uma ou duas frases sobre o dia a dia no cargo. */
  summary: string
  /** Problemas reais em que trabalhei. Sem números e sem nomes internos. */
  highlights: string[]
  stack: StackRef[]
  contexto: Contexto
}

export type Education = { course: string; school: string; period: string }

/** Uma parada do tour. `nodeId` precisa existir em src/diagram/model.ts. */
export type TourStep = {
  nodeId: string
  text: string
  /** Painel que a parada abre. */
  route?: string
  /** Tempo fixo. Sem ele, o tempo vem do tamanho do texto. */
  ms?: number
}

export const profile = {
  name: 'Luiz Kirsch',
  role: 'Desenvolvedor Fullstack Pleno',
  company: 'Fraga & Bitello',
  location: 'Campo Bom, RS',
  // Mesma ordem da headline do LinkedIn.
  stack: ['Node.js', 'React', 'Laravel'],
  tagline: 'Antes de implementar algo novo, costumo modelar os dados e documentar o fluxo.',
  github: 'https://github.com/LuizKirsch',
  linkedin: 'https://linkedin.com/in/luiz-kirsch',
  email: 'luizhkirch@gmail.com',
  cv: '/curriculo.pdf',
}

const repo = 'https://github.com/LuizKirsch/portfolio'

/**
 * Nó GET /health: o status do CI vem do badge oficial do workflow (uma imagem
 * SVG servida pelo GitHub), sem chamar API. `checks` é o que o ci.yml roda.
 */
export const health = {
  actions: `${repo}/actions`,
  badge: `${repo}/actions/workflows/ci.yml/badge.svg`,
  checks: ['e2e · Playwright', 'unit · Vitest', 'lint · ESLint', 'typecheck · tsc'],
}

/** Post-its à esquerda do visitante: como usar o quadro, um assunto por cor. */
export const howTo: {
  id: string
  tone: 'yellow' | 'blue' | 'green'
  title: string
  text: string
}[] = [
  {
    id: 'como-funciona',
    tone: 'yellow',
    title: 'Como funciona',
    text: 'Este quadro é um diagrama de system design. Você é o visitante fazendo GET /luiz.',
  },
  {
    id: 'como-navegar',
    tone: 'blue',
    title: 'Navegar',
    text: 'Arraste para mover. Para dar zoom, use a roda do mouse ou faça pinça no celular. Clique ou toque numa caixa para abrir os detalhes.',
  },
  {
    id: 'como-tour',
    tone: 'green',
    title: 'Prefere ser guiado?',
    text: 'Clique em ▶ seguir a request, lá em cima. A request passa por cada serviço e abre os painéis, um de cada vez. Dá para pausar, voltar ou pular.',
  },
]

/** Versão curta para o post-it do canvas. O painel /sobre usa `about`. */
export const aboutNote =
  'Comecei como QA no fim de 2022. Cinco meses depois fui para o desenvolvimento. Hoje sou Pleno num ERP de consórcios.'

// "Sobre" do LinkedIn, versão final de 2026-10-07.
export const about: string[] = [
  'Sou desenvolvedor Fullstack Pleno na Fraga & Bitello. Trabalho num ERP para o setor de consórcios, feito em PHP com Laravel e Livewire. Antes de implementar algo novo, costumo modelar os dados e documentar o fluxo.',
  'Comecei em TI no fim de 2022, como QA na Testing Company, automatizando testes web e mobile com Cypress, Selenium e CodeceptJS. Cinco meses depois fui para o time de desenvolvimento, onde participei da migração de um sistema em PHP puro para Laravel com multitenancy.',
  'Entrei na Fraga & Bitello como júnior no fim de 2024 e virei Pleno em setembro de 2026. Além de trabalhar no ERP com o time, criei ferramentas internas em Python, como o Oráculo, que usa RAG para responder perguntas sobre os PDFs das administradoras.',
  'Agora quero trabalhar mais com Node.js e React. É a stack que tenho usado nos projetos pessoais, como a Agenda Eletricista.',
]

export const education: Education[] = [
  {
    course: 'Análise e Desenvolvimento de Sistemas',
    school: 'IENH',
    period: 'jul/2023 – jul/2027 (previsão)',
  },
  { course: 'Técnico em Informática', school: 'IENH', period: '2018 – 2019' },
]

// Ordem cronológica: é a ordem da fila no canvas.
// Textos: "03 Experiências" do vault (formato do LinkedIn). Santander fica só no LinkedIn.
export const experiences: Experience[] = [
  {
    id: 'qa',
    label: 'QA',
    title: 'Quality Assurance',
    org: 'Testing Company',
    place: 'Novo Hamburgo, RS',
    period: 'dez/2022 – abr/2023',
    summary: 'Testes de aplicações web e mobile.',
    highlights: [
      'Fiz testes exploratórios em aplicações web e mobile.',
      'Automatizei testes com Cypress, Selenium e CodeceptJS.',
      'Depois de cinco meses, passei para o time de desenvolvimento.',
    ],
    stack: ['cypress', 'selenium', 'codeceptjs'],
    contexto: 'trabalho',
  },
  {
    id: 'dev',
    label: 'Dev Fullstack Jr',
    title: 'Desenvolvedor Fullstack Júnior',
    org: 'Testing Company',
    place: 'Novo Hamburgo, RS · híbrido',
    period: 'abr/2023 – nov/2024',
    summary: 'Sistema multitenancy em PHP e Laravel, onde trabalhei no front-end e no back-end.',
    highlights: [
      'Trabalhei na refatoração de um sistema em PHP puro para Laravel com multitenancy. O objetivo era acabar com a manutenção de um ambiente separado para cada cliente.',
      'Modelei o banco e criei as migrations das funcionalidades novas.',
      'Ajudei a estimar e quebrar tarefas nas cerimônias de Scrum e Kanban.',
    ],
    stack: ['php', 'laravel', 'mysql'],
    contexto: 'trabalho',
  },
  {
    id: 'fb-junior',
    label: 'Dev Fullstack Jr',
    title: 'Desenvolvedor Fullstack Júnior',
    org: 'Fraga & Bitello',
    place: 'São Leopoldo, RS · híbrido',
    period: 'nov/2024 – ago/2026',
    summary:
      'Desenvolvimento fullstack com Laravel e Livewire num ERP para o setor de consórcios e criação de ferramentas internas em Python.',
    highlights: [
      'Desenvolvi automações em Python e Selenium para processos operacionais. Elas tiraram da equipe boa parte do trabalho manual da semana, e a equipe passou a só conferir os resultados.',
      'Migrei processamentos em lote para jobs e filas. As operações demoradas passaram a rodar em segundo plano, sem travar a aplicação.',
      'Criei o Oráculo, uma prova de conceito de assistente que responde perguntas sobre PDFs de administradoras de consórcio usando RAG.',
    ],
    stack: ['laravel', 'livewire', 'php', 'python', 'selenium'],
    contexto: 'trabalho',
  },
  {
    id: 'fb-pleno',
    label: 'Dev Fullstack Pleno',
    title: 'Desenvolvedor Fullstack Pleno',
    org: 'Fraga & Bitello',
    place: 'São Leopoldo, RS · híbrido',
    period: 'set/2026 – hoje',
    summary:
      'Faço parte do time que desenvolve um ERP para o setor de consórcios, com Laravel e Livewire. Além de entregar funcionalidades, investigo incidentes em produção e reorganizo módulos para que fiquem mais fáceis de manter.',
    highlights: [
      'O sistema estava trocando a estrutura antiga de dados de clientes por uma nova, que permitia reaproveitar cadastros. A primeira versão dessa estrutura tinha sido feita às pressas e começou a dar problema. Mapeei como ela funcionava, avaliei o que valia manter e implementei uma segunda versão, com a estrutura corrigida.',
      'Separei o cadastro principal do cliente dos dados de cada negociação, para que uma negociação não sobrescreva a outra.',
      'No módulo administrativo, toda a lógica ficava nos controllers e os filtros eram lentos. Organizei o código em camadas, deixei os controllers só com o fluxo de requisição e resposta e melhorei o desempenho dos filtros.',
      'Estou implantando uma base de conhecimento no Obsidian para o time, organizada por módulo, para que a informação não fique só na cabeça de quem trabalhou em cada parte.',
    ],
    stack: ['laravel', 'livewire', 'php', 'mysql'],
    contexto: 'trabalho',
  },
]

export const projects: Project[] = [
  {
    slug: 'barnout',
    title: 'BarNout',
    summary:
      'App de gamificação do Bar Congress, evento universitário. Os participantes completam desafios das trilhas, como achar QR codes espalhados pela Feevale ou tirar uma foto criativa, ganham pontos e sobem no ranking.',
    diagrams: [
      {
        caption: 'v1 (2024 e 2025): monolito',
        nodes: [
          { id: 'users', label: 'admin + participantes', col: 0, row: 0 },
          { id: 'mono', label: 'Laravel (tudo)', col: 0, row: 1 },
          { id: 'db', label: 'MySQL', col: 0, row: 2, kind: 'database' },
        ],
        edges: [
          { from: 'users', to: 'mono' },
          { from: 'mono', to: 'db' },
        ],
      },
      {
        caption: 'v2 (2026): API + front separado',
        nodes: [
          { id: 'user', label: 'participantes', col: 0, row: 0 },
          { id: 'admin', label: 'admin', col: 1, row: 0 },
          { id: 'next', label: 'front Next.js', col: 0, row: 1 },
          { id: 'api', label: 'Laravel: API + painel admin', col: 1, row: 2 },
          { id: 'db', label: 'MySQL', col: 1, row: 3, kind: 'database' },
        ],
        edges: [
          { from: 'user', to: 'next' },
          { from: 'next', to: 'api', label: 'API' },
          { from: 'admin', to: 'api' },
          { from: 'api', to: 'db' },
        ],
      },
    ],
    problem: [
      'A v1 era um monolito em Laravel, com o painel administrativo e a parte dos participantes no mesmo projeto. Rodou nas edições de 2024 e 2025 e deu bastante problema.',
      'Nos dias do evento, boa parte do meu trabalho era investigar e corrigir bugs em produção com o app em uso. Em 2025, depois do primeiro dia, comecei a corrigir bugs num bar com o time, continuei em casa até as 4h e depois fui para o evento.',
    ],
    decisions: [
      'Separamos o sistema em duas partes: um código em Laravel com as APIs e o painel administrativo, e um front em Next.js para os participantes.',
      'O objetivo era ter um front mais fácil de mudar e separar responsabilidades. Os serviços que vão entrar no futuro só precisam ser consumidos pelo front.',
      'A v2 começou a ser feita em 2025, mas não ficou pronta a tempo, e a v1 rodou mais uma edição.',
      // TODO: trade-offs da separação (o que ficou mais caro ou mais difícil com dois apps).
    ],
    role: [
      'Na v1, atuei principalmente como desenvolvedor.',
      'Na v2, além de desenvolver, organizei as tasks, revisei os PRs e conduzi as reuniões de um time de 7 pessoas entre dev, UX, QA e infra.',
    ],
    result: [
      'A v2 entrou em produção em 07/10/2026, no primeiro dia do evento. O evento inteiro terminou sem nenhum incidente, e já no primeiro dia o time brincou que tinha acabado a emoção.',
    ],
    stack: ['laravel', 'php', 'nextjs', 'mysql'],
    // TODO: confirmar o contexto do BarNout.
    contexto: 'voluntario',
    links: [
      { label: 'barnout.barcongress.com.br', href: 'https://barnout.barcongress.com.br/' },
      { label: 'Bar Congress', href: 'https://barcongress.com.br/' },
    ],
    images: [
      {
        src: '/img/barnout/trilhas.jpg',
        alt: 'Tela de trilhas do BarNout com os desafios e os pontos de cada um',
      },
      {
        src: '/img/barnout/ranking.jpg',
        alt: 'Tela de ranking do BarNout com o pódio; nomes borrados',
      },
    ],
  },
  {
    slug: 'agenda',
    title: 'Agenda Eletricista',
    summary:
      'Agenda e ordens de serviço para o Edson, eletricista autônomo da minha família, e a secretária dele. Projeto acadêmico do curso de ADS.',
    diagrams: [
      {
        caption: 'hipótese inicial',
        nodes: [
          { id: 'cliente', label: 'Cliente', col: 0, row: 0 },
          { id: 'horario', label: 'Agendamento', col: 0, row: 1 },
        ],
        edges: [{ from: 'cliente', to: 'horario' }],
      },
      {
        caption: 'modelagem final',
        nodes: [
          { id: 'cliente', label: 'Cliente', col: 0, row: 0 },
          { id: 'endereco', label: 'Endereço (imóvel)', col: 0, row: 1 },
          { id: 'obs', label: 'Observação datada', col: 0, row: 2 },
          { id: 'os', label: 'Ordem de Serviço', col: 1, row: 1 },
          { id: 'atividade', label: 'Atividade agendada', col: 1, row: 2 },
        ],
        edges: [
          { from: 'cliente', to: 'endereco', label: '1:N' },
          { from: 'endereco', to: 'obs', label: '1:N' },
          { from: 'cliente', to: 'os', label: '1:N' },
          { from: 'endereco', to: 'os', label: 'opcional' },
          { from: 'os', to: 'atividade', label: '1:N' },
        ],
      },
    ],
    problem: [
      'A hipótese inicial era que o Edson precisava organizar os horários.',
      'Na elicitação de requisitos, a conversa mostrou outra dor: agenda, clientes e orçamentos ficavam no papel e na memória. Para achar o histórico de um serviço, ele relia conversas antigas de WhatsApp.',
    ],
    decisions: [
      'O endereço virou uma entidade própria, com observações datadas. O eletricista volta ao imóvel, não à pessoa, então o histórico fica no endereço.',
      'A agenda passou a ser o meio de registrar os serviços: cada ordem de serviço agrupa atividades com data, horário e status próprios, e o sistema avisa quando dois horários batem.',
      'Monolito: o React é servido pelo próprio Express, com uma API e um banco MySQL numa VPS. Para cinco módulos, dois perfis e pouco acesso simultâneo, serviços separados só trariam complexidade.',
      'Uso só pelo navegador, sem instalar nada. O Edson já tinha abandonado ferramentas anteriores por serem complicadas demais.',
    ],
    role: [
      'Fiz a elicitação de requisitos com o Edson, a modelagem e a documentação: requisitos, regras de negócio, decisões, diagramas e uma análise de LGPD, tudo num vault do Obsidian.',
      'Desenvolvi o sistema.',
    ],
    result: [
      'Agenda e atividades estão completas. Ordens de serviço, clientes e usuários estão implementados, com ajustes pendentes. O orçamento fica para a segunda entrega.',
      // TODO: o Edson já usa o sistema? O que mudou no dia a dia dele?
    ],
    stack: ['react', 'vite', 'nodejs', 'express', 'sequelize', 'mysql'],
    contexto: 'pessoal',
    links: [
      { label: 'Código', href: 'https://github.com/LuizKirsch/agenda-eletrecista' },
      {
        label: 'Análise no Obsidian',
        href: 'https://github.com/LuizKirsch/agenda-eletrecista-obsidian',
      },
    ],
  },
  {
    slug: 'oraculo',
    title: 'Oráculo',
    summary:
      'Prova de conceito de um assistente que responde perguntas sobre documentos internos, PDFs e imagens com OCR, usando RAG.',
    diagrams: [
      {
        caption: 'RAG',
        nodes: [
          { id: 'docs', label: 'PDFs + imagens (OCR)', col: 0, row: 0 },
          { id: 'user', label: 'pergunta', col: 1, row: 0 },
          { id: 'chroma', label: 'ChromaDB', col: 0, row: 1, kind: 'database' },
          { id: 'api', label: 'FastAPI + LangChain', col: 1, row: 1 },
          { id: 'llm', label: 'OpenAI', col: 1, row: 2 },
        ],
        edges: [
          { from: 'docs', to: 'chroma', label: 'indexa' },
          { from: 'user', to: 'api' },
          { from: 'api', to: 'chroma', label: 'busca' },
          { from: 'api', to: 'llm' },
        ],
      },
    ],
    problem: [
      'Criei o Oráculo na Fraga & Bitello para consultar em linguagem natural os PDFs das administradoras de consórcio.',
      // TODO: qual era a dor antes (como a informação era procurada)?
    ],
    decisions: [
      'Busca filtrada por categoria de documento.',
      'Persona configurável para as respostas.',
      'OCR para que imagens também entrem na base, além dos PDFs.',
      // TODO: trade-offs (por que RAG e ChromaDB, o que ficou de fora da POC).
    ],
    role: ['Concebi e desenvolvi a prova de conceito.'],
    // TODO: resultado da POC (foi usada? virou ferramenta?).
    result: [],
    stack: ['python', 'fastapi', 'langchain', 'chromadb', 'openai-api', 'docker', 'cloud-run'],
    contexto: 'pessoal',
    links: [{ label: 'Código', href: 'https://github.com/LuizKirsch/oraculo' }],
  },
  {
    slug: 'tenancy-laravel',
    title: 'Tenancy Laravel',
    summary:
      'Aplicação multi-tenant com um banco de dados isolado por tenant, identificado pelo subdomínio e criado automaticamente quando o tenant é cadastrado.',
    // Estrutura do README do repositório: o domínio central serve o painel admin e
    // o banco central (tenants e domains); cadastrar um tenant dispara a criação do
    // banco dele e as migrations de tenant; os domínios de tenant usam só o próprio banco.
    diagrams: [
      {
        caption: 'domínio central x domínio do tenant',
        nodes: [
          { id: 'central', label: 'domínio central', col: 0, row: 0 },
          { id: 'tdom', label: 'domínio do tenant', col: 2, row: 0 },
          { id: 'admin', label: 'painel central (admin)', col: 0, row: 1 },
          { id: 'troutes', label: 'rotas do tenant', col: 2, row: 1 },
          {
            id: 'cdb',
            label: 'banco central: tenants e domains',
            col: 0,
            row: 2,
            kind: 'database',
          },
          { id: 'tdb', label: 'banco do tenant', col: 2, row: 2, kind: 'database' },
        ],
        edges: [
          { from: 'central', to: 'admin' },
          { from: 'admin', to: 'cdb', label: 'cadastra tenant' },
          { from: 'cdb', to: 'tdb', label: 'cria banco + migrations' },
          { from: 'tdom', to: 'troutes', label: 'identifica o tenant' },
          { from: 'troutes', to: 'tdb' },
        ],
      },
    ],
    // TODO: o que motivou o projeto.
    problem: [],
    decisions: [
      'Um banco de dados por tenant, em vez de um banco compartilhado.',
      'O tenant é identificado pelo domínio da requisição. Os domínios centrais servem o painel administrativo; qualquer outro é tratado como tenant.',
      'Cadastrar um tenant cria automaticamente o banco dele e roda as migrations de tenant, que ficam separadas das migrations do banco central.',
      // TODO: por que banco isolado e não banco compartilhado?
    ],
    role: ['Projeto pessoal.'],
    result: [],
    stack: ['laravel', 'stancl-tenancy', 'livewire', 'mysql'],
    contexto: 'pessoal',
    links: [{ label: 'Código', href: 'https://github.com/LuizKirsch/tenancy-laravel' }],
  },
  {
    slug: 'este-site',
    title: 'Este site',
    summary:
      'Este portfólio: um quadro de system design em que o visitante faz GET /luiz e cada caixa abre um painel.',
    // Montado a partir do repositório: src/content, src/diagram, src/canvas,
    // src/semantic, .github/workflows/ci.yml e scripts/spa-routes.mjs.
    diagrams: [
      {
        caption: 'do conteúdo à tela',
        nodes: [
          { id: 'content', label: 'content.ts', col: 0, row: 0 },
          { id: 'model', label: 'model.ts', col: 0, row: 1 },
          { id: 'layout', label: 'layout.ts', col: 1, row: 1 },
          { id: 'semantic', label: 'HTML semântico', col: 0, row: 2 },
          { id: 'board', label: 'React Flow', col: 1, row: 2 },
        ],
        edges: [
          { from: 'content', to: 'model', label: 'conteúdo tipado' },
          { from: 'model', to: 'layout' },
          { from: 'model', to: 'semantic' },
          { from: 'layout', to: 'board', label: 'desktop e mobile' },
        ],
      },
      {
        caption: 'build e deploy',
        nodes: [
          { id: 'push', label: 'push na main', col: 0, row: 0 },
          { id: 'ci', label: 'GitHub Actions', col: 0, row: 1 },
          { id: 'routes', label: 'spa-routes.mjs', col: 0, row: 2 },
          { id: 'pages', label: 'GitHub Pages', col: 0, row: 3 },
        ],
        edges: [
          { from: 'push', to: 'ci' },
          { from: 'ci', to: 'routes', label: 'lint, testes, build' },
          { from: 'routes', to: 'pages', label: 'um HTML por rota' },
        ],
      },
    ],
    // TODO: o problema (texto do Luiz).
    problem: [],
    // Proposta a partir do código, para revisar.
    decisions: [
      'React Flow para o canvas: pan, zoom, minimapa, nós focáveis e setas entre handles já vêm prontos. Escrevi só os nós customizados e a câmera que segue a URL e o tour. Em troca, o bundle passa de 500 kB.',
      'Conteúdo tipado num arquivo só: os componentes só leem do content.ts. Um projeto novo é um objeto novo, e o nó, a rota, a parada do tour e a versão em texto saem dele.',
      'Ligações calculadas: o "onde usei" de cada tecnologia sai da stack declarada em cada projeto e experiência, então não existe uma segunda lista para manter em sincronia.',
      'Fallback semântico: leitor de tela e Google não leem o canvas, então o mesmo conteúdo também é renderizado em HTML semântico, oculto até o foco do teclado chegar nele.',
      'Deep links no GitHub Pages: o Pages não reescreve rotas de SPA, então o build gera um HTML por rota de painel, com status 200 e título próprio. Projetos e tecnologias entram sozinhos; um serviço novo precisa ser acrescentado no script.',
    ],
    role: ['Projeto pessoal.'],
    // TODO: resultado.
    result: [],
    stack: [
      'react',
      'typescript',
      'vite',
      'react-flow',
      'react-router',
      'motion',
      'vitest',
      'testing-library',
      'playwright',
      'eslint',
      'github-actions',
      'github-pages',
    ],
    contexto: 'pessoal',
    links: [{ label: 'Código', href: repo }],
  },
]

/**
 * O tour segue a request: visitante → gateway → cada serviço → currículo.
 * Paradas com `route` abrem o painel daquela rota. Sem `ms`, o tempo da parada
 * é o de leitura do balão + painel (ver src/tour/timing.ts).
 * As paradas de projeto saem de `projects`: projeto novo entra no tour sozinho.
 */
export const tour: TourStep[] = [
  { nodeId: 'actor', text: 'Você é o visitante. Sua request é GET /luiz.', ms: 5000 },
  { nodeId: 'gateway', text: 'O gateway responde com quem eu sou e com o que trabalho.', ms: 5000 },
  { nodeId: 'sobre', route: '/sobre', text: 'sobre-service: quem eu sou, em poucas linhas.' },
  {
    nodeId: 'projetos',
    text: 'projetos-service: cada projeto é um estudo de caso. Vamos passar por eles.',
    ms: 5000,
  },
  ...projects.map((p, i) => ({
    nodeId: `project-${p.slug}`,
    route: `/projetos/${p.slug}`,
    text: `Projeto ${i + 1} de ${projects.length}: ${p.title}.`,
  })),
  {
    nodeId: 'experiencia',
    route: '/experiencia',
    text: 'experiencia-service: a fila da carreira, de QA em 2022 a Pleno em 2026.',
  },
  { nodeId: 'contato', route: '/contato', text: 'contato-service: LinkedIn, GitHub e e-mail.' },
  {
    nodeId: 'stack',
    text: 'stack-service: as tecnologias por camada. Clique numa delas para ver onde eu usei.',
    ms: 5000,
  },
  {
    nodeId: 'curriculo',
    text: 'O banco de dados guarda o currículo em PDF. Clique para baixar.',
    ms: 5000,
  },
]
