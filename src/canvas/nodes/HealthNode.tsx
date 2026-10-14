import { checks } from '../../content/ci'
import { health } from '../../content/content'
import { Handles } from './Handles'
import type { BoardNodeProps } from './types'
import s from './nodes.module.css'

// GET /health: o badge do workflow mostra o status real do CI sem backend.
// O nó inteiro é o link para a página de Actions (Enter no nó clica nele).
export function HealthNode({ data }: BoardNodeProps) {
  return (
    <a className={s.health} href={data.href} target="_blank" rel="noreferrer">
      <strong>{data.label}</strong>
      <img src={health.badge} alt="status do CI no GitHub Actions" height={20} />
      <ul>
        {checks.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <Handles />
    </a>
  )
}
