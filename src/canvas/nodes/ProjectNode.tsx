import { Handles } from './Handles'
import type { BoardNodeProps } from './types'
import s from './nodes.module.css'

export function ProjectNode({ data, selected }: BoardNodeProps) {
  return (
    <div className={`${s.box} ${s.project} ${selected ? s.selected : ''}`}>
      {data.label}
      <span className={s.hand} aria-hidden="true">
        →
      </span>
      <Handles />
    </div>
  )
}
