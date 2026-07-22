<template>
  <div class="org-select-container">
    <div class="org-select-wrapper">
      <!-- 头部 -->
      <div class="select-header">
        <div class="user-info">
          <el-avatar :size="48" class="user-avatar">
            <el-icon :size="24"><User /></el-icon>
          </el-avatar>
          <div class="user-detail">
            <h3>{{ userInfo.name }}</h3>
            <p>{{ userInfo.phone }}</p>
          </div>
        </div>
        <el-button link @click="handleLogout">
          <el-icon><SwitchButton /></el-icon>
          返回登录
        </el-button>
      </div>

      <!-- 选择提示 -->
      <div class="select-tip">
        <h2>请选择要进入的组织</h2>
        <p>您有 {{ orgList.length }} 个组织，请选择一个进入系统</p>
      </div>

      <!-- 组织列表 -->
      <div class="org-list">
        <div
          v-for="org in orgList"
          :key="org.id"
          class="org-card"
          @click="handleSelectOrg(org)"
        >
          <div class="org-icon" :style="{ background: org.color }">
            <span class="org-initial">{{ org.name.charAt(0) }}</span>
          </div>
          <div class="org-info">
            <h4 class="org-name">{{ org.name }}</h4>
            <div class="org-meta">
              <span class="meta-item">
                <el-icon><User /></el-icon>
                {{ org.memberCount }} 位成员
              </span>
              <span class="meta-item">
                <el-icon><Box /></el-icon>
                {{ org.mealName }}
              </span>
            </div>
          </div>
          <div class="org-arrow">
            <el-icon :size="20"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="select-footer">
        <p>如需更换账号，可 <el-link type="primary" :underline="false" @click="handleLogout">返回登录</el-link></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, SwitchButton, Box, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()

// 用户信息
const userInfo = reactive({
  name: '管理员',
  phone: '138****8000'
})

// 组织列表（模拟数据）
const orgList = ref([
  {
    id: 1,
    name: '广州市交通运输局',
    memberCount: 156,
    mealName: '企业旗舰版',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    name: '深圳市水务集团',
    memberCount: 89,
    mealName: '企业标准版',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 3,
    name: '东莞市城建工程管理局',
    memberCount: 42,
    mealName: '团队版',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  }
])

// 选择组织
const handleSelectOrg = (org: any) => {
  // 存储选择的组织信息
  localStorage.setItem('currentOrg', JSON.stringify(org))
  router.push('/subsystem-select')
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
.org-select-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.org-select-wrapper {
  width: 480px;
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

/* 头部 */
.select-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  background: linear-gradient(135deg, #409EFF 0%, #66B1FF 100%);
  color: #fff;
}

.user-detail h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.user-detail p {
  font-size: 13px;
  color: #909399;
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
  margin-bottom: 8px;
}

.select-tip p {
  font-size: 14px;
  color: #909399;
}

/* 组织列表 */
.org-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.org-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.org-card:hover {
  border-color: #409EFF;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
  transform: translateX(4px);
}

.org-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.org-initial {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
}

.org-info {
  flex: 1;
  min-width: 0;
}

.org-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.org-meta {
  display: flex;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.meta-item .el-icon {
  font-size: 14px;
}

.org-arrow {
  color: #c0c4cc;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.org-card:hover .org-arrow {
  color: #409EFF;
}

/* 底部 */
.select-footer {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.select-footer p {
  font-size: 13px;
  line-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #909399;
}
</style>
