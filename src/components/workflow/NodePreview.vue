<template>
  <svg
    v-if="render.kind === 'svg'"
    class="node-preview"
    viewBox="0 0 72 72"
    aria-hidden="true"
    preserveAspectRatio="xMidYMid meet"
  >
    <!-- ========== 任务类：实心圆角矩形 + 内嵌图标 ========== -->
    <template v-if="render.shape === 'rect'">
      <!-- 矩形容器：占中央 60x44 -->
      <rect x="6" y="14" width="60" height="44" rx="6" :fill="render.bg" />
      <!-- 图标：原始是 24x24 路径，居中放（translate 到矩形中心 36,36）-->
      <g transform="translate(24 24)">
        <path :d="render.iconPath" fill="#ffffff" />
      </g>
    </template>

    <!-- ========== 网关类：菱形 + 内部符号 ========== -->
    <template v-else-if="render.shape === 'diamond'">
      <!-- 菱形本体：旋转 45° 的矩形，中心 (36,36) -->
      <g transform="translate(36 36) rotate(45)">
        <rect x="-26" y="-26" width="52" height="52" rx="4" :fill="render.bg" />
      </g>
      <!-- 网关内嵌符号 -->
      <g v-if="render.gatewayIcon === 'plus'" transform="translate(36 36)" :stroke="render.color" stroke-width="3" stroke-linecap="round">
        <line x1="0" y1="-12" x2="0" y2="12" />
        <line x1="-12" y1="0" x2="12" y2="0" />
      </g>
      <g v-else-if="render.gatewayIcon === 'cross'" transform="translate(36 36)" :stroke="render.color" stroke-width="3" stroke-linecap="round">
        <line x1="-9" y1="-9" x2="9" y2="9" />
        <line x1="9" y1="-9" x2="-9" y2="9" />
      </g>
      <g v-else-if="render.gatewayIcon === 'circle'" transform="translate(36 36)" fill="none" :stroke="render.color" stroke-width="3">
        <circle cx="0" cy="0" r="10" />
      </g>
      <g v-else-if="render.gatewayIcon === 'pentagon'" transform="translate(36 36)" fill="none" :stroke="render.color" stroke-width="2.5" stroke-linejoin="round">
        <polygon points="0,-12 12,-7 9,8 -9,8 -12,-7" />
      </g>
    </template>

    <!-- ========== 事件类：圆形 + 内嵌图标（可选双圆） ========== -->
    <template v-else-if="render.shape === 'circle'">
      <!-- 外圆 -->
      <circle
        cx="36" cy="36" r="28"
        :fill="render.bg"
        :stroke="render.color"
        :stroke-width="render.thickBorder ? 5 : 3"
      />
      <!-- 双圆：内圈 -->
      <circle
        v-if="render.doubleCircle"
        cx="36" cy="36" r="20"
        fill="rgba(255,255,255,0.05)"
        :stroke="render.color"
        stroke-width="2"
      />
      <!-- 内嵌图标：translate(24, 24) 把 24x24 路径放到 72x72 中心 (36-12=24) -->
      <g v-if="render.iconPath" transform="translate(24 24)">
        <path
          :d="render.iconPath"
          :fill="render.useStroke ? 'none' : render.color"
          :stroke="render.useStroke ? render.color : 'none'"
          :stroke-width="render.useStroke ? 2 : 0"
          stroke-linejoin="round"
        />
      </g>
    </template>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NodeType } from '@/types/workflow'
import { nodeMeta } from '@/types/workflow/nodeTypes'

interface Props {
  type: NodeType
}

const props = defineProps<Props>()

const taskTypes: NodeType[] = ['user-task', 'manual-task', 'service-task', 'script-task', 'receive-task']
const gatewayTypes: NodeType[] = ['parallel-gateway', 'exclusive-gateway', 'inclusive-gateway', 'event-gateway']

const render = computed(() => {
  const t = props.type
  const meta = nodeMeta[t]
  if (taskTypes.includes(t)) {
    return {
      kind: 'svg' as const,
      shape: 'rect' as const,
      bg: meta.bg,
      iconPath: meta.iconPath
    }
  }
  if (gatewayTypes.includes(t)) {
    return {
      kind: 'svg' as const,
      shape: 'diamond' as const,
      bg: meta.bg,
      color: meta.color,
      gatewayIcon: meta.gatewayIcon
    }
  }
  // 事件类
  return {
    kind: 'svg' as const,
    shape: 'circle' as const,
    bg: meta.bg,
    color: meta.color,
    iconPath: meta.iconPath,
    useStroke: !!meta.useStroke,
    thickBorder: !!meta.thickBorder,
    doubleCircle: !!meta.doubleCircle
  }
})
</script>

<style scoped lang="scss">
.node-preview {
  width: 100%;
  height: 100%;
  display: block;
}
</style>