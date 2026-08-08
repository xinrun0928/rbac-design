<template>
  <div class="guarantee-management">
    <el-card class="table-card animate-item" shadow="never">
      <div class="search-bar">
        <div class="search-bar-left">
          <el-button type="primary" @click="handleAdd">新增保障任务</el-button>
        </div>
        <div class="search-bar-actions">
          <span class="sync-info">同步网关视频 2026年4月24日 09点20分</span>
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
        <el-table-column prop="taskName" label="保障任务名称" min-width="180" align="center" show-overflow-tooltip />
        <el-table-column prop="responsibleUnit" label="责任单位" width="120" align="center" />
        <el-table-column prop="area" label="所属区域" width="100" align="center" />
        <el-table-column prop="roadSection" label="所属路段" width="120" align="center" show-overflow-tooltip />
        <el-table-column prop="taskType" label="任务类型" width="90" align="center" />
        <el-table-column label="任务状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" effect="plain" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="160" align="center" />
        <el-table-column label="是否重点" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.isKeyTask ? 'danger' : 'info'" effect="plain" size="small">
              {{ row.isKeyTask ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="160" align="center" />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
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

    <!-- 详情抽屉 -->
    <el-drawer
      v-model="detailDrawerVisible"
      :title="'重点保障工作详情'"
      size="80%"
      direction="rtl"
      destroy-on-close
    >
      <GuaranteeDetail :task-id="currentTaskId" />
    </el-drawer>

    <!-- 新增/编辑保障任务抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="isEdit ? '修改保障任务' : '新增保障任务'"
      size="60%"
      direction="rtl"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" label-position="right">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="保障任务名称" prop="taskName">
              <el-input v-model="formData.taskName" placeholder="必填，不超过100字" maxlength="100" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保障任务描述" prop="description">
              <el-input v-model="formData.description" placeholder="任务内容说明" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="责任单位" prop="responsibleUnit">
              <el-input v-model="formData.responsibleUnit" placeholder="执行单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属区域" prop="area">
              <el-input v-model="formData.area" placeholder="行政区域" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属路段" prop="roadSection">
              <el-input v-model="formData.roadSection" placeholder="路段名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务类型" prop="taskType">
              <el-select v-model="formData.taskType" placeholder="请选择任务类型" style="width: 100%;">
                <el-option label="疏导" value="疏导" />
                <el-option label="救援" value="救援" />
                <el-option label="巡查" value="巡查" />
                <el-option label="保障" value="保障" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="任务状态" prop="status">
              <el-select v-model="formData.status" placeholder="请选择任务状态" style="width: 100%;">
                <el-option label="未开始" value="未开始" />
                <el-option label="进行中" value="进行中" />
                <el-option label="已完成" value="已完成" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker v-model="formData.startTime" type="datetime" placeholder="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker v-model="formData.endTime" type="datetime" placeholder="请选择结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否重点任务" prop="isKeyTask">
              <el-select v-model="formData.isKeyTask" placeholder="请选择" style="width: 100%;">
                <el-option label="是" :value="true" />
                <el-option label="否" :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="关联事件" prop="relatedEvent">
              <el-input v-model="formData.relatedEvent" placeholder="事件名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联保障任务" prop="relatedTaskId">
              <el-select v-model="formData.relatedTaskId" placeholder="选择" clearable style="width: 100%;">
                <el-option v-for="task in tableData" :key="task.id" :label="task.taskName" :value="task.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单位联系负责人" prop="contactPerson">
              <el-select v-model="formData.contactPerson" placeholder="选择" clearable style="width: 100%;">
                <el-option label="张伟" value="张伟" />
                <el-option label="李强" value="李强" />
                <el-option label="王芳" value="王芳" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联监控点" prop="monitorPointId">
              <el-select v-model="formData.monitorPointId" placeholder="选择" clearable style="width: 100%;">
                <el-option label="监控点1 - K12+500" :value="1" />
                <el-option label="监控点2 - K15+200" :value="2" />
                <el-option label="监控点3 - 服务区入口" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="监控巡视频时间隔" prop="patrolInterval">
              <el-input-number v-model="formData.patrolInterval" :min="1" :max="60" placeholder="输入" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="轮询宫格" prop="gridConfig">
              <el-select v-model="formData.gridConfig" placeholder="请选择" style="width: 100%;">
                <el-option label="四宫格" value="四宫格" />
                <el-option label="九宫格" value="九宫格" />
                <el-option label="十六宫格" value="十六宫格" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="交通设施" prop="facilityIds">
              <el-select v-model="formData.facilityIds" multiple placeholder="选择绑定" clearable style="width: 100%;">
                <el-option label="监控摄像头" :value="1" />
                <el-option label="情报板" :value="2" />
                <el-option label="信号灯" :value="3" />
                <el-option label="护栏" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事件检测" prop="detectionRuleId">
              <el-select v-model="formData.detectionRuleId" placeholder="AI监测规则" clearable style="width: 100%;">
                <el-option label="拥堵检测" :value="1" />
                <el-option label="事故检测" :value="2" />
                <el-option label="行人闯入" :value="3" />
                <el-option label="抛洒物检测" :value="4" />
              </el-select>
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
import GuaranteeDetail from './GuaranteeDetail.vue'
import { guaranteeTaskData } from '@/mock/dispatch/guaranteeData'
import type { GuaranteeTask } from '@/types/dispatch/guarantee'

const tableData = ref<GuaranteeTask[]>([...guaranteeTaskData])
const drawerVisible = ref(false)
const detailDrawerVisible = ref(false)
const currentTaskId = ref(0)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive({
  id: 0,
  taskName: '',
  description: '',
  responsibleUnit: '',
  area: '',
  roadSection: '',
  taskType: '保障' as GuaranteeTask['taskType'],
  status: '未开始' as GuaranteeTask['status'],
  startTime: '',
  endTime: '',
  isKeyTask: false,
  relatedEvent: '',
  relatedTaskId: null as number | null,
  contactPerson: '',
  monitorPointId: null as number | null,
  patrolInterval: 5,
  gridConfig: '九宫格',
  facilityIds: [] as number[],
  detectionRuleId: null as number | null
})

const formRules: FormRules = {
  taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入任务描述', trigger: 'blur' }],
  responsibleUnit: [{ required: true, message: '请输入责任单位', trigger: 'blur' }],
  area: [{ required: true, message: '请输入所属区域', trigger: 'blur' }],
  roadSection: [{ required: true, message: '请输入所属路段', trigger: 'blur' }],
  taskType: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择任务状态', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }]
}

const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const paginatedData = computed(() => {
  pagination.total = tableData.value.length
  const start = (pagination.page - 1) * pagination.pageSize
  return tableData.value.slice(start, start + pagination.pageSize)
})

const getStatusType = (status: GuaranteeTask['status']) => {
  const map: Record<GuaranteeTask['status'], string> = {
    '未开始': 'info',
    '进行中': '',
    '已完成': 'success'
  }
  return map[status]
}

const handleSizeChange = (size: number) => { pagination.pageSize = size; pagination.page = 1 }
const handlePageChange = (page: number) => { pagination.page = page }
const handleRefresh = () => { ElMessage.success('刷新成功') }

const handleAdd = () => {
  isEdit.value = false
  resetFormData()
  drawerVisible.value = true
}

const handleEdit = (row: GuaranteeTask) => {
  isEdit.value = true
  Object.assign(formData, row)
  drawerVisible.value = true
}

const handleDelete = (row: GuaranteeTask) => {
  ElMessageBox.confirm(`确定要删除任务"${row.taskName}"吗？`, '删除确认', {
    type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消'
  }).then(() => {
    tableData.value = tableData.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleDetail = (row: GuaranteeTask) => {
  currentTaskId.value = row.id
  detailDrawerVisible.value = true
}

const handleSubmit = () => {
  formRef.value?.validate(valid => {
    if (valid) {
      ElMessage.success(isEdit.value ? '修改成功' : '添加成功')
      drawerVisible.value = false
    }
  })
}

const resetFormData = () => {
  Object.assign(formData, {
    id: 0, taskName: '', description: '', responsibleUnit: '', area: '',
    roadSection: '', taskType: '保障', status: '未开始', startTime: '', endTime: '',
    isKeyTask: false, relatedEvent: '', relatedTaskId: null, contactPerson: '',
    monitorPointId: null, patrolInterval: 5, gridConfig: '九宫格',
    facilityIds: [], detectionRuleId: null
  })
}
const resetForm = () => { formRef.value?.resetFields(); resetFormData() }
</script>

<style lang="scss" scoped>
.guarantee-management {
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

    .search-bar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .search-bar-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

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
