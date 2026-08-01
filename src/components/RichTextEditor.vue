<template>
  <div class="rich-text-editor">
    <Toolbar
      class="rte-toolbar"
      :editor="editorRef"
      :default-config="toolbarConfig"
      mode="default"
    />
    <Editor
      class="rte-editor"
      v-model="valueHtml"
      :default-config="editorConfig"
      mode="default"
      @on-created="handleCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, watch, onBeforeUnmount } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

/**
 * 富文本编辑器组件（基于 WangEditor 5）
 * 通过 v-model 绑定 HTML 内容，可选隐藏插入图片/视频/表格等能力
 */

const props = withDefaults(defineProps<{
  /** 编辑内容（HTML） */
  modelValue?: string
  /** 占位提示文案 */
  placeholder?: string
  /** 编辑器高度 */
  height?: number
  /** 需要隐藏的菜单 key 列表（如 'group-video'、'fullScreen'） */
  excludeKeys?: string[]
}>(), {
  modelValue: '',
  placeholder: '请输入内容...',
  height: 400,
  excludeKeys: () => []
})

const emit = defineEmits<{
  (e: 'update:modelValue', html: string): void
  (e: 'change', html: string): void
}>()

const editorRef = shallowRef<IDomEditor | null>(null)
const valueHtml = ref<string>(props.modelValue)

const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: props.excludeKeys.length ? props.excludeKeys : ['group-video', 'fullScreen']
}

const editorConfig: Partial<IEditorConfig> = {
  placeholder: props.placeholder,
  scroll: false
}

watch(
  () => props.modelValue,
  (val) => {
    if (val !== valueHtml.value) {
      valueHtml.value = val ?? ''
    }
  }
)

watch(valueHtml, (val) => {
  emit('update:modelValue', val)
  emit('change', val)
})

function handleCreated(editor: IDomEditor) {
  editorRef.value = editor
}

onBeforeUnmount(() => {
  editorRef.value?.destroy()
})
</script>

<style scoped>
.rich-text-editor {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.rte-toolbar {
  border-bottom: 1px solid #ebeef5;
  background: #fff;
}

.rte-editor {
  height: v-bind('height + "px"');
  overflow-y: auto;
  background: #fff;
}
</style>
