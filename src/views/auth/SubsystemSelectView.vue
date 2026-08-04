<template>
  <div class="subsystem-select-container">

    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="grid-line"></div>
      <div class="light-point point-1"></div>
      <div class="light-point point-2"></div>
      <div class="light-point point-3"></div>
    </div>


    <div class="subsystem-select-wrapper">
      <!-- 头部 -->
      <div class="select-header">
        <div class="org-info">
          <div class="org-icon" :style="{ background: currentOrg.color }">
            <span class="org-initial">{{ currentOrg.name.charAt(0) }}</span>
          </div>
          <div class="org-detail">
            <h3>{{ currentOrg.name }}</h3>
            <p>{{ currentOrg.mealName }}</p>
          </div>
        </div>
        <div class="header-actions">
          <el-button link @click="handleBackOrg">
            <el-icon><ArrowLeft /></el-icon>
            切换组织
          </el-button>
          <el-button link @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
            退出
          </el-button>
        </div>
      </div>

      <!-- 选择提示 -->
      <div class="select-tip">
        <h2>选择子系统</h2>
      </div>

      <!-- 子系统网格 -->
      <div class="subsystem-grid">
        <div
          v-for="subsystem in subsystemList"
          :key="subsystem.subsystemId"
          class="subsystem-card"
          :class="{
            'is-selected': selectedId === subsystem.subsystemId,
            'is-admin': subsystem.subsystemId === 99
          }"
          @click="handleSelectSubsystem(subsystem)"
        >
          <div class="subsystem-icon" :style="{ background: subsystem.color }">
            <el-icon :size="28">
              <component :is="getIconComponent(subsystem.icon)" />
            </el-icon>
          </div>
          <div class="subsystem-info">
            <h4>{{ subsystem.subsystemName }}</h4>
            <p>{{ subsystem.remark }}</p>
          </div>
          <div v-if="getProgress(subsystem.subsystemId).total > 0" class="subsystem-progress">
            <el-progress
              :percentage="getProgress(subsystem.subsystemId).percent"
              :stroke-width="6"
              :show-text="false"
              :color="getProgress(subsystem.subsystemId).percent === 100 ? '#67C23A' : '#409EFF'"
            />
            <div class="progress-text">
              已完成 {{ getProgress(subsystem.subsystemId).done }} / {{ getProgress(subsystem.subsystemId).total }} 页
            </div>
          </div>
          <div v-if="subsystem.subsystemId === 99" class="admin-badge">
            <el-icon><Tools /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      © 2026 广东省应急指挥调度平台
    </footer>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  SwitchButton,
  ArrowLeft,
  Monitor,
  Document,
  Warning,
  Connection,
  Box,
  DataAnalysis,
  Upload,
  Odometer,
  Setting,
  View,
  Tools
} from '@element-plus/icons-vue'
import { mockSubsystemData } from '@/mock/admin/subsystemData'
import type { Subsystem } from '@/types/admin/subsystem'
import {
  adminMenus,
  dutyMenus,
  planMenus,
  eventMenus,
  dispatchMenus,
  materialMenus,
  decisionMenus,
  fusionMenus
} from '@/config/menu'
import type { MenuItem } from '@/config/menu'
import { calcMenuProgress } from '@/utils/menuProgress'
import type { MenuProgress } from '@/utils/menuProgress'

const router = useRouter()
const selectedId = ref<number | null>(null)

// 子系统 ID -> 菜单配置映射（无菜单配置的子系统不展示进度条）
const subsystemMenusMap: Record<number, MenuItem[]> = {
  1: dutyMenus,
  2: planMenus,
  3: eventMenus,
  4: dispatchMenus,
  5: materialMenus,
  6: decisionMenus,
  7: fusionMenus,
  99: adminMenus
}

// 各子系统菜单完成度（只计算一次，缓存结果）
const progressMap = computed(() => {
  const result: Record<number, MenuProgress> = {}
  for (const [id, menus] of Object.entries(subsystemMenusMap)) {
    result[Number(id)] = calcMenuProgress(menus)
  }
  return result
})

// 获取某子系统的菜单完成度（未配置菜单的子系统返回全 0）
function getProgress(subsystemId: number): MenuProgress {
  return progressMap.value[subsystemId] || { total: 0, done: 0, doing: 0, todo: 0, percent: 0 }
}

// 当前组织信息
const currentOrg = reactive({
  id: 1,
  name: '广州市交通运输局',
  mealName: '企业旗舰版',
  color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
})

onMounted(() => {
  // 清除所有子系统的侧边栏折叠状态，重新进入子系统时默认展开
  const sidebarKeys = [
    'ecdp_sidebar_collapsed_admin',
    'ecdp_sidebar_collapsed_duty',
    'ecdp_sidebar_collapsed_plan',
    'ecdp_sidebar_collapsed_event',
    'ecdp_sidebar_collapsed_dispatch',
    'ecdp_sidebar_collapsed_material',
    'ecdp_sidebar_collapsed_decision',
    'ecdp_sidebar_collapsed_fusion',
  ]
  sidebarKeys.forEach(key => localStorage.removeItem(key))

  // 从 localStorage 获取选择的组织
  const orgStr = localStorage.getItem('currentOrg')
  if (orgStr) {
    const org = JSON.parse(orgStr)
    Object.assign(currentOrg, org)
  }

  // 获取当前已选择的子系统
  const subsystemStr = localStorage.getItem('currentSubsystem')
  if (subsystemStr) {
    const subsystem = JSON.parse(subsystemStr)
    selectedId.value = subsystem.subsystemId
  }
})

// 子系统列表（从 mock 数据中读取，过滤掉隐藏的，按 displayOrder 排序）
const subsystemList = computed(() => {
  return mockSubsystemData
    .filter(sub => !sub.isHidden)
    .sort((a, b) => a.displayOrder - b.displayOrder)
})

// 图标名称到组件的映射
const iconComponents: Record<string, any> = {
  Monitor,
  Document,
  Warning,
  Connection,
  Box,
  DataAnalysis,
  Upload,
  Odometer,
  Setting,
  View
}

// 获取图标组件
const getIconComponent = (iconName: string | undefined) => {
  return iconName ? iconComponents[iconName] || Setting : Setting
}

// 选择子系统
const handleSelectSubsystem = (subsystem: any) => {
  selectedId.value = subsystem.subsystemId

  // 存储选择的子系统信息
  localStorage.setItem('currentSubsystem', JSON.stringify(subsystem))

  // 延迟跳转，显示选中效果
  setTimeout(() => {
    // 根据子系统类型跳转
    if (subsystem.subsystemId === 99) {
      // 后台管理系统
      router.push('/admin')
    } else if (subsystem.subsystemId === 1) {
      // 应急值守管理子系统
      router.push('/duty/statistics')
    } else if (subsystem.subsystemId === 2) {
      // 预案管理子系统
      router.push('/plan')
    } else if (subsystem.subsystemId === 3) {
      // 应急事件管理子系统
      router.push('/event')
    } else if (subsystem.subsystemId === 4) {
      // 指挥智能调度子系统
      router.push('/dispatch/road/statistics')
    } else if (subsystem.subsystemId === 5) {
      // 物资管理子系统
      router.push('/resource')
    } else if (subsystem.subsystemId === 6) {
      // 辅助决策子系统
      router.push('/decision')
    } else if (subsystem.subsystemId === 7) {
      // 数据融合子系统
      router.push('/fusion')
    } else if (subsystem.subsystemId === 10) {
      // 汛期巡查子系统
      router.push('/inspection')
    } else {
      // 其他子系统（暂未开发，提示后跳转到对应路径）
      ElMessage.info(`${subsystem.subsystemName}模块开发中，正在跳转...`)
      router.push(subsystem.pathPrefix)
    }
  }, 300)
}

// 切换组织
const handleBackOrg = () => {
  router.push('/org-select')
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('已退出登录')
    router.push('/login')
  }).catch(() => {
    // 取消操作
  })
}
</script>

<style scoped>
.subsystem-select-container {
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;

  background:
    radial-gradient(
      circle at top left,
      #1e5eff,
      transparent 35%
    ),
    radial-gradient(
      circle at bottom right,
      #00c6ff,
      transparent 30%
    ),
    linear-gradient(
      135deg,
      #071a3d,
      #0b3d91
    );
}

/* 背景科技装饰 */
.bg-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.grid-line {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(
      rgba(255, 255, 255, 0.05) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.05) 1px,
      transparent 1px
    );
  background-size: 60px 60px;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(60px);
  }
}

.light-point {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 30px #fff;
  animation: float 6s infinite;
}

.point-1 {
  top: 18%;
  left: 15%;
}

.point-2 {
  top: 55%;
  right: 20%;
}

.point-3 {
  bottom: 15%;
  left: 40%;
}

@keyframes float {
  50% {
    transform: translateY(-30px);
  }
}

/* 主卡片 */
.subsystem-select-wrapper {
  width: 100%;
  max-width: 1400px;
  min-height: 0;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 36px 48px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

/* 头部 */
.select-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 18px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.org-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.org-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.org-initial {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.org-detail h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.org-detail p {
  font-size: 13px;
  color: #94a3b8;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.header-actions .el-button {
  font-size: 13px;
  color: #64748b;
}

.header-actions .el-button:hover {
  color: #1677ff;
}

/* 选择提示 */
.select-tip {
  text-align: center;
  margin-bottom: 22px;
}

.select-tip h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  letter-spacing: 0.5px;
  margin: 0;
}

/* 子系统网格 */
.subsystem-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 22px;
  flex: 1;
  align-content: start;
  padding-bottom: 20px;
}

/* 响应式布局 */
@media (max-width: 1400px) {
  .subsystem-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1200px) {
  .subsystem-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .subsystem-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .subsystem-select-wrapper {
    padding: 24px;
  }
}

.subsystem-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 28px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 168px;
  background: #fff;
}

.subsystem-card:hover {
  border-color: #1677ff;
  box-shadow: 0 10px 24px rgba(22, 119, 255, 0.22);
  transform: translateY(-6px);
}

.subsystem-card.is-selected {
  border-color: #1677ff;
  background: linear-gradient(
    135deg,
    rgba(22, 119, 255, 0.05) 0%,
    rgba(22, 119, 255, 0.12) 100%
  );
  box-shadow: 0 10px 24px rgba(22, 119, 255, 0.28);
}

.subsystem-card.is-admin {
  border-color: #1677ff;
  position: relative;
}

.subsystem-card.is-admin::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 56px 56px 0;
  border-color: transparent #1677ff transparent transparent;
  border-radius: 0 14px 0 0;
}

.subsystem-card.is-admin:hover {
  border-color: #00b7ff;
  box-shadow: 0 10px 24px rgba(0, 183, 255, 0.3);
}

.subsystem-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.subsystem-card:hover .subsystem-icon {
  transform: scale(1.1) rotate(-5deg);
}

.subsystem-card.is-selected .subsystem-icon {
  transform: scale(1.15);
}

.subsystem-info {
  text-align: center;
}

.subsystem-info h4 {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
  line-height: 1.4;
}

.subsystem-info p {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
  max-width: 180px;
  margin: 0 auto;
}

.subsystem-progress {
  width: 100%;
  margin-top: auto;
  padding-top: 12px;
}

.progress-text {
  margin-top: 6px;
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
}

.admin-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  color: #fff;
  font-size: 16px;
  z-index: 1;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 页脚 */
.footer {
  flex-shrink: 0;
  margin-top: 16px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;
  z-index: 1;
  text-align: center;
}
</style>
