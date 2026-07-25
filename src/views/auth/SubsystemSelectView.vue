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
          :key="subsystem.subsysId"
          class="subsystem-card"
          @click="handleSelectSubsystem(subsystem)"
        >
          <div class="subsystem-icon" :style="{ background: subsystem.color }">
            <el-icon :size="32">
              <component :is="getIconComponent(subsystem.icon)" />
            </el-icon>
          </div>
          <div class="subsystem-info">
            <h4>{{ subsystem.subsysName.replace('子系统', '') }}</h4>
            <p>{{ subsystem.remark }}</p>
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
  Setting
} from '@element-plus/icons-vue'
import { mockSubsystemData } from '@/mock/subsystemData'
import type { Subsystem } from '@/types/subsystem'

const router = useRouter()

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
})

// 子系统列表（从 mock 数据中读取，过滤掉隐藏的）
const subsystemList = computed(() => {
  return mockSubsystemData.filter(sub => !sub.isHidden)
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
  Setting
}

// 获取图标组件
const getIconComponent = (iconName: string | undefined) => {
  return iconName ? iconComponents[iconName] || Setting : Setting
}

// 选择子系统
const handleSelectSubsystem = (subsystem: any) => {
  // 存储选择的子系统信息
  localStorage.setItem('currentSubsystem', JSON.stringify(subsystem))

  // 根据子系统类型跳转
  if (subsystem.subsysId === 99) {
    // 后台管理系统
    router.push('/admin')
  } else {
    // 其他子系统（暂未开发，提示后跳转到对应路径）
    ElMessage.info(`${subsystem.subsysName}模块开发中，正在跳转...`)
    setTimeout(() => {
      router.push(subsystem.pathPrefix)
    }, 1000)
  }
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
  padding: 40px;
}

.subsystem-select-wrapper {
  width: 100%;
  max-width: 1200px;
  min-height: calc(100vh - 80px);
  background: #fff;
  border-radius: 16px;
  padding: 40px;
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
  margin-bottom: 24px;
}

.select-tip h2 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.select-tip p {
  font-size: 14px;
  color: #909399;
}

/* 子系统网格 */
.subsystem-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  flex: 1;
  align-content: center;
}

.subsystem-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 140px;
}

.subsystem-card:hover {
  border-color: #409EFF;
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.15);
  transform: translateY(-4px);
}

.subsystem-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 14px;
}

.subsystem-info {
  text-align: center;
}

.subsystem-info h4 {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.subsystem-info p {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}
</style>
