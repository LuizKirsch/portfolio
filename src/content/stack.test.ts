import { describe, expect, it } from 'vitest'
import { edges, nodes, techNodeId } from '../diagram/model'
import { experiences, projects, techs } from './content'
import { getUsages, isTechId, refTech, usedWith } from './stack'

const usos = (id: Parameters<typeof getUsages>[0]) => getUsages(id).map((u) => `${u.kind}:${u.id}`)

describe('getUsages', () => {
  it('Laravel: BarNout, Tenancy e os cargos de Laravel, sem a Agenda', () => {
    expect(usos('laravel')).toEqual([
      'projeto:barnout',
      'projeto:tenancy-laravel',
      'experiencia:dev',
      'experiencia:fb-junior',
      'experiencia:fb-pleno',
    ])
  })

  it('leva o contexto de quem usa', () => {
    const python = getUsages('python')
    expect(python.find((u) => u.id === 'oraculo')?.contexto).toBe('pessoal')
    expect(python.find((u) => u.id === 'fb-junior')?.contexto).toBe('trabalho')
  })

  it('Claude Code aponta para este site, como projeto pessoal com nota', () => {
    const usages = getUsages('claude-code')
    expect(usages.length).toBeGreaterThan(0)
    expect(usages.map((u) => u.id)).toEqual(['este-site'])
    expect(usages[0]).toMatchObject({ kind: 'projeto', contexto: 'pessoal' })
    expect(usages[0].nota).toBeTruthy()
  })

  // IA aparece onde foi construída, não só usada como ferramenta.
  it.each(['langchain', 'openai-api'] as const)('%s aponta para o Oráculo', (id) => {
    expect(usos(id)).toContain('projeto:oraculo')
  })

  it.each([
    ['mysql', 'experiencia:fb-junior'],
    ['docker', 'experiencia:fb-junior'],
    ['docker', 'projeto:barnout'],
    ['stancl-tenancy', 'experiencia:dev'],
    ['fastapi', 'experiencia:fb-junior'],
  ] as const)('%s aparece em %s', (id, uso) => {
    expect(usos(id)).toContain(uso)
  })

  it('usedWith junta as tecnologias dos mesmos usos, sem a própria', () => {
    expect(usedWith('cypress')).toEqual(['selenium', 'codeceptjs'])
  })
})

describe('validação do conteúdo da stack', () => {
  const refs = [...projects, ...experiences].flatMap((x) => x.stack.map(refTech))

  it('toda tecnologia referenciada existe', () => {
    for (const id of refs) expect(isTechId(id), id).toBe(true)
  })

  it.each(techs)('$id aparece em pelo menos um uso', (t) => {
    expect(getUsages(t.id).length).toBeGreaterThan(0)
  })

  it.each([...projects.map((p) => p.slug), ...experiences.map((e) => e.id)])(
    '%s tem contexto',
    (id) => {
      const item = [...projects, ...experiences].find((x) => ('slug' in x ? x.slug : x.id) === id)!
      expect(['trabalho', 'pessoal', 'voluntario']).toContain(item.contexto)
    },
  )

  it('ligações calculadas apontam para nós que existem', () => {
    const ids = new Set(nodes.map((n) => n.id))
    for (const t of techs) {
      expect(ids).toContain(techNodeId(t.id))
      for (const u of getUsages(t.id)) {
        expect(ids).toContain(u.kind === 'projeto' ? `project-${u.id}` : 'queue')
      }
    }
    expect(edges.some((e) => e.source === 'stack' && e.target === 'stack-frame')).toBe(true)
  })
})
