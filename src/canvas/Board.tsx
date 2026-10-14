import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  Panel,
  ReactFlow,
  useNodesInitialized,
  useReactFlow,
  type Edge,
} from '@xyflow/react'
import { edges, nodeForRoute, nodes, type ModelNode } from '../diagram/model'
import { clusterSize, position, sides, type XY } from '../diagram/layout'
import { PANEL_WIDTH } from '../panels/Panel'
import { reducedMotion } from '../reducedMotion'
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

const rfNodes: BoardNode[] = nodes.map((n) => ({
  id: n.id,
  type: n.kind,
  data: n,
  position: position(n.id),
  parentId: n.parentId,
  style: n.kind === 'cluster' ? clusterSize : undefined,
  ariaLabel: n.route ? `${n.label}, abre ${n.route}` : n.label,
}))

const rfEdges: Edge[] = edges.map((e) => {
  const [from, to] = sides(absolute(byId.get(e.source)!), absolute(byId.get(e.target)!))
  return {
    ...e,
    sourceHandle: `s-${from}`,
    targetHandle: `t-${to}`,
    markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: 'var(--ink)' },
  }
})

const hasPanel = (path: string) => path !== '/' && path !== '/projetos'

/**
 * A URL é o estado: quando ela muda (clique, Enter, link direto, voltar do
 * navegador), a câmera vai até o nó da rota e o marca como selecionado.
 * Se um painel abre, o centro é deslocado para o nó não ficar atrás dele.
 */
function RouteCamera() {
  const { pathname } = useLocation()
  const ready = useNodesInitialized()
  const { setNodes, setCenter, getInternalNode } = useReactFlow<BoardNode>()
  const handled = useRef<string>(null)

  useEffect(() => {
    // Recriar um nó faz o React Flow medi-lo de novo, o que muda `ready` e
    // dispararia este efeito em loop. Por isso: uma vez por rota, e só os nós
    // cuja seleção muda são recriados.
    if (!ready || handled.current === pathname) return
    handled.current = pathname
    const target = pathname === '/' ? undefined : nodeForRoute(pathname)
    setNodes((ns) =>
      ns.map((n) => (!!n.selected === (n.id === target?.id) ? n : { ...n, selected: !n.selected })),
    )
    const node = target && getInternalNode(target.id)
    if (!node) return

    const zoom = 1.1
    const { x, y } = node.internals.positionAbsolute
    const cx = x + (node.measured.width ?? 0) / 2
    const cy = y + (node.measured.height ?? 0) / 2
    const panelOffset = hasPanel(pathname) ? PANEL_WIDTH / 2 / zoom : 0
    setCenter(cx + panelOffset, cy, { zoom, duration: reducedMotion() ? 0 : 500 })
  }, [pathname, ready, setNodes, setCenter, getInternalNode])

  return null
}

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

  const open = (n: ModelNode) => {
    dismissHint()
    if (n.route) navigate(n.route)
  }

  // Tab percorre os nós (o React Flow já os torna focáveis); Enter abre.
  // Nós de link externo delegam para o <a> que têm dentro.
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return
    const el = (e.target as HTMLElement).closest<HTMLElement>('.react-flow__node')
    const n = el && byId.get(el.dataset.id!)
    if (!n || e.target !== el) return
    if (n.route) open(n)
    else el.querySelector('a')?.click()
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
        onNodeClick={(_, n) => open(n.data)}
        onKeyDown={onKeyDown}
        // `event` só existe quando o movimento veio do usuário, não do fitView.
        onMoveStart={(event) => event && dismissHint()}
      >
        <RouteCamera />
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
