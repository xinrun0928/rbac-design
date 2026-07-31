<template>
  <div class="inspection-container">
    <div class="inspection-welcome">
      <el-icon :size="80" color="#409EFF"><View /></el-icon>
      <h2>汛期巡查子系统</h2>
      <p>汛期巡查、隐患上报、整改跟踪</p>
      <el-tag type="warning" size="large">模块开发中...</el-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { View } from '@element-plus/icons-vue'
</script>

<style scoped>
.inspection-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.inspection-welcome {
  text-align: center;
  padding: 60px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.inspection-welcome h2 {
  font-size: 32px;
  font-weight: 600;
  color: #303133;
  margin: 24px 0 12px;
}

.inspection-welcome p {
  font-size: 16px;
  color: #909399;
  margin-bottom: 24px;
}
</style>
