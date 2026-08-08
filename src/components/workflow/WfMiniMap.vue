<template>
  <div class="wf-mini-map">
    <div class="wf-mini-map__title">缩略图</div>
    <div class="wf-mini-map__viewport">
      <svg
        class="wf-mini-map__svg"
        :viewBox="viewBox"
        preserveAspectRatio="xMidYMid meet"
      >
        <!-- 连线 -->
        <g>
          <path
            v-for="edge in edges"
            :key="edge.id"
            :d="getEdgePath(edge)"
            stroke="#00d4ff"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
          />
        </g>

        <!-- 节点 -->
        <g>
          <template v-for="node in nodes" :key="node.id">
            <!-- 圆形 -->
            <circle
              v-if="node.type === 'start' || node.type === 'end'"
              :cx="node.x + node.width / 2"
              :cy="node.y + node.height / 2"
              :r="Math.min(node.width, node.height) / 2"
              :fill="node.type === 'start' ? '#52c41a' : '#f5222d'"
              stroke="#ffffff"
              stroke-width="1"
            />
            <!-- 矩形 -->
            <rect
              v-else-if="node.type === 'manual-task'"
              :x="node.x"
              :y="node.y"
              :width="node.width"
              :height="node.height"
              rx="6"
              fill="#2b6fd6"
              stroke="#ffffff"
              stroke-width="1"
            />
            <!-- 菱形 -->
            <polygon
              v-else-if="node.type === 'parallel-gateway'"
              :points="diamondPoints(node)"
              fill="#f9c440"
              stroke="#ffffff"
              stroke-width="1"
            />
          </template>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WorkflowNode, WorkflowEdge } from '@/types/workflow'

interface Props {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

const props = defineProps<Props>()

/** 计算缩略图范围：取所有节点 + 留白 */
const viewBox = computed(() => {
  if (props.nodes.length === 0) return '0 0 200 120'

  const padding = 40
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const node of props.nodes) {
    minX = Math.min(minX, node.x)
    minY = Math.min(minY, node.y)
    maxX = Math.max(maxX, node.x + node.width)
    maxY = Math.max(maxY, node.y + node.height)
  }

  return `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`
})

/** 入口为节点右边界中点，出口为节点左边界中点，画一条直线（MiniMap 简化） */
function getEdgePath(edge: WorkflowEdge) {
  const source = props.nodes.find(n => n.id === edge.sourceId)
  const target = props.nodes.find(n => n.id === edge.targetId)
  if (!source || !target) return ''

  const sx = source.x + source.width
  const sy = source.y + source.height / 2
  const tx = target.x
  const ty = target.y + target.height / 2

  return `M ${sx} ${sy} L ${tx} ${ty}`
}

/** 计算菱形节点 4 个顶点 */
function diamondPoints(node: WorkflowNode) {
  const cx = node.x + node.width / 2
  const cy = node.y + node.height / 2
  const halfW = node.width / 2
  const halfH = node.height / 2
  return `${cx},${cy - halfH} ${cx + halfW},${cy} ${cx},${cy + halfH} ${cx - halfW},${cy}`
}
</script>

<style scoped lang="scss">
.wf-mini-map {
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 50;
  width: 180px;
  height: 120px;
  background: #ffffff;
  border: 1.5px solid #00d4ff;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.wf-mini-map__title {
  height: 24px;
  line-height: 24px;
  text-align: center;
  font-size: 12px;
  color: #606266;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
  flex-shrink: 0;
}

.wf-mini-map__viewport {
  flex: 1;
  min-height: 0;
  padding: 4px;
}

.wf-mini-map__svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
