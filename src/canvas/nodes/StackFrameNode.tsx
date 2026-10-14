import { camadas } from '../../content/content'
import { STACK_COL, STACK_PAD } from '../../diagram/layout'
import { Handles } from './Handles'
import type { BoardNodeProps } from './types'
import s from './nodes.module.css'

// Frame tracejado com uma coluna por camada. Os chips são nós filhos (ver layout.ts).
export function StackFrameNode({ data }: BoardNodeProps) {
  return (
    <div className={s.cluster}>
      <span className={s.hand}>{data.label}</span>
      {camadas.map((c, i) => (
        <span key={c.id} className={s.camada} style={{ left: STACK_PAD + i * STACK_COL }}>
          {c.label}
        </span>
      ))}
      <Handles />
    </div>
  )
}
