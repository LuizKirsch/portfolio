import { Handles } from './Handles'
import type { BoardNodeProps } from './types'
import s from './nodes.module.css'

// Ator de diagrama de caso de uso: o visitante que faz a request.
export function ActorNode({ data }: BoardNodeProps) {
  return (
    <div className={s.actor}>
      <svg width="48" height="80" viewBox="0 0 48 80" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="24" cy="12" r="10" />
          <path d="M24 22v30M6 34h36M24 52 10 76M24 52l14 24" />
        </g>
      </svg>
      <span className={s.hand}>{data.label}</span>
      <Handles />
    </div>
  )
}
