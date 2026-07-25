<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: homePath }">{{ homeTitle }}</el-breadcrumb-item><!--
    --><el-breadcrumb-item v-if="groupTitle">{{ groupTitle }}</el-breadcrumb-item><!--
    --><el-breadcrumb-item v-if="!isHome && currentTitle && currentTitle !== groupTitle">{{ currentTitle }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { findGroupTitle, adminMenus } from '@/config/menu'

const props = withDefaults(defineProps<{
  homePath?: string
  homeTitle?: string
  homeName?: string
  menus?: typeof adminMenus
}>(), {
  homePath: '/admin/dashboard',
  homeTitle: '首页',
  homeName: 'AdminDashboard',
  menus: () => adminMenus
})

const route = useRoute()

const currentTitle = computed(() => {
  return (route.meta?.title as string) || ''
})

const isHome = computed(() => route.name === props.homeName)

const groupTitle = computed(() => {
  if (route.name === props.homeName) return ''
  return findGroupTitle(route.path, props.menus)
})
</script>
