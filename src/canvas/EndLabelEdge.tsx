import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from '@xyflow/react'
import s from './board.module.css'

/**
 * Seta do gateway até um serviço, com o rótulo (/sobre, /projetos...) no fim,
 * logo antes da ponta. As quatro saem do mesmo ponto; com o rótulo no meio da
 * curva eles se amontoavam onde as linhas se cruzam.
 *
 * O rótulo fica do lado oposto ao que a curva vem: serviço acima do gateway →
 * a curva chega por baixo e o rótulo fica em cima; serviço abaixo → a curva
 * chega por cima e o rótulo fica embaixo, alinhado com a ponta (embaixo ela
 * não atrapalha). Assim nenhuma linha passa por ele.
 */
export function EndLabelEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })
  const below = sourceY < targetY

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={props.markerEnd} style={props.style} />
      {props.label && (
        <EdgeLabelRenderer>
          <div
            className={s.endLabel}
            style={{
              transform: below
                ? `translate(-100%, 0) translate(${targetX - 6}px, ${targetY + 6}px)`
                : `translate(-100%, -100%) translate(${targetX - 14}px, ${targetY - 6}px)`,
            }}
          >
            {props.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
