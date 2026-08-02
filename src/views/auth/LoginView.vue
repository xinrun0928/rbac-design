<template>
  <div class="login-page">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="grid-line"></div>
      <div class="light-point point-1"></div>
      <div class="light-point point-2"></div>
      <div class="light-point point-3"></div>
    </div>

    <!-- 顶部快捷入口 -->
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

    <!-- 顶部快捷入口 -->
    <div class="schedule-entry" @click="goToSchedule">
      <span class="entry-icon">
        <el-icon>
          <Calendar />
        </el-icon>
      </span>
      <span class="entry-text">模块级排期 v4</span>
      <span class="entry-badge">NEW</span>
    </div>

    <div class="login-card">
      <!-- 左侧品牌区域 -->
      <section class="brand-panel">
        <div class="brand-content">
          <!-- Logo -->
          <div class="logo-box">
            <div class="logo-ring">
              <el-icon>
                <DataBoard />
              </el-icon>
            </div>
          </div>

          <!-- 标题 -->
          <h1>应急指挥调度平台</h1>

          <p class="english-title">Emergency Command Dispatch Platform</p>

          <p class="description">统一指挥 · 快速响应 · 智能调度</p>

          <!-- 功能展示 -->
          <div class="feature-list">
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon>
                  <Lock />
                </el-icon>
              </div>
              <div>
                <strong>安全可靠</strong>
                <span>多级权限安全控制</span>
              </div>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <el-icon>
                  <OfficeBuilding />
                </el-icon>
              </div>
              <div>
                <strong>组织管理</strong>
                <span>灵活组织架构体系</span>
              </div>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <el-icon>
                  <Document />
                </el-icon>
              </div>
              <div>
                <strong>全程审计</strong>
                <span>完善操作日志追踪</span>
              </div>
            </div>
          </div>

          <!-- 数据装饰 -->
          <div class="data-panel">
            <div>
              <span>24</span>
              <label>小时响应</label>
            </div>
            <div>
              <span>99.9%</span>
              <label>系统稳定</label>
            </div>
            <div>
              <span>100%</span>
              <label>数据安全</label>
            </div>
          </div>
        </div>
      </section>

      <!-- 登录区域 -->
      <section class="login-panel">
        <div class="login-content">
          <header class="login-header">
            <h2>欢迎登录</h2>
            <p>请使用您的账号进行身份验证</p>
          </header>

          <!-- 登录方式 -->
          <el-tabs v-model="loginType" class="login-tabs">
            <el-tab-pane label="账号密码登录" name="password">
              <el-form
                ref="passwordFormRef"
                :model="passwordForm"
                :rules="passwordRules"
                class="login-form"
                @keyup.enter="handlePasswordLogin"
              >
                <el-form-item prop="username">
                  <el-input
                    v-model="passwordForm.username"
                    placeholder="请输入用户名/手机号"
                    size="large"
                    :prefix-icon="User"
                  />
                </el-form-item>

                <el-form-item prop="password">
                  <el-input
                    v-model="passwordForm.password"
                    type="password"
                    placeholder="请输入密码"
                    size="large"
                    show-password
                    :prefix-icon="Lock"
                  />
                </el-form-item>

                <div class="form-operate">
                  <el-checkbox v-model="rememberMe">记住我</el-checkbox>
                  <el-link type="primary" :underline="false" @click="goToForgotPassword">
                    忘记密码？
                  </el-link>
                </div>

                <el-button
                  type="primary"
                  class="login-button"
                  size="large"
                  :loading="loading"
                  @click="handlePasswordLogin"
                >
                  登录
                </el-button>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="手机验证码登录" name="sms">
              <el-form
                ref="smsFormRef"
                :model="smsForm"
                :rules="smsRules"
                class="login-form"
                @keyup.enter="handleSmsLogin"
              >
                <el-form-item prop="phone">
                  <el-input
                    v-model="smsForm.phone"
                    placeholder="请输入手机号"
                    size="large"
                    :prefix-icon="Iphone"
                  />
                </el-form-item>

                <el-form-item prop="code">
                  <div class="sms-box">
                    <el-input
                      v-model="smsForm.code"
                      placeholder="请输入验证码"
                      size="large"
                      :prefix-icon="Message"
                    />
                    <el-button
                      size="large"
                      class="sms-button"
                      :disabled="smsCooldown > 0"
                      @click="sendSmsCode"
                    >
                      {{ smsCooldown > 0 ? `${smsCooldown}s` : '获取验证码' }}
                    </el-button>
                  </div>
                </el-form-item>

                <div class="form-operate">
                  <el-checkbox v-model="rememberMe">记住我</el-checkbox>
                  <el-link type="primary" :underline="false" @click="goToForgotPassword">
                    忘记密码？
                  </el-link>
                </div>

                <el-button
                  type="primary"
                  class="login-button"
                  size="large"
                  :loading="loading"
                  @click="handleSmsLogin"
                >
                  登录
                </el-button>
              </el-form>
            </el-tab-pane>
          </el-tabs>

          <!-- 第三方登录 -->
          <div class="other-login">
            <div class="divider">
              <span>其他登录方式</span>
            </div>

            <div class="third-party">
              <div class="third-item" @click="handleSocialLogin('yuezhengyi')">
                <div class="third-icon blue">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                    />
                  </svg>
                </div>
                <span>粤政易</span>
              </div>

              <div class="third-item" @click="handleSocialLogin('yueshengshi')">
                <div class="third-icon green">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
                    />
                  </svg>
                </div>
                <span>粤省事</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 页脚 -->
    <footer class="footer">© 2026 广东省应急指挥调度平台</footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  User,
  Lock,
  Iphone,
  Message,
  DataBoard,
  OfficeBuilding,
  Document,
  Calendar,
  Collection,
  SetUp,
  Platform
} from '@element-plus/icons-vue'
import { specCategories } from '@/views/specs/specs'

/** 路由 */
const router = useRouter()

/** 登录类型 */
const loginType = ref<'password' | 'sms'>('password')

/** 登录状态 */
const loading = ref(false)

/** 记住密码 */
const rememberMe = ref(false)

/** 短信倒计时 */
const smsCooldown = ref(0)

let smsTimer: ReturnType<typeof setInterval> | null = null

/** 密码登录表单 */
const passwordFormRef = ref<FormInstance>()

const passwordForm = reactive({
  username: 'admin',
  password: '123456'
})

/** 手机登录表单 */
const smsFormRef = ref<FormInstance>()

const smsForm = reactive({
  phone: '13800138000',
  code: '123456'
})

/** 密码校验规则 */
const passwordRules: FormRules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      min: 6,
      message: '密码长度不能少于6位',
      trigger: 'blur'
    }
  ]
}

/** 手机验证码规则 */
const smsRules: FormRules = {
  phone: [
    {
      required: true,
      message: '请输入手机号',
      trigger: 'blur'
    },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确手机号',
      trigger: 'blur'
    }
  ],
  code: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur'
    },
    {
      len: 6,
      message: '验证码长度为6位',
      trigger: 'blur'
    }
  ]
}

/** 密码登录 */
const handlePasswordLogin = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        ElMessage.success('登录成功')
        router.push('/org-select')
      }, 1200)
    }
  })
}

/** 手机登录 */
const handleSmsLogin = async () => {
  if (!smsFormRef.value) return

  await smsFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        ElMessage.success('登录成功')
        router.push('/org-select')
      }, 1200)
    }
  })
}

/** 发送短信验证码 */
const sendSmsCode = async () => {
  try {
    await smsFormRef.value?.validateField('phone')

    smsCooldown.value = 60
    smsTimer = setInterval(() => {
      smsCooldown.value--
      if (smsCooldown.value <= 0 && smsTimer) {
        clearInterval(smsTimer)
        smsTimer = null
      }
    }, 1000)

    ElMessage.success('验证码发送成功')
  } catch (e) {
    console.log(e)
  }
}

/** 第三方登录 */
const handleSocialLogin = (type: string) => {
  ElMessage.info(`${type} 登录功能开发中`)
}

/** 忘记密码 */
const goToForgotPassword = () => {
  router.push('/forgot-password')
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

/** 销毁 */
onUnmounted(() => {
  if (smsTimer) {
    clearInterval(smsTimer)
  }
})
</script>

<style scoped lang="scss">
/* ===============================
   页面整体
=============================== */
.login-page {
  width: 100%;
  height: 100vh;
  padding: 0 24px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at top left, #1e5eff, transparent 35%),
    radial-gradient(circle at bottom right, #00c6ff, transparent 30%),
    linear-gradient(135deg, #071a3d, #0b3d91);
}

/* ===============================
   背景科技装饰
=============================== */
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
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
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

/* ===============================
   顶部入口
=============================== */
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

/* ===============================
   主登录卡
=============================== */
.login-card {
  width: 100%;
  max-width: 960px;
  min-width: 720px;
  min-height: 400px;
  height: auto;
  display: flex;
  overflow: hidden;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
  position: relative;
  z-index: 2;
}

/* ===============================
   左侧品牌
=============================== */
.brand-panel {
  width: 45%;
  padding: 60px;
  display: flex;
  align-items: center;
  background: linear-gradient(145deg, #0068ff, #00b7ff);
  color: #fff;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.brand-panel::after {
  content: '';
  position: absolute;
  width: 350px;
  height: 350px;
  right: -120px;
  bottom: -120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
}

.brand-content {
  width: 100%;
  position: relative;
  z-index: 1;
}

.logo-box {
  margin-bottom: 25px;
}

.logo-ring {
  width: 76px;
  height: 76px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
}

.logo-ring .el-icon {
  font-size: 45px;
}

.brand-content h1 {
  font-size: 34px;
  margin: 0 0 10px;
  font-weight: 700;
}

.english-title {
  font-size: 16px;
  opacity: 0.85;
  line-height: 24px;
}

.description {
  margin-top: 20px;
  font-size: 18px;
}

.feature-list {
  margin-top: 45px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.feature-card {
  display: flex;
  align-items: center;
  gap: 15px;
}

.feature-icon {
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.18);
}

.feature-card strong {
  display: block;
  font-size: 16px;
}

.feature-card span {
  display: block;
  margin-top: 4px;
  font-size: 13px;
  opacity: 0.8;
}

.data-panel {
  display: flex;
  gap: 35px;
  margin-top: 45px;
}

.data-panel div {
  display: flex;
  flex-direction: column;
}

.data-panel span {
  font-size: 26px;
  font-weight: bold;
}

.data-panel label {
  font-size: 12px;
  opacity: 0.8;
}

/* ===============================
   登录区域
=============================== */
.login-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
}

.login-content {
  width: 360px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  font-size: 28px;
  color: #1f2937;
  margin-bottom: 10px;
}

.login-header p {
  color: #94a3b8;
  font-size: 14px;
}

/* tabs */
.login-tabs {
  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }

  :deep(.el-tabs__item) {
    font-size: 15px;
  }

  /* 锁定 tab 内容区高度，切换时不再撑高卡片 */
  :deep(.el-tab-pane) {
    min-height: 410px;
  }
}

/* 输入框 */
.login-form {
  margin-top: 25px;
}

:deep(.el-input__wrapper) {
  height: 48px;
  border-radius: 12px;
  box-shadow: 0 0 0 1px #e5e7eb inset;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #409eff inset;
}

.sms-box {
  display: flex;
  gap: 12px;
  width: 100%;
}

.sms-button {
  width: 120px;
  height: 48px;
  border-radius: 12px;
}

.form-operate {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0 25px;
}

.login-button {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  border: none;
  background: linear-gradient(135deg, #1677ff, #00b7ff);
  transition: 0.3s;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 118, 255, 0.35);
}

/* ===============================
   第三方登录
=============================== */
.other-login {
  margin-top: 22px;
}

.divider {
  display: flex;
  align-items: center;
  color: #94a3b8;
  font-size: 12px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  padding: 0 12px;
}

.third-party {
  display: flex;
  justify-content: center;
  gap: 36px;
  margin-top: 14px;
}

.third-item {
  cursor: pointer;
  text-align: center;
  transition: 0.3s;
}

.third-item:hover {
  transform: translateY(-3px);
}

.third-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.third-icon svg {
  width: 28px;
  height: 28px;
}

.blue {
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
}

.green {
  background: linear-gradient(135deg, #22c55e, #14b8a6);
}

.third-item span {
  display: block;
  margin-top: 8px;
  color: #475569;
  font-size: 13px;
}

/* ===============================
   页脚
=============================== */
.footer {
  position: fixed;
  bottom: 20px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;
}

/* ===============================
   响应式
=============================== */
@media (max-width: 900px) {
  .login-card {
    width: auto;
    min-width: 480px;
    max-width: calc(100vw - 48px);
  }

  .brand-panel {
    display: none;
  }
}

/* 视口高度较小时压缩垂直留白，避免右侧内容被裁切 */
@media (max-height: 820px) {
  .login-card {
    min-height: 0;
  }

  .login-panel {
    padding: 20px 40px;
  }

  .login-header {
    margin-bottom: 16px;
  }

  .login-tabs :deep(.el-tab-pane) {
    min-height: auto;
  }

  .login-form {
    margin-top: 14px;
  }

  .other-login {
    margin-top: 14px;
  }
}
</style>