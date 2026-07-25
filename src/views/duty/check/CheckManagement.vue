<template>
  <div class="check-management-page">
    <el-card shadow="never">
      <el-empty description="值班查岗 - 开发中" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.check-management-page {
  height: 100%;
  background: linear-gradient(160deg, #F5F7FA 0%, #E8ECF1 100%);

  :deep(.el-card) {
    border-radius: 12px;
    border: none;
    min-height: 400px;
    background: #ffffff;
  }
}
</style>
