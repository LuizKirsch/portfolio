import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from '@xyflow/react'
import s from './board.module.css'

/**
 * Seta com o rótulo no fim, logo antes da ponta. Usada do gateway até os
 * serviços: as quatro saem do mesmo ponto, e com o rótulo no meio da curva
 * eles se amontoavam onde as linhas se cruzam. Perto do serviço a curva já
 * está na horizontal e cada rótulo fica sozinho.
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

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={props.markerEnd} style={props.style} />
      {props.label && (
        <EdgeLabelRenderer>
          <div
            className={s.endLabel}
            // Acima da linha, terminando um pouco antes da ponta da seta.
            style={{
              transform: `translate(-100%, -100%) translate(${targetX - 14}px, ${targetY - 6}px)`,
            }}
          >
            {props.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
