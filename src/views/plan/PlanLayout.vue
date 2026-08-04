<template>
  <div class="plan-layout" :class="{ collapsed: isCollapsed }">
    <!-- 左侧导航栏 -->
    <AppSidebar
      title="预案管理子系统"
      :icon="Document"
      :menus="planMenus"
      :collapsed="isCollapsed"
    />

    <!-- 右侧内容区 -->
    <div class="plan-main">
      <!-- 顶部栏 -->
      <LayoutHeader :menus="planMenus" v-model:collapsed="isCollapsed" />

      <!-- 历史会话标签页 -->
      <TagsView :menus="planMenus" storage-key="plan-tags-view" />

      <!-- 页面内容 -->
      <main class="plan-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Document
} from '@element-plus/icons-vue'
import { planMenus } from '@/config/menu'
import AppSidebar from '@/components/AppSidebar.vue'
import TagsView from '@/components/TagsView.vue'
import LayoutHeader from '@/components/LayoutHeader.vue'

const STORAGE_KEY = 'ecdp_sidebar_collapsed_plan'
const isCollapsed = ref(localStorage.getItem(STORAGE_KEY) === 'true')
watch(isCollapsed, (val) => localStorage.setItem(STORAGE_KEY, String(val)))
</script>

<style lang="scss" scoped>
.plan-layout {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.plan-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.plan-content {
  flex: 1;
  overflow: auto;
  background: #f5f7fa;
}
</style>
