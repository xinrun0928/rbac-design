<template>
  <header class="layout-header">
    <div class="header-left">
      <div class="collapse-btn" @click="toggleCollapse">
        <el-icon :size="18">
          <Expand v-if="collapsed" />
          <Fold v-else />
        </el-icon>
      </div>
      <Breadcrumb :menus="menus" />
    </div>
    <div class="header-right">
      <GithubIcon />
      <FullscreenToggle />
      <NotificationBell />
      <UserDropdown />
    </div>
  </header>
</template>

<script setup lang="ts">
import { Fold, Expand } from '@element-plus/icons-vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import GithubIcon from '@/components/GithubIcon.vue'
import FullscreenToggle from '@/components/FullscreenToggle.vue'
import NotificationBell from '@/components/NotificationBell.vue'
import UserDropdown from '@/components/UserDropdown.vue'
import type { MenuItem } from '@/config/menu'

const props = withDefaults(defineProps<{
  /** 菜单列表，用于面包屑 */
  menus?: MenuItem[]
}>(), {
  menus: () => []
})

// 侧边栏收缩状态（v-model）
const collapsed = defineModel<boolean>('collapsed', { default: false })

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}
</script>

<style lang="scss" scoped>
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 56px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  z-index: 10;
  flex-shrink: 0;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .collapse-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s;
      color: #606266;

      &:hover {
        background: #f5f7fa;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}
</style>
