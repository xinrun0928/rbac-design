<template>
  <div class="schedule-page">
    <!-- 头部 -->
    <div class="schedule-header">
      <div class="header-left">
        <div class="header-icon">
          <el-icon :size="24"><Calendar /></el-icon>
        </div>
        <div class="header-title">
          <h2>模块级排期v4</h2>
          <p>项目各功能模块人员安排总览</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button :icon="ArrowLeft" @click="goBack">返回登录</el-button>
      </div>
    </div>

    <div class="schedule-body">
      <!-- 系统筛选卡片 -->
      <div class="stats-section">
        <StatsCards v-model="activeSystem" :items="systemStatsCards" @change="handleSystemChange" />
      </div>

      <!-- 工具栏 + 视图 统一卡片 -->
      <el-card class="main-card" :class="{ 'is-fullscreen': isFullscreen }" shadow="never">
        <!-- 工具栏 -->
        <div class="toolbar">
          <div class="toolbar-filters">
            <el-select
              v-model="activeTeam"
              placeholder="研发团队"
              clearable
              style="width: 180px"
            >
              <el-option v-for="t in mockScheduleTeams" :key="t.name" :label="t.name" :value="t.name">
                <span class="team-option">
                  <span>{{ t.name }}</span>
                  <span v-if="t.frontend" class="team-option-members">（{{ t.frontend }} / {{ t.backend }}）</span>
                </span>
              </el-option>
            </el-select>

            <el-input
              v-model="keyword"
              placeholder="搜索模块/子系统/功能项"
              clearable
              :prefix-icon="Search"
              style="width: 240px"
            />

            <div class="view-switch">
              <el-radio-group v-model="viewMode">
                <el-radio-button value="table">
                  <el-icon><List /></el-icon> 表格
                </el-radio-button>
                <el-radio-button value="gantt">
                  <el-icon><Calendar /></el-icon> 甘特图
                </el-radio-button>
              </el-radio-group>
            </div>

            <div v-if="viewMode === 'gantt'" class="group-switch">
              <el-radio-group v-model="groupBy" size="small">
                <el-radio-button value="system">按系统</el-radio-button>
                <el-radio-button value="team">按团队</el-radio-button>
              </el-radio-group>
            </div>

            <div v-if="viewMode === 'gantt'" class="unit-switch">
              <el-radio-group v-model="timeUnit" size="small">
                <el-radio-button value="day">按天</el-radio-button>
                <el-radio-button value="week">按周</el-radio-button>
                <el-radio-button value="month">按月</el-radio-button>
                <el-radio-button value="year">按年</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </div>

        <!-- 团队图例 + 统计数字 -->
        <div class="legend-row">
          <div class="team-legend">
            <span class="legend-title">团队图例：</span>
            <span v-for="t in mockScheduleTeams" :key="t.name" class="legend-item">
              <i class="legend-dot" :style="{ background: teamColor(t.name) }"></i>
              {{ t.name }}
              <em v-if="t.frontend">（{{ t.frontend }} / {{ t.backend }}）</em>
            </span>
          </div>

          <div class="legend-summary">
            <span class="summary-item">
              <b>{{ filteredModules.length }}</b> 个模块
            </span>
            <span class="summary-item">
              <b>{{ filteredItems.length }}</b> 个功能项
            </span>
            <span class="summary-item">
              <b>{{ filteredPersonDays }}</b> 人天
            </span>
            <el-divider direction="vertical" class="summary-divider" />
            <el-tooltip
              :content="isFullscreen ? '退出全屏' : '全屏查看'"
              placement="top"
              :show-after="200"
            >
              <el-button
                :icon="isFullscreen ? Aim : FullScreen"
                type="primary"
                circle
                class="fullscreen-button"
                @click="toggleFullscreen"
              />
            </el-tooltip>
          </div>
        </div>

        <!-- 视图 -->
        <div class="view-content">
          <ScheduleTable
            v-if="viewMode === 'table'"
            :modules="filteredModules"
            @open-drawer="openDrawer"
          />
          <ScheduleGantt
            v-else
            :modules="filteredModules"
            :group-by="groupBy"
            :system-names="systemNames"
            :time-unit="timeUnit"
            v-model:zoom="ganttZoom"
            @open-drawer="openDrawer"
          />
        </div>
      </el-card>
    </div>

    <!-- 模块详情抽屉 -->
    <el-drawer v-model="drawerVisible" :title="drawerTitle" size="60%">
      <template v-if="currentModule">
        <el-descriptions :column="2" border class="module-desc">
          <el-descriptions-item label="系统名称">{{ currentModule.systemName }}</el-descriptions-item>
          <el-descriptions-item label="子系统">{{ currentModule.subsystemName }}</el-descriptions-item>
          <el-descriptions-item label="模块名称">{{ currentModule.moduleName }}</el-descriptions-item>
          <el-descriptions-item label="研发团队">{{ currentModule.teamText }}</el-descriptions-item>
          <el-descriptions-item label="功能项数">{{ currentModule.itemCount }} 个</el-descriptions-item>
          <el-descriptions-item label="预估人天">{{ currentModule.personDays }} 天</el-descriptions-item>
          <el-descriptions-item label="开始日期">{{ currentModule.startDate }}</el-descriptions-item>
          <el-descriptions-item label="结束日期">{{ currentModule.endDate }}</el-descriptions-item>
        </el-descriptions>

        <div class="drawer-section-title">功能项明细</div>
        <el-table
          :data="currentModule.items"
          border
          size="small"
          :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        >
          <el-table-column type="index" label="序号" width="55" align="center" />
          <el-table-column prop="itemName" label="功能计数项名称" min-width="200" show-overflow-tooltip />
          <el-table-column prop="complexity" label="复杂系数" width="95" align="center" />
          <el-table-column prop="personDays" label="人天" width="60" align="center" />
          <el-table-column prop="team" label="团队" width="100" align="center" />
          <el-table-column label="周期" width="240" align="center">
            <template #default="{ row }">
              <span class="time-text">{{ row.startDate }} ~ {{ row.endDate }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  Search,
  List,
  Calendar,
  Monitor,
  Timer,
  Document,
  Warning,
  Box,
  DataAnalysis,
  Connection,
  DataBoard,
  FullScreen,
  Aim
} from '@element-plus/icons-vue'
import StatsCards from '@/components/StatsCards.vue'
import ScheduleTable from './ScheduleTable.vue'
import ScheduleGantt from './ScheduleGantt.vue'
import { mockScheduleItems, mockScheduleModules, mockScheduleTeams } from '@/mock/schedule/scheduleData'
import type { ScheduleModule } from '@/types/schedule'
import { teamColor } from './scheduleUtils'

const router = useRouter()

// 视图与分组
const viewMode = ref<'table' | 'gantt'>('gantt')
const groupBy = ref<'system' | 'team'>('system')
const timeUnit = ref<'day' | 'week' | 'month' | 'year'>('week')
const ganttZoom = ref(1.5)
// 全屏
const isFullscreen = ref(false)
function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

// 筛选条件
const activeSystem = ref('全部')
const activeTeam = ref('')
const keyword = ref('')

// 抽屉
const drawerVisible = ref(false)
const currentModule = ref<ScheduleModule | null>(null)

// ---------- 统计卡片 ----------
const systemNames = computed(() => {
  const names: string[] = []
  for (const m of mockScheduleModules) {
    if (!names.includes(m.systemName)) names.push(m.systemName)
  }
  return names
})

const systemIcons: Record<string, any> = {
  '应急指挥智能调度系统': Monitor,
  '应急值守管理子系统': Timer,
  '智能应急预案管理子系统': Document,
  '应急事件管理子系统': Warning,
  '厅级应急物资管理子系统': Box,
  '辅助决策子系统': DataAnalysis,
  '数据融合子系统': Connection,
  '专题数据展示': DataBoard
}

const systemColors: Record<string, string> = {
  '应急指挥智能调度系统': '#409EFF',
  '应急值守管理子系统': '#67C23A',
  '智能应急预案管理子系统': '#E6A23C',
  '应急事件管理子系统': '#F56C6C',
  '厅级应急物资管理子系统': '#909399',
  '辅助决策子系统': '#a855f7',
  '数据融合子系统': '#00b0a0',
  '专题数据展示': '#f39c12'
}

function countModules(systemName: string) {
  if (systemName === '全部') return mockScheduleModules.length
  return mockScheduleModules.filter(m => m.systemName === systemName).length
}

const systemStatsCards = computed(() => {
  const all = {
    key: '全部',
    label: '全部',
    value: countModules('全部'),
    icon: DataBoard,
    color: '#409EFF',
    bgColor: '#ecf5ff'
  }
  const rest = systemNames.value.map(name => ({
    key: name,
    label: name,
    value: countModules(name),
    icon: systemIcons[name] || Document,
    color: systemColors[name] || '#409EFF',
    bgColor: (systemColors[name] || '#409EFF') + '1a'
  }))
  return [all, ...rest]
})

// ---------- 过滤 ----------
const filteredModules = computed(() => {
  let list = mockScheduleModules
  if (activeSystem.value !== '全部') {
    list = list.filter(m => m.systemName === activeSystem.value)
  }
  if (activeTeam.value) {
    list = list.filter(m => m.teams.includes(activeTeam.value))
  }
  if (keyword.value) {
    const kw = keyword.value.trim()
    list = list.filter(m =>
      m.moduleName.includes(kw) ||
      m.subsystemName.includes(kw) ||
      m.systemName.includes(kw) ||
      m.items.some(it => it.itemName.includes(kw))
    )
  }
  return list
})

const filteredItems = computed(() => {
  const keys = new Set(filteredModules.value.map(m => m.key))
  return mockScheduleItems.filter(it => {
    const key = [it.systemName, it.subsystemName, it.moduleName].join('/')
    return keys.has(key)
  })
})

const filteredPersonDays = computed(() =>
  filteredModules.value.reduce((sum, m) => sum + m.personDays, 0)
)

function handleSystemChange() {
  // 分页重置交给表格子组件内部监听 modules 变化处理
}

// ---------- 抽屉 ----------
const drawerTitle = computed(() => (currentModule.value ? currentModule.value.moduleName : ''))

function openDrawer(mod: ScheduleModule) {
  currentModule.value = mod
  drawerVisible.value = true
}

// ---------- 返回 ----------
function goBack() {
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.schedule-page {
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  overflow: hidden;
}

/* 头部 */
.schedule-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  flex-shrink: 0;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .header-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: linear-gradient(135deg, #409EFF 0%, #66B1FF 100%);
  }

  .header-title {
    h2 {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }

    p {
      margin-top: 2px;
      font-size: 12px;
      color: #909399;
    }
  }
}

.schedule-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  overflow: hidden;
}

/* 统计卡片区 */
.stats-section {
  flex-shrink: 0;
}

/* 主卡片（工具栏 + 视图） */
.main-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: none;
  min-height: 0;

  :deep(.el-card__body) {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }
}

.main-card.is-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 2000;
  margin: 0;
  border-radius: 0;
  height: 100vh;
  max-height: 100vh;

  :deep(.el-card__body) {
    height: 100vh;
  }
}

.view-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  margin-top: 16px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.toolbar-filters {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.view-switch {
  :deep(.el-radio-button__inner) {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.team-option {
  display: flex;
  align-items: center;
  gap: 6px;
}

.team-option-members {
  font-size: 12px;
  color: #909399;
}

.legend-row {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.team-legend {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;

  .legend-title {
    font-size: 12px;
    color: #909399;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: #606266;

    em {
      font-style: normal;
      color: #909399;
    }
  }

  .legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    display: inline-block;
  }
}

.legend-summary {
  display: flex;
  align-items: center;
  gap: 20px;

  .summary-divider {
    height: 16px;
    margin: 0;
  }

  .fullscreen-button {
    margin-left: -4px;

    :deep(.el-icon) {
      font-size: 16px;
    }
  }

  .summary-item {
    font-size: 13px;
    color: #606266;

    b {
      font-size: 16px;
      color: #409EFF;
      font-weight: 700;
      margin-right: 2px;
    }
  }
}

/* 抽屉 */
.module-desc {
  margin-bottom: 20px;
}

.drawer-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.time-text {
  font-size: 13px;
  color: #606266;
}
</style>
