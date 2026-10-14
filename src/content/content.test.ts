import { describe, expect, it } from 'vitest'
import { nodes } from '../diagram/model'
import { experiences, howTo, projects, tour } from './content'

// Valida o content.ts: é o único arquivo que muda para adicionar conteúdo,
// então é aqui que um projeto mal preenchido precisa falhar.

describe('projetos', () => {
  it.each(projects)('$slug tem os campos obrigatórios', (p) => {
    expect(p.slug).toMatch(/^[a-z0-9-]+$/)
    expect(p.title.trim()).not.toBe('')
    expect(p.summary.trim()).not.toBe('')
    expect(p.diagrams.length).toBeGreaterThan(0)
    expect(p.stack.length).toBeGreaterThan(0)
  })

  it('não repetem slug', () => {
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it.each(projects)('$slug: toda seta dos diagramas liga nós que existem', (p) => {
    for (const d of p.diagrams) {
      const ids = new Set(d.nodes.map((n) => n.id))
      expect(ids.size, `${d.caption}: ids repetidos`).toBe(d.nodes.length)
      for (const e of d.edges) {
        expect(ids, `${d.caption}: ${e.from} → ${e.to}`).toContain(e.from)
        expect(ids, `${d.caption}: ${e.from} → ${e.to}`).toContain(e.to)
      }
    }
  })

  // TODO vai em comentário; texto visível com TODO quer dizer que vazou para o site.
  it('não mostram TODO no texto', () => {
    expect(JSON.stringify(projects)).not.toMatch(/TODO/i)
  })
})

describe('experiências', () => {
  it.each(experiences)('$id tem os campos obrigatórios', (e) => {
    for (const field of [e.label, e.title, e.org, e.period, e.summary]) {
      expect(field.trim()).not.toBe('')
    }
    expect(e.highlights.length).toBeGreaterThan(0)
  })

  it('não repetem id', () => {
    expect(new Set(experiences.map((e) => e.id)).size).toBe(experiences.length)
  })
})

describe('tour', () => {
  const nodeIds = new Set(nodes.map((n) => n.id))
  const panelRoutes = new Set([
    '/sobre',
    '/experiencia',
    '/contato',
    ...projects.map((p) => `/projetos/${p.slug}`),
  ])

  it.each(tour)('$nodeId existe no diagrama', (step) => {
    expect(nodeIds).toContain(step.nodeId)
  })

  it.each(tour.filter((s) => s.route))('$nodeId abre um painel que existe', (step) => {
    expect(panelRoutes).toContain(step.route)
  })

  it('passa por todos os projetos', () => {
    for (const p of projects) {
      expect(tour.map((s) => s.route)).toContain(`/projetos/${p.slug}`)
    }
  })
})

it('post-its de como usar têm ids únicos', () => {
  expect(new Set(howTo.map((h) => h.id)).size).toBe(howTo.length)
})
