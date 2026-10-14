import { expect, test, type Page } from '@playwright/test'
import { profile, projects, tour } from '../src/content/content'

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
  test.use({ viewport: { width: 390, height: 844 } })

  test('aparece a lista e não o canvas', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.react-flow')).toHaveCount(0)
    await expect(page.getByRole('heading', { level: 1, name: profile.name })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'projetos-service' })).toBeVisible()

    // Projeto abre em tela cheia.
    await page
      .getByRole('main')
      .getByRole('link', { name: new RegExp(projects[0].title) })
      .click()
    await expect(panelTitle(page)).toHaveText(projects[0].title)
    const box = await page.getByRole('dialog').boundingBox()
    expect(Math.round(box!.width)).toBeGreaterThanOrEqual(388)
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
