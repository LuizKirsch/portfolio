/**
 * Layout desktop: onde cada nó do modelo (model.ts) fica no canvas.
 *
 * Coordenadas em px, canto superior esquerdo do nó. A leitura é da esquerda
 * para a direita, como uma request: visitante → gateway → serviços → dados.
 *
 * Projetos são calculados pelo índice dentro do cluster, então adicionar um
 * projeto em content.ts não exige mexer aqui: o cluster cresce sozinho.
 */
import { camadas, projects, techs } from '../content/content'

export type XY = { x: number; y: number }

const PROJECT_TOP = 48
const PROJECT_GAP = 64

export const clusterSize = {
  width: 340,
  height: PROJECT_TOP + projects.length * PROJECT_GAP,
}

// Frame de stack: uma coluna por camada, um chip embaixo do outro. Também
// cresce sozinho com as tecnologias do content.ts.
export const STACK_COL = 160
export const STACK_TOP = 76
const STACK_GAP = 42
export const STACK_PAD = 20
const tallest = Math.max(...camadas.map((c) => techs.filter((t) => t.camada === c.id).length))

export const stackFrameSize = {
  width: STACK_PAD * 2 + camadas.length * STACK_COL - 20,
  height: STACK_TOP + tallest * STACK_GAP + 8,
}

function techPosition(id: string): XY | undefined {
  const t = techs.find((t) => `tech-${t.id}` === id)
  if (!t) return
  const col = camadas.findIndex((c) => c.id === t.camada)
  const row = techs.filter((o) => o.camada === t.camada).indexOf(t)
  return { x: STACK_PAD + col * STACK_COL, y: STACK_TOP + row * STACK_GAP }
}

// O cluster cresce para cima a partir de uma base fixa, logo acima da fila de
// experiência. Sobre e o post-it sobem junto, então nada se sobrepõe.
const CLUSTER_BOTTOM = 90
const clusterTop = CLUSTER_BOTTOM - clusterSize.height

const fixed: Record<string, XY> = {
  // Post-its de como usar: coluna à esquerda do visitante, levemente desencontrados.
  'como-funciona': { x: -820, y: -330 },
  'como-navegar': { x: -860, y: -140 },
  'como-tour': { x: -810, y: 60 },
  actor: { x: -300, y: 50 },
  gateway: { x: 0, y: 0 },
  curriculo: { x: 90, y: 320 },
  health: { x: 40, y: -250 },

  sobre: { x: 480, y: clusterTop - 150 },
  'sobre-note': { x: 800, y: clusterTop - 200 },

  projetos: { x: 480, y: clusterTop + clusterSize.height / 2 - 30 },
  cluster: { x: 800, y: clusterTop },

  experiencia: { x: 480, y: 140 },
  queue: { x: 800, y: 125 },

  contato: { x: 480, y: 340 },
  linkedin: { x: 800, y: 290 },
  github: { x: 800, y: 370 },
  email: { x: 800, y: 450 },

  // Abaixo de contato: as setas até os usos sobem para a fila e o cluster.
  stack: { x: 480, y: 620 + stackFrameSize.height / 2 - 30 },
  'stack-frame': { x: 800, y: 620 },
}

/** Posição de um nó. Filhos do cluster e do frame recebem posição relativa ao pai. */
export function position(id: string): XY {
  if (fixed[id]) return fixed[id]
  const i = projects.findIndex((p) => `project-${p.slug}` === id)
  if (i >= 0) return { x: 20, y: PROJECT_TOP + i * PROJECT_GAP }
  const tech = techPosition(id)
  if (tech) return tech
  throw new Error(`layout: nó sem posição: ${id}`)
}

/**
 * Lado de saída/entrada de uma seta: horizontal se a distância em x domina,
 * vertical caso contrário. Usado pelo canvas (os mini diagramas usam a grade).
 */
// Compara cantos superiores, não centros: basta com os nós bem espaçados.
export function sides(a: XY, b: XY): [string, string] {
  const dx = b.x - a.x
  const dy = b.y - a.y
  if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? ['r', 'l'] : ['l', 'r']
  return dy > 0 ? ['b', 't'] : ['t', 'b']
}
