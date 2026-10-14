import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { tour } from '../content/content'
import s from './tour.module.css'

type Props = {
  step: number
  onStep: (step: number) => void
  onEnd: () => void
  mobile: boolean
}

/**
 * O balão do tour "seguir a request". Os passos e o tempo de cada um vêm do
 * content.ts; este componente só controla a passagem entre eles.
 *
 * - Avança sozinho a cada `ms`. Pausar e voltar reiniciam a contagem da parada.
 * - Com prefers-reduced-motion, não avança sozinho: o visitante usa "próximo".
 * - Desktop: quem move a câmera é o Board (recebe o nodeId atual).
 *   Mobile: não há canvas; aqui mesmo rolamos até a caixa e a destacamos.
 */
export function Tour({ step, onStep, onEnd, mobile }: Props) {
  const reduce = useReducedMotion()
  const [paused, setPaused] = useState(!!reduce)
  const card = useRef<HTMLDivElement>(null)
  const current = tour[step]
  const last = step === tour.length - 1
  const next = () => (last ? onEnd() : onStep(step + 1))

  useEffect(() => card.current?.focus(), [])

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => (last ? onEnd() : onStep(step + 1)), current.ms)
    return () => clearTimeout(t)
  }, [step, paused, last, current.ms, onEnd, onStep])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onEnd()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onEnd])

  useEffect(() => {
    if (!mobile) return
    const el = document.querySelector(`[data-node="${current.nodeId}"]`)
    el?.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' })
    el?.setAttribute('data-tour-active', '')
    return () => el?.removeAttribute('data-tour-active')
  }, [current.nodeId, mobile, reduce])

  return (
    <motion.div
      ref={card}
      tabIndex={-1}
      className={s.card}
      role="region"
      aria-label="Tour: seguir a request"
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <p className={s.text} aria-live="polite">
        {current.text}
      </p>
      {/* Barra de tempo da parada. A key reinicia a animação a cada passo ou retomada. */}
      {!paused && (
        <div
          key={`${step}`}
          className={s.progress}
          style={{ animationDuration: `${current.ms}ms` }}
        />
      )}
      <div className={s.controls}>
        <span className={s.count}>
          {step + 1}/{tour.length}
        </span>
        <button onClick={() => onStep(step - 1)} disabled={step === 0}>
          ← anterior
        </button>
        <button onClick={() => setPaused(!paused)} aria-pressed={paused}>
          {paused ? '▶ continuar' : '❚❚ pausar'}
        </button>
        <button onClick={next}>{last ? 'fim' : 'próximo →'}</button>
        <button onClick={onEnd} className={s.skip}>
          pular
        </button>
      </div>
    </motion.div>
  )
}
