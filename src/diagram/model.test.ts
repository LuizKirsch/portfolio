import { describe, expect, it } from 'vitest'
import { position } from './layout'
import { edges, nodes } from './model'

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
})
