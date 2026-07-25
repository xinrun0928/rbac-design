<template>
  <aside class="app-sidebar" :class="{ collapsed }">
    <div class="sidebar-header">
      <el-icon :size="22" color="#409EFF"><component :is="icon" /></el-icon>
      <span v-show="!collapsed" class="sidebar-title">{{ title }}</span>
    </div>

    <el-menu
      :default-active="activeMenu"
      :collapse="collapsed"
      :collapse-transition="false"
      class="sidebar-menu"
      router
    >
      <template v-for="item in menus" :key="item.path">
        <!-- 分组菜单 -->
        <template v-if="item.isGroup && item.children">
          <div class="menu-group-title" v-show="!collapsed">{{ item.groupTitle }}</div>
          <el-menu-item
            v-for="child in item.children"
            :key="child.path"
            :index="child.path"
          >
            <el-icon><component :is="child.icon" /></el-icon>
            <template #title>{{ child.title }}</template>
          </el-menu-item>
        </template>
        <!-- 子菜单 -->
        <el-sub-menu v-else-if="item.children" :index="item.path">
          <template #title>
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item
            v-for="child in item.children"
            :key="child.path"
            :index="child.path"
          >
            <el-icon><component :is="child.icon" /></el-icon>
            <template #title>{{ child.title }}</template>
          </el-menu-item>
        </el-sub-menu>
        <!-- 普通菜单项 -->
        <el-menu-item v-else :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Component } from 'vue'
import type { MenuItem } from '@/config/menu'

const props = defineProps<{
  title: string
  icon: Component
  menus: MenuItem[]
  collapsed: boolean
}>()

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style lang="scss" scoped>
.app-sidebar {
  width: 220px;
  height: 100vh;
  background: #1a1f2e;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.3s ease;
  overflow: hidden;

  &.collapsed {
    width: 64px;
  }
}

.sidebar-header {
  height: 56px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  white-space: nowrap;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.sidebar-menu {
  flex: 1;
  border-right: none;
  overflow-y: auto;
  overflow-x: hidden;
  background: #1a1f2e !important;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }

  &:not(.el-menu--collapse) {
    width: 100%;
  }

  // 菜单项样式
  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    background: #1a1f2e !important;
    color: #bfcbd9 !important;
    height: 50px !important;
    line-height: 50px !important;
  }

  :deep(.el-menu-item:hover),
  :deep(.el-sub-menu__title:hover) {
    background: #263445 !important;
    color: #409EFF !important;
  }

  :deep(.el-menu-item.is-active) {
    background: #263445 !important;
    color: #409EFF !important;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #409EFF !important;
    }
  }

  :deep(.el-menu-item .el-icon),
  :deep(.el-sub-menu__title .el-icon) {
    color: inherit !important;
  }

  :deep(.el-sub-menu.is-opened > .el-sub-menu__title) {
    color: rgba(255, 255, 255, 0.65) !important;
  }

  :deep(.el-sub-menu .el-menu-item) {
    background: #1a1f2e !important;
    color: #bfcbd9 !important;
    min-width: 0 !important;
    height: 50px !important;
    line-height: 50px !important;
  }

  :deep(.el-sub-menu .el-menu-item:hover) {
    background: #263445 !important;
    color: #409EFF !important;
  }

  :deep(.el-sub-menu .el-menu-item.is-active) {
    background: #263445 !important;
    color: #409EFF !important;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #409EFF !important;
    }
  }
}

.menu-group-title {
  padding: 16px 20px 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
