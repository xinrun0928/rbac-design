import type { WorkflowNode, WorkflowEdge, ValidationIssue, NodeType } from '@/types/workflow'

/**
 * BPMN 最小校验集：
 *  1. 必有且仅有一个开始事件
 *  2. 至少有一个结束事件
 *  3. 所有节点至少有一条入边或出边（孤立节点警告）
 *  4. 连线指向合法存在的端点
 *  5. 排他网关出口最多一条为默认流
 *  6. 并行网关出口不应有条件表达式
 *  7. 网关节点不允许自身无出口也无入口
 *  8. 任务节点不能成为起点/终点之一（流程必须有开始/结束事件）
 */
export function validateBpmn(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // 端点合法性
  const nodeIds = new Set(nodes.map(n => n.id))
  edges.forEach(e => {
    if (!nodeIds.has(e.sourceId)) {
      issues.push({
        severity: 'error',
        targetId: e.id,
        targetType: 'edge',
        message: `连线起点不存在：${e.sourceId}`
      })
    }
    if (!nodeIds.has(e.targetId)) {
      issues.push({
        severity: 'error',
        targetId: e.id,
        targetType: 'edge',
        message: `连线终点不存在：${e.targetId}`
      })
    }
  })

  // 出/入度
  const indeg = new Map<string, number>()
  const outdeg = new Map<string, number>()
  nodes.forEach(n => { indeg.set(n.id, 0); outdeg.set(n.id, 0) })
  edges.forEach(e => {
    if (nodeIds.has(e.sourceId)) outdeg.set(e.sourceId, (outdeg.get(e.sourceId) || 0) + 1)
    if (nodeIds.has(e.targetId)) indeg.set(e.targetId, (indeg.get(e.targetId) || 0) + 1)
  })

  // 开始事件：唯一
  const starts = nodes.filter(n => n.type === 'start')
  if (starts.length === 0) {
    issues.push({ severity: 'error', message: '流程缺少开始事件' })
  } else if (starts.length > 1) {
    starts.forEach(s => {
      issues.push({
        severity: 'error',
        targetId: s.id,
        targetType: 'node',
        message: `开始事件只能有一个（当前 ${starts.length} 个）`
      })
    })
  }

  // 开始事件：必须无入边
  starts.forEach(s => {
    if ((indeg.get(s.id) || 0) > 0) {
      issues.push({
        severity: 'error',
        targetId: s.id,
        targetType: 'node',
        message: '开始事件不能有入边'
      })
    }
  })

  // 结束事件：至少一个；无出边
  const ends = nodes.filter(n => n.type === 'end' || n.type === 'error-end')
  if (ends.length === 0) {
    issues.push({ severity: 'error', message: '流程缺少结束事件' })
  }
  ends.forEach(e => {
    if ((outdeg.get(e.id) || 0) > 0) {
      issues.push({
        severity: 'error',
        targetId: e.id,
        targetType: 'node',
        message: '结束事件不能有出边'
      })
    }
  })

  // 孤立节点警告
  nodes.forEach(n => {
    const inD = indeg.get(n.id) || 0
    const outD = outdeg.get(n.id) || 0
    if (inD === 0 && outD === 0) {
      issues.push({
        severity: 'warning',
        targetId: n.id,
        targetType: 'node',
        message: `节点「${n.label || n.id}」孤立：既无入边也无出边`
      })
    }
  })

  // 网关约束
  const gateways: NodeType[] = ['parallel-gateway', 'exclusive-gateway', 'inclusive-gateway', 'event-gateway']
  nodes.forEach(n => {
    if (gateways.includes(n.type)) {
      const outD = outdeg.get(n.id) || 0
      if (outD < 2) {
        issues.push({
          severity: 'warning',
          targetId: n.id,
          targetType: 'node',
          message: `网关「${n.label || n.id}」出口少于 2 条，可能导致流程意外终止`
        })
      }
    }
  })

  // 排他网关：默认流最多 1 条
  nodes.forEach(n => {
    if (n.type === 'exclusive-gateway') {
      const defaultCount = edges.filter(e => e.sourceId === n.id && e.isDefault).length
      if (defaultCount > 1) {
        issues.push({
          severity: 'error',
          targetId: n.id,
          targetType: 'node',
          message: '排他网关出口的默认流（default）只能有一条'
        })
      }
    }
  })

  // 并行网关出口不应有条件
  nodes.forEach(n => {
    if (n.type === 'parallel-gateway') {
      edges.forEach(e => {
        if (e.sourceId === n.id && e.condition) {
          issues.push({
            severity: 'warning',
            targetId: e.id,
            targetType: 'edge',
            message: '并行网关出口不应设置条件表达式'
          })
        }
      })
    }
  })

  // 不可达节点（简单 BFS）
  if (starts.length === 1) {
    const reachable = new Set<string>()
    const stack = [starts[0].id]
    while (stack.length) {
      const cur = stack.pop()!
      if (reachable.has(cur)) continue
      reachable.add(cur)
      edges.forEach(e => {
        if (e.sourceId === cur && !reachable.has(e.targetId)) stack.push(e.targetId)
      })
    }
    nodes.forEach(n => {
      if (n.type !== 'start' && !reachable.has(n.id)) {
        issues.push({
          severity: 'warning',
          targetId: n.id,
          targetType: 'node',
          message: `节点「${n.label || n.id}」从开始事件不可达`
        })
      }
    })
  }

  return issues
}