<template>
  <div class="component-panel">
    <el-scrollbar height="100%">
      <div class="panel-section">
        <div class="section-title">
          <el-icon><EditPen /></el-icon>
          输入型组件
        </div>
        <div class="component-list">
          <div
            v-for="comp in inputComponents"
            :key="comp.type"
            class="component-item"
            draggable="true"
            @dragstart="handleDragStart($event, comp)"
            @click="$emit('add', comp)"
          >
            <el-icon><component :is="comp.icon" /></el-icon>
            <span>{{ comp.label }}</span>
          </div>
        </div>
      </div>
      <div class="panel-section">
        <div class="section-title">
          <el-icon><CircleCheck /></el-icon>
          选择型组件
        </div>
        <div class="component-list">
          <div
            v-for="comp in selectComponents"
            :key="comp.type"
            class="component-item"
            draggable="true"
            @dragstart="handleDragStart($event, comp)"
            @click="$emit('add', comp)"
          >
            <el-icon><component :is="comp.icon" /></el-icon>
            <span>{{ comp.label }}</span>
          </div>
        </div>
      </div>
      <div class="panel-section">
        <div class="section-title">
          <el-icon><Grid /></el-icon>
          布局型组件
        </div>
        <div class="component-list">
          <div
            v-for="comp in layoutComponents"
            :key="comp.type"
            class="component-item"
            draggable="true"
            @dragstart="handleDragStart($event, comp)"
            @click="$emit('add', comp)"
          >
            <el-icon><component :is="comp.icon" /></el-icon>
            <span>{{ comp.label }}</span>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { EditPen, CircleCheck, Grid, Edit, Document, Lock, DataLine, Select, Connection, SwitchButton, Minus, Timer, Calendar, Star, Picture, UploadFilled, Promotion } from '@element-plus/icons-vue'

defineEmits<{
  (e: 'add', comp: any): void
}>()

const inputComponents = [
  { type: 'input', typeName: '单行文本', label: '单行文本', icon: Edit, placeholder: '请输入单行文本' },
  { type: 'textarea', typeName: '多行文本', label: '多行文本', icon: Document, placeholder: '请输入多行文本' },
  { type: 'password', typeName: '密码', label: '密码', icon: Lock, placeholder: '请输入密码' },
  { type: 'number', typeName: '计数器', label: '计数器', icon: DataLine, placeholder: '请输入' },
]

const selectComponents = [
  { type: 'select', typeName: '下拉选择', label: '下拉选择', icon: Select, placeholder: '请选择', options: [] },
  { type: 'cascader', typeName: '级联选择', label: '级联选择', icon: Connection, placeholder: '请选择' },
  { type: 'radio', typeName: '单选框组', label: '单选框组', icon: CircleCheck, options: [] },
  { type: 'checkbox', typeName: '多选框组', label: '多选框组', icon: CircleCheck, options: [] },
  { type: 'switch', typeName: '开关', label: '开关', icon: SwitchButton },
  { type: 'slider', typeName: '滑块', label: '滑块', icon: Minus },
  { type: 'time', typeName: '时间选择', label: '时间选择', icon: Timer, placeholder: '请选择时间' },
  { type: 'time-range', typeName: '时间范围', label: '时间范围', icon: Timer, placeholder: '请选择时间范围' },
  { type: 'date', typeName: '日期选择', label: '日期选择', icon: Calendar, placeholder: '请选择日期', dateType: 'date', format: 'yyyy-MM-dd' },
  { type: 'date-range', typeName: '日期范围', label: '日期范围', icon: Calendar, placeholder: '请选择日期范围' },
  { type: 'rate', typeName: '评分', label: '评分', icon: Star },
  { type: 'color', typeName: '颜色选择', label: '颜色选择', icon: Picture },
  { type: 'file', typeName: '上传', label: '上传', icon: UploadFilled, fileType: 'all', limit: 3, sizeLimit: 10 },
]

const layoutComponents = [
  { type: 'row', typeName: '行容器', label: '行容器', icon: Grid },
  { type: 'button', typeName: '按钮', label: '按钮', icon: Promotion },
]

function handleDragStart(event: DragEvent, comp: any) {
  event.dataTransfer?.setData('componentData', JSON.stringify(comp))
}
</script>

<style lang="scss" scoped>
.component-panel {
  width: 240px;
  background: #fff;
  border-right: 1px solid #ebeef5;
  overflow: hidden;

  .panel-section {
    padding: 16px;

    .section-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 12px;

      .el-icon {
        color: #409EFF;
      }
    }

    .component-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .component-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 6px;
      background: #f5f7fa;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 12px;
      color: #606266;

      .el-icon {
        font-size: 14px;
        color: #909399;
      }

      &:hover {
        background: #ecf5ff;
        color: #409EFF;

        .el-icon {
          color: #409EFF;
        }
      }
    }
  }
}
</style>
