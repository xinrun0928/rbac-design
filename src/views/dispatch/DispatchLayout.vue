<template>
  <div class="dispatch-layout" :class="{ collapsed: isCollapsed }">
    <!-- 左侧导航栏 -->
    <AppSidebar
      title="指挥调度子系统"
      :icon="DataAnalysis"
      :menus="dispatchMenus"
      :collapsed="isCollapsed"
    />

    <!-- 右侧内容区 -->
    <div class="dispatch-main">
      <!-- 顶部栏 -->
      <header class="dispatch-header">
        <div class="header-left">
          <div class="collapse-btn" @click="toggleCollapse">
            <el-icon :size="18">
              <Fold v-if="!isCollapsed" />
              <Expand v-else />
            </el-icon>
          </div>
          <Breadcrumb :menus="dispatchMenus" />
        </div>
        <div class="header-right">
          <GithubIcon />
          <FullscreenToggle />
          <NotificationBell />
          <UserDropdown />
        </div>
      </header>

      <!-- 历史会话标签页 -->
      <TagsView :menus="dispatchMenus" storage-key="dispatch-tags-view" />

      <!-- 页面内容 -->
      <main class="dispatch-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  DataAnalysis,
  Fold,
  Expand
} from '@element-plus/icons-vue'
import { dispatchMenus } from '@/config/menu'
import AppSidebar from '@/components/AppSidebar.vue'
import TagsView from '@/components/TagsView.vue'
import GithubIcon from '@/components/GithubIcon.vue'
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
.dispatch-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;

  .dispatch-main {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #f0f2f5;
  }

  .dispatch-header {
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

  .dispatch-content {
    flex: 1;
    overflow: auto;
    padding: 16px;
  }
}
</style>
