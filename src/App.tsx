import type { ReactNode } from 'react'
import { AnimatePresence } from 'motion/react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router'
import { Board } from './canvas/Board'
import { TopBar } from './TopBar'
import { projects } from './content/content'
import { nodeForRoute } from './diagram/model'
import { Panel } from './panels/Panel'
import { ProjectPanel } from './panels/ProjectPanel'
import { ContatoPanel, ExperienciaPanel, SobrePanel } from './panels/SectionPanels'
import { SemanticSite } from './semantic/SemanticSite'
import { MOBILE, useMedia } from './useMedia'

const sections: Record<string, { title: string; body: () => ReactNode }> = {
  '/sobre': { title: 'sobre-service', body: SobrePanel },
  '/experiencia': { title: 'experiencia-service', body: ExperienciaPanel },
  '/contato': { title: 'contato-service', body: ContatoPanel },
}

/**
 * A URL decide o painel aberto. O quadro fica sempre montado; só o painel
 * entra e sai. Slug de projeto inexistente volta para o início.
 *
 * Desktop: canvas + versão semântica oculta (sr-only). Painel lateral, não modal.
 * Mobile: sem canvas; a versão semântica é a interface. Painel em tela cheia,
 * modal: `inert` tira a lista de trás do foco e dos leitores de tela.
 */
export default function App() {
  const { pathname } = useLocation()
  const { slug } = useParams()
  const navigate = useNavigate()
  const mobile = useMedia(MOBILE)

  const project = slug ? projects.find((p) => p.slug === slug) : undefined
  if (slug && !project) return <Navigate to="/" replace />
  const section = sections[pathname]
  const panelOpen = !!(project || section)

  // Ao fechar, o foco volta para o que abriu o painel: o nó no canvas ou o
  // link na lista do mobile. Assim quem navega por teclado não se perde.
  const close = () => {
    const origin = mobile
      ? `main a[href="${pathname}"]`
      : `.react-flow__node[data-id="${nodeForRoute(pathname)?.id}"]`
    navigate('/')
    requestAnimationFrame(() => document.querySelector<HTMLElement>(origin)?.focus())
  }

  return (
    <>
      <TopBar />
      {/* Canvas antes da versão em texto: no desktop o Tab chega primeiro aos nós. */}
      {!mobile && <Board />}
      <SemanticSite mobile={mobile} inert={mobile && panelOpen} />
      <AnimatePresence>
        {project && (
          <Panel key={pathname} title={project.title} onClose={close}>
            <ProjectPanel project={project} />
          </Panel>
        )}
        {section && (
          <Panel key={pathname} title={section.title} onClose={close}>
            <section.body />
          </Panel>
        )}
      </AnimatePresence>
    </>
  )
}
