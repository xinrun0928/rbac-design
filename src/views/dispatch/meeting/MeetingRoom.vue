<template>
  <div class="meeting-room">
    <div class="room-header">
      <div class="header-content">
        <h1 class="meeting-title">{{ meetingInfo.topic }}</h1>
        <p class="meeting-desc">完整展示会议画面、会中成员、会议交流、视频添加、人员邀请、会议权限配置和主持人工具。</p>
      </div>
      <div class="header-actions">
        <el-button @click="handleBack">返回会议列表</el-button>
        <el-button type="danger" @click="handleEndMeeting">结束会议</el-button>
      </div>
    </div>

    <div class="meeting-info-bar">
      <div class="info-left">
        <span class="info-topic">{{ meetingInfo.topic }}</span>
        <el-tag type="success" effect="dark" size="small">会议中</el-tag>
        <el-tag effect="plain" size="small">{{ meetingInfo.meetingNo }}</el-tag>
      </div>
      <div class="info-right">
        <span>已进行 <strong>{{ meetingDuration }}</strong></span>
        <span class="divider">|</span>
        <span>成员 <strong>{{ participants.length }}</strong></span>
        <span class="divider">|</span>
        <el-link type="primary" :underline="false">主持人工具</el-link>
        <span class="divider">|</span>
        <el-link type="primary" :underline="false">设置</el-link>
      </div>
    </div>

    <div class="video-section">
      <div class="video-grid">
        <div class="video-item main-speaker" v-for="p in mainSpeakers" :key="p.id">
          <div class="video-placeholder" :style="{ backgroundColor: p.bgColor }">
            <img v-if="p.hasVideo" :src="p.videoUrl" :alt="p.name" class="video-image" />
            <div v-else class="video-avatar">
              <el-icon :size="48"><User /></el-icon>
            </div>
            <div class="video-overlay">
              <span class="speaker-name">{{ p.name }}</span>
              <span v-if="p.isSpeaking" class="speaking-indicator">
                <el-icon><Microphone /></el-icon>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="control-bar">
      <div class="control-item" @click="toggleMute">
        <div class="control-icon" :class="{ active: isMuted }">
          <el-icon><Microphone /></el-icon>
        </div>
        <span>{{ isMuted ? '解除静音' : '静音' }}</span>
      </div>
      <div class="control-item" @click="toggleCamera">
        <div class="control-icon" :class="{ active: isCameraOff }">
          <el-icon><VideoCamera /></el-icon>
        </div>
        <span>{{ isCameraOff ? '开启视频' : '关闭视频' }}</span>
      </div>
      <div class="control-item" @click="handleAddVideo">
        <div class="control-icon">
          <el-icon><Plus /></el-icon>
        </div>
        <span>视频添加</span>
      </div>
      <div class="control-item" @click="toggleScreenShare">
        <div class="control-icon" :class="{ active: isScreenSharing }">
          <el-icon><Monitor /></el-icon>
        </div>
        <span>{{ isScreenSharing ? '停止共享' : '共享屏幕' }}</span>
      </div>
      <div class="control-item" @click="handleInvite">
        <div class="control-icon">
          <el-icon><User /></el-icon>
        </div>
        <span>人员邀请</span>
      </div>
      <div class="control-item" @click="showMembers = true">
        <div class="control-icon">
          <el-icon><Connection /></el-icon>
        </div>
        <span>成员({{ participants.length }})</span>
      </div>
      <div class="control-item" @click="showChat = true">
        <div class="control-icon">
          <el-icon><ChatDotRound /></el-icon>
        </div>
        <span>会议交流</span>
      </div>
      <div class="control-item" @click="toggleRecording">
        <div class="control-icon" :class="{ recording: isRecording }">
          <el-icon><VideoCameraFilled /></el-icon>
        </div>
        <span>{{ isRecording ? '停止录制' : '录制' }}</span>
      </div>
      <div class="control-item" @click="handlePermission">
        <div class="control-icon">
          <el-icon><Lock /></el-icon>
        </div>
        <span>会议权限配置</span>
      </div>
      <div class="control-item danger" @click="handleEndMeeting">
        <div class="control-icon danger-icon">
          <el-icon><Close /></el-icon>
        </div>
        <span>结束会议</span>
      </div>
    </div>

    <div class="bottom-section">
      <div class="members-section">
        <div class="section-header">
          <span class="section-title">会议中成员</span>
          <div class="join-buttons">
            <el-button type="primary" size="small">
              <el-icon><Plus /></el-icon> 监控视频入会
              <el-badge :value="1" class="badge" />
            </el-button>
            <el-button type="primary" size="small">
              <el-icon><Plus /></el-icon> 会议视频入会
              <el-badge :value="2" class="badge" />
            </el-button>
            <el-button type="primary" size="small">
              <el-icon><Plus /></el-icon> 语音入会
              <el-badge :value="3" class="badge" />
            </el-button>
            <el-button type="primary" size="small">
              <el-icon><Plus /></el-icon> 电话入会
              <el-badge :value="4" class="badge" />
            </el-button>
          </div>
          <div class="section-actions">
            <el-link type="primary" :underline="false">申请入会单位审核</el-link>
            <el-button text type="primary">成员管理</el-button>
          </div>
        </div>
        <el-table :data="participants" border stripe size="small" class="member-table"
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', textAlign: 'center' }">
          <el-table-column prop="name" label="参会人" min-width="120" align="center" />
          <el-table-column prop="department" label="单位" min-width="180" align="center" show-overflow-tooltip />
          <el-table-column prop="terminal" label="终端" width="120" align="center" />
          <el-table-column label="在线状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.isOnline ? 'success' : 'info'" size="small" effect="plain">
                {{ row.isOnline ? '在线' : '离线' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="joinTime" label="入会时间" width="140" align="center" />
          <el-table-column label="主持人操作" width="150" align="center">
            <template #default="{ row }">
              <el-button type="primary" link size="small">设为静音</el-button>
              <el-button type="danger" link size="small">移出</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="chat-section">
        <div class="chat-header">
          <span class="chat-title">会议交流</span>
        </div>
        <div class="chat-messages">
          <div class="chat-message host">
            <div class="message-header">
              <span class="sender">主持人 张文涛</span>
            </div>
            <div class="message-content">请各单位确认当前路段积水点和处置力量到位情况。</div>
          </div>
          <div class="chat-message">
            <div class="message-header">
              <span class="sender">广州交通运行监测中心 陈佳</span>
            </div>
            <div class="message-content">广州北环监测正常，重点风险点已同步。</div>
          </div>
          <div class="chat-message">
            <div class="message-header">
              <span class="sender">深圳应急管理局 王伟</span>
            </div>
            <div class="message-content">深圳地区已启动三级响应，各站点人员已到位。</div>
          </div>
        </div>
        <div class="chat-input">
          <el-input v-model="chatInput" placeholder="输入消息..." @keyup.enter="sendMessage">
            <template #append>
              <el-button :icon="Promotion" @click="sendMessage" />
            </template>
          </el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User, Microphone, VideoCamera, Plus, Monitor, Connection,
  ChatDotRound, VideoCameraFilled, Lock, Close, Promotion
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const meetingInfo = reactive({
  id: route.query.id as string || '1',
  topic: (route.query.topic as string) || 'G4高速事故紧急会商',
  meetingNo: 'MT20260511001',
  status: '进行中'
})

const meetingDuration = ref('00:05:32')
const isMuted = ref(false)
const isCameraOff = ref(false)
const isScreenSharing = ref(false)
const isRecording = ref(false)
const showMembers = ref(false)
const showChat = ref(false)
const chatInput = ref('')

interface Participant {
  id: string
  name: string
  department: string
  terminal: string
  isOnline: boolean
  isSpeaking: boolean
  joinTime: string
  hasVideo: boolean
  videoUrl: string
  bgColor: string
}

const mainSpeakers = ref([
  { id: '1', name: '周建超', hasVideo: true, videoUrl: '', bgColor: '#1e40af', isSpeaking: true },
  { id: '2', name: '柳州市应急管理局', hasVideo: true, videoUrl: '', bgColor: '#1e3a5f', isSpeaking: false },
  { id: '3', name: '武汉市应急管理局', hasVideo: true, videoUrl: '', bgColor: '#2d4a7a', isSpeaking: false },
  { id: '4', name: '公安应急管理局(201)', hasVideo: true, videoUrl: '', bgColor: '#1a365d', isSpeaking: false },
  { id: '5', name: '洪湖市应急管理局(308)', hasVideo: true, videoUrl: '', bgColor: '#1e3a5f', isSpeaking: false },
  { id: '6', name: '大庆应急管理局(主会)', hasVideo: true, videoUrl: '', bgColor: '#2d4a7a', isSpeaking: false },
  { id: '7', name: '石首应急管理局(主会)', hasVideo: true, videoUrl: '', bgColor: '#1a365d', isSpeaking: false },
  { id: '8', name: '毛区应急管理局(主会)', hasVideo: true, videoUrl: '', bgColor: '#1e3a5f', isSpeaking: false },
])

const participants = ref<Participant[]>([
  { id: '1', name: '张文涛', department: '应急管理局', terminal: '视频终端', isOnline: true, isSpeaking: true, joinTime: '09:00', hasVideo: true, videoUrl: '', bgColor: '#409EFF' },
  { id: '2', name: '陈佳', department: '广州交通运行监测中心', terminal: '会议终端', isOnline: true, isSpeaking: false, joinTime: '09:01', hasVideo: true, videoUrl: '', bgColor: '#67C23A' },
  { id: '3', name: '王伟', department: '深圳应急管理局', terminal: '视频终端', isOnline: true, isSpeaking: false, joinTime: '09:02', hasVideo: true, videoUrl: '', bgColor: '#E6A23C' },
  { id: '4', name: '李明', department: '佛山交通局', terminal: '语音终端', isOnline: true, isSpeaking: false, joinTime: '09:03', hasVideo: false, videoUrl: '', bgColor: '#F56C6C' },
])

let timer: ReturnType<typeof setInterval> | null = null

const updateTime = () => {
  const parts = meetingDuration.value.split(':').map(Number)
  let [hours, minutes, seconds] = parts
  seconds++
  if (seconds >= 60) { seconds = 0; minutes++ }
  if (minutes >= 60) { minutes = 0; hours++ }
  meetingDuration.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  ElMessage.info(isMuted.value ? '已静音' : '已取消静音')
}

const toggleCamera = () => {
  isCameraOff.value = !isCameraOff.value
  ElMessage.info(isCameraOff.value ? '摄像头已关闭' : '摄像头已开启')
}

const toggleScreenShare = () => {
  isScreenSharing.value = !isScreenSharing.value
  ElMessage.info(isScreenSharing.value ? '已开始屏幕共享' : '已停止屏幕共享')
}

const toggleRecording = () => {
  isRecording.value = !isRecording.value
  ElMessage.info(isRecording.value ? '录制已开始' : '录制已停止')
}

const handleAddVideo = () => {
  ElMessage.info('添加视频源')
}

const handleInvite = () => {
  ElMessage.info('邀请参会人员')
}

const handlePermission = () => {
  ElMessage.info('会议权限配置')
}

const handleBack = () => {
  ElMessageBox.confirm('确定要离开会议吗？', '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    router.push('/dispatch/meeting')
  }).catch(() => {})
}

const handleEndMeeting = () => {
  ElMessageBox.confirm('确定要结束会议吗？此操作将结束所有参会者的会议。', '结束会议', {
    type: 'error',
    confirmButtonText: '结束会议',
    cancelButtonText: '取消'
  }).then(() => {
    ElMessage.success('会议已结束')
    router.push('/dispatch/meeting')
  }).catch(() => {})
}

const sendMessage = () => {
  if (!chatInput.value.trim()) return
  ElMessage.success('消息已发送')
  chatInput.value = ''
}

onMounted(() => {
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style lang="scss" scoped>
.meeting-room {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
  overflow: hidden;
}

.room-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;

  .header-content {
    flex: 1;

    .meeting-title {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 4px 0;
    }

    .meeting-desc {
      font-size: 13px;
      color: #8c8c8c;
      margin: 0;
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.meeting-info-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;

  .info-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .info-topic {
      font-size: 14px;
      font-weight: 500;
      color: #1a1a1a;
    }
  }

  .info-right {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: #595959;

    .divider {
      color: #d9d9d9;
    }

    strong {
      color: #1a1a1a;
    }
  }
}

.video-section {
  flex: 1;
  padding: 16px;
  overflow: hidden;

  .video-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 8px;
    height: 100%;
    background: #000;
    border-radius: 8px;
    overflow: hidden;

    .video-item {
      position: relative;
      background: #1a1a2e;
      overflow: hidden;

      &.main-speaker {
        .video-placeholder {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%);
        }
      }

      .video-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        .video-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.6);
        }

        .video-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 8px 12px;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          display: flex;
          align-items: center;
          justify-content: space-between;

          .speaker-name {
            font-size: 12px;
            color: #fff;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
          }

          .speaking-indicator {
            color: #52c41a;
            animation: pulse 1.5s infinite;
          }
        }
      }
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.control-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 12px 24px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;

  .control-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      .control-icon {
        background: #f0f0f0;
      }
    }

    .control-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: #595959;
      transition: all 0.2s;

      &.active {
        background: #e6f7ff;
        color: #1890ff;
      }

      &.recording {
        background: #fff1f0;
        color: #ff4d4f;
        animation: pulse 1.5s infinite;
      }

      &.danger-icon {
        background: #fff1f0;
        color: #ff4d4f;
      }
    }

    span {
      font-size: 12px;
      color: #595959;
    }

    &.danger span {
      color: #ff4d4f;
    }
  }
}

.bottom-section {
  display: flex;
  height: 280px;
  border-top: 1px solid #e8e8e8;
  background: #fff;

  .members-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e8e8e8;
    overflow: hidden;

    .section-header {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #e8e8e8;
      gap: 16px;

      .section-title {
        font-size: 14px;
        font-weight: 500;
        color: #1a1a1a;
        white-space: nowrap;
      }

      .join-buttons {
        display: flex;
        gap: 8px;
        flex: 1;

        .el-button {
          position: relative;

          .badge {
            position: absolute;
            top: -4px;
            right: -4px;
          }
        }
      }

      .section-actions {
        display: flex;
        align-items: center;
        gap: 16px;
        white-space: nowrap;
      }
    }

    .member-table {
      flex: 1;
      overflow: auto;
    }
  }

  .chat-section {
    width: 320px;
    display: flex;
    flex-direction: column;

    .chat-header {
      padding: 12px 16px;
      border-bottom: 1px solid #e8e8e8;

      .chat-title {
        font-size: 14px;
        font-weight: 500;
        color: #1a1a1a;
      }
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;

      .chat-message {
        margin-bottom: 16px;

        &.host {
          .message-header .sender {
            color: #1890ff;
          }
        }

        .message-header {
          margin-bottom: 4px;

          .sender {
            font-size: 13px;
            font-weight: 500;
            color: #595959;
          }
        }

        .message-content {
          font-size: 13px;
          color: #262626;
          line-height: 1.6;
          padding: 8px 12px;
          background: #f5f5f5;
          border-radius: 4px;
        }
      }
    }

    .chat-input {
      padding: 12px;
      border-top: 1px solid #e8e8e8;
    }
  }
}
</style>
