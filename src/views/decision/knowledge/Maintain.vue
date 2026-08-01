<template>
  <div class="knowledge-maintain-page">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部统计卡片 -->
      <div class="stats-row">
        <div
          v-for="tab in categoryTabs"
          :key="tab.key"
          class="stats-card"
          :class="{ active: activeCategory === tab.key }"
          @click="activeCategory = tab.key"
        >
          <div class="stats-icon" :style="{ background: tab.bgColor, color: tab.color }">
            <el-icon :size="26"><component :is="tab.icon" /></el-icon>
          </div>
          <div class="stats-info">
            <div class="stats-value" :style="{ color: tab.color }">{{ tab.count }}</div>
            <div class="stats-label">{{ tab.label }}</div>
          </div>
        </div>
      </div>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="search-bar-filter">
          <span class="filter-label">启用状态：</span>
          <el-link
            v-for="status in enableStatuses"
            :key="status.value"
            class="filter-link"
            :underline="false"
            :type="activeEnableStatus === status.value ? 'primary' : 'info'"
            @click="activeEnableStatus = status.value"
          >{{ status.label }}</el-link>
        </div>
        <div class="search-bar-actions">
          <el-button type="primary" @click="handleCreate">+ 新建计划</el-button>
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
        <el-table-column prop="name" label="计划名称" min-width="320" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="course-name-text">{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="relatedType" label="关联知识类型" width="130" align="center">
          <template #default="{ row }">
            <span class="code-text">{{ row.relatedType }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="cycle" label="更新周期" width="120" align="center">
          <template #default="{ row }">
            <span class="code-text">{{ row.cycle }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="enabled" label="启用状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.enabled === '已启用' ? 'success' : 'info'" size="small">{{ row.enabled }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="creator" label="计划创建人" width="120" align="center">
          <template #default="{ row }">
            <span class="creator-name">{{ row.creator }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="lastModifier" label="最近修改人" width="120" align="center">
          <template #default="{ row }">
            <span class="creator-name">{{ row.lastModifier }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="lastModifyTime" label="最近修改时间" width="140" align="center">
          <template #default="{ row }">
            <span class="creator-time">{{ row.lastModifyTime }}</span>
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

    <!-- 新建计划抽屉 -->
    <el-drawer v-model="drawerVisible" title="新建更新计划" size="500px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="120px">
        <el-form-item label="更新计划名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="更新对象类型" prop="targetType">
          <el-radio-group v-model="formData.targetType">
            <el-radio value="byType">按类型选择</el-radio>
            <el-radio value="byKnowledge">指定知识内容</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="formData.targetType === 'byType'" prop="selectedType">
          <el-select v-model="formData.selectedType" placeholder="请选择" style="width: 100%">
            <el-option label="历史案例" value="历史案例" />
            <el-option label="政策法规" value="政策法规" />
            <el-option label="专家知识" value="专家知识" />
            <el-option label="标准规范" value="标准规范" />
          </el-select>
        </el-form-item>

        <el-form-item label="作业内容" prop="content">
          <el-input v-model="formData.content" type="textarea" :rows="4" placeholder="具体更新/维护内容" />
        </el-form-item>

        <el-form-item label="更新周期" prop="cycle">
          <el-select v-model="formData.cycle" placeholder="请选择" style="width: 100%">
            <el-option label="每日" value="每日" />
            <el-option label="每周" value="每周" />
            <el-option label="每月" value="每月" />
            <el-option label="每季度" value="每季度" />
            <el-option label="每年" value="每年" />
          </el-select>
        </el-form-item>

        <el-form-item label="执行人" prop="executor">
          <el-select v-model="formData.executor" placeholder="请选择" style="width: 100%">
            <el-option label="张三" value="张三" />
            <el-option label="李四" value="李四" />
            <el-option label="王五" value="王五" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="formData.remark" placeholder="请输入" />
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
import { ElMessage } from 'element-plus'
import { MoreFilled, Document, Tickets, Notebook, Stamp, Files } from '@element-plus/icons-vue'
import { mockMaintainPlans } from '@/mock/dss/knowledgeData'
import type { KnowledgeMaintainPlan } from '@/types/dss'

const loading = ref(false)
const allData = ref<KnowledgeMaintainPlan[]>(mockMaintainPlans)
const activeCategory = ref('全部')
const activeEnableStatus = ref('all')
const drawerVisible = ref(false)
const formRef = ref()

const categoryTabs = [
  { key: '全部', label: '全部', count: 6, icon: Files, color: '#409EFF', bgColor: '#ecf5ff' },
  { key: '历史案例', label: '历史案例', count: 2, icon: Document, color: '#67C23A', bgColor: '#f0f9eb' },
  { key: '政策法规', label: '政策法规', count: 1, icon: Tickets, color: '#E6A23C', bgColor: '#fdf6ec' },
  { key: '专家知识', label: '专家知识', count: 1, icon: Notebook, color: '#F56C6C', bgColor: '#fef0f0' },
  { key: '标准规范', label: '标准规范', count: 2, icon: Stamp, color: '#909399', bgColor: '#f4f4f5' }
]

const enableStatuses = [
  { label: '全部', value: 'all' },
  { label: '已启用', value: 'enabled' },
  { label: '未启用', value: 'disabled' }
]

const formData = reactive({
  name: '',
  targetType: 'byType',
  selectedType: '',
  content: '',
  cycle: '每日',
  executor: '',
  remark: ''
})

const formRules = {
  name: [{ required: true, message: '请输入更新计划名称', trigger: 'blur' }],
  content: [{ required: true, message: '请输入作业内容', trigger: 'blur' }],
  cycle: [{ required: true, message: '请选择更新周期', trigger: 'change' }],
  executor: [{ required: true, message: '请选择执行人', trigger: 'change' }]
}

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const filteredData = computed(() => {
  let data = allData.value

  if (activeCategory.value !== '全部') {
    data = data.filter(item => item.relatedType === activeCategory.value)
  }

  if (activeEnableStatus.value !== 'all') {
    const enabled = activeEnableStatus.value === 'enabled'
    data = data.filter(item => (item.enabled === '已启用') === enabled)
  }

  pagination.total = data.length
  return data
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
      ElMessage.success('操作成功')
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
</script>

<style lang="scss" scoped>
.knowledge-maintain-page {
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

    // ── 顶部统计卡片 ──
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

    // ── 搜索栏 ──
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

    .creator-name {
      font-size: 13px;
      color: #303133;
      font-weight: 500;
    }

    .creator-time {
      font-size: 13px;
      color: #909399;
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
