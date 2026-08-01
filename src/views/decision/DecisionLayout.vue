<template>
  <div class="decision-layout" :class="{ collapsed: isCollapsed }">
    <!-- 左侧导航栏 -->
    <AppSidebar
      title="辅助决策子系统"
      :icon="DataAnalysis"
      :menus="decisionMenus"
      :collapsed="isCollapsed"
    />

    <!-- 右侧内容区 -->
    <div class="decision-main">
      <!-- 顶部栏 -->
      <LayoutHeader :menus="decisionMenus" v-model:collapsed="isCollapsed" />

      <!-- 历史会话标签页 -->
      <TagsView :menus="decisionMenus" storage-key="decision-tags-view" />

      <!-- 页面内容 -->
      <main class="decision-content">
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
import { decisionMenus } from '@/config/menu'
import AppSidebar from '@/components/AppSidebar.vue'
import TagsView from '@/components/TagsView.vue'
import LayoutHeader from '@/components/LayoutHeader.vue'

const isCollapsed = ref(false)
</script>

<style lang="scss" scoped>
.decision-layout {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.decision-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.decision-content {
  flex: 1;
  overflow: auto;
  background: #f5f7fa;
}
</style>
