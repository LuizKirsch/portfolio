import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/700.css'
import '@fontsource/caveat/500.css'
// O CSS do React Flow vem antes: theme.css sobrescreve as variáveis dele.
import '@xyflow/react/dist/style.css'
import './theme.css'
import App from './App'

// Toda rota renderiza o mesmo App: o quadro fica montado e a URL só decide
// qual painel está aberto e onde a câmera para.
const paths = [
  '/',
  '/sobre',
  '/experiencia',
  '/contato',
  '/projetos',
  '/projetos/:slug',
  '/stack',
  '/stack/:techId',
]

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* basename: no GitHub Pages o site fica em /portfolio/ (ver vite.config). */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {paths.map((path) => (
          <Route key={path} path={path} element={<App />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
