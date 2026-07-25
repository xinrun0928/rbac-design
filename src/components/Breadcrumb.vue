<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: homePath }">{{ homeTitle }}</el-breadcrumb-item>
    <el-breadcrumb-item v-if="showSecond">
      {{ currentTitle }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = withDefaults(defineProps<{
  homePath?: string
  homeTitle?: string
  /** 首页路由名称，匹配时不显示第二级 */
  homeName?: string
}>(), {
  homePath: '/admin/dashboard',
  homeTitle: '首页',
  homeName: 'AdminDashboard'
})

const route = useRoute()

const currentTitle = computed(() => {
  return (route.meta?.title as string) || ''
})

const showSecond = computed(() => {
  // 当前是首页则不显示第二级
  return route.name !== props.homeName && currentTitle.value !== ''
})
</script>
