import { about, education, experiences, profile } from '../content/content'
import { refTech, techById } from '../content/stack'
import { contactLinks } from '../diagram/model'
import s from './panels.module.css'

// Estes componentes servem ao painel e à versão semântica (SemanticSite).

export function SobrePanel() {
  return (
    <>
      <div className={s.who}>
        <p>
          <strong>{profile.name}</strong>
          <br />
          {profile.role} @ {profile.company}
          <br />
          {profile.location}
        </p>
      </div>
      {about.map((t) => (
        <p key={t}>{t}</p>
      ))}
      <h3>Formação</h3>
      <ul>
        {education.map((e) => (
          <li key={e.course}>
            {e.course} · {e.school} <span className={s.period}>{e.period}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

// No canvas a fila é cronológica; aqui o mais recente vem primeiro, como num currículo.
export function ExperienciaPanel() {
  return (
    <ol className={s.timeline} reversed>
      {[...experiences].reverse().map((e) => (
        <li key={e.id}>
          <strong>{e.title}</strong> · {e.org}
          <span className={s.period}>
            {e.period} · {e.place}
          </span>
          <p>{e.summary}</p>
          <ul>
            {e.highlights.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <ul className={s.chips} aria-label="Stack">
            {e.stack.map(refTech).map((id) => (
              <li key={id}>{techById.get(id)!.nome}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}

export function ContatoPanel() {
  // No painel o e-mail aparece por extenso: dá para copiar sem abrir o cliente de e-mail.
  return (
    <ul className={s.contacts}>
      {contactLinks.map((c) => (
        <li key={c.id}>
          <a href={c.href} target="_blank" rel="noreferrer">
            {c.id === 'email' ? profile.email : `${c.label} ↗`}
          </a>
        </li>
      ))}
    </ul>
  )
}
