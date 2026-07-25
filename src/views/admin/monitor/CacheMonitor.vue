<template>
  <div class="cache-monitor">
    <!-- 基本信息 -->
    <div class="monitor-row animate-item">
      <el-card shadow="never" class="info-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="18"><Coin /></el-icon>
            <span>基本信息</span>
          </div>
        </template>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Redis版本</div>
            <div class="info-value">{{ data.info.version }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">运行模式</div>
            <div class="info-value">{{ data.info.mode }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">端口</div>
            <div class="info-value">{{ data.info.port }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">客户端数量</div>
            <div class="info-value">{{ data.info.clients }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">运行时间（天）</div>
            <div class="info-value">{{ data.info.runDays }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">使用内存</div>
            <div class="info-value">{{ data.info.usedMemory }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">使用CPU</div>
            <div class="info-value">{{ data.info.usedCpu }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">内存配置</div>
            <div class="info-value">{{ data.info.memoryConfig }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">AOF是否开启</div>
            <div class="info-value">
              <el-tag :type="data.info.aofEnabled ? 'success' : 'info'" size="small">
                {{ data.info.aofEnabled ? '已开启' : '未开启' }}
              </el-tag>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">RDB是否成功</div>
            <div class="info-value">
              <el-tag :type="data.info.rdbSuccess ? 'success' : 'danger'" size="small">
                {{ data.info.rdbSuccess ? '成功' : '失败' }}
              </el-tag>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">KEY数量</div>
            <div class="info-value">{{ data.info.keyCount.toLocaleString() }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">网络入口/出口</div>
            <div class="info-value">{{ data.info.netInput }} / {{ data.info.netOutput }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 命令统计 & 内存信息 -->
    <div class="monitor-row two-col animate-item">
      <el-card shadow="never" class="info-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="18"><DataAnalysis /></el-icon>
            <span>命令统计</span>
          </div>
        </template>
        <div ref="pieChartRef" class="chart-container" />
      </el-card>

      <el-card shadow="never" class="info-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="18"><Coin /></el-icon>
            <span>内存信息</span>
          </div>
        </template>
        <div class="memory-info-grid">
          <div class="memory-info-item">
            <div class="info-label">已用内存</div>
            <div class="info-value highlight">{{ data.memory.usedMemory }}</div>
          </div>
          <div class="memory-info-item">
            <div class="info-label">使用峰值</div>
            <div class="info-value">{{ data.memory.usedMemoryPeak }}</div>
          </div>
          <div class="memory-info-item">
            <div class="info-label">内存碎片率</div>
            <div class="info-value">{{ data.memory.memFragmentationRatio }}</div>
          </div>
          <div class="memory-info-item">
            <div class="info-label">AOF缓冲区</div>
            <div class="info-value">{{ data.memory.aofBuffer }}</div>
          </div>
          <div class="memory-info-item">
            <div class="info-label">输入缓冲区</div>
            <div class="info-value">{{ data.memory.inputBuffer }}</div>
          </div>
          <div class="memory-info-item">
            <div class="info-label">输出缓冲区</div>
            <div class="info-value">{{ data.memory.outputBuffer }}</div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { Coin, DataAnalysis } from '@element-plus/icons-vue'
import { cacheMonitorData } from '@/mock/admin/monitorData'

const data = cacheMonitorData
const pieChartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

function initChart() {
  if (!pieChartRef.value) return
  chartInstance = echarts.init(pieChartRef.value)

  chartInstance.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: '#606266', fontSize: 12 }
    },
    series: [
      {
        name: '命令调用次数',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          fontSize: 11
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        labelLine: { show: true },
        data: data.commandStats.map(item => ({
          name: item.name,
          value: item.value
        }))
      }
    ]
  })
}

function handleResize() {
  chartInstance?.resize()
}

onMounted(() => {
  nextTick(() => initChart())
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style lang="scss" scoped>
.cache-monitor {
  padding: 20px;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  height: 100%;
  overflow-y: auto;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;

  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;
    &:nth-child(1) { animation-delay: 0.05s; }
    &:nth-child(2) { animation-delay: 0.12s; }
  }

  .monitor-row {
    margin-bottom: 16px;

    &.two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      align-items: stretch;
    }
  }

  .info-card {
    border-radius: 12px;
    border: none;
    display: flex;
    flex-direction: column;

    :deep(.el-card__body) {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

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

  .info-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    padding: 12px 0;
  }

  .info-item {
    padding: 12px;
    background: #f5f7fa;
    border-radius: 8px;

    .info-label {
      font-size: 12px;
      color: #909399;
      margin-bottom: 6px;
    }

    .info-value {
      font-size: 15px;
      font-weight: 600;
      color: #303133;
    }
  }

  .memory-info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 16px;
    padding: 8px 0;
    height: 100%;
  }

  .memory-info-item {
    padding: 14px 16px;
    background: #f5f7fa;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .info-label {
      font-size: 12px;
      color: #909399;
      margin-bottom: 6px;
    }

    .info-value {
      font-size: 16px;
      font-weight: 600;
      color: #303133;

      &.highlight {
        color: #E6A23C;
      }
    }
  }

  .chart-container {
    width: 100%;
    height: 350px;
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
