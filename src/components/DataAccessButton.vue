<template>
  <el-button type="primary" :icon="Plus" class="data-access-btn" @click="handleClick">
    {{ text }}
  </el-button>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'

interface Props {
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: '数据接入'
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}
</script>

<style scoped>
.data-access-btn {
  margin-left: 10px;
}
</style>
