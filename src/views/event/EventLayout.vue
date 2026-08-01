<template>
  <div class="event-layout" :class="{ collapsed: isCollapsed }">
    <!-- 左侧导航栏 -->
    <AppSidebar
      title="事件管理子系统"
      :icon="Warning"
      :menus="eventMenus"
      :collapsed="isCollapsed"
    />

    <!-- 右侧内容区 -->
    <div class="event-main">
      <!-- 顶部栏 -->
      <LayoutHeader :menus="eventMenus" v-model:collapsed="isCollapsed" />

      <!-- 历史会话标签页 -->
      <TagsView :menus="eventMenus" storage-key="event-tags-view" />

      <!-- 页面内容 -->
      <main class="event-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Warning
} from '@element-plus/icons-vue'
import { eventMenus } from '@/config/menu'
import AppSidebar from '@/components/AppSidebar.vue'
import TagsView from '@/components/TagsView.vue'
import LayoutHeader from '@/components/LayoutHeader.vue'

// 侧边栏收缩状态
const isCollapsed = ref(false)
</script>

<style lang="scss" scoped>
.event-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;

  .event-main {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #f0f2f5;
  }

  .event-content {
    flex: 1;
    overflow: auto;
    padding: 16px;
  }
}
</style>
