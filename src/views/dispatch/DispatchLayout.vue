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
      <LayoutHeader :menus="dispatchMenus" v-model:collapsed="isCollapsed" />

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
  DataAnalysis
} from '@element-plus/icons-vue'
import { dispatchMenus } from '@/config/menu'
import AppSidebar from '@/components/AppSidebar.vue'
import TagsView from '@/components/TagsView.vue'
import LayoutHeader from '@/components/LayoutHeader.vue'

// 侧边栏收缩状态
const isCollapsed = ref(false)
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

  .dispatch-content {
    flex: 1;
    overflow: auto;
    padding: 16px;
  }
}
</style>
