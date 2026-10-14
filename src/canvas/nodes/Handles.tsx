import { Handle, Position } from '@xyflow/react'
import s from './nodes.module.css'

/**
 * Cada nó tem um ponto de conexão em cada lado, como origem e como destino.
 * O Board escolhe o lado de cada aresta pela posição relativa dos nós, então
 * mover um nó no layout.ts não exige reconfigurar as setas.
 */
const sides = [
  ['t', Position.Top],
  ['r', Position.Right],
  ['b', Position.Bottom],
  ['l', Position.Left],
] as const

export function Handles() {
  return sides.map(([id, pos]) => [
    <Handle key={`s${id}`} id={`s-${id}`} type="source" position={pos} className={s.handle} />,
    <Handle key={`t${id}`} id={`t-${id}`} type="target" position={pos} className={s.handle} />,
  ])
}
