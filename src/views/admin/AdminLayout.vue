<template>
  <div class="admin-layout" :class="{ collapsed: isCollapsed }">
    <!-- 左侧导航栏 -->
    <AppSidebar
      title="后台管理子系统"
      :icon="DataBoard"
      :menus="adminMenus"
      :collapsed="isCollapsed"
    />

    <!-- 右侧内容区 -->
    <div class="admin-main">
      <!-- 顶部栏 -->
      <LayoutHeader :menus="adminMenus" v-model:collapsed="isCollapsed" />

      <!-- 历史会话标签页 -->
      <TagsView :menus="adminMenus" storage-key="admin-tags-view" />

      <!-- 页面内容 -->
      <main class="admin-content">
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
import { adminMenus } from '@/config/menu'
import AppSidebar from '@/components/AppSidebar.vue'
import TagsView from '@/components/TagsView.vue'
import LayoutHeader from '@/components/LayoutHeader.vue'

// 侧边栏收缩状态
const isCollapsed = ref(false)
</script>

<style scoped>
.admin-layout {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
  overflow: hidden;
}

.admin-content {
  flex: 1;
  padding: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  > router-view {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}
</style>
