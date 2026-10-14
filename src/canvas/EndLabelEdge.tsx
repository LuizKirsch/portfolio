import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type EdgeProps } from '@xyflow/react'
import s from './board.module.css'

// Distância do tronco vertical até a saída do gateway.
const TRUNK = 30

/**
 * Seta do gateway até um serviço, em ângulo reto: sai do gateway, segue por um
 * tronco vertical comum logo à direita dele e chega ao serviço por um trecho
 * horizontal longo. O rótulo (/sobre, /projetos...) fica em cima desse trecho
 * final, onde nenhuma outra linha passa. Com curvas, as setas que chegavam
 * de cima passavam por baixo dos rótulos.
 */
export function EndLabelEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    centerX: sourceX + TRUNK,
    borderRadius: 12,
  })

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={props.markerEnd} style={props.style} />
      {props.label && (
        <EdgeLabelRenderer>
          <div
            className={s.endLabel}
            // Acima do trecho final, terminando um pouco antes da ponta da seta.
            style={{
              transform: `translate(-100%, -100%) translate(${targetX - 14}px, ${targetY - 4}px)`,
            }}
          >
            {props.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
