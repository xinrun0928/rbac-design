<template>
  <div class="forgot-container">
    <div class="forgot-wrapper">
      <!-- 返回登录 -->
      <div class="back-login">
        <el-link type="primary" :underline="false" @click="goToLogin">
          <el-icon><ArrowLeft /></el-icon>
          返回登录
        </el-link>
      </div>

      <!-- 步骤条 -->
      <el-steps :active="currentStep" finish-status="success" class="steps-bar">
        <el-step title="验证账号" />
        <el-step title="验证身份" />
        <el-step title="设置密码" />
        <el-step title="完成" />
      </el-steps>

      <!-- 步骤内容 -->
      <div class="step-content">
        <!-- 步骤1: 验证账号 -->
        <div v-show="currentStep === 0" class="step-panel">
          <h3>验证账号</h3>
          <p class="step-desc">请输入您注册时使用的账号信息</p>
          <el-form
            ref="accountFormRef"
            :model="accountForm"
            :rules="accountRules"
            class="forgot-form"
          >
            <el-form-item prop="account">
              <el-input
                v-model="accountForm.account"
                placeholder="用户名/手机号/邮箱"
                :prefix-icon="User"
                size="large"
              />
            </el-form-item>
            <el-form-item prop="captcha">
              <div class="captcha-row">
                <el-input
                  v-model="accountForm.captcha"
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
            <el-button
              type="primary"
              size="large"
              class="next-btn"
              @click="handleNextStep1"
            >
              下一步
            </el-button>
          </el-form>
        </div>

        <!-- 步骤2: 验证身份 -->
        <div v-show="currentStep === 1" class="step-panel">
          <h3>验证身份</h3>
          <p class="step-desc">选择验证方式以确认您的身份</p>

          <!-- 验证方式选择 -->
          <el-radio-group v-model="verifyType" class="verify-options">
            <el-radio-button value="sms">
              <el-icon><Message /></el-icon>
              短信验证
            </el-radio-button>
            <el-radio-button value="email">
              <el-icon><Message /></el-icon>
              邮箱验证
            </el-radio-button>
          </el-radio-group>

          <!-- 短信验证 -->
          <el-form
            v-if="verifyType === 'sms'"
            ref="smsVerifyFormRef"
            :model="smsVerifyForm"
            :rules="smsVerifyRules"
            class="forgot-form"
          >
            <div class="phone-info">
              <el-icon><Iphone /></el-icon>
              <span>验证码将发送至：{{ maskPhone(smsVerifyForm.phone) }}</span>
            </div>
            <el-form-item prop="code">
              <div class="sms-row">
                <el-input
                  v-model="smsVerifyForm.code"
                  placeholder="请输入6位验证码"
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
            <div class="btn-group">
              <el-button size="large" @click="currentStep = 1">上一步</el-button>
              <el-button type="primary" size="large" @click="handleNextStep2">
                下一步
              </el-button>
            </div>
          </el-form>

          <!-- 邮箱验证 -->
          <el-form
            v-if="verifyType === 'email'"
            ref="emailVerifyFormRef"
            :model="emailVerifyForm"
            :rules="emailVerifyRules"
            class="forgot-form"
          >
            <div class="phone-info">
              <el-icon><Message /></el-icon>
              <span>验证码将发送至：{{ maskEmail(emailVerifyForm.email) }}</span>
            </div>
            <el-form-item prop="code">
              <div class="sms-row">
                <el-input
                  v-model="emailVerifyForm.code"
                  placeholder="请输入6位验证码"
                  :prefix-icon="Message"
                  size="large"
                  class="sms-input"
                />
                <el-button
                  size="large"
                  :disabled="emailCooldown > 0"
                  @click="sendEmailCode"
                  class="sms-btn"
                >
                  {{ emailCooldown > 0 ? `${emailCooldown}s` : '获取验证码' }}
                </el-button>
              </div>
            </el-form-item>
            <div class="btn-group">
              <el-button size="large" @click="currentStep = 0">上一步</el-button>
              <el-button type="primary" size="large" @click="handleNextStep2Email">
                下一步
              </el-button>
            </div>
          </el-form>
        </div>

        <!-- 步骤3: 设置密码 -->
        <div v-show="currentStep === 2" class="step-panel">
          <h3>设置密码</h3>
          <p class="step-desc">请设置新的登录密码</p>
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            class="forgot-form"
          >
            <el-form-item prop="password">
              <el-input
                v-model="passwordForm.password"
                type="password"
                placeholder="请设置新密码（6-20位）"
                :prefix-icon="Lock"
                size="large"
                show-password
              />
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                :prefix-icon="Lock"
                size="large"
                show-password
              />
            </el-form-item>
            <!-- 密码强度指示器 -->
            <div class="password-strength">
              <div class="strength-bar">
                <div
                  class="strength-item"
                  :class="{ active: passwordStrength >= 1 }"
                  :style="{ background: passwordStrength >= 1 ? getStrengthColor(1) : '' }"
                ></div>
                <div
                  class="strength-item"
                  :class="{ active: passwordStrength >= 2 }"
                  :style="{ background: passwordStrength >= 2 ? getStrengthColor(2) : '' }"
                ></div>
                <div
                  class="strength-item"
                  :class="{ active: passwordStrength >= 3 }"
                  :style="{ background: passwordStrength >= 3 ? getStrengthColor(3) : '' }"
                ></div>
              </div>
              <span class="strength-text" :style="{ color: getStrengthColor(passwordStrength) }">
                {{ strengthText }}
              </span>
            </div>
            <div class="btn-group">
              <el-button size="large" @click="currentStep = 1">上一步</el-button>
              <el-button type="primary" size="large" @click="handleNextStep3">
                下一步
              </el-button>
            </div>
          </el-form>
        </div>

        <!-- 步骤4: 完成 -->
        <div v-show="currentStep === 3" class="step-panel success-panel">
          <div class="success-icon">
            <el-icon :size="64" color="#67C23A"><CircleCheck /></el-icon>
          </div>
          <h3>密码修改成功</h3>
          <p class="step-desc">您的密码已成功重置，请使用新密码登录</p>
          <el-button
            type="primary"
            size="large"
            class="next-btn"
            @click="goToLogin"
          >
            立即登录
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  User,
  Lock,
  CircleCheck,
  Message,
  Iphone,
  ArrowLeft
} from '@element-plus/icons-vue'

const router = useRouter()

// 当前步骤
const currentStep = ref(0)
const captchaCanvasRef = ref<HTMLCanvasElement>()

// 步骤1: 账号表单
const accountFormRef = ref<FormInstance>()
const accountForm = reactive({
  account: '',
  captcha: ''
})

const accountRules: FormRules = {
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
}

// 步骤2: 验证表单
const verifyType = ref<'sms' | 'email'>('sms')
const smsCooldown = ref(0)
const emailCooldown = ref(0)
let smsTimer: ReturnType<typeof setInterval> | null = null
let emailTimer: ReturnType<typeof setInterval> | null = null

const smsVerifyFormRef = ref<FormInstance>()
const smsVerifyForm = reactive({
  phone: '13800138000',
  code: ''
})

const smsVerifyRules: FormRules = {
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度为6位', trigger: 'blur' }
  ]
}

const emailVerifyFormRef = ref<FormInstance>()
const emailVerifyForm = reactive({
  email: 'user@example.com',
  code: ''
})

const emailVerifyRules: FormRules = {
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度为6位', trigger: 'blur' }
  ]
}

// 步骤3: 密码表单
const passwordFormRef = ref<FormInstance>()
const passwordForm = reactive({
  password: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== passwordForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules: FormRules = {
  password: [
    { required: true, message: '请设置新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 密码强度计算
const passwordStrength = computed(() => {
  const pwd = passwordForm.password
  if (!pwd) return 0
  let strength = 0
  if (pwd.length >= 6) strength++
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
  if (/\d/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd)) strength++
  return strength
})

const strengthText = computed(() => {
  const texts = ['', '弱', '中', '强']
  return texts[passwordStrength.value]
})

const getStrengthColor = (level: number) => {
  const colors = ['', '#f56c6c', '#e6a23c', '#67c23a']
  return colors[level]
}

// 方法
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

const maskPhone = (phone: string) => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

const maskEmail = (email: string) => {
  const [name, domain] = email.split('@')
  return `${name.charAt(0)}***@${domain}`
}

const sendSmsCode = async () => {
  smsCooldown.value = 60
  smsTimer = setInterval(() => {
    smsCooldown.value--
    if (smsCooldown.value <= 0 && smsTimer) {
      clearInterval(smsTimer)
      smsTimer = null
    }
  }, 1000)
  ElMessage.success('验证码已发送')
}

const sendEmailCode = async () => {
  emailCooldown.value = 60
  emailTimer = setInterval(() => {
    emailCooldown.value--
    if (emailCooldown.value <= 0 && emailTimer) {
      clearInterval(emailTimer)
      emailTimer = null
    }
  }, 1000)
  ElMessage.success('验证码已发送')
}

const handleNextStep1 = async () => {
  if (!accountFormRef.value) return
  await accountFormRef.value.validate((valid) => {
    if (valid) {
      currentStep.value = 1
    }
  })
}

const handleNextStep2 = async () => {
  if (!smsVerifyFormRef.value) return
  await smsVerifyFormRef.value.validate((valid) => {
    if (valid) {
      currentStep.value = 2
    }
  })
}

const handleNextStep2Email = async () => {
  if (!emailVerifyFormRef.value) return
  await emailVerifyFormRef.value.validate((valid) => {
    if (valid) {
      currentStep.value = 2
    }
  })
}

const handleNextStep3 = async () => {
  if (!passwordFormRef.value) return
  await passwordFormRef.value.validate((valid) => {
    if (valid) {
      currentStep.value = 3
      ElMessage.success('密码修改成功')
    }
  })
}

const goToLogin = () => {
  router.push('/login')
}

onMounted(() => {
  refreshCaptcha()
})

onUnmounted(() => {
  if (smsTimer) clearInterval(smsTimer)
  if (emailTimer) clearInterval(emailTimer)
})
</script>

<style scoped>
.forgot-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.forgot-wrapper {
  width: 480px;
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.back-login {
  margin-bottom: 24px;
}

.steps-bar {
  margin-bottom: 40px;
}

.step-content {
  min-height: 300px;
}

.step-panel h3 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.step-desc {
  font-size: 14px;
  color: #909399;
  margin-bottom: 24px;
}

.forgot-form {
  margin-top: 20px;
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

.next-btn {
  width: 100%;
}

/* 验证方式 */
.verify-options {
  margin-bottom: 24px;
}

.verify-options :deep(.el-radio-button__inner) {
  display: flex;
  align-items: center;
  gap: 6px;
}

.phone-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #606266;
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

.btn-group {
  display: flex;
  gap: 12px;
}

.btn-group .el-button {
  flex: 1;
}

/* 密码强度 */
.password-strength {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.strength-bar {
  display: flex;
  gap: 4px;
}

.strength-item {
  width: 60px;
  height: 4px;
  background: #e4e7ed;
  border-radius: 2px;
  transition: background 0.3s;
}

.strength-text {
  font-size: 12px;
  font-weight: 500;
}

/* 成功页面 */
.success-panel {
  text-align: center;
  padding-top: 40px;
}

.success-icon {
  margin-bottom: 24px;
}

.success-panel h3 {
  margin-bottom: 12px;
}

.success-panel .next-btn {
  width: 200px;
  margin-top: 20px;
}
</style>
