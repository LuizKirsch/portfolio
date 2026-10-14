/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  // No GitHub Pages o workflow passa BASE_PATH (ex.: /portfolio) e SITE_URL
  // (ex.: https://luizkirsch.github.io/portfolio), vindos do actions/configure-pages.
  // Open Graph exige URL absoluta; localmente fica localhost.
  const base = env.BASE_PATH ? `${env.BASE_PATH.replace(/\/$/, '')}/` : '/'
  const site = (env.SITE_URL || 'http://localhost:5173').replace(/\/$/, '')

  return {
    base,
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
