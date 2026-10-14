import { Handles } from './Handles'
import type { BoardNodeProps } from './types'
import s from './nodes.module.css'

export function ServiceNode({ data, selected }: BoardNodeProps) {
  return (
    <div className={`${s.box} ${s.service} ${selected ? s.selected : ''}`}>
      <span className={s.tag}>service</span>
      {data.label}
      <Handles />
    </div>
  )
}
