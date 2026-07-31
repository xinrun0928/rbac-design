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

    <el-table-column prop="name" label="装备/物资名称" min-width="140" align="center" show-overflow-tooltip>
      <template #default="{ row }">
        <el-link type="primary" :underline="false" @click="$emit('showDetail', row)">{{ row.name }}</el-link>
      </template>
    </el-table-column>

    <el-table-column prop="code" label="装备/物资编号" min-width="160" align="center" show-overflow-tooltip>
      <template #default="{ row }">
        <el-link type="primary" :underline="false">{{ row.code }}</el-link>
      </template>
    </el-table-column>

    <el-table-column prop="serialNumber" label="序列号" min-width="140" align="center" show-overflow-tooltip />

    <el-table-column prop="category" label="种类" min-width="180" align="center" show-overflow-tooltip />

    <el-table-column prop="spec" label="型号规格" min-width="200" align="center" show-overflow-tooltip />

    <el-table-column prop="unit" label="单位" width="80" align="center" />

    <el-table-column prop="insurance" label="装备/物资保险" min-width="160" align="center" show-overflow-tooltip>
      <template #default="{ row }">
        <span v-if="row.insuranceExpired" class="insurance-expired">{{ row.insurance }}（已过期）</span>
        <span v-else-if="row.insuranceExpiring" class="insurance-expiring">{{ row.insurance }}（即将过期）</span>
        <span v-else>{{ row.insurance }}</span>
      </template>
    </el-table-column>

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

    <el-table-column prop="department" label="负责单位" min-width="140" align="center" show-overflow-tooltip />

    <el-table-column prop="lastMaintenanceDate" label="最近维保日期" width="130" align="center" />

    <el-table-column prop="nextMaintenanceDate" label="下次维保日期" width="130" align="center" />

    <el-table-column label="操作" width="220" align="center" fixed="right">
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
import type { InventoryDetail } from '@/types/resource/warehouse'

defineProps<{
  data: InventoryDetail[]
  loading: boolean
}>()

defineEmits<{
  showDetail: [row: InventoryDetail]
  edit: [row: InventoryDetail]
  delete: [row: InventoryDetail]
}>()
</script>

<style lang="scss" scoped>
.insurance-expired {
  color: #F56C6C;
  font-weight: 500;
}
.insurance-expiring {
  color: #E6A23C;
  font-weight: 500;
}
</style>
