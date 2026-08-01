<template>
  <div class="stats-row" :class="{ 'no-click': !clickable }">
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
          {{ item.label }}
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
</script>

<style scoped lang="scss">
.stats-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
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

  flex: 1 1 150px;
  min-width: 130px;
  max-width: 200px;
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

  white-space: nowrap;
}

/* 平板 */
@media (max-width: 992px) {
  .stats-card {
    flex: 1 1 130px;
    min-width: 120px;
    max-width: 180px;
  }
}

/* 手机 */
@media (max-width: 768px) {
  .stats-card {
    flex: 1 1 100%;
    min-width: 0;
    max-width: 360px;
  }
}
</style>