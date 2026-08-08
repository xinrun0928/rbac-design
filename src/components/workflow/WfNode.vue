<template>
  <div
    class="wf-node"
    :class="[`wf-node--${node.type}`, { 'is-selected': selected, 'is-hovered': hovered }]"
    :style="nodeStyle"
    @mousedown.stop="handleMouseDown"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click.stop="handleClick"
    @dblclick.stop="handleDoubleClick"
  >
    <!-- ========== 任务类（5 种）：实心圆角矩形 + 内嵌图标 + 文字 ========== -->
    <template v-if="isTask">
      <div class="wf-node__rect">
        <svg class="wf-node__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path :d="meta.iconPath" />
        </svg>
        <span class="wf-node__text">{{ node.label }}</span>
      </div>
    </template>

    <!-- ========== 网关类（4 种）：菱形 + 内部符号 ========== -->
    <template v-else-if="isGateway">
      <div class="wf-node__diamond" :style="diamondStyle">
        <div class="wf-node__diamond-inner">
          <!-- 网关内嵌图标 -->
          <svg v-if="meta.gatewayIcon === 'plus'" viewBox="0 0 32 32" class="wf-node__gateway-icon" aria-hidden="true">
            <line x1="16" y1="6" x2="16" y2="26" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
            <line x1="6" y1="16" x2="26" y2="16" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          </svg>
          <svg v-else-if="meta.gatewayIcon === 'cross'" viewBox="0 0 32 32" class="wf-node__gateway-icon" aria-hidden="true">
            <line x1="8" y1="8" x2="24" y2="24" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
            <line x1="24" y1="8" x2="8" y2="24" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          </svg>
          <svg v-else-if="meta.gatewayIcon === 'circle'" viewBox="0 0 32 32" class="wf-node__gateway-icon" aria-hidden="true">
            <circle cx="16" cy="16" r="9" fill="none" stroke="currentColor" stroke-width="3" />
          </svg>
          <svg v-else-if="meta.gatewayIcon === 'pentagon'" viewBox="0 0 32 32" class="wf-node__gateway-icon" aria-hidden="true">
            <polygon points="16,4 28,12 24,26 8,26 4,12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </template>

    <!-- ========== 事件类（5 种）：圆形 + 内嵌图标 ========== -->
    <template v-else>
      <div
        class="wf-node__circle"
        :class="{
          'is-thick': meta.thickBorder,
          'is-double': meta.doubleCircle
        }"
        :style="circleStyle"
      >
        <!-- 双圆事件：内容嵌在双圆内 -->
        <svg v-if="meta.iconPath" class="wf-node__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            :d="meta.iconPath"
            :fill="meta.useStroke ? 'none' : 'currentColor'"
            :stroke="meta.useStroke ? 'currentColor' : 'none'"
            :stroke-width="meta.useStroke ? 1.5 : 0"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </template>

    <!-- ========== 4 个边中点连接点：始终存在，便于发现 ========== -->
    <div class="wf-node__hit wf-node__hit--top" data-port="top" @mousedown.stop="handlePortMouseDown($event, 'top')" />
    <div class="wf-node__hit wf-node__hit--right" data-port="right" @mousedown.stop="handlePortMouseDown($event, 'right')" />
    <div class="wf-node__hit wf-node__hit--bottom" data-port="bottom" @mousedown.stop="handlePortMouseDown($event, 'bottom')" />
    <div class="wf-node__hit wf-node__hit--left" data-port="left" @mousedown.stop="handlePortMouseDown($event, 'left')" />

    <!-- 可见的端口圆点 -->
    <div class="wf-node__port wf-node__port--top" data-port="top" title="拖拽连线" />
    <div class="wf-node__port wf-node__port--right" data-port="right" title="拖拽连线" />
    <div class="wf-node__port wf-node__port--bottom" data-port="bottom" title="拖拽连线" />
    <div class="wf-node__port wf-node__port--left" data-port="left" title="拖拽连线" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { WorkflowNode, NodeType } from '@/types/workflow'
import { nodeMeta } from '@/types/workflow/nodeTypes'

interface Props {
  node: WorkflowNode
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false
})

export type NodePort = 'top' | 'right' | 'bottom' | 'left'
export type NodeHandle = 'tl' | 'tr' | 'bl' | 'br'

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'drag-start', payload: { id: string; event: MouseEvent }): void
  (e: 'port-drag-start', payload: {
    id: string
    port: NodePort
    event: MouseEvent
  }): void
  (e: 'resize-start', payload: {
    id: string
    handle: NodeHandle
    event: MouseEvent
  }): void
  (e: 'open-props', id: string): void
}>()

const hovered = ref(false)

/* ========== 渲染元数据 ========== */
const meta = computed(() => nodeMeta[props.node.type])

const isTask = computed(() =>
  ['user-task', 'manual-task', 'service-task', 'script-task', 'receive-task'].includes(props.node.type)
)
const isGateway = computed(() =>
  ['parallel-gateway', 'exclusive-gateway', 'inclusive-gateway', 'event-gateway'].includes(props.node.type)
)

/** 节点根容器样式：定位 + 尺寸 */
const nodeStyle = computed(() => ({
  left: `${props.node.x}px`,
  top: `${props.node.y}px`,
  width: `${props.node.width}px`,
  height: `${props.node.height}px`
}))

/** 圆形事件：边框颜色 + 底色 */
const circleStyle = computed(() => ({
  borderColor: meta.value.color,
  background: meta.value.bg,
  color: meta.value.color
}))

/** 菱形网关：底色 + 内嵌图标颜色 */
const diamondStyle = computed(() => ({
  // css 变量传给 ::before
  '--diamond-bg': meta.value.bg,
  '--gateway-icon-color': meta.value.color
} as Record<string, string>))

function handleMouseDown(event: MouseEvent) {
  emit('drag-start', { id: props.node.id, event })
}

function handleClick() {
  emit('select', props.node.id)
}

function handleDoubleClick() {
  emit('open-props', props.node.id)
}

function handlePortMouseDown(event: MouseEvent, port: NodePort) {
  emit('port-drag-start', { id: props.node.id, port, event })
}

function handleResizeStart(event: MouseEvent, handle: NodeHandle) {
  emit('resize-start', { id: props.node.id, handle, event })
}
</script>

<style scoped lang="scss">
.wf-node {
  position: absolute;
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }

  &.is-selected {
    cursor: move;
  }
}

/* ========== 选中节点：外层虚线包围框 ==========
 * 用 outline 不占空间、不影响布局；不针对节点本体颜色才生效
 */
.wf-node.is-selected {
  outline: 2px dashed #ff7d00;
  outline-offset: 6px;
  border-radius: 4px;
  animation: wf-node-select-blink 1.6s ease-in-out infinite;
}

@keyframes wf-node-select-blink {
  0%, 100% { outline-color: #ff7d00; }
  50%      { outline-color: #ffb066; }
}

/* ========== 通用文字 ========== */
.wf-node__text {
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  pointer-events: none;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 8px;
}

/* ========== 任务类节点：实心圆角矩形 ========== */
.wf-node__rect {
  width: 100%;
  height: 100%;
  background: #2b6fd6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  padding: 0 8px;
}

.wf-node__icon {
  width: 20px;
  height: 20px;
  fill: #ffffff;
  flex-shrink: 0;
}

/* ========== 事件类节点：圆形 + 内嵌图标 ========== */
.wf-node__circle {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 3px solid;
  background: rgba(255, 255, 255, 0.05);
  position: relative;
  transition: border-color 0.2s ease, background 0.2s ease;

  &.is-thick {
    border-width: 4px;
  }

  /* 中间事件：双圆（外圆 + 内圆） */
  &.is-double::before {
    content: '';
    position: absolute;
    inset: 6px;
    border-radius: 50%;
    border: 2px solid currentColor;
    background: rgba(255, 255, 255, 0.05);
  }

  &.is-double .wf-node__icon {
    position: relative;
    z-index: 1;
  }
}

.wf-node__circle .wf-node__icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

/* ========== 菱形网关 ========== */
.wf-node__diamond {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.wf-node__diamond::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--diamond-bg, #f9c440);
  transform: rotate(45deg);
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}

.wf-node__diamond-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gateway-icon-color, #fff);
}

.wf-node__gateway-icon {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
}

/* ========== 透明 hit-area（放大端口的可拖拽区域） ========== */
.wf-node__hit {
  position: absolute;
  width: 24px;
  height: 24px;
  z-index: 6;
  cursor: crosshair;
}

.wf-node__hit--top    { top: -12px;    left: 50%;     margin-left: -12px; }
.wf-node__hit--right  { top: 50%;      right: -12px;  margin-top: -12px; }
.wf-node__hit--bottom { bottom: -12px; left: 50%;     margin-left: -12px; }
.wf-node__hit--left   { top: 50%;      left: -12px;   margin-top: -12px; }

/* ========== 端口圆点 ==========
 * 默认完全隐藏（opacity: 0），鼠标悬停或选中时淡入显示
 * 用 opacity 而不是 display: none 是为了配合 transition 平滑过渡
 */
.wf-node__port {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #1677ff;
  z-index: 4;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
  pointer-events: none;
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
}

.wf-node.is-hovered .wf-node__port,
.wf-node.is-selected .wf-node__port {
  opacity: 1;
  transform: scale(1);
  animation: wf-port-pulse 1.6s ease-in-out infinite;
}

/* ========== 端口命中区（透明放大的可拖拽区域） ==========
 * 保持始终可点击（pointer-events: auto），不随可见端口一起隐藏
 * （基础 .wf-node__hit 定义在「透明 hit-area」段落中）
 */

@keyframes wf-port-pulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.18), 0 2px 6px rgba(0, 0, 0, 0.45); }
  50%      { box-shadow: 0 0 0 6px rgba(22, 119, 255, 0.08), 0 2px 6px rgba(0, 0, 0, 0.45); }
}

.wf-node__port--top    { top: -6px;    left: 50%;     margin-left: -6px; }
.wf-node__port--right  { top: 50%;     right: -6px;  margin-top: -6px; }
.wf-node__port--bottom { bottom: -6px; left: 50%;     margin-left: -6px; }
.wf-node__port--left   { top: 50%;     left: -6px;   margin-top: -6px; }
</style>