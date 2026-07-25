<template>
  <div class="duty-dashboard">
    <el-card shadow="never">
      <el-empty description="工作台 - 开发中" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.duty-dashboard {
  :deep(.el-card) {
    border-radius: 12px;
    border: none;
    min-height: 400px;
  }
}
</style>
