import { reactive, ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { WorkflowNode, WorkflowEdge, ValidationIssue } from '@/types/workflow'
import { validateBpmn } from '@/types/workflow/validator'
import { demoNodes, demoEdges } from '@/mock/workflow/workflowData'
import { exportBpmnXml, importBpmnXml } from './bpmnCodec'

/**
 * 工作流设计器状态/历史/剪贴板 composable
 *
 * 单实例（模块级 singleton），整个设计器共享
 * 把原 WorkflowDesigner.vue 中的状态/历史栈/复制粘贴 全部移到这里
 *
 * 重要：所有方法必须以「箭头函数字段」形式声明（= (x) => { ... }）
 * 这样 `this` 在实例化时就被绑定，可作为事件回调直接传入模板，
 * 避免 Vue 模板绑定时 `this` 丢失导致 `Cannot read properties of undefined`。
 */
export interface HistoryState {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

function clone<T>(o: T): T {
  return JSON.parse(JSON.stringify(o))
}

function nextId(prefix: string, used: Set<string>): string {
  let i = 1
  while (used.has(`${prefix}-${i}`)) i++
  return `${prefix}-${i}`
}

class WorkflowStore {
  /* ========== 数据 ========== */
  nodes: Ref<WorkflowNode[]> = ref([...clone(demoNodes)])
  edges: Ref<WorkflowEdge[]> = ref([...clone(demoEdges)])

  /* ========== 选中 ========== */
  selectedNodeId: Ref<string> = ref('')
  selectedNodeIds: Ref<string[]> = ref([])
  selectedEdgeId: Ref<string> = ref('')

  /* ========== 剪贴板 ========== */
  clipboard: { nodes: WorkflowNode[]; edges: WorkflowEdge[] } | null = null

  /* ========== 视图 ========== */
  sidebarCollapsed: Ref<boolean> = ref(false)
  minimapVisible: Ref<boolean> = ref(true)
  canvasMode: Ref<'pan' | 'select'> = ref('pan')
  // 校验面板：默认收起（点击工具栏「校验结果」按钮展开）
  validationPanelCollapsed: Ref<boolean> = ref(true)
  // 属性弹窗：默认关闭，双击节点触发
  propsDialogOpen: Ref<boolean> = ref(false)

  /* ========== 历史栈 ========== */
  private history = reactive<HistoryState[]>([])
  private historyIndex = ref<number>(-1)
  private readonly MAX_HISTORY = 50

  /* ========== 计算 ========== */
  validationIssues = computed<ValidationIssue[]>(() =>
    validateBpmn(this.nodes.value, this.edges.value)
  )

  hasErrors = computed(() =>
    this.validationIssues.value.some(i => i.severity === 'error')
  )

  hasWarnings = computed(() =>
    this.validationIssues.value.some(i => i.severity === 'warning')
  )

  canUndo = computed(() => this.historyIndex.value > 0)
  canRedo = computed(() => this.historyIndex.value < this.history.length - 1)

  /* ========== 选中辅助（箭头字段：this 自动绑定） ========== */
  selectNode = (id: string) => {
    this.selectedNodeId.value = id
    if (id) this.selectedEdgeId.value = ''
  }

  selectEdge = (id: string) => {
    this.selectedEdgeId.value = id
    if (id) {
      this.selectedNodeId.value = ''
      this.selectedNodeIds.value = []
    }
  }

  clearSelection = () => {
    this.selectedNodeId.value = ''
    this.selectedNodeIds.value = []
    this.selectedEdgeId.value = ''
  }

  /* ========== 节点操作 ========== */
  addNode = (node: WorkflowNode) => {
    this.nodes.value.push(node)
    this.pushHistory()
  }

  removeNode = (id: string): { removedNodes: number; removedEdges: number } => {
    const beforeNodes = this.nodes.value.length
    this.nodes.value = this.nodes.value.filter(n => n.id !== id)
    const beforeEdges = this.edges.value.length
    this.edges.value = this.edges.value.filter(e => e.sourceId !== id && e.targetId !== id)
    if (this.selectedNodeId.value === id) this.selectedNodeId.value = ''
    if (this.selectedEdgeId.value) this.selectedEdgeId.value = ''
    return {
      removedNodes: beforeNodes - this.nodes.value.length,
      removedEdges: beforeEdges - this.edges.value.length
    }
  }

  removeNodes = (ids: string[]): { removedNodes: number; removedEdges: number } => {
    const set = new Set(ids)
    const beforeNodes = this.nodes.value.length
    const beforeEdges = this.edges.value.length
    this.nodes.value = this.nodes.value.filter(n => !set.has(n.id))
    this.edges.value = this.edges.value.filter(e => !set.has(e.sourceId) && !set.has(e.targetId))
    this.selectedNodeId.value = ''
    this.selectedNodeIds.value = []
    this.selectedEdgeId.value = ''
    return {
      removedNodes: beforeNodes - this.nodes.value.length,
      removedEdges: beforeEdges - this.edges.value.length
    }
  }

  moveNode = (id: string, x: number, y: number) => {
    const n = this.nodes.value.find(n => n.id === id)
    if (n) {
      n.x = Math.max(0, x)
      n.y = Math.max(0, y)
    }
  }

  updateNode = (id: string, patch: Partial<WorkflowNode>) => {
    const n = this.nodes.value.find(n => n.id === id)
    if (!n) return
    Object.assign(n, patch)
    this.pushHistory()
  }

  /* ========== 连线操作 ========== */
  addEdge = (edge: WorkflowEdge) => {
    this.edges.value.push(edge)
    this.pushHistory()
  }

  removeEdge = (id: string): boolean => {
    const before = this.edges.value.length
    this.edges.value = this.edges.value.filter(e => e.id !== id)
    const removed = before - this.edges.value.length > 0
    if (this.selectedEdgeId.value === id) this.selectedEdgeId.value = ''
    if (removed) this.pushHistory()
    return removed
  }

  updateEdge = (id: string, patch: Partial<WorkflowEdge>) => {
    const e = this.edges.value.find(e => e.id === id)
    if (!e) return
    Object.assign(e, patch)
    this.pushHistory()
  }

  /* ========== 复制 / 粘贴 ========== */
  copySelection = () => {
    const ids = new Set(this.collectSelectedNodeIds())
    if (ids.size === 0) return
    const ns = clone(this.nodes.value.filter(n => ids.has(n.id)))
    const es = clone(this.edges.value.filter(e => ids.has(e.sourceId) && ids.has(e.targetId)))
    this.clipboard = { nodes: ns, edges: es }
  }

  paste = () => {
    if (!this.clipboard || this.clipboard.nodes.length === 0) return
    const used = new Set(this.nodes.value.map(n => n.id))
    // 给新节点分配 id，并整体 +20/+20 偏移
    const idMap: Record<string, string> = {}
    const newNodes = this.clipboard.nodes.map(n => {
      const newId = nextId('node', used)
      used.add(newId)
      idMap[n.id] = newId
      return { ...n, id: newId, x: n.x + 40, y: n.y + 40 }
    })
    const newEdges = this.clipboard.edges.map(e => ({
      ...e,
      id: nextId('edge', used),
      sourceId: idMap[e.sourceId] || e.sourceId,
      targetId: idMap[e.targetId] || e.targetId
    }))
    used.clear()
    newEdges.forEach(e => used.add(e.id))
    this.nodes.value.push(...newNodes)
    this.edges.value.push(...newEdges)
    // 选中新粘贴的节点
    this.selectedNodeId.value = newNodes[0].id
    this.selectedNodeIds.value = newNodes.map(n => n.id)
    this.selectedEdgeId.value = ''
    this.pushHistory()
  }

  duplicateSelection = () => {
    this.copySelection()
    this.paste()
  }

  /** 收集当前所有选中的节点 id（含主选 + 多选） */
  collectSelectedNodeIds = (): string[] => {
    const set = new Set(this.selectedNodeIds.value)
    if (this.selectedNodeId.value) set.add(this.selectedNodeId.value)
    return Array.from(set)
  }

  /* ========== 对齐 / 分布 / 翻转 ==========
   * - align: 6 方向（左/水平居中/右/顶/垂直居中/底）
   *   参考对象：≥2 个时取所有选中的边界；否则对该节点无操作
   * - distribute: 水平/垂直等距分布（需 ≥3 个节点）
   *   头尾固定，中间按间距均分
   * - flip: 水平/垂直翻转（镜像）
   *   头尾固定，内部节点对称映射
   */
  alignSelection = (target: 'left' | 'center-h' | 'right' | 'top' | 'center-v' | 'bottom') => {
    const ids = this.collectSelectedNodeIds()
    if (ids.length < 2) return
    const sel = this.nodes.value.filter(n => ids.includes(n.id))
    if (sel.length < 2) return

    if (target === 'left' || target === 'center-h' || target === 'right') {
      // X 轴对齐
      const minX = Math.min(...sel.map(n => n.x))
      const maxX = Math.max(...sel.map(n => n.x + n.width))
      const targetX = target === 'left' ? minX : target === 'right' ? maxX : (minX + maxX) / 2
      sel.forEach(n => {
        if (target === 'center-h') {
          n.x = targetX - n.width / 2
        } else {
          n.x = targetX - (target === 'left' ? 0 : n.width)
        }
      })
    } else {
      // Y 轴
      const minY = Math.min(...sel.map(n => n.y))
      const maxY = Math.max(...sel.map(n => n.y + n.height))
      const targetY = target === 'top' ? minY : target === 'bottom' ? maxY : (minY + maxY) / 2
      sel.forEach(n => {
        if (target === 'center-v') {
          n.y = targetY - n.height / 2
        } else {
          n.y = targetY - (target === 'top' ? 0 : n.height)
        }
      })
    }
    this.pushHistory()
  }

  distributeSelection = (axis: 'h' | 'v') => {
    const ids = this.collectSelectedNodeIds()
    if (ids.length < 3) return
    const sel = this.nodes.value.filter(n => ids.includes(n.id))
    if (sel.length < 3) return

    if (axis === 'h') {
      // 按 left (x) 排序
      sel.sort((a, b) => a.x - b.x)
      const first = sel[0]
      const last = sel[sel.length - 1]
      const total = (last.x + last.width / 2) - (first.x + first.width / 2)
      const step = total / (sel.length - 1)
      sel.forEach((n, i) => {
        n.x = (first.x + first.width / 2) + step * i - n.width / 2
      })
    } else {
      sel.sort((a, b) => a.y - b.y)
      const first = sel[0]
      const last = sel[sel.length - 1]
      const total = (last.y + last.height / 2) - (first.y + first.height / 2)
      const step = total / (sel.length - 1)
      sel.forEach((n, i) => {
        n.y = (first.y + first.height / 2) + step * i - n.height / 2
      })
    }
    this.pushHistory()
  }

  /** 水平/垂直翻转：相对选中边界中心镜像 */
  flipSelection = (axis: 'h' | 'v') => {
    const ids = this.collectSelectedNodeIds()
    if (ids.length < 2) return
    const sel = this.nodes.value.filter(n => ids.includes(n.id))
    if (sel.length < 2) return

    if (axis === 'h') {
      const minX = Math.min(...sel.map(n => n.x))
      const maxX = Math.max(...sel.map(n => n.x + n.width))
      const center = (minX + maxX) / 2
      sel.forEach(n => {
        n.x = 2 * center - n.x - n.width
      })
    } else {
      const minY = Math.min(...sel.map(n => n.y))
      const maxY = Math.max(...sel.map(n => n.y + n.height))
      const center = (minY + maxY) / 2
      sel.forEach(n => {
        n.y = 2 * center - n.y - n.height
      })
    }
    this.pushHistory()
  }

  /* ========== 组合 / 解组 ==========
   * 简化版：用 groupId 字段标记，渲染时如果有共同 groupId 则绘制一个虚线包围框
   */
  groupSelection = () => {
    const ids = this.collectSelectedNodeIds()
    if (ids.length < 2) return
    const groupId = `group-${Date.now()}`
    this.nodes.value.forEach(n => {
      if (ids.includes(n.id)) n.groupId = groupId
    })
    this.pushHistory()
  }

  ungroupSelection = () => {
    const ids = this.collectSelectedNodeIds()
    if (ids.length === 0) return
    const set = new Set<string>(ids)
    this.nodes.value.forEach(n => {
      if (n.groupId && set.has(n.id)) n.groupId = undefined
    })
    this.pushHistory()
  }

  /* ========== 历史栈 ========== */
  pushHistory = () => {
    // 截断 redo 分支
    if (this.historyIndex.value < this.history.length - 1) {
      this.history.splice(this.historyIndex.value + 1)
    }
    const snap: HistoryState = {
      nodes: clone(this.nodes.value),
      edges: clone(this.edges.value)
    }
    this.history.push(snap)
    if (this.history.length > this.MAX_HISTORY) {
      this.history.shift()
    } else {
      this.historyIndex.value++
    }
  }

  undo = () => {
    if (!this.canUndo.value) return
    this.historyIndex.value--
    this.restore(this.history[this.historyIndex.value])
  }

  redo = () => {
    if (!this.canRedo.value) return
    this.historyIndex.value++
    this.restore(this.history[this.historyIndex.value])
  }

  private restore = (snap: HistoryState) => {
    this.nodes.value = clone(snap.nodes)
    this.edges.value = clone(snap.edges)
    this.clearSelection()
  }

  /** 初始化历史栈：在初始数据就绪后调用一次 */
  initHistory = () => {
    this.history.splice(0)
    this.historyIndex.value = -1
    this.pushHistory()
  }

  /* ========== 导入导出 ========== */
  exportJson = (): string => {
    return JSON.stringify(
      {
        version: '1.0',
        nodes: this.nodes.value,
        edges: this.edges.value
      },
      null,
      2
    )
  }

  importJson = (json: string): boolean => {
    try {
      const data = JSON.parse(json)
      if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) return false
      this.nodes.value = data.nodes
      this.edges.value = data.edges
      this.clearSelection()
      this.initHistory()
      return true
    } catch {
      return false
    }
  }

  /* ========== BPMN 导入导出 ==========
   * 真实转换逻辑在 bpmnCodec 中（轻量手写 XML 解析，无第三方依赖）
   */
  exportBpmn = (): string => {
    return exportBpmnXml(this.nodes.value, this.edges.value)
  }

  importBpmn = (xml: string): boolean => {
    const result = importBpmnXml(xml)
    if (!result) return false
    this.nodes.value = result.nodes
    this.edges.value = result.edges
    this.clearSelection()
    this.initHistory()
    return true
  }
}

let _instance: WorkflowStore | null = null

/** 单例获取 */
export function useWorkflowStore(): WorkflowStore {
  if (!_instance) {
    _instance = new WorkflowStore()
    _instance.initHistory()
  }
  return _instance
}