// @vitest-environment jsdom
import { afterEach, beforeAll, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import type { Project } from '../content/content'
import { ProjectPanel } from './ProjectPanel'

// O React Flow dos mini diagramas mede os nós com ResizeObserver, que o jsdom não tem.
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})
afterEach(cleanup)

// Projeto de teste: não depende do conteúdo real, que muda.
const base: Project = {
  slug: 'teste',
  title: 'Teste',
  summary: 'Resumo do projeto.',
  diagrams: [
    {
      caption: 'arquitetura',
      nodes: [
        { id: 'a', label: 'front', col: 0, row: 0 },
        { id: 'b', label: 'api', col: 0, row: 1 },
      ],
      edges: [{ from: 'a', to: 'b' }],
    },
  ],
  problem: ['O problema.'],
  decisions: ['Uma decisão.'],
  role: ['Meu papel.'],
  result: ['O resultado.'],
  stack: ['react'],
  contexto: 'pessoal',
  links: [{ label: 'Código', href: 'https://example.com' }],
}

const headings = () => screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)

it('mostra as seções do estudo de caso na ordem', () => {
  render(<ProjectPanel project={base} />)
  expect(headings()).toEqual([
    'O problema',
    'Decisões e trade-offs',
    'Meu papel',
    'Resultado',
    'Stack',
    'Links',
  ])
  expect(screen.getByRole('link', { name: /Código/ }).getAttribute('href')).toBe(
    'https://example.com',
  )
})

it('esconde seções sem conteúdo (TODO no content.ts)', () => {
  render(<ProjectPanel project={{ ...base, problem: [], result: [], links: [] }} />)
  expect(headings()).toEqual(['Decisões e trade-offs', 'Meu papel', 'Stack'])
})

it('descreve o diagrama em texto para leitores de tela', () => {
  render(<ProjectPanel project={base} />)
  expect(screen.getByRole('img', { name: 'arquitetura. front → api' })).toBeTruthy()
})
