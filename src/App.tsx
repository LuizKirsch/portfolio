import { useLocation } from 'react-router'
import { profile } from './content/content'

// ponytail: placeholder da etapa 1; o canvas entra na etapa 2.
export default function App() {
  const { pathname } = useLocation()
  return (
    <main>
      <h1>{profile.name}</h1>
      <p>{profile.role}</p>
      <code>GET {pathname}</code>
    </main>
  )
}
