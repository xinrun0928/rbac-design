<template>
  <div class="spec-layout">
    <!-- 顶部导航 -->
    <header class="spec-header">
      <div class="header-left">
        <button type="button" class="back-btn" title="返回登录" @click="goBack">
          <el-icon><Back /></el-icon>
        </button>
        <div class="header-brand" @click="goHome">
          <div class="header-logo">
            <el-icon><Collection /></el-icon>
          </div>
          <div class="header-text">
            <h2>研发规范文档库</h2>
            <p>Development Standards Library</p>
          </div>
        </div>
      </div>
    </header>

    <div class="spec-body">
      <!-- 左侧导航 -->
      <aside class="spec-side">
        <div class="side-title">
          <el-icon><Files /></el-icon>
          <span>规范目录</span>
        </div>

        <nav class="side-nav">
          <div
            v-for="category in specCategories"
            :key="category.key"
            class="nav-group"
            :class="{ collapsed: !expanded[category.key] }"
          >
            <div class="nav-group-title" :class="{ 'has-items': category.items.length }" @click="toggleGroup(category.key)">
              <el-icon class="nav-group-arrow"><ArrowRight /></el-icon>
              <el-icon class="nav-group-icon"><component :is="category.icon" /></el-icon>
              <span class="nav-group-tt">{{ category.title }}</span>
              <span class="nav-group-count">{{ category.items.length }}</span>
            </div>
            <div
              v-for="item in category.items"
              :key="item.key"
              class="nav-item"
              :class="{ active: item.key === activeKey }"
              @click="goSpec(item.key)"
            >
              <span class="nav-label">{{ item.title }}</span>
              <el-icon v-if="item.key === activeKey" class="nav-check"><Check /></el-icon>
            </div>
          </div>
        </nav>
      </aside>

      <!-- 右侧内容 -->
      <main class="spec-main">
        <router-view />
      </main>
    </div>

<!-- 回到顶部 -->
    <el-backtop :right="40" :bottom="40" target=".spec-page" visibility-height="200" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Collection,
  Files,
  Check,
  Back,
  ArrowRight
} from '@element-plus/icons-vue'
import { specCategories } from './specs'

const route = useRoute()
const router = useRouter()

const activeKey = computed(() => (route.params.key as string) || specCategories[0]?.items[0]?.key || '')

/** 各分类展开状态，默认全部展开 */
const expanded = ref<Record<string, boolean>>(
  Object.fromEntries(specCategories.map((c) => [c.key, true]))
)

function toggleGroup(key: string) {
  expanded.value[key] = !expanded.value[key]
}

/** 路由变化时确保当前文档所在的分类保持展开 */
watch(activeKey, (key) => {
  if (!key) return
  const cat = specCategories.find((c) => c.items.some((i) => i.key === key))
  if (cat) expanded.value[cat.key] = true
})

function goSpec(key: string) {
  if (key !== activeKey.value) router.push(`/specs/${key}`)
}

function goHome() {
  router.push(`/specs/${activeKey.value || ''}`)
}

function goBack() {
  router.push('/login')
}
</script>

<style scoped lang="scss">
.spec-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: linear-gradient(160deg, #f5f7fa 0%, #eef1f6 100%);
}

/* 顶部 */
.spec-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 28px;
  color: #fff;
  background: linear-gradient(120deg, #0a2a6b 0%, #0b3d91 55%, #0f6bd0 100%);
  box-shadow: 0 4px 16px rgba(11, 61, 145, 0.3);

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .back-btn {
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #fff;
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.28);
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.26);
      transform: translateX(-2px);
    }
  }

  .header-brand {
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
  }

  .header-logo {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    background: rgba(255, 255, 255, 0.16);
    border: 1px solid rgba(255, 255, 255, 0.25);
  }

  .header-text {
    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
    p {
      margin: 2px 0 0;
      font-size: 11px;
      opacity: 0.75;
      letter-spacing: 0.3px;
    }
  }
}

/* 主体 */
.spec-body {
  flex: 1;
  display: flex;
  min-height: 0;
  padding: 20px;
  gap: 20px;
}

/* 左侧导航 */
.spec-side {
  flex-shrink: 0;
  width: 240px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(31, 45, 61, 0.06);
  border: 1px solid #ebeef5;
  height: max-content;
  position: sticky;
  top: 20px;

  .side-title {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 16px;
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    border-bottom: 1px solid #f0f2f5;
  }

  .side-nav {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .nav-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-group + .nav-group {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #f0f2f5;
  }

  .nav-group.collapsed {
    .nav-item {
      display: none;
    }
  }

  .nav-group-title {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    font-size: 12px;
    font-weight: 600;
    color: #606266;
    letter-spacing: 0.5px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    user-select: none;

    &.has-items:hover {
      background: #f5f7fa;
      color: #303133;
    }

    .nav-group-arrow {
      font-size: 12px;
      transition: transform 0.2s;
    }

    .nav-group-icon {
      font-size: 14px;
      color: #909399;
    }

    .nav-group-tt {
      flex: 1;
    }

    .nav-group-count {
      font-size: 11px;
      font-weight: 500;
      color: #a8abb2;
      background: #f0f2f5;
      border-radius: 10px;
      padding: 0 6px;
      line-height: 16px;
    }
  }

  .nav-group.collapsed .nav-group-title .nav-group-arrow {
    transform: rotate(0deg);
  }

  .nav-group-title .nav-group-arrow {
    transform: rotate(90deg);
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px 10px 34px;
    border-radius: 8px;
    font-size: 13px;
    color: #606266;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    position: relative;
    margin-left: 10px;
    background: #fafbfc;

    &::before {
      content: '';
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #c0c4cc;
      transition: background 0.15s;
    }

    &:hover {
      background: #f0f4fa;
      color: #303133;
    }

    &.active {
      background: linear-gradient(90deg, #ecf5ff, #f5f9ff);
      color: #409eff;
      font-weight: 600;

      &::before {
        background: #409eff;
        box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.15);
      }
    }

    .nav-label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nav-check {
      color: #409eff;
    }
  }
}

/* 右侧内容 */
.spec-main {
  flex: 1;
  min-width: 0;
  display: flex;
  min-height: 0;
}
</style>