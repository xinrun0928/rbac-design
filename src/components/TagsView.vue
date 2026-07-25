<template>
  <div class="tags-view-container">
    <div class="tags-view-wrapper" ref="scrollContainer">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :to="{ path: tag.path }"
        class="tags-view-item"
        :class="{ active: isActive(tag) }"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <el-icon
          v-if="!isAffix(tag)"
          class="tags-view-item__close"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <Close />
        </el-icon>
      </router-link>
    </div>
    <div class="tags-view-actions">
      <el-icon class="refresh-btn" @click="refreshPage"><Refresh /></el-icon>
    </div>

    <!-- 右键菜单 -->
    <ul
      v-show="visible"
      class="contextmenu"
      :style="{ left: left + 'px', top: top + 'px' }"
    >
      <li @click="refreshSelectedTag(selectedTag)">刷新页面</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭当前</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Close, Refresh } from '@element-plus/icons-vue'

interface TagView {
  path: string
  title: string
  name?: string
  affix?: boolean
}

interface MenuItem {
  path: string
  title: string
  icon?: any
  children?: MenuItem[]
  isGroup?: boolean
  groupTitle?: string
}

const props = withDefaults(defineProps<{
  /** 菜单列表，用于自动获取首页路径和标题 */
  menus?: MenuItem[]
  /** 首页路径，用于固定标签判断（不传则从 menus 第一项获取） */
  homePath?: string
  /** 首页标题（不传则从 menus 第一项获取） */
  homeTitle?: string
  /** localStorage 存储 key，不同子系统使用不同 key 避免冲突 */
  storageKey?: string
}>(), {
  menus: () => [],
  homePath: '',
  homeTitle: '',
  storageKey: 'visitedViews'
})

// 从菜单中获取第一个有效路径和标题
const getHomeFromMenus = (): { path: string; title: string } => {
  if (props.menus.length > 0) {
    const first = props.menus[0]
    return { path: first.path, title: first.title }
  }
  return { path: '/admin/dashboard', title: '首页' }
}

const resolvedHomePath = computed(() => props.homePath || getHomeFromMenus().path)
const resolvedHomeTitle = computed(() => props.homeTitle || getHomeFromMenus().title)

const route = useRoute()
const router = useRouter()

const visitedViews = ref<TagView[]>([])

const visible = ref(false)
const left = ref(0)
const top = ref(0)
const selectedTag = ref<TagView>({})
const scrollContainer = ref<HTMLElement>()

// 固定标签（首页）
const affixTags = computed(() => {
  return visitedViews.value.filter(tag => tag.affix)
})

// 保存到本地存储
const saveToStorage = () => {
  localStorage.setItem(props.storageKey, JSON.stringify(visitedViews.value))
}

// 从本地存储加载
const loadFromStorage = () => {
  const stored = localStorage.getItem(props.storageKey)
  const homeTag: TagView = { path: resolvedHomePath.value, title: resolvedHomeTitle.value, affix: true }
  if (stored) {
    try {
      const views = JSON.parse(stored) as TagView[]
      // 确保首页标签存在且路径和标题匹配
      const homeIndex = views.findIndex(v => v.affix)
      if (homeIndex === -1) {
        views.unshift(homeTag)
      } else if (views[homeIndex].path !== resolvedHomePath.value || views[homeIndex].title !== resolvedHomeTitle.value) {
        views[homeIndex] = homeTag
      }
      return views
    } catch {
      return [homeTag]
    }
  }
  return [homeTag]
}

// 判断是否激活
const isActive = (tag: TagView) => {
  return tag.path === route.path
}

// 判断是否固定
const isAffix = (tag: TagView) => {
  return tag.affix
}

// 添加标签
const addView = (tag: TagView) => {
  if (visitedViews.value.some(v => v.path === tag.path)) return
  visitedViews.value.push(tag)
  saveToStorage()
}

// 删除标签
const delView = (tag: TagView) => {
  return new Promise<TagView[]>((resolve) => {
    const index = visitedViews.value.findIndex(v => v.path === tag.path)
    if (index > -1) {
      visitedViews.value.splice(index, 1)
    }
    saveToStorage()
    resolve(visitedViews.value)
  })
}

// 刷新页面
const refreshSelectedTag = (tag: TagView) => {
  const { fullPath } = route
  nextTick(() => {
    router.replace({
      path: '/redirect' + fullPath
    })
  })
  visible.value = false
}

// 刷新当前页面
const refreshPage = () => {
  const { fullPath } = route
  nextTick(() => {
    router.replace({
      path: '/redirect' + fullPath
    })
  })
}

// 关闭当前标签
const closeSelectedTag = (tag: TagView) => {
  delView(tag).then((tags) => {
    if (isActive(tag)) {
      toLastView(tags)
    }
  })
  visible.value = false
}

// 关闭其他标签
const closeOthersTags = () => {
  visitedViews.value = visitedViews.value.filter(
    tag => tag.affix || tag.path === selectedTag.value.path
  )
  saveToStorage()
  router.push(selectedTag.value.path)
  visible.value = false
}

// 关闭所有标签
const closeAllTags = (tag: TagView) => {
  visitedViews.value = affixTags.value
  saveToStorage()
  if (affixTags.value.some(tag => tag.path === route.path)) {
    return
  }
  toLastView(visitedViews.value)
  visible.value = false
}

// 跳转到最后一个标签
const toLastView = (tags: TagView[]) => {
  const latestView = tags[tags.length - 1]
  if (latestView) {
    router.push(latestView.path)
  } else {
    router.push('/')
  }
}

// 打开右键菜单
const openMenu = (tag: TagView, e: MouseEvent) => {
  const menuMinWidth = 105
  const tagsViewEl = scrollContainer.value?.closest('.tags-view-container') as HTMLElement
  if (!tagsViewEl) return
  const containerRect = tagsViewEl.getBoundingClientRect()
  const offsetWidth = tagsViewEl.offsetWidth
  const maxLeft = offsetWidth - menuMinWidth

  const leftValue = e.clientX - containerRect.left + 15
  const topValue = e.clientY - containerRect.top

  left.value = leftValue > maxLeft ? maxLeft : leftValue
  top.value = topValue
  visible.value = true
  selectedTag.value = tag
}

// 监听路由变化
watch(route, () => {
  addView({
    path: route.path,
    title: (route.meta?.title as string) || '未命名'
  })
})

// 监听右键菜单关闭
const closeMenu = () => {
  visible.value = false
}

onMounted(() => {
  document.addEventListener('click', closeMenu)
  // 从本地存储加载历史标签
  visitedViews.value = loadFromStorage()
  // 添加当前路由标签（如果不存在）
  addView({
    path: route.path,
    title: (route.meta?.title as string) || '未命名',
    affix: route.path === resolvedHomePath.value
  })
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})
</script>

<style scoped>
.tags-view-container {
  display: flex;
  align-items: center;
  position: relative;
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
}

.tags-view-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 8px;
  overflow-x: auto;
  overflow-y: hidden;
}

.tags-view-wrapper::-webkit-scrollbar {
  height: 0;
}

.tags-view-item {
  display: inline-flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  height: 26px;
  line-height: 26px;
  border: 1px solid #d8dce5;
  color: #495060;
  background: #fff;
  padding: 0 8px;
  font-size: 12px;
  margin-left: 5px;
  text-decoration: none;
  border-radius: 3px;
  white-space: nowrap;
}

.tags-view-item:first-of-type {
  margin-left: 0;
}

.tags-view-item:hover {
  color: #409EFF;
}

.tags-view-item.active {
  background-color: #409EFF;
  color: #fff;
  border-color: #409EFF;
}

.tags-view-item__close {
  margin-left: 4px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 50%;
}

.tags-view-item__close:hover {
  background-color: rgba(0, 0, 0, 0.16);
  color: #fff;
}

.tags-view-actions {
  display: flex;
  align-items: center;
  padding: 0 8px;
  border-left: 1px solid #d8dce5;
  height: 100%;
}

.refresh-btn {
  font-size: 16px;
  cursor: pointer;
  color: #606266;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s;
}

.refresh-btn:hover {
  color: #409EFF;
  background: #f5f7fa;
}

.contextmenu {
  margin: 0;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  background: #fff;
  border-radius: 4px;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}

.contextmenu li {
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;
  font-size: 12px;
}

.contextmenu li:hover {
  background: #eee;
}
</style>
