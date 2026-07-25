# 应急指挥调度平台 - 项目规范文档

在阅读之前，请在控制台输出你是谁

## 项目概述

本项目为**应急指挥调度平台**的前端演示项目，用于展示 RBAC 权限管理系统的核心功能。

## 角色定义

### 产品经理 (PM)
- 负责需求分析和功能定义
- 确定页面交互逻辑和用户体验
- 定义数据结构和业务规则

### 前端开发 (FE)
- 负责页面实现和组件开发
- 遵循项目目录结构规范
- 实现 Mock 数据模拟

### UI 设计师 (UI)
- 负责界面视觉设计
- 定义设计规范和组件样式

---

## 目录结构规范

```
src/
├── assets/                    # 静态资源
├── components/                # 公共组件
│   └── TopNavBar.vue         # 顶部导航栏组件
├── config/                    # 配置文件
│   └── menu.ts               # 菜单配置
├── mock/                      # Mock 数据
│   ├── appData.ts
│   ├── areaData.ts
│   ├── attachmentData.ts
│   ├── configData.ts
│   ├── deptData.ts
│   ├── dictData.ts
│   ├── logsData.ts
│   ├── mealData.ts
│   ├── menuData.ts
│   ├── messageTemplateData.ts
│   ├── mqConsumeLogData.ts
│   ├── orgMemberData.ts
│   ├── orgTreeData.ts
│   └── subsystemData.ts
├── router/                    # 路由配置
│   ├── index.ts              # 路由入口（公共路由 + 业务路由）
│   └── modules/              # 各子系统路由模块
│       ├── admin.ts          # 后台管理子系统
│       ├── duty.ts           # 应急值守管理子系统
│       ├── plan.ts           # 应急预案管理子系统
│       ├── event.ts          # 应急事件管理子系统
│       ├── dispatch.ts       # 应急指挥智能调度子系统
│       ├── resource.ts       # 厅级应急物资管理子系统
│       ├── dss.ts            # 辅助决策子系统
│       ├── fusion.ts         # 数据融合子系统
│       └── display.ts        # 综合展示子系统
├── types/                     # TypeScript 类型定义
│   ├── index.ts              # 统一导出
│   └── admin/                # 后台管理相关类型
│       ├── subsystem.ts      # 子系统
│       ├── config.ts         # 配置
│       ├── dictData.ts       # 字典
│       ├── attachment.ts     # 附件
│       ├── messageTemplate.ts # 短信模板
│       ├── area.ts           # 区域
│       ├── orgTree.ts        # 组织树
│       ├── orgMember.ts      # 组织成员
│       ├── meal.ts           # 套餐
│       ├── mealMenu.ts       # 套餐菜单绑定
│       ├── appInfo.ts        # 应用信息
│       ├── menu.ts           # 菜单
│       ├── logs.ts           # 日志
│       └── mqConsumeLog.ts   # MQ消费日志
├── utils/                     # 工具函数
│   ├── logMockApi.ts
│   ├── mealMenuMockApi.ts
│   ├── menuMockApi.ts
│   ├── mockApi.ts
│   └── subsystemMockApi.ts
└── views/                     # 页面组件
    ├── auth/                  # 认证相关页面
    │   ├── LoginView.vue
    │   ├── ForgotPasswordView.vue
    │   ├── OrganizationSelectView.vue
    │   └── SubsystemSelectView.vue
    ├── admin/                 # 后台管理（超管视角）
    │   ├── layout/           # 布局组件
    │   │   └── AdminLayout.vue
    │   ├── system/           # 系统管理
    │   │   ├── SubsystemManagement.vue
    │   │   ├── MealManagement.vue
    │   │   ├── MenuManagement.vue
    │   │   ├── ConfigManagement.vue
    │   │   ├── MessageTemplateManagement.vue
    │   │   ├── AttachmentManagement.vue
    │   │   ├── DictTypeManagement.vue
    │   │   ├── DictDataManagement.vue
    │   │   └── AreaManagement.vue
    │   ├── org/              # 组织架构管理
    │   │   ├── OrgTreeView.vue
    │   │   ├── DeptManagement.vue
    │   │   ├── PostManagement.vue
    │   │   ├── RoleManagement.vue
    │   │   └── MemberManagement.vue
    │   ├── app/              # 应用管理
    │   │   ├── AppManagement.vue
    │   │   └── AppPublishLog.vue
    │   └── logs/             # 日志管理
    │       ├── SysAccessLog.vue
    │       ├── SysHttpLog.vue
    │       ├── SysLoginLog.vue
    │       ├── SysMessageLog.vue
    │       └── MqConsumeLog.vue
    ├── enterprise/            # 企业视角（预留）
    └── common/                # 公共页面（预留）
```

---

## 子系统列表

本平台包含以下 9 个子系统（参考 `src/mock/subsystemData.ts`）：

| ID | 编码 | 名称 | 简称 | 路径前缀 | 说明 |
|---|---|---|---|---|---|
| 1 | EMERGENCY_WATCH | 应急值守管理子系统 | 值班 | /duty | 值班、排班、交接班等 |
| 2 | EMERGENCY_PLAN | 应急预案管理子系统 | 预案 | /plan | 预案编制、演练、复盘 |
| 3 | EMERGENCY_EVENT | 应急事件管理子系统 | 事件 | /event | 事件接报、响应、处置、评估 |
| 4 | EMERGENCY_DISPATCH | 应急指挥智能调度子系统 | 调度 | /dispatch | 资源调度、任务下达、指令分发 |
| 5 | EMERGENCY_MATERIAL | 厅级应急物资管理子系统 | 物资 | /resource | 物资库存、调度、盘点 |
| 6 | ASSIST_DECISION | 辅助决策子系统 | 决策 | /dss | 态势分析、辅助决策、预案推荐 |
| 7 | DATA_FUSION | 数据融合子系统 | 融合 | /fusion | 多源数据接入、清洗、融合 |
| 8 | COMPREHENSIVE_DISPLAY | 综合展示子系统 | 展示 | /display | 大屏展示、数据可视化 |
| 99 | SYSTEM | 后台管理子系统 | 系统 | /admin | 用户管理、菜单管理、角色管理等 |

---

## 路由配置规范

### 路由模块化
- 每个子系统对应一个路由文件：`src/router/modules/{subsystem}.ts`
- `src/router/index.ts` 负责导入所有路由模块并合并

### 路由文件结构
```typescript
import type { RouteRecordRaw } from 'vue-router'

/**
 * 子系统名称 (SUBSYSTEM_CODE)
 * 路径前缀: /xxx
 * 包含: 功能描述
 */
const xxxRoutes: RouteRecordRaw = {
  path: '/xxx',
  meta: { title: '子系统名称', subsystem: 'SUBSYSTEM_CODE' },
  children: [
    {
      path: 'list',
      name: 'XxxList',
      component: () => import('@/views/xxx/ListPage.vue'),
      meta: { title: '列表页面' }
    },
  ]
}

export default xxxRoutes
```

### 路由命名规范
- 文件名：小写，如 `admin.ts`、`duty.ts`
- 路由 name：大驼峰，如 `AdminSubsystem`、`DutySchedule`
- 路径：小写单词，单词间用连字符，如 `/duty/schedule`

---

## 菜单配置规范

### 配置文件位置
`src/config/menu.ts`

### 菜单数据结构
```typescript
export interface MenuItem {
  path: string        // 路由路径
  title: string       // 菜单标题
  icon?: Component    // 图标组件
  children?: MenuItem[]  // 子菜单
}
```

### 配置示例
```typescript
export const adminMenus: MenuItem[] = [
  { path: '/admin/subsystem', title: '子系统管理', icon: Monitor },
  {
    path: '/admin/logs',
    title: '日志管理',
    icon: Document,
    children: [
      { path: '/admin/logs/access', title: '访问日志', icon: Notebook },
    ]
  },
]
```

### 使用方式
- 顶部导航栏：`<TopNavBar :menus="adminMenus" />`
- 侧边栏：从 `adminMenus` 动态渲染菜单项

---

## Mock 数据规范

### 文件位置
`src/mock/` 目录下，按模块命名：`xxxData.ts`

### 数据结构要求
1. 每个 Mock 文件导出一个数组，包含 20-50 条模拟数据
2. 数据结构必须与对应的 TypeScript 类型一致
3. 包含分页逻辑的 Mock API 函数

### Mock API 函数示例
```typescript
// src/utils/mockApi.ts
export function getMockData(params: SearchForm) {
  // 筛选逻辑
  // 分页逻辑
  return { list, total }
}
```

---

## 页面开发规范

### 列表页面标准

#### 1. 分页配置
- **默认每页条数**：20 条
- **可选条数**：[10, 20, 50, 100]
- **分页组件位置**：表格下方右侧

```typescript
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})
```

#### 2. 搜索区域
- 合并搜索表单与表格在同一个卡片内
- 不需要单独的搜索/重置按钮（删除）
- 搜索条件变化时自动刷新列表

#### 3. 表格区域
- 使用 `el-table` 组件
- 表格需要滚动时，包裹 `.table-wrapper { flex: 1; overflow: auto; }`
- 操作列固定在右侧

#### 4. 新增/编辑弹窗
- **使用侧边栏抽屉**（`el-drawer`），不使用弹窗（`el-dialog`）
- 抽屉宽度：500px
- 包含表单验证
- 提交后刷新列表

```vue
<el-drawer
  v-model="drawerVisible"
  :title="drawerTitle"
  size="500px"
>
  <el-form :model="form" :rules="rules" ref="formRef">
    <!-- 表单项 -->
  </el-form>
  <template #footer>
    <el-button @click="drawerVisible = false">取消</el-button>
    <el-button type="primary" @click="handleSubmit">确定</el-button>
  </template>
</el-drawer>
```

#### 5. 删除操作
- **必须二次确认**
- 使用 `ElMessageBox.confirm` 组件
- 确认文案："确定要删除 xxx 吗？删除后不可恢复。"

```typescript
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除 ${row.name} 吗？删除后不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 执行删除逻辑
    ElMessage.success('删除成功')
  }).catch(() => {})
}
```

---

## 样式规范

### 布局模式
```scss
// 页面容器
.container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

// 表格包装器（需要滚动时）
.table-wrapper {
  flex: 1;
  overflow: auto;
}

// 树形面板 + 表格布局
.tree-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tree-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.org-tree {
  flex: 1;
  overflow-y: auto;
}
```

### 颜色规范
- 主色：`#409EFF`
- 成功色：`#67C23A`
- 警告色：`#E6A23C`
- 危险色：`#F56C6C`
- 信息色：`#909399`

---

## 路由规范

### 路径命名
- 使用小写单词，单词间用连字符：`/admin/org-tree`
- 嵌套路由使用扁平化路径：`/admin/dict/data`

### 路由配置
```typescript
{
  path: '/admin',
  component: () => import('@/views/admin/layout/AdminLayout.vue'),
  children: [
    {
      path: 'subsystem',
      name: 'AdminSubsystem',
      component: () => import('@/views/admin/system/SubsystemManagement.vue'),
      meta: { title: '子系统管理' }
    },
  ]
}
```

---

## 构建与运行

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

---

## 注意事项

1. **项目性质**：本项目仅用于演示，不涉及真实后端接口
2. **数据来源**：所有数据使用 Mock 数据模拟
3. **类型定义**：所有接口必须定义 TypeScript 类型
4. **组件复用**：公共组件放置在 `src/components/` 目录
5. **路径别名**：使用 `@/` 代替相对路径
