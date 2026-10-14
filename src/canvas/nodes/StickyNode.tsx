import { Handles } from './Handles'
import type { BoardNodeProps } from './types'
import s from './nodes.module.css'

/**
 * Post-it. Com `href` é link de contato (azul, com <a> de verdade); sem `href`
 * é anotação com o texto do modelo, na cor do `tone`. Anotação com vários
 * parágrafos fica mais larga e usa o primeiro como título.
 */
export function StickyNode({ data }: BoardNodeProps) {
  if (data.href) {
    return (
      <div className={`${s.sticky} ${s.blue} ${s.link}`}>
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
    <div className={`${s.sticky} ${s[data.tone ?? 'yellow']} ${s.note} ${long ? s.wide : ''}`}>
      {text.map((t, i) => (
        <p key={t} className={long && i === 0 ? s.noteTitle : undefined}>
          {t}
        </p>
      ))}
      <Handles />
    </div>
  )
}
