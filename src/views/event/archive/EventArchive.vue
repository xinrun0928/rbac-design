<template>
  <div class="event-archive-page">
    <el-card class="table-card animate-item" shadow="never">
      <div class="search-bar">
        <span class="search-bar-title">归档事故库</span>
        <div class="search-bar-actions">
          <el-input
            v-model="keyword"
            placeholder="搜索事故名称/编号"
            clearable
            :prefix-icon="Search"
            style="width: 200px; margin-right: 12px"
            @input="handleSearch"
            @clear="handleSearch"
          />
          <el-select v-model="filterLevel" placeholder="事故等级" clearable style="width: 130px; margin-right: 12px" @change="handleSearch">
            <el-option label="特别重大" value="特别重大" />
            <el-option label="重大" value="重大" />
            <el-option label="较大" value="较大" />
            <el-option label="一般" value="一般" />
          </el-select>
          <el-select v-model="filterClosed" placeholder="结案状态" clearable style="width: 130px; margin-right: 12px" @change="handleSearch">
            <el-option label="已结案" :value="true" />
            <el-option label="未结案" :value="false" />
          </el-select>
          <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="id"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="accidentCode" label="事故编号" width="140" align="center">
          <template #default="{ row }">
            <span class="code-text">{{ row.accidentCode }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="accidentName" label="事故名称" min-width="220" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="name-text">{{ row.accidentName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="accidentType" label="事故类型" width="120" align="center">
          <template #default="{ row }">
            <el-tag effect="light" size="small">{{ row.accidentType }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="accidentLevel" label="事故等级" width="100" align="center">
          <template #default="{ row }">
            <span class="level-tag" :class="getLevelClass(row.accidentLevel)">{{ row.accidentLevel }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="occurTime" label="事发时间" width="170" align="center" />

        <el-table-column label="伤亡情况" width="140" align="center">
          <template #default="{ row }">
            <div class="casualty-cell">
              <span class="dead-text" v-if="row.deadCount > 0">死亡{{ row.deadCount }}</span>
              <span class="injured-text" v-if="row.injuredCount > 0">伤{{ row.injuredCount }}</span>
              <span class="normal-text" v-if="row.casualtyCount === 0">无伤亡</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="处置时长" width="110" align="center">
          <template #default="{ row }">
            <span class="duration-text">{{ row.handleDuration }}小时</span>
          </template>
        </el-table-column>

        <el-table-column prop="closed" label="结案状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.closed ? 'success' : 'warning'" size="small">
              {{ row.closed ? '已结案' : '未结案' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="archiveTime" label="归档时间" width="170" align="center" />

        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" :icon="View" @click="handleView(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 详情抽屉 -->
    <el-drawer
      v-model="detailVisible"
      :title="detailRow?.accidentName || '事故详情'"
      size="700px"
      direction="rtl"
      destroy-on-close
    >
      <div class="detail-content" v-if="detailRow">
        <el-descriptions :column="2" border label-width="100px">
          <el-descriptions-item label="事故编号">{{ detailRow.accidentCode }}</el-descriptions-item>
          <el-descriptions-item label="事故等级">
            <span class="level-tag" :class="getLevelClass(detailRow.accidentLevel)">{{ detailRow.accidentLevel }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="事故类型">{{ detailRow.accidentType }}</el-descriptions-item>
          <el-descriptions-item label="结案状态">
            <el-tag :type="detailRow.closed ? 'success' : 'warning'" size="small">
              {{ detailRow.closed ? '已结案' : '未结案' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="事发地点" :span="2">{{ detailRow.location }}</el-descriptions-item>
          <el-descriptions-item label="事发时间">{{ detailRow.occurTime }}</el-descriptions-item>
          <el-descriptions-item label="归档时间">{{ detailRow.archiveTime }}</el-descriptions-item>
          <el-descriptions-item label="伤亡情况">
            死亡 {{ detailRow.deadCount }} 人 / 受伤 {{ detailRow.injuredCount }} 人
          </el-descriptions-item>
          <el-descriptions-item label="处置时长">{{ detailRow.handleDuration }} 小时</el-descriptions-item>
          <el-descriptions-item label="责任单位" :span="2">{{ detailRow.responsibleOrg }}</el-descriptions-item>
          <el-descriptions-item label="事故原因" :span="2">{{ detailRow.cause }}</el-descriptions-item>
          <el-descriptions-item label="处置措施" :span="2">{{ detailRow.measures }}</el-descriptions-item>
          <el-descriptions-item label="经验教训" :span="2">{{ detailRow.lessons }}</el-descriptions-item>
          <el-descriptions-item label="附件数量">{{ detailRow.attachmentCount }} 个</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Download, View } from '@element-plus/icons-vue'
import { mockEventArchiveData } from '@/mock/event/archiveData'
import type { EventArchive } from '@/types/event/archive'

const loading = ref(false)
const keyword = ref('')
const filterLevel = ref('')
const filterClosed = ref<boolean | ''>('')
const detailVisible = ref(false)
const detailRow = ref<EventArchive | null>(null)

const allData = ref<EventArchive[]>([...mockEventArchiveData])

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const filteredData = computed(() => {
  let data = allData.value

  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    data = data.filter(item =>
      item.accidentName.toLowerCase().includes(kw) ||
      item.accidentCode.toLowerCase().includes(kw)
    )
  }

  if (filterLevel.value) {
    data = data.filter(item => item.accidentLevel === filterLevel.value)
  }

  if (filterClosed.value !== '') {
    data = data.filter(item => item.closed === filterClosed.value)
  }

  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

function getLevelClass(level: string) {
  const map: Record<string, string> = {
    '特别重大': 'level-critical',
    '重大': 'level-major',
    '较大': 'level-minor',
    '一般': 'level-normal'
  }
  return map[level] || ''
}

function handleSearch() {
  pagination.page = 1
}

function handleSizeChange() {
  pagination.page = 1
}

function handlePageChange() {}

function handleExport() {
  ElMessage.info('导出功能开发中...')
}

function handleView(row: EventArchive) {
  detailRow.value = row
  detailVisible.value = true
}
</script>

<style lang="scss" scoped>
.event-archive-page {
  padding: 0;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;

  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;
  }

  .table-card {
    border-radius: 12px;
    border: none;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-card__body) {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }

    .search-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #ebeef5;
    }

    .search-bar-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .search-bar-actions {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .data-table { flex: 1; }

    .code-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 13px;
      color: #409EFF;
    }

    .name-text {
      font-weight: 500;
      color: #303133;
    }

    .casualty-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;

      .dead-text { color: #f56c6c; font-weight: 600; font-size: 13px; }
      .injured-text { color: #e6a23c; font-weight: 500; font-size: 13px; }
      .normal-text { color: #67c23a; font-size: 13px; }
    }

    .duration-text {
      font-weight: 500;
      color: #303133;
    }

    .level-tag {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;

      &.level-critical {
        background: #fef0f0;
        color: #f56c6c;
        border: 1px solid #fbc4c4;
      }
      &.level-major {
        background: #fdf6ec;
        color: #e6a23c;
        border: 1px solid #f5dab1;
      }
      &.level-minor {
        background: #ecf5ff;
        color: #409eff;
        border: 1px solid #b3d8ff;
      }
      &.level-normal {
        background: #f0f9eb;
        color: #67c23a;
        border: 1px solid #c2e7b0;
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }

  .detail-content {
    padding: 0 20px 20px;

    .level-tag {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;

      &.level-critical { background: #fef0f0; color: #f56c6c; border: 1px solid #fbc4c4; }
      &.level-major { background: #fdf6ec; color: #e6a23c; border: 1px solid #f5dab1; }
      &.level-minor { background: #ecf5ff; color: #409eff; border: 1px solid #b3d8ff; }
      &.level-normal { background: #f0f9eb; color: #67c23a; border: 1px solid #c2e7b0; }
    }
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
