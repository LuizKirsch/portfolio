import { aboutNote } from '../../content/content'
import { Handles } from './Handles'
import type { BoardNodeProps } from './types'
import s from './nodes.module.css'

// Post-it. Amarelo é anotação (sobre); azul é link de contato, com <a> de verdade.
export function StickyNode({ data }: BoardNodeProps) {
  const cls = `${s.sticky} ${data.tone === 'blue' ? s.blue : s.yellow}`
  return (
    <div className={cls}>
      {data.href ? (
        <a href={data.href} target="_blank" rel="noreferrer">
          {data.label} ↗
        </a>
      ) : (
        aboutNote
      )}
      <Handles />
    </div>
  )
}
