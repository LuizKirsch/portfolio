/**
 * Tipos de teste do nó GET /health, lidos do próprio workflow no build: se um
 * passo entra ou sai do ci.yml, a lista muda junto. O status (passing/failing)
 * continua vindo do badge do GitHub.
 *
 * Fora do content.ts porque `?raw` é do Vite: o Playwright e o spa-routes.mjs
 * importam o content.ts direto no Node.
 */
import workflow from '../../.github/workflows/ci.yml?raw'

// Comando do `run:` → rótulo no nó, na ordem em que o CI roda.
// ponytail: passo de um tipo novo (ex.: outro test runner) precisa de uma linha aqui.
const known: [RegExp, string][] = [
  [/^npm run lint\b/, 'lint · ESLint'],
  [/^npm run typecheck\b/, 'typecheck · tsc'],
  [/^npm test\b/, 'unit · Vitest'],
  [/^npx playwright test\b/, 'e2e · Playwright'],
]

/** Rótulos dos passos de teste do workflow, na ordem dele. Ignora instalação, build e deploy. */
export function ciChecks(yml: string): string[] {
  return [...yml.matchAll(/^\s*-?\s*run:\s*(.+)$/gm)].flatMap(
    ([, cmd]) => known.find(([re]) => re.test(cmd.trim()))?.[1] ?? [],
  )
}

export const checks = ciChecks(workflow)
