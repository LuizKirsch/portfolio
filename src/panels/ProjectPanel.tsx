import type { ReactNode } from 'react'
import type { Project } from '../content/content'
import { MiniDiagram } from './MiniDiagram'
import s from './panels.module.css'

/**
 * Renderiza qualquer Project, sempre na mesma ordem: resumo, diagrama, prints,
 * problema, decisões, papel, resultado, stack e links. O título fica no Panel.
 * Seção sem conteúdo (ainda em TODO no content.ts) não aparece.
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

      {p.images && (
        <div className={s.shots}>
          {p.images.map((img) => (
            <img key={img.src} src={img.src} alt={img.alt} loading="lazy" />
          ))}
        </div>
      )}

      <Section title="O problema" items={p.problem} />
      <Section title="Decisões e trade-offs" items={p.decisions} list />
      <Section title="Meu papel" items={p.role} list />
      <Section title="Resultado" items={p.result} />

      <Section title="Stack" items={p.stack}>
        <ul className={s.chips}>
          {p.stack.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </Section>

      <Section title="Links" items={p.links}>
        <ul>
          {p.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noreferrer">
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}

type SectionProps = { title: string; items: unknown[]; list?: boolean; children?: ReactNode }

// Título + parágrafos (ou lista). Some quando não há itens.
function Section({ title, items, list, children }: SectionProps) {
  if (items.length === 0) return null
  const texts = items as string[]
  return (
    <>
      <h3>{title}</h3>
      {children ??
        (list ? (
          <ul>
            {texts.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        ) : (
          texts.map((t) => <p key={t}>{t}</p>)
        ))}
    </>
  )
}
