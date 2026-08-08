<template>
  <div class="road-config-management">
    <el-card class="table-card animate-item" shadow="never">
      <div class="search-bar">
        <span class="search-bar-title">重点路段配置</span>
        <div class="search-bar-actions">
          <DataAccessButton text="重点路段接入" @click="handleAdd" />
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
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="name" label="路段简称" min-width="120" align="center" />
        <el-table-column prop="direction" label="易堵方向" width="100" align="center" />
        <el-table-column prop="congestionLevel" label="易堵程度" width="100" align="center" />
        <el-table-column prop="congestionTime" label="易堵时段" width="120" align="center" />
        <el-table-column prop="congestionPoint" label="易堵点名称" min-width="140" align="center" show-overflow-tooltip />
        <el-table-column prop="stakeNumber" label="易堵点桩号" width="120" align="center" />
        <el-table-column prop="company" label="经营单位" width="120" align="center" />
        <el-table-column label="操作" width="80" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleRemove(row)">移除</el-button>
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

    <!-- 第一层抽屉：数据源列表 -->
    <el-drawer
      v-model="drawerVisible"
      title="数据源配置"
      size="80%"
      direction="rtl"
      destroy-on-close
    >
      <div class="drawer-content">
        <el-table
          :data="dataSourcePaginatedData"
          border
          stripe
          :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
          class="data-table"
        >
          <el-table-column prop="identifier" label="数据源标识" min-width="160" align="center" show-overflow-tooltip />
          <el-table-column prop="objectType" label="对象类型" width="100" align="center" />
          <el-table-column prop="url" label="接口地址" min-width="200" align="center" show-overflow-tooltip />
          <el-table-column prop="requestMethod" label="请求方式" width="100" align="center" />
          <el-table-column prop="authMethod" label="认证方式" width="100" align="center" />
          <el-table-column prop="authInfo" label="认证信息" min-width="180" align="center" show-overflow-tooltip />
          <el-table-column prop="syncMethod" label="同步方式" width="100" align="center" />
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column label="操作" width="150" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleSync(row)">同步</el-button>
              <el-button type="primary" link size="small" @click="handleEditSource(row)">修改</el-button>
              <el-button type="danger" link size="small" @click="handleDeleteSource(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="drawer-pagination">
          <el-pagination
            v-model:current-page="dataSourcePagination.page"
            v-model:page-size="dataSourcePagination.pageSize"
            :total="dataSourcePagination.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            background
            @size-change="handleDataSourceSizeChange"
            @current-change="handleDataSourcePageChange"
          />
        </div>

        <div class="drawer-footer">
          <el-button type="primary" @click="handleAddSource">添加配置</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 第二层抽屉：添加/编辑数据源 -->
    <el-drawer
      v-model="sourceDrawerVisible"
      :title="isEditSource ? '修改数据源' : '添加数据源'"
      size="60%"
      direction="rtl"
      destroy-on-close
      @closed="resetSourceForm"
    >
      <el-form ref="sourceFormRef" :model="sourceFormData" :rules="sourceFormRules" label-width="110px" label-position="right">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="sourceFormData.name" placeholder="输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责单位" prop="department">
              <el-input v-model="sourceFormData.department" placeholder="输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="作用" prop="purpose">
              <el-input v-model="sourceFormData.purpose" placeholder="输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="适用单位" prop="applicableUnit">
              <el-input v-model="sourceFormData.applicableUnit" placeholder="输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="数据源标识" prop="identifier">
              <el-input v-model="sourceFormData.identifier" placeholder="不可为空，唯一标识来源平台" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对象类型" prop="objectType">
              <el-input v-model="sourceFormData.objectType" placeholder="枚举（路段/服务区/收费站/指挥车/单兵设备/布控球）" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="接口地址" prop="url">
              <el-input v-model="sourceFormData.url" placeholder="不可为空，REST接口路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求方式" prop="requestMethod">
              <el-input v-model="sourceFormData.requestMethod" placeholder="GET/POST，默认GET" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="认证方式" prop="authMethod">
              <el-input v-model="sourceFormData.authMethod" placeholder="token/aksk/oauth2" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="认证信息" prop="authInfo">
              <el-input v-model="sourceFormData.authInfo" placeholder="不可为空（token或密钥）" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="同步方式" prop="syncMethod">
              <el-input v-model="sourceFormData.syncMethod" placeholder="枚举（全量/增量）" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="增量字段" prop="incrementField">
              <el-input v-model="sourceFormData.incrementField" placeholder="增量同步必填（如更新时间）" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主键字段" prop="primaryKey">
              <el-input v-model="sourceFormData.primaryKey" placeholder="不可为空（源系统ID）" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分页大小" prop="pageSize">
              <el-input v-model="sourceFormData.pageSize" placeholder="≥1整数（建议500~1000）" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="同步周期" prop="syncCycle">
              <el-input v-model="sourceFormData.syncCycle" placeholder="如5分钟/1小时" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重试次数" prop="retryCount">
              <el-input v-model="sourceFormData.retryCount" placeholder="≥0整数（建议3）" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="超时时间" prop="timeout">
              <el-input v-model="sourceFormData.timeout" placeholder="单位秒（建议5~30）" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用" prop="enabled">
              <el-radio-group v-model="sourceFormData.enabled">
                <el-radio :value="true">是</el-radio>
                <el-radio :value="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="sourceDrawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitSource">提交</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import ExportButton from '@/components/ExportButton.vue'
import DataAccessButton from '@/components/DataAccessButton.vue'
import { roadConfigData } from '@/mock/dispatch/roadData'
import type { RoadConfig } from '@/types/dispatch/roadData'
import { dataSourceData } from '@/mock/dispatch/dataSource'
import type { DataSource } from '@/mock/dispatch/dataSource'

const tableData = ref<RoadConfig[]>([...roadConfigData])
const dataSourceList = ref<DataSource[]>([...dataSourceData])

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const dataSourcePagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const paginatedData = computed(() => {
  pagination.total = tableData.value.length
  const start = (pagination.page - 1) * pagination.pageSize
  return tableData.value.slice(start, start + pagination.pageSize)
})

const dataSourcePaginatedData = computed(() => {
  dataSourcePagination.total = dataSourceList.value.length
  const start = (dataSourcePagination.page - 1) * dataSourcePagination.pageSize
  return dataSourceList.value.slice(start, start + dataSourcePagination.pageSize)
})

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
}
const handlePageChange = (page: number) => {
  pagination.page = page
}
const handleDataSourceSizeChange = (size: number) => {
  dataSourcePagination.pageSize = size
  dataSourcePagination.page = 1
}
const handleDataSourcePageChange = (page: number) => {
  dataSourcePagination.page = page
}

// 第一层抽屉
const drawerVisible = ref(false)

// 第二层抽屉
const sourceDrawerVisible = ref(false)
const isEditSource = ref(false)
const sourceFormRef = ref<FormInstance>()

const sourceFormData = reactive({
  id: 0,
  name: '',
  department: '',
  purpose: '',
  applicableUnit: '',
  identifier: '',
  objectType: '',
  url: '',
  requestMethod: 'GET',
  authMethod: '',
  authInfo: '',
  syncMethod: '',
  incrementField: '',
  primaryKey: '',
  pageSize: '',
  syncCycle: '',
  retryCount: '',
  timeout: '',
  enabled: true
})

const sourceFormRules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  identifier: [{ required: true, message: '请输入数据源标识', trigger: 'blur' }],
  url: [{ required: true, message: '请输入接口地址', trigger: 'blur' }]
}

const handleAdd = () => {
  drawerVisible.value = true
}

const handleRemove = (row: RoadConfig) => {
  ElMessageBox.confirm(`确定要移除路段"${row.name}"吗？`, '移除确认', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    tableData.value = tableData.value.filter(item => item.id !== row.id)
    ElMessage.success('移除成功')
  }).catch(() => {})
}

const handleSync = (row: DataSource) => {
  ElMessage.success(`正在同步 ${row.identifier}...`)
}

const handleEditSource = (row: DataSource) => {
  isEditSource.value = true
  sourceFormData.id = row.id
  sourceFormData.name = row.identifier
  sourceFormData.department = ''
  sourceFormData.purpose = ''
  sourceFormData.applicableUnit = ''
  sourceFormData.identifier = row.identifier
  sourceFormData.objectType = row.objectType
  sourceFormData.url = row.url
  sourceFormData.requestMethod = row.requestMethod
  sourceFormData.authMethod = row.authMethod
  sourceFormData.authInfo = row.authInfo
  sourceFormData.syncMethod = row.syncMethod
  sourceFormData.incrementField = ''
  sourceFormData.primaryKey = ''
  sourceFormData.pageSize = ''
  sourceFormData.syncCycle = ''
  sourceFormData.retryCount = ''
  sourceFormData.timeout = ''
  sourceFormData.enabled = true
  sourceDrawerVisible.value = true
}

const handleDeleteSource = (row: DataSource) => {
  ElMessageBox.confirm(`确定要删除数据源"${row.identifier}"吗？`, '删除确认', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    dataSourceList.value = dataSourceList.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleAddSource = () => {
  isEditSource.value = false
  sourceFormData.id = 0
  sourceFormData.name = ''
  sourceFormData.department = ''
  sourceFormData.purpose = ''
  sourceFormData.applicableUnit = ''
  sourceFormData.identifier = ''
  sourceFormData.objectType = ''
  sourceFormData.url = ''
  sourceFormData.requestMethod = 'GET'
  sourceFormData.authMethod = ''
  sourceFormData.authInfo = ''
  sourceFormData.syncMethod = ''
  sourceFormData.incrementField = ''
  sourceFormData.primaryKey = ''
  sourceFormData.pageSize = ''
  sourceFormData.syncCycle = ''
  sourceFormData.retryCount = ''
  sourceFormData.timeout = ''
  sourceFormData.enabled = true
  sourceDrawerVisible.value = true
}

const handleSubmitSource = () => {
  if (!sourceFormRef.value) return
  sourceFormRef.value.validate((valid) => {
    if (valid) {
      if (isEditSource.value) {
        ElMessage.success('修改成功')
      } else {
        ElMessage.success('添加成功')
      }
      sourceDrawerVisible.value = false
    }
  })
}

const resetSourceForm = () => {
  sourceFormRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.road-config-management {
  padding: 0;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;

  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;
  }

  .table-card {
    border-radius: 12px;
    border: none;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-card__body) {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }

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
      gap: 0;
      flex-shrink: 0;
    }

    .data-table { flex: 1; }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }
}

.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drawer-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #EBEEF5;
  margin-top: 16px;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
