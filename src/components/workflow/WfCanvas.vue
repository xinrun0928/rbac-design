<template>
  <div
    ref="canvasRef"
    class="wf-canvas"
    :class="{
      'is-panning': isPanning,
      'is-dragging-edge': edgeDragging,
      'is-selecting': isSelecting,
      [`mode-${mode}`]: true
    }"
    tabindex="0"
    @mousedown="handleCanvasMouseDown"
    @mousemove="handleCanvasMouseMove"
    @mouseup="handleCanvasMouseUp"
    @mouseleave="handleCanvasMouseUp"
    @wheel.prevent="handleWheel"
  >
    <!-- 网格背景层 -->
    <div class="wf-canvas__grid" />

    <!-- 内容缩放 + 平移层 -->
    <div
      class="wf-canvas__viewport"
      :style="viewportStyle"
    >
      <!-- 连线层（SVG） -->
      <svg class="wf-canvas__edges" :width="edgeLayerSize.w" :height="edgeLayerSize.h">
        <defs>
          <!-- 箭头标记 -->
          <marker
            id="wf-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#00d4ff" />
          </marker>
          <!-- 选中态箭头（亮黄） -->
          <marker
            id="wf-arrow-selected"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff7d00" />
          </marker>
          <!-- 拖拽中的幽灵箭头（蓝色） -->
          <marker
            id="wf-arrow-ghost"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#1677ff" />
          </marker>
        </defs>

        <g>
          <!-- 已有连线 -->
          <path
            v-for="edge in edges"
            :key="edge.id"
            :d="getEdgePath(edge)"
            :stroke="isEdgeSelected(edge.id) ? '#ff7d00' : '#00d4ff'"
            :stroke-width="isEdgeSelected(edge.id) ? 3 : 2"
            fill="none"
            :marker-end="isEdgeSelected(edge.id) ? 'url(#wf-arrow-selected)' : 'url(#wf-arrow)'"
            class="wf-canvas__edge"
            :class="{ 'is-selected': isEdgeSelected(edge.id) }"
            @mousedown.stop="handleEdgeMouseDown(edge.id, $event)"
            @click.stop="handleEdgeClick(edge.id)"
          />

          <!-- 拖拽中的临时连线（幽灵）：虚线 + 箭头 + 流动动画 -->
          <path
            v-if="ghostEdge"
            :d="ghostEdgePath"
            stroke="#1677ff"
            stroke-width="2"
            stroke-dasharray="6 4"
            fill="none"
            marker-end="url(#wf-arrow-ghost)"
            class="wf-canvas__edge-ghost"
          />

          <!-- 选中连线的中点删除按钮（贝塞尔曲线 t=0.5 位置） -->
          <g
            v-if="selectedEdgeMidpoint"
            class="wf-canvas__edge-delete"
            :transform="`translate(${selectedEdgeMidpoint.x}, ${selectedEdgeMidpoint.y})`"
            @mousedown.stop
            @click.stop="handleDeleteEdgeFromButton"
          >
            <!-- 透明放大热区 -->
            <circle r="14" fill="transparent" />
            <!-- 圆形按钮 -->
            <circle r="10" fill="#ff4d4f" stroke="#ffffff" stroke-width="2" class="wf-canvas__edge-delete-bg" />
            <!-- × 符号 -->
            <line x1="-4" y1="-4" x2="4" y2="4" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
            <line x1="-4" y1="4" x2="4" y2="-4" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
          </g>

          <!-- 智能对齐辅助线（拖拽节点时显示） -->
          <g v-if="alignGuides.length" class="wf-canvas__guides">
            <line
              v-for="(g, i) in alignGuides"
              :key="i"
              :x1="g.x1" :y1="g.y1" :x2="g.x2" :y2="g.y2"
              stroke="#ff4d4f"
              stroke-width="1.5"
              stroke-dasharray="4 3"
            />
          </g>
        </g>
      </svg>

      <!-- 节点层 -->
      <WfNode
        v-for="node in nodes"
        :key="node.id"
        :node="node"
        :selected="isNodeSelected(node.id)"
        @select="handleSelectNode"
        @drag-start="handleNodeDragStart"
        @port-drag-start="handlePortDragStart"
        @open-props="handleOpenNodeProps"
      />
    </div>

    <!-- 框选矩形（屏幕坐标，固定在 viewport 之外） -->
    <div
      v-if="isSelecting && selectionRect"
      class="wf-canvas__selection"
      :style="selectionRectStyle"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import WfNode, { type NodePort } from './WfNode.vue'
import type { WorkflowNode, WorkflowEdge, Viewport } from '@/types/workflow'

/** 画布交互模式 */
export type CanvasMode = 'pan' | 'select'

interface Props {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  viewport: Viewport
  selectedNodeId?: string
  /** 多选节点 id 集合（用于框选 / 多选对齐） */
  selectedNodeIds?: string[]
  /** 当前选中的连线 id */
  selectedEdgeId?: string
  /** 画布模式：pan = 抓手平移（默认）；select = 框选节点 */
  mode?: CanvasMode
}

const props = withDefaults(defineProps<Props>(), {
  selectedNodeId: '',
  selectedNodeIds: () => [],
  selectedEdgeId: '',
  mode: 'pan'
})

const emit = defineEmits<{
  (e: 'update:viewport', viewport: Viewport): void
  (e: 'select-node', id: string): void
  (e: 'update:selected-node-ids', ids: string[]): void
  (e: 'select-edge', id: string): void
  (e: 'delete-edge', id: string): void
  (e: 'move-node', payload: { id: string; x: number; y: number }): void
  /* ========== 自定义拖拽：来自画布的全局监听 ========== */
  (e: 'canvas-pointer-move', event: MouseEvent): void
  (e: 'canvas-pointer-up', payload: { event: MouseEvent; inside: boolean }): void
  /* ========== 框选完成后自动退出 select 模式 ========== */
  (e: 'mode-change', mode: 'pan' | 'select'): void
  /* ========== port 拖拽到目标节点 → 生成连线 ========== */
  (e: 'create-edge', payload: { sourceId: string; targetId: string }): void
  /* ========== 双击节点 → 弹出属性弹窗 ========== */
  (e: 'open-props', id: string): void
}>()

const canvasRef = ref<HTMLDivElement | null>(null)

/** 视口层 translate + scale */
const viewportStyle = computed(() => ({
  transform: `translate(${props.viewport.x}px, ${props.viewport.y}px) scale(${props.viewport.zoom})`,
  transformOrigin: '0 0'
}))

/**
 * 计算连线层尺寸 = 所有节点的最大边界 + 留白
 * 透出到 SVG，确保箭头不被裁剪
 */
const edgeLayerSize = computed(() => {
  let maxX = 0
  let maxY = 0
  for (const node of props.nodes) {
    maxX = Math.max(maxX, node.x + node.width + 100)
    maxY = Math.max(maxY, node.y + node.height + 100)
  }
  return { w: Math.max(maxX, 1800), h: Math.max(maxY, 800) }
})

/**
 * 计算贝塞尔曲线路径
 * 起点：源节点右边界中点
 * 终点：目标节点左边界中点
 * 控制点：水平偏移 60px
 */
function getEdgePath(edge: WorkflowEdge) {
  const source = props.nodes.find(n => n.id === edge.sourceId)
  const target = props.nodes.find(n => n.id === edge.targetId)
  if (!source || !target) return ''

  const sx = source.x + source.width
  const sy = source.y + source.height / 2
  const tx = target.x
  const ty = target.y + target.height / 2

  const dx = Math.max(Math.abs(tx - sx) * 0.5, 60)
  const cp1x = sx + dx
  const cp1y = sy
  const cp2x = tx - dx
  const cp2y = ty

  return `M ${sx} ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tx} ${ty}`
}

/**
 * 计算贝塞尔曲线中点（t=0.5）
 * B(0.5) = 0.125·P0 + 0.375·P1 + 0.375·P2 + 0.125·P3
 * 返回 SVG 坐标系（viewport 内的世界坐标）下的 { x, y }
 */
function getEdgeMidpoint(edge: WorkflowEdge): { x: number; y: number } {
  const source = props.nodes.find(n => n.id === edge.sourceId)
  const target = props.nodes.find(n => n.id === edge.targetId)
  if (!source || !target) return { x: 0, y: 0 }

  const sx = source.x + source.width
  const sy = source.y + source.height / 2
  const tx = target.x
  const ty = target.y + target.height / 2
  const dx = Math.max(Math.abs(tx - sx) * 0.5, 60)
  const cp1x = sx + dx
  const cp1y = sy
  const cp2x = tx - dx
  const cp2y = ty

  const x = 0.125 * sx + 0.375 * cp1x + 0.375 * cp2x + 0.125 * tx
  const y = 0.125 * sy + 0.375 * cp1y + 0.375 * cp2y + 0.125 * ty
  return { x, y }
}

/** 当前选中连线的中点坐标（节点移动时联动） */
const selectedEdgeMidpoint = computed(() => {
  if (!props.selectedEdgeId) return null
  const edge = props.edges.find(e => e.id === props.selectedEdgeId)
  if (!edge) return null
  return getEdgeMidpoint(edge)
})

/** 连线中点 × 按钮：通知父组件删除 */
function handleDeleteEdgeFromButton(event: MouseEvent) {
  event.stopPropagation()
  if (!props.selectedEdgeId) return
  emit('delete-edge', props.selectedEdgeId)
}

/* ========== 节点选中 ========== */
function handleSelectNode(id: string) {
  // Shift 加选 / 取消选中；否则单选（清空多选）
  const isMulti = (window.event as MouseEvent | undefined)?.shiftKey === true
  if (isMulti) {
    const set = new Set(props.selectedNodeIds)
    if (set.has(id)) set.delete(id)
    else set.add(id)
    // 让主选中态指向最近一次操作
    emit('select-node', id)
    emit('update:selected-node-ids', Array.from(set))
  } else {
    emit('select-node', id)
    emit('update:selected-node-ids', [id])
  }
}

/** 节点是否处于选中态（主选 / 多选任一即算选中） */
function isNodeSelected(id: string): boolean {
  if (props.selectedNodeId === id) return true
  return props.selectedNodeIds.includes(id)
}

/** 双击节点 → 通知父级打开属性弹窗 */
function handleOpenNodeProps(id: string) {
  emit('open-props', id)
}

/** 连线是否处于选中态 */
function isEdgeSelected(id: string): boolean {
  return props.selectedEdgeId === id
}

/** 点击连线 → 选中并清空节点选中态；mousedown 同时阻止冒泡到画布，避免误触发 panning/selecting */
function handleEdgeClick(id: string) {
  emit('select-edge', id)
  emit('select-node', '')
  emit('update:selected-node-ids', [])
}

/** mousedown 占位 —— 真正选中走 click；这里 stop 防止画布按下空白开始平移 */
function handleEdgeMouseDown(_id: string, _event: MouseEvent) {
  // 仅 stopPropagation 即可；选中交给 click 处理
}

/* ========== 节点拖拽（鼠标按下 / 移动） ========== */
const draggingNodeId = ref<string | null>(null)
const dragOffset = ref({ x: 0, y: 0 })

/* ========== 智能对齐辅助线 ========== */
interface AlignGuide {
  /** 起点 */
  x1: number
  y1: number
  /** 终点 */
  x2: number
  y2: number
  /** 'h' = 水平；'v' = 垂直 */
  axis: 'h' | 'v'
}
const alignGuides = ref<AlignGuide[]>([])
const SNAP_THRESHOLD = 4 // 像素（世界坐标）

/**
 * 智能对齐吸附：返回 dx/dy
 * 对参考节点的关键 X/Y 位置（left/center.x/right/top/center.y/bottom）做吸附
 */
function computeSnap(
  dragged: WorkflowNode,
  newX: number,
  newY: number
): { x: number; y: number } {
  const others = props.nodes.filter(n => n.id !== dragged.id)
  alignGuides.value = []

  const draggedLeft = newX
  const draggedCx = newX + dragged.width / 2
  const draggedRight = newX + dragged.width
  const draggedTop = newY
  const draggedCy = newY + dragged.height / 2
  const draggedBottom = newY + dragged.height

  // 收集候选 X / Y 直线
  const xLines: number[] = []
  const yLines: number[] = []
  others.forEach(o => {
    xLines.push(o.x, o.x + o.width / 2, o.x + o.width)
    yLines.push(o.y, o.y + o.height / 2, o.y + o.height)
  })

  const dxCandidates = [
    { val: draggedLeft, target: xLines, snapTo: draggedLeft },
    { val: draggedCx, target: xLines, snapTo: draggedCx },
    { val: draggedRight, target: xLines, snapTo: draggedRight }
  ]
  const dyCandidates = [
    { val: draggedTop, target: yLines, snapTo: draggedTop },
    { val: draggedCy, target: yLines, snapTo: draggedCy },
    { val: draggedBottom, target: yLines, snapTo: draggedBottom }
  ]

  let bestDx = { d: Infinity, snap: 0, line: 0 }
  dxCandidates.forEach(c => {
    c.target.forEach(t => {
      const diff = t - c.snapTo
      if (Math.abs(diff) < SNAP_THRESHOLD && Math.abs(diff) < Math.abs(bestDx.d)) {
        bestDx = { d: diff, snap: c.snapTo, line: t }
      }
    })
  })

  let bestDy = { d: Infinity, snap: 0, line: 0 }
  dyCandidates.forEach(c => {
    c.target.forEach(t => {
      const diff = t - c.snapTo
      if (Math.abs(diff) < SNAP_THRESHOLD && Math.abs(diff) < Math.abs(bestDy.d)) {
        bestDy = { d: diff, snap: c.snapTo, line: t }
      }
    })
  })

  // 生成辅助线（红虚线）
  if (bestDx.d !== Infinity) {
    const x = bestDx.line
    alignGuides.value.push({
      x1: x, y1: -1e5, x2: x, y2: 1e5,
      axis: 'v'
    })
  }
  if (bestDy.d !== Infinity) {
    const y = bestDy.line
    alignGuides.value.push({
      x1: -1e5, y1: y, x2: 1e5, y2: y,
      axis: 'h'
    })
  }

  return { x: bestDx.d === Infinity ? 0 : bestDx.d, y: bestDy.d === Infinity ? 0 : bestDy.d }
}

function handleNodeDragStart(payload: { id: string; event: MouseEvent }) {
  const node = props.nodes.find(n => n.id === payload.id)
  if (!node) return

  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return

  const mouseWorldX = (payload.event.clientX - rect.left - props.viewport.x) / props.viewport.zoom
  const mouseWorldY = (payload.event.clientY - rect.top - props.viewport.y) / props.viewport.zoom

  draggingNodeId.value = payload.id
  dragOffset.value = {
    x: mouseWorldX - node.x,
    y: mouseWorldY - node.y
  }
  emit('select-node', payload.id)
}

/* ========== 拖拽结束：清空辅助线 ========== */
function handleNodeDragEnd() {
  draggingNodeId.value = null
  alignGuides.value = []
}

/* ========== 连线拖拽（从 port 出发） ========== */
const edgeDragging = ref(false)
const ghostEdge = ref<{ fromX: number; fromY: number; toX: number; toY: number } | null>(null)
const ghostEdgeFromPort = ref<NodePort | null>(null)
const ghostEdgeSourceId = ref<string | null>(null)

/** 节点 port 的世界坐标 */
function getPortWorldCoord(node: WorkflowNode, port: NodePort) {
  switch (port) {
    case 'top': return { x: node.x + node.width / 2, y: node.y }
    case 'right': return { x: node.x + node.width, y: node.y + node.height / 2 }
    case 'bottom': return { x: node.x + node.width / 2, y: node.y + node.height }
    case 'left': return { x: node.x, y: node.y + node.height / 2 }
  }
}

function handlePortDragStart(payload: { id: string; port: NodePort; event: MouseEvent }) {
  const node = props.nodes.find(n => n.id === payload.id)
  if (!node) return
  const coord = getPortWorldCoord(node, payload.port)

  edgeDragging.value = true
  ghostEdgeSourceId.value = payload.id
  ghostEdgeFromPort.value = payload.port
  ghostEdge.value = { fromX: coord.x, fromY: coord.y, toX: coord.x, toY: coord.y }
  emit('select-node', payload.id)
}

/** 幽灵连线 path：起点固定端点，终点跟鼠标 */
const ghostEdgePath = computed(() => {
  const g = ghostEdge.value
  if (!g) return ''
  const sx = g.fromX
  const sy = g.fromY
  const tx = g.toX
  const ty = g.toY
  const dx = Math.max(Math.abs(tx - sx) * 0.5, 60)
  const cp1x = sx + dx
  const cp1y = sy
  const cp2x = tx - dx
  const cp2y = ty
  return `M ${sx} ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tx} ${ty}`
})

/* ========== 画布拖拽 / 平移 / 框选 ========== */
const isPanning = ref(false)
const panStart = ref({ x: 0, y: 0, vx: 0, vy: 0 })

/** 框选状态 */
const isSelecting = ref(false)
const selectionRect = ref<{ x: number; y: number; w: number; h: number } | null>(null)
const selectionStart = ref({ x: 0, y: 0 })

/** 框选矩形样式：定位用 canvas 内坐标（相对画布 viewport 的左上角） */
const selectionRectStyle = computed(() => {
  const r = selectionRect.value
  if (!r) return {}
  return {
    left: `${r.x}px`,
    top: `${r.y}px`,
    width: `${r.w}px`,
    height: `${r.h}px`
  }
})

/** 屏幕 → 画布内坐标（不除 zoom，因框选用屏幕尺寸） */
function clientToCanvas(clientX: number, clientY: number) {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return { x: 0, y: 0 }
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  }
}

function handleCanvasMouseDown(event: MouseEvent) {
  // 仅当点击在空白区域（非节点）时支持画布平移 / 框选
  const target = event.target as HTMLElement
  if (target.closest('.wf-node')) return

  const local = clientToCanvas(event.clientX, event.clientY)

  if (props.mode === 'select') {
    // 框选模式：按下空白 → 启动框选矩形
    isSelecting.value = true
    selectionStart.value = local
    selectionRect.value = { x: local.x, y: local.y, w: 0, h: 0 }
    // 不立即清空选中，按下 shift 才加选；普通按下视为新选区
    if (!event.shiftKey) {
      emit('select-node', '')
      emit('update:selected-node-ids', [])
    }
    return
  }

  // 默认 pan 模式：按下空白 → 平移画布
  isPanning.value = true
  panStart.value = {
    x: event.clientX,
    y: event.clientY,
    vx: props.viewport.x,
    vy: props.viewport.y
  }
  emit('select-node', '')
}

function handleCanvasMouseMove(event: MouseEvent) {
  // 节点拖拽
  if (draggingNodeId.value) {
    const rect = canvasRef.value?.getBoundingClientRect()
    if (!rect) return

    const worldX = (event.clientX - rect.left - props.viewport.x) / props.viewport.zoom
    const worldY = (event.clientY - rect.top - props.viewport.y) / props.viewport.zoom

    const newX = worldX - dragOffset.value.x
    const newY = worldY - dragOffset.value.y

    // 智能吸附：阈值 4px（世界坐标）
    const dragged = props.nodes.find(n => n.id === draggingNodeId.value)
    if (dragged) {
      const dx = computeSnap(dragged, newX, newY)
      emit('move-node', {
        id: draggingNodeId.value,
        x: newX + dx.x,
        y: newY + dx.y
      })
      return
    }
    emit('move-node', {
      id: draggingNodeId.value,
      x: newX,
      y: newY
    })
    return
  }

  // 画布平移（pan 模式）
  if (isPanning.value) {
    const dx = event.clientX - panStart.value.x
    const dy = event.clientY - panStart.value.y
    emit('update:viewport', {
      ...props.viewport,
      x: panStart.value.vx + dx,
      y: panStart.value.vy + dy
    })
    return
  }

  // 框选矩形更新
  if (isSelecting.value) {
    const local = clientToCanvas(event.clientX, event.clientY)
    const x = Math.min(local.x, selectionStart.value.x)
    const y = Math.min(local.y, selectionStart.value.y)
    const w = Math.abs(local.x - selectionStart.value.x)
    const h = Math.abs(local.y - selectionStart.value.y)
    selectionRect.value = { x, y, w, h }
    return
  }

  // 幽灵连线（port 拖拽中）终点跟随鼠标
  if (edgeDragging.value) {
    const rect = canvasRef.value?.getBoundingClientRect()
    if (rect) {
      const worldX = (event.clientX - rect.left - props.viewport.x) / props.viewport.zoom
      const worldY = (event.clientY - rect.top - props.viewport.y) / props.viewport.zoom
      ghostEdge.value = { ...ghostEdge.value!, toX: worldX, toY: worldY }
    }
    return
  }

  // 透传给外部
  emit('canvas-pointer-move', event)
}

function handleCanvasMouseUp(event: MouseEvent) {
  draggingNodeId.value = null
  alignGuides.value = []
  isPanning.value = false

  // 记录是否真的产生了框选矩形（mousemove 中会更新它的 w/h）
  // 用于 mouseup 时判断是否要自动退出 select 模式
  const hadSelectionRect = isSelecting.value && !!selectionRect.value
    && (selectionRect.value.w > 2 || selectionRect.value.h > 2)

  // 框选结束：统计命中的节点，写入选区
  if (isSelecting.value && selectionRect.value) {
    const rect = selectionRect.value
    const hit = props.nodes.filter(n => {
      const nx = n.x * props.viewport.zoom + props.viewport.x
      const ny = n.y * props.viewport.zoom + props.viewport.y
      const nw = n.width * props.viewport.zoom
      const nh = n.height * props.viewport.zoom
      return (
        nx + nw >= rect.x &&
        nx <= rect.x + rect.w &&
        ny + nh >= rect.y &&
        ny <= rect.y + rect.h
      )
    })
    const ids = hit.map(n => n.id)
    if (ids.length > 0) {
      emit('select-node', ids[ids.length - 1])
      emit('update:selected-node-ids', ids)
    } else if (!event.shiftKey) {
      emit('select-node', '')
      emit('update:selected-node-ids', [])
    }
  }

  isSelecting.value = false
  selectionRect.value = null

  // 框选完成：松开鼠标后自动退出「框选模式」，回到抓手模式
  // 仅当发生过框选（即 selectionRect 已被设置过）时才切回，避免点一下画布也退出
  if (props.mode === 'select' && hadSelectionRect) {
    emit('mode-change', 'pan')
  }

  // 连线拖拽结束：只在画布内松开时清理本地 ghost 视觉。
  // 如果松开时鼠标命中某个节点，则生成一条连线
  if (edgeDragging.value) {
    const targetNodeId = findNodeAtClient(event.clientX, event.clientY)
    if (
      targetNodeId &&
      targetNodeId !== ghostEdgeSourceId.value &&
      ghostEdgeSourceId.value
    ) {
      emit('create-edge', {
        sourceId: ghostEdgeSourceId.value,
        targetId: targetNodeId
      })
    }
    edgeDragging.value = false
    ghostEdge.value = null
    ghostEdgeFromPort.value = null
    ghostEdgeSourceId.value = null
  }

  // 透传给外部（顺便带上鼠标命中区域，便于判定放置有效性）
  const rect = canvasRef.value?.getBoundingClientRect()
  const inside = !!rect
    && event.clientX >= rect.left
    && event.clientX <= rect.right
    && event.clientY >= rect.top
    && event.clientY <= rect.bottom
  emit('canvas-pointer-up', { event, inside })
}

/** 屏幕坐标 → 命中节点（按 client 坐标 → 视口坐标后判定） */
function findNodeAtClient(clientX: number, clientY: number): string | null {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return null
  const worldX = (clientX - rect.left - props.viewport.x) / props.viewport.zoom
  const worldY = (clientY - rect.top - props.viewport.y) / props.viewport.zoom

  // 反向遍历（顶层节点优先）
  for (let i = props.nodes.length - 1; i >= 0; i--) {
    const n = props.nodes[i]
    if (
      worldX >= n.x && worldX <= n.x + n.width &&
      worldY >= n.y && worldY <= n.y + n.height
    ) {
      return n.id
    }
  }
  return null
}

/* ========== 鼠标滚轮缩放 ========== */
function handleWheel(event: WheelEvent) {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return

  // 以鼠标位置为缩放中心
  const offsetX = event.clientX - rect.left
  const offsetY = event.clientY - rect.top

  const delta = event.deltaY > 0 ? 0.9 : 1.1
  const newZoom = Math.min(Math.max(props.viewport.zoom * delta, 0.2), 3)

  // 保持鼠标位置对应的世界坐标不变
  const worldX = (offsetX - props.viewport.x) / props.viewport.zoom
  const worldY = (offsetY - props.viewport.y) / props.viewport.zoom

  const newX = offsetX - worldX * newZoom
  const newY = offsetY - worldY * newZoom

  emit('update:viewport', {
    zoom: newZoom,
    x: newX,
    y: newY
  })
}

/** 暴露给父级：屏幕坐标 → 视口（世界）坐标 */
function clientToWorld(clientX: number, clientY: number) {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return { x: 0, y: 0 }
  return {
    x: (clientX - rect.left - props.viewport.x) / props.viewport.zoom,
    y: (clientY - rect.top - props.viewport.y) / props.viewport.zoom
  }
}

/** 暴露给父级：适配视图（全部节点居中可见） */
function fitView() {
  if (props.nodes.length === 0) {
    emit('update:viewport', { zoom: 1, x: 0, y: 0 })
    return
  }
  const padding = 80
  const minX = Math.min(...props.nodes.map(n => n.x))
  const minY = Math.min(...props.nodes.map(n => n.y))
  const maxX = Math.max(...props.nodes.map(n => n.x + n.width))
  const maxY = Math.max(...props.nodes.map(n => n.y + n.height))
  const w = maxX - minX
  const h = maxY - minY
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return
  const zoomX = (rect.width - padding * 2) / w
  const zoomY = (rect.height - padding * 2) / h
  const zoom = Math.min(2, Math.max(0.2, Math.min(zoomX, zoomY)))
  const x = (rect.width - w * zoom) / 2 - minX * zoom
  const y = (rect.height - h * zoom) / 2 - minY * zoom
  emit('update:viewport', { zoom, x, y })
}

/**
 * 暴露给父级：在画布空白区移动时，更新幽灵连线终点
 * 父级（WorkflowDesigner）管理 window 监听；
 * 这里只暴露一个 setGhostTarget 用于「跨节点 port 拖拽到外部再回到画布」的场景。
 */
function setGhostTarget(clientX: number, clientY: number) {
  if (!edgeDragging.value) return
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return
  const worldX = (clientX - rect.left - props.viewport.x) / props.viewport.zoom
  const worldY = (clientY - rect.top - props.viewport.y) / props.viewport.zoom
  if (ghostEdge.value) {
    ghostEdge.value = { ...ghostEdge.value, toX: worldX, toY: worldY }
  }
}

defineExpose({ handleNodeDragEnd, clientToWorld, setGhostTarget, getCanvasRect: () => canvasRef.value?.getBoundingClientRect() ?? null, fitView })
</script>

<style scoped lang="scss">
.wf-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #1a2138;
  cursor: grab;
}

/* 正在平移画布时变 grabbing */
.wf-canvas.is-panning,
.wf-canvas.is-panning * {
  cursor: grabbing !important;
}

/* 正在拖拽连线时显示十字光标 */
.wf-canvas.is-dragging-edge,
.wf-canvas.is-dragging-edge * {
  cursor: crosshair !important;
}

/* ========== 网格背景：圆点矩阵 ========== */
.wf-canvas__grid {
  position: absolute;
  inset: 0;
  background-color: #1a2138;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.18) 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: 0 0;
  pointer-events: none;
}

/* ========== 视口层（可缩放/平移） ========== */
.wf-canvas__viewport {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
}

/* ========== 连线层 ========== */
.wf-canvas__edges {
  position: absolute;
  top: 0;
  left: 0;
  overflow: visible;
  pointer-events: none;
}

.wf-canvas__edge {
  /* 提升贝塞尔曲线视觉，避免低分辨率屏锯齿 */
  shape-rendering: geometricPrecision;
  cursor: pointer;
  transition: stroke 0.15s ease, stroke-width 0.15s ease;
}

.wf-canvas__edge.is-selected {
  /* 选中态轻微发光 */
  filter: drop-shadow(0 0 4px rgba(255, 125, 0, 0.45));
}

/* ========== 连线中点删除按钮 ========== */
.wf-canvas__edge-delete {
  cursor: pointer;
}

.wf-canvas__edge-delete:hover .wf-canvas__edge-delete-bg {
  fill: #ff7875;
  transform-origin: center;
  transform-box: fill-box;
  transform: scale(1.1);
}

.wf-canvas__edge-ghost {
  /* 拖拽中的虚线幽灵 */
  pointer-events: none;
  opacity: 0.9;
  /* 流动虚线效果：虚线沿路径动起来 */
  animation: wf-edge-ghost-dash 0.5s linear infinite;
}

@keyframes wf-edge-ghost-dash {
  to { stroke-dashoffset: -10; }
}

/* ========== 框选矩形 ========== */
.wf-canvas__selection {
  position: absolute;
  border: 1px solid #1677ff;
  background: rgba(22, 119, 255, 0.08);
  pointer-events: none;
  z-index: 50;
}

/* ========== 模式光标 ========== */
/* pan 模式：默认 grab，按下平移变 grabbing */
.wf-canvas.mode-pan {
  cursor: grab;
}

.wf-canvas.mode-pan.is-panning,
.wf-canvas.mode-pan.is-panning * {
  cursor: grabbing !important;
}

/* select 模式：默认十字光标 */
.wf-canvas.mode-select {
  cursor: crosshair;
}

.wf-canvas.mode-select.is-panning,
.wf-canvas.mode-select.is-panning * {
  cursor: grabbing !important;
}

/* 拖拽连线时始终十字光标 */
.wf-canvas.is-dragging-edge,
.wf-canvas.is-dragging-edge * {
  cursor: crosshair !important;
}
</style>