import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { asset } from '../asset'
import { checks } from '../content/ci'
import { camadas, health, profile, projects, techs } from '../content/content'
import { ExperienciaPanel, SobrePanel } from '../panels/SectionPanels'
import { contactLinks, projectRoute, services, techRoute } from '../diagram/model'
import s from './semantic.module.css'

/**
 * Todo o conteúdo do quadro em HTML semântico, na ordem do modelo do diagrama
 * (gateway → cada serviço → seus dados). Fica visualmente oculta, mas é lida por
 * leitores de tela e pelo Google, que não entendem o canvas. Se o foco do teclado
 * entrar nela, ela aparece como "versão em texto" (ver .textOnly no CSS).
 *
 * O estudo de caso completo de cada projeto fica na URL do projeto
 * (/projetos/:slug), que renderiza o painel em HTML. Aqui vai o resumo e o link.
 */
export function SemanticSite() {
  // A ordem das seções é a ordem dos serviços no modelo do diagrama.
  const body: Record<(typeof services)[number]['id'], ReactNode> = {
    // Sobre e experiência reaproveitam os componentes dos painéis.
    sobre: (
      <div className={s.sticky}>
        <SobrePanel />
      </div>
    ),
    projetos: (
      <ul className={s.cluster} aria-label="Projetos">
        {projects.map((p) => (
          <li key={p.slug}>
            <article className={s.box}>
              <h3>
                <Link to={projectRoute(p.slug)}>{p.title} →</Link>
              </h3>
              <p>{p.summary}</p>
            </article>
          </li>
        ))}
      </ul>
    ),
    experiencia: (
      <div className={s.box}>
        <ExperienciaPanel />
      </div>
    ),
    contato: (
      <ul className={s.contacts}>
        {contactLinks.map((c) => (
          <li key={c.id} className={s.blue}>
            <a href={c.href} target="_blank" rel="noreferrer">
              {c.id === 'email' ? profile.email : `${c.label} ↗`}
            </a>
          </li>
        ))}
      </ul>
    ),
    stack: (
      <div className={s.cluster}>
        {camadas.map((c) => (
          <section key={c.id} aria-label={c.label}>
            <h3>{c.label}</h3>
            <ul className={s.chips}>
              {techs
                .filter((t) => t.camada === c.id)
                .map((t) => (
                  <li key={t.id}>
                    <Link to={techRoute(t.id)}>{t.nome}</Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    ),
  }

  return (
    <main className={s.textOnly}>
      <p className={s.actor} aria-hidden="true">
        visitante → GET /luiz
      </p>

      <header className={`${s.box} ${s.gateway}`}>
        <span className={s.tag}>gateway</span>
        <h1>{profile.name}</h1>
        <p>
          {profile.role} na {profile.company} · {profile.location}
        </p>
        <ul className={s.chips} aria-label="Stack principal">
          {profile.stack.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className={s.hand}>{profile.tagline}</p>
        <a className={s.cv} href={asset(profile.cv)} download>
          currículo.pdf ↓
        </a>
        <p>
          <a href={health.actions} target="_blank" rel="noreferrer">
            GET /health: status do CI ↗
          </a>{' '}
          ({checks.join(', ')})
        </p>
      </header>

      {services.map((svc) => (
        <section key={svc.id} aria-labelledby={`h-${svc.id}`}>
          <Arrow label={svc.route} />
          <h2 id={`h-${svc.id}`} className={`${s.box} ${s.service}`}>
            <span className={s.tag}>service</span>
            {/* Serviço sem painel (/projetos, /stack): o título só nomeia a seção. */}
            {!svc.panel ? svc.label : <Link to={svc.route}>{svc.label}</Link>}
          </h2>
          <Arrow />
          {body[svc.id]}
        </section>
      ))}
    </main>
  )
}

// Seta vertical do diagrama, desenhada em CSS. Decorativa para leitores de tela.
function Arrow({ label }: { label?: string }) {
  return (
    <div className={s.arrow} aria-hidden="true">
      {label && <span className={s.hand}>{label}</span>}
    </div>
  )
}
