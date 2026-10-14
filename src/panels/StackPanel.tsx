import { Link } from 'react-router'
import { camadas, type Contexto, type Tech } from '../content/content'
import { getUsages, techById, usedWith } from '../content/stack'
import { projectRoute, techRoute } from '../diagram/model'
import s from './panels.module.css'

const selo: Record<Contexto, string> = {
  trabalho: 'trabalho',
  pessoal: 'pessoal',
  voluntario: 'voluntário',
}

/** Painel de /stack/:techId. "Onde usei" e "usado junto com" são calculados (content/stack.ts). */
export function StackPanel({ tech }: { tech: Tech }) {
  const junto = usedWith(tech.id)
  return (
    <>
      <p className={s.summary}>camada: {camadas.find((c) => c.id === tech.camada)!.label}</p>

      <h3>Onde usei</h3>
      <ul className={s.usages}>
        {getUsages(tech.id).map((u) => (
          <li key={`${u.kind}-${u.id}`} className={s.usage}>
            <span className={`${s.selo} ${s[u.contexto]}`}>{selo[u.contexto]}</span>
            <Link to={u.kind === 'projeto' ? projectRoute(u.id) : '/experiencia'}>{u.nome}</Link>
            {u.nota && <p>{u.nota}</p>}
          </li>
        ))}
      </ul>

      {junto.length > 0 && (
        <>
          <h3>Usado junto com</h3>
          <ul className={s.chips}>
            {junto.map((id) => (
              <li key={id}>
                <Link to={techRoute(id)}>{techById.get(id)!.nome}</Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {tech.porque && (
        <>
          <h3>Por que eu escolho</h3>
          <p>{tech.porque}</p>
        </>
      )}
    </>
  )
}
