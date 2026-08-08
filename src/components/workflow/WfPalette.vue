<template>
  <div class="wf-palette">
    <el-scrollbar class="wf-palette__scroll">
      <el-collapse v-model="activeNames" class="wf-palette__collapse">
        <el-collapse-item
          v-for="category in categories"
          :key="category.key"
          :name="category.key"
          :title="category.title"
        >
          <!-- 每个分组内的 2 列网格 -->
          <div class="wf-palette__grid">
            <div
              v-for="item in category.items"
              :key="item.key"
              class="wf-palette__item"
              :title="item.desc || item.label"
              @mousedown="handleMouseDown($event, item)"
            >
              <div class="wf-palette__preview">
                <NodePreview :type="item.type" />
              </div>
              <span class="wf-palette__label">{{ item.label }}</span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PaletteCategory, PaletteItem } from '@/types/workflow'
import NodePreview from './NodePreview.vue'

interface Props {
  categories: PaletteCategory[]
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'palette-mousedown', payload: { item: PaletteItem; event: MouseEvent }): void
}>()

const activeNames = ref<string[]>(['event', 'task', 'gateway'])

function handleMouseDown(event: MouseEvent, item: PaletteItem) {
  if (event.button !== 0) return
  event.preventDefault()
  emit('palette-mousedown', { item, event })
}
</script>

<style scoped lang="scss">
.wf-palette {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-right: 1px solid #ebeef5;
}

.wf-palette__scroll {
  height: 100%;
}

.wf-palette__collapse {
  border: none;

  :deep(.el-collapse-item__header) {
    padding: 0 16px;
    height: 40px;
    line-height: 40px;
    font-size: 13px;
    font-weight: 600;
    color: #303133;
    background: #fafbfc;
    border-bottom: 1px solid #f0f2f5;
  }

  :deep(.el-collapse-item__wrap) {
    border-bottom: none;
  }

  :deep(.el-collapse-item__content) {
    padding: 12px;
  }
}

/* 2 列网格 */
.wf-palette__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

/* 单个卡片：column 布局，preview + label 各自占位 */
.wf-palette__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 4px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: grab;
  background: #ffffff;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    border-color: #409eff;
    background: #ecf5ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
  }

  &:active {
    cursor: grabbing;
  }
}

/* 预览图：固定尺寸，居中图标 */
.wf-palette__preview {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}

/* 名称标签 */
.wf-palette__label {
  font-size: 12px;
  color: #606266;
  text-align: center;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}
</style>
