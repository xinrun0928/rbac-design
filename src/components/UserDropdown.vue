<template>
  <el-dropdown trigger="click">
    <div class="user-info">
      <el-avatar :size="32" class="user-avatar">
        <el-icon><User /></el-icon>
      </el-avatar>
      <span class="user-name">管理员</span>
      <el-icon class="el-icon--right"><ArrowDown /></el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :icon="User">个人中心</el-dropdown-item>
        <el-dropdown-item :icon="Setting">系统设置</el-dropdown-item>
        <el-dropdown-item divided :icon="Switch" @click="handleSwitchOrg">切换组织</el-dropdown-item>
        <el-dropdown-item :icon="Grid" @click="handleSwitchSubsystem">切换子系统</el-dropdown-item>
        <el-dropdown-item divided :icon="SwitchButton" @click="handleLogout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import {
  User,
  ArrowDown,
  Setting,
  SwitchButton,
  Switch,
  Grid
} from '@element-plus/icons-vue'

const router = useRouter()

const handleSwitchOrg = () => {
  router.push('/org-select')
}

const handleSwitchSubsystem = () => {
  router.push('/subsystem-select')
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    localStorage.removeItem('currentOrg')
    localStorage.removeItem('currentSubsystem')
    router.push('/login')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: #f5f7fa;
  }

  .user-avatar {
    background: linear-gradient(135deg, #409EFF 0%, #66B1FF 100%);
    color: #fff;
  }

  .user-name {
    font-size: 14px;
    color: #303133;
    font-weight: 500;
  }
}
</style>
