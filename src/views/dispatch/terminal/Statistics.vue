<template>
  <div class="statistics-page">
    <el-card class="filter-card animate-item" shadow="never">
      <div class="filter-bar">
        <div class="filter-left">
          <span class="filter-label">统计周期：</span>
          <el-radio-group v-model="filterPeriod" size="default">
            <el-radio-button value="today">今日</el-radio-button>
            <el-radio-button value="week">近7天</el-radio-button>
            <el-radio-button value="month">近30天</el-radio-button>
            <el-radio-button value="custom">自定义</el-radio-button>
          </el-radio-group>
          <el-date-picker
            v-if="filterPeriod === 'custom'"
            v-model="dateRange"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="margin-left: 12px"
          />
        </div>
        <div class="filter-right">
          <span class="filter-label">应急终端类型：</span>
          <el-select v-model="filterType" placeholder="全部" style="width: 140px">
            <el-option label="全部" value="all" />
            <el-option label="布控球" value="controlBall" />
            <el-option label="应急指挥车" value="commandVehicle" />
            <el-option label="应急单兵设备" value="personalDevice" />
          </el-select>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
    </el-card>

    <div class="stats-cards animate-item">
      <div v-for="(item, index) in statsCards" :key="index" class="stat-card" :class="item.class">
        <div class="stat-icon">
          <el-icon :size="32"><component :is="item.icon" /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-title">{{ item.title }}</div>
          <div class="stat-content">
            <div class="stat-main">
              <span class="stat-value">{{ item.count }}</span>
              <span class="stat-unit">次</span>
              <span class="stat-label">调度总次数</span>
            </div>
            <div class="stat-extra">
              <span class="stat-duration">{{ item.duration }}</span>
              <span class="stat-label">调度总时长</span>
            </div>
          </div>
          <div class="stat-change">
            <span>较上期 <span :class="item.countTrend > 0 ? 'up' : 'down'">{{ item.countTrend > 0 ? '↑' : '↓' }} {{ Math.abs(item.countTrend) }}%</span></span>
            <span>较上期 <span :class="item.durationTrend > 0 ? 'up' : 'down'">{{ item.durationTrend > 0 ? '↑' : '↓' }} {{ Math.abs(item.durationTrend) }}%</span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="charts-row animate-item">
      <el-card class="chart-card" shadow="never">
        <template #header>
          <span class="card-title">各类型终端调度次数趋势</span>
        </template>
        <div class="chart-legend">
          <span class="legend-item"><span class="legend-dot control-ball"></span>布控球</span>
          <span class="legend-item"><span class="legend-dot command-vehicle"></span>应急指挥车</span>
          <span class="legend-item"><span class="legend-dot personal-device"></span>应急单兵设备</span>
        </div>
        <div class="line-chart">
          <div class="y-axis">
            <span>100</span>
            <span>80</span>
            <span>60</span>
            <span>40</span>
            <span>20</span>
            <span>0</span>
          </div>
          <div class="chart-area">
            <svg viewBox="0 0 500 200" class="chart-svg">
              <line v-for="i in 6" :key="'grid-'+i" :x1="0" :y1="(i-1)*40" :x2="500" :y2="(i-1)*40" stroke="#e8e8e8" stroke-width="1" />
              <polyline :points="getCountChartPoints('controlBall')" fill="none" stroke="#409EFF" stroke-width="2" />
              <polyline :points="getCountChartPoints('commandVehicle')" fill="none" stroke="#67C23A" stroke-width="2" />
              <polyline :points="getCountChartPoints('personalDevice')" fill="none" stroke="#E6A23C" stroke-width="2" />
              <circle v-for="(point, i) in getCountPoints('controlBall')" :key="'cb-'+i" :cx="point.x" :cy="point.y" r="4" fill="#409EFF" />
              <circle v-for="(point, i) in getCountPoints('commandVehicle')" :key="'cv-'+i" :cx="point.x" :cy="point.y" r="4" fill="#67C23A" />
              <circle v-for="(point, i) in getCountPoints('personalDevice')" :key="'pd-'+i" :cx="point.x" :cy="point.y" r="4" fill="#E6A23C" />
            </svg>
            <div class="x-axis">
              <span v-for="item in countTrendData" :key="item.date">{{ item.date }}</span>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="chart-card" shadow="never">
        <template #header>
          <span class="card-title">各类型终端调度时长趋势</span>
        </template>
        <div class="chart-legend">
          <span class="legend-item"><span class="legend-dot control-ball"></span>布控球</span>
          <span class="legend-item"><span class="legend-dot command-vehicle"></span>应急指挥车</span>
          <span class="legend-item"><span class="legend-dot personal-device"></span>应急单兵设备</span>
        </div>
        <div class="line-chart">
          <div class="y-axis">
            <span>150</span>
            <span>120</span>
            <span>90</span>
            <span>60</span>
            <span>30</span>
            <span>0</span>
          </div>
          <div class="chart-area">
            <svg viewBox="0 0 500 200" class="chart-svg">
              <line v-for="i in 6" :key="'grid-'+i" :x1="0" :y1="(i-1)*40" :x2="500" :y2="(i-1)*40" stroke="#e8e8e8" stroke-width="1" />
              <polyline :points="getDurationChartPoints('controlBall')" fill="none" stroke="#409EFF" stroke-width="2" />
              <polyline :points="getDurationChartPoints('commandVehicle')" fill="none" stroke="#67C23A" stroke-width="2" />
              <polyline :points="getDurationChartPoints('personalDevice')" fill="none" stroke="#E6A23C" stroke-width="2" />
              <circle v-for="(point, i) in getDurationPoints('controlBall')" :key="'cb-'+i" :cx="point.x" :cy="point.y" r="4" fill="#409EFF" />
              <circle v-for="(point, i) in getDurationPoints('commandVehicle')" :key="'cv-'+i" :cx="point.x" :cy="point.y" r="4" fill="#67C23A" />
              <circle v-for="(point, i) in getDurationPoints('personalDevice')" :key="'pd-'+i" :cx="point.x" :cy="point.y" r="4" fill="#E6A23C" />
            </svg>
            <div class="x-axis">
              <span v-for="item in durationTrendData" :key="item.date">{{ item.date }}</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <div class="bottom-row animate-item">
      <el-card class="table-card" shadow="never">
        <template #header>
          <span class="card-title">终端类型调度汇总表</span>
        </template>
        <el-table
          :data="statisticsData"
          border
          stripe
          :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
          class="data-table"
        >
          <el-table-column label="应急终端类型" width="140" align="center">
            <template #default="{ row }">
              <div class="type-cell">
                <el-icon :size="16"><component :is="getTypeIcon(row.type)" /></el-icon>
                <span>{{ row.type }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="调度次数（次）" align="center">
            <el-table-column prop="todayCount" label="今日" width="80" align="center" />
            <el-table-column prop="weekCount" label="近7天" width="80" align="center" />
            <el-table-column prop="monthCount" label="近30天" width="80" align="center" />
          </el-table-column>
          <el-table-column label="调度时长（小时）" align="center">
            <el-table-column prop="todayDuration" label="今日" width="100" align="center" />
            <el-table-column prop="weekDuration" label="近7天" width="100" align="center" />
            <el-table-column prop="monthDuration" label="近30天" width="110" align="center" />
          </el-table-column>
          <el-table-column label="平均每次时长（分钟）" width="140" align="center">
            <template #default="{ row }">
              {{ row.avgDuration }}
            </template>
          </el-table-column>
          <el-table-column label="较上周期（次数）" width="130" align="center">
            <template #default="{ row }">
              <span :class="row.countChange.includes('↑') ? 'trend-up' : 'trend-down'">
                {{ row.countChange }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="较上周期（时长）" width="130" align="center">
            <template #default="{ row }">
              <span :class="row.durationChange.includes('↑') ? 'trend-up' : 'trend-down'">
                {{ row.durationChange }}
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="summary-row">
          <span class="summary-label">合计</span>
          <span class="summary-value">{{ totalStats.todayCount }}</span>
          <span class="summary-value">{{ totalStats.weekCount }}</span>
          <span class="summary-value">{{ totalStats.monthCount }}</span>
          <span class="summary-value">{{ totalStats.todayDuration }}</span>
          <span class="summary-value">{{ totalStats.weekDuration }}</span>
          <span class="summary-value">{{ totalStats.monthDuration }}</span>
          <span class="summary-value">{{ totalStats.avgDuration }}</span>
          <span class="summary-value trend-up">{{ totalStats.countChange }}</span>
          <span class="summary-value trend-up">{{ totalStats.durationChange }}</span>
        </div>
      </el-card>

      <el-card class="pie-card" shadow="never">
        <template #header>
          <span class="card-title">各类型终端调度次数占比（近7天）</span>
        </template>
        <div class="pie-chart">
          <div class="pie-center">
            <span class="pie-total">{{ totalStats.weekCount }}</span>
            <span class="pie-label">调度总次数</span>
          </div>
          <div class="pie-ring"></div>
        </div>
        <div class="pie-legend">
          <div v-for="(item, index) in pieData" :key="index" class="pie-legend-item">
            <span class="legend-dot" :style="{ background: item.color }"></span>
            <span class="legend-text">{{ item.name }}</span>
            <span class="legend-value">{{ item.count }}次 ({{ item.percent }})</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Camera, Van, Cellphone, DataLine } from '@element-plus/icons-vue'
import {
  terminalStatisticsData,
  terminalCountTrendData,
  terminalDurationTrendData
} from '@/mock/dispatch/terminalData'

const filterPeriod = ref('week')
const dateRange = ref<[Date, Date] | null>(null)
const filterType = ref('all')

const statisticsData = ref(terminalStatisticsData)
const countTrendData = ref(terminalCountTrendData)
const durationTrendData = ref(terminalDurationTrendData)

const statsCards = computed(() => [
  {
    title: '布控球',
    count: 128,
    duration: '256h30m',
    countTrend: 15.38,
    durationTrend: 8.57,
    icon: Camera,
    class: 'control-ball'
  },
  {
    title: '应急指挥车',
    count: 64,
    duration: '192h15m',
    countTrend: -8.57,
    durationTrend: 5.29,
    icon: Van,
    class: 'command-vehicle'
  },
  {
    title: '应急单兵设备',
    count: 356,
    duration: '489h45m',
    countTrend: 22.34,
    durationTrend: 18.66,
    icon: Cellphone,
    class: 'personal-device'
  },
  {
    title: '全部设备',
    count: 548,
    duration: '938h30m',
    countTrend: 16.73,
    durationTrend: 13.89,
    icon: DataLine,
    class: 'all'
  }
])

const totalStats = computed(() => ({
  todayCount: 65,
  weekCount: 548,
  monthCount: 2196,
  todayDuration: '113h30m',
  weekDuration: '938h30m',
  monthDuration: '3751h05m',
  avgDuration: 102.78,
  countChange: '16.73% ↑',
  durationChange: '13.89% ↑'
}))

const pieData = computed(() => [
  { name: '布控球', count: 128, percent: '23.36%', color: '#409EFF' },
  { name: '应急指挥车', count: 64, percent: '11.68%', color: '#67C23A' },
  { name: '应急单兵设备', count: 356, percent: '64.96%', color: '#E6A23C' }
])

const getTypeIcon = (type: string) => {
  const map: Record<string, any> = {
    '布控球': Camera,
    '应急指挥车': Van,
    '应急单兵设备': Cellphone
  }
  return map[type] || DataLine
}

const getCountChartPoints = (type: string) => {
  const data = countTrendData.value
  const key = type as keyof typeof data[0]
  const maxVal = 100
  return data.map((item, i) => {
    const x = (i / (data.length - 1)) * 500
    const y = 200 - ((item[key] as number) / maxVal) * 200
    return `${x},${y}`
  }).join(' ')
}

const getCountPoints = (type: string) => {
  const data = countTrendData.value
  const key = type as keyof typeof data[0]
  const maxVal = 100
  return data.map((item, i) => ({
    x: (i / (data.length - 1)) * 500,
    y: 200 - ((item[key] as number) / maxVal) * 200
  }))
}

const getDurationChartPoints = (type: string) => {
  const data = durationTrendData.value
  const key = type as keyof typeof data[0]
  const maxVal = 150
  return data.map((item, i) => {
    const x = (i / (data.length - 1)) * 500
    const y = 200 - ((item[key] as number) / maxVal) * 200
    return `${x},${y}`
  }).join(' ')
}

const getDurationPoints = (type: string) => {
  const data = durationTrendData.value
  const key = type as keyof typeof data[0]
  const maxVal = 150
  return data.map((item, i) => ({
    x: (i / (data.length - 1)) * 500,
    y: 200 - ((item[key] as number) / maxVal) * 200
  }))
}

const handleSearch = () => {}

const handleReset = () => {
  filterPeriod.value = 'week'
  dateRange.value = null
  filterType.value = 'all'
}
</script>

<style lang="scss" scoped>
.statistics-page {
  padding: 0;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: auto;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;

  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;
  }

  .filter-card {
    border-radius: 12px;
    border: none;

    :deep(.el-card__body) {
      padding: 16px 20px;
    }

    .filter-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }

    .filter-left,
    .filter-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .filter-label {
      font-size: 14px;
      color: #606266;
    }
  }

  .stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    .stat-card {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      gap: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

      .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &.control-ball .stat-icon {
        background: #ecf5ff;
        color: #409EFF;
      }

      &.command-vehicle .stat-icon {
        background: #f0f9eb;
        color: #67C23A;
      }

      &.personal-device .stat-icon {
        background: #fdf6ec;
        color: #E6A23C;
      }

      &.all .stat-icon {
        background: #f4f4f5;
        color: #909399;
      }

      .stat-info {
        flex: 1;
      }

      .stat-title {
        font-size: 14px;
        color: #909399;
        margin-bottom: 8px;
      }

      .stat-content {
        display: flex;
        gap: 24px;
        margin-bottom: 8px;
      }

      .stat-main,
      .stat-extra {
        display: flex;
        flex-direction: column;
      }

      .stat-value {
        font-size: 24px;
        font-weight: 600;
        color: #303133;
      }

      .stat-unit {
        font-size: 12px;
        color: #909399;
        margin-left: 4px;
      }

      .stat-duration {
        font-size: 16px;
        font-weight: 500;
        color: #303133;
      }

      .stat-label {
        font-size: 12px;
        color: #909399;
      }

      .stat-change {
        display: flex;
        gap: 16px;
        font-size: 12px;
        color: #909399;

        .up { color: #F56C6C; }
        .down { color: #67C23A; }
      }
    }
  }

  .charts-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    .chart-card {
      border-radius: 12px;
      border: none;

      .card-title {
        font-size: 15px;
        font-weight: 600;
        color: #303133;
      }

      .chart-legend {
        display: flex;
        gap: 20px;
        margin-bottom: 16px;

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #606266;
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;

          &.control-ball { background: #409EFF; }
          &.command-vehicle { background: #67C23A; }
          &.personal-device { background: #E6A23C; }
        }
      }

      .line-chart {
        display: flex;
        gap: 8px;

        .y-axis {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-size: 12px;
          color: #909399;
          padding: 0 4px;
        }

        .chart-area {
          flex: 1;
          display: flex;
          flex-direction: column;

          .chart-svg {
            width: 100%;
            height: 200px;
          }

          .x-axis {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #909399;
            margin-top: 8px;
          }
        }
      }
    }
  }

  .bottom-row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 16px;

    .table-card {
      border-radius: 12px;
      border: none;

      .card-title {
        font-size: 15px;
        font-weight: 600;
        color: #303133;
      }

      .type-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .trend-up { color: #F56C6C; }
      .trend-down { color: #67C23A; }

      .summary-row {
        display: flex;
        align-items: center;
        padding: 12px 0;
        border-top: 1px solid #ebeef5;
        font-size: 14px;

        .summary-label {
          width: 140px;
          text-align: center;
          font-weight: 600;
          color: #303133;
        }

        .summary-value {
          flex: 1;
          text-align: center;
          color: #303133;
        }
      }
    }

    .pie-card {
      border-radius: 12px;
      border: none;

      .card-title {
        font-size: 15px;
        font-weight: 600;
        color: #303133;
      }

      .pie-chart {
        position: relative;
        width: 180px;
        height: 180px;
        margin: 20px auto;

        .pie-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;

          .pie-total {
            display: block;
            font-size: 28px;
            font-weight: 600;
            color: #303133;
          }

          .pie-label {
            font-size: 12px;
            color: #909399;
          }
        }

        .pie-ring {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: conic-gradient(
            #409EFF 0deg 84deg,
            #67C23A 84deg 126deg,
            #E6A23C 126deg 360deg
          );
          mask: radial-gradient(transparent 55%, black 56%);
          -webkit-mask: radial-gradient(transparent 55%, black 56%);
        }
      }

      .pie-legend {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 20px;

        .pie-legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;

          .legend-dot {
            width: 12px;
            height: 12px;
            border-radius: 3px;
          }

          .legend-text {
            color: #606266;
            flex: 1;
          }

          .legend-value {
            color: #303133;
            font-weight: 500;
          }
        }
      }
    }
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
