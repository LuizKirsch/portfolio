import { Handles } from './Handles'
import type { BoardNodeProps } from './types'
import s from './nodes.module.css'

// Cilindro de banco de dados com o download do currículo.
export function DatabaseNode({ data }: BoardNodeProps) {
  return (
    <a className={s.database} href={data.href} download>
      <svg width="120" height="90" viewBox="0 0 120 90" aria-hidden="true">
        <g fill="var(--paper)" stroke="currentColor" strokeWidth="2">
          <path d="M2 14v62c0 7 26 12 58 12s58-5 58-12V14" />
          <ellipse cx="60" cy="14" rx="58" ry="12" />
        </g>
      </svg>
      <span className={s.dbLabel}>
        {data.label}
        <small>curriculo.pdf ↓</small>
      </span>
      <Handles />
    </a>
  )
}
