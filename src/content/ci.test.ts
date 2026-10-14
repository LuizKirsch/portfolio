import { expect, it } from 'vitest'
import { checks, ciChecks } from './ci'

it('lê os passos de teste do ci.yml, na ordem, e ignora o resto', () => {
  const yml = `
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
      - run: npm run build`
  expect(ciChecks(yml)).toEqual(['lint · ESLint', 'unit · Vitest', 'e2e · Playwright'])
})

it('o workflow real tem lint, typecheck, unit e e2e', () => {
  expect(checks).toEqual(['lint · ESLint', 'typecheck · tsc', 'unit · Vitest', 'e2e · Playwright'])
})
