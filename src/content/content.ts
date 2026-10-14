/**
 * Todo o conteúdo do site mora aqui. Os componentes só leem deste arquivo.
 *
 * Para adicionar um projeto: acrescente um objeto em `projects`. O nó no canvas,
 * a aresta do cluster, a rota /projetos/:slug e o item da versão semântica
 * são derivados daqui (ver src/diagram/model.ts).
 *
 * Regra: nada inventado. O que falta está marcado com TODO.
 */

export type Link = { label: string; href: string }

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
  problem: string[]
  decisions: string[]
  role: string[]
  result: string[]
  stack: string[]
  links: Link[]
}

export type Experience = {
  id: string
  /** Rótulo curto que aparece na fila do canvas. */
  label: string
  title: string
  org: string
  period: string
  text: string[]
}

/** Uma parada do tour. `nodeId` precisa existir em src/diagram/model.ts. */
export type TourStep = { nodeId: string; text: string; ms: number }

export const profile = {
  name: 'Luiz Kirsch',
  role: 'Desenvolvedor Fullstack Pleno',
  company: 'Fraga & Bitello',
  location: 'Campo Bom / São Leopoldo, RS',
  stack: ['PHP', 'Laravel', 'Livewire', 'Next.js'],
  tagline: 'Gosto de desenhar o sistema antes de escrever o código.',
  github: 'https://github.com/LuizKirsch',
  linkedin: 'https://linkedin.com/in/luiz-kirsch-177555187',
  email: 'luizhkirch@gmail.com',
  // TODO: colocar o arquivo em public/curriculo.pdf
  cv: '/curriculo.pdf',
}

export const about: string[] = [
  'Sou dev fullstack na Fraga & Bitello. Trabalho no ERPK, um ERP em Laravel e Livewire para o setor de consórcios.',
  'Comecei no fim de 2022 como QA, automatizando testes com Cypress, Selenium e CodeceptJS. Em 2024 passei a desenvolver em PHP e Laravel.',
  'Curso Análise e Desenvolvimento de Sistemas na IENH. A formatura está prevista para 2027.',
  'Antes de abrir o editor, rabisco o desenho do sistema.',
]

// Ordem cronológica: é a ordem da fila no canvas.
export const experiences: Experience[] = [
  {
    id: 'qa',
    label: 'QA (2022)',
    title: 'QA',
    org: 'Testing Company',
    period: 'fim de 2022 – 2024',
    text: ['Automação de testes com Cypress, Selenium e CodeceptJS.'],
  },
  {
    id: 'dev',
    label: 'Dev Fullstack (2024)',
    title: 'Desenvolvedor Fullstack',
    org: 'Testing Company',
    period: '2024',
    text: ['Transição interna de QA para desenvolvimento fullstack com PHP e Laravel.'],
  },
  {
    id: 'fraga',
    label: 'Fraga & Bitello (ERPK)',
    title: 'Desenvolvedor Fullstack Pleno',
    org: 'Fraga & Bitello',
    period: 'fim de 2024 – hoje',
    text: ['Desenvolvimento do ERPK, ERP em Laravel, Livewire e PHP para o setor de consórcios.'],
  },
]

export const projects: Project[] = [
  {
    slug: 'barnout',
    title: 'BarNout',
    summary:
      'Gamificação para o BAR, um evento gratuito de IA: desafios e perguntas durante as palestras e pontos por cada amizade feita no evento.',
    diagrams: [
      {
        caption: 'v1: monolito',
        nodes: [
          { id: 'users', label: 'admin + usuários', col: 0, row: 0 },
          { id: 'mono', label: 'Laravel 11 (tudo)', col: 0, row: 1 },
          { id: 'db', label: 'MySQL', col: 0, row: 2, kind: 'database' },
        ],
        edges: [
          { from: 'users', to: 'mono' },
          { from: 'mono', to: 'db' },
        ],
      },
      {
        caption: 'v2: API + front separado',
        nodes: [
          { id: 'user', label: 'usuários', col: 0, row: 0 },
          { id: 'admin', label: 'admin', col: 1, row: 0 },
          { id: 'next', label: 'front Next.js', col: 0, row: 1 },
          { id: 'panel', label: 'painel admin', col: 1, row: 1 },
          { id: 'api', label: 'API Laravel', col: 0, row: 2 },
          { id: 'db', label: 'MySQL', col: 0, row: 3, kind: 'database' },
        ],
        edges: [
          { from: 'user', to: 'next' },
          { from: 'admin', to: 'panel' },
          { from: 'next', to: 'api', label: 'HTTP' },
          { from: 'api', to: 'db' },
          // O painel admin vive no mesmo app Laravel da API.
          { from: 'panel', to: 'db' },
        ],
      },
    ],
    problem: [
      'A v1 era um monolito em Laravel 11 com MySQL, com a visão do admin e a do usuário no mesmo app.',
      'Ficou dois anos em uso e teve vários problemas em produção.',
    ],
    decisions: [
      'Na v2, o Laravel ficou com as APIs e o painel admin. Os usuários finais passaram a usar um front em Next.js.',
      'O pipeline passou a rodar no GitHub Actions.',
      'A v2 não ficou pronta para o evento de 2025, e a v1 rodou mais uma edição.',
      'TODO: trade-offs da separação (o que ficou mais caro ou mais difícil com dois apps).',
    ],
    role: [
      'Na v1, trabalhei como desenvolvedor e corrigi bugs em produção.',
      'Na v2, organizei as tasks, revisei os PRs, conduzi as reuniões da equipe e desenvolvi o front em Next.js.',
    ],
    result: ['A v2 entrou em produção em 2026. O evento terminou sem nenhum bug ou incidente.'],
    stack: ['Laravel', 'PHP', 'Next.js', 'MySQL', 'GitHub Actions'],
    // TODO: links do BarNout (repositório, site do evento)
    links: [],
  },
  {
    slug: 'agenda',
    title: 'Agenda para eletricista',
    summary:
      'MVP para o Edson, um eletricista da minha família, guardar o histórico de serviços de cada imóvel.',
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
        // TODO: confirmar a cardinalidade dos relacionamentos (ex.: 1:N) para rotular as arestas
        nodes: [
          { id: 'cliente', label: 'Cliente', col: 0, row: 0 },
          { id: 'imovel', label: 'Endereço / Imóvel', col: 0, row: 1 },
          { id: 'servico', label: 'Serviço', col: 0, row: 2 },
          { id: 'agendamento', label: 'Agendamento', col: 1, row: 2 },
        ],
        edges: [
          { from: 'cliente', to: 'imovel' },
          { from: 'imovel', to: 'servico' },
          { from: 'agendamento', to: 'servico', label: 'registra' },
        ],
      },
    ],
    problem: [
      'A hipótese inicial era que o Edson precisava organizar os horários.',
      'Na elicitação de requisitos, a conversa mostrou outra dor: faltava histórico dos serviços e dados de cada imóvel.',
    ],
    decisions: [
      'O endereço virou uma entidade própria, com os dados do imóvel.',
      'A agenda passou a ser o meio de registrar os serviços.',
      'TODO: trade-offs dessa modelagem.',
    ],
    role: [
      'Fiz a elicitação de requisitos com o Edson e a modelagem.',
      'TODO: o que mais você fez no MVP (desenvolvimento, deploy).',
    ],
    result: ['TODO: o MVP está em uso? O que mudou para o Edson?'],
    // TODO: stack da Agenda
    stack: [],
    // TODO: links da Agenda
    links: [],
  },
]

/**
 * O tour segue a request: visitante → gateway → cada serviço → currículo.
 * 7 paradas × 5 s ≈ 35 s.
 */
export const tour: TourStep[] = [
  { nodeId: 'actor', text: 'Você é o visitante. Sua request é GET /luiz.', ms: 5000 },
  { nodeId: 'gateway', text: 'O gateway responde com quem eu sou e com o que trabalho.', ms: 5000 },
  { nodeId: 'sobre', text: 'sobre-service: um post-it com a minha história curta.', ms: 5000 },
  {
    nodeId: 'projetos',
    text: 'projetos-service: clique num projeto para ver o estudo de caso.',
    ms: 5000,
  },
  {
    nodeId: 'experiencia',
    text: 'experiencia-service: a fila de QA até a Fraga & Bitello.',
    ms: 5000,
  },
  { nodeId: 'contato', text: 'contato-service: LinkedIn, GitHub e e-mail.', ms: 5000 },
  {
    nodeId: 'curriculo',
    text: 'O banco de dados guarda o currículo em PDF. Clique para baixar.',
    ms: 5000,
  },
]
