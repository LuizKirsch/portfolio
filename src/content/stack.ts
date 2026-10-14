/**
 * "Tecnologia → onde usei", calculado a partir do `stack` de cada projeto e
 * experiência no content.ts. Não existe lista de usos escrita à mão.
 */
import { experiences, projects, techs, type Contexto, type StackRef, type TechId } from './content'

export type Usage = {
  kind: 'projeto' | 'experiencia'
  /** Slug do projeto ou id da experiência. */
  id: string
  nome: string
  contexto: Contexto
  nota?: string
}

export const refTech = (r: StackRef): TechId => (typeof r === 'string' ? r : r.tech)

export const techById = new Map(techs.map((t) => [t.id, t]))

export const isTechId = (id: string | undefined): id is TechId => !!id && techById.has(id as TechId)

const sources = [
  ...projects.map((p) => ({
    kind: 'projeto' as const,
    id: p.slug,
    nome: p.title,
    contexto: p.contexto,
    stack: p.stack,
  })),
  ...experiences.map((e) => ({
    kind: 'experiencia' as const,
    id: e.id,
    nome: `${e.title} · ${e.org}`,
    contexto: e.contexto,
    stack: e.stack,
  })),
]

/** Projetos e experiências que usam a tecnologia, na ordem do content.ts. */
export function getUsages(tech: TechId): Usage[] {
  return sources.flatMap(({ stack, ...source }) =>
    stack
      .filter((r) => refTech(r) === tech)
      .map((r) => (typeof r === 'string' ? source : { ...source, nota: r.nota })),
  )
}

/** Tecnologias que aparecem junto com esta em algum projeto ou experiência. */
export function usedWith(tech: TechId): TechId[] {
  const ids = new Set(
    sources
      .filter((s) => s.stack.some((r) => refTech(r) === tech))
      .flatMap((s) => s.stack.map(refTech)),
  )
  ids.delete(tech)
  return techs.filter((t) => ids.has(t.id)).map((t) => t.id)
}
