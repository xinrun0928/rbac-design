<template>
  <div class="schedule-management">
    <el-card shadow="never">
      <el-empty description="排班计划 - 开发中" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.schedule-management {
  :deep(.el-card) {
    border-radius: 12px;
    border: none;
    min-height: 400px;
  }
}
</style>
