/**
 * Modelo lógico do diagrama: quais nós existem e como se conectam.
 *
 * Aqui não há posição na tela. O layout desktop (layout.ts) diz onde cada nó
 * fica no canvas; o mobile percorre este mesmo modelo em ordem e empilha as
 * caixas. Assim os dois layouts nunca divergem sobre *o que* existe.
 *
 * Tudo é derivado de content.ts: um projeto novo vira nó e aresta sozinho.
 */
import { experiences, profile, projects } from '../content/content'

export type NodeKind =
  'actor' | 'gateway' | 'service' | 'cluster' | 'project' | 'queue' | 'sticky' | 'database'

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
  tone?: 'yellow' | 'blue'
}

export type ModelEdge = { id: string; source: string; target: string; label?: string }

// Os 4 serviços: as setas do gateway até eles são o menu do site.
export const services = [
  { id: 'sobre', label: 'sobre-service', route: '/sobre' },
  { id: 'projetos', label: 'projetos-service', route: '/projetos' },
  { id: 'experiencia', label: 'experiencia-service', route: '/experiencia' },
  { id: 'contato', label: 'contato-service', route: '/contato' },
] as const

export const contactLinks = [
  { id: 'linkedin', label: 'LinkedIn', href: profile.linkedin },
  { id: 'github', label: 'GitHub', href: profile.github },
  { id: 'email', label: 'e-mail', href: `mailto:${profile.email}` },
]

export const projectRoute = (slug: string) => `/projetos/${slug}`

export const nodes: ModelNode[] = [
  { id: 'actor', kind: 'actor', label: 'visitante' },
  { id: 'gateway', kind: 'gateway', label: profile.name, route: '/' },
  { id: 'curriculo', kind: 'database', label: 'currículo', href: profile.cv },
  ...services.map((s): ModelNode => ({ ...s, kind: 'service' })),
  { id: 'sobre-note', kind: 'sticky', label: 'sobre mim', route: '/sobre', tone: 'yellow' },
  // /projetos não tem painel próprio: clicar no cluster só centraliza a câmera nele.
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
    label: experiences.map((e) => e.label).join(' → '),
    route: '/experiencia',
  },
  ...contactLinks.map((c): ModelNode => ({ ...c, kind: 'sticky', tone: 'blue' })),
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
]

/** Nó que corresponde a uma rota, usado para centralizar a câmera ao abrir uma URL direto. */
export const nodeForRoute = (path: string) =>
  nodes.find((n) => n.route === path && n.kind !== 'sticky' && n.kind !== 'queue')
