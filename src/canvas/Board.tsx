import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  Panel,
  ReactFlow,
  useReactFlow,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { edges, nodes, type ModelNode } from '../diagram/model'
import { clusterSize, position, type XY } from '../diagram/layout'
import { nodeTypes } from './nodes'
import type { BoardNode } from './nodes/types'
import s from './board.module.css'

/*
 * Aqui modelo + layout viram nós e arestas do React Flow. É o único lugar que
 * conhece os dois: model.ts não sabe de posição e layout.ts não sabe de conexão.
 * Como nada disso muda em tempo de execução, é calculado uma vez, fora do componente.
 */

const byId = new Map(nodes.map((n) => [n.id, n]))

// Filhos do cluster têm posição relativa ao pai; para escolher o lado da seta
// precisamos da posição absoluta.
function absolute(n: ModelNode): XY {
  const p = position(n.id)
  if (!n.parentId) return p
  const parent = position(n.parentId)
  return { x: p.x + parent.x, y: p.y + parent.y }
}

// Sai pelo lado que aponta para o destino: horizontal se a distância em x
// domina, vertical caso contrário.
// ponytail: compara cantos superiores, não centros; basta para este layout espaçado.
function sides(a: XY, b: XY): [string, string] {
  const dx = b.x - a.x
  const dy = b.y - a.y
  if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? ['r', 'l'] : ['l', 'r']
  return dy > 0 ? ['b', 't'] : ['t', 'b']
}

const rfNodes: BoardNode[] = nodes.map((n) => ({
  id: n.id,
  type: n.kind,
  data: n,
  position: position(n.id),
  parentId: n.parentId,
  style: n.kind === 'cluster' ? clusterSize : undefined,
}))

const rfEdges: Edge[] = edges.map((e) => {
  const [from, to] = sides(absolute(byId.get(e.source)!), absolute(byId.get(e.target)!))
  return {
    ...e,
    sourceHandle: `s-${from}`,
    targetHandle: `t-${to}`,
    markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
  }
})

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

function FitAll() {
  const { fitView } = useReactFlow()
  return (
    <button className={s.button} onClick={() => fitView({ duration: reducedMotion() ? 0 : 400 })}>
      ver tudo
    </button>
  )
}

const HINT_KEY = 'hint-seen'

export function Board() {
  const navigate = useNavigate()
  const [hint, setHint] = useState(() => !localStorage.getItem(HINT_KEY))
  const dismissHint = () => {
    if (!hint) return
    localStorage.setItem(HINT_KEY, '1')
    setHint(false)
  }

  return (
    <div className={s.board}>
      <ReactFlow
        // Não-controlado: o React Flow guarda as medidas dos nós (o minimapa depende delas).
        defaultNodes={rfNodes}
        defaultEdges={rfEdges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.3}
        maxZoom={2}
        // O layout.ts é a fonte da verdade: nós não se arrastam nem se conectam.
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
        onNodeClick={(_, n) => {
          dismissHint()
          if (n.data.route) navigate(n.data.route)
        }}
        // `event` só existe quando o movimento veio do usuário, não do fitView.
        onMoveStart={(event) => event && dismissHint()}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} />
        <MiniMap pannable zoomable />
        <Controls showInteractive={false} showFitView={false} />
        <Panel position="bottom-center">
          <FitAll />
        </Panel>
        {hint && (
          <Panel position="top-center" className={s.hint}>
            arrasta, dá zoom, clica nas caixas
          </Panel>
        )}
      </ReactFlow>
    </div>
  )
}
