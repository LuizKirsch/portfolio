/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  // Open Graph exige URL absoluta. Na Vercel, VERCEL_PROJECT_PRODUCTION_URL é o
  // domínio de produção (sem https://). SITE_URL sobrescreve, para domínio próprio.
  const site =
    env.SITE_URL ||
    (env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:5173')

  return {
    plugins: [
      react(),
      {
        name: 'site-url',
        transformIndexHtml: {
          order: 'pre',
          handler: (html) => html.replaceAll('%SITE_URL%', site),
        },
      },
    ],
    // Unitários com Vitest; e2e/ é do Playwright.
    test: { exclude: ['e2e/**', 'node_modules/**'] },
  }
})
