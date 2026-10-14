import { Handles } from './Handles'
import type { BoardNodeProps } from './types'
import s from './nodes.module.css'

// Nó pai dos projetos. O tamanho vem do layout.ts (cresce com a lista).
export function ClusterNode({ data }: BoardNodeProps) {
  return (
    <div className={s.cluster}>
      <span className={s.hand}>{data.label}</span>
      <Handles />
    </div>
  )
}
