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
import { ref, watch } from 'vue'
import {
  DataBoard
} from '@element-plus/icons-vue'
import { dutyMenus } from '@/config/menu'
import AppSidebar from '@/components/AppSidebar.vue'
import TagsView from '@/components/TagsView.vue'
import LayoutHeader from '@/components/LayoutHeader.vue'

const STORAGE_KEY = 'ecdp_sidebar_collapsed_duty'
const isCollapsed = ref(localStorage.getItem(STORAGE_KEY) === 'true')
watch(isCollapsed, (val) => localStorage.setItem(STORAGE_KEY, String(val)))
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
