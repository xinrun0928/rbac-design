<template>
  <div class="duty-layout" :class="{ collapsed: isCollapsed }">
    <!-- 左侧导航栏 -->
    <AppSidebar
      title="值守管理子系统"
      :icon="DataBoard"
      :menus="dutyMenus"
      :collapsed="isCollapsed"
    />

    <!-- 右侧内容区 -->
    <div class="duty-main">
      <!-- 顶部栏 -->
      <header class="duty-header">
        <div class="header-left">
          <div class="collapse-btn" @click="toggleCollapse">
            <el-icon :size="18">
              <Fold v-if="!isCollapsed" />
              <Expand v-else />
            </el-icon>
          </div>
          <Breadcrumb
            home-path="/duty/dashboard"
            home-title="首页"
            home-name="DutyDashboard"
            :menus="dutyMenus"
          />
        </div>
        <div class="header-right">
          <FullscreenToggle />
          <NotificationBell />
          <UserDropdown />
        </div>
      </header>

      <!-- 历史会话标签页 -->
      <TagsView
        home-path="/duty/dashboard"
        home-title="首页"
        storage-key="duty-tags-view"
      />

      <!-- 页面内容 -->
      <main class="duty-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  DataBoard,
  Fold,
  Expand
} from '@element-plus/icons-vue'
import { dutyMenus } from '@/config/menu'
import AppSidebar from '@/components/AppSidebar.vue'
import TagsView from '@/components/TagsView.vue'
import FullscreenToggle from '@/components/FullscreenToggle.vue'
import NotificationBell from '@/components/NotificationBell.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import UserDropdown from '@/components/UserDropdown.vue'

// 侧边栏收缩状态
const isCollapsed = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style lang="scss" scoped>
.duty-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;

  .duty-main {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #f0f2f5;
  }

  .duty-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    height: 56px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    z-index: 10;

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

  .duty-content {
    flex: 1;
    overflow: auto;
    padding: 16px;
  }
}
</style>
