import { useEffect, useId, useRef, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import s from './panels.module.css'

/** Largura do painel no desktop. O Board usa para deslocar a câmera. */
export const PANEL_WIDTH = 560

type Props = { title: string; onClose: () => void; children: ReactNode }

/**
 * Casca de todos os painéis: animação de entrada, título, botão de fechar e Esc.
 *
 * O painel não é modal: o quadro continua clicável ao lado dele, então não há
 * foco preso. Ao abrir, o foco vai para o título; ao fechar, o App devolve o
 * foco ao nó de onde o visitante veio.
 */
export function Panel({ title, onClose, children }: Props) {
  const reduce = useReducedMotion()
  const titleId = useId()
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => heading.current?.focus(), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.aside
      className={s.panel}
      style={{ width: `min(${PANEL_WIDTH}px, 100vw)` }}
      role="dialog"
      aria-labelledby={titleId}
      initial={reduce ? { opacity: 0 } : { x: '100%' }}
      animate={reduce ? { opacity: 1 } : { x: 0 }}
      exit={reduce ? { opacity: 0 } : { x: '100%' }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* React 19 leva este <title> para o <head>: cada URL de painel tem título próprio. */}
      <title>{`${title} · Luiz Kirsch`}</title>
      <header className={s.header}>
        <h2 id={titleId} ref={heading} tabIndex={-1}>
          {title}
        </h2>
        <button className={s.close} onClick={onClose} aria-label="Fechar painel">
          ×
        </button>
      </header>
      <div className={s.body}>{children}</div>
    </motion.aside>
  )
}
