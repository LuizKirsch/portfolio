import { useLayoutEffect, useRef } from 'react'
import { ViewportPortal } from '@xyflow/react'
import { edges } from '../diagram/model'
import { reducedMotion } from '../reducedMotion'

/**
 * O "pacote" da request: um ponto que corre pela seta que chega na parada atual
 * (visitante → gateway, gateway → serviço...).
 *
 * Em vez de recalcular a curva, reaproveita o `d` do <path> que o React Flow já
 * desenhou para a aresta, e anima com <animateMotion> do SVG. O ViewportPortal
 * põe o SVG nas coordenadas do quadro, então o path serve como está.
 */
export function TourDot({ nodeId }: { nodeId: string }) {
  const motion = useRef<SVGAnimateMotionElement>(null)
  const edge = edges.find((e) => e.target === nodeId)

  useLayoutEffect(() => {
    const path = document.querySelector(
      `.react-flow__edge[data-id="${edge?.id}"] path.react-flow__edge-path`,
    )
    const d = path?.getAttribute('d')
    if (!d || !motion.current) return
    motion.current.setAttribute('path', d)
    motion.current.beginElement()
  }, [edge])

  // Sem aresta (o visitante é o ponto de partida) ou com movimento reduzido: sem ponto.
  if (!edge || reducedMotion()) return null

  return (
    <ViewportPortal>
      <svg
        aria-hidden="true"
        width="1"
        height="1"
        style={{ position: 'absolute', overflow: 'visible', pointerEvents: 'none', zIndex: 5 }}
      >
        <circle r="7" fill="var(--accent)" stroke="var(--paper)" strokeWidth="2">
          <animateMotion ref={motion} dur="1.2s" begin="indefinite" fill="freeze" />
        </circle>
      </svg>
    </ViewportPortal>
  )
}
