<template>
  <div class="stats-row" :class="{ 'no-click': !clickable }">
    <div class="stats-inner">
      <div
        v-for="item in items"
        :key="item.key"
        class="stats-card"
        :class="{ active: clickable && modelValue === item.key }"
        :style="{
          width: cardWidth ? `${cardWidth}px` : undefined,
          '--theme-color': item.color,
          '--theme-bg': item.bgColor
        }"
        @click="handleClick(item)"
      >
      <!-- 背景装饰 -->
      <div class="card-decoration"></div>

      <!-- 图标 -->
      <div
        class="stats-icon"
        :style="{
          background: item.bgColor,
          color: item.color
        }"
      >
        <el-icon :size="22">
          <component :is="item.icon" />
        </el-icon>
      </div>

      <!-- 信息 -->
      <div class="stats-info">
        <div
          class="stats-value"
          :style="{ color: item.color }"
        >
          {{ item.value }}
        </div>

        <div class="stats-label">
          <el-tooltip :content="item.label" :disabled="!isLabelOverflow(item.label)" placement="top" :show-after="200">
            <span class="stats-label-text">{{ item.label }}</span>
          </el-tooltip>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

export interface StatsCardItem {
  key: string
  label: string
  value: number | string
  icon: Component
  color: string
  bgColor: string
}

const props = withDefaults(
  defineProps<{
    items: StatsCardItem[]
    modelValue?: string
    clickable?: boolean
    /** 不传则自动伸缩 */
    cardWidth?: number
  }>(),
  {
    modelValue: '',
    clickable: true,
    cardWidth: 0
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', key: string): void
  (e: 'change', key: string): void
}>()

function handleClick(item: StatsCardItem) {
  if (!props.clickable) return

  emit('update:modelValue', item.key)
  emit('change', item.key)
}

// 估算文案是否超出卡片可用宽度（中文字符按 13px、其他按 7px）
function isLabelOverflow(label: string): boolean {
  const width = props.cardWidth || 200
  const available = width - 90
  let textWidth = 0
  for (const ch of label) {
    textWidth += /[\u4e00-\u9fff]/.test(ch) ? 13 : 7
  }
  return textWidth > available
}
</script>

<style scoped lang="scss">
.stats-row {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  margin-bottom: 16px;
  padding-bottom: 4px;
  scrollbar-width: thin;
  scrollbar-color: #c0c4cc transparent;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c0c4cc;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.stats-inner {
  display: flex;
  gap: 16px;
  margin: 0 auto;
  width: max-content;
}

.stats-row.no-click {
  .stats-card {
    cursor: default;

    &:hover {
      transform: none;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
    }
  }
}

.stats-card {
  position: relative;

  flex: 0 0 200px;
  width: 200px;
  height: 86px;

  display: flex;
  align-items: center;
  gap: 12px;

  padding: 14px 16px;

  border-radius: 14px;

  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  border: 1px solid #edf2f7;

  overflow: hidden;
  cursor: pointer;

  transition: all 0.25s ease;

  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.1);
  }

  &.active {
    border-color: var(--theme-color);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
      height: 100%;
      background: var(--theme-color);
    }

    .stats-icon {
      transform: scale(1.06);
    }
  }
}

/* 背景装饰 */
.card-decoration {
  position: absolute;
  right: -20px;
  top: -20px;

  width: 80px;
  height: 80px;

  border-radius: 50%;

  background: var(--theme-bg);
  opacity: 0.22;
}

.stats-icon {
  position: relative;
  z-index: 1;

  width: 46px;
  height: 46px;

  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  transition: all 0.25s;

  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.7),
    0 3px 8px rgba(0, 0, 0, 0.05);
}

.stats-info {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
}

.stats-value {
  font-size: 24px;
  font-weight: 700;
  line-height: 1;

  font-variant-numeric: tabular-nums;
  letter-spacing: -0.3px;
}

.stats-label {
  margin-top: 6px;

  font-size: 13px;
  color: #909399;

  overflow: hidden;

  :deep(.el-tooltip__trigger) {
    display: block;
    width: 100%;
  }

  .stats-label-text {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

/* 平板 */
@media (max-width: 992px) {
  .stats-card {
    flex: 0 0 180px;
    width: 180px;
  }
}

/* 手机 */
@media (max-width: 768px) {
  .stats-card {
    flex: 0 0 160px;
    width: 160px;
  }
}
</style>