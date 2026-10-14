import { expect, it } from 'vitest'
import { projects } from '../content/content'
import { stepMs } from './timing'

it('usa o tempo fixo quando a parada tem ms', () => {
  expect(stepMs({ nodeId: 'actor', text: 'qualquer coisa', ms: 1234 })).toBe(1234)
})

it('sem ms, dá 4 s + leitura a 200 palavras por minuto', () => {
  // 2 palavras = 0,6 s de leitura
  expect(stepMs({ nodeId: 'actor', text: 'duas palavras' })).toBe(4600)
})

it('parada com painel conta o texto do painel', () => {
  const p = projects[0]
  const semPainel = stepMs({ nodeId: `project-${p.slug}`, text: p.title })
  const comPainel = stepMs({
    nodeId: `project-${p.slug}`,
    text: p.title,
    route: `/projetos/${p.slug}`,
  })
  expect(comPainel).toBeGreaterThan(semPainel)
})
