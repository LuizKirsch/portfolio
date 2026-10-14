import { useStackMarks } from '../useStackMarks'
import { Handles } from './Handles'
import type { BoardNodeProps } from './types'
import s from './nodes.module.css'

export function ProjectNode({ data, selected }: BoardNodeProps) {
  const mark = useStackMarks()('projeto', data.id.replace(/^project-/, ''))
  return (
    <div className={`${s.box} ${s.project} ${selected ? s.selected : ''}`} data-stack={mark}>
      {data.label}
      <span className={s.hand} aria-hidden="true">
        →
      </span>
      <Handles />
    </div>
  )
}
