import type { Project } from '../content/content'
import { MiniDiagram } from './MiniDiagram'
import s from './panels.module.css'

/**
 * Renderiza qualquer Project, sempre na mesma ordem: resumo, diagrama, problema,
 * decisões, papel, resultado, stack e links. O título fica no Panel.
 * Seções sem conteúdo (stack ou links ainda em TODO) não aparecem.
 */
export function ProjectPanel({ project: p }: { project: Project }) {
  return (
    <>
      <p className={s.summary}>{p.summary}</p>

      <div className={s.diagrams}>
        {p.diagrams.map((d) => (
          <MiniDiagram key={d.caption} diagram={d} />
        ))}
      </div>

      <h3>O problema</h3>
      {p.problem.map((t) => (
        <p key={t}>{t}</p>
      ))}

      <h3>Decisões e trade-offs</h3>
      <ul>
        {p.decisions.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <h3>Meu papel</h3>
      <ul>
        {p.role.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <h3>Resultado</h3>
      {p.result.map((t) => (
        <p key={t}>{t}</p>
      ))}

      {p.stack.length > 0 && (
        <>
          <h3>Stack</h3>
          <ul className={s.chips}>
            {p.stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </>
      )}

      {p.links.length > 0 && (
        <>
          <h3>Links</h3>
          <ul>
            {p.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}
