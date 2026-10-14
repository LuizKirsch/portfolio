import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence } from 'motion/react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router'
import { Board } from './canvas/Board'
import { TopBar } from './TopBar'
import { projects, tour } from './content/content'
import { nodeForRoute } from './diagram/model'
import { Panel } from './panels/Panel'
import { ProjectPanel } from './panels/ProjectPanel'
import { ContatoPanel, ExperienciaPanel, SobrePanel } from './panels/SectionPanels'
import { SemanticSite } from './semantic/SemanticSite'
import { Tour } from './tour/Tour'
import { MOBILE, useMedia } from './useMedia'

const sections: Record<string, { title: string; body: () => ReactNode }> = {
  '/sobre': { title: 'sobre-service', body: SobrePanel },
  '/experiencia': { title: 'experiencia-service', body: ExperienciaPanel },
  '/contato': { title: 'contato-service', body: ContatoPanel },
}

/**
 * A URL decide qual painel está aberto; o quadro fica montado o tempo todo.
 * Slug de projeto inexistente volta para o início.
 *
 * Desktop: canvas + versão semântica oculta, painel lateral não modal.
 * Mobile: só a versão semântica, painel em tela cheia e `inert` na lista atrás dele.
 */
export default function App() {
  const { pathname } = useLocation()
  const { slug } = useParams()
  const navigate = useNavigate()
  const mobile = useMedia(MOBILE)

  // Tour: índice da parada atual, ou null quando não está rodando.
  // Cada parada abre o painel da sua rota (ou fecha, se não tiver).
  const [tourStep, setTourStep] = useState<number | null>(null)
  const [seenPath, setSeenPath] = useState(pathname)
  const goToStep = useCallback(
    (i: number) => {
      setTourStep(i)
      navigate(tour[i].route ?? '/')
    },
    [navigate],
  )
  const endTour = useCallback(() => {
    setTourStep(null)
    navigate('/')
  }, [navigate])
  // Se a URL saiu da parada atual (outro nó, painel fechado, voltar do navegador),
  // o tour acaba. Só checa quando a URL muda, porque o navigate aplica a URL um
  // render depois do setTourStep.
  if (pathname !== seenPath) {
    setSeenPath(pathname)
    if (tourStep !== null && pathname !== (tour[tourStep].route ?? '/')) setTourStep(null)
  }
  const touring = tourStep !== null

  // Ao fechar um painel, o foco volta para o que o abriu. Fica num efeito porque
  // o navigate aplica a URL um render depois: antes disso a lista do mobile
  // ainda está inert e não aceita foco.
  const returnFocus = useRef<string | null>(null)
  useEffect(() => {
    if (pathname !== '/' || !returnFocus.current) return
    document.querySelector<HTMLElement>(returnFocus.current)?.focus()
    returnFocus.current = null
  }, [pathname])

  const project = slug ? projects.find((p) => p.slug === slug) : undefined
  if (slug && !project) return <Navigate to="/" replace />
  const section = sections[pathname]
  const panelOpen = !!(project || section)

  // Origem do painel: o nó (desktop) ou o link (mobile). href$= porque no
  // GitHub Pages o href do link tem o prefixo da base.
  const close = () => {
    returnFocus.current = mobile
      ? `main a[href$="${pathname}"]`
      : `.react-flow__node[data-id="${nodeForRoute(pathname)?.id}"]`
    navigate('/')
  }

  return (
    <>
      <TopBar onTour={() => goToStep(0)} />
      {/* Canvas antes da versão em texto: no desktop o Tab chega primeiro aos nós. */}
      {!mobile && <Board tour={touring ? tour[tourStep] : undefined} />}
      <SemanticSite mobile={mobile} inert={mobile && panelOpen} onTour={() => goToStep(0)} />
      <AnimatePresence>
        {touring && (
          <Tour key="tour" step={tourStep} onStep={goToStep} onEnd={endTour} mobile={mobile} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {/* No tour o foco fica nos botões do balão, não no título do painel. */}
        {project && (
          <Panel key={pathname} title={project.title} onClose={close} autoFocus={!touring}>
            <ProjectPanel project={project} />
          </Panel>
        )}
        {section && (
          <Panel key={pathname} title={section.title} onClose={close} autoFocus={!touring}>
            <section.body />
          </Panel>
        )}
      </AnimatePresence>
    </>
  )
}
