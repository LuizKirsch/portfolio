// Gera public/og-image.png (1200×630) a partir do próprio quadro.
// Uso: npm run og  (faz o build antes, porque serve o dist/ com o vite preview)
import { chromium } from '@playwright/test'
import { preview } from 'vite'

const port = 4174
const server = await preview({ preview: { port, strictPort: true } })
const browser = await chromium.launch()

try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    colorScheme: 'light',
    reducedMotion: 'reduce',
  })
  await page.goto(`http://localhost:${port}/`)
  await page.waitForSelector('.react-flow__node-gateway')
  await page.evaluate(() => document.fonts.ready)
  // A abertura foca os post-its de como usar; a imagem mostra o quadro inteiro.
  // Com reducedMotion o "ver tudo" é instantâneo.
  await page.getByRole('button', { name: 'ver tudo' }).click()
  await page.waitForTimeout(100)
  // Minimapa, zoom e "ver tudo" ficam fora da imagem.
  await page.addStyleTag({
    content:
      '.react-flow__minimap, .react-flow__controls, .react-flow__panel.center { display: none }',
  })
  await page.screenshot({ path: 'public/og-image.png' })
  console.log('public/og-image.png gerado')
} finally {
  await browser.close()
  server.httpServer.close()
}
