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
            <el-icon :size="28">
              <component :is="subsystem.icon" />
            </el-icon>
          </div>
          <div class="subsystem-info">
            <h4>{{ subsystem.subsysName }}</h4>
            <p>{{ subsystem.remark }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
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

// 子系统列表（8个主要子系统）
const subsystemList = ref([
  {
    subsysId: 1,
    subsysName: '应急值守管理',
    subsysShortName: '值守',
    remark: '值班、排班、交接班',
    icon: Monitor,
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    subsysId: 2,
    subsysName: '应急预案管理',
    subsysShortName: '预案',
    remark: '预案编制、演练、复盘',
    icon: Document,
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    subsysId: 3,
    subsysName: '应急事件管理',
    subsysShortName: '事件',
    remark: '事件接报、响应、处置',
    icon: Warning,
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    subsysId: 4,
    subsysName: '应急指挥调度',
    subsysShortName: '调度',
    remark: '资源调度、任务下达',
    icon: Connection,
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    subsysId: 5,
    subsysName: '应急物资管理',
    subsysShortName: '物资',
    remark: '物资库存、调度、盘点',
    icon: Box,
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    subsysId: 6,
    subsysName: '辅助决策系统',
    subsysShortName: '决策',
    remark: '态势分析、辅助决策',
    icon: DataAnalysis,
    color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
  },
  {
    subsysId: 7,
    subsysName: '数据融合系统',
    subsysShortName: '融合',
    remark: '多源数据接入、融合',
    icon: Upload,
    color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  },
  {
    subsysId: 8,
    subsysName: '综合展示系统',
    subsysShortName: '展示',
    remark: '大屏展示、数据可视化',
    icon: Odometer,
    color: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
  }
])

// 选择子系统
const handleSelectSubsystem = (subsystem: any) => {
  ElMessageBox.confirm(
    `确定要进入「${subsystem.subsysName}」吗？`,
    '确认进入',
    {
      confirmButtonText: '确定进入',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    // 存储选择的子系统信息
    localStorage.setItem('currentSubsystem', JSON.stringify(subsystem))
    ElMessage.success(`已进入「${subsystem.subsysName}」`)
    // 根据子系统类型跳转
    if (subsystem.subsysId === 8) {
      // 后台管理系统
      router.push('/')
    } else {
      // 其他子系统（暂未开发，提示）
      ElMessage.info(`${subsystem.subsysName}模块开发中...`)
    }
  }).catch(() => {
    // 取消选择
  })
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
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  flex: 1;
  align-content: center;
}

.subsystem-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  border: 1px solid #ebeef5;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 160px;
}

.subsystem-card:hover {
  border-color: #409EFF;
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.15);
  transform: translateY(-4px);
}

.subsystem-icon {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 16px;
}

.subsystem-info {
  text-align: center;
}

.subsystem-info h4 {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
  white-space: nowrap;
}

.subsystem-info p {
  font-size: 13px;
  color: #909399;
  line-height: 1.5;
}
</style>
