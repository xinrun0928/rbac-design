<template>
  <div class="org-select-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="grid-line"></div>
      <div class="light-point point-1"></div>
      <div class="light-point point-2"></div>
      <div class="light-point point-3"></div>
    </div>

    <!-- 左侧快捷入口 -->
    <div class="left-entries">
      <div class="entry-slot spec-entry arch" @click="goToSpecs('architecture')">
        <span class="entry-icon"><el-icon><SetUp /></el-icon></span>
        <span class="entry-text">微服务架构</span>
      </div>
      <div class="entry-slot spec-entry depl" @click="goToDeploy">
        <span class="entry-icon"><el-icon><Platform /></el-icon></span>
        <span class="entry-text">部署架构图</span>
      </div>
      <div class="entry-slot spec-entry back" @click="goToSpecs('backend')">
        <span class="entry-icon"><el-icon><Collection /></el-icon></span>
        <span class="entry-text">后端开发规范</span>
      </div>
    </div>

    <!-- 右上角快捷入口 -->
    <div class="schedule-entry" @click="goToSchedule">
      <span class="entry-icon">
        <el-icon><Calendar /></el-icon>
      </span>
      <span class="entry-text">模块级排期 v4</span>
      <span class="entry-badge">NEW</span>
    </div>

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

    <!-- 页脚 -->
    <footer class="footer">
      © 2026 广东省应急指挥调度平台
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, SwitchButton, Box, ArrowRight, SetUp, Platform, Collection, Calendar } from '@element-plus/icons-vue'
import { specCategories } from '@/views/specs/specs'
import { clearToken, clearLoginInfo } from '@/utils/auth'

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
    clearToken()
    clearLoginInfo()
    ElMessage.success('已退出登录')
    router.push('/login')
  }).catch(() => {
    // 取消操作
  })
}

/** 模块排期 */
const goToSchedule = () => {
  router.push('/schedule-v4')
}

/** 部署架构图跳转 */
const goToDeploy = () => {
  router.push('/deploy-architecture')
}

/** 规范文档跳转（跳转指定分类的第一个文档） */
const goToSpecs = (category: string) => {
  const cat = specCategories.find((c) => c.key === category)
  const first = cat?.items[0]
  router.push(first ? `/specs/${first.key}` : '/specs')
}
</script>

<style scoped>
.org-select-container {
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px 40px;

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
  top: 20%;
  left: 20%;
}

.point-2 {
  top: 60%;
  right: 25%;
}

.point-3 {
  bottom: 20%;
  left: 45%;
}

@keyframes float {
  50% {
    transform: translateY(-30px);
  }
}

/* 主卡片 */
.org-select-wrapper {
  width: 560px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
  position: relative;
  z-index: 2;
  backdrop-filter: blur(10px);
}

/* 头部 */
.select-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 32px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  background: linear-gradient(135deg, #1677ff 0%, #00b7ff 100%);
  color: #fff;
}

.user-detail h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.user-detail p {
  font-size: 13px;
  color: #94a3b8;
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
  margin-bottom: 32px;
}

.select-tip h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}

.select-tip p {
  font-size: 14px;
  color: #94a3b8;
}

/* 组织列表 */
.org-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 28px;
}

.org-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
}

.org-card:hover {
  border-color: #1677ff;
  box-shadow: 0 8px 20px rgba(22, 119, 255, 0.18);
  transform: translateX(4px);
}

.org-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
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
  color: #1f2937;
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
  color: #94a3b8;
}

.meta-item .el-icon {
  font-size: 14px;
}

.org-arrow {
  color: #cbd5e1;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.org-card:hover .org-arrow {
  color: #1677ff;
  transform: translateX(4px);
}

/* 底部 */
.select-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.select-footer p {
  font-size: 13px;
  line-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #94a3b8;
}

/* 快捷入口 */
.left-entries {
  position: fixed;
  top: 25px;
  left: 30px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.entry-slot {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spec-entry {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 8px 10px;
  border-radius: 14px;
  color: #fff;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(14px);
  box-shadow: 0 6px 20px rgba(6, 37, 94, 0.18);
  transition: transform 0.28s, background 0.28s, border-color 0.28s, box-shadow 0.28s;

  .entry-icon {
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #fff;
    box-shadow: 0 4px 12px rgba(6, 37, 94, 0.2);
    transition: transform 0.28s;
  }

  .entry-text {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.3px;
    white-space: nowrap;
  }

  /* 微服务架构 */
  &.arch {
    background: linear-gradient(135deg, rgba(64, 158, 255, 0.35), rgba(94, 231, 223, 0.22));
    border-color: rgba(134, 231, 223, 0.4);

    .entry-icon {
      background: linear-gradient(135deg, #6ab0ff, #4facfe);
    }

    &:hover {
      border-color: rgba(134, 231, 223, 0.7);
      box-shadow: 0 8px 26px rgba(64, 158, 255, 0.35);
    }
  }

  /* 部署架构图 */
  &.depl {
    background: linear-gradient(135deg, rgba(103, 194, 58, 0.3), rgba(230, 162, 60, 0.18));
    border-color: rgba(160, 218, 128, 0.4);

    .entry-icon {
      background: linear-gradient(135deg, #67c23a, #4ea640);
    }

    &:hover {
      border-color: rgba(160, 218, 128, 0.7);
      box-shadow: 0 8px 26px rgba(103, 194, 58, 0.32);
    }
  }

  /* 后端开发规范 */
  &.back {
    background: linear-gradient(135deg, rgba(230, 162, 60, 0.32), rgba(190, 144, 202, 0.2));
    border-color: rgba(235, 190, 120, 0.4);

    .entry-icon {
      background: linear-gradient(135deg, #e6a23c, #c77d1f);
    }

    &:hover {
      border-color: rgba(235, 190, 120, 0.7);
      box-shadow: 0 8px 26px rgba(230, 162, 60, 0.3);
    }
  }

  &:hover {
    transform: translateY(-3px);

    .entry-icon {
      transform: rotate(-8deg) scale(1.05);
    }
  }
}

.schedule-entry {
  position: fixed;
  right: 30px;
  top: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 8px 10px;
  border-radius: 14px;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(121, 134, 203, 0.32), rgba(78, 205, 196, 0.2));
  border: 1px solid rgba(178, 181, 235, 0.4);
  backdrop-filter: blur(14px);
  box-shadow: 0 6px 20px rgba(6, 37, 94, 0.18);
  transition: transform 0.28s, background 0.28s, border-color 0.28s, box-shadow 0.28s;
  z-index: 10;

  .entry-icon {
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #fff;
    background: linear-gradient(135deg, #8a93e0, #6ac6b9);
    box-shadow: 0 4px 12px rgba(6, 37, 94, 0.2);
    transition: transform 0.28s;
  }

  .entry-text {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.3px;
    white-space: nowrap;
  }

  .entry-badge {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #fff;
    background: linear-gradient(135deg, #e6a23c, #f56c6c);
    border-radius: 10px;
    padding: 2px 7px;
    box-shadow: 0 3px 10px rgba(230, 162, 60, 0.35);
  }

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(178, 181, 235, 0.7);
    box-shadow: 0 8px 26px rgba(121, 134, 203, 0.35);

    .entry-icon {
      transform: rotate(-8deg) scale(1.05);
    }
  }
}

/* 页脚 */
.footer {
  position: fixed;
  bottom: 20px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;
  z-index: 1;
}

/* 响应式 */
@media (max-width: 600px) {
  .org-select-wrapper {
    width: 95%;
    padding: 28px 20px;
  }
}
</style>
