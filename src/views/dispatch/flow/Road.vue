<template>
  <div class="page-container">
    <!-- 搜索区域 -->
    <div class="search-bar">
      <el-input
        v-model="searchName"
        placeholder="请输入路段名称"
        clearable
        @clear="handleSearch"
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%"
      height="calc(100vh - 200px)"
    >
      <el-table-column type="index" label="序号" width="70" align="center" :index="getIndex" />
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
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleBind(row)">绑定</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

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
const handleSizeChange = () => {
  currentPage.value = 1
}

// 页码变化
const handleCurrentChange = () => {}

// 绑定操作
const handleBind = (row: any) => {
  ElMessage.success(`已绑定路段：${row.name}`)
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
.page-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-shrink: 0;

  .el-input {
    width: 300px;
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
  padding: 10px 0;
  flex-shrink: 0;
}
</style>
