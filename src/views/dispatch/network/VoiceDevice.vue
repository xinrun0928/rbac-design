<template>
  <div class="voice-device-management">
    <el-card class="table-card animate-item" shadow="never">
      <div class="search-bar">
        <span class="search-bar-title">语音设备管理</span>
        <div class="search-bar-actions">
          <el-button type="primary" @click="handleAdd">添加设备</el-button>
          <span class="sync-info">当前2000台 同步网关视频 2026年4月24日 09点20分</span>
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
        <el-table-column prop="deviceName" label="设备名称" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="deviceType" label="设备类型" width="110" align="center" />
        <el-table-column prop="department" label="所属单位" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column label="设备状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.deviceStatus === '在线' ? 'success' : row.deviceStatus === '故障' ? 'danger' : 'info'" effect="plain" size="small">
              {{ row.deviceStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="installLocation" label="安装位置" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column prop="coverageRange" label="覆盖范围" width="110" align="center" />
        <el-table-column prop="deviceCount" label="设备数量" width="100" align="center" />
        <el-table-column label="操作" width="240" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleBindVoice(row)">绑定语音</el-button>
            <el-button type="primary" link size="small" @click="handleAutoMatch(row)">自动匹配</el-button>
            <el-button type="primary" link size="small" @click="handleDetail(row)">详情</el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)">修改</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
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

    <!-- 添加/编辑设备抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="isEdit ? '修改设备' : '添加设备'"
      size="50%"
      direction="rtl"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="formData.deviceName" placeholder="必填，不超过100字" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备类型" prop="deviceType">
              <el-input v-model="formData.deviceType" placeholder="广播设备/对讲设备/语音终端/警示设备" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属单位" prop="department">
              <el-input v-model="formData.department" placeholder="机构名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安装位置" prop="installLocation">
              <el-input v-model="formData.installLocation" placeholder="位置描述" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="覆盖范围" prop="coverageRange">
              <el-input v-model="formData.coverageRange" placeholder="设备作用范围" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备状态" prop="deviceStatus">
              <el-input v-model="formData.deviceStatus" placeholder="在线/离线/故障" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="设备数量" prop="deviceCount">
              <div style="display: flex; align-items: center; gap: 8px;">
                <el-input v-model="formData.deviceCount" placeholder="数值（默认1）" style="flex: 1;" />
                <el-button type="primary" @click="handleBindVoiceDrawer">绑定语音</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="在线数量" prop="onlineCount">
              <el-input v-model="formData.onlineCount" placeholder="数值" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="离线数量" prop="offlineCount">
              <el-input v-model="formData.offlineCount" placeholder="数值" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="故障数量" prop="faultCount">
              <el-input v-model="formData.faultCount" placeholder="数值" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否接入平台" prop="isAccessed">
              <el-input v-model="formData.isAccessed" placeholder="是/否" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最后在线时间" prop="lastOnlineTime">
              <el-input v-model="formData.lastOnlineTime" placeholder="日期时间" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="维护联系人" prop="contactPerson">
              <el-input v-model="formData.contactPerson" placeholder="姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维护电话" prop="contactPhone">
              <el-input v-model="formData.contactPhone" placeholder="手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="支持功能" prop="supportFunction">
              <el-input v-model="formData.supportFunction" placeholder="广播/对讲/告警" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="formData.remark" placeholder="补充说明" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import ExportButton from '@/components/ExportButton.vue'
import { voiceDeviceData } from '@/mock/dispatch/networkData'
import type { VoiceDevice } from '@/types/dispatch/network'

const tableData = ref<VoiceDevice[]>([...voiceDeviceData])
const drawerVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive({
  id: 0, deviceName: '', deviceType: '', department: '', installLocation: '',
  coverageRange: '', deviceStatus: '在线', deviceCount: '', onlineCount: '',
  offlineCount: '', faultCount: '', isAccessed: '是', lastOnlineTime: '',
  contactPerson: '', contactPhone: '', supportFunction: '', remark: ''
})

const formRules: FormRules = {
  deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  deviceType: [{ required: true, message: '请输入设备类型', trigger: 'blur' }],
  department: [{ required: true, message: '请输入所属单位', trigger: 'blur' }]
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

const handleAdd = () => {
  isEdit.value = false
  resetFormData()
  drawerVisible.value = true
}

const handleEdit = (row: VoiceDevice) => {
  isEdit.value = true
  Object.assign(formData, row)
  drawerVisible.value = true
}

const handleDelete = (row: VoiceDevice) => {
  ElMessageBox.confirm(`确定要删除设备"${row.deviceName}"吗？`, '删除确认', {
    type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消'
  }).then(() => {
    tableData.value = tableData.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleBindVoice = (row: VoiceDevice) => { ElMessage.info(`绑定语音：${row.deviceName}`) }
const handleAutoMatch = (row: VoiceDevice) => { ElMessage.info(`自动匹配：${row.deviceName}`) }
const handleDetail = (row: VoiceDevice) => { ElMessage.info(`查看详情：${row.deviceName}`) }
const handleBindVoiceDrawer = () => { ElMessage.info('绑定语音功能开发中...') }

const handleSubmit = () => {
  formRef.value?.validate(valid => {
    if (valid) {
      ElMessage.success(isEdit.value ? '修改成功' : '添加成功')
      drawerVisible.value = false
    }
  })
}

const resetFormData = () => {
  Object.assign(formData, { id: 0, deviceName: '', deviceType: '', department: '', installLocation: '', coverageRange: '', deviceStatus: '在线', deviceCount: '', onlineCount: '', offlineCount: '', faultCount: '', isAccessed: '是', lastOnlineTime: '', contactPerson: '', contactPhone: '', supportFunction: '', remark: '' })
}
const resetForm = () => { formRef.value?.resetFields(); resetFormData() }
</script>

<style lang="scss" scoped>
.voice-device-management {
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

.drawer-footer { display: flex; justify-content: flex-end; padding-top: 16px; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
