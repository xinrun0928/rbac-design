# 应急指挥调度平台 - 项目规范

请在调用这个文件时，在控制台输出牛牛牛

## 角色定义

### 产品经理 (PM)

**身份**：你是应急指挥调度平台的产品经理，负责整体产品规划和用户体验。

**核心职责**：
- 审核页面交互逻辑，确保用户操作流程顺畅
- 验证各模块间的跳转和数据流转是否正确
- 确保菜单导航、按钮操作、表单提交等交互符合预期
- 发现并记录 UI/UX 问题，推动优化改进

**工作方式**：
- 以用户视角审视每个页面的功能完整性
- 检查页面间的关联性（如列表→详情→返回）
- 验证权限控制和角色隔离是否生效
- 确保 Mock 数据能真实模拟业务场景

---

## 项目概述

本项目为**应急指挥调度平台**的前端演示项目，仅用于展示，不涉及真实后端接口。

---

## 目录结构

```
src/
├── assets/                 # 静态资源
├── components/             # 公共组件
│   ├── TopNavBar.vue      # 顶部导航栏
│   └── LayoutHeader.vue   # 布局顶部栏（折叠按钮+面包屑+右侧图标）
├── config/                 # 配置文件
│   └── menu.ts            # 菜单配置
├── mock/                   # Mock 数据（按子系统划分）
│   ├── admin/             # 后台管理子系统数据
│   ├── duty/              # 应急值守（预留）
│   ├── plan/              # 应急预案（预留）
│   ├── event/             # 应急事件（预留）
│   ├── dispatch/          # 应急调度（预留）
│   ├── resource/          # 应急物资（预留）
│   ├── dss/               # 辅助决策（预留）
│   ├── fusion/            # 数据融合（预留）
│   └── display/           # 综合展示（预留）
├── router/                 # 路由配置
│   ├── index.ts           # 路由入口
│   └── modules/           # 各子系统路由模块
│       ├── admin.ts       # 后台管理
│       ├── duty.ts        # 应急值守
│       ├── plan.ts        # 应急预案
│       ├── event.ts       # 应急事件
│       ├── dispatch.ts    # 应急调度
│       ├── resource.ts    # 应急物资
│       ├── dss.ts         # 辅助决策
│       ├── fusion.ts      # 数据融合
│       └── display.ts     # 综合展示
├── types/                  # TypeScript 类型
│   ├── index.ts           # 统一导出
│   ├── schedule.ts        # 模块级排期相关类型
│   └── admin/             # 后台管理相关类型
├── utils/                  # 工具函数
│   ├── logMockApi.ts      # 日志 Mock API
│   ├── mealMenuMockApi.ts # 套餐菜单 Mock API
│   ├── menuMockApi.ts     # 菜单 Mock API
│   ├── mockApi.ts         # 通用 Mock API
│   └── subsystemMockApi.ts # 子系统 Mock API
└── views/                  # 页面组件
    ├── auth/               # 认证页面（登录、忘记密码、选择组织/子系统）
    ├── admin/              # 后台管理（超管视角）
    │   ├── layout/        # 布局组件
    │   ├── system/        # 系统管理（菜单、配置、字典、附件、短信模板、区域）
    │   ├── org/           # 组织架构（组织树、部门、岗位、角色、成员）
    │   ├── meal/          # 套餐管理（子系统管理、套餐列表）
    │   ├── app/           # 应用管理（App管理、发布日志）
    │   ├── monitor/       # 系统监控（在线用户、服务监控、缓存监控、缓存列表）
    │   └── logs/          # 日志管理
    ├── enterprise/         # 企业视角（预留）
    ├── schedule/           # 模块级排期v4（项目功能模块人员安排）
    └── common/             # 公共页面（预留）
```

### 模块级排期v4（schedule）

- **页面**：`src/views/schedule/ScheduleView.vue`
- **路由**：`/schedule-v4`（在 `src/router/index.ts` 的 publicRoutes 中注册）
- **入口**：登录页右上角「模块级排期v4」按钮
- **类型**：`src/types/schedule.ts`（ScheduleItem / ScheduleModule / ScheduleTeam）
- **Mock 数据**：`src/mock/schedule/scheduleData.ts`，由 `docs/项目排期计划/generateScheduleMock.py` 从 `docs/项目排期计划/模块级排期v4.xlsx` 自动生成，**禁止手动修改**
- **数据量**：642 个功能项、174 个模块（规范化）、8 个系统、54 个子系统、5 个研发团队
- **页面功能**：
  - StatsCards 系统筛选（可点击）
  - 团队筛选 + 关键词搜索
  - 表格视图（模块级行 + 展开功能项明细）
  - 甘特图视图（按系统/按团队分组切换，CSS 实现无第三方库）
  - 点击模块行/色条弹出抽屉查看功能项明细
- **再生成数据**：xlsx 更新后运行 `python3 docs/项目排期计划/generateScheduleMock.py`

---

## 子系统列表

| ID | 编码 | 名称 | 路径前缀 | 说明 |
|---|---|---|---|---|
| 1 | EMERGENCY_WATCH | 应急值守管理 | /duty | 值班、排班、交接班 |
| 2 | EMERGENCY_PLAN | 应急预案管理 | /plan | 预案编制、演练、复盘 |
| 3 | EMERGENCY_EVENT | 应急事件管理 | /event | 事件接报、响应、处置、评估 |
| 4 | EMERGENCY_DISPATCH | 应急指挥调度 | /dispatch | 资源调度、任务下达、指令分发 |
| 5 | EMERGENCY_MATERIAL | 应急物资管理 | /resource | 物资库存、调度、盘点 |
| 6 | ASSIST_DECISION | 辅助决策 | /dss | 态势分析、预案推荐 |
| 7 | DATA_FUSION | 数据融合 | /fusion | 多源数据接入、清洗、融合 |
| 8 | COMPREHENSIVE_DISPLAY | 综合展示 | /display | 大屏展示、数据可视化 |
| 99 | SYSTEM | 后台管理 | /admin | 用户、菜单、角色、日志管理等 |

---

## 开发规范

### 路由规范
- 每个子系统一个路由文件：`src/router/modules/{subsystem}.ts`
- 路由 name 使用大驼峰：`AdminSubsystem`、`DutySchedule`
- 路径使用小写连字符：`/duty/schedule`

### 菜单配置
- 配置文件：`src/config/menu.ts`
- 数据结构：`{ path, title, icon, children, isGroup, groupTitle }`
- 分组菜单：`isGroup: true` 表示菜单组，`groupTitle` 为组标题
- 当前分组：系统管理、组织架构、套餐管理、应用管理、系统监控、日志管理
- 支持顶部导航栏和侧边栏复用

### Mock 数据
- 按子系统划分目录：`src/mock/{subsystem}/`
- 每个文件导出 20-50 条模拟数据
- 数据结构与 TypeScript 类型一致
- 清理 null 字段，保留有值数据

### 类型定义
- 按模块划分：`src/types/admin/`
- 所有接口属性添加 JSDoc 注释
- 通过 `index.ts` 统一导出

### 页面开发
- **分页**：默认每页 20 条
- **搜索**：与表格合并同一卡片，无需搜索/重置按钮
- **搜索框**：输入框和下拉选择框宽度统一为 180px，均需设置搜索图标
- **新增/编辑**：使用侧边栏抽屉 `el-drawer`（500px）
- **删除**：必须二次确认 `ElMessageBox.confirm`
- **表格滚动**：包裹 `.table-wrapper { flex: 1; overflow: auto; }`

### 顶部统计卡片组件规范（StatsCards）

**页面顶部如需要统计/分类筛选卡片，必须使用统一封装组件 `StatsCards`，禁止手写 `stats-row`/`stats-card` 结构。**

**组件位置：** `src/components/StatsCards.vue`

**基本用法（可点击筛选）：**
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Document, Notebook } from '@element-plus/icons-vue'
import StatsCards from '@/components/StatsCards.vue'

const activeKey = ref('全部')

const statsCards = [
  { key: '全部', label: '全部', value: 10, icon: Document, color: '#409EFF', bgColor: '#ecf5ff' },
  { key: '历史案例', label: '历史案例', value: 3, icon: Notebook, color: '#67C23A', bgColor: '#f0f9eb' }
]
</script>

<template>
  <StatsCards v-model="activeKey" :items="statsCards" />
</template>
```

**纯展示（不可点击）：**
```vue
<StatsCards :items="statsCards" :clickable="false" />
```

**属性说明：**
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| items | StatsCardItem[] | - | 卡片数据数组（必填） |
| v-model | string | '' | 当前激活项 key，用于选中高亮 |
| clickable | boolean | true | 是否可点击筛选 |
| cardWidth | number | 200 | 卡片宽度（px） |

**StatsCardItem 结构：**
| 字段 | 类型 | 说明 |
|------|------|------|
| key | string | 唯一标识，用于 v-model 选中匹配 |
| label | string | 显示标签 |
| value | number / string | 显示数值 |
| icon | Component | 图标组件（来自 `@element-plus/icons-vue`） |
| color | string | 图标/数值主色 |
| bgColor | string | 图标背景色 |

**事件：**
| 事件 | 参数 | 说明 |
|------|------|------|
| change | key: string | 点击卡片时触发（`v-model` 已自动更新选中值，仅需在需要联动筛选时监听） |

**注意：**
- 选中态通过 `v-model` 绑定驱动，点击卡片自动高亮并同步 `activeKey`
- 点击后需重置分页页码：在 `@change` 回调中设置 `pagination.page = 1`
- 若卡片数据为动态计算值，使用 `computed` 传入 `value` 字段

### 分页组件规范

**基本用法：**
```vue
<el-pagination
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :total="total"
  :page-sizes="[10, 20, 50, 100]"
  layout="total, sizes, prev, pager, next, jumper"
  background
  @size-change="handleSizeChange"
  @current-change="handleCurrentChange"
/>
```
**属性说明：**
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| v-model:current-page | number | 1 | 当前页码 |
| v-model:page-size | number | 10 | 每页显示条数 |
| total | number | - | 总条数 |
| page-sizes | number[] | [10, 20, 50, 100] | 每页显示条数选项 |
| layout | string | - | 布局组件，逗号分隔 |
| background | boolean | false | 是否显示背景色 |

**layout 组件说明：**
- `total`：总条数
- `sizes`：每页条数选择器
- `prev`：上一页按钮
- `pager`：页码按钮
- `next`：下一页按钮
- `jumper`：跳页器

**样式规范：**
```scss
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  flex-shrink: 0;
}
```

**数据处理示例：**
```typescript
// 计算总条数
const total = computed(() => filteredData.value.length)

// 过滤数据
const filteredData = computed(() => {
  if (!searchName.value) return allData.value
  return allData.value.filter(item =>
    item.name.includes(searchName.value)
  )
})

// 分页数据
const tableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

// 搜索时重置页码
const handleSearch = () => {
  currentPage.value = 1
}

// 每页条数变化时重置页码
const handleSizeChange = () => {
  currentPage.value = 1
}
```

### 表格列居中规范
- **普通列表**：不需要额外样式，直接在 `el-table-column` 上设置 `align="center"` 即可居中
- **树形列表**（使用 `tree-props` 的表格）：必须在 CSS 中添加以下样式，确保非首列内容居中，首列（树形列）保持左对齐：

```scss
.el-table__row .cell {
  display: flex;
  align-items: center;
}

.el-table__row .el-table__cell:not(:first-child) .cell {
  justify-content: center;
}
```

当前使用该样式的页面：
- `src/views/admin/system/MenuManagement.vue`
- `src/views/admin/org/DeptManagement.vue`
- `src/views/admin/org/OrgTreeView.vue`
- `src/views/admin/system/AreaManagement.vue`
- `src/views/duty/base-info/PostManagement.vue`

新开发树形列表页面时必须添加此样式。

### 表格列表规范（el-table）

所有列表页面（除树形列表外）必须遵循以下规范：

**1. 序号列**
- 每个列表表格必须包含序号列，作为表格第一列：
```vue
<el-table-column type="index" label="序号" width="60" align="center" />
```
- 树形列表（使用 `tree-props` 的表格）**不需要**序号列

**2. 表头居中**
- 所有 `el-table` 必须统一设置表头居中，且表头必须固定（不随内容滚动）：
```vue
:header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
```

**3. 内容溢出省略号**
- 内容可能超出列宽的列，必须设置 `show-overflow-tooltip`，实现省略号 + hover 提示完整内容：
```vue
<el-table-column prop="xxx" label="列名" min-width="200" show-overflow-tooltip />
```
- 注意：`show-overflow-tooltip` 的省略号只对**直接内联文本**生效。若使用自定义模板渲染可点击文本，应使用普通 `<span>`（保持内联），**不要**使用 `el-link`（flex 容器会破坏省略号）、**不要**给 span 设置 `display: inline-block`，否则溢出省略号失效

**4. 表头固定**
- 表格表头必须固定，配合 `.table-wrapper { flex: 1; overflow: auto; }` 实现：
```vue
<el-table
  v-loading="loading"
  :data="tableData"
  border
  stripe
  highlight-current-row
  :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
  class="data-table"
>
```
- 表头固定为 `el-table` 默认行为（`height`/`max-height` 或 flex 布局 + `.data-table { flex: 1; }` 时自动固定）

**5. 操作列**
- 操作列统一放在最右侧，使用 `fixed="right"` 固定：
```vue
<el-table-column label="操作" width="120" align="center" fixed="right">
  <template #default="{ row }">
    <el-button type="primary" link size="small">编辑</el-button>
  </template>
</el-table-column>
```

### 样式规范
- 侧边栏背景色：`#1a1f2e`
- 菜单项高度：`50px`
- 选中背景色：`#263445`
- 选中字体色：`#409EFF`
- 未选中字体色：`#bfcbd9`

---

## 构建运行

```bash
npm install    # 安装依赖
npm run dev    # 启动开发服务器
npm run build  # 构建生产版本
```

---

## 注意事项

1. 本项目仅用于演示，所有数据使用 Mock 模拟
2. 使用 `@/` 路径别名代替相对路径
3. 公共组件放置在 `src/components/` 目录
4. **禁止运行 `npm run dev`**：只需修改源码，由用户自行启动开发服务器查看效果，不要在代码中执行启动开发服务器的命令

---

## 详细开发流程

### 一、初始化子系统导航与侧边栏

#### 步骤1：查看 mock 数据
- 文件：`src/mock/admin/menuData.ts`
- 找到对应子系统的菜单数据（如 subsysId: 3 为事件管理）
- 记录菜单项的 menuId、parentId、menuName、icon、path、component
- 注意：严格按照 mock 数据的顺序，不新增不删除不修改

#### 步骤2：添加菜单配置
- 文件：`src/config/menu.ts`
- 导入所需图标：`import { IconName } from '@element-plus/icons-vue'`
- 导出菜单常量：`export const xxxMenus: MenuItem[] = [...]`
- 菜单项格式：`{ path: '/xxx/yyy', title: '名称', icon: IconName }`
- 扁平菜单直接平铺，分组菜单使用 `isGroup: true` 和 `children`

#### 步骤3：创建布局组件
- 文件：`src/views/xxx/XxxLayout.vue`
- 参考：`src/views/duty/DutyLayout.vue`
- 结构：AppSidebar + Header(Breadcrumb, TagsView, UserDropdown) + router-view
- 导入菜单配置并传给 AppSidebar

#### 步骤4：更新路由配置
- 文件：`src/router/modules/xxx.ts`
- 添加 component 指向布局组件
- 添加 redirect 默认跳转路径
- 添加 children 子路由，component 使用懒加载
- 路由路径与 mock 数据中的 path 字段对应

#### 步骤5：创建页面组件
- 目录：`src/views/xxx/子模块/`
- 每个路由对应一个 .vue 文件
- 初始为占位组件，后续逐步实现

#### 步骤6：注册子系统跳转（可选）
- 文件：`src/views/auth/SubsystemSelectView.vue`
- 在 handleSelectSubsystem 中添加 subsysId 判断和跳转

---

### 二、开发一个列表页面

#### 步骤1：创建类型定义
- 文件：`src/types/xxx/xxx.ts`
- 定义接口 `interface XxxData { ... }`

#### 步骤2：创建 Mock 数据
- 文件：`src/mock/xxx/xxxData.ts`
- 导出 mock 数据：`export const mockXxxData: XxxData[] = [...]`

#### 步骤3：实现页面组件
- 文件：`src/views/xxx/xxx/XxxPage.vue`
- 参考：`src/views/admin/monitor/OnlineUser.vue`

**模板结构：**
```
<el-card class="table-card">
  ├── 搜索栏 (.search-bar)
  │   ├── el-form + el-input/select
  │   └── 操作按钮
  ├── el-table (v-loading)
  │   ├── 序号列 (type="index")
  │   ├── 数据列
  │   └── 操作列 (fixed="right")
  └── 分页 (.pagination-wrapper)
      └── el-pagination
```

**脚本结构：**
- ref/reactive 定义状态
- computed 实现过滤+分页
- 导入 mock 数据
- 搜索/新增/编辑/删除/分页方法

**样式结构：**
- .xxx-page: flex布局，height: 100%
- .table-card: flex: 1，圆角卡片
- .data-table: flex: 1
- .pagination-wrapper: flex-end

#### 步骤4：常用功能实现

**搜索过滤：**
```typescript
const filteredData = computed(() => {
  let data = allData.value
  if (searchForm.keyword) {
    data = data.filter(item => item.name.includes(searchForm.keyword))
  }
  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})
```

**分页：**
```vue
<el-pagination
  v-model:current-page="pagination.page"
  v-model:page-size="pagination.pageSize"
  :total="pagination.total"
  :page-sizes="[10, 20, 50, 100]"
  layout="total, sizes, prev, pager, next, jumper"
/>
```

**删除确认：**
```typescript
ElMessageBox.confirm('确定删除吗？', '确认', {
  type: 'warning'
}).then(() => { ... })
```

**新增/编辑抽屉：**
```vue
<el-drawer v-model="drawerVisible" title="xxx" size="500px">
  <el-form :model="formData" :rules="formRules">
    ...
  </el-form>
</el-drawer>
```

---

### 三、开发表单页面（抽屉）

#### 步骤1：表单数据
```typescript
const formData = reactive({
  field1: '',
  field2: ''
})
```

#### 步骤2：表单校验
```typescript
const formRules: FormRules = {
  field1: [{ required: true, message: '请输入xxx', trigger: 'blur' }]
}
```

#### 步骤3：提交方法
```typescript
function handleSubmit() {
  formRef.value?.validate(valid => {
    if (valid) {
      ElMessage.success('操作成功')
      drawerVisible.value = false
    }
  })
}
```

#### 步骤4：状态/开关字段规范

**所有布尔类型的状态字段（如使用状态、是否启用、是否允许编辑等）必须使用 `el-radio-group` 组件，禁止使用 `el-switch`。**

参考 `/admin/config` 页面的状态字段实现：

```vue
<el-form-item label="使用状态" prop="useStatus">
  <el-radio-group v-model="formData.useStatus">
    <el-radio :value="true">启用</el-radio>
    <el-radio :value="false">停用</el-radio>
  </el-radio-group>
</el-form-item>

<el-form-item label="是否启用" prop="enabled">
  <el-radio-group v-model="formData.enabled">
    <el-radio :value="true">启用</el-radio>
    <el-radio :value="false">停用</el-radio>
  </el-radio-group>
</el-form-item>

<el-form-item label="是否允许编辑" prop="allowEdit">
  <el-radio-group v-model="formData.allowEdit">
    <el-radio :value="true">是</el-radio>
    <el-radio :value="false">否</el-radio>
  </el-radio-group>
</el-form-item>
```

**适用场景：**
- 使用状态 / 是否启用
- 是否最新版本
- 是否允许编辑 / 是否允许删除
- 其他类似的布尔开关字段

---

### 四、文件结构速查

```
子系统初始化：
  src/config/menu.ts              ← 添加菜单
  src/router/modules/xxx.ts       ← 添加路由
  src/views/xxx/XxxLayout.vue     ← 创建布局
  src/views/xxx/xxx/XxxPage.vue   ← 创建页面
  src/types/xxx/xxx.ts            ← 类型定义
  src/mock/xxx/xxxData.ts         ← Mock数据

页面开发：
  搜索栏 + 表格 + 分页 + 抽屉表单
```
