<template>
  <div class="wf-designer">
    <!-- 顶部工具栏 -->
    <WfToolbar
      :store="store"
      :zoom="viewport.zoom"
      @open-io="openIoDialog"
      @toggle-sidebar="store.sidebarCollapsed.value = !store.sidebarCollapsed.value"
      @toggle-minimap="store.minimapVisible.value = !store.minimapVisible.value"
      @toggle-validation="store.validationPanelCollapsed.value = !store.validationPanelCollapsed.value"
      @mode-change="(m: 'pan' | 'select') => (store.canvasMode.value = m)"
      @fit-view="fitView"
      @reset-view="resetView"
      @zoom-in="zoomBy(1.2)"
      @zoom-out="zoomBy(1 / 1.2)"
    />

    <!-- 主体三栏：组件库 + 画布 + 右侧校验 -->
    <div class="wf-designer__body">
      <!-- 左侧：组件库 -->
      <aside class="wf-designer__sidebar" :class="{ 'is-collapsed': store.sidebarCollapsed.value }">
        <WfPalette
          v-show="!store.sidebarCollapsed.value"
          :categories="paletteCategories"
          @palette-mousedown="onPaletteMouseDown"
        />
        <div v-show="store.sidebarCollapsed.value" class="wf-designer__sidebar-collapsed-tip">
          <el-button text @click="store.sidebarCollapsed.value = false">
            <el-icon size="20"><Expand /></el-icon>
          </el-button>
        </div>
      </aside>

      <!-- 中间：画布区 -->
      <main class="wf-designer__canvas" @keydown="handleKeydown" tabindex="0">
        <WfCanvas
          ref="canvasRef"
          :nodes="store.nodes.value"
          :edges="store.edges.value"
          :viewport="viewport"
          :selected-node-id="store.selectedNodeId.value"
          :selected-node-ids="store.selectedNodeIds.value"
          :selected-edge-id="store.selectedEdgeId.value"
          :mode="store.canvasMode.value"
          @update:viewport="viewport = $event"
          @select-node="store.selectNode"
          @update:selected-node-ids="(ids: string[]) => (store.selectedNodeIds.value = ids)"
          @select-edge="store.selectEdge"
          @delete-edge="onDeleteEdge"
          @move-node="onMoveNode"
          @mode-change="(m: 'pan' | 'select') => (store.canvasMode.value = m)"
          @create-edge="onCreateEdge"
          @open-props="onOpenNodeProps"
        />

        <!-- 浮动工具：缩放 + 缩放比例 + 适配 -->
        <WfLayoutTools
          :zoom="viewport.zoom"
          @zoom-in="zoomBy(1.2)"
          @zoom-out="zoomBy(1 / 1.2)"
          @reset-view="resetView"
          @fit-view="fitView"
        />

        <!-- 浮动对齐工具栏：选中节点时弹出 -->
        <WfFloatBar
          :visible="hasNodeSelection"
          :node-count="selectedNodeCount"
          @align="onFloatAlign"
          @distribute="onFloatDistribute"
          @flip="onFloatFlip"
          @group="store.groupSelection()"
          @ungroup="store.ungroupSelection()"
        />

        <!-- 右下：小地图 -->
        <WfMiniMap
          v-if="store.minimapVisible.value"
          :nodes="store.nodes.value"
          :edges="store.edges.value"
          :viewport="viewport"
          :canvas-rect="canvasRect"
          @navigate="onMiniMapNavigate"
        />
      </main>

      <!-- 右侧：校验结果（抽屉） -->
      <aside
        v-show="!store.validationPanelCollapsed.value"
        class="wf-designer__right"
      >
        <div class="wf-designer__right-header">
          <el-icon><CircleCheck /></el-icon>
          <span>校验结果</span>
          <el-badge
            v-if="store.hasErrors.value || store.hasWarnings.value"
            :value="store.validationIssues.value.length"
            :type="store.hasErrors.value ? 'danger' : 'warning'"
            :max="99"
          />
        </div>
        <div class="wf-designer__panels">
          <WfValidatePanel />
        </div>
      </aside>
    </div>

    <!-- 节点属性弹窗（双击节点触发） -->
    <el-dialog
      v-model="store.propsDialogOpen.value"
      title="节点属性"
      width="560px"
      :close-on-click-modal="false"
      destroy-on-close
      append-to-body
    >
      <WfPropertiesPanel v-if="store.propsDialogOpen.value" dialog-mode />
    </el-dialog>

    <!-- 导入/导出对话框（JSON 或 BPMN） -->
    <WfJsonIO v-model="ioDialogVisible" v-model:mode="ioMode" v-model:format="ioFormat" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Expand, CircleCheck } from '@element-plus/icons-vue'

import WfCanvas from '@/components/workflow/WfCanvas.vue'
import WfToolbar from '@/components/workflow/WfToolbar.vue'
import WfPalette from '@/components/workflow/WfPalette.vue'
import WfLayoutTools from '@/components/workflow/WfLayoutTools.vue'
import WfMiniMap from '@/components/workflow/WfMiniMap.vue'
import WfPropertiesPanel from '@/components/workflow/WfPropertiesPanel.vue'
import WfValidatePanel from '@/components/workflow/WfValidatePanel.vue'
import WfJsonIO from '@/components/workflow/WfJsonIO.vue'
import WfFloatBar from '@/components/workflow/WfFloatBar.vue'

import { useWorkflowStore } from '@/composables/useWorkflowStore'
import { paletteCategories } from '@/types/workflow/nodeTypes'
import type { PaletteItem, Viewport, NodeType } from '@/types/workflow'
import { nodeDefaults } from '@/types/workflow/nodeTypes'

const store = useWorkflowStore()

/* ========== 视口 ========== */
const viewport = ref<Viewport>({ zoom: 1, x: 0, y: 0 })
const canvasRef = ref<InstanceType<typeof WfCanvas> | null>(null)
const canvasRect = ref<{ left: number; top: number; width: number; height: number }>({ left: 0, top: 0, width: 0, height: 0 })

/* ========== 导入/导出对话框（JSON 或 BPMN） ========== */
const ioDialogVisible = ref(false)
const ioMode = ref<'export' | 'import'>('export')
const ioFormat = ref<'json' | 'bpmn'>('json')
function openIoDialog(mode: 'export' | 'import', format: 'json' | 'bpmn') {
  ioMode.value = mode
  ioFormat.value = format
  ioDialogVisible.value = true
}

/* ========== 节点双击 → 打开属性弹窗 ========== */
function onOpenNodeProps(id: string) {
  store.selectNode(id)
  store.propsDialogOpen.value = true
}

/* ========== 画布快捷键 ========== */
function handleKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  if (target) {
    const tag = target.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return
  }

  const meta = event.metaKey || event.ctrlKey

  // 删除
  if (event.key === 'Delete' || event.key === 'Backspace') {
    event.preventDefault()
    handleDeleteSelected()
    return
  }

  // 撤销 / 重做
  if (meta && event.key.toLowerCase() === 'z') {
    event.preventDefault()
    if (event.shiftKey) store.redo()
    else store.undo()
    return
  }
  if (meta && event.key.toLowerCase() === 'y') {
    event.preventDefault()
    store.redo()
    return
  }

  // 复制 / 粘贴 / 全选 / 重复
  if (meta && event.key.toLowerCase() === 'c') {
    event.preventDefault()
    store.copySelection()
    ElMessage.success('已复制')
    return
  }
  if (meta && event.key.toLowerCase() === 'v') {
    event.preventDefault()
    store.paste()
    return
  }
  if (meta && event.key.toLowerCase() === 'a') {
    event.preventDefault()
    store.selectedNodeIds.value = store.nodes.value.map(n => n.id)
    return
  }
  if (meta && event.key.toLowerCase() === 'd') {
    event.preventDefault()
    store.duplicateSelection()
    return
  }

  // 保存（演示用，无后端）
  if (meta && event.key.toLowerCase() === 's') {
    event.preventDefault()
    ElMessage.success('草稿已保存（演示）')
    return
  }

  // 适配视图
  if (event.key === 'F' || event.key === 'f') {
    if (meta || event.shiftKey) {
      event.preventDefault()
      fitView()
    }
  }
}

function handleDeleteSelected() {
  const ids = store.collectSelectedNodeIds()
  if (ids.length > 1) {
    ElMessageBox.confirm(`确认删除选中的 ${ids.length} 个节点及其连线？`, '删除确认', {
      type: 'warning'
    }).then(() => {
      const r = store.removeNodes(ids)
      store.pushHistory()
      ElMessage.success(`已删除 ${r.removedNodes} 个节点 / ${r.removedEdges} 条连线`)
    }).catch(() => { })
    return
  }
  if (ids.length === 1) {
    const r = store.removeNode(ids[0])
    if (r.removedNodes > 0) {
      store.pushHistory()
      ElMessage.success(`已删除 ${r.removedNodes} 个节点 / ${r.removedEdges} 条连线`)
    }
    return
  }
  if (store.selectedEdgeId.value) {
    if (store.removeEdge(store.selectedEdgeId.value)) {
      ElMessage.success('已删除连线')
    }
  }
}

function onDeleteEdge(id: string) {
  if (store.removeEdge(id)) ElMessage.success('已删除连线')
}

function onMoveNode(payload: { id: string; x: number; y: number }) {
  store.moveNode(payload.id, payload.x, payload.y)
  // 注意：移动不打历史栈（避免拖拽过程产生大量历史点）；松手时由 pushHistory 提交
}

function onCreateEdge(payload: { sourceId: string; targetId: string }) {
  // 防止重复连线：起点→终点已存在则跳过
  const exists = store.edges.value.some(
    e => e.sourceId === payload.sourceId && e.targetId === payload.targetId
  )
  if (exists) {
    ElMessage.info('连线已存在')
    return
  }
  store.addEdge({
    id: `edge-${Date.now()}`,
    sourceId: payload.sourceId,
    targetId: payload.targetId
  })
}

/* ========== 视图操作 ========== */
function zoomBy(factor: number) {
  viewport.value.zoom = Math.min(3, Math.max(0.2, viewport.value.zoom * factor))
}

/* ========== 浮动对齐工具栏 ========== */
const hasNodeSelection = computed(() => store.selectedNodeIds.value.length > 0 || !!store.selectedNodeId.value)
const selectedNodeCount = computed(() => {
  const set = new Set(store.selectedNodeIds.value)
  if (store.selectedNodeId.value) set.add(store.selectedNodeId.value)
  return set.size
})

function onFloatAlign(target: 'left' | 'center-h' | 'right' | 'top' | 'center-v' | 'bottom') {
  store.alignSelection(target)
}
function onFloatDistribute(axis: 'h' | 'v') {
  store.distributeSelection(axis)
}
function onFloatFlip(axis: 'h' | 'v') {
  store.flipSelection(axis)
}

function resetView() {
  viewport.value = { zoom: 1, x: 0, y: 0 }
}

function fitView() {
  canvasRef.value?.fitView()
}

function onMiniMapNavigate(v: Viewport) {
  viewport.value = v
}

/* ========== 同步画布尺寸给迷你地图 ========== */
function updateCanvasRect() {
  const el = (canvasRef.value as unknown as { getCanvasEl?: () => HTMLElement | null })?.getCanvasEl?.()
  if (!el) return
  const rect = el.getBoundingClientRect()
  canvasRect.value = { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
}

/* ========== 组件库拖拽创建节点 ========== */
function onPaletteMouseDown(payload: { item: PaletteItem; event: MouseEvent }) {
  const { item, event } = payload
  const handleMouseMove = (e: MouseEvent) => {
    canvasRef.value?.setGhostTarget?.(e.clientX, e.clientY)
  }
  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    if (!canvasRef.value) return
    const world = canvasRef.value.clientToWorld(e.clientX, e.clientY)
    const rect = canvasRef.value.getCanvasRect?.()
    if (!rect) return
    const inCanvas =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    if (!inCanvas) return
    const defaults = nodeDefaults[item.type]
    const newNode = {
      id: `node-${Date.now()}`,
      type: item.type,
      label: defaults.label,
      x: world.x - defaults.width / 2,
      y: world.y - defaults.height / 2,
      width: defaults.width,
      height: defaults.height
    }
    store.addNode(newNode)
    store.selectNode(newNode.id)
  }
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  event.preventDefault()
}

onMounted(() => {
  updateCanvasRect()
  window.addEventListener('resize', updateCanvasRect)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCanvasRect)
})
</script>

<style scoped lang="scss">
.wf-designer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #f0f2f5;
  overflow: hidden;
}

.wf-designer__body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ========== 左侧 ========== */
.wf-designer__sidebar {
  width: 220px;
  background: #ffffff;
  border-right: 1px solid #e4e7ed;
  flex-shrink: 0;
  transition: width 0.2s ease;
  overflow: hidden;

  &.is-collapsed {
    width: 36px;
  }
}

.wf-designer__sidebar-collapsed-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* ========== 中间画布 ========== */
.wf-designer__canvas {
  flex: 1;
  position: relative;
  background: #f5f7fa;
  overflow: hidden;
  outline: none;
}

/* ========== 右侧 ========== */
.wf-designer__right {
  width: 320px;
  background: #ffffff;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #e4e7ed;
}

.wf-designer__right-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #e4e7ed;
  background: #fafbfc;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.wf-designer__panels {
  flex: 1;
  overflow: hidden;
}
</style>