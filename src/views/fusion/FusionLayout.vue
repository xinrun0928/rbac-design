<template>
  <div class="fusion-layout" :class="{ collapsed: isCollapsed }">
    <!-- 左侧导航栏 -->
    <AppSidebar
      title="数据融合子系统"
      :icon="Connection"
      :menus="fusionMenus"
      :collapsed="isCollapsed"
    />

    <!-- 右侧内容区 -->
    <div class="fusion-main">
      <!-- 顶部栏 -->
      <LayoutHeader :menus="fusionMenus" v-model:collapsed="isCollapsed" />

      <!-- 历史会话标签页 -->
      <TagsView :menus="fusionMenus" storage-key="fusion-tags-view" />

      <!-- 页面内容 -->
      <main class="fusion-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Connection
} from '@element-plus/icons-vue'
import { fusionMenus } from '@/config/menu'
import AppSidebar from '@/components/AppSidebar.vue'
import TagsView from '@/components/TagsView.vue'
import LayoutHeader from '@/components/LayoutHeader.vue'

const STORAGE_KEY = 'ecdp_sidebar_collapsed_fusion'
const isCollapsed = ref(localStorage.getItem(STORAGE_KEY) === 'true')
watch(isCollapsed, (val) => localStorage.setItem(STORAGE_KEY, String(val)))
</script>

<style lang="scss" scoped>
.fusion-layout {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.fusion-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.fusion-content {
  flex: 1;
  overflow: auto;
  background: #f5f7fa;
}
</style>
