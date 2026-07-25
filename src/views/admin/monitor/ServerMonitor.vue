<template>
  <div class="server-monitor">
    <!-- CPU信息 -->
    <div class="monitor-row animate-item">
      <el-card shadow="never" class="info-card cpu-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="18"><Cpu /></el-icon>
            <span>CPU</span>
          </div>
        </template>
        <div class="cpu-grid">
          <div class="cpu-item">
            <div class="cpu-value">{{ data.cpu.coreNum }}</div>
            <div class="cpu-label">核心数</div>
          </div>
          <div class="cpu-item">
            <div class="cpu-value" :class="getUsageClass(data.cpu.userUsage)">{{ data.cpu.userUsage }}%</div>
            <div class="cpu-label">用户使用率</div>
            <el-progress :percentage="data.cpu.userUsage" :color="getProgressColor(data.cpu.userUsage)" :stroke-width="8" :show-text="false" />
          </div>
          <div class="cpu-item">
            <div class="cpu-value" :class="getUsageClass(data.cpu.sysUsage)">{{ data.cpu.sysUsage }}%</div>
            <div class="cpu-label">系统使用率</div>
            <el-progress :percentage="data.cpu.sysUsage" :color="getProgressColor(data.cpu.sysUsage)" :stroke-width="8" :show-text="false" />
          </div>
          <div class="cpu-item">
            <div class="cpu-value" :class="getUsageClass(100 - data.cpu.idleRate)">{{ data.cpu.idleRate }}%</div>
            <div class="cpu-label">当前空闲率</div>
            <el-progress :percentage="data.cpu.idleRate" :color="getProgressColor(100 - data.cpu.idleRate)" :stroke-width="8" :show-text="false" />
          </div>
        </div>
      </el-card>
    </div>

    <!-- 内存信息 -->
    <div class="monitor-row animate-item">
      <el-card shadow="never" class="info-card memory-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="18"><Coin /></el-icon>
            <span>内存</span>
          </div>
        </template>
        <div class="memory-grid">
          <div class="memory-item">
            <div class="memory-value">{{ data.memory.total }} GB</div>
            <div class="memory-label">总内存</div>
          </div>
          <div class="memory-item">
            <div class="memory-value used">{{ data.memory.used }} GB</div>
            <div class="memory-label">已用内存</div>
          </div>
          <div class="memory-item">
            <div class="memory-value free">{{ data.memory.free }} GB</div>
            <div class="memory-label">剩余内存</div>
          </div>
          <div class="memory-item">
            <div class="memory-value" :class="getUsageClass(data.memory.usageRate)">{{ data.memory.usageRate }}%</div>
            <div class="memory-label">使用率</div>
            <el-progress :percentage="data.memory.usageRate" :color="getProgressColor(data.memory.usageRate)" :stroke-width="8" :show-text="false" />
          </div>
        </div>
      </el-card>
    </div>

    <!-- 服务器信息 & JVM信息 -->
    <div class="monitor-row two-col animate-item">
      <el-card shadow="never" class="info-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="18"><Monitor /></el-icon>
            <span>服务器信息</span>
          </div>
        </template>
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="服务器名称">{{ data.server.name }}</el-descriptions-item>
          <el-descriptions-item label="操作系统">{{ data.server.os }}</el-descriptions-item>
          <el-descriptions-item label="服务器IP">{{ data.server.ip }}</el-descriptions-item>
          <el-descriptions-item label="系统架构">{{ data.server.arch }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card shadow="never" class="info-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="18"><Opportunity /></el-icon>
            <span>Java虚拟机信息</span>
          </div>
        </template>
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="Java名称" :span="2">{{ data.jvm.name }}</el-descriptions-item>
          <el-descriptions-item label="Java版本">{{ data.jvm.version }}</el-descriptions-item>
          <el-descriptions-item label="运行时长">{{ data.jvm.runTime }}</el-descriptions-item>
          <el-descriptions-item label="启动时间">{{ data.jvm.startTime }}</el-descriptions-item>
          <el-descriptions-item label="安装路径" :span="2">
            <span class="path-text">{{ data.jvm.home }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="项目路径" :span="2">
            <span class="path-text">{{ data.jvm.projectPath }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="运行参数" :span="2">
            <span class="args-text">{{ data.jvm.runArgs }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>

    <!-- 磁盘状态 -->
    <div class="monitor-row animate-item">
      <el-card shadow="never" class="info-card disk-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="18"><Box /></el-icon>
            <span>磁盘状态</span>
          </div>
        </template>
        <el-table
          :data="data.disks"
          border
          stripe
          :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
          size="small"
        >
          <el-table-column prop="path" label="盘符路径" width="120" align="center">
            <template #default="{ row }">
              <span class="path-text">{{ row.path }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fsType" label="文件系统" width="100" align="center" />
          <el-table-column prop="type" label="盘符类型" width="100" align="center" />
          <el-table-column prop="total" label="总大小" width="100" align="center">
            <template #default="{ row }">{{ row.total }} GB</template>
          </el-table-column>
          <el-table-column prop="free" label="可用大小" width="100" align="center">
            <template #default="{ row }">{{ row.free }} GB</template>
          </el-table-column>
          <el-table-column prop="used" label="已用大小" width="100" align="center">
            <template #default="{ row }">{{ row.used }} GB</template>
          </el-table-column>
          <el-table-column prop="usageRate" label="已用百分比" width="200" align="center">
            <template #default="{ row }">
              <el-progress
                :percentage="row.usageRate"
                :color="getProgressColor(row.usageRate)"
                :stroke-width="16"
                :text-inside="true"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Cpu, Coin, Monitor, Opportunity, Box } from '@element-plus/icons-vue'
import { serverMonitorData } from '@/mock/admin/monitorData'

const data = serverMonitorData

function getUsageClass(rate: number): string {
  if (rate >= 80) return 'danger'
  if (rate >= 60) return 'warning'
  return 'normal'
}

function getProgressColor(rate: number): string {
  if (rate >= 80) return '#F56C6C'
  if (rate >= 60) return '#E6A23C'
  return '#67C23A'
}
</script>

<style lang="scss" scoped>
.server-monitor {
  padding: 0;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  height: 100%;
  overflow-y: auto;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  padding: 20px;

  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;
    &:nth-child(1) { animation-delay: 0.05s; }
    &:nth-child(2) { animation-delay: 0.12s; }
    &:nth-child(3) { animation-delay: 0.2s; }
    &:nth-child(4) { animation-delay: 0.27s; }
  }

  .monitor-row {
    margin-bottom: 16px;

    &.two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
  }

  .info-card {
    border-radius: 12px;
    border: none;

    :deep(.el-card__header) {
      padding: 12px 20px;
      background: #fafbfc;
      border-bottom: 1px solid #ebeef5;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 15px;
      color: #303133;
    }
  }

  // CPU
  .cpu-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 16px 0;
  }

  .cpu-item {
    text-align: center;

    .cpu-value {
      font-size: 28px;
      font-weight: 700;
      color: #303133;
      margin-bottom: 4px;

      &.normal { color: #67C23A; }
      &.warning { color: #E6A23C; }
      &.danger { color: #F56C6C; }
    }

    .cpu-label {
      font-size: 13px;
      color: #909399;
      margin-bottom: 8px;
    }
  }

  // Memory
  .memory-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 16px 0;
  }

  .memory-item {
    text-align: center;

    .memory-value {
      font-size: 28px;
      font-weight: 700;
      color: #303133;
      margin-bottom: 4px;

      &.used { color: #E6A23C; }
      &.free { color: #67C23A; }
      &.normal { color: #67C23A; }
      &.warning { color: #E6A23C; }
      &.danger { color: #F56C6C; }
    }

    .memory-label {
      font-size: 13px;
      color: #909399;
      margin-bottom: 8px;
    }
  }

  // Path
  .path-text {
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    font-size: 12px;
    color: #606266;
    word-break: break-all;
  }

  .args-text {
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    font-size: 12px;
    color: #909399;
    word-break: break-all;
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
