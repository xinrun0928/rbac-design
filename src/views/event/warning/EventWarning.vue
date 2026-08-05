<template>
  <div class="warning-page">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="search-item">
        <span class="search-label">告警名称</span>
        <el-input v-model="searchForm.alarmName" placeholder="请输入" clearable class="search-input" />
      </div>
      <div class="search-item">
        <span class="search-label">事故名称</span>
        <el-input v-model="searchForm.eventName" placeholder="请输入" clearable class="search-input" />
      </div>
      <div class="search-item">
        <span class="search-label">预警等级</span>
        <el-select v-model="searchForm.warningLevel" placeholder="请选择" clearable class="search-select">
          <el-option label="红色" value="红色" />
          <el-option label="橙色" value="橙色" />
          <el-option label="黄色" value="黄色" />
          <el-option label="提醒" value="提醒" />
        </el-select>
      </div>
    </div>

    <!-- Tab筛选 -->
    <div class="filter-section">
      <div class="tab-group">
        <span
          v-for="tab in warningTabs"
          :key="tab.key"
          class="tab-item"
          :class="{ active: activeTab === tab.key }"
          @click="handleTabChange(tab.key)"
        >
          {{ tab.label }}
          <span v-if="tab.count" class="tab-badge">{{ tab.count }}</span>
        </span>
      </div>
      <div class="filter-desc">对于触发阈值的告警进行集中展示，并进行事件处置</div>
    </div>

    <!-- 表格 -->
    <div class="table-card">
      <el-table
        :data="filteredRecords"
        border
        stripe
        highlight-current-row
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column prop="alarmName" label="告警名称" min-width="350">
          <template #default="{ row }">
            <span class="alarm-name-text">{{ row.alarmName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="occurTime" label="发生时间" width="160" align="center" />

        <el-table-column prop="eventName" label="告警触发事件名称" min-width="180">
          <template #default="{ row }">
            <span class="event-name-text">{{ row.eventName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="triggerIndicators" label="触发指标" min-width="220">
          <template #default="{ row }">
            <span class="indicator-text">{{ row.triggerIndicators }}</span>
          </template>
        </el-table-column>

        <el-table-column label="预警等级" width="120" align="center">
          <template #default="{ row }">
            <div class="level-cell">
              <el-tag
                :type="getLevelType(row.warningLevel)"
                size="small"
                :class="['level-tag', `level-${getLevelClass(row.warningLevel)}`]"
              >
                {{ row.warningLevel }}
              </el-tag>
              <el-tag v-if="row.eventName === '续报/终报延迟'" size="small" type="info" class="delay-badge">
                A1
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="notifyTarget" label="通知对象类型" min-width="250" show-overflow-tooltip />

        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleDispose(row)">
              处置
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { mockWarningTabs, mockWarningRecords } from '@/mock/event/warningData'
import type { WarningRecord } from '@/types/event/warning'

const warningTabs = ref(mockWarningTabs)
const allRecords = ref<WarningRecord[]>(mockWarningRecords)

// 搜索表单
const searchForm = ref({
  alarmName: '',
  eventName: '',
  warningLevel: '',
})

// 当前Tab
const activeTab = ref('all')

// Tab切换
function handleTabChange(key: string) {
  activeTab.value = key
}

// 过滤后的记录
const filteredRecords = computed(() => {
  let data = allRecords.value

  // Tab筛选
  if (activeTab.value !== 'all') {
    const tabMap: Record<string, (r: WarningRecord) => boolean> = {
      monitor: (r) => r.notifyTarget.includes('监控中心'),
      office: (r) => r.notifyTarget.includes('厅值班室'),
      delay: (r) => r.eventName === '续报/终报延迟',
    }
    if (tabMap[activeTab.value]) {
      data = data.filter(tabMap[activeTab.value])
    }
  }

  // 搜索筛选
  if (searchForm.value.alarmName) {
    data = data.filter((r) => r.alarmName.includes(searchForm.value.alarmName))
  }
  if (searchForm.value.eventName) {
    data = data.filter((r) => r.eventName.includes(searchForm.value.eventName))
  }
  if (searchForm.value.warningLevel) {
    data = data.filter((r) => r.warningLevel === searchForm.value.warningLevel)
  }

  return data
})

// 预警等级样式
function getLevelType(level: string) {
  const map: Record<string, string> = {
    '红色': 'danger',
    '橙色': 'warning',
    '黄色': '',
    '提醒': 'info',
  }
  return (map[level] || 'info') as any
}

function getLevelClass(level: string) {
  const map: Record<string, string> = {
    '红色': 'red',
    '橙色': 'orange',
    '黄色': 'yellow',
    '提醒': 'info',
  }
  return map[level] || 'info'
}

// 处置
function handleDispose(row: WarningRecord) {
  ElMessage.success(`正在处置：${row.eventName}`)
}
</script>

<style lang="scss" scoped>
.warning-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

// 搜索栏
.search-bar {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  .search-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .search-label {
    font-size: 14px;
    color: #606266;
    white-space: nowrap;
  }

  .search-input {
    width: 180px;
  }

  .search-select {
    width: 180px;
  }
}

// Tab筛选
.filter-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  .tab-group {
    display: flex;
    align-items: center;
    gap: 0;
    background: #ecf5ff;
    border-radius: 6px;
    padding: 4px;
    border: 1px solid #b3d8ff;
  }

  .tab-item {
    position: relative;
    padding: 8px 16px;
    font-size: 13px;
    color: #409eff;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
    white-space: nowrap;

    &:hover {
      background: rgba(64, 158, 255, 0.1);
    }

    &.active {
      background: #409eff;
      color: #fff;
    }

    .tab-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      font-size: 10px;
      color: #fff;
      background: #f56c6c;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .filter-desc {
    font-size: 13px;
    color: #909399;
  }
}

// 表格卡片
.table-card {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  overflow: auto;
  padding: 0;
}

.data-table {
  width: 100%;
}

.alarm-name-text {
  font-size: 13px;
  color: #303133;
  line-height: 1.6;
}

.event-name-text {
  font-weight: 500;
  color: #303133;
}

.indicator-text {
  color: #409eff;
  font-size: 13px;
}

.level-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.level-tag {
  border-radius: 4px;
  font-size: 12px;

  &.level-red {
    background: #fef0f0;
    color: #f56c6c;
    border-color: #fbc4c4;
  }

  &.level-orange {
    background: #fdf6ec;
    color: #e6a23c;
    border-color: #f5dab1;
  }

  &.level-yellow {
    background: #fdf6ec;
    color: #e6a23c;
    border-color: #f5dab1;
  }

  &.level-info {
    background: #f0f9eb;
    color: #67c23a;
    border-color: #c2e7b0;
  }
}

.delay-badge {
  font-size: 10px;
  padding: 2px 4px;
  min-width: 22px;
  text-align: center;
}
</style>
