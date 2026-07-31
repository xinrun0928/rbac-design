<template>
  <div class="subsystem-select-container">
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
        <p>请选择要进入的业务子系统</p>
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
          <div v-if="subsystem.subsystemId === 99" class="admin-badge">
            <el-icon><Tools /></el-icon>
          </div>
        </div>
      </div>
    </div>
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

const router = useRouter()
const selectedId = ref<number | null>(null)

// 当前组织信息
const currentOrg = reactive({
  id: 1,
  name: '广州市交通运输局',
  mealName: '企业旗舰版',
  color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
})

onMounted(() => {
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
    localStorage.removeItem('currentOrg')
    localStorage.removeItem('currentSubsystem')
    ElMessage.success('已退出登录')
    router.push('/login')
  }).catch(() => {
    // 取消操作
  })
}
</script>

<style scoped>
.subsystem-select-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.subsystem-select-wrapper {
  width: 100%;
  max-width: 1400px;
  min-height: calc(100vh - 80px);
  background: #fff;
  border-radius: 16px;
  padding: 32px 48px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

/* 头部 */
.select-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 32px;
}

.org-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.org-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.org-initial {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.org-detail h3 {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.org-detail p {
  font-size: 12px;
  color: #909399;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.header-actions .el-button {
  font-size: 13px;
  color: #606266;
}

/* 选择提示 */
.select-tip {
  text-align: center;
  margin-bottom: 40px;
}

.select-tip h2 {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.select-tip p {
  font-size: 14px;
  color: #909399;
}

/* 子系统网格 */
.subsystem-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
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
  border: 2px solid #ebeef5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 160px;
  background: #fff;
}

.subsystem-card:hover {
  border-color: #409EFF;
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.2);
  transform: translateY(-6px);
}

.subsystem-card.is-selected {
  border-color: #409EFF;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.05) 0%, rgba(64, 158, 255, 0.1) 100%);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.25);
}

.subsystem-card.is-admin {
  border-color: #3498db;
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
  border-width: 0 40px 40px 0;
  border-color: transparent #3498db transparent transparent;
  border-radius: 0 10px 0 0;
}

.subsystem-card.is-admin:hover {
  border-color: #2c3e50;
  box-shadow: 0 8px 20px rgba(44, 62, 80, 0.3);
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
  color: #303133;
  margin-bottom: 6px;
  line-height: 1.4;
}

.subsystem-info p {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  max-width: 180px;
  margin: 0 auto;
}

.admin-badge {
  position: absolute;
  top: 8px;
  right: 8px;
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
</style>
