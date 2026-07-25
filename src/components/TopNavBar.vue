<template>
  <div class="top-nav-bar">
    <div class="nav-logo">
      <el-icon :size="22" color="#409EFF"><DataBoard /></el-icon>
      <span class="logo-text">应急指挥调度平台</span>
    </div>
    <div class="nav-wrapper">
      <el-menu
        mode="horizontal"
        :default-active="activeMenu"
        :ellipsis="false"
        class="nav-menu"
        @select="handleMenuSelect"
      >
        <template v-for="item in menus" :key="item.path">
          <!-- 有子菜单 -->
          <el-sub-menu v-if="item.children" :index="item.path">
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
              <span>{{ child.title }}</span>
            </el-menu-item>
          </el-sub-menu>
          <!-- 无子菜单 -->
          <el-menu-item v-else :index="item.path">
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="nav-right">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DataBoard } from '@element-plus/icons-vue'
import type { MenuItem } from '@/config/menu'

const props = defineProps<{
  menus: MenuItem[]
}>()

const router = useRouter()
const route = useRoute()

const activeMenu = computed(() => {
  return route.path
})

function handleMenuSelect(index: string) {
  router.push(index)
}
</script>

<style scoped>
.top-nav-bar {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 24px;
  background: #FFFFFF;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 24px;
  flex-shrink: 0;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
}

.nav-wrapper {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  min-width: 0;

  &::-webkit-scrollbar {
    height: 0;
    display: none;
  }
}

.nav-menu {
  border-bottom: none !important;
  height: 56px;
  white-space: nowrap;
}

.nav-menu :deep(.el-menu-item) {
  height: 56px;
  line-height: 56px;
  font-size: 14px;
  border-bottom: 2px solid transparent;
}

.nav-menu :deep(.el-menu-item.is-active) {
  border-bottom-color: #409EFF;
}

.nav-menu :deep(.el-sub-menu) {
  border-bottom: 2px solid transparent;
}

.nav-menu :deep(.el-sub-menu.is-active) {
  border-bottom-color: #409EFF;
}

.nav-menu :deep(.el-sub-menu__title) {
  height: 56px;
  line-height: 56px;
  font-size: 14px;
  border-bottom: 2px solid transparent;
}

.nav-menu :deep(.el-menu--popup) {
  min-width: 140px;
}

.nav-right {
  flex-shrink: 0;
  margin-left: 24px;
  padding-left: 24px;
  border-left: 1px solid #EBEEF5;
}
</style>
