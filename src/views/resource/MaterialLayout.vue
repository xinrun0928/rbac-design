<template>
  <div class="material-layout" :class="{ collapsed: isCollapsed }">
    <!-- 左侧导航栏 -->
    <AppSidebar
      title="物资管理子系统"
      :icon="Box"
      :menus="materialMenus"
      :collapsed="isCollapsed"
    />

    <!-- 右侧内容区 -->
    <div class="material-main">
      <!-- 顶部栏 -->
      <LayoutHeader :menus="materialMenus" v-model:collapsed="isCollapsed" />

      <!-- 历史会话标签页 -->
      <TagsView :menus="materialMenus" storage-key="material-tags-view" />

      <!-- 页面内容 -->
      <main class="material-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Box
} from '@element-plus/icons-vue'
import { materialMenus } from '@/config/menu'
import AppSidebar from '@/components/AppSidebar.vue'
import TagsView from '@/components/TagsView.vue'
import LayoutHeader from '@/components/LayoutHeader.vue'

const STORAGE_KEY = 'ecdp_sidebar_collapsed_material'
const isCollapsed = ref(localStorage.getItem(STORAGE_KEY) === 'true')
watch(isCollapsed, (val) => localStorage.setItem(STORAGE_KEY, String(val)))
</script>

<style lang="scss" scoped>
.material-layout {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.material-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.material-content {
  flex: 1;
  overflow: auto;
  background: #f5f7fa;
}
</style>
