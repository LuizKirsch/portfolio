import { useCallback, useEffect, useRef, type KeyboardEvent } from 'react'
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
import { howTo, type TourStep } from '../content/content'
import { edges, nodeForRoute, nodes, type ModelNode } from '../diagram/model'
import { clusterSize, position, sides, type XY } from '../diagram/layout'
import { PANEL_WIDTH } from '../panels/Panel'
import { reducedMotion } from '../reducedMotion'
import { TourDot } from '../tour/TourDot'
import { nodeTypes } from './nodes'
import type { BoardNode } from './nodes/types'
import s from './board.module.css'

/*
 * Junta modelo (model.ts) e posições (layout.ts) em nós e arestas do React Flow.
 * Nada disso muda em tempo de execução, então é calculado uma vez, fora do componente.
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
    // Fora da árvore de acessibilidade; a versão semântica descreve as conexões.
    domAttributes: { 'aria-hidden': true },
  }
})

const hasPanel = (path: string) => path !== '/' && path !== '/projetos'

/**
 * Marca um nó como selecionado e leva a câmera até ele. `offset` (em px de
 * tela) desloca o nó para longe do que estiver por cima: o painel à direita
 * ou o balão do tour embaixo. Sem id, só limpa a seleção.
 */
function useFocusNode() {
  const { setNodes, setCenter, getInternalNode } = useReactFlow<BoardNode>()
  return useCallback(
    (id: string | undefined, offset = { x: 0, y: 0 }) => {
      // Só os nós cuja seleção muda são recriados: recriar um nó faz o React
      // Flow medi-lo de novo, o que mudaria `useNodesInitialized`.
      setNodes((ns) =>
        ns.map((n) => (!!n.selected === (n.id === id) ? n : { ...n, selected: !n.selected })),
      )
      const node = id && getInternalNode(id)
      if (!node) return
      const zoom = 1.1
      const { x, y } = node.internals.positionAbsolute
      const cx = x + (node.measured.width ?? 0) / 2 + offset.x / zoom
      const cy = y + (node.measured.height ?? 0) / 2 + offset.y / zoom
      setCenter(cx, cy, { zoom, duration: reducedMotion() ? 0 : 600 })
    },
    [setNodes, setCenter, getInternalNode],
  )
}

/**
 * Quando a URL muda (clique, Enter, link direto, voltar do navegador), leva a
 * câmera até o nó da rota. Roda uma vez por rota: a seleção faz o React Flow
 * medir os nós de novo, o que dispararia o efeito em loop.
 */
function RouteCamera({ touring }: { touring: boolean }) {
  const { pathname } = useLocation()
  const ready = useNodesInitialized()
  const focus = useFocusNode()
  const handled = useRef<string>(null)

  useEffect(() => {
    if (!ready || handled.current === pathname) return
    handled.current = pathname
    // Durante o tour quem move a câmera é o TourCamera; a rota só abre o painel.
    if (touring) return
    const target = pathname === '/' ? undefined : nodeForRoute(pathname)
    focus(target?.id, { x: hasPanel(pathname) ? PANEL_WIDTH / 2 : 0, y: 0 })
  }, [pathname, ready, focus, touring])

  return null
}

// Altura aproximada do balão do tour: o nó sobe esse tanto para não ficar atrás dele.
const TOUR_CARD_OFFSET = 90

/**
 * Câmera do tour, montada só enquanto ele roda. A cada parada foca o nó e pinta
 * de azul a seta que chega nele. Ao desmontar, limpa seleção e destaque.
 */
function TourCamera({ nodeId, withPanel }: { nodeId: string; withPanel: boolean }) {
  const ready = useNodesInitialized()
  const focus = useFocusNode()
  const { setEdges } = useReactFlow()

  useEffect(() => {
    if (!ready) return
    // Com painel aberto, o nó vai para a metade livre da tela (à esquerda).
    focus(nodeId, { x: withPanel ? PANEL_WIDTH / 2 : 0, y: TOUR_CARD_OFFSET })
    setEdges((es) => es.map((e) => ({ ...e, className: e.target === nodeId ? 'tour' : '' })))
  }, [nodeId, withPanel, ready, focus, setEdges])

  useEffect(
    () => () => {
      focus(undefined)
      setEdges((es) => es.map((e) => ({ ...e, className: '' })))
    },
    [focus, setEdges],
  )
  return null
}

function FitAll() {
  const { fitView } = useReactFlow()
  return (
    <button
      className={s.button}
      onClick={() => fitView({ ...FIT, duration: reducedMotion() ? 0 : 400 })}
    >
      ver tudo
    </button>
  )
}

// "Ver tudo" deixa livres o canto do minimapa (direita) e o botão (embaixo).
const FIT = { padding: { top: '24px', left: '24px', right: '240px', bottom: '72px' } } as const

// Abertura nos post-its de como usar e no visitante, em zoom de leitura.
// URL direta (ex.: /projetos/barnout) vai para o nó dela pelo RouteCamera.
const INITIAL = {
  nodes: [...howTo.map((h) => ({ id: h.id })), { id: 'actor' }],
  maxZoom: 1,
  padding: 0.15,
}

/**
 * `tour`: parada atual do tour, quando ele está rodando.
 * Como usar o quadro está explicado nos post-its de como usar, que são nós do modelo.
 */
export function Board({ tour }: { tour?: TourStep }) {
  const navigate = useNavigate()

  const open = (n: ModelNode) => {
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
    <div className={s.board} role="region" aria-label="Quadro interativo">
      <ReactFlow
        // Não-controlado: o React Flow guarda as medidas dos nós (o minimapa depende delas).
        defaultNodes={rfNodes}
        defaultEdges={rfEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={INITIAL}
        minZoom={0.3}
        maxZoom={2}
        // Posições vêm do layout.ts: nós não se arrastam nem se conectam.
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
        onNodeClick={(_, n) => open(n.data)}
        onKeyDown={onKeyDown}
      >
        <RouteCamera touring={!!tour} />
        {tour && (
          <>
            <TourCamera nodeId={tour.nodeId} withPanel={!!tour.route} />
            <TourDot nodeId={tour.nodeId} />
          </>
        )}
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} />
        <MiniMap pannable zoomable />
        <Controls showInteractive={false} showFitView={false} />
        <Panel position="bottom-center">
          <FitAll />
        </Panel>
      </ReactFlow>
    </div>
  )
}
