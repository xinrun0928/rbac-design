<template>
  <div class="stats-row" :class="{ 'no-click': !clickable }">
    <div
      v-for="item in items"
      :key="item.key"
      class="stats-card"
      :class="{ active: clickable && modelValue === item.key }"
      :style="{ width: cardWidth + 'px' }"
      @click="handleClick(item)"
    >
      <div class="stats-icon" :style="{ background: item.bgColor, color: item.color }">
        <el-icon :size="26"><component :is="item.icon" /></el-icon>
      </div>
      <div class="stats-info">
        <div class="stats-value" :style="{ color: item.color }">{{ item.value }}</div>
        <div class="stats-label">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

/**
 * 顶部统计卡片项
 */
export interface StatsCardItem {
  /** 唯一标识（用于 v-model 选中匹配） */
  key: string
  /** 显示标签 */
  label: string
  /** 数值 */
  value: number | string
  /** 图标组件 */
  icon: Component
  /** 图标/数值主色 */
  color: string
  /** 图标背景色 */
  bgColor: string
}

const props = withDefaults(defineProps<{
  /** 统计卡片数据 */
  items: StatsCardItem[]
  /** 当前激活项 key（v-model） */
  modelValue?: string
  /** 是否可点击筛选（默认 true） */
  clickable?: boolean
  /** 卡片宽度（默认 200px） */
  cardWidth?: number
}>(), {
  modelValue: '',
  clickable: true,
  cardWidth: 200
})

const emit = defineEmits<{
  (e: 'update:modelValue', key: string): void
  (e: 'change', key: string): void
}>()

function handleClick(item: StatsCardItem) {
  if (!props.clickable) return
  emit('update:modelValue', item.key)
  emit('change', item.key)
}
</script>

<style lang="scss" scoped>
.stats-row {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
  padding: 16px 0;
  background: #f8f9fb;
  border-radius: 10px;
  flex-shrink: 0;

  &.no-click {
    .stats-card {
      cursor: default;

      &:hover {
        transform: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      }
    }
  }
}

.stats-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: #fff;
  border: 2px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &.active {
    border-color: #409eff;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
  }

  .stats-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .stats-info {
    .stats-value {
      font-size: 26px;
      font-weight: 700;
      line-height: 1.2;
    }

    .stats-label {
      font-size: 13px;
      color: #909399;
      margin-top: 4px;
    }
  }
}
</style>
