import type { ReactNode } from 'react'
import { AnimatePresence } from 'motion/react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router'
import { Board } from './canvas/Board'
import { projects } from './content/content'
import { nodeForRoute } from './diagram/model'
import { Panel } from './panels/Panel'
import { ProjectPanel } from './panels/ProjectPanel'
import { ContatoPanel, ExperienciaPanel, SobrePanel } from './panels/SectionPanels'

const sections: Record<string, { title: string; body: () => ReactNode }> = {
  '/sobre': { title: 'sobre-service', body: SobrePanel },
  '/experiencia': { title: 'experiencia-service', body: ExperienciaPanel },
  '/contato': { title: 'contato-service', body: ContatoPanel },
}

/**
 * A URL decide o painel aberto. O Board fica sempre montado; só o painel
 * entra e sai. Slug de projeto inexistente volta para o início.
 */
export default function App() {
  const { pathname } = useLocation()
  const { slug } = useParams()
  const navigate = useNavigate()

  const project = slug ? projects.find((p) => p.slug === slug) : undefined
  if (slug && !project) return <Navigate to="/" replace />
  const section = sections[pathname]

  // Ao fechar, o foco volta para o nó que abriu o painel (teclado não se perde).
  const close = () => {
    const id = nodeForRoute(pathname)?.id
    navigate('/')
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>(`.react-flow__node[data-id="${id}"]`)?.focus(),
    )
  }

  return (
    <>
      <Board />
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
