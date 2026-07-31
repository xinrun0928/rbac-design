<template>
  <el-table
    v-loading="loading"
    :data="data"
    border
    stripe
    highlight-current-row
    row-key="id"
    :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
    class="data-table"
  >
    <el-table-column type="index" label="序号" width="60" align="center" />

    <el-table-column prop="name" label="装备/物资名称" min-width="160" align="center" show-overflow-tooltip>
      <template #default="{ row }">
        <el-link type="primary" :underline="false" @click="$emit('showDetail', row)">{{ row.name }}</el-link>
      </template>
    </el-table-column>

    <el-table-column prop="type" label="类型" min-width="200" align="center" show-overflow-tooltip />

    <el-table-column prop="spec" label="型号规格" min-width="200" align="center" show-overflow-tooltip />

    <el-table-column prop="stockQuantity" label="库存数量" width="100" align="center" />

    <el-table-column prop="unit" label="单位" width="80" align="center" />

    <el-table-column prop="maintenanceStatus" label="维保状态" width="120" align="center">
      <template #default="{ row }">
        <el-link
          v-if="row.pendingCount"
          type="danger"
          :underline="false"
        >{{ row.maintenanceStatus }}（{{ row.pendingCount }}）</el-link>
        <el-link v-else type="success" :underline="false">{{ row.maintenanceStatus }}</el-link>
      </template>
    </el-table-column>

    <el-table-column prop="location" label="存放位置" width="100" align="center" />

    <el-table-column prop="department" label="负责单位" min-width="160" align="center" show-overflow-tooltip />

    <el-table-column prop="lastMaintenanceDate" label="最近维保日期" width="130" align="center" />

    <el-table-column prop="nextMaintenanceDate" label="下次维保日期" width="130" align="center" />

    <el-table-column label="操作" width="230" align="center" fixed="right">
      <template #default="{ row }">
        <el-button type="primary" link :icon="View" @click="$emit('showDetail', row)">详情</el-button>
        <el-button type="warning" link :icon="Edit" @click="$emit('edit', row)">编辑</el-button>
        <el-button type="danger" link :icon="Delete" @click="$emit('delete', row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { View, Edit, Delete } from '@element-plus/icons-vue'
import type { InventorySummary } from '@/types/resource/warehouse'

defineProps<{
  data: InventorySummary[]
  loading: boolean
}>()

defineEmits<{
  showDetail: [row: InventorySummary]
  edit: [row: InventorySummary]
  delete: [row: InventorySummary]
}>()
</script>
