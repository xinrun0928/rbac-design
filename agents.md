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
│   └── TopNavBar.vue      # 顶部导航栏
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
    └── common/             # 公共页面（预留）
```

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

### 样式规范
- 侧边栏背景色：`#1a1f2e`
- 菜单项高度：`50px`
- 选中背景色：`#263445`
- 选中字体色：`#409EFF`
- 未选中字体色：`#bfcbd9`

---

## 构建运行

```bash
pnpm install    # 安装依赖
pnpm dev        # 启动开发服务器
pnpm build      # 构建生产版本
```

---

## 注意事项

1. 本项目仅用于演示，所有数据使用 Mock 模拟
2. 使用 `@/` 路径别名代替相对路径
3. 公共组件放置在 `src/components/` 目录
