/**
 * Layout desktop: onde cada nó do modelo (model.ts) fica no canvas.
 *
 * Coordenadas em px, canto superior esquerdo do nó. A leitura é da esquerda
 * para a direita, como uma request: visitante → gateway → serviços → dados.
 *
 * A coluna de serviços segue a ordem de `services` (content.ts): mudar a ordem
 * lá reposiciona serviços e dados aqui. Projetos e tecnologias são calculados
 * pelo índice, então o cluster e o frame de stack crescem sozinhos.
 */
import { camadas, projects, services, techs, type ServiceId } from '../content/content'
import { contactLinks } from './model'

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

/*
 * Coluna de serviços: uma linha por serviço, de cima para baixo, centrada na
 * altura do gateway. Cada linha tem a altura do que o serviço liga, e o serviço
 * fica no meio dela. Alturas estimadas: o layout vem antes de o React Flow
 * medir os nós. Linhas empilhadas na ordem do menu = setas do gateway sem cruzar.
 */
const SERVICE_X = 480
const DATA_X = 800
const SERVICE_H = 50
const ROW_GAP = 70
const GATEWAY_MID = 115
const CONTACT_GAP = 80

const rowHeight: Record<ServiceId, number> = {
  sobre: 150,
  projetos: clusterSize.height,
  experiencia: 75,
  stack: stackFrameSize.height,
  contato: (contactLinks.length - 1) * CONTACT_GAP + 50,
}

// O que cada serviço liga, com o deslocamento vertical dentro da linha.
const rowNodes: Record<ServiceId, [id: string, dy: number][]> = {
  sobre: [['sobre-note', 0]],
  projetos: [['cluster', 0]],
  experiencia: [['queue', 0]],
  stack: [['stack-frame', 0]],
  contato: contactLinks.map((c, i) => [c.id, i * CONTACT_GAP]),
}

const column: Record<string, XY> = {}
let rowTop =
  GATEWAY_MID -
  (services.reduce((sum, s) => sum + rowHeight[s.id], 0) + ROW_GAP * (services.length - 1)) / 2
for (const s of services) {
  column[s.id] = { x: SERVICE_X, y: rowTop + rowHeight[s.id] / 2 - SERVICE_H / 2 }
  for (const [id, dy] of rowNodes[s.id]) column[id] = { x: DATA_X, y: rowTop + dy }
  rowTop += rowHeight[s.id] + ROW_GAP
}

const fixed: Record<string, XY> = {
  // Post-its de como usar: coluna à esquerda do visitante, levemente desencontrados.
  'como-funciona': { x: -820, y: -330 },
  'como-navegar': { x: -860, y: -140 },
  'como-tour': { x: -810, y: 60 },
  actor: { x: -300, y: 50 },
  gateway: { x: 0, y: 0 },
  curriculo: { x: 90, y: 320 },
  health: { x: 40, y: -250 },
  ...column,
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
