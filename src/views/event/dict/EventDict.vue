<template>
  <div class="event-dict-page">
    <!-- 左侧：字典类型 -->
    <div class="dict-left-panel">
      <div class="panel-header">
        <span class="panel-title">字典类型</span>
        <el-button type="primary" :icon="Plus" size="small" @click="handleAddType">新增</el-button>
      </div>
      <div class="type-list">
        <div
          v-for="item in typeList"
          :key="item.dictType"
          class="type-item"
          :class="{ active: selectedType?.dictType === item.dictType }"
          @click="handleSelectType(item)"
        >
          <div class="type-info">
            <span class="type-name">{{ item.dictTypeName }}</span>
            <div class="type-actions">
              <el-button type="primary" link :icon="Edit" size="small" @click.stop="handleEditType(item)" />
              <el-button type="danger" link :icon="Delete" size="small" @click.stop="handleDeleteType(item)" />
            </div>
          </div>
          <span class="type-code">{{ item.dictType }}</span>
        </div>
        <el-empty v-if="typeList.length === 0" description="暂无字典类型" :image-size="60" />
      </div>
    </div>

    <!-- 右侧：字典数据 -->
    <div class="dict-right-panel">
      <el-card v-if="selectedType" class="table-card" shadow="never">
        <template #header>
          <div class="card-header">
            <div class="header-left">
              <span class="header-title">{{ selectedType.dictTypeName }}</span>
              <el-tag size="small" effect="plain">{{ selectedType.dictType }}</el-tag>
            </div>
            <div class="header-right">
              <el-input
                v-model="dataSearchKeyword"
                placeholder="搜索字典标签或编码"
                clearable
                :prefix-icon="Search"
                size="small"
                style="width: 240px"
              />
              <el-button type="primary" :icon="Plus" size="small" @click="handleAddData">新增字典项</el-button>
            </div>
          </div>
        </template>

        <el-table
          v-loading="loading"
          :data="filteredData"
          border
          stripe
          highlight-current-row
          row-key="dictId"
          :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
          class="data-table"
        >
          <el-table-column label="序号" width="60" align="center" type="index">
            <template #default="{ $index }">
              <span class="index-text">{{ $index + 1 }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="dictLabel" label="字典标签" min-width="120">
            <template #default="{ row }">
              <span class="label-text">{{ row.dictLabel }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="dictValue" label="字典值" width="80" align="center">
            <template #default="{ row }">
              <span class="value-text">{{ row.dictValue }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="dictCode" label="字典编码" min-width="160">
            <template #default="{ row }">
              <span class="code-text">{{ row.dictCode }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="displayOrder" label="排序" width="70" align="center" />

          <el-table-column prop="isDefault" label="默认" width="70" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.isDefault === 1" type="success" effect="plain" size="small">是</el-tag>
              <span v-else class="no-text">否</span>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="状态" width="80" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 1101 ? 'success' : 'info'" effect="light" size="small">
                {{ row.status === 1101 ? '正常' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="160" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link :icon="Edit" @click="handleEditData(row)">编辑</el-button>
              <el-button type="danger" link :icon="Delete" @click="handleDeleteData(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="dataPagination.page"
            v-model:page-size="dataPagination.pageSize"
            :total="dataPagination.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            background
            @size-change="handleDataSizeChange"
            @current-change="handleDataPageChange"
          />
        </div>
      </el-card>

      <el-card v-else class="empty-card" shadow="never">
        <el-empty description="请选择左侧字典类型" />
      </el-card>
    </div>

    <!-- 新增/编辑字典类型抽屉 -->
    <el-drawer
      v-model="typeDrawerVisible"
      :title="isTypeEdit ? '编辑字典类型' : '新增字典类型'"
      size="450px"
      direction="rtl"
      destroy-on-close
      @closed="resetTypeForm"
    >
      <el-form ref="typeFormRef" :model="typeFormData" :rules="typeFormRules" label-width="90px" label-position="right">
        <el-form-item label="类型编码" prop="dictType">
          <el-input v-model="typeFormData.dictType" placeholder="如：event_accident_type" maxlength="100" :disabled="isTypeEdit" />
        </el-form-item>
        <el-form-item label="类型名称" prop="dictTypeName">
          <el-input v-model="typeFormData.dictTypeName" placeholder="请输入类型名称" maxlength="100" />
        </el-form-item>
        <el-form-item label="排序" prop="displayOrder">
          <el-input-number v-model="typeFormData.displayOrder" :min="0" :max="9999" style="width: 180px" />
          <span class="form-tip-inline">数值越小越靠前</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="typeFormData.remark" type="textarea" :rows="3" placeholder="请输入备注" maxlength="500" show-word-limit />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="typeFormData.status">
            <el-radio :value="1101">正常</el-radio>
            <el-radio :value="1102">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="typeDrawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleTypeSubmit">{{ isTypeEdit ? '保存修改' : '确认创建' }}</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 新增/编辑字典数据抽屉 -->
    <el-drawer
      v-model="dataDrawerVisible"
      :title="isDataEdit ? '编辑字典项' : '新增字典项'"
      size="500px"
      direction="rtl"
      destroy-on-close
      @closed="resetDataForm"
    >
      <el-form ref="dataFormRef" :model="dataFormData" :rules="dataFormRules" label-width="90px" label-position="right">
        <el-form-item label="字典标签" prop="dictLabel">
          <el-input v-model="dataFormData.dictLabel" placeholder="请输入字典标签" maxlength="100" />
        </el-form-item>
        <el-form-item label="字典值" prop="dictValue">
          <el-input v-model="dataFormData.dictValue" placeholder="请输入字典值" maxlength="255" />
        </el-form-item>
        <el-form-item label="字典编码" prop="dictCode">
          <el-input v-model="dataFormData.dictCode" placeholder="请输入字典编码（唯一）" maxlength="100" :disabled="isDataEdit" />
        </el-form-item>
        <el-form-item label="排序" prop="displayOrder">
          <el-input-number v-model="dataFormData.displayOrder" :min="0" :max="9999" style="width: 180px" />
          <span class="form-tip-inline">数值越小越靠前</span>
        </el-form-item>
        <el-form-item label="是否默认" prop="isDefault">
          <el-radio-group v-model="dataFormData.isDefault">
            <el-radio :value="1">是</el-radio>
            <el-radio :value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dataFormData.status">
            <el-radio :value="1101">正常</el-radio>
            <el-radio :value="1102">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataFormData.remark" type="textarea" :rows="3" placeholder="请输入备注" maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="dataDrawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleDataSubmit">{{ isDataEdit ? '保存修改' : '确认创建' }}</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, Delete, Edit, Search } from '@element-plus/icons-vue'
import { getEventDictTypes, getEventDictDataByType } from '@/mock/event/dictData'
import type { EventDictType, EventDictData } from '@/types/event/dict'

// ── 状态 ──
const loading = ref(false)
const typeList = ref<EventDictType[]>([])
const selectedType = ref<EventDictType | null>(null)
const tableData = ref<EventDictData[]>([])
const dataSearchKeyword = ref('')

const dataPagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// ── 类型表单 ──
const typeDrawerVisible = ref(false)
const isTypeEdit = ref(false)
const typeFormRef = ref<FormInstance>()
const typeFormData = reactive({
  dictType: '',
  dictTypeName: '',
  displayOrder: 0,
  remark: '',
  status: 1101
})
const typeFormRules: FormRules = {
  dictType: [{ required: true, message: '请输入类型编码', trigger: 'blur' }],
  dictTypeName: [{ required: true, message: '请输入类型名称', trigger: 'blur' }]
}

// ── 数据表单 ──
const dataDrawerVisible = ref(false)
const isDataEdit = ref(false)
const dataFormRef = ref<FormInstance>()
const dataFormData = reactive({
  dictId: 0,
  dictLabel: '',
  dictValue: '',
  dictCode: '',
  displayOrder: 0,
  isDefault: 0,
  status: 1101,
  remark: ''
})
const dataFormRules: FormRules = {
  dictLabel: [{ required: true, message: '请输入字典标签', trigger: 'blur' }],
  dictValue: [{ required: true, message: '请输入字典值', trigger: 'blur' }],
  dictCode: [{ required: true, message: '请输入字典编码', trigger: 'blur' }]
}

// ── 计算属性 ──
const filteredData = computed(() => {
  let data = tableData.value

  if (dataSearchKeyword.value) {
    const keyword = dataSearchKeyword.value.toLowerCase()
    data = data.filter(item =>
      item.dictLabel.toLowerCase().includes(keyword) ||
      item.dictCode.toLowerCase().includes(keyword)
    )
  }

  dataPagination.total = data.length
  const start = (dataPagination.page - 1) * dataPagination.pageSize
  return data.slice(start, start + dataPagination.pageSize)
})

// ── 方法 ──
function fetchTypes() {
  typeList.value = getEventDictTypes()
  // 默认选中第一个类型
  if (!selectedType.value && typeList.value.length > 0) {
    handleSelectType(typeList.value[0])
  }
}

function handleSelectType(item: EventDictType) {
  selectedType.value = item
  dataSearchKeyword.value = ''
  dataPagination.page = 1
  loading.value = true
  setTimeout(() => {
    tableData.value = getEventDictDataByType(item.dictType)
    loading.value = false
  }, 200)
}

// ── 类型操作 ──
function handleAddType() {
  isTypeEdit.value = false
  typeFormData.dictType = ''
  typeFormData.dictTypeName = ''
  typeFormData.displayOrder = typeList.value.length + 1
  typeFormData.remark = ''
  typeFormData.status = 1101
  typeDrawerVisible.value = true
}

function handleEditType(item: EventDictType) {
  isTypeEdit.value = true
  typeFormData.dictType = item.dictType
  typeFormData.dictTypeName = item.dictTypeName
  typeFormData.displayOrder = item.count
  typeFormData.remark = item.remark || ''
  typeFormData.status = item.status
  typeDrawerVisible.value = true
}

function handleDeleteType(item: EventDictType) {
  ElMessageBox.confirm(
    `确定要删除字典类型 "${item.dictTypeName}" 吗？该类型下的所有字典数据也将被删除。`,
    '确认删除',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success('删除成功')
    if (selectedType.value?.dictType === item.dictType) {
      selectedType.value = null
      tableData.value = []
    }
    fetchTypes()
  }).catch(() => {})
}

function handleTypeSubmit() {
  if (!typeFormRef.value) return
  typeFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(isTypeEdit.value ? '编辑成功' : '新增成功')
      typeDrawerVisible.value = false
      fetchTypes()
    }
  })
}

function resetTypeForm() {
  typeFormRef.value?.resetFields()
}

// ── 数据操作 ──
function handleAddData() {
  if (!selectedType.value) return
  isDataEdit.value = false
  dataFormData.dictId = 0
  dataFormData.dictLabel = ''
  dataFormData.dictValue = ''
  dataFormData.dictCode = ''
  dataFormData.displayOrder = tableData.value.length + 1
  dataFormData.isDefault = 0
  dataFormData.status = 1101
  dataFormData.remark = ''
  dataDrawerVisible.value = true
}

function handleEditData(row: EventDictData) {
  isDataEdit.value = true
  dataFormData.dictId = row.dictId
  dataFormData.dictLabel = row.dictLabel
  dataFormData.dictValue = row.dictValue
  dataFormData.dictCode = row.dictCode
  dataFormData.displayOrder = row.displayOrder
  dataFormData.isDefault = row.isDefault
  dataFormData.status = row.status
  dataFormData.remark = row.remark || ''
  dataDrawerVisible.value = true
}

function handleDataSubmit() {
  if (!dataFormRef.value) return
  dataFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(isDataEdit.value ? '编辑成功' : '新增成功')
      dataDrawerVisible.value = false
      if (selectedType.value) {
        handleSelectType(selectedType.value)
      }
      fetchTypes()
    }
  })
}

function handleDeleteData(row: EventDictData) {
  ElMessageBox.confirm(
    `确定要删除字典项 "${row.dictLabel}" 吗？`,
    '确认删除',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success('删除成功')
    if (selectedType.value) {
      handleSelectType(selectedType.value)
    }
    fetchTypes()
  }).catch(() => {})
}

function resetDataForm() {
  dataFormRef.value?.resetFields()
}

function handleDataSizeChange(size: number) {
  dataPagination.pageSize = size
  dataPagination.page = 1
}

function handleDataPageChange(page: number) {
  dataPagination.page = page
}

// ── 初始化 ──
fetchTypes()
</script>

<style lang="scss" scoped>
.event-dict-page {
  display: flex;
  height: 100%;
  gap: 16px;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  padding: 0;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;

  // ── 左侧面板 ──
  .dict-left-panel {
    width: 280px;
    flex-shrink: 0;
    background: #fff;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #ebeef5;

      .panel-title {
        font-size: 15px;
        font-weight: 600;
        color: #303133;
      }
    }

    .type-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;

      .type-item {
        padding: 12px 16px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        margin-bottom: 4px;

        &:hover {
          background: #f5f7fa;
        }

        &.active {
          background: #ecf5ff;
          border-left: 3px solid #409eff;
          padding-left: 13px;
        }

        .type-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;

          .type-name {
            font-size: 14px;
            font-weight: 500;
            color: #303133;
          }

          .type-actions {
            display: flex;
            gap: 2px;
          }
        }

        .type-code {
          font-size: 12px;
          color: #909399;
          font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
        }
      }
    }
  }

  // ── 右侧面板 ──
  .dict-right-panel {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;

    .table-card {
      border-radius: 12px;
      border: none;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      :deep(.el-card__header) {
        padding: 16px 20px;
        border-bottom: 1px solid #ebeef5;
      }

      :deep(.el-card__body) {
        padding: 20px;
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;

          .header-title {
            font-size: 15px;
            font-weight: 600;
            color: #303133;
          }
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
      }

      .data-table {
        flex: 1;
      }

      .pagination-wrapper {
        display: flex;
        justify-content: flex-end;
        margin-top: 16px;
        flex-shrink: 0;
      }

      .index-text { color: #909399; font-size: 13px; }
      .label-text { font-weight: 500; color: #303133; }
      .value-text { font-weight: 600; color: #409EFF; }
      .code-text {
        font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
        font-size: 12px;
        color: #606266;
        background: #F5F7FA;
        padding: 2px 8px;
        border-radius: 4px;
      }
      .no-text { color: #909399; }
    }

    .empty-card {
      border-radius: 12px;
      border: none;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  // ── 抽屉 ──
  :deep(.el-drawer) {
    .el-drawer__header {
      margin-bottom: 0;
      padding: 20px 24px;
      border-bottom: 1px solid #EBEEF5;
      .el-drawer__title { font-weight: 600; font-size: 16px; }
    }
    .el-drawer__body { padding: 24px; overflow-y: auto; }
  }

  .drawer-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid #EBEEF5;
    margin-top: 20px;
  }

  .form-tip-inline {
    font-size: 12px;
    color: #909399;
    margin-left: 12px;
  }
}
</style>
