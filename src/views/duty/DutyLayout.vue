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
      <LayoutHeader :menus="dutyMenus" v-model:collapsed="isCollapsed" />

      <!-- 历史会话标签页 -->
      <TagsView :menus="dutyMenus" storage-key="duty-tags-view" />

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
  DataBoard
} from '@element-plus/icons-vue'
import { dutyMenus } from '@/config/menu'
import AppSidebar from '@/components/AppSidebar.vue'
import TagsView from '@/components/TagsView.vue'
import LayoutHeader from '@/components/LayoutHeader.vue'

// 侧边栏收缩状态
const isCollapsed = ref(false)
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

  .duty-content {
    flex: 1;
    overflow: auto;
    padding: 16px;
  }
}
</style>
