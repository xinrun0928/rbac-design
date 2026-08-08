<template>
  <div class="wf-toolbar">
    <!-- 左侧：标题 + 模块切换 -->
    <div class="wf-toolbar__title">
      <span class="wf-toolbar__title-text">应急流程设计器</span>
      <el-tag size="small" effect="plain" type="info">BPMN 2.0</el-tag>
    </div>

    <div class="wf-toolbar__divider" />

    <!-- 模块一：画布模式 -->
    <div class="wf-toolbar__module">
      <el-tooltip content="抓手模式 (拖动画布)" placement="bottom">
        <button
          class="wf-tb-square"
          :class="{ 'is-active': store.canvasMode.value === 'pan' }"
          @click="emit('mode-change', 'pan')"
        >
          <el-icon><Rank /></el-icon>
        </button>
      </el-tooltip>
      <el-tooltip content="框选模式 (拖拽框选节点)" placement="bottom">
        <button
          class="wf-tb-square"
          :class="{ 'is-active': store.canvasMode.value === 'select' }"
          @click="emit('mode-change', 'select')"
        >
          <el-icon><Crop /></el-icon>
        </button>
      </el-tooltip>
    </div>

    <div class="wf-toolbar__divider" />

    <!-- 模块三：撤销/重做/适配 -->
    <div class="wf-toolbar__module">
      <el-tooltip content="撤销 (Ctrl+Z)" placement="bottom">
        <button class="wf-tb-square" :disabled="!store.canUndo.value" @click="store.undo()">
          <el-icon><RefreshLeft /></el-icon>
        </button>
      </el-tooltip>
      <el-tooltip content="重做 (Ctrl+Y)" placement="bottom">
        <button class="wf-tb-square" :disabled="!store.canRedo.value" @click="store.redo()">
          <el-icon><RefreshRight /></el-icon>
        </button>
      </el-tooltip>
      <el-tooltip content="适配视图 (F)" placement="bottom">
        <button class="wf-tb-square" @click="emit('fit-view')">
          <el-icon><FullScreen /></el-icon>
        </button>
      </el-tooltip>
    </div>

    <!-- 模块四：缩放 -->
    <div class="wf-toolbar__module">
      <div class="wf-tb-zoom">
        <button class="wf-tb-zoom__btn" @click="emit('zoom-out')"><el-icon><Minus /></el-icon></button>
        <div class="wf-tb-zoom__value" @click="emit('reset-view')">{{ zoomPercent }}%</div>
        <button class="wf-tb-zoom__btn" @click="emit('zoom-in')"><el-icon><Plus /></el-icon></button>
      </div>
    </div>

    <div class="wf-toolbar__spacer" />

    <!-- 右侧：面板切换 + JSON IO + 发布 -->
    <div class="wf-toolbar__module">
      <el-tooltip content="组件库" placement="bottom">
        <button class="wf-tb-square" :class="{ 'is-active': !store.sidebarCollapsed.value }" @click="emit('toggle-sidebar')">
          <el-icon><Grid /></el-icon>
        </button>
      </el-tooltip>
      <el-tooltip content="校验结果" placement="bottom">
        <button
          class="wf-tb-square"
          :class="{ 'is-active': !store.validationPanelCollapsed.value, 'is-danger': store.hasErrors.value }"
          @click="emit('toggle-validation')"
        >
          <el-icon><CircleCheck /></el-icon>
          <el-badge
            v-if="store.validationIssues.value.length"
            :value="store.validationIssues.value.length"
            :type="store.hasErrors.value ? 'danger' : 'warning'"
            :max="99"
            class="wf-tb-badge"
          />
        </button>
      </el-tooltip>
      <el-tooltip content="迷你地图" placement="bottom">
        <button class="wf-tb-square" :class="{ 'is-active': store.minimapVisible.value }" @click="emit('toggle-minimap')">
          <el-icon><Position /></el-icon>
        </button>
      </el-tooltip>
    </div>

    <div class="wf-toolbar__divider" />

    <div class="wf-toolbar__module">
      <!-- 导入 JSON -->
      <el-tooltip content="从 JSON 导入" placement="bottom">
        <button class="wf-tb-square" @click="emit('open-io', 'import', 'json')">
          <el-icon><Upload /></el-icon>
        </button>
      </el-tooltip>
      <!-- 导出 JSON -->
      <el-tooltip content="导出为 JSON" placement="bottom">
        <button class="wf-tb-square" @click="emit('open-io', 'export', 'json')">
          <el-icon><Download /></el-icon>
        </button>
      </el-tooltip>
    </div>

    <div class="wf-toolbar__divider" />

    <div class="wf-toolbar__module">
      <el-button type="primary" :icon="Promotion" size="small" @click="onPublish">立即发布</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Minus,
  Plus,
  RefreshLeft,
  RefreshRight,
  FullScreen,
  Download,
  Upload,
  Promotion,
  CircleCheck,
  Rank,
  Crop,
  Grid,
  Position
} from '@element-plus/icons-vue'
import { useWorkflowStore } from '@/composables/useWorkflowStore'

const props = defineProps<{ zoom: number; store: ReturnType<typeof useWorkflowStore> }>()

const emit = defineEmits<{
  (e: 'open-io', mode: 'export' | 'import', format: 'json' | 'bpmn'): void
  (e: 'mode-change', mode: 'pan' | 'select'): void
  (e: 'zoom-in'): void
  (e: 'zoom-out'): void
  (e: 'reset-view'): void
  (e: 'fit-view'): void
  (e: 'toggle-sidebar'): void
  (e: 'toggle-validation'): void
  (e: 'toggle-minimap'): void
}>()

const zoomPercent = computed(() => Math.round(props.zoom * 100))

function onPublish() {
  ElMessageBox.confirm('确认发布当前流程？发布后将无法继续编辑当前草稿。', '发布确认', {
    type: 'info'
  }).then(() => {
    ElMessage.success('已发布到生产环境（演示）')
  }).catch(() => { })
}
</script>

<style scoped lang="scss">
.wf-toolbar {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 12px;
  background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
  border-bottom: 1px solid #e4e7ed;
  gap: 8px;
  flex-shrink: 0;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02);
}

.wf-toolbar__title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 8px;
}

.wf-toolbar__title-text {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  background: linear-gradient(135deg, #1677ff 0%, #722ed1 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.wf-toolbar__divider {
  width: 1px;
  height: 20px;
  background: #e4e7ed;
  margin: 0 4px;
}

.wf-toolbar__module {
  display: flex;
  align-items: center;
  height: 28px;
  flex-shrink: 0;
  gap: 4px;
}

.wf-toolbar__spacer {
  flex: 1;
}

.wf-tb-square {
  position: relative;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  color: #606266;
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;
  font-size: 14px;

  &:hover:not(:disabled) {
    background: #f0f7ff;
    color: #1677ff;
    border-color: #91caff;
  }

  &.is-active {
    background: #e6f4ff;
    color: #1677ff;
    border-color: #91caff;
  }

  &.is-danger {
    color: #f56c6c;
    border-color: #fbc4c4;
    background: #fef0f0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.wf-tb-zoom {
  display: flex;
  align-items: center;
  height: 28px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
  background: #ffffff;
}

.wf-tb-zoom__btn {
  width: 28px;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: none;
  color: #606266;
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;

  &:hover {
    background: #f0f7ff;
    color: #1677ff;
  }
}

.wf-tb-zoom__value {
  min-width: 56px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  border-left: 1px solid #e4e7ed;
  border-right: 1px solid #e4e7ed;
  font-size: 12px;
  font-weight: 500;
  color: #303133;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: #f0f7ff;
    color: #1677ff;
  }
}

.wf-tb-badge {
  position: absolute;
  top: -4px;
  right: -4px;
}
</style>