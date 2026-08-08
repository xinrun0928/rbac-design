<template>
  <div class="meeting-list">
    <el-card class="table-card animate-item" shadow="never">
      <div class="search-bar">
        <span class="search-bar-title">会议列表</span>
        <div class="search-bar-actions">
          <el-button type="primary" @click="handleBookMeeting">预约会议</el-button>
          <el-button type="primary" @click="handleEnterMeeting">进入会议</el-button>
          <span class="sync-info">当前2000路 同步网关视频 2026年4月24日 09点20分</span>
          <el-button :icon="Refresh" circle @click="handleRefresh" />
          <ExportButton />
        </div>
      </div>

      <el-table
        :data="paginatedData"
        border
        stripe
        highlight-current-row
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column prop="topic" label="会议主题" min-width="160" align="center" show-overflow-tooltip />
        <el-table-column prop="type" label="会议类型" width="110" align="center" />
        <el-table-column prop="initiator" label="发起人" width="90" align="center" />
        <el-table-column prop="department" label="所属单位" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="startTime" label="开始时间" width="150" align="center" />
        <el-table-column label="会议状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '进行中' ? 'success' : 'info'" effect="plain" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="participants" label="参会单位" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <template v-if="row.status === '进行中'">
              <el-button type="primary" link size="small" @click="handleInvite(row)">邀请</el-button>
              <el-button type="primary" link size="small" @click="handleJoin(row)">加入</el-button>
              <el-button type="primary" link size="small" @click="handleEnter(row)">进入</el-button>
            </template>
            <template v-else>
              <el-button type="primary" link size="small" @click="handleDetail(row)">明细</el-button>
              <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 会议明细抽屉 -->
    <el-drawer
      v-model="detailDrawerVisible"
      title="会议明细"
      size="80%"
      direction="rtl"
      destroy-on-close
    >
      <div v-if="currentMeeting" class="meeting-detail">
        <div class="detail-left">
          <div class="detail-title">会议基本信息</div>
          <div class="detail-grid">
            <div class="detail-item"><span class="label">会议主题</span><span class="value">{{ currentMeeting.topic }}</span></div>
            <div class="detail-item"><span class="label">会议类型</span><span class="value">{{ currentMeeting.type }}</span></div>
            <div class="detail-item"><span class="label">发起人</span><span class="value">{{ currentMeeting.initiator }}</span></div>
            <div class="detail-item"><span class="label">发起单位</span><span class="value">{{ currentMeeting.department }}</span></div>
            <div class="detail-item"><span class="label">主持人</span><span class="value">{{ currentMeeting.host }}</span></div>
            <div class="detail-item"><span class="label">参会人员</span><span class="value">{{ currentMeeting.attendeeList }}</span></div>
            <div class="detail-item"><span class="label">参会单位</span><span class="value">{{ currentMeeting.participants }}</span></div>
            <div class="detail-item"><span class="label">开始时间</span><span class="value">{{ currentMeeting.startTime }}</span></div>
            <div class="detail-item"><span class="label">结束时间</span><span class="value">{{ currentMeeting.endTime }}</span></div>
            <div class="detail-item"><span class="label">会议时长</span><span class="value">{{ currentMeeting.duration }}</span></div>
            <div class="detail-item"><span class="label">会议状态</span><span class="value">{{ currentMeeting.status }}</span></div>
            <div class="detail-item"><span class="label">会议编号</span><span class="value">{{ currentMeeting.meetingNo }}</span></div>
            <div class="detail-item"><span class="label">会议平台</span><span class="value">{{ currentMeeting.platform }}</span></div>
            <div class="detail-item"><span class="label">会议地址</span><span class="value">{{ currentMeeting.meetingUrl }}</span></div>
            <div class="detail-item"><span class="label">入会密码</span><span class="value">{{ currentMeeting.meetingPassword }}</span></div>
            <div class="detail-item"><span class="label">是否录制</span><span class="value">{{ currentMeeting.isRecording }}</span></div>
            <div class="detail-item full"><span class="label">录制文件地址</span><span class="value">{{ currentMeeting.recordingUrl }}</span></div>
            <div class="detail-item"><span class="label">屏幕共享</span><span class="value">{{ currentMeeting.screenShare }}</span></div>
            <div class="detail-item"><span class="label">禁言控制</span><span class="value">{{ currentMeeting.muteControl }}</span></div>
            <div class="detail-item"><span class="label">会议纪要</span><span class="value">{{ currentMeeting.meetingSummary }}</span></div>
            <div class="detail-item"><span class="label">决策结论</span><span class="value">{{ currentMeeting.decision }}</span></div>
            <div class="detail-item"><span class="label">调度指令</span><span class="value">{{ currentMeeting.dispatchCommand }}</span></div>
            <div class="detail-item"><span class="label">关联事件</span><span class="value">{{ currentMeeting.relatedEvent }}</span></div>
            <div class="detail-item"><span class="label">关联预案</span><span class="value">{{ currentMeeting.relatedPlan }}</span></div>
            <div class="detail-item"><span class="label">参会人数</span><span class="value">{{ currentMeeting.attendeeCount }}</span></div>
            <div class="detail-item"><span class="label">在线人数峰值</span><span class="value">{{ currentMeeting.onlinePeak }}</span></div>
            <div class="detail-item"><span class="label">异常记录</span><span class="value">{{ currentMeeting.exceptionRecord }}</span></div>
            <div class="detail-item"><span class="label">创建时间</span><span class="value">{{ currentMeeting.createTime }}</span></div>
            <div class="detail-item"><span class="label">更新时间</span><span class="value">{{ currentMeeting.updateTime }}</span></div>
          </div>
        </div>
        <div class="detail-right">
          <div class="minutes-title">会议纪要 <el-icon><Document /></el-icon></div>
          <div class="minutes-content">{{ currentMeeting.minutesContent }}</div>
        </div>
      </div>
    </el-drawer>

    <!-- 预约会议抽屉 -->
    <el-drawer
      v-model="bookDrawerVisible"
      title="预约会议"
      size="50%"
      direction="rtl"
      destroy-on-close
      @closed="resetBookForm"
    >
      <el-form ref="bookFormRef" :model="bookFormData" :rules="bookFormRules" label-width="100px" label-position="right">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="会议主题" prop="topic">
              <el-input v-model="bookFormData.topic" placeholder="必填，不超过100字" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会议类型" prop="type">
              <el-input v-model="bookFormData.type" placeholder="应急指挥/调度会商/预警会商/风险研判" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发起人" prop="initiator">
              <el-input v-model="bookFormData.initiator" placeholder="姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发起单位" prop="department">
              <el-input v-model="bookFormData.department" placeholder="机构名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主持人" prop="host">
              <el-input v-model="bookFormData.host" placeholder="会议主持人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参会人员" prop="attendeeList">
              <el-input v-model="bookFormData.attendeeList" placeholder="多人（姓名列表）" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="参会单位" prop="participants">
              <el-input v-model="bookFormData.participants" placeholder="多单位（名称列表）" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-input v-model="bookFormData.startTime" placeholder="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-input v-model="bookFormData.endTime" placeholder="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会议时长" prop="duration">
              <el-input v-model="bookFormData.duration" placeholder="自动计算" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="会议状态" prop="status">
              <el-input v-model="bookFormData.status" placeholder="未开始/进行中/已结束/已取消" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会议编号" prop="meetingNo">
              <el-input v-model="bookFormData.meetingNo" placeholder="系统生成唯一标识" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="会议平台" prop="platform">
              <el-input v-model="bookFormData.platform" placeholder="应急指挥平台/第三方会议系统" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会议地址" prop="meetingUrl">
              <el-input v-model="bookFormData.meetingUrl" placeholder="URL或会议号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入会密码" prop="meetingPassword">
              <el-input v-model="bookFormData.meetingPassword" placeholder="可选" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入会申请" prop="joinApproval">
              <el-input v-model="bookFormData.joinApproval" placeholder="是/否" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否录制" prop="isRecording">
              <el-input v-model="bookFormData.isRecording" placeholder="是/否" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="录制文件地址" prop="recordingUrl">
              <el-input v-model="bookFormData.recordingUrl" placeholder="视频URL" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="屏幕共享" prop="screenShare">
              <el-input v-model="bookFormData.screenShare" placeholder="支持/不支持" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="禁言控制" prop="muteControl">
              <el-input v-model="bookFormData.muteControl" placeholder="支持/不支持" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="会议纪要" prop="meetingSummary">
              <el-input v-model="bookFormData.meetingSummary" placeholder="文本" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="决策结论" prop="decision">
              <el-input v-model="bookFormData.decision" placeholder="会中形成结论" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="调度指令" prop="dispatchCommand">
              <el-input v-model="bookFormData.dispatchCommand" placeholder="形成的指令" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联事件" prop="relatedEvent">
              <el-input v-model="bookFormData.relatedEvent" placeholder="事件名称或ID" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="关联预案" prop="relatedPlan">
              <el-input v-model="bookFormData.relatedPlan" placeholder="预案名称" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="bookDrawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitBook">确定</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 邀请参会抽屉 -->
    <el-drawer
      v-model="inviteDrawerVisible"
      title="邀请参会"
      size="50%"
      direction="rtl"
      destroy-on-close
      @closed="resetInviteForm"
    >
      <div class="invite-section">
        <div class="section-title">当前会议</div>
        <div class="meeting-info" v-if="inviteMeeting">
          <span class="info-item"><span class="label">会议主题：</span>{{ inviteMeeting.topic }}</span>
          <span class="info-item"><span class="label">会议状态：</span>{{ inviteMeeting.status }}</span>
        </div>
      </div>

      <div class="invite-section">
        <div class="section-title">邀请方式</div>
        <el-radio-group v-model="inviteMethod">
          <el-radio value="user">按人员邀请</el-radio>
          <el-radio value="department">按部门邀请</el-radio>
        </el-radio-group>
      </div>

      <div class="invite-section">
        <div class="section-title">选择邀请对象</div>
        <el-input
          v-model="inviteSearchKeyword"
          placeholder="搜索人员/部门"
          clearable
          :prefix-icon="Search"
          style="margin-bottom: 12px;"
        />
        <el-checkbox-group v-model="selectedInvitees">
          <div class="invitee-list" v-if="inviteMethod === 'user'">
            <div class="invitee-item" v-for="user in filteredInviteUsers" :key="user.id">
              <el-checkbox :value="user.id">
                <span class="user-name">{{ user.name }}</span>
                <span class="user-dept">{{ user.department }}</span>
                <span class="user-position">{{ user.position }}</span>
              </el-checkbox>
            </div>
          </div>
          <div class="invitee-list" v-else>
            <div class="invitee-item" v-for="dept in filteredInviteDepartments" :key="dept.id">
              <el-checkbox :value="dept.id">
                <span class="user-name">{{ dept.name }}</span>
                <span class="user-dept">{{ dept.memberCount }}人</span>
              </el-checkbox>
            </div>
          </div>
        </el-checkbox-group>
      </div>

      <div class="invite-section" v-if="selectedInvitees.length > 0">
        <div class="section-title">已选邀请对象 ({{ selectedInvitees.length }})</div>
        <div class="selected-tags">
          <el-tag
            v-for="item in selectedInviteeNames"
            :key="item"
            closable
            @close="removeInvitee(item)"
            style="margin: 0 8px 8px 0;"
          >
            {{ item }}
          </el-tag>
        </div>
      </div>

      <div class="invite-section">
        <el-input
          v-model="inviteMessage"
          type="textarea"
          :rows="3"
          placeholder="邀请备注（选填）"
        />
      </div>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="inviteDrawerVisible = false">取消</el-button>
          <el-button type="primary" :disabled="selectedInvitees.length === 0" @click="handleSubmitInvite">
            发送邀请 ({{ selectedInvitees.length }})
          </el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 加入会议对话框 -->
    <el-dialog
      v-model="joinDialogVisible"
      title="加入会议"
      width="480px"
      destroy-on-close
      @closed="resetJoinForm"
    >
      <div class="join-meeting-info" v-if="joinMeeting">
        <div class="join-info-item">
          <span class="label">会议主题</span>
          <span class="value">{{ joinMeeting.topic }}</span>
        </div>
        <div class="join-info-item">
          <span class="label">会议类型</span>
          <span class="value">{{ joinMeeting.type }}</span>
        </div>
        <div class="join-info-item">
          <span class="label">发起人</span>
          <span class="value">{{ joinMeeting.initiator }}</span>
        </div>
        <div class="join-info-item">
          <span class="label">会议状态</span>
          <span class="value">
            <el-tag type="success" effect="plain" size="small">{{ joinMeeting.status }}</el-tag>
          </span>
        </div>
        <div class="join-info-item">
          <span class="label">开始时间</span>
          <span class="value">{{ joinMeeting.startTime }}</span>
        </div>
        <div class="join-info-item">
          <span class="label">参会人数</span>
          <span class="value">{{ joinMeeting.attendeeCount }}人</span>
        </div>
      </div>

      <el-divider />

      <el-form :model="joinFormData" label-width="80px">
        <el-form-item label="您的姓名">
          <el-input v-model="joinFormData.name" placeholder="请输入您的姓名" />
        </el-form-item>
        <el-form-item label="所属单位">
          <el-input v-model="joinFormData.department" placeholder="请输入所属单位" />
        </el-form-item>
        <el-form-item label="入会密码" v-if="joinMeeting?.meetingPassword">
          <el-input v-model="joinFormData.password" type="password" placeholder="请输入入会密码" show-password />
        </el-form-item>
        <el-form-item label="入会方式">
          <el-radio-group v-model="joinFormData.joinType">
            <el-radio value="video">视频入会</el-radio>
            <el-radio value="audio">语音入会</el-radio>
            <el-radio value="silent">静音入会</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="joinDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitJoin">加入会议</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Refresh, Document, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import ExportButton from '@/components/ExportButton.vue'
import { meetingData } from '@/mock/dispatch/meetingData'
import type { Meeting } from '@/types/dispatch/meeting'

const router = useRouter()

interface InviteUser {
  id: string
  name: string
  department: string
  position: string
}

interface InviteDepartment {
  id: string
  name: string
  memberCount: number
}

const tableData = ref<Meeting[]>([...meetingData])
const detailDrawerVisible = ref(false)
const bookDrawerVisible = ref(false)
const inviteDrawerVisible = ref(false)
const joinDialogVisible = ref(false)
const currentMeeting = ref<Meeting | null>(null)
const inviteMeeting = ref<Meeting | null>(null)
const joinMeeting = ref<Meeting | null>(null)
const bookFormRef = ref<FormInstance>()

const inviteMethod = ref<'user' | 'department'>('user')
const inviteSearchKeyword = ref('')
const selectedInvitees = ref<string[]>([])
const inviteMessage = ref('')

const inviteUsers: InviteUser[] = [
  { id: '1', name: '张伟', department: '应急管理局', position: '局长' },
  { id: '2', name: '李强', department: '应急管理局', position: '副局长' },
  { id: '3', name: '王芳', department: '消防救援支队', position: '支队长' },
  { id: '4', name: '刘洋', department: '消防救援支队', position: '副支队长' },
  { id: '5', name: '陈静', department: '公安局', position: '指挥中心主任' },
  { id: '6', name: '赵明', department: '公安局', position: '副主任' },
  { id: '7', name: '周杰', department: '卫生健康委', position: '应急办主任' },
  { id: '8', name: '吴磊', department: '交通运输局', position: '应急处处长' },
  { id: '9', name: '郑涛', department: '自然资源局', position: '地质灾害处处长' },
  { id: '10', name: '孙丽', department: '气象局', position: '预报中心主任' }
]

const inviteDepartments: InviteDepartment[] = [
  { id: 'd1', name: '应急管理局', memberCount: 45 },
  { id: 'd2', name: '消防救援支队', memberCount: 120 },
  { id: 'd3', name: '公安局', memberCount: 85 },
  { id: 'd4', name: '卫生健康委', memberCount: 32 },
  { id: 'd5', name: '交通运输局', memberCount: 28 },
  { id: 'd6', name: '自然资源局', memberCount: 18 },
  { id: 'd7', name: '气象局', memberCount: 15 }
]

const filteredInviteUsers = computed(() => {
  if (!inviteSearchKeyword.value) return inviteUsers
  const keyword = inviteSearchKeyword.value.toLowerCase()
  return inviteUsers.filter(
    u => u.name.includes(keyword) || u.department.includes(keyword) || u.position.includes(keyword)
  )
})

const filteredInviteDepartments = computed(() => {
  if (!inviteSearchKeyword.value) return inviteDepartments
  const keyword = inviteSearchKeyword.value.toLowerCase()
  return inviteDepartments.filter(d => d.name.includes(keyword))
})

const selectedInviteeNames = computed(() => {
  if (inviteMethod.value === 'user') {
    return inviteUsers.filter(u => selectedInvitees.value.includes(u.id)).map(u => u.name)
  }
  return inviteDepartments.filter(d => selectedInvitees.value.includes(d.id)).map(d => d.name)
})

const removeInvitee = (name: string) => {
  if (inviteMethod.value === 'user') {
    const user = inviteUsers.find(u => u.name === name)
    if (user) selectedInvitees.value = selectedInvitees.value.filter(id => id !== user.id)
  } else {
    const dept = inviteDepartments.find(d => d.name === name)
    if (dept) selectedInvitees.value = selectedInvitees.value.filter(id => id !== dept.id)
  }
}

const joinFormData = reactive({
  name: '',
  department: '',
  password: '',
  joinType: 'video'
})

const bookFormData = reactive({
  topic: '', type: '', initiator: '', department: '', host: '',
  attendeeList: '', participants: '', startTime: '', endTime: '',
  duration: '', status: '', meetingNo: '', platform: '', meetingUrl: '',
  meetingPassword: '', joinApproval: '', isRecording: '', recordingUrl: '',
  screenShare: '', muteControl: '', meetingSummary: '', decision: '',
  dispatchCommand: '', relatedEvent: '', relatedPlan: ''
})

const bookFormRules: FormRules = {
  topic: [{ required: true, message: '请输入会议主题', trigger: 'blur' }],
  type: [{ required: true, message: '请输入会议类型', trigger: 'blur' }],
  initiator: [{ required: true, message: '请输入发起人', trigger: 'blur' }]
}

const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const paginatedData = computed(() => {
  pagination.total = tableData.value.length
  const start = (pagination.page - 1) * pagination.pageSize
  return tableData.value.slice(start, start + pagination.pageSize)
})

const handleSizeChange = (size: number) => { pagination.pageSize = size; pagination.page = 1 }
const handlePageChange = (page: number) => { pagination.page = page }
const handleRefresh = () => { ElMessage.success('刷新成功') }

const handleBookMeeting = () => {
  bookDrawerVisible.value = true
}

const handleEnterMeeting = () => {
  router.push('/dispatch/meeting/room')
}

const handleInvite = (row: Meeting) => {
  inviteMeeting.value = row
  inviteDrawerVisible.value = true
}

const handleJoin = (row: Meeting) => {
  joinMeeting.value = row
  joinDialogVisible.value = true
}

const handleEnter = (row: Meeting) => {
  router.push({
    path: '/dispatch/meeting/room',
    query: { id: row.id, topic: row.topic }
  })
}

const handleDetail = (row: Meeting) => {
  currentMeeting.value = row
  detailDrawerVisible.value = true
}

const handleDelete = (row: Meeting) => {
  ElMessageBox.confirm(`确定要删除会议"${row.topic}"吗？`, '删除确认', {
    type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消'
  }).then(() => {
    tableData.value = tableData.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleSubmitBook = () => {
  bookFormRef.value?.validate(valid => {
    if (valid) {
      ElMessage.success('预约会议成功')
      bookDrawerVisible.value = false
    }
  })
}

const resetBookForm = () => {
  bookFormRef.value?.resetFields()
  Object.assign(bookFormData, {
    topic: '', type: '', initiator: '', department: '', host: '',
    attendeeList: '', participants: '', startTime: '', endTime: '',
    duration: '', status: '', meetingNo: '', platform: '', meetingUrl: '',
    meetingPassword: '', joinApproval: '', isRecording: '', recordingUrl: '',
    screenShare: '', muteControl: '', meetingSummary: '', decision: '',
    dispatchCommand: '', relatedEvent: '', relatedPlan: ''
  })
}

const handleSubmitInvite = () => {
  const count = selectedInvitees.value.length
  const method = inviteMethod.value === 'user' ? '人员' : '部门'
  ElMessage.success(`已成功邀请 ${count} 个${method}`)
  inviteDrawerVisible.value = false
}

const resetInviteForm = () => {
  inviteMethod.value = 'user'
  inviteSearchKeyword.value = ''
  selectedInvitees.value = []
  inviteMessage.value = ''
}

const handleSubmitJoin = () => {
  if (!joinFormData.name) {
    ElMessage.warning('请输入您的姓名')
    return
  }
  if (!joinFormData.department) {
    ElMessage.warning('请输入所属单位')
    return
  }
  if (joinMeeting.value?.meetingPassword && !joinFormData.password) {
    ElMessage.warning('请输入入会密码')
    return
  }
  ElMessage.success(`已成功加入会议：${joinMeeting.value?.topic}`)
  joinDialogVisible.value = false
}

const resetJoinForm = () => {
  joinFormData.name = ''
  joinFormData.department = ''
  joinFormData.password = ''
  joinFormData.joinType = 'video'
}
</script>

<style lang="scss" scoped>
.meeting-list {
  padding: 0;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;

  .animate-item { animation: fadeInUp 0.5s ease forwards; opacity: 0; }

  .table-card {
    border-radius: 12px;
    border: none;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-card__body) { padding: 20px; display: flex; flex-direction: column; flex: 1; overflow: hidden; }

    .search-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #ebeef5;
    }

    .search-bar-title { font-size: 16px; font-weight: 600; color: #303133; }

    .search-bar-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }

    .sync-info { font-size: 13px; color: #909399; }

    .data-table { flex: 1; }
  }

  .pagination-wrapper { display: flex; justify-content: flex-end; margin-top: 16px; flex-shrink: 0; }
}

.meeting-detail {
  display: flex;
  gap: 24px;
  height: 100%;

  .detail-left {
    flex: 1;
    overflow-y: auto;

    .detail-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #ebeef5;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;

      .detail-item {
        display: flex;
        padding: 12px 0;
        border-bottom: 1px solid #f5f7fa;

        &.full { grid-column: span 2; }

        .label {
          width: 120px;
          flex-shrink: 0;
          color: #909399;
          font-size: 14px;
        }

        .value {
          flex: 1;
          color: #303133;
          font-size: 14px;
          word-break: break-all;
        }
      }
    }
  }

  .detail-right {
    flex: 1;
    border-left: 1px solid #ebeef5;
    padding-left: 24px;
    overflow-y: auto;

    .minutes-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .minutes-content {
      font-size: 14px;
      color: #606266;
      line-height: 1.8;
      white-space: pre-wrap;
    }
  }
}

.drawer-footer { display: flex; justify-content: flex-end; padding-top: 16px; }

.invite-section {
  margin-bottom: 24px;

  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 12px;
  }

  .meeting-info {
    background: #f5f7fa;
    padding: 12px 16px;
    border-radius: 8px;
    display: flex;
    gap: 24px;

    .info-item {
      font-size: 14px;
      color: #606266;

      .label {
        color: #909399;
      }
    }
  }
}

.invitee-list {
  max-height: 240px;
  overflow-y: auto;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: #fff;

  .invitee-item {
    padding: 8px 12px;
    border-bottom: 1px solid #f5f7fa;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: #f5f7fa;
    }

    .user-name {
      font-weight: 500;
      margin-right: 12px;
    }

    .user-dept {
      color: #909399;
      font-size: 13px;
      margin-right: 12px;
    }

    .user-position {
      color: #909399;
      font-size: 13px;
    }
  }
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  padding: 8px 0;
}

.join-meeting-info {
  .join-info-item {
    display: flex;
    align-items: center;
    padding: 8px 0;

    .label {
      width: 80px;
      color: #909399;
      font-size: 14px;
    }

    .value {
      flex: 1;
      color: #303133;
      font-size: 14px;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
