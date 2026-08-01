<template>
  <div class="knowledge-expire-page">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部统计卡片 -->
      <StatsCards v-model="activeCategory" :items="statsCards" :card-width="180" @change="handleStatsChange" />

      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="search-bar-filter">
          <span class="filter-label">类型：</span>
          <el-link
            v-for="status in handleStatuses"
            :key="status"
            class="filter-link"
            :underline="false"
            :type="activeHandleStatus === status ? 'primary' : 'info'"
            @click="activeHandleStatus = status"
          >{{ status }}</el-link>
        </div>
        <div class="search-bar-actions">
          <el-button type="primary" @click="handleCreate">+ 新建</el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        highlight-current-row
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="handleStatus" label="处理状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.handleStatus === '待处理' ? 'warning' : 'success'" size="small">{{ row.handleStatus }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="知识名称" min-width="280" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="course-name-text">{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="code" label="编号" min-width="180" align="center">
          <template #default="{ row }">
            <span class="code-text">{{ row.code }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="类型" width="120" align="center" />

        <el-table-column prop="validPeriod" label="有效期" width="200" align="center">
          <template #default="{ row }">
            <span class="equipment-info-text">{{ row.validPeriod }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="source" label="来源" width="100" align="center" />

        <el-table-column prop="applicant" label="申请人" width="160" align="center" />

        <el-table-column prop="applyDate" label="申请日期" width="120" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.applyDate }}</span>
          </template>
        </el-table-column>

        <el-table-column label="相关附件" width="80" align="center">
          <template #default>
            <el-button type="primary" link :icon="Paperclip" />
          </template>
        </el-table-column>

        <el-table-column prop="handler" label="处理人" width="120" align="center">
          <template #default="{ row }">
            <el-button v-if="row.handleStatus === '待处理' && row.handler === '-'" type="primary" size="small">立即处理</el-button>
            <span v-else>{{ row.handler }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="handleResult" label="处理结果" width="120" align="center" />

        <el-table-column prop="handleDesc" label="处理说明" min-width="250" show-overflow-tooltip />

        <el-table-column prop="handleDate" label="处理日期" width="120" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.handleDate }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="60" align="center" fixed="right">
          <template #default>
            <el-button type="primary" link :icon="MoreFilled" />
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

    <!-- 新建申请抽屉 -->
    <el-drawer v-model="drawerVisible" title="新建申请" size="500px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="申请类型" prop="applyType">
          <el-radio-group v-model="formData.applyType">
            <el-radio value="报废">设备报废</el-radio>
            <el-radio value="退役">设备退役</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="选择设备" prop="device">
          <el-select v-model="formData.device" placeholder="请输入设备名称或编码搜索" filterable style="width: 100%">
            <el-option label="设备A" value="设备A" />
            <el-option label="设备B" value="设备B" />
          </el-select>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="4" placeholder="描述检查对象，让大模型更好的理解它" />
        </el-form-item>

        <el-form-item label="相关附件">
          <el-button type="primary" link :icon="Paperclip">添加</el-button>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交申请</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { MoreFilled, Paperclip, Document, Collection, Tickets, Stamp } from '@element-plus/icons-vue'
import { mockExpireKnowledge } from '@/mock/dss/knowledgeData'
import type { ExpireKnowledge } from '@/types/dss'
import StatsCards from '@/components/StatsCards.vue'

const loading = ref(false)
const allData = ref<ExpireKnowledge[]>(mockExpireKnowledge)
const activeCategory = ref('全部')
const activeHandleStatus = ref('全部')
const drawerVisible = ref(false)
const formRef = ref()

const statsCards = [
  { key: '全部', label: '全部', value: 6, icon: Document, color: '#409EFF', bgColor: '#ecf5ff' },
  { key: '历史案例', label: '历史案例', value: 2, icon: Collection, color: '#67C23A', bgColor: '#f0f9eb' },
  { key: '政策法规', label: '政策法规', value: 3, icon: Tickets, color: '#E6A23C', bgColor: '#fdf6ec' },
  { key: '专家知识', label: '专家知识', value: 1, icon: Stamp, color: '#F56C6C', bgColor: '#fef0f0' },
  { key: '标准规范', label: '标准规范', value: 1, icon: Document, color: '#909399', bgColor: '#f4f4f5' }
]

const handleStatuses = ['全部', '待处理', '已处理']

const formData = reactive({
  applyType: '报废',
  device: '',
  description: ''
})

const formRules = {
  applyType: [{ required: true, message: '请选择申请类型', trigger: 'change' }],
  device: [{ required: true, message: '请选择设备', trigger: 'change' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }]
}

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const filteredData = computed(() => {
  let data = allData.value

  if (activeCategory.value !== '全部') {
    data = data.filter(item => item.type === activeCategory.value)
  }

  if (activeHandleStatus.value !== '全部') {
    data = data.filter(item => item.handleStatus === activeHandleStatus.value)
  }

  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

const tableData = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  return filteredData.value.slice(start, start + pagination.pageSize)
})

function handleCreate() {
  drawerVisible.value = true
}

function handleSubmit() {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      ElMessage.success('提交成功')
      drawerVisible.value = false
    }
  })
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handlePageChange(page: number) {
  pagination.page = page
}

function handleStatsChange() {
  pagination.page = 1
}
</script>

<style lang="scss" scoped>
.knowledge-expire-page {
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

    .search-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #ebeef5;
    }

    .search-bar-filter {
      display: flex;
      align-items: center;
      gap: 12px;

      .filter-label {
        font-size: 14px;
        color: #606266;
        font-weight: 600;
      }

      .filter-link {
        font-size: 14px;

        &.el-link--primary {
          font-weight: 600;
        }
      }
    }

    .search-bar-actions {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .course-name-text {
      font-weight: 500;
      color: #303133;
    }

    .code-text {
      font-family: Consolas, Monaco, monospace;
      font-size: 13px;
      color: #606266;
    }

    .equipment-info-text {
      font-size: 13px;
      color: #606266;
      line-height: 1.5;
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
