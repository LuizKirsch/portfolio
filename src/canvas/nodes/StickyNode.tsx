import { Handles } from './Handles'
import type { BoardNodeProps } from './types'
import s from './nodes.module.css'

/**
 * Post-it. Amarelo é anotação (texto vem do modelo); azul é link de contato,
 * com <a> de verdade. Anotação com vários parágrafos fica mais larga e usa o
 * primeiro como título.
 */
export function StickyNode({ data }: BoardNodeProps) {
  if (data.href) {
    return (
      <div className={`${s.sticky} ${s.blue}`}>
        <a href={data.href} target="_blank" rel="noreferrer">
          {data.label} ↗
        </a>
        <Handles />
      </div>
    )
  }

  const text = data.text ?? []
  const long = text.length > 1
  return (
    <div className={`${s.sticky} ${s.yellow} ${long ? s.wide : ''}`}>
      {text.map((t, i) => (
        <p key={t} className={long && i === 0 ? s.noteTitle : undefined}>
          {t}
        </p>
      ))}
      <Handles />
    </div>
  )
}
