import { Handles } from './Handles'
import type { BoardNodeProps } from './types'
import s from './nodes.module.css'

/**
 * Post-it. Com `href` é link de contato (azul, com <a> de verdade); sem `href`
 * é anotação com o texto do modelo, na cor do `tone`. Anotação com vários
 * parágrafos fica mais larga e usa o primeiro como título.
 *
 * Anotação com `route` é a resposta de um serviço (o GET /sobre): tag
 * `response`, texto cortado em "…" e a seta dos projetos, para parecer
 * clicável sem hover. Os post-its de instrução não têm rota, nem tag, nem seta.
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

  if (data.route) {
    return (
      <div className={`${s.sticky} ${s[data.tone ?? 'yellow']} ${s.note} ${s.response}`}>
        <span className={s.tag}>response</span>
        {text.map((t) => (
          <p key={t} className={s.clamp}>
            {t}
          </p>
        ))}
        <span className={s.corner} aria-hidden="true">
          →
        </span>
        <Handles />
      </div>
    )
  }

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
