import { useParams } from 'react-router'
import { getUsages, isTechId, usedWith, type Usage } from '../content/stack'

/**
 * Tecnologia aberta em /stack/:techId. O destaque no quadro sai daqui, da URL:
 * fechar o painel (Esc, ×, voltar) limpa tudo sem estado extra.
 */
export function useSelectedTech() {
  const { techId } = useParams()
  return isTechId(techId) ? techId : undefined
}

/**
 * Vira `data-stack` no nó; o CSS pinta por ele. Sem tecnologia aberta, nada.
 * - selecionada: o chip clicado (fundo azul)
 * - junto: tecnologia usada nos mesmos projetos (borda azul)
 * - uso: projeto ou cargo onde a tecnologia foi usada
 * - fora: o resto, esmaecido
 */
export type StackMark = 'selecionada' | 'junto' | 'uso' | 'fora' | undefined

export function useStackMarks(): (kind: Usage['kind'] | 'tech', id: string) => StackMark {
  const tech = useSelectedTech()
  if (!tech) return () => undefined
  const usages = getUsages(tech)
  const junto = new Set<string>(usedWith(tech))
  return (kind, id) => {
    if (kind === 'tech') return id === tech ? 'selecionada' : junto.has(id) ? 'junto' : 'fora'
    return usages.some((u) => u.kind === kind && u.id === id) ? 'uso' : 'fora'
  }
}
