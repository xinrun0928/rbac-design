<template>
  <div class="knowledge-category-page">
    <!-- 记录数 -->
    <div class="record-count">共{{ tableData.length }}条记录</div>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="name" label="类别名称" min-width="200" />

        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'info'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="lastModifyTime" label="最后修改时间" width="180" align="center" />

        <el-table-column prop="lastOperator" label="最后操作人" width="120" align="center" />

        <el-table-column prop="totalCount" label="知识总数" width="120" align="center" />

        <el-table-column label="操作" width="240" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small">编辑</el-button>
            <el-button type="primary" link size="small">添加下级</el-button>
            <el-button type="danger" link size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { mockKnowledgeCategory } from '@/mock/dss/knowledgeData'
import type { KnowledgeCategory } from '@/types/dss'

const loading = ref(false)
const tableData = ref<KnowledgeCategory[]>(mockKnowledgeCategory)
</script>

<style lang="scss" scoped>
.knowledge-category-page {
  padding: 0;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.record-count {
  padding: 20px 24px 12px;
  font-size: 14px;
  color: #909399;
}

.table-card {
  margin: 0 24px 24px;
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
}

.data-table {
  flex: 1;

  .el-table__row .cell {
    display: flex;
    align-items: center;
  }

  .el-table__row .el-table__cell:not(:first-child) .cell {
    justify-content: center;
  }
}
</style>
