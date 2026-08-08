/**
 * 工作流 ↔ BPMN 2.0 XML 转换器
 *
 * 出于轻量考虑，不引入 bpmn-moddle 等依赖，手写 BPMN XML 序列化/解析。
 * 符合 BPMN 2.0 标准（OMG 规范）:
 *   - 命名空间: http://www.omg.org/spec/BPMN/20100524/MODEL
 *   - DI 命名空间: http://www.omg.org/spec/BPMN/20100524/DI
 *   - 节点位置用 BPMNShape/BPMNEdge + Bounds 表达
 *
 * 覆盖本设计器支持的 14 种节点类型 → 对应 BPMN 元素：
 *   事件（Event）：
 *     start              → bpmn:startEvent
 *     end                → bpmn:endEvent
 *     message-intermediate → bpmn:intermediateThrowEvent + messageEventDefinition
 *     timer-intermediate   → bpmn:intermediateThrowEvent + timerEventDefinition
 *     error-end          → bpmn:endEvent + errorEventDefinition
 *   任务（Task）：
 *     user-task    → bpmn:userTask
 *     manual-task  → bpmn:manualTask
 *     service-task → bpmn:serviceTask
 *     script-task  → bpmn:scriptTask
 *     receive-task → bpmn:receiveTask
 *   网关（Gateway）：
 *     parallel-gateway  → bpmn:parallelGateway
 *     exclusive-gateway → bpmn:exclusiveGateway
 *     inclusive-gateway → bpmn:inclusiveGateway
 *     event-gateway     → bpmn:eventBasedGateway
 */

import type { WorkflowNode, WorkflowEdge, NodeType } from '@/types/workflow'

/* ========== 类型映射表（节点类型 ↔ BPMN 元素名 + 扩展子元素） ========== */

interface BpmnNodeSpec {
  /** 元素名（不带命名空间前缀） */
  tag: string
  /** 是否事件节点（需要 EventDefinitions 子元素） */
  eventDefTag?: 'messageEventDefinition' | 'timerEventDefinition' | 'errorEventDefinition'
  /** 网关默认是否设置 default 出口（仅 exclusive 网关需要） */
  isExclusive?: boolean
}

const NODE_SPEC: Record<NodeType, BpmnNodeSpec> = {
  start:                    { tag: 'startEvent' },
  end:                      { tag: 'endEvent' },
  'message-intermediate':   { tag: 'intermediateThrowEvent', eventDefTag: 'messageEventDefinition' },
  'timer-intermediate':     { tag: 'intermediateThrowEvent', eventDefTag: 'timerEventDefinition' },
  'error-end':              { tag: 'endEvent',                eventDefTag: 'errorEventDefinition' },
  'user-task':              { tag: 'userTask' },
  'manual-task':            { tag: 'manualTask' },
  'service-task':           { tag: 'serviceTask' },
  'script-task':            { tag: 'scriptTask' },
  'receive-task':           { tag: 'receiveTask' },
  'parallel-gateway':       { tag: 'parallelGateway' },
  'exclusive-gateway':      { tag: 'exclusiveGateway', isExclusive: true },
  'inclusive-gateway':      { tag: 'inclusiveGateway' },
  'event-gateway':          { tag: 'eventBasedGateway' }
}

/* ========== XML 工具 ========== */

const NS_BPMN = 'http://www.omg.org/spec/BPMN/20100524/MODEL'
const NS_BPMNDI = 'http://www.omg.org/spec/BPMN/20100524/DI'
const NS_DC = 'http://www.omg.org/spec/DD/20100524/DC'
const NS_DI = 'http://www.omg.org/spec/DD/20100524/DI'
const NS_XSI = 'http://www.w3.org/2001/XMLSchema-instance'

/** 转义 XML 文本 */
function escXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** 生成短 id（BPMN id 必须 NCName，本设计器 id 已符合） */
function safeId(id: string): string {
  // BPMN id 不能含空格和特殊字符，强制规范化
  return id.replace(/[^A-Za-z0-9_\-]/g, '_')
}

/* ========== 导出：BPMN XML ========== */

export function exportBpmnXml(nodes: WorkflowNode[], edges: WorkflowEdge[]): string {
  const processId = 'Process_' + Date.now().toString(36)
  const lines: string[] = []

  // XML 声明 + definitions 根
  lines.push('<?xml version="1.0" encoding="UTF-8"?>')
  lines.push(
    `<bpmn:definitions xmlns:bpmn="${NS_BPMN}" ` +
      `xmlns:bpmndi="${NS_BPMNDI}" ` +
      `xmlns:dc="${NS_DC}" ` +
      `xmlns:di="${NS_DI}" ` +
      `xmlns:xsi="${NS_XSI}" ` +
      `id="Definitions_1" targetNamespace="${NS_BPMN}">`
  )

  // bpmn:process
  lines.push(`  <bpmn:process id="${escXml(processId)}" isExecutable="true">`)

  // 默认出口：仅当存在 exclusive-gateway 时输出
  const exclusiveIds = new Set(
    nodes.filter((n) => n.type === 'exclusive-gateway').map((n) => n.id)
  )

  // ========== FlowElements：节点 ==========
  for (const node of nodes) {
    const spec = NODE_SPEC[node.type]
    if (!spec) continue
    const id = safeId(node.id)
    const nameAttr = node.label ? ` name="${escXml(node.label)}"` : ''
    const hasDoc = !!node.documentation
    const hasEventDef = !!spec.eventDefTag

    // 自闭合 vs 双标签
    if (!hasDoc && !hasEventDef) {
      lines.push(`    <bpmn:${spec.tag} id="${id}"${nameAttr} />`)
      continue
    }

    // 双标签
    lines.push(`    <bpmn:${spec.tag} id="${id}"${nameAttr}>`)
    if (hasEventDef) {
      lines.push(`      <bpmn:${spec.eventDefTag} id="EventDef_${id}" />`)
    }
    if (hasDoc) {
      lines.push(`      <bpmn:documentation>${escXml(node.documentation!)}</bpmn:documentation>`)
    }
    lines.push(`    </bpmn:${spec.tag}>`)
  }

  // ========== FlowElements：连线 ==========
  for (const edge of edges) {
    const id = safeId(edge.id)
    const sourceId = safeId(edge.sourceId)
    const targetId = safeId(edge.targetId)
    const nameAttr = edge.label ? ` name="${escXml(edge.label)}"` : ''

    // 找到对应的源节点类型以决定 isDefault
    const srcNode = nodes.find((n) => n.id === edge.sourceId)
    const isDefaultAttr =
      srcNode && exclusiveIds.has(srcNode.id) && edge.isDefault ? ' isDefault="true"' : ''

    if (!edge.condition) {
      // 自闭合
      lines.push(
        `    <bpmn:sequenceFlow id="${id}" sourceRef="${sourceId}" targetRef="${targetId}"${nameAttr}${isDefaultAttr} />`
      )
      continue
    }
    // 双标签 + 条件
    lines.push(
      `    <bpmn:sequenceFlow id="${id}" sourceRef="${sourceId}" targetRef="${targetId}"${nameAttr}${isDefaultAttr}>`
    )
    lines.push(
      `      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">${escXml(edge.condition)}</bpmn:conditionExpression>`
    )
    lines.push(`    </bpmn:sequenceFlow>`)
  }

  lines.push(`  </bpmn:process>`)

  // ========== BPMNDiagram（图形位置） ==========
  const diagramId = 'BPMNDiagram_1'
  const planeId = 'BPMNPlane_' + processId
  lines.push(`  <bpmndi:BPMNDiagram id="${diagramId}">`)
  lines.push(`    <bpmndi:BPMNPlane id="${planeId}" bpmnElement="${escXml(processId)}">`)

  // 节点形状
  for (const node of nodes) {
    const id = safeId(node.id)
    lines.push(`      <bpmndi:BPMNShape id="${id}_di" bpmnElement="${id}">`)
    lines.push(
      `        <dc:Bounds x="${Math.round(node.x)}" y="${Math.round(node.y)}" width="${Math.round(node.width)}" height="${Math.round(node.height)}" />`
    )
    lines.push(`      </bpmndi:BPMNShape>`)
  }

  // 连线（用 waypoint 直连中心 → 中心，简单但够用）
  for (const edge of edges) {
    const id = safeId(edge.id)
    const s = nodes.find((n) => n.id === edge.sourceId)
    const t = nodes.find((n) => n.id === edge.targetId)
    if (!s || !t) continue
    const sx = s.x + s.width / 2
    const sy = s.y + s.height / 2
    const tx = t.x + t.width / 2
    const ty = t.y + t.height / 2
    lines.push(`      <bpmndi:BPMNEdge id="${id}_di" bpmnElement="${id}">`)
    lines.push(`        <di:waypoint x="${Math.round(sx)}" y="${Math.round(sy)}" />`)
    lines.push(`        <di:waypoint x="${Math.round(tx)}" y="${Math.round(ty)}" />`)
    lines.push(`      </bpmndi:BPMNEdge>`)
  }

  lines.push(`    </bpmndi:BPMNPlane>`)
  lines.push(`  </bpmndi:BPMNDiagram>`)
  lines.push(`</bpmn:definitions>`)

  return lines.join('\n')
}

/* ========== 导入：BPMN XML → 工作流结构 ========== */

interface ParsedNode {
  id: string
  type: NodeType
  label: string
  documentation?: string
  x: number
  y: number
  width: number
  height: number
}

interface ParsedEdge {
  id: string
  sourceId: string
  targetId: string
  label?: string
  condition?: string
  isDefault?: boolean
}

/** 通过 localName 反查 BPMN 元素对应的本设计器类型 */
function findTypeByTag(localName: string, eventDefTags: string[]): NodeType | null {
  if (localName === 'startEvent') return 'start'
  if (localName === 'endEvent') {
    if (eventDefTags.includes('errorEventDefinition')) return 'error-end'
    return 'end'
  }
  if (localName === 'intermediateThrowEvent' || localName === 'intermediateCatchEvent') {
    if (eventDefTags.includes('messageEventDefinition')) return 'message-intermediate'
    if (eventDefTags.includes('timerEventDefinition')) return 'timer-intermediate'
    // 未识别事件类型 → 默认按消息
    return 'message-intermediate'
  }
  if (localName === 'userTask') return 'user-task'
  if (localName === 'manualTask') return 'manual-task'
  if (localName === 'serviceTask') return 'service-task'
  if (localName === 'scriptTask') return 'script-task'
  if (localName === 'receiveTask') return 'receive-task'
  if (localName === 'parallelGateway') return 'parallel-gateway'
  if (localName === 'exclusiveGateway') return 'exclusive-gateway'
  if (localName === 'inclusiveGateway') return 'inclusive-gateway'
  if (localName === 'eventBasedGateway') return 'event-gateway'
  return null
}

export interface BpmnImportResult {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

/**
 * 解析 BPMN XML，返回节点和边
 * 容错处理：忽略无法识别的元素；尽可能还原坐标/标签
 */
export function importBpmnXml(xml: string): BpmnImportResult | null {
  if (!xml.trim()) return null
  let doc: XMLDocument
  try {
    doc = new DOMParser().parseFromString(xml, 'application/xml')
  } catch {
    return null
  }

  // 解析器错误
  const parseError = doc.querySelector('parsererror')
  if (parseError) return null

  const allElements = Array.from(doc.getElementsByTagName('*'))
  const parsedNodes: ParsedNode[] = []
  const parsedEdges: ParsedEdge[] = []

  // 预收集所有节点的 id，用于 DI 形状查找
  const shapeByElement = new Map<string, { x: number; y: number; width: number; height: number }>()
  const shapes = doc.getElementsByTagNameNS(NS_BPMNDI, 'BPMNShape')
  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i]
    const bpmnElement = shape.getAttribute('bpmnElement')
    if (!bpmnElement) continue
    const bounds = shape.getElementsByTagNameNS(NS_DC, 'Bounds')[0]
    if (!bounds) continue
    shapeByElement.set(bpmnElement, {
      x: parseFloat(bounds.getAttribute('x') || '0'),
      y: parseFloat(bounds.getAttribute('y') || '0'),
      width: parseFloat(bounds.getAttribute('width') || '72'),
      height: parseFloat(bounds.getAttribute('height') || '72')
    })
  }

  for (const el of allElements) {
    const local = el.localName
    if (!local) continue

    // 事件 / 任务 / 网关：flow element
    const type = findTypeByTag(local, [])
    if (type) {
      // 检测子元素中的事件定义
      let eventDefTag: string | null = null
      for (const child of Array.from(el.children)) {
        const cname = child.localName
        if (cname === 'messageEventDefinition' || cname === 'timerEventDefinition' || cname === 'errorEventDefinition') {
          eventDefTag = cname
        }
      }
      // 重新查 type（end 事件要根据子元素判定）
      const finalType = findTypeByTag(local, eventDefTag ? [eventDefTag] : [])
      if (!finalType) continue

      const id = el.getAttribute('id') || ''
      if (!id) continue
      const name = el.getAttribute('name') || ''
      const docEl = el.getElementsByTagNameNS(NS_BPMN, 'documentation')[0]
      const documentation = docEl?.textContent || undefined
      const shape = shapeByElement.get(id) || { x: 0, y: 0, width: 72, height: 72 }
      parsedNodes.push({
        id,
        type: finalType,
        label: name || defaultLabelByType(finalType),
        documentation,
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height
      })
      continue
    }

    // 顺序流
    if (local === 'sequenceFlow') {
      const id = el.getAttribute('id') || ''
      const sourceId = el.getAttribute('sourceRef') || ''
      const targetId = el.getAttribute('targetRef') || ''
      if (!id || !sourceId || !targetId) continue
      const label = el.getAttribute('name') || undefined
      const isDefault = el.getAttribute('isDefault') === 'true'
      const condEl = el.getElementsByTagNameNS(NS_BPMN, 'conditionExpression')[0]
      const condition = condEl?.textContent?.trim() || undefined
      parsedEdges.push({ id, sourceId, targetId, label, isDefault, condition })
    }
  }

  if (!parsedNodes.length) return null

  // 映射为 WorkflowNode / WorkflowEdge
  const nodes: WorkflowNode[] = parsedNodes.map((n) => {
    const result: WorkflowNode = {
      id: n.id,
      type: n.type,
      label: n.label,
      x: n.x,
      y: n.y,
      width: n.width,
      height: n.height
    }
    if (n.documentation) result.documentation = n.documentation
    return result
  })
  const edges: WorkflowEdge[] = parsedEdges.map((e) => {
    const result: WorkflowEdge = {
      id: e.id,
      sourceId: e.sourceId,
      targetId: e.targetId
    }
    if (e.label) result.label = e.label
    if (e.condition) result.condition = e.condition
    if (e.isDefault) result.isDefault = true
    return result
  })
  return { nodes, edges }
}

function defaultLabelByType(type: NodeType): string {
  const labels: Record<NodeType, string> = {
    start: '开始',
    end: '结束',
    'message-intermediate': '消息事件',
    'timer-intermediate': '定时事件',
    'error-end': '错误结束',
    'user-task': '用户任务',
    'manual-task': '人工任务',
    'service-task': '服务任务',
    'script-task': '脚本任务',
    'receive-task': '接收任务',
    'parallel-gateway': '并行网关',
    'exclusive-gateway': '排他网关',
    'inclusive-gateway': '包容网关',
    'event-gateway': '事件网关'
  }
  return labels[type]
}