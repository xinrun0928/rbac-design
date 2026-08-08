<template>
  <div class="road-management">
    <el-card class="table-card animate-item" shadow="never">
      <div class="search-bar">
        <span class="search-bar-title">大客流大货流路段</span>
        <div class="search-bar-actions">
          <el-input
            v-model="searchName"
            placeholder="请输入路段名称"
            clearable
            :prefix-icon="Search"
            style="width: 180px"
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          />
          <DataAccessButton text="路段接入" @click="handleAdd" />
          <ExportButton />
        </div>
      </div>

      <el-table
        :data="tableData"
        stripe
        border
        highlight-current-row
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" :index="getIndex" />
        <el-table-column prop="name" label="路段名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="highwayName" label="高速公路名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="roadType" label="路段类型" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.roadType === '高速公路' ? 'primary' : 'success'" size="small">
              {{ row.roadType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="congestionLevel" label="拥挤程度" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getCongestionType(row.congestionLevel)" size="small">
              {{ row.congestionLevel }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="trafficType" label="车流类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.trafficType === '客流' ? 'warning' : 'info'" size="small">
              {{ row.trafficType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="当前状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleContact(row)">联系人配置</el-button>
            <el-button type="primary" link size="small" @click="handleBindSlice(row)">绑定切片</el-button>
            <el-button type="primary" link size="small" @click="handleVideoList(row)">视频清单</el-button>
            <el-button type="primary" link size="small" @click="handleBindVideo(row)">绑定监控视频</el-button>
            <el-button type="primary" link size="small" @click="handleAutoSlice(row)">自动切片</el-button>
            <el-button type="primary" link size="small" @click="handleSliceVideo(row)">切片视频</el-button>
            <el-button type="primary" link size="small" @click="handleDataAnalysis(row)">数据分析</el-button>
            <el-button type="primary" link size="small" @click="handleDetail(row)">详情</el-button>
            <el-button type="danger" link size="small" @click="handleRemove(row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DataAccessButton from '@/components/DataAccessButton.vue'
import ExportButton from '@/components/ExportButton.vue'

// 搜索关键词
const searchName = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(20)

// 模拟数据
const allData = ref(generateMockData())

// 计算总条数
const total = computed(() => filteredData.value.length)

// 过滤后的数据
const filteredData = computed(() => {
  if (!searchName.value) return allData.value
  return allData.value.filter(item =>
    item.name.includes(searchName.value)
  )
})

// 表格数据
const tableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

// 获取序号
const getIndex = (index: number) => {
  return (currentPage.value - 1) * pageSize.value + index + 1
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

// 页码变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

// 数据接入
const handleAdd = () => {
  ElMessage.info('路段接入功能开发中...')
}

// 联系人配置
const handleContact = (row: any) => {
  ElMessage.info(`联系人配置：${row.name}`)
}

// 绑定切片
const handleBindSlice = (row: any) => {
  ElMessage.info(`绑定切片：${row.name}`)
}

// 视频清单
const handleVideoList = (row: any) => {
  ElMessage.info(`视频清单：${row.name}`)
}

// 绑定监控视频
const handleBindVideo = (row: any) => {
  ElMessage.info(`绑定监控视频：${row.name}`)
}

// 自动切片
const handleAutoSlice = (row: any) => {
  ElMessage.info(`自动切片：${row.name}`)
}

// 切片视频
const handleSliceVideo = (row: any) => {
  ElMessage.info(`切片视频：${row.name}`)
}

// 数据分析
const handleDataAnalysis = (row: any) => {
  ElMessage.info(`数据分析：${row.name}`)
}

// 详情
const handleDetail = (row: any) => {
  ElMessage.info(`查看详情：${row.name}`)
}

// 移除
const handleRemove = (row: any) => {
  ElMessageBox.confirm(`确定要移除路段"${row.name}"吗？`, '移除确认', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    allData.value = allData.value.filter(item => item.id !== row.id)
    ElMessage.success('移除成功')
  }).catch(() => {})
}

// 获取拥挤程度类型
const getCongestionType = (level: string) => {
  const map: Record<string, string> = {
    '严重拥堵': 'danger',
    '中度拥堵': 'warning',
    '轻度拥堵': '',
    '基本畅通': 'success'
  }
  return map[level] || 'info'
}

// 获取状态类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '持续拥堵': 'danger',
    '缓慢通行': 'warning',
    '基本畅通': 'success',
    '拥堵': ''
  }
  return map[status] || 'info'
}

// 生成模拟数据
function generateMockData() {
  const roadNames = [
    'G4京港澳高速广州段', 'G15沈海高速广州段', 'G1501广州绕城高速',
    'S81环城高速', 'S15广佛高速', 'G94珠三角环线高速',
    '华南快速干线', '广园快速路', '广州大道', '中山大道',
    '天河路', '黄埔大道', '内环路', '外环路', '新光快速',
    '科韵路', '猎德大道', '广州大桥', '海印桥', '解放桥',
    '人民桥', '江湾桥', '海珠桥', '广州大桥', '华南大桥',
    '琶洲大桥', '东圃大桥', '黄埔大桥', '南沙大桥', '虎门大桥'
  ]

  const highwayNames = [
    '京港澳高速', '沈海高速', '广州绕城高速', '环城高速',
    '广佛高速', '珠三角环线高速', '华南快速', '广园快速',
    '广州大道', '中山大道', '天河路', '黄埔大道', '内环路',
    '外环路', '新光快速', '科韵路', '猎德大道', '广州大桥',
    '海印桥', '解放桥', '人民桥', '江湾桥', '海珠桥',
    '广州大桥', '华南大桥', '琶洲大桥', '东圃大桥', '黄埔大桥',
    '南沙大桥', '虎门大桥'
  ]

  const roadTypes = ['高速公路', '普通公路']
  const congestionLevels = ['严重拥堵', '中度拥堵', '轻度拥堵', '基本畅通']
  const trafficTypes = ['客流', '货运']
  const statuses = ['持续拥堵', '缓慢通行', '基本畅通', '拥堵']

  return roadNames.map((name, index) => ({
    id: index + 1,
    name,
    highwayName: highwayNames[index % highwayNames.length],
    roadType: roadTypes[index % 2],
    congestionLevel: congestionLevels[index % 4],
    trafficType: trafficTypes[index % 2],
    status: statuses[index % 4]
  }))
}
</script>

<style lang="scss" scoped>
.road-management {
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
      gap: 0;
      flex-shrink: 0;
    }

    .data-table { flex: 1; }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
