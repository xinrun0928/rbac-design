<template>
  <div class="inventory-query-page">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部统计卡片 -->
      <div class="stats-row">
        <div
          v-for="item in statsCards"
          :key="item.key"
          class="stats-card"
          :class="{ active: currentResult === item.key }"
          @click="handleResultChange(item.key)"
        >
          <div class="stats-icon" :style="{ background: item.bgColor, color: item.color }">
            <el-icon :size="26"><component :is="item.icon" /></el-icon>
          </div>
          <div class="stats-info">
            <div class="stats-value" :style="{ color: item.color }">{{ item.value }}</div>
            <div class="stats-label">{{ item.label }}</div>
          </div>
        </div>
      </div>

      <!-- 记录数 + 搜索 + 操作按钮 -->
      <div class="content-header">
        <div class="content-header-left">
          <span class="record-count">共{{ pagination.total }}条记录</span>
        </div>

        <div class="content-header-right">
          <el-input
            v-model="searchKeyword"
            placeholder="输入关键字快速搜索"
            clearable
            :prefix-icon="Search"
            style="width: 200px; margin-right: 12px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-dropdown trigger="click" @command="handleAddCommand">
            <el-button type="primary" :icon="Plus">新增盘点</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="stockCheck">库存装备盘点</el-dropdown-item>
                <el-dropdown-item command="outCheck">库外装备盘点</el-dropdown-item>
                <el-dropdown-item command="customCheck">自定义盘点</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 表格 -->
      <div class="table-wrapper">
        <el-table
          v-loading="loading"
          :data="tableData"
          border
          stripe
          height="100%"
          :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        >
          <el-table-column prop="title" label="标题" min-width="200" align="center" show-overflow-tooltip />
          <el-table-column prop="checkDate" label="盘点日期" width="120" align="center" />
          <el-table-column prop="checkCode" label="盘点记录编号" min-width="160" align="center">
            <template #default="{ row }">
              <el-link type="primary" :underline="false">{{ row.checkCode }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="260" align="center" show-overflow-tooltip />
          <el-table-column prop="checkType" label="类型" width="130" align="center" />
          <el-table-column prop="result" label="盘点结果" width="100" align="center">
            <template #default="{ row }">
              <el-link v-if="row.result === '盘盈'" type="primary" :underline="false">{{ row.result }}</el-link>
              <el-link v-else-if="row.result === '盘亏'" type="danger" :underline="false">{{ row.result }}</el-link>
              <span v-else style="color: #909399">{{ row.result }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="attachment" label="盘点单附件" width="130" align="center">
            <template #default="{ row }">
              <el-link v-if="row.attachment" type="primary" :underline="false">{{ row.attachment }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="70" align="center" fixed="right">
            <template #default>
              <el-button type="primary" :icon="List" link />
            </template>
          </el-table-column>
        </el-table>
      </div>

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

    <!-- 新增库存装备盘点抽屉 -->
    <el-drawer
      v-model="stockCheckVisible"
      title="新增库存装备盘点"
      size="500px"
      direction="rtl"
      destroy-on-close
    >
      <el-form ref="stockCheckFormRef" :model="stockCheckForm" :rules="stockCheckRules" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="stockCheckForm.title" placeholder="请输入标题" class="form-input" />
        </el-form-item>
        <el-form-item label="盘点单附件">
          <el-link type="primary" :underline="false" :icon="Paperclip">添加</el-link>
        </el-form-item>
        <el-form-item label="盘点仓库" prop="warehouse">
          <el-select v-model="stockCheckForm.warehouse" placeholder="请选择盘点仓库" class="form-input">
            <el-option v-for="w in warehouseOptions" :key="w" :label="w" :value="w" />
          </el-select>
        </el-form-item>
        <el-form-item label="盘点日期" prop="checkDate">
          <el-date-picker
            v-model="stockCheckForm.checkDate"
            type="date"
            placeholder="请选择日期"
            class="form-input"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="盘点结果" prop="result">
          <el-radio-group v-model="stockCheckForm.result">
            <el-radio value="盘盈">盘盈</el-radio>
            <el-radio value="盘亏">盘亏</el-radio>
            <el-radio value="正常">正常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="stockCheckForm.remark" type="textarea" :rows="3" placeholder="请输入备注" class="form-input" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="stockCheckVisible = false">取消</el-button>
        <el-button type="primary" @click="handleStockCheckSubmit">确认</el-button>
      </template>
    </el-drawer>

    <!-- 新增库外装备盘点抽屉 -->
    <el-drawer
      v-model="outCheckVisible"
      title="新增库外装备盘点"
      size="500px"
      direction="rtl"
      destroy-on-close
    >
      <el-form ref="outCheckFormRef" :model="outCheckForm" :rules="outCheckRules" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="outCheckForm.title" placeholder="请输入标题" class="form-input" />
        </el-form-item>
        <el-form-item label="盘点单附件">
          <el-link type="primary" :underline="false" :icon="Paperclip">添加</el-link>
        </el-form-item>
        <el-form-item label="盘点地址" prop="address">
          <div style="display: flex; width: 100%; gap: 8px">
            <el-input v-model="outCheckForm.address" placeholder="请输入盘点地址" class="form-input" />
            <el-button type="primary" link>在地图中获取位置</el-button>
          </div>
        </el-form-item>
        <el-form-item label="盘点日期" prop="checkDate">
          <el-date-picker
            v-model="outCheckForm.checkDate"
            type="date"
            placeholder="请选择日期"
            class="form-input"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="盘点结果" prop="result">
          <el-radio-group v-model="outCheckForm.result">
            <el-radio value="盘盈">盘盈</el-radio>
            <el-radio value="盘亏">盘亏</el-radio>
            <el-radio value="正常">正常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="outCheckForm.remark" type="textarea" :rows="3" placeholder="请输入备注" class="form-input" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="outCheckVisible = false">取消</el-button>
        <el-button type="primary" @click="handleOutCheckSubmit">确认</el-button>
      </template>
    </el-drawer>

    <!-- 新增自定义盘点抽屉 -->
    <el-drawer
      v-model="customCheckVisible"
      title="新增自定义盘点"
      size="500px"
      direction="rtl"
      destroy-on-close
    >
      <el-form ref="customCheckFormRef" :model="customCheckForm" :rules="customCheckRules" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="customCheckForm.title" placeholder="请输入标题" class="form-input" />
        </el-form-item>
        <el-form-item label="盘点单附件">
          <el-link type="primary" :underline="false" :icon="Paperclip">添加</el-link>
        </el-form-item>
        <el-form-item label="盘点日期" prop="checkDate">
          <el-date-picker
            v-model="customCheckForm.checkDate"
            type="date"
            placeholder="请选择日期"
            class="form-input"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="盘点结果" prop="result">
          <el-radio-group v-model="customCheckForm.result">
            <el-radio value="盘盈">盘盈</el-radio>
            <el-radio value="盘亏">盘亏</el-radio>
            <el-radio value="正常">正常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="customCheckForm.remark" type="textarea" :rows="3" placeholder="请输入备注" class="form-input" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="customCheckVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCustomCheckSubmit">确认</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Search, Plus, Reading, CircleCheck, WarningFilled, List, Paperclip } from '@element-plus/icons-vue'
import { checkRecordData } from '@/mock/resource/warehouseData'
import type { CheckResultType, StockCheckForm, OutCheckForm, CustomCheckForm } from '@/types/resource/warehouse'

const loading = ref(false)

const searchKeyword = ref('')
const currentResult = ref('all')

const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

const warehouseOptions = ['广东省交通运输厅808室', '广东省交通运输厅809室']

const statsCards = computed(() => {
  const data = checkRecordData
  return [
    { key: 'all', label: '全部', value: data.length, icon: Reading, color: '#409EFF', bgColor: '#ecf5ff' },
    { key: '盘盈', label: '盘盈', value: data.filter(d => d.result === '盘盈').length, icon: CircleCheck, color: '#409EFF', bgColor: '#ecf5ff' },
    { key: '盘亏', label: '盘亏', value: data.filter(d => d.result === '盘亏').length, icon: WarningFilled, color: '#F56C6C', bgColor: '#fef0f0' },
    { key: '正常', label: '正常', value: data.filter(d => d.result === '正常').length, icon: CircleCheck, color: '#909399', bgColor: '#f4f4f5' }
  ]
})

const filteredData = computed(() => {
  let data = [...checkRecordData]
  if (currentResult.value !== 'all') {
    data = data.filter(item => item.result === currentResult.value)
  }
  if (searchKeyword.value) {
    data = data.filter(item =>
      item.title.includes(searchKeyword.value) ||
      item.checkCode.includes(searchKeyword.value) ||
      item.remark.includes(searchKeyword.value)
    )
  }
  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

const tableData = computed(() => filteredData.value)

function handleResultChange(key: string) {
  currentResult.value = key
  pagination.page = 1
}

function handleSearch() {
  pagination.page = 1
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handlePageChange(page: number) {
  pagination.page = page
}

function handleAddCommand(command: string) {
  if (command === 'stockCheck') {
    stockCheckVisible.value = true
  } else if (command === 'outCheck') {
    outCheckVisible.value = true
  } else if (command === 'customCheck') {
    customCheckVisible.value = true
  }
}

// ── 库存装备盘点 ──
const stockCheckVisible = ref(false)
const stockCheckFormRef = ref<FormInstance>()
const stockCheckForm = reactive<StockCheckForm>({
  title: '',
  attachment: '',
  warehouse: '',
  checkDate: '',
  result: '正常',
  remark: ''
})
const stockCheckRules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  warehouse: [{ required: true, message: '请选择盘点仓库', trigger: 'change' }],
  checkDate: [{ required: true, message: '请选择盘点日期', trigger: 'change' }],
  result: [{ required: true, message: '请选择盘点结果', trigger: 'change' }]
}

function handleStockCheckSubmit() {
  stockCheckFormRef.value?.validate(valid => {
    if (valid) {
      ElMessage.success('新增库存装备盘点成功')
      stockCheckVisible.value = false
    }
  })
}

// ── 库外装备盘点 ──
const outCheckVisible = ref(false)
const outCheckFormRef = ref<FormInstance>()
const outCheckForm = reactive<OutCheckForm>({
  title: '',
  attachment: '',
  address: '',
  checkDate: '',
  result: '正常',
  remark: ''
})
const outCheckRules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  address: [{ required: true, message: '请输入盘点地址', trigger: 'blur' }],
  checkDate: [{ required: true, message: '请选择盘点日期', trigger: 'change' }],
  result: [{ required: true, message: '请选择盘点结果', trigger: 'change' }]
}

function handleOutCheckSubmit() {
  outCheckFormRef.value?.validate(valid => {
    if (valid) {
      ElMessage.success('新增库外装备盘点成功')
      outCheckVisible.value = false
    }
  })
}

// ── 自定义盘点 ──
const customCheckVisible = ref(false)
const customCheckFormRef = ref<FormInstance>()
const customCheckForm = reactive<CustomCheckForm>({
  title: '',
  attachment: '',
  checkDate: '',
  result: '正常',
  remark: ''
})
const customCheckRules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  checkDate: [{ required: true, message: '请选择盘点日期', trigger: 'change' }],
  result: [{ required: true, message: '请选择盘点结果', trigger: 'change' }]
}

function handleCustomCheckSubmit() {
  customCheckFormRef.value?.validate(valid => {
    if (valid) {
      ElMessage.success('新增自定义盘点成功')
      customCheckVisible.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.inventory-query-page {
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

    .stats-row {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-bottom: 16px;
      padding: 16px 0;
      background: #f8f9fb;
      border-radius: 10px;
      flex-shrink: 0;
    }

    .stats-card {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 200px;
      padding: 14px 18px;
      background: #fff;
      border: 2px solid transparent;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      &.active {
        border-color: #409eff;
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
      }

      .stats-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .stats-info {
        .stats-value {
          font-size: 26px;
          font-weight: 700;
          line-height: 1.2;
        }
        .stats-label {
          font-size: 13px;
          color: #909399;
          margin-top: 4px;
        }
      }
    }

    .content-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;

      .record-count {
        font-size: 14px;
        color: #909399;
      }

      .content-header-left {
        flex: 1;
      }

      .content-header-right {
        display: flex;
        align-items: center;
      }
    }

    .table-wrapper {
      flex: 1;
      overflow: auto;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }

  .form-input {
    width: 100%;
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
