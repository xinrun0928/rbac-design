<template>
  <div class="service-area-management">
    <el-card class="table-card animate-item" shadow="never">
      <div class="search-bar">
        <span class="search-bar-title">大客流大货流服务区</span>
        <div class="search-bar-actions">
          <el-input
            v-model="searchName"
            placeholder="请输入服务区名称"
            clearable
            :prefix-icon="Search"
            style="width: 180px"
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          />
          <DataAccessButton text="服务区接入" @click="handleAdd" />
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
        <el-table-column prop="name" label="服务区名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="location" label="位置信息" min-width="180" show-overflow-tooltip />
        <el-table-column prop="region" label="所属区域" width="120" align="center" />
        <el-table-column prop="responsibleUnit" label="负责单位" min-width="150" show-overflow-tooltip />
        <el-table-column prop="serviceType" label="服务区类型" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.serviceType === '客运' ? 'primary' : 'warning'" size="small">
              {{ row.serviceType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180" align="center" />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleVideoList(row)">视频清单</el-button>
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
import { ElMessage } from 'element-plus'
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
  ElMessage.info('服务区接入功能开发中...')
}

// 视频清单
const handleVideoList = (row: any) => {
  ElMessage.success(`查看服务区视频：${row.name}`)
}

// 生成模拟数据
function generateMockData() {
  const serviceAreas = [
    '广州北服务区', '广州南服务区', '白云服务区', '天河服务区',
    '番禺服务区', '黄埔服务区', '花都服务区', '增城服务区',
    '从化服务区', '南沙服务区', '萝岗服务区', '海珠服务区',
    '荔湾服务区', '越秀服务区', '白云机场服务区', '广州东服务区',
    '广州西服务区', '广州北服务区', '龙洞服务区', '火村服务区',
    '太和服务区', '大朗服务区', '石井服务区', '嘉禾服务区',
    '钟落潭服务区', '良口服务区', '温泉服务区', '太平服务区',
    '新塘服务区', '永和服务区'
  ]

  const locations = [
    'G4京港澳高速K1588+200', 'G15沈海高速K2345+100', 'S81环城高速K56+300',
    'G94珠三角环线K123+400', 'S15广佛高速K45+200', '华南快速K89+100',
    '广园快速K12+300', '广州大道南K5+200', '中山大道东K8+100',
    '黄埔大道西K3+200', '内环路A线K15+300', '外环路K25+400',
    '新光快速K18+200', '科韵路K12+100', '猎德大道K5+300',
    '广州大桥北K2+100', '海印桥南K1+200', '解放桥北K1+300',
    '人民桥南K1+100', '江湾桥北K1+200', '海珠桥南K1+100',
    '广州大桥南K2+200', '华南大桥东K3+100', '琶洲大桥西K2+300',
    '东圃大桥南K4+100', '黄埔大桥东K5+200', '南沙大桥北K6+300',
    '虎门大桥西K7+100', '新光快速南K10+200', '科韵路北K8+300'
  ]

  const regions = [
    '广州市', '广州市', '广州市', '广州市', '广州市', '广州市',
    '广州市', '广州市', '广州市', '广州市', '广州市', '广州市',
    '广州市', '广州市', '广州市', '广州市', '广州市', '广州市',
    '广州市', '广州市', '广州市', '广州市', '广州市', '广州市',
    '广州市', '广州市', '广州市', '广州市', '广州市', '广州市'
  ]

  const units = [
    '广州交通集团', '广东高速公路有限公司', '广州交投集团', '广州交通集团',
    '广东高速公路有限公司', '广州交投集团', '广州交通集团', '广东高速公路有限公司',
    '广州交投集团', '广州交通集团', '广东高速公路有限公司', '广州交投集团',
    '广州交通集团', '广东高速公路有限公司', '广州交投集团', '广州交通集团',
    '广东高速公路有限公司', '广州交投集团', '广州交通集团', '广东高速公路有限公司',
    '广州交投集团', '广州交通集团', '广东高速公路有限公司', '广州交投集团',
    '广州交通集团', '广东高速公路有限公司', '广州交投集团', '广州交通集团',
    '广东高速公路有限公司', '广州交投集团'
  ]

  const serviceTypes = ['客运', '货运', '客运', '货运', '客运', '货运', '客运', '货运',
    '客运', '货运', '客运', '货运', '客运', '货运', '客运', '货运',
    '客运', '货运', '客运', '货运', '客运', '货运', '客运', '货运',
    '客运', '货运', '客运', '货运', '客运', '货运']

  const now = new Date()
  return serviceAreas.map((name, index) => {
    const updateTime = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    return {
      id: index + 1,
      name,
      location: locations[index % locations.length],
      region: regions[index % regions.length],
      responsibleUnit: units[index % units.length],
      serviceType: serviceTypes[index % serviceTypes.length],
      updateTime: updateTime.toLocaleString('zh-CN')
    }
  })
}
</script>

<style lang="scss" scoped>
.service-area-management {
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
