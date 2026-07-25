<template>
  <div class="login-container">
    <div class="login-wrapper">
      <!-- 左侧装饰区域 -->
      <div class="login-left">
        <div class="left-content">
          <div class="brand">
            <el-icon :size="48" color="#fff"><DataBoard /></el-icon>
            <h1>应急指挥调度平台</h1>
            <p>应急指挥调度管理平台</p>
          </div>
          <div class="features">
            <div class="feature-item">
              <el-icon><Lock /></el-icon>
              <span>安全可靠的权限控制</span>
            </div>
            <div class="feature-item">
              <el-icon><User /></el-icon>
              <span>灵活的组织架构管理</span>
            </div>
            <div class="feature-item">
              <el-icon><Document /></el-icon>
              <span>完善的日志审计功能</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-right">
        <div class="login-form-wrapper">
          <div class="form-header">
            <h2>欢迎登录</h2>
          </div>

          <!-- 登录方式切换 -->
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
                    :prefix-icon="User"
                    size="large"
                  />
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    v-model="passwordForm.password"
                    type="password"
                    placeholder="请输入密码"
                    :prefix-icon="Lock"
                    size="large"
                    show-password
                  />
                </el-form-item>
                <el-form-item prop="captcha">
                  <div class="captcha-row">
                    <el-input
                      v-model="passwordForm.captcha"
                      placeholder="请输入验证码"
                      :prefix-icon="CircleCheck"
                      size="large"
                      class="captcha-input"
                    />
                    <canvas
                      ref="captchaCanvasRef"
                      class="captcha-canvas"
                      width="120"
                      height="40"
                      @click="refreshCaptcha"
                    ></canvas>
                  </div>
                </el-form-item>
                <div class="form-options">
                  <el-checkbox v-model="rememberMe">记住我</el-checkbox>
                  <el-link type="primary" :underline="false" @click="goToForgotPassword">
                    忘记密码？
                  </el-link>
                </div>
                <el-button
                  type="primary"
                  size="large"
                  class="login-btn"
                  :loading="loading"
                  @click="handlePasswordLogin"
                >
                  登 录
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
                    :prefix-icon="Iphone"
                    size="large"
                  />
                </el-form-item>
                <el-form-item prop="code">
                  <div class="sms-row">
                    <el-input
                      v-model="smsForm.code"
                      placeholder="请输入验证码"
                      :prefix-icon="Message"
                      size="large"
                      class="sms-input"
                    />
                    <el-button
                      size="large"
                      :disabled="smsCooldown > 0"
                      @click="sendSmsCode"
                      class="sms-btn"
                    >
                      {{ smsCooldown > 0 ? `${smsCooldown}s` : '获取验证码' }}
                    </el-button>
                  </div>
                </el-form-item>
                <div class="form-options">
                  <el-checkbox v-model="rememberMe">记住我</el-checkbox>
                  <el-link type="primary" :underline="false" @click="goToForgotPassword">
                    忘记密码？
                  </el-link>
                </div>
                <el-button
                  type="primary"
                  size="large"
                  class="login-btn"
                  :loading="loading"
                  @click="handleSmsLogin"
                >
                  登 录
                </el-button>
              </el-form>
            </el-tab-pane>
          </el-tabs>

          <!-- 社交登录 -->
          <div class="social-login">
            <div class="divider">
              <span>其他登录方式</span>
            </div>
            <div class="social-icons">
              <div class="social-item" @click="handleSocialLogin('yuezhengyi')">
                <div class="social-icon yuezhengyi">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                <span>粤政易</span>
              </div>
              <div class="social-item" @click="handleSocialLogin('yueshengshi')">
                <div class="social-icon yueshengshi">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <span>粤省事</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  User,
  Lock,
  CircleCheck,
  Iphone,
  Message,
  DataBoard,
  OfficeBuilding,
  Location,
  ChatDotSquare,
  Document
} from '@element-plus/icons-vue'

const router = useRouter()

// 登录类型
const loginType = ref<'password' | 'sms'>('password')
const loading = ref(false)
const rememberMe = ref(false)
const smsCooldown = ref(0)
const captchaCanvasRef = ref<HTMLCanvasElement>()
let smsTimer: ReturnType<typeof setInterval> | null = null

// 生成固定验证码 1234
const refreshCaptcha = () => {
  nextTick(() => {
    drawCaptcha()
  })
}

// 绘制验证码到 Canvas
const drawCaptcha = () => {
  const canvas = captchaCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 背景
  ctx.fillStyle = '#f0f0f0'
  ctx.fillRect(0, 0, 120, 40)

  // 绘制干扰线
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = `rgb(${100 + Math.random() * 100}, ${100 + Math.random() * 100}, ${100 + Math.random() * 100})`
    ctx.beginPath()
    ctx.moveTo(Math.random() * 120, Math.random() * 40)
    ctx.lineTo(Math.random() * 120, Math.random() * 40)
    ctx.stroke()
  }

  // 绘制验证码文字 1234
  const chars = ['1', '2', '3', '4']
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12']
  chars.forEach((char, index) => {
    ctx.font = 'bold 24px Arial'
    ctx.fillStyle = colors[index]
    ctx.textBaseline = 'middle'
    ctx.fillText(char, 15 + index * 25, 20)
  })
}

// 密码登录表单
const passwordFormRef = ref<FormInstance>()
const passwordForm = reactive({
  username: 'admin',
  password: '123456',
  captcha: '1234'
})

// 短信登录表单
const smsFormRef = ref<FormInstance>()
const smsForm = reactive({
  phone: '13800138000',
  code: '123456'
})

// 表单校验规则
const passwordRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
}

const smsRules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度为6位', trigger: 'blur' }
  ]
}

// 发送短信验证码
const sendSmsCode = async () => {
  try {
    await smsFormRef.value?.validateField('phone')
    smsCooldown.value = 60
    smsTimer = setInterval(() => {
      smsCooldown.value--
      if (smsCooldown.value <= 0) {
        if (smsTimer) {
          clearInterval(smsTimer)
          smsTimer = null
        }
      }
    }, 1000)
    ElMessage.success('验证码已发送')
  } catch (error) {
    // 校验失败
  }
}

// 密码登录
const handlePasswordLogin = async () => {
  if (!passwordFormRef.value) return
  await passwordFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        ElMessage.success('登录成功')
        router.push('/org-select')
      }, 1500)
    }
  })
}

// 短信登录
const handleSmsLogin = async () => {
  if (!smsFormRef.value) return
  await smsFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        ElMessage.success('登录成功')
        router.push('/org-select')
      }, 1500)
    }
  })
}

// 社交登录
const handleSocialLogin = (type: string) => {
  ElMessage.info(`${type} 登录功能开发中...`)
}

// 跳转到忘记密码
const goToForgotPassword = () => {
  router.push('/forgot-password')
}

onMounted(() => {
  refreshCaptcha()
})

onUnmounted(() => {
  if (smsTimer) {
    clearInterval(smsTimer)
  }
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-wrapper {
  display: flex;
  width: 900px;
  min-height: 480px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.login-left {
  flex: 1;
  background: linear-gradient(135deg, #409EFF 0%, #66B1FF 100%);
  padding: 40px 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.left-content {
  color: #fff;
}

.brand {
  text-align: center;
  margin-bottom: 40px;
}

.brand h1 {
  font-size: 26px;
  font-weight: 600;
  margin: 12px 0 8px;
}

.brand p {
  font-size: 14px;
  opacity: 0.9;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  opacity: 0.9;
}

.feature-item .el-icon {
  font-size: 20px;
}

.login-right {
  flex: 1;
  padding: 40px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form-wrapper {
  width: 100%;
  max-width: 360px;
}

.form-header {
  text-align: center;
  margin-bottom: 24px;
}

.form-header h2 {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
}

.login-tabs {
  margin-bottom: 16px;
}

.login-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.login-tabs :deep(.el-tabs__item) {
  font-size: 14px;
}

.login-tabs :deep(.el-tab-pane) {
  min-height: 280px;
}

.login-form {
  margin-top: 16px;
}

.captcha-row {
  display: flex;
  gap: 12px;
  width: 100%;
}

.captcha-input {
  flex: 1;
}

.captcha-canvas {
  width: 120px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #dcdfe6;
}

.sms-row {
  display: flex;
  gap: 12px;
  width: 100%;
}

.sms-input {
  flex: 1;
}

.sms-btn {
  width: 120px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.login-btn {
  width: 100%;
}

/* 社交登录 */
.social-login {
  margin-top: 20px;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 16px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e4e7ed;
}

.divider span {
  padding: 0 12px;
  font-size: 12px;
  color: #909399;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 32px;
}

.social-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-item:hover {
  transform: translateY(-3px);
}

.social-item:hover .social-icon {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.social-item span {
  font-size: 12px;
  color: #606266;
}

.social-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: all 0.3s ease;
}

.social-icon svg {
  width: 26px;
  height: 26px;
}

.social-icon.yuezhengyi {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.social-icon.yueshengshi {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}
</style>
