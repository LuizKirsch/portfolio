import { expect, test, type Page } from '@playwright/test'
import { health, profile, projects, tour } from '../src/content/content'

// Os testes leem o content.ts: projeto novo ou parada nova do tour entram aqui sozinhos.

const panelTitle = (page: Page) => page.getByRole('dialog').getByRole('heading', { level: 2 })
const selectedNode = (page: Page) => page.locator('.react-flow__node.selected')

test('1. a página carrega e mostra o gateway', async ({ page }) => {
  await page.goto('/')
  const gateway = page.locator('.react-flow__node-gateway')
  await expect(gateway).toBeVisible()
  await expect(gateway).toContainText(profile.name)
  await expect(gateway).toContainText(profile.role)
})

for (const p of projects) {
  test(`2. clicar em ${p.title} abre o painel certo e muda a URL`, async ({ page }) => {
    await page.goto('/')
    // A abertura foca os post-its; "ver tudo" deixa o cluster de projetos na tela.
    await page.getByRole('button', { name: 'ver tudo' }).click()
    await page.locator(`.react-flow__node[data-id="project-${p.slug}"]`).click()
    await expect(page).toHaveURL(`/projetos/${p.slug}`)
    await expect(panelTitle(page)).toHaveText(p.title)
  })
}

test('3. abrir /projetos/barnout direto abre o painel', async ({ page }) => {
  await page.goto('/projetos/barnout')
  await expect(panelTitle(page)).toHaveText('BarNout')
  await expect(selectedNode(page)).toHaveAttribute('data-id', 'project-barnout')
  await expect(page).toHaveTitle(/BarNout/)
})

test('4. o tour percorre todas as etapas e pode ser pulado', async ({ page }) => {
  await page.goto('/')
  const start = page.getByRole('banner').getByRole('button', { name: /seguir a request/ })
  const card = page.getByRole('region', { name: /Tour/ })

  // Com movimento reduzido (ver playwright.config) o tour não avança sozinho.
  await start.click()
  for (const [i, step] of tour.entries()) {
    await expect(card).toContainText(`${i + 1}/${tour.length}`)
    await expect(card).toContainText(step.text)
    await expect(page).toHaveURL(step.route ?? '/')
    await expect(selectedNode(page)).toHaveAttribute('data-id', step.nodeId)
    const last = i === tour.length - 1
    await card.getByRole('button', { name: last ? 'fim' : /próximo/ }).click()
  }
  await expect(card).toBeHidden()
  await expect(page).toHaveURL('/')

  // Pular no meio, com um painel aberto, encerra o tour e fecha o painel.
  await start.click()
  const withPanel = tour.findIndex((s) => s.route)
  for (let i = 0; i < withPanel; i++) await card.getByRole('button', { name: /próximo/ }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await card.getByRole('button', { name: 'pular' }).click()
  await expect(card).toBeHidden()
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(page).toHaveURL('/')
})

test.describe('5. mobile', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true })

  test('mostra o mesmo quadro, e o painel abre em tela cheia', async ({ page }) => {
    const node = page.locator(`.react-flow__node[data-id="project-${projects[0].slug}"]`)
    await page.goto('/')
    await expect(page.locator('.react-flow__node-gateway')).toBeVisible()
    await expect(page.locator('.react-flow__node[data-id="como-funciona"]')).toBeInViewport()
    // O minimapa não cabe no celular.
    await expect(page.locator('.react-flow__minimap')).toBeHidden()

    // "ver tudo" põe o quadro inteiro na tela; um toque no projeto abre o painel.
    await page.getByRole('button', { name: 'ver tudo' }).tap()
    await expect(node).toBeInViewport()
    await node.tap()
    await expect(panelTitle(page)).toHaveText(projects[0].title)
    const box = await page.getByRole('dialog').boundingBox()
    expect(Math.round(box!.width)).toBeGreaterThanOrEqual(388)

    // Esc fecha e o foco volta para o nó que abriu o painel.
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(node).toBeFocused()
  })
})

test('8. GET /health mostra o badge do CI e abre o Actions numa nova aba', async ({ page }) => {
  await page.goto('/')
  const link = page.locator('.react-flow__node[data-id="health"] a')
  await expect(link).toHaveAttribute('href', health.actions)
  await expect(link).toHaveAttribute('target', '_blank')
  await expect(link.locator('img')).toHaveAttribute('src', health.badge)
  // Lidos do ci.yml no build (src/content/ci.ts).
  for (const c of ['lint · ESLint', 'typecheck · tsc', 'unit · Vitest', 'e2e · Playwright'])
    await expect(link).toContainText(c)
})

test.describe('7. stack', () => {
  const node = (page: Page, id: string) => page.locator(`.react-flow__node[data-id="${id}"]`)
  const mark = (page: Page, id: string) => node(page, id).locator('[data-stack]').first()
  const cargo = (page: Page, i: number) => node(page, 'queue').locator('li').nth(i)

  test('clicar em Laravel destaca os usos e esmaece o resto', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'ver tudo' }).click()
    await node(page, 'tech-laravel').click()
    await expect(page).toHaveURL('/stack/laravel')
    await expect(panelTitle(page)).toHaveText('Laravel')

    await expect(mark(page, 'tech-laravel')).toHaveAttribute('data-stack', 'selecionada')
    await expect(mark(page, 'tech-php')).toHaveAttribute('data-stack', 'junto')
    await expect(mark(page, 'project-barnout')).toHaveAttribute('data-stack', 'uso')
    await expect(mark(page, 'project-tenancy-laravel')).toHaveAttribute('data-stack', 'uso')
    await expect(mark(page, 'project-agenda')).toHaveAttribute('data-stack', 'fora')
    // Fila: QA (fora), Dev Jr, F&B Jr, F&B Pleno (uso).
    await expect(cargo(page, 0)).toHaveAttribute('data-stack', 'fora')
    for (const i of [1, 2, 3]) await expect(cargo(page, i)).toHaveAttribute('data-stack', 'uso')
    // Uma seta temporária por uso.
    await expect(page.locator('.react-flow__edge[data-id^="uso:"]')).toHaveCount(5)
  })

  test('/stack/laravel abre direto o painel, e Esc limpa o destaque', async ({ page }) => {
    await page.goto('/stack/laravel')
    await expect(panelTitle(page)).toHaveText('Laravel')
    await expect(page.getByRole('dialog')).toContainText('BarNout')
    await expect(page.locator('[data-stack]').first()).toBeAttached()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(page).toHaveURL('/')
    await expect(page.locator('[data-stack]')).toHaveCount(0)
    await expect(page.locator('.react-flow__edge[data-id^="uso:"]')).toHaveCount(0)
  })

  test('teclado: Tab chega nos chips e Enter abre', async ({ page }) => {
    await page.goto('/')
    await node(page, 'tech-react').focus()
    await page.keyboard.press('Tab')
    await expect(node(page, 'tech-nextjs')).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL('/stack/nextjs')
  })
})

for (const viewport of [
  { width: 1400, height: 800 },
  { width: 390, height: 844 },
]) {
  test(`6. currículo, LinkedIn e GitHub estão visíveis (${viewport.width}px)`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')
    const bar = page.getByRole('banner')
    await expect(bar.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      profile.linkedin,
    )
    await expect(bar.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', profile.github)
    const cv = bar.getByRole('link', { name: /currículo\.pdf/ })
    await expect(cv).toBeVisible()
    await expect(cv).toHaveAttribute('href', profile.cv)

    // O PDF existe de verdade (não é o index.html do fallback de SPA).
    const res = await page.request.get(profile.cv)
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('pdf')
  })
}
