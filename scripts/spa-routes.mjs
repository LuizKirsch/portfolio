// O GitHub Pages não tem rewrite de SPA. Para cada rota de painel, gera uma
// cópia do index.html com o nome da rota (sobre.html, projetos/barnout.html):
// o Pages serve /sobre a partir de sobre.html, com status 200, e o React Router
// abre o painel. O 404.html cobre URLs que não existem (o app volta para /).
// Roda depois do vite build (npm run build).
import fs from 'node:fs'
import path from 'node:path'
import { projects, techs } from '../src/content/content.ts'

const dist = 'dist'
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

// Título de cada rota igual ao que o painel põe na aba, para quem lê o HTML sem JS.
const routes = {
  sobre: 'sobre-service',
  experiencia: 'experiencia-service',
  contato: 'contato-service',
  ...Object.fromEntries(projects.map((p) => [`projetos/${p.slug}`, p.title])),
  ...Object.fromEntries(techs.map((t) => [`stack/${t.id}`, t.nome])),
}

for (const [route, title] of Object.entries(routes)) {
  const file = path.join(dist, `${route}.html`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(
    file,
    html.replace(/<title>.*<\/title>/, `<title>${title} · Luiz Kirsch</title>`),
  )
}
fs.writeFileSync(path.join(dist, '404.html'), html)

console.log(`rotas: ${Object.keys(routes).length} + 404.html`)
