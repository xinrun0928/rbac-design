<template>
  <el-dialog
    v-model="visible"
    title="选择图标"
    width="700px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="icon-picker">
      <div class="icon-search">
        <el-input
          v-model="searchText"
          placeholder="请输入图标名称"
          clearable
          :prefix-icon="Search"
        />
      </div>
      <el-scrollbar height="400px">
        <div class="icon-grid">
          <div
            v-for="icon in filteredIcons"
            :key="icon.name"
            class="icon-item"
            :class="{ active: selectedIcon === icon.name }"
            @click="handleSelect(icon.name)"
          >
            <el-icon :size="24">
              <component :is="icon.component" />
            </el-icon>
            <span class="icon-name">{{ icon.name }}</span>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import * as Icons from '@element-plus/icons-vue'

interface IconItem {
  name: string
  component: any
}

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'confirm', value: string): void
}>()

const visible = ref(false)
const searchText = ref('')
const selectedIcon = ref('')

// 所有图标列表
const allIcons: IconItem[] = Object.entries(Icons).map(([name, component]) => ({
  name,
  component
}))

// 过滤后的图标
const filteredIcons = computed(() => {
  if (!searchText.value) return allIcons
  const search = searchText.value.toLowerCase()
  return allIcons.filter(icon => icon.name.toLowerCase().includes(search))
})

// 监听 modelValue 变化
watch(() => props.modelValue, (val) => {
  if (val) {
    selectedIcon.value = val
  }
})

// 打开弹窗
function open() {
  visible.value = true
  searchText.value = ''
  selectedIcon.value = props.modelValue || ''
}

// 关闭弹窗
function handleClose() {
  visible.value = false
}

// 选择图标
function handleSelect(name: string) {
  selectedIcon.value = name
}

// 确认选择
function handleConfirm() {
  emit('update:modelValue', selectedIcon.value)
  emit('confirm', selectedIcon.value)
  visible.value = false
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.icon-picker {
  .icon-search {
    margin-bottom: 16px;
  }

  .icon-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
    padding: 8px;
  }

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 8px;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #409EFF;
      color: #409EFF;
    }

    &.active {
      border-color: #409EFF;
      background: #ecf5ff;
      color: #409EFF;
    }

    .icon-name {
      font-size: 11px;
      color: #909399;
      text-align: center;
      word-break: break-all;
      line-height: 1.2;
      max-height: 2.4em;
      overflow: hidden;
    }
  }
}
</style>
