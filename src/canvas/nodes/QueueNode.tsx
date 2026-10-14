import { experiences } from '../../content/content'
import { Handles } from './Handles'
import type { BoardNodeProps } from './types'
import s from './nodes.module.css'

// Um slot por cargo, em ordem cronológica. A empresa vai embaixo porque há
// cargos com o mesmo nome em empresas diferentes.
export function QueueNode({ selected }: BoardNodeProps) {
  return (
    <div className={`${s.box} ${s.queue} ${selected ? s.selected : ''}`}>
      <span className={s.tag}>queue</span>
      <ol>
        {experiences.map((e) => (
          <li key={e.id}>
            {e.label}
            <span className={s.hand}>{e.org}</span>
          </li>
        ))}
      </ol>
      <Handles />
    </div>
  )
}
