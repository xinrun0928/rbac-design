<template>
  <div class="deploy-page">
    <div class="deploy-card">
      <header class="deploy-header">
        <button type="button" class="back-btn" title="返回" @click="goSpecs">
          <el-icon><Back /></el-icon>
        </button>
        <div class="deploy-header-text">
          <h2>部署架构图</h2>
          <p>Deployment Architecture</p>
        </div>
        <div class="deploy-header-actions">
          <button type="button" class="download-btn" title="下载图片" @click="handleDownload">
            <el-icon><Download /></el-icon>
            <span>下载</span>
          </button>
        </div>
      </header>

      <div class="deploy-body">
        <img :src="deployImg" alt="部署架构图" class="deploy-img" />
        <p class="deploy-tip">提示：可滚动 / 缩放查看大图</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Back, Download } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import deployImg from '../../../docs/部署架构图.png'

const router = useRouter()

function goSpecs() {
  router.push('/specs/architecture')
}

function handleDownload() {
  const link = document.createElement('a')
  link.href = deployImg
  link.download = '部署架构图.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  ElMessage.success('图片下载已开始')
}
</script>

<style scoped lang="scss">
.deploy-page {
  height: 100vh;
  display: flex;
  padding: 0;
  background: linear-gradient(160deg, #f5f7fa 0%, #eef1f6 100%);
  box-sizing: border-box;
}

.deploy-card {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(31, 45, 61, 0.06);
  border: 1px solid #ebeef5;
  overflow: hidden;
}

.deploy-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  color: #fff;
  background: linear-gradient(120deg, #0a2a6b 0%, #0b3d91 55%, #0f6bd0 100%);
  box-shadow: 0 4px 16px rgba(11, 61, 145, 0.3);

  .back-btn {
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #fff;
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.28);
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.26);
      transform: translateX(-2px);
    }
  }

  .deploy-header-text {
    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
    p {
      margin: 2px 0 0;
      font-size: 11px;
      opacity: 0.75;
      letter-spacing: 0.3px;
    }
  }

  .deploy-header-actions {
    margin-left: auto;
  }

  .download-btn {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 10px;
    font-size: 13px;
    color: #fff;
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.28);
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.26);
    }
  }
}

.deploy-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;

  .deploy-img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(31, 45, 61, 0.08);
    border: 1px solid #eef1f6;
  }

  .deploy-tip {
    margin: 14px 0 0;
    font-size: 12px;
    color: #909399;
  }
}
</style>