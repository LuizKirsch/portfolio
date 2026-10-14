import { about, education, experiences, projects, type TourStep } from '../content/content'

// Leitura em português, texto técnico: ~200 palavras por minuto.
const WPM = 200
// Margem para a câmera chegar e o painel abrir.
const BASE_MS = 4000

const words = (texts: string[]) => texts.join(' ').split(/\s+/).filter(Boolean).length

/** O texto que o painel de cada rota mostra. Rota sem painel → só o balão. */
function panelText(route: string): string[] {
  if (route === '/sobre') return [...about, ...education.map((e) => `${e.course} ${e.school}`)]
  if (route === '/experiencia')
    return experiences.flatMap((e) => [e.title, e.org, e.summary, ...e.highlights])
  const p = projects.find((p) => route === `/projetos/${p.slug}`)
  if (p) return [p.summary, ...p.problem, ...p.decisions, ...p.role, ...p.result]
  return []
}

/**
 * Quanto tempo o tour fica numa parada. Passo com `ms` fixo usa o fixo; passo
 * que abre painel ganha o tempo de ler o balão e o painel.
 */
export function stepMs(step: TourStep): number {
  if (step.ms) return step.ms
  const texts = [step.text, ...(step.route ? panelText(step.route) : [])]
  return BASE_MS + Math.round((words(texts) / WPM) * 60_000)
}
