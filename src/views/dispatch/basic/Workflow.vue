<template>
  <div class="page-container">
    <div class="page-header">
      <h2>工作流程管理</h2>
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新建流程
      </el-button>
    </div>

    <el-table
      :data="mockWorkflowList"
      border
      stripe
      :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
      class="data-table"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="name" label="流程名称" min-width="150" show-overflow-tooltip />
      <el-table-column prop="code" label="流程编号" width="120" align="center" />
      <el-table-column prop="scenario" label="业务场景" width="120" align="center" />
      <el-table-column prop="type" label="流程类型" width="100" align="center" />
      <el-table-column prop="version" label="版本号" width="80" align="center" />
      <el-table-column prop="versionDesc" label="版本说明" min-width="150" show-overflow-tooltip />
      <el-table-column label="是否最新" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.isLatest ? 'success' : 'info'" size="small">
            {{ row.isLatest ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.publishStatus === 'published' ? 'success' : 'warning'" size="small">
            {{ row.publishStatus === 'published' ? '已发布' : '未发布' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="使用状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.useStatus === 'enabled' ? 'success' : 'info'" size="small">
            {{ row.useStatus === 'enabled' ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="160" align="center" />
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleDesign(row)">
            <el-icon><Connection /></el-icon>
            流程设计
          </el-button>
          <el-button
            v-if="row.allowEdit"
            type="primary"
            link
            size="small"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="row.allowDelete"
            type="danger"
            link
            size="small"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { Plus, Connection } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { mockWorkflowList } from '@/mock/workflow/workflowData'
import type { WorkflowItem } from '@/types/workflow'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleCreate = () => {
  ElMessage.info('新建流程功能开发中...')
}

const handleDesign = (row: WorkflowItem) => {
  // 在新页面中打开流程设计器
  const route = router.resolve({
    path: '/dispatch/basic/workflow-designer',
    query: { id: row.id, name: row.name }
  })
  window.open(route.href, '_blank')
}

const handleEdit = (row: WorkflowItem) => {
  ElMessage.info(`编辑流程: ${row.name}`)
}

const handleDelete = (row: WorkflowItem) => {
  ElMessageBox.confirm(`确定要删除流程"${row.name}"吗？`, '删除确认', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {
    // 取消删除
  })
}
</script>

<style lang="scss" scoped>
.page-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
}

.data-table {
  width: 100%;
}
</style>
