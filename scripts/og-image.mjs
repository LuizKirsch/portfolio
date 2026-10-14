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
  // Sem a dica de primeira visita na imagem.
  await page.addInitScript(() => localStorage.setItem('hint-seen', '1'))
  await page.goto(`http://localhost:${port}/`)
  await page.waitForSelector('.react-flow__node-gateway')
  await page.evaluate(() => document.fonts.ready)
  // Minimapa, zoom e "ver tudo" são interface, não fazem parte do desenho.
  await page.addStyleTag({
    content:
      '.react-flow__minimap, .react-flow__controls, .react-flow__panel.bottom.center { display: none }',
  })
  await page.screenshot({ path: 'public/og-image.png' })
  console.log('public/og-image.png gerado')
} finally {
  await browser.close()
  server.httpServer.close()
}
