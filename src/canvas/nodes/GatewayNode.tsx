import { profile } from '../../content/content'
import { Handles } from './Handles'
import type { BoardNodeProps } from './types'
import s from './nodes.module.css'

// Caixa central: nome, cargo, stack e tagline.
export function GatewayNode({ selected }: BoardNodeProps) {
  return (
    <div className={`${s.box} ${s.gateway} ${selected ? s.selected : ''}`}>
      <span className={s.tag}>gateway</span>
      <p className={s.name}>{profile.name}</p>
      <p className={s.role}>
        {profile.role} @ {profile.company}
      </p>
      <ul className={s.chips}>
        {profile.stack.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <p className={s.hand}>{profile.tagline}</p>
      <Handles />
    </div>
  )
}
