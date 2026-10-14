import { describe, expect, it } from 'vitest'
import { position } from './layout'
import { edges, nodes, services } from './model'

// O modelo (o que existe e como se conecta) e o layout (onde fica) são separados.
// Estes testes garantem que os dois continuam batendo.

const ids = new Set(nodes.map((n) => n.id))

describe('modelo do diagrama', () => {
  it('não repete id de nó', () => {
    expect(ids.size).toBe(nodes.length)
  })

  it.each(edges)('aresta $id aponta para nós que existem', (e) => {
    expect(ids).toContain(e.source)
    expect(ids).toContain(e.target)
  })

  it('todo nó filho tem um pai que existe e vem antes dele', () => {
    // O React Flow exige o pai antes dos filhos na lista.
    nodes.forEach((n, i) => {
      if (!n.parentId) return
      const parent = nodes.findIndex((p) => p.id === n.parentId)
      expect(parent, n.id).toBeGreaterThanOrEqual(0)
      expect(parent, n.id).toBeLessThan(i)
    })
  })
})

describe('layout desktop', () => {
  it.each(nodes)('$id tem posição', (n) => {
    expect(() => position(n.id)).not.toThrow()
  })

  it('contato é o último serviço', () => {
    expect(services.at(-1)?.id).toBe('contato')
  })

  // A coluna desce na ordem do menu: setas do gateway sem cruzar e cada
  // serviço na altura dos seus dados.
  it('serviços e seus dados descem na ordem de services', () => {
    const ys = (ids: string[]) => ids.map((id) => position(id).y)
    const increasing = (v: number[]) => v.every((y, i) => i === 0 || y > v[i - 1])
    expect(increasing(ys(services.map((s) => s.id)))).toBe(true)
    // O primeiro nó de dados de cada serviço, na mesma ordem.
    const firstData = services.map((s) => edges.find((e) => e.source === s.id)!.target)
    expect(increasing(ys(firstData))).toBe(true)
  })
})
