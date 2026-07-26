<template>
  <div class="page-container">
    <!-- 搜索区域 -->
    <div class="search-bar">
      <el-input
        v-model="searchName"
        placeholder="请输入收费站名称"
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
      <el-table-column prop="name" label="收费站名称" min-width="150" show-overflow-tooltip />
      <el-table-column prop="location" label="位置信息" min-width="180" show-overflow-tooltip />
      <el-table-column prop="region" label="所属区域" width="120" align="center" />
      <el-table-column prop="responsibleUnit" label="负责单位" min-width="150" show-overflow-tooltip />
      <el-table-column prop="stationType" label="收费站类型" width="120" align="center">
        <template #default="{ row }">
          <el-tag :type="getStationTypeTag(row.stationType)" size="small">
            {{ row.stationType }}
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

// 视频清单
const handleVideoList = (row: any) => {
  ElMessage.success(`查看收费站视频：${row.name}`)
}

// 获取收费站类型标签
const getStationTypeTag = (type: string) => {
  const map: Record<string, string> = {
    '省界收费站': 'danger',
    '入口收费站': 'primary',
    '出口收费站': 'success',
    '主线收费站': 'warning'
  }
  return map[type] || 'info'
}

// 生成模拟数据
function generateMockData() {
  const stations = [
    '广州北收费站', '广州南收费站', '白云收费站', '天河收费站',
    '番禺收费站', '黄埔收费站', '花都收费站', '增城收费站',
    '从化收费站', '南沙收费站', '萝岗收费站', '海珠收费站',
    '荔湾收费站', '越秀收费站', '白云机场收费站', '广州东收费站',
    '广州西收费站', '广州北收费站', '龙洞收费站', '火村收费站',
    '太和收费站', '大朗收费站', '石井收费站', '嘉禾收费站',
    '钟落潭收费站', '良口收费站', '温泉收费站', '太平收费站',
    '新塘收费站', '永和收费站'
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

  const stationTypes = ['省界收费站', '入口收费站', '出口收费站', '主线收费站',
    '省界收费站', '入口收费站', '出口收费站', '主线收费站',
    '省界收费站', '入口收费站', '出口收费站', '主线收费站',
    '省界收费站', '入口收费站', '出口收费站', '主线收费站',
    '省界收费站', '入口收费站', '出口收费站', '主线收费站',
    '省界收费站', '入口收费站', '出口收费站', '主线收费站',
    '省界收费站', '入口收费站', '出口收费站', '主线收费站',
    '省界收费站', '入口收费站']

  const now = new Date()
  return stations.map((name, index) => {
    const updateTime = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    return {
      id: index + 1,
      name,
      location: locations[index % locations.length],
      region: regions[index % regions.length],
      responsibleUnit: units[index % units.length],
      stationType: stationTypes[index % stationTypes.length],
      updateTime: updateTime.toLocaleString('zh-CN')
    }
  })
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
