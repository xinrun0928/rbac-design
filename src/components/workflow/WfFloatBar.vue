<template>
  <Transition name="wf-floatbar">
    <div v-if="visible" class="wf-floatbar">
      <div class="wf-floatbar__panel">
        <!-- 对齐:左/中/右/顶/中/底 -->
        <div class="wf-floatbar__group">
          <el-tooltip content="左对齐" placement="bottom">
            <button class="wf-fb-btn" @click="emit('align', 'left')">
              <svg viewBox="0 0 16 16" width="14" height="14"><rect x="1" y="2" width="14" height="1.5" rx="0.5" /><rect x="1" y="6.25" width="9" height="1.5" rx="0.5" /><rect x="1" y="10.5" width="12" height="1.5" rx="0.5" /></svg>
            </button>
          </el-tooltip>
          <el-tooltip content="水平居中" placement="bottom">
            <button class="wf-fb-btn" @click="emit('align', 'center-h')">
              <svg viewBox="0 0 16 16" width="14" height="14"><rect x="1" y="2" width="14" height="1.5" rx="0.5" /><rect x="3.5" y="6.25" width="9" height="1.5" rx="0.5" /><rect x="2" y="10.5" width="12" height="1.5" rx="0.5" /></svg>
            </button>
          </el-tooltip>
          <el-tooltip content="右对齐" placement="bottom">
            <button class="wf-fb-btn" @click="emit('align', 'right')">
              <svg viewBox="0 0 16 16" width="14" height="14"><rect x="1" y="2" width="14" height="1.5" rx="0.5" /><rect x="6" y="6.25" width="9" height="1.5" rx="0.5" /><rect x="3" y="10.5" width="12" height="1.5" rx="0.5" /></svg>
            </button>
          </el-tooltip>
        </div>

        <div class="wf-floatbar__divider" />

        <div class="wf-floatbar__group">
          <el-tooltip content="顶对齐" placement="bottom">
            <button class="wf-fb-btn" @click="emit('align', 'top')">
              <svg viewBox="0 0 16 16" width="14" height="14"><rect x="2" y="1" width="1.5" height="14" rx="0.5" /><rect x="6.25" y="1" width="1.5" height="9" rx="0.5" /><rect x="10.5" y="1" width="1.5" height="12" rx="0.5" /></svg>
            </button>
          </el-tooltip>
          <el-tooltip content="垂直居中" placement="bottom">
            <button class="wf-fb-btn" @click="emit('align', 'center-v')">
              <svg viewBox="0 0 16 16" width="14" height="14"><rect x="2" y="1" width="1.5" height="14" rx="0.5" /><rect x="6.25" y="3.5" width="1.5" height="9" rx="0.5" /><rect x="10.5" y="2" width="1.5" height="12" rx="0.5" /></svg>
            </button>
          </el-tooltip>
          <el-tooltip content="底对齐" placement="bottom">
            <button class="wf-fb-btn" @click="emit('align', 'bottom')">
              <svg viewBox="0 0 16 16" width="14" height="14"><rect x="2" y="1" width="1.5" height="14" rx="0.5" /><rect x="6.25" y="6" width="1.5" height="9" rx="0.5" /><rect x="10.5" y="3" width="1.5" height="12" rx="0.5" /></svg>
            </button>
          </el-tooltip>
        </div>

        <div class="wf-floatbar__divider" />

        <!-- 分布:水平/垂直 -->
        <div class="wf-floatbar__group">
          <el-tooltip content="水平等距分布" placement="bottom">
            <button class="wf-fb-btn" :disabled="nodeCount < 3" @click="emit('distribute', 'h')">
              <svg viewBox="0 0 16 16" width="14" height="14"><rect x="1" y="6" width="2" height="4" rx="0.5" /><rect x="5" y="4" width="2" height="8" rx="0.5" /><rect x="13" y="4" width="2" height="8" rx="0.5" /><line x1="0.5" y1="8" x2="15.5" y2="8" stroke-dasharray="2 1" /></svg>
            </button>
          </el-tooltip>
          <el-tooltip content="垂直等距分布" placement="bottom">
            <button class="wf-fb-btn" :disabled="nodeCount < 3" @click="emit('distribute', 'v')">
              <svg viewBox="0 0 16 16" width="14" height="14"><rect x="6" y="1" width="4" height="2" rx="0.5" /><rect x="4" y="5" width="8" height="2" rx="0.5" /><rect x="4" y="13" width="8" height="2" rx="0.5" /><line x1="8" y1="0.5" x2="8" y2="15.5" stroke-dasharray="2 1" /></svg>
            </button>
          </el-tooltip>
        </div>

        <div class="wf-floatbar__divider" />

        <!-- 翻转:水平/垂直 -->
        <div class="wf-floatbar__group">
          <el-tooltip content="水平翻转" placement="bottom">
            <button class="wf-fb-btn" :disabled="nodeCount < 2" @click="emit('flip', 'h')">
              <svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 2v12M3 5l-2 3 2 3M13 5l2 3-2 3" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
            </button>
          </el-tooltip>
          <el-tooltip content="垂直翻转" placement="bottom">
            <button class="wf-fb-btn" :disabled="nodeCount < 2" @click="emit('flip', 'v')">
              <svg viewBox="0 0 16 16" width="14" height="14"><path d="M2 8h12M5 3l3-2 3 2M5 13l3 2 3-2" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
            </button>
          </el-tooltip>
        </div>

        <div class="wf-floatbar__divider" />

        <!-- 组合 / 解组 -->
        <div class="wf-floatbar__group">
          <el-tooltip content="组合" placement="bottom">
            <button class="wf-fb-btn" :disabled="nodeCount < 2" @click="emit('group')">
              <svg viewBox="0 0 16 16" width="14" height="14"><rect x="2" y="2" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 1.5" rx="1" /></svg>
            </button>
          </el-tooltip>
          <el-tooltip content="解组" placement="bottom">
            <button class="wf-fb-btn" @click="emit('ungroup')">
              <svg viewBox="0 0 16 16" width="14" height="14"><rect x="2" y="2" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" rx="1" /></svg>
            </button>
          </el-tooltip>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean; nodeCount: number }>()

const emit = defineEmits<{
  (e: 'align', target: 'left' | 'center-h' | 'right' | 'top' | 'center-v' | 'bottom'): void
  (e: 'distribute', axis: 'h' | 'v'): void
  (e: 'flip', axis: 'h' | 'v'): void
  (e: 'group'): void
  (e: 'ungroup'): void
}>()
</script>

<style scoped lang="scss">
.wf-floatbar {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  pointer-events: none;
}

.wf-floatbar__panel {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(228, 231, 237, 0.8);
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04);
  pointer-events: auto;
  gap: 4px;
}

.wf-floatbar__info {
  padding: 0 8px 0 4px;
  font-size: 12px;
  color: #606266;
  user-select: none;
}

.wf-floatbar__count {
  font-weight: 500;
  color: #303133;
}

.wf-floatbar__divider {
  width: 1px;
  height: 18px;
  background: #e4e7ed;
  margin: 0 4px;
}

.wf-floatbar__group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.wf-fb-btn {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #606266;
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;

  svg rect, svg line, svg path {
    fill: currentColor;
  }

  &:hover:not(:disabled) {
    background: #e6f4ff;
    color: #1677ff;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

/* ========== 过渡 ========== */
.wf-floatbar-enter-active,
.wf-floatbar-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.wf-floatbar-enter-from,
.wf-floatbar-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}
</style>