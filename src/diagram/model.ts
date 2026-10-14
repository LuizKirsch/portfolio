/**
 * Modelo lógico do diagrama: quais nós existem e como se conectam.
 *
 * Sem posições: o layout desktop está em layout.ts, e o mobile percorre este
 * modelo em ordem. Os dois usam a mesma lista de nós.
 *
 * Tudo é derivado de content.ts: um projeto novo vira nó e aresta sozinho.
 */
import {
  aboutNote,
  experiences,
  howTo,
  profile,
  projects,
  techs,
  type TechId,
} from '../content/content'

export type NodeKind =
  | 'actor'
  | 'gateway'
  | 'service'
  | 'cluster'
  | 'project'
  | 'queue'
  | 'sticky'
  | 'database'
  | 'stackFrame'
  | 'tech'

export type ModelNode = {
  id: string
  kind: NodeKind
  label: string
  /** Rota que o nó abre (painel). */
  route?: string
  /** Link externo que o nó abre. */
  href?: string
  /** Nó que contém este (projetos ficam dentro do cluster). */
  parentId?: string
  /** Cor do post-it. */
  tone?: 'yellow' | 'blue' | 'green'
  /** Texto do post-it (um parágrafo por item). */
  text?: string[]
  /** Tecnologia do chip (nós `tech`). */
  techId?: TechId
}

export type ModelEdge = { id: string; source: string; target: string; label?: string }

// Os serviços: as setas do gateway até eles são o menu do site.
export const services = [
  { id: 'sobre', label: 'sobre-service', route: '/sobre' },
  { id: 'projetos', label: 'projetos-service', route: '/projetos' },
  { id: 'experiencia', label: 'experiencia-service', route: '/experiencia' },
  { id: 'contato', label: 'contato-service', route: '/contato' },
  { id: 'stack', label: 'stack-service', route: '/stack' },
] as const

export const contactLinks = [
  { id: 'linkedin', label: 'LinkedIn', href: profile.linkedin },
  { id: 'github', label: 'GitHub', href: profile.github },
  { id: 'email', label: 'e-mail', href: `mailto:${profile.email}` },
]

export const projectRoute = (slug: string) => `/projetos/${slug}`
export const techRoute = (id: TechId) => `/stack/${id}`
export const techNodeId = (id: TechId) => `tech-${id}`

export const nodes: ModelNode[] = [
  // Anotações soltas ao lado do visitante, sem setas: explicam como usar o quadro.
  ...howTo.map((h): ModelNode => ({
    id: h.id,
    kind: 'sticky',
    label: h.title,
    tone: h.tone,
    text: [h.title, h.text],
  })),
  { id: 'actor', kind: 'actor', label: 'visitante' },
  { id: 'gateway', kind: 'gateway', label: profile.name, route: '/' },
  { id: 'curriculo', kind: 'database', label: 'currículo', href: profile.cv },
  ...services.map((s): ModelNode => ({ ...s, kind: 'service' })),
  {
    id: 'sobre-note',
    kind: 'sticky',
    label: 'sobre mim',
    route: '/sobre',
    tone: 'yellow',
    text: [aboutNote],
  },
  // A rota /projetos não tem painel: só leva a câmera até os projetos.
  { id: 'cluster', kind: 'cluster', label: 'cluster: projetos', route: '/projetos' },
  ...projects.map((p): ModelNode => ({
    id: `project-${p.slug}`,
    kind: 'project',
    label: p.title,
    route: projectRoute(p.slug),
    parentId: 'cluster',
  })),
  {
    id: 'queue',
    kind: 'queue',
    label: experiences.map((e) => `${e.label} (${e.org})`).join(' → '),
    route: '/experiencia',
  },
  ...contactLinks.map((c): ModelNode => ({ ...c, kind: 'sticky', tone: 'blue' })),
  // Como /projetos, /stack não tem painel. Cada chip abre /stack/:id.
  { id: 'stack-frame', kind: 'stackFrame', label: 'stack: por camada', route: '/stack' },
  ...techs.map((t): ModelNode => ({
    id: techNodeId(t.id),
    kind: 'tech',
    label: t.nome,
    route: techRoute(t.id),
    parentId: 'stack-frame',
    techId: t.id,
  })),
]

const edge = (source: string, target: string, label?: string): ModelEdge => ({
  id: `${source}->${target}`,
  source,
  target,
  label,
})

export const edges: ModelEdge[] = [
  edge('actor', 'gateway', 'GET /luiz'),
  edge('gateway', 'curriculo', 'SELECT pdf'),
  ...services.map((s) => edge('gateway', s.id, s.route)),
  edge('sobre', 'sobre-note'),
  edge('projetos', 'cluster'),
  edge('experiencia', 'queue', 'enqueue'),
  ...contactLinks.map((c) => edge('contato', c.id)),
  edge('stack', 'stack-frame'),
]

/** Nó que corresponde a uma rota, usado para centralizar a câmera ao abrir uma URL direto. */
export const nodeForRoute = (path: string) =>
  nodes.find((n) => n.route === path && n.kind !== 'sticky' && n.kind !== 'queue')
