<template>
  <div class="event-document-page">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <span class="search-bar-title">文档库</span>
        <div class="search-bar-actions">
          <el-input
            v-model="keyword"
            placeholder="搜索文档标题"
            clearable
            :prefix-icon="Search"
            style="width: 200px; margin-right: 12px"
            @input="handleSearch"
            @clear="handleSearch"
          />
          <el-button type="primary" :icon="Plus" @click="handleAdd">文档</el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="id"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="title" label="文档标题" min-width="260">
          <template #default="{ row }">
            <span class="title-text">{{ row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="docType" label="文档类型" width="120" align="center">
          <template #default="{ row }">
            <span class="doc-type-text">{{ row.docType }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="relatedEvent" label="关联事件" min-width="240" show-overflow-tooltip align="left" />

        <el-table-column prop="creator" label="创建人" width="100" align="center" />

        <el-table-column prop="createTime" label="创建时间" width="180" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" :icon="View" @click="handleView(row)">
              查看
            </el-button>
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

    <!-- 新增/查看文档抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="isView ? '文档详情' : '添加文档'"
      size="500px"
      direction="rtl"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="90px"
        :disabled="isView"
      >
        <el-form-item label="文档标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入文档标题" />
        </el-form-item>
        <el-form-item label="文档类型" prop="docType">
          <el-select v-model="formData.docType" placeholder="请选择文档类型" style="width: 100%">
            <el-option label="专项预案" value="专项预案" />
            <el-option label="处置方案" value="处置方案" />
            <el-option label="应急预案" value="应急预案" />
            <el-option label="通知" value="通知" />
            <el-option label="报告" value="报告" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联事件" prop="relatedEvent">
          <el-select v-model="formData.relatedEvent" placeholder="请选择关联事件" style="width: 100%" filterable>
            <el-option
              v-for="event in relatedEvents"
              :key="event"
              :label="event"
              :value="event"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer v-if="!isView">
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Plus, View } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { mockEventDocumentData } from '@/mock/event/documentData'
import type { EventDocument } from '@/types/event/document'

const loading = ref(false)
const keyword = ref('')
const drawerVisible = ref(false)
const isView = ref(false)
const formRef = ref<FormInstance>()

const tableData = ref<EventDocument[]>([...mockEventDocumentData])

// 关联事件选项（从 mockEventReportData 提取）
const relatedEvents = [
  'G15沈海高速货车追尾事故',
  'S81广州环城高速路面塌方',
  '京港澳高速韶关段山体滑坡',
  'G4W广澳高速中山段交通事故',
  'G94珠三角环线高速暴雨积水',
  'S304省道清远段路基塌陷',
  '广深高速虎门大桥拥堵事件',
  'G78汕昆高速多车追尾事故',
  '广清高速暴雨内涝交通中断事件',
  '广清高速危化品泄漏事件',
  '广州环城高速严重拥堵事件',
  '山区滑坡导致道路中断事件',
  'G4京港澳高速大雾天气应急响应',
  'G6京藏高速桥梁震后安全检查',
  'G45大广高速高温行车安全提示',
  'S303省道梅州段山体落石',
  'G45大广高速韶关段边坡滑塌',
]

const pagination = ref({
  page: 1,
  pageSize: 20,
  total: 0
})

const formData = ref({
  title: '',
  docType: '',
  relatedEvent: ''
})

const formRules: FormRules = {
  title: [{ required: true, message: '请输入文档标题', trigger: 'blur' }],
  docType: [{ required: true, message: '请选择文档类型', trigger: 'change' }],
  relatedEvent: [{ required: true, message: '请选择关联事件', trigger: 'change' }]
}

const filteredData = computed(() => {
  let data = tableData.value

  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    data = data.filter(item =>
      item.title.toLowerCase().includes(kw)
    )
  }

  pagination.value.total = data.length
  const start = (pagination.value.page - 1) * pagination.value.pageSize
  return data.slice(start, start + pagination.value.pageSize)
})

function handleSearch() {
  pagination.value.page = 1
}

function handleAdd() {
  isView.value = false
  formData.value = { title: '', docType: '', relatedEvent: '' }
  drawerVisible.value = true
}

function handleView(row: EventDocument) {
  isView.value = true
  formData.value = {
    title: row.title,
    docType: row.docType,
    relatedEvent: row.relatedEvent
  }
  drawerVisible.value = true
}

function handleSubmit() {
  formRef.value?.validate(valid => {
    if (valid) {
      const now = new Date()
      const pad = (n: number) => String(n).padStart(2, '0')
      const createTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

      const newId = Math.max(...tableData.value.map(item => item.id)) + 1
      tableData.value.unshift({
        id: newId,
        title: formData.value.title,
        docType: formData.value.docType,
        relatedEvent: formData.value.relatedEvent,
        creator: '当前用户',
        createTime
      })

      ElMessage.success('添加成功')
      drawerVisible.value = false
    }
  })
}

function handleSizeChange(size: number) {
  pagination.value.pageSize = size
  pagination.value.page = 1
}

function handlePageChange(page: number) {
  pagination.value.page = page
}
</script>

<style lang="scss" scoped>
.event-document-page {
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
      flex-shrink: 0;
    }

    .data-table { flex: 1; }

    .title-text {
      font-weight: 500;
      color: #303133;
      font-size: 14px;
      line-height: 1.5;
    }

    .doc-type-text {
      font-size: 13px;
      color: #606266;
    }

    .time-text {
      font-size: 13px;
      color: #909399;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
