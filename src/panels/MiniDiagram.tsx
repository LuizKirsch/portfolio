import { MarkerType, ReactFlow, type Edge, type Node, type NodeProps } from '@xyflow/react'
import type { ProjectDiagram } from '../content/content'
import type { XY } from '../diagram/layout'
import { Handles } from '../canvas/nodes/Handles'
import s from './panels.module.css'

/*
 * Diagrama somente leitura dentro do painel. Usa o mesmo React Flow e os mesmos
 * Handles do canvas. As posições vêm de uma grade (col/row) definida no content.ts.
 */

const COL = 220
const ROW = 80

type MiniData = ProjectDiagram['nodes'][number]
type MiniNode = Node<MiniData>

/**
 * Lado da seta pela grade: linha diferente → vertical (sai por baixo, entra
 * por cima); mesma linha → horizontal. Os diagramas dos painéis são em camadas.
 */
function gridSides(a: MiniData, b: MiniData): [string, string] {
  if (a.row !== b.row) return a.row < b.row ? ['b', 't'] : ['t', 'b']
  return a.col < b.col ? ['r', 'l'] : ['l', 'r']
}

function MiniBox({ data }: NodeProps<MiniNode>) {
  return (
    <div className={`${s.mini} ${data.kind === 'database' ? s.miniDb : ''}`}>
      {data.label}
      <Handles />
    </div>
  )
}

const nodeTypes = { mini: MiniBox }

export function MiniDiagram({ diagram }: { diagram: ProjectDiagram }) {
  const pos = new Map<string, XY>(
    diagram.nodes.map((n) => [n.id, { x: n.col * (diagram.colWidth ?? COL), y: n.row * ROW }]),
  )
  const byId = new Map(diagram.nodes.map((n) => [n.id, n]))
  const label = new Map(diagram.nodes.map((n) => [n.id, n.label]))

  const nodes: MiniNode[] = diagram.nodes.map((n) => ({
    id: n.id,
    type: 'mini',
    position: pos.get(n.id)!,
    data: n,
  }))

  const edges: Edge[] = diagram.edges.map((e) => {
    const [from, to] = gridSides(byId.get(e.from)!, byId.get(e.to)!)
    return {
      id: `${e.from}->${e.to}`,
      source: e.from,
      target: e.to,
      label: e.label,
      sourceHandle: `s-${from}`,
      targetHandle: `t-${to}`,
      markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--ink)' },
    }
  })

  const rows = Math.max(...diagram.nodes.map((n) => n.row)) + 1
  // Leitores de tela não leem o canvas: a figura é descrita como texto.
  const description = `${diagram.caption}. ${diagram.edges
    .map((e) => `${label.get(e.from)} → ${label.get(e.to)}`)
    .join('; ')}`

  return (
    <figure className={s.figure}>
      <div role="img" aria-label={description} style={{ height: rows * 64 + 24 }}>
        <ReactFlow
          defaultNodes={nodes}
          defaultEdges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.1, maxZoom: 1 }}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          // A atribuição do React Flow fica no canvas principal, não em cada miniatura.
          proOptions={{ hideAttribution: true }}
        />
      </div>
      <figcaption>{diagram.caption}</figcaption>
    </figure>
  )
}
