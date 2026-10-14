import { useStackMarks } from '../useStackMarks'
import { Handles } from './Handles'
import type { BoardNodeProps } from './types'
import s from './nodes.module.css'

// Chip de tecnologia dentro do frame de stack. Clique ou Enter abre /stack/:id.
export function TechNode({ data }: BoardNodeProps) {
  const mark = useStackMarks()('tech', data.techId!)
  return (
    <div className={s.tech} data-stack={mark}>
      {data.label}
      <Handles />
    </div>
  )
}
