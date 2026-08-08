<template>
  <div class="wf-layout-tools">
    <el-tooltip content="放大" placement="right">
      <button class="wf-layout-tools__btn" @click="emit('zoom-in')">
        <el-icon><Plus /></el-icon>
      </button>
    </el-tooltip>

    <el-tooltip content="缩小" placement="right">
      <button class="wf-layout-tools__btn" @click="emit('zoom-out')">
        <el-icon><Minus /></el-icon>
      </button>
    </el-tooltip>

    <div class="wf-layout-tools__divider" />

    <el-tooltip content="重置视图" placement="right">
      <button class="wf-layout-tools__btn" @click="emit('reset-view')">
        <el-icon><Refresh /></el-icon>
      </button>
    </el-tooltip>

    <el-tooltip content="适配视图" placement="right">
      <button class="wf-layout-tools__btn" @click="emit('fit-view')">
        <el-icon><FullScreen /></el-icon>
      </button>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { Plus, Minus, Refresh, FullScreen } from '@element-plus/icons-vue'

const emit = defineEmits<{
  (e: 'zoom-in'): void
  (e: 'zoom-out'): void
  (e: 'reset-view'): void
  (e: 'fit-view'): void
}>()
</script>

<style scoped lang="scss">
.wf-layout-tools {
  position: absolute;
  left: 12px;
  bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(228, 231, 237, 0.8);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  z-index: 15;
}

.wf-layout-tools__btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #606266;
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;
  font-size: 14px;

  &:hover {
    background: #e6f4ff;
    color: #1677ff;
  }
}

.wf-layout-tools__divider {
  height: 1px;
  background: #e4e7ed;
  margin: 2px 4px;
}
</style>