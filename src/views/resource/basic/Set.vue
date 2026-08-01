<template>
  <div class="equipment-set-management">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部筛选卡片 -->
      <StatsCards v-model="currentTab" :items="statsCards" @change="handleTabChange" />

      <!-- 搜索栏 -->
      <div class="search-bar">
        <span class="search-bar-title">装备套组管理</span>
        <div class="search-bar-actions">
          <el-input
            v-model="searchForm.setName"
            placeholder="搜索套组名称"
            clearable
            :prefix-icon="Search"
            style="width: 180px; margin-right: 12px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-button type="primary" :icon="Plus" @click="handleCreate">新建套组</el-button>
          <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="setId"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="setName" label="装备套组名称" min-width="160" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="set-name-text">{{ row.setName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="equipmentDesc" label="关联装备" min-width="280" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="equipment-desc-text">{{ row.equipmentDesc }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="启用状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" effect="light" round>
              {{ row.status === 1 ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createBy" label="创建人" width="110" align="center">
          <template #default="{ row }">
            <span class="creator-name">{{ row.createBy }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建日期" width="120" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="updateTime" label="最近修改日期" width="170" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.updateTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">修改</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
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

    <!-- 新增/编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="drawerTitle"
      size="50%"
      direction="rtl"
      class="set-drawer"
      destroy-on-close
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90px">
        <el-form-item label="套组名称" prop="setName">
          <el-input v-model="formData.setName" placeholder="请输入套组名称" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="启用状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="套组装备" prop="equipmentItems">
          <div class="equipment-editor">
            <el-table :data="formData.equipmentItems" border size="small" class="equipment-table">
              <el-table-column label="设备物资名称" min-width="150" align="center">
                <template #default="{ row }">
                  <el-input v-model="row.equipmentName" placeholder="请输入设备物资名称" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="类别" min-width="170" align="center">
                <template #default="{ row }">
                  <el-select v-model="row.category" placeholder="请选择类别" size="small" style="width: 100%">
                    <el-option v-for="cat in categoryOptions" :key="cat" :label="cat" :value="cat" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="单位" width="90" align="center">
                <template #default="{ row }">
                  <el-select v-model="row.unit" placeholder="单位" size="small" style="width: 100%">
                    <el-option v-for="unit in unitOptions" :key="unit" :label="unit" :value="unit" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="数量" width="90" align="center">
                <template #default="{ row }">
                  <el-input-number v-model="row.quantity" :min="1" :max="999" size="small" style="width: 100%" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="60" align="center">
                <template #default="{ $index }">
                  <el-button
                    type="danger"
                    link
                    :icon="Delete"
                    :disabled="formData.equipmentItems.length <= 1"
                    @click="removeEquipmentItem($index)"
                  />
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" plain :icon="Plus" class="add-equipment-btn" @click="addEquipmentItem">
              添加装备
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" maxlength="200" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Search, Plus, Download, Edit, Delete, Box, CircleCheck, CircleClose } from '@element-plus/icons-vue'
import { equipmentSetData } from '@/mock/resource/setData'
import type { EquipmentSet, EquipmentSetForm, EquipmentSetItem, EquipmentSetSearchForm } from '@/types/resource/set'
import StatsCards from '@/components/StatsCards.vue'

const loading = ref(false)
const tableData = ref<EquipmentSet[]>(equipmentSetData)
const currentTab = ref('all')

const searchForm = reactive<EquipmentSetSearchForm>({
  setName: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// ── 顶部筛选统计卡片 ──
const statsCards = computed(() => [
  { key: 'all', label: '全部套组', value: tableData.value.length, icon: Box, color: '#409EFF', bgColor: '#ecf5ff' },
  { key: 'enabled', label: '启用', value: tableData.value.filter(d => d.status === 1).length, icon: CircleCheck, color: '#67C23A', bgColor: '#f0f9eb' },
  { key: 'disabled', label: '停用', value: tableData.value.filter(d => d.status === 0).length, icon: CircleClose, color: '#E6A23C', bgColor: '#fdf6ec' }
])

const filteredData = computed(() => {
  let data = tableData.value
  if (currentTab.value === 'enabled') {
    data = data.filter(item => item.status === 1)
  } else if (currentTab.value === 'disabled') {
    data = data.filter(item => item.status === 0)
  }
  if (searchForm.setName) {
    data = data.filter(item => item.setName.includes(searchForm.setName))
  }
  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

function handleSearch() {
  pagination.page = 1
}

function handleTabChange(key: string) {
  currentTab.value = key
  pagination.page = 1
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handlePageChange(page: number) {
  pagination.page = page
}

// ── 类别 / 单位选项 ──
const categoryOptions = [
  '应急处装备及配套物资/搜救设备',
  '应急处装备及配套物资/发电设备',
  '应急处装备及配套物资/通信设备',
  '应急处装备及配套物资/水域救援设备',
  '应急处装备及配套物资/医疗救援设备',
  '应急处装备及配套物资/其他',
  '消防器材'
]
const unitOptions = ['台', '个', '套', '件', '块', '副', '根', '支', '盏', '把', '卷', '枚', '艘', '盘', '瓶', '张', '顶', '条', '袋']

// ── 新增/编辑抽屉 ──
const drawerVisible = ref(false)
const drawerTitle = ref('新建套组')
const formRef = ref<FormInstance>()
const editingId = ref('')

const createEmptyItem = (): EquipmentSetItem => ({
  equipmentName: '',
  category: '',
  unit: '个',
  quantity: 1
})

const formData = reactive<EquipmentSetForm>({
  setName: '',
  status: 1,
  remark: '',
  equipmentItems: [createEmptyItem()]
})

const formRules: FormRules = {
  setName: [{ required: true, message: '请输入套组名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择启用状态', trigger: 'change' }],
  equipmentItems: [
    {
      validator: (_rule, value: EquipmentSetItem[], callback) => {
        if (!value.length) {
          callback(new Error('请至少添加一件套组装备'))
          return
        }
        if (value.some(item => !item.equipmentName || !item.category)) {
          callback(new Error('请完整填写套组装备的名称与类别'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ]
}

function resetForm() {
  formData.setName = ''
  formData.status = 1
  formData.remark = ''
  formData.equipmentItems = [createEmptyItem()]
}

function handleCreate() {
  editingId.value = ''
  drawerTitle.value = '新建套组'
  resetForm()
  drawerVisible.value = true
}

function handleEdit(row: EquipmentSet) {
  editingId.value = row.setId
  drawerTitle.value = '修改套组'
  formData.setName = row.setName
  formData.status = row.status
  formData.remark = row.remark
  formData.equipmentItems = row.equipmentItems.map(item => ({ ...item }))
  if (!formData.equipmentItems.length) {
    formData.equipmentItems = [createEmptyItem()]
  }
  drawerVisible.value = true
}

function addEquipmentItem() {
  formData.equipmentItems.push(createEmptyItem())
}

function removeEquipmentItem(index: number) {
  formData.equipmentItems.splice(index, 1)
}

function handleSubmit() {
  formRef.value?.validate(valid => {
    if (!valid) return
    if (editingId.value) {
      const target = tableData.value.find(item => item.setId === editingId.value)
      if (target) {
        target.setName = formData.setName
        target.status = formData.status
        target.remark = formData.remark
        target.equipmentItems = formData.equipmentItems.map(item => ({ ...item }))
        target.equipmentDesc = buildEquipmentDesc(target.equipmentItems)
        target.updateTime = formatNow()
      }
      ElMessage.success('修改成功')
    } else {
      const id = `SET${String(tableData.value.length + 1).padStart(4, '0')}`
      const items = formData.equipmentItems.map(item => ({ ...item }))
      tableData.value.unshift({
        setId: id,
        setName: formData.setName,
        equipmentDesc: buildEquipmentDesc(items),
        equipmentItems: items,
        status: formData.status,
        createBy: '当前用户',
        createTime: new Date().toISOString().slice(0, 10),
        updateTime: formatNow(),
        remark: formData.remark
      })
      ElMessage.success('新建成功')
    }
    drawerVisible.value = false
  })
}

function buildEquipmentDesc(items: EquipmentSetItem[]): string {
  return items.map(item => `${item.equipmentName}*${item.quantity}`).join('、')
}

function formatNow(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// ── 删除 ──
function handleDelete(row: EquipmentSet) {
  ElMessageBox.confirm(
    `是否确认删除套组 "${row.setName}"？`,
    '删除确认',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    tableData.value = tableData.value.filter(item => item.setId !== row.setId)
    ElMessage.success(`已删除套组 ${row.setName}`)
  }).catch(() => {})
}

// ── 导出 ──
function csvCell(value: unknown): string {
  const str = value == null ? '' : String(value)
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

function handleExport() {
  if (!tableData.value.length) {
    ElMessage.warning('暂无数据可导出')
    return
  }
  const header = '装备套组名称,关联装备,启用状态,创建人,创建日期,最近修改日期,备注'
  const body = tableData.value.map(row =>
    [row.setName, row.equipmentDesc, row.status === 1 ? '启用' : '停用', row.createBy, row.createTime, row.updateTime, row.remark]
      .map(csvCell).join(',')
  ).join('\n')
  const blob = new Blob(['\ufeff' + `${header}\n${body}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `装备套组管理_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}
</script>

<style lang="scss" scoped>
:deep(.el-drawer__footer) {
  border-top: 1px solid #ebeef5;
}

.equipment-set-management {
  padding: 16px;
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

    // ── 顶部筛选卡片 ──
    // ── 搜索栏 ──
    .search-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
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

    .set-name-text {
      font-weight: 500;
      color: #303133;
    }

    .equipment-desc-text {
      font-size: 13px;
      color: #606266;
      line-height: 1.5;
    }

    .creator-name {
      font-size: 13px;
      color: #303133;
      font-weight: 500;
    }

    .time-text {
      font-size: 13px;
      color: #909399;
    }

    .data-table {
      flex: 1;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }
}

// 抽屉表单
.set-drawer {
  .equipment-editor {
    width: 100%;

    .equipment-table {
      margin-bottom: 12px;
    }

    .add-equipment-btn {
      width: 100%;
    }
  }
}

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
