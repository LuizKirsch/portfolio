import { experiences } from '../../content/content'
import { Handles } from './Handles'
import type { BoardNodeProps } from './types'
import s from './nodes.module.css'

// Fila FIFO desenhada como slots: a carreira entra pela esquerda, em ordem.
// Cada slot mostra o cargo e, à mão, a empresa (há cargos repetidos entre empresas).
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
