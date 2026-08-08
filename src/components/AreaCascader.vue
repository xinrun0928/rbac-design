<template>
  <el-cascader
    :model-value="modelValue"
    :options="areaOptions"
    :props="cascaderProps"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :size="size"
    :style="{ width }"
    @update:model-value="handleChange"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { areaData } from '@/mock/admin/areaData'
import type { Area } from '@/types/admin/area'

interface Props {
  modelValue?: string[] | number[]
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
  size?: 'large' | 'default' | 'small'
  width?: string
  /** 绑定字段: code-地区编码, name-地区名称 */
  valueField?: 'code' | 'name'
  /** 是否只选择叶子节点 */
  onlyLeaf?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: '请选择归属地区',
  clearable: true,
  disabled: false,
  size: 'default',
  width: '100%',
  valueField: 'code',
  onlyLeaf: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[] | number[]): void
  (e: 'change', value: string[] | number[]): void
}>()

const areaOptions = computed(() => areaData)

const cascaderProps = computed(() => ({
  label: 'name',
  value: props.valueField,
  children: 'children',
  checkStrictly: !props.onlyLeaf,
  emitPath: true
}))

function handleChange(value: string[] | number[]) {
  emit('update:modelValue', value)
  emit('change', value)
}

/** 根据编码获取地区名称 */
function getAreaNameByCode(code: string): string {
  function find(nodes: Area[]): string | null {
    for (const node of nodes) {
      if (node.code === code) return node.name
      if (node.children?.length) {
        const result = find(node.children)
        if (result) return result
      }
    }
    return null
  }
  return find(areaData) || ''
}

/** 根据名称获取地区编码 */
function getAreaCodeByName(name: string): string {
  function find(nodes: Area[]): string | null {
    for (const node of nodes) {
      if (node.name === name) return node.code
      if (node.children?.length) {
        const result = find(node.children)
        if (result) return result
      }
    }
    return null
  }
  return find(areaData) || ''
}

defineExpose({
  getAreaNameByCode,
  getAreaCodeByName
})
</script>
