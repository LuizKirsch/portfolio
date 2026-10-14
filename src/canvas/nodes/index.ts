import type { NodeTypes } from '@xyflow/react'
import type { NodeKind } from '../../diagram/model'
import { ActorNode } from './ActorNode'
import { ClusterNode } from './ClusterNode'
import { DatabaseNode } from './DatabaseNode'
import { GatewayNode } from './GatewayNode'
import { ProjectNode } from './ProjectNode'
import { QueueNode } from './QueueNode'
import { ServiceNode } from './ServiceNode'
import { StackFrameNode } from './StackFrameNode'
import { StickyNode } from './StickyNode'
import { TechNode } from './TechNode'

// O `kind` do modelo é o `type` do React Flow. O Record obriga a cobrir todo kind.
export const nodeTypes: Record<NodeKind, NodeTypes[string]> = {
  actor: ActorNode,
  gateway: GatewayNode,
  service: ServiceNode,
  cluster: ClusterNode,
  project: ProjectNode,
  queue: QueueNode,
  sticky: StickyNode,
  database: DatabaseNode,
  stackFrame: StackFrameNode,
  tech: TechNode,
}
