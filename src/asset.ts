/**
 * Caminho de um arquivo de /public com a base do build. No GitHub Pages o site
 * fica em /portfolio/, então "/curriculo.pdf" vira "/portfolio/curriculo.pdf".
 * O content.ts continua escrevendo caminhos a partir da raiz.
 */
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '')
