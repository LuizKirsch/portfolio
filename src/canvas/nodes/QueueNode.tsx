import { Handle, Position } from '@xyflow/react'
import { experiences } from '../../content/content'
import { useStackMarks } from '../useStackMarks'
import { Handles } from './Handles'
import type { BoardNodeProps } from './types'
import s from './nodes.module.css'

// Um slot por cargo, em ordem cronológica. A empresa vai embaixo porque há
// cargos com o mesmo nome em empresas diferentes. Cada slot tem um ponto de
// chegada próprio (exp-<id>) para as setas de "onde usei" da stack.
export function QueueNode({ selected }: BoardNodeProps) {
  const mark = useStackMarks()
  return (
    <div className={`${s.box} ${s.queue} ${selected ? s.selected : ''}`}>
      <span className={s.tag}>queue</span>
      <ol>
        {experiences.map((e) => (
          <li key={e.id} data-stack={mark('experiencia', e.id)}>
            {e.label}
            <span className={s.hand}>{e.org}</span>
            <Handle
              id={`exp-${e.id}`}
              type="target"
              position={Position.Bottom}
              className={s.handle}
            />
          </li>
        ))}
      </ol>
      <Handles />
    </div>
  )
}
