# 导航栏配置说明

## 配置入口

导航栏菜单统一维护在 `src/config/menu.ts`，各子系统通过对应的 `xxxMenus` 常量提供给布局组件，再传入 `src/components/AppSidebar.vue` 渲染。

常用菜单常量：

| 子系统 | 菜单常量 | 路径前缀 |
| --- | --- | --- |
| 后台管理 | `adminMenus` | `/admin` |
| 应急值守管理 | `dutyMenus` | `/duty` |
| 应急预案管理 | `planMenus` | `/plan` |
| 应急事件管理 | `eventMenus` | `/event` |
| 应急指挥调度 | `dispatchMenus` | `/dispatch` |
| 应急物资管理 | `materialMenus` | `/resource` |
| 辅助决策 | `decisionMenus` | `/decision` |
| 数据融合 | `fusionMenus` | `/fusion` |

## 菜单数据结构

`MenuItem` 支持以下字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `path` | `string` | 路由路径，需要与路由配置保持一致 |
| `title` | `string` | 菜单显示名称 |
| `icon` | `Component` | Element Plus 图标组件 |
| `children` | `MenuItem[]` | 子菜单列表 |
| `isGroup` | `boolean` | 是否作为分组标题展示 |
| `groupTitle` | `string` | 分组标题文案 |
| `status` | `'done' \| 'doing' \| 'todo'` | 页面完成状态，未配置时默认按 `done` 处理 |

## 完成状态

侧边栏会根据叶子菜单自动统计页面完成度：

| 状态 | 含义 | 侧边栏展示 |
| --- | --- | --- |
| `done` | 已完成 | `✓` |
| `doing` | 开发中 | `开发中` |
| `todo` | 未开始 | `未开始` |

示例：

```ts
{
  path: '/decision/tool-group',
  title: '辅助决策工具',
  icon: DataAnalysis,
  isGroup: true,
  groupTitle: '辅助决策工具',
  children: [
    { path: '/decision/tool/policy', title: '政策法规查询', icon: Search, status: 'todo' },
    { path: '/decision/tool/ai', title: '交通智慧大模型', icon: Cpu, status: 'todo' },
  ]
}
```

## 维护规则

1. 新增页面时，在对应子系统的菜单常量中新增菜单项，并同步路由配置。
2. 页面未开始开发时设置 `status: 'todo'`。
3. 页面已有基础结构但功能未完成时设置 `status: 'doing'`。
4. 页面功能和交互完成后可以省略 `status`，或显式设置 `status: 'done'`。
5. 分组菜单本身不参与进度统计，只有没有 `children` 的叶子菜单参与统计。
