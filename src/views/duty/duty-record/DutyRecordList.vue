<template>
  <div class="duty-record-list-page">
    <el-card shadow="never">
      <el-empty description="值班记录 - 开发中" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.duty-record-list-page {
  :deep(.el-card) {
    border-radius: 12px;
    border: none;
    min-height: 400px;
  }
}
</style>
