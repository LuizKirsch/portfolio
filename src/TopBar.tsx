import { useState } from 'react'
import { Link } from 'react-router'
import { asset } from './asset'
import { profile } from './content/content'
import s from './topbar.module.css'

type Theme = 'light' | 'dark'

/**
 * Barra fixa fora do canvas. LinkedIn, GitHub e currículo ficam sempre à vista,
 * sem depender de achar o nó certo no quadro.
 */
export function TopBar({ onTour }: { onTour: () => void }) {
  // O index.html já aplicou o tema antes do React; aqui só lemos e alternamos.
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme as Theme)
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    localStorage.setItem('theme', next)
    setTheme(next)
  }

  return (
    <header className={s.bar}>
      <Link to="/" className={s.home}>
        <span className={s.method}>GET</span> /luiz
      </Link>
      {/* Em tela estreita o texto encurta para "tour"; o nome acessível é sempre o completo. */}
      <button className={s.tour} onClick={onTour} aria-label="▶ seguir a request">
        ▶ <span className={s.long}>seguir a request</span>
        <span className={s.short}>tour</span>
      </button>
      <nav aria-label="Links principais" className={s.links}>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={asset(profile.cv)} download className={s.cv}>
          currículo.pdf ↓
        </a>
        <button
          className={s.theme}
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro (lousa)'}
          aria-pressed={theme === 'dark'}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </nav>
    </header>
  )
}
