import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { tour } from '../content/content'
import { stepMs } from './timing'
import s from './tour.module.css'

type Props = {
  step: number
  onStep: (step: number) => void
  onEnd: () => void
  mobile: boolean
}

/**
 * O balão do tour "seguir a request". Os passos vêm do content.ts e o tempo de
 * cada um de timing.ts (fixo ou proporcional ao texto do painel que a parada abre).
 * Quem abre o painel é o App, ao trocar de parada; aqui só se controla a passagem.
 *
 * - Avança sozinho no fim do tempo da parada. Pausar congela a barra e o tempo;
 *   continuar retoma de onde parou. Anterior/próximo recomeçam a parada.
 * - Com prefers-reduced-motion, não avança sozinho: o visitante usa "próximo".
 * - Quem move a câmera é o Board, que recebe a parada atual.
 */
export function Tour({ step, onStep, onEnd, mobile }: Props) {
  const reduce = useReducedMotion()
  const [paused, setPaused] = useState(!!reduce)
  const card = useRef<HTMLDivElement>(null)
  const current = tour[step]
  const ms = stepMs(current)
  const last = step === tour.length - 1
  const next = () => (last ? onEnd() : onStep(step + 1))

  useEffect(() => card.current?.focus(), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onEnd()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onEnd])

  return (
    <motion.div
      ref={card}
      tabIndex={-1}
      // Com painel aberto no desktop, o balão vai para a metade livre da tela.
      className={`${s.card} ${current.route && !mobile ? s.withPanel : ''}`}
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
      {/* Quando a animação da barra termina, o tour avança. Pausar congela a
          animação (e com ela o tempo); o navegador também congela com a aba em
          segundo plano. A key recomeça a animação a cada parada. */}
      <div
        key={step}
        className={s.progress}
        style={{ animationDuration: `${ms}ms`, animationPlayState: paused ? 'paused' : 'running' }}
        onAnimationEnd={next}
      />
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
