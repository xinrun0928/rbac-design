<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: resolvedHomePath }">{{ resolvedHomeTitle }}</el-breadcrumb-item><!--
    --><el-breadcrumb-item v-if="groupTitle">{{ groupTitle }}</el-breadcrumb-item><!--
    --><el-breadcrumb-item v-if="!isHome && currentTitle && currentTitle !== groupTitle">{{ currentTitle }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { findGroupTitle } from '@/config/menu'
import type { MenuItem } from '@/config/menu'

const props = withDefaults(defineProps<{
  /** 菜单列表，用于自动获取首页信息 */
  menus?: MenuItem[]
  /** 首页路径（不传则从 menus 第一项获取） */
  homePath?: string
  /** 首页标题（不传则从 menus 第一项获取） */
  homeTitle?: string
  /** 首页路由 name（不传则从路由自动生成） */
  homeName?: string
}>(), {
  menus: () => [],
  homePath: '',
  homeTitle: '',
  homeName: ''
})

const route = useRoute()

// 从菜单中获取第一个有效项
const getHomeFromMenus = (): { path: string; title: string } => {
  if (props.menus.length > 0) {
    const first = props.menus[0]
    return { path: first.path, title: first.title }
  }
  return { path: '/admin/dashboard', title: '首页' }
}

const resolvedHomePath = computed(() => props.homePath || getHomeFromMenus().path)
const resolvedHomeTitle = computed(() => props.homeTitle || getHomeFromMenus().title)

// 自动生成首页路由 name：取路径最后一段转 PascalCase
const resolvedHomeName = computed(() => {
  if (props.homeName) return props.homeName
  const segment = resolvedHomePath.value.split('/').filter(Boolean).pop() || 'dashboard'
  return 'Duty' + segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())
})

const currentTitle = computed(() => {
  return (route.meta?.title as string) || ''
})

const isHome = computed(() => route.path === resolvedHomePath.value)

const groupTitle = computed(() => {
  if (isHome.value) return ''
  return findGroupTitle(route.path, props.menus)
})
</script>
