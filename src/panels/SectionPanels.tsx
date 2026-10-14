import { about, experiences, profile } from '../content/content'
import { contactLinks } from '../diagram/model'
import s from './panels.module.css'

export function SobrePanel() {
  return about.map((t) => <p key={t}>{t}</p>)
}

// Mesma ordem da fila no canvas: do mais antigo para o atual.
export function ExperienciaPanel() {
  return (
    <ol className={s.timeline}>
      {experiences.map((e) => (
        <li key={e.id}>
          <strong>{e.title}</strong> · {e.org}
          <span className={s.period}>{e.period}</span>
          {e.text.map((t) => (
            <p key={t}>{t}</p>
          ))}
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
