<template>
  <div class="client-management">
    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <span class="search-bar-title">客户端管理</span>
        <div class="search-bar-actions">
          <el-input
            v-model="searchForm.clientId"
            placeholder="搜索客户端ID"
            clearable
            :prefix-icon="Search"
            style="width: 180px; margin-right: 12px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增客户端</el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="clientId"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        empty-text=" "
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="clientId" label="客户端ID" min-width="140">
          <template #default="{ row }">
            <div class="code-cell">
              <span class="code-text">{{ row.clientId }}</span>
              <el-tooltip content="复制ID" placement="top">
                <el-button type="primary" link size="small" @click="handleCopy(row.clientId)">
                  <el-icon><CopyDocument /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="clientSecret" label="客户端密钥" min-width="150" align="center">
          <template #default="{ row }">
            <div class="secret-cell">
              <span class="secret-text">{{ showSecret[row.clientId] ? row.clientSecret : '••••••••' }}</span>
              <el-button type="primary" link size="small" @click="toggleSecret(row.clientId)">
                <el-icon><View v-if="!showSecret[row.clientId]" /><Hide v-else /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="域" min-width="120" align="center">
          <template #default="{ row }">
            <div class="tag-cell">
              <el-tag v-for="item in row.scope.split(',')" :key="item" size="small" type="info" class="scope-tag">
                {{ item }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="authorizedGrantTypes" label="授权类型" min-width="200">
          <template #default="{ row }">
            <div class="tag-cell">
              <el-tag
                v-for="item in row.authorizedGrantTypes.split(',')"
                :key="item"
                size="small"
                :type="getGrantTypeTag(item.trim())"
                class="grant-tag"
              >
                {{ item.trim() }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="accessTokenValidity" label="Token有效期" width="120" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ formatTime(row.accessTokenValidity) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="refreshTokenValidity" label="刷新令牌有效期" width="130" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ formatTime(row.refreshTokenValidity) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="autoApprove" label="自动放行" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.autoApprove === 'true' ? 'success' : 'info'" effect="plain" round size="small">
              {{ row.autoApprove === 'true' ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="webServerRedirectUri" label="重定向地址" min-width="180" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="uri-text">{{ row.webServerRedirectUri || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="240" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="View" @click="handleDetail(row)">详情</el-button>
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>

        <!-- 空状态插槽 -->
        <template #empty>
          <div class="empty-state">
            <el-icon :size="64" color="#DCDFE6"><Key /></el-icon>
            <p class="empty-title">暂无客户端数据</p>
            <p class="empty-desc">
              点击上方
              <el-button type="primary" link @click="handleAdd">"新增客户端"</el-button>
              按钮创建第一个客户端
            </p>
          </div>
        </template>
      </el-table>

      <!-- 分页 -->
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

    <!-- 新增抽屉 -->
    <el-drawer
      v-model="addDialogVisible"
      title="新增客户端"
      size="500px"
      direction="rtl"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form
        ref="addFormRef"
        :model="addFormData"
        :rules="formRules"
        label-width="130px"
        label-position="right"
        class="client-form"
      >
        <el-form-item label="客户端ID" prop="clientId">
          <el-input v-model="addFormData.clientId" placeholder="请输入客户端ID" maxlength="32" />
        </el-form-item>

        <el-form-item label="客户端密钥" prop="clientSecret">
          <el-input v-model="addFormData.clientSecret" placeholder="请输入客户端密钥" maxlength="256" show-password />
        </el-form-item>

        <el-form-item label="域" prop="scope">
          <el-input v-model="addFormData.scope" placeholder="如：all,server" maxlength="256" />
          <div class="form-tip">多个值用逗号分隔</div>
        </el-form-item>

        <el-form-item label="授权类型" prop="authorizedGrantTypes">
          <el-checkbox-group v-model="selectedGrantTypes">
            <el-checkbox label="authorization_code">authorization_code</el-checkbox>
            <el-checkbox label="refresh_token">refresh_token</el-checkbox>
            <el-checkbox label="implicit">implicit</el-checkbox>
            <el-checkbox label="client_credentials">client_credentials</el-checkbox>
            <el-checkbox label="mobile">mobile</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="重定向地址" prop="webServerRedirectUri">
          <el-input v-model="addFormData.webServerRedirectUri" placeholder="请输入重定向地址" maxlength="256" />
        </el-form-item>

        <el-form-item label="子系统列表" prop="subsystemIds">
          <el-select
            v-model="selectedSubsystemIds"
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="请选择子系统"
            style="width: 100%"
          >
            <el-option
              v-for="item in subsystemOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div class="form-tip">可多选，选择关联的子系统</div>
        </el-form-item>

        <el-form-item label="Token有效期(秒)" prop="accessTokenValidity">
          <el-input-number v-model="addFormData.accessTokenValidity" :min="0" :max="31536000" style="width: 200px" />
          <span class="form-tip-inline">默认3600秒（1小时）</span>
        </el-form-item>

        <el-form-item label="刷新令牌有效期(秒)" prop="refreshTokenValidity">
          <el-input-number v-model="addFormData.refreshTokenValidity" :min="0" :max="31536000" style="width: 200px" />
          <span class="form-tip-inline">默认86400秒（1天）</span>
        </el-form-item>

        <el-form-item label="自动放行" prop="autoApprove">
          <el-switch v-model="addFormData.autoApprove" active-value="true" inactive-value="false" />
        </el-form-item>

        <el-form-item label="令牌扩展字段" prop="additionalInformation">
          <el-input v-model="addFormData.additionalInformation" type="textarea" :rows="3" placeholder='如：{}' maxlength="4096" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleAddSubmit">确认创建</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="编辑客户端"
      size="500px"
      direction="rtl"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form
        ref="editFormRef"
        :model="editFormData"
        :rules="formRules"
        label-width="130px"
        label-position="right"
        class="client-form"
      >
        <el-form-item label="客户端ID" prop="clientId">
          <el-input v-model="editFormData.clientId" disabled maxlength="32" />
        </el-form-item>

        <el-form-item label="客户端密钥" prop="clientSecret">
          <el-input v-model="editFormData.clientSecret" placeholder="请输入客户端密钥" maxlength="256" show-password />
        </el-form-item>

        <el-form-item label="域" prop="scope">
          <el-input v-model="editFormData.scope" placeholder="如：all,server" maxlength="256" />
          <div class="form-tip">多个值用逗号分隔</div>
        </el-form-item>

        <el-form-item label="授权类型" prop="authorizedGrantTypes">
          <el-checkbox-group v-model="selectedGrantTypes">
            <el-checkbox label="authorization_code">authorization_code</el-checkbox>
            <el-checkbox label="refresh_token">refresh_token</el-checkbox>
            <el-checkbox label="implicit">implicit</el-checkbox>
            <el-checkbox label="client_credentials">client_credentials</el-checkbox>
            <el-checkbox label="mobile">mobile</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="重定向地址" prop="webServerRedirectUri">
          <el-input v-model="editFormData.webServerRedirectUri" placeholder="请输入重定向地址" maxlength="256" />
        </el-form-item>

        <el-form-item label="子系统列表" prop="subsystemIds">
          <el-select
            v-model="selectedSubsystemIds"
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="请选择子系统"
            style="width: 100%"
          >
            <el-option
              v-for="item in subsystemOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div class="form-tip">可多选，选择关联的子系统</div>
        </el-form-item>

        <el-form-item label="Token有效期(秒)" prop="accessTokenValidity">
          <el-input-number v-model="editFormData.accessTokenValidity" :min="0" :max="31536000" style="width: 200px" />
          <span class="form-tip-inline">默认3600秒（1小时）</span>
        </el-form-item>

        <el-form-item label="刷新令牌有效期(秒)" prop="refreshTokenValidity">
          <el-input-number v-model="editFormData.refreshTokenValidity" :min="0" :max="31536000" style="width: 200px" />
          <span class="form-tip-inline">默认86400秒（1天）</span>
        </el-form-item>

        <el-form-item label="自动放行" prop="autoApprove">
          <el-switch v-model="editFormData.autoApprove" active-value="true" inactive-value="false" />
        </el-form-item>

        <el-form-item label="令牌扩展字段" prop="additionalInformation">
          <el-input v-model="editFormData.additionalInformation" type="textarea" :rows="3" placeholder='如：{}' maxlength="4096" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleEditSubmit">保存修改</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 详情抽屉 -->
    <el-drawer
      v-model="detailVisible"
      title="客户端详情"
      size="500px"
      direction="rtl"
    >
      <div class="detail-content" v-if="detailData">
        <el-descriptions :column="1" border size="default">
          <el-descriptions-item label="客户端ID">
            <span class="code-text">{{ detailData.clientId }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="客户端密钥">
            <span class="code-text">{{ detailData.clientSecret }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="域">
            <el-tag v-for="item in detailData.scope.split(',')" :key="item" size="small" type="info" class="scope-tag">{{ item }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="授权类型">
            <div class="tag-cell">
              <el-tag
                v-for="item in detailData.authorizedGrantTypes.split(',')"
                :key="item"
                size="small"
                :type="getGrantTypeTag(item.trim())"
              >
                {{ item.trim() }}
              </el-tag>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="重定向地址">
            <span class="url-text">{{ detailData.webServerRedirectUri || '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="Token有效期">
            <span class="highlight-text">{{ formatTime(detailData.accessTokenValidity) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="刷新令牌有效期">
            <span class="highlight-text">{{ formatTime(detailData.refreshTokenValidity) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="自动放行">
            <el-tag :type="detailData.autoApprove === 'true' ? 'success' : 'info'" size="small">
              {{ detailData.autoApprove === 'true' ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="子系统列表">
            <div class="tag-cell" v-if="detailData.subsystemIds">
              <el-tag
                v-for="item in detailData.subsystemIds.split(',')"
                :key="item"
                size="small"
                type="primary"
                effect="plain"
              >
                {{ item }}
              </el-tag>
            </div>
            <span v-else class="empty-text">-</span>
          </el-descriptions-item>
          <el-descriptions-item label="扩展字段">
            <span class="code-block-text">{{ detailData.additionalInformation || '-' }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Search, Plus, Delete, Edit,
  CopyDocument, View, Hide, Key,
  InfoFilled, Lock, Connection
} from '@element-plus/icons-vue'
import type { OAuthClient, ClientSearchForm } from '@/types/admin/client'
import { mockClients } from '@/mock/admin/clientData'

// ── 状态 ──
const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref<OAuthClient[]>([])
const addDialogVisible = ref(false)
const drawerVisible = ref(false)
const detailVisible = ref(false)
const detailData = ref<OAuthClient | null>(null)
const addFormRef = ref<FormInstance>()
const editFormRef = ref<FormInstance>()

// 密码显示状态
const showSecret = ref<Record<string, boolean>>({})

const searchForm = reactive<ClientSearchForm>({
  clientId: '',
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
})

// 子系统选项
const subsystemOptions = [
  { label: 'EMERGENCY_WATCH - 应急值守管理', value: 'EMERGENCY_WATCH' },
  { label: 'EMERGENCY_PLAN - 应急预案管理', value: 'EMERGENCY_PLAN' },
  { label: 'EMERGENCY_EVENT - 应急事件管理', value: 'EMERGENCY_EVENT' },
  { label: 'EMERGENCY_DISPATCH - 应急指挥调度', value: 'EMERGENCY_DISPATCH' },
  { label: 'EMERGENCY_MATERIAL - 应急物资管理', value: 'EMERGENCY_MATERIAL' },
  { label: 'ASSIST_DECISION - 辅助决策', value: 'ASSIST_DECISION' },
  { label: 'DATA_FUSION - 数据融合', value: 'DATA_FUSION' },
  { label: 'COMPREHENSIVE_DISPLAY - 综合展示', value: 'COMPREHENSIVE_DISPLAY' },
  { label: 'FLOOD_INSPECTION - 汛期巡查', value: 'FLOOD_INSPECTION' },
  { label: 'SYSTEM - 后台管理', value: 'SYSTEM' },
]

// 子系统选择
const selectedSubsystemIds = ref<string[]>([])

const addFormData = reactive<OAuthClient>({
  clientId: '',
  clientSecret: '',
  scope: '',
  authorizedGrantTypes: '',
  webServerRedirectUri: '',
  subsystemIds: '',
  accessTokenValidity: 3600,
  refreshTokenValidity: 86400,
  additionalInformation: '{}',
  autoApprove: 'false',
})

const editFormData = reactive<OAuthClient>({
  clientId: '',
  clientSecret: '',
  scope: '',
  authorizedGrantTypes: '',
  webServerRedirectUri: '',
  subsystemIds: '',
  accessTokenValidity: 3600,
  refreshTokenValidity: 86400,
  additionalInformation: '{}',
  autoApprove: 'false',
})

// 授权类型选择
const selectedGrantTypes = ref<string[]>([])

// ── 表单验证规则 ──
const formRules: FormRules = {
  clientId: [
    { required: true, message: '请输入客户端ID', trigger: 'blur' },
    { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
  ],
  clientSecret: [
    { required: true, message: '请输入客户端密钥', trigger: 'blur' },
  ],
  scope: [
    { required: true, message: '请输入域', trigger: 'blur' },
  ],
  authorizedGrantTypes: [
    { required: true, message: '请选择授权类型', trigger: 'change' },
  ],
}

// ── 计算属性 ──
const filteredData = computed(() => {
  let data = tableData.value
  if (searchForm.clientId) {
    data = data.filter((item) =>
      item.clientId.toLowerCase().includes(searchForm.clientId.toLowerCase())
    )
  }
  return data
})

// ── 方法 ──
function fetchData() {
  loading.value = true
  setTimeout(() => {
    tableData.value = [...mockClients]
    pagination.total = mockClients.length
    loading.value = false
  }, 300)
}

function handleSearch() {
  pagination.page = 1
  fetchData()
}

function handleRefresh() {
  fetchData()
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handlePageChange(page: number) {
  pagination.page = page
}

function toggleSecret(clientId: string) {
  showSecret.value[clientId] = !showSecret.value[clientId]
}

function formatTime(seconds: number): string {
  if (seconds >= 86400) {
    const days = Math.floor(seconds / 86400)
    return `${days}天`
  }
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600)
    return `${hours}小时`
  }
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60)
    return `${minutes}分钟`
  }
  return `${seconds}秒`
}

function getGrantTypeTag(type: string) {
  const map: Record<string, string> = {
    authorization_code: '',
    refresh_token: 'success',
    implicit: 'warning',
    client_credentials: 'info',
    mobile: 'danger',
  }
  return (map[type] || 'info') as any
}

function handleDetail(row: OAuthClient) {
  detailData.value = row
  detailVisible.value = true
}

function handleAdd() {
  addFormData.clientId = ''
  addFormData.clientSecret = ''
  addFormData.scope = 'all,server'
  addFormData.authorizedGrantTypes = ''
  addFormData.webServerRedirectUri = ''
  addFormData.subsystemIds = ''
  addFormData.accessTokenValidity = 3600
  addFormData.refreshTokenValidity = 86400
  addFormData.additionalInformation = '{}'
  addFormData.autoApprove = 'false'
  selectedGrantTypes.value = ['authorization_code', 'refresh_token']
  selectedSubsystemIds.value = []
  addDialogVisible.value = true
}

function handleEdit(row: OAuthClient) {
  editFormData.clientId = row.clientId
  editFormData.clientSecret = row.clientSecret
  editFormData.scope = row.scope
  editFormData.authorizedGrantTypes = row.authorizedGrantTypes
  editFormData.webServerRedirectUri = row.webServerRedirectUri
  editFormData.subsystemIds = row.subsystemIds
  editFormData.accessTokenValidity = row.accessTokenValidity
  editFormData.refreshTokenValidity = row.refreshTokenValidity
  editFormData.additionalInformation = row.additionalInformation
  editFormData.autoApprove = row.autoApprove
  selectedGrantTypes.value = row.authorizedGrantTypes.split(',').map((t) => t.trim())
  selectedSubsystemIds.value = row.subsystemIds ? row.subsystemIds.split(',').map((t) => t.trim()) : []
  drawerVisible.value = true
}

function handleAddSubmit() {
  if (!addFormRef.value) return
  addFormRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      setTimeout(() => {
        addFormData.authorizedGrantTypes = selectedGrantTypes.value.join(',')
        addFormData.subsystemIds = selectedSubsystemIds.value.join(',')
        tableData.value.unshift({ ...addFormData })
        pagination.total++
        ElMessage.success('新增成功')
        addDialogVisible.value = false
        submitLoading.value = false
      }, 500)
    }
  })
}

function handleEditSubmit() {
  if (!editFormRef.value) return
  editFormRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      setTimeout(() => {
        editFormData.authorizedGrantTypes = selectedGrantTypes.value.join(',')
        editFormData.subsystemIds = selectedSubsystemIds.value.join(',')
        const index = tableData.value.findIndex((item) => item.clientId === editFormData.clientId)
        if (index !== -1) {
          tableData.value[index] = { ...editFormData }
        }
        ElMessage.success('编辑成功')
        drawerVisible.value = false
        submitLoading.value = false
      }, 500)
    }
  })
}

function resetForm() {
  addFormRef.value?.resetFields()
  editFormRef.value?.resetFields()
}

function handleDelete(row: OAuthClient) {
  ElMessageBox.confirm(
    `确定要删除客户端 "${row.clientId}" 吗？删除后将无法恢复。`,
    '确认删除',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    loading.value = true
    setTimeout(() => {
      tableData.value = tableData.value.filter((item) => item.clientId !== row.clientId)
      pagination.total--
      ElMessage.success('删除成功')
      loading.value = false
    }, 500)
  }).catch(() => {})
}

async function handleCopy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.warning('复制失败，请手动复制')
  }
}

// ── 初始化 ──
onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.client-management {
  padding: 0;
  background: linear-gradient(160deg, #F5F7FA 0%, #E8ECF1 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;

  // 入场动画
  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;

    &:nth-child(1) { animation-delay: 0.05s; }
  }

  // 搜索栏
  .search-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #ebeef5;
  }

  .search-bar-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }

  .search-bar-actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  // 表格卡片
  .table-card {
    border-radius: 12px;
    border: none;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-card__body) {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    :deep(.el-table) {
      border-radius: 8px;
      overflow: hidden;
      flex: 1;

      .el-table__row {
        transition: background-color 0.2s ease;
      }
    }

    .code-cell {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .code-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      color: #409EFF;
      font-size: 12px;
      background: #ECF5FF;
      padding: 3px 8px;
      border-radius: 4px;
    }

    .secret-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .secret-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      color: #606266;
      font-size: 12px;
      background: #F5F7FA;
      padding: 3px 8px;
      border-radius: 4px;
    }

    .tag-cell {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .scope-tag,
    .grant-tag {
      font-size: 11px;
    }

    .time-text {
      font-size: 13px;
      color: #606266;
    }

    // 空状态
    .empty-state {
      padding: 48px 0;

      .empty-title {
        font-size: 16px;
        color: #606266;
        margin: 16px 0 8px;
      }

      .empty-desc {
        font-size: 13px;
        color: #909399;
      }
    }
  }

  // 分页
  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }

  // 抽屉
  .drawer-footer {
    display: flex;
    justify-content: flex-end;
    padding: 16px 24px;
    border-top: 1px solid #EBEEF5;
  }

  // 详情内容
  .detail-content {
    .code-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      color: #409EFF;
      background: #ECF5FF;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 13px;
    }

    .scope-tag {
      margin-right: 4px;
    }

    .tag-cell {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .url-text {
      color: #409EFF;
      word-break: break-all;
      font-size: 13px;
    }

    .highlight-text {
      color: #E6A23C;
      font-weight: 600;
      font-size: 13px;
    }

    .code-block-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      background: #f5f7fa;
      color: #606266;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 12px;
      word-break: break-all;
      display: inline-block;
      max-width: 100%;
    }

    .empty-text {
      color: #C0C4CC;
      font-size: 13px;
    }
  }

  // 表单
  .client-form {
    .form-tip-inline {
      font-size: 12px;
      color: #909399;
      margin-left: 12px;
    }

    .form-tip {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
    }
  }
}
</style>

<style>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
