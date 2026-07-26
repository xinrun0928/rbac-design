import type { RouteRecordRaw } from 'vue-router'

/**
 * 厅级应急物资管理子系统路由 (MATERIAL)
 * 路径前缀: /material
 * 包含: 设备物资仓库管理、装备维保管理、装备培训与考核、基础管理
 */
const resourceRoutes: RouteRecordRaw = {
  path: '/resource',
  component: () => import('@/views/material/MaterialLayout.vue'),
  meta: { title: '物资管理', subsystem: 'MATERIAL' },
  children: [
    // 首页
    { path: 'home', name: 'MaterialHome', component: () => import('@/views/material/MaterialHome.vue'), meta: { title: '首页' } },
    // 设备物资仓库管理
    { path: 'warehouse/query', name: 'MaterialWarehouseQuery', component: () => import('@/views/material/warehouse/Query.vue'), meta: { title: '库存查询' } },
    { path: 'warehouse/apply', name: 'MaterialWarehouseApply', component: () => import('@/views/material/warehouse/Apply.vue'), meta: { title: '调用申请' } },
    { path: 'warehouse/check', name: 'MaterialWarehouseCheck', component: () => import('@/views/material/warehouse/Check.vue'), meta: { title: '库存盘点' } },
    { path: 'warehouse/audit', name: 'MaterialWarehouseAudit', component: () => import('@/views/material/warehouse/Audit.vue'), meta: { title: '调用审核' } },
    { path: 'warehouse/warehouse', name: 'MaterialWarehouseWarehouse', component: () => import('@/views/material/warehouse/Warehouse.vue'), meta: { title: '仓库查询' } },
    { path: 'warehouse/warning', name: 'MaterialWarehouseWarning', component: () => import('@/views/material/warehouse/Warning.vue'), meta: { title: '安全库存预警' } },
    { path: 'warehouse/fault-warning', name: 'MaterialWarehouseFaultWarning', component: () => import('@/views/material/warehouse/FaultWarning.vue'), meta: { title: '故障/报废预警' } },
    // 装备维保管理
    { path: 'maintenance/plan', name: 'MaterialMaintenancePlan', component: () => import('@/views/material/maintenance/Plan.vue'), meta: { title: '装备维保计划' } },
    { path: 'maintenance/record', name: 'MaterialMaintenanceRecord', component: () => import('@/views/material/maintenance/Record.vue'), meta: { title: '维保记录' } },
    { path: 'maintenance/fault', name: 'MaterialMaintenanceFault', component: () => import('@/views/material/maintenance/Fault.vue'), meta: { title: '故障设备' } },
    { path: 'maintenance/retire', name: 'MaterialMaintenanceRetire', component: () => import('@/views/material/maintenance/Retire.vue'), meta: { title: '退役/报废审核' } },
    // 装备培训与考核
    { path: 'training/use', name: 'MaterialTrainingUse', component: () => import('@/views/material/training/Use.vue'), meta: { title: '装备使用培训' } },
    { path: 'training/template', name: 'MaterialTrainingTemplate', component: () => import('@/views/material/training/Template.vue'), meta: { title: '装备操作考核模板' } },
    { path: 'training/record', name: 'MaterialTrainingRecord', component: () => import('@/views/material/training/Record.vue'), meta: { title: '装备操作考核记录' } },
    // 基础管理
    { path: 'basic/warehouse', name: 'MaterialBasicWarehouse', component: () => import('@/views/material/basic/Warehouse.vue'), meta: { title: '仓库管理' } },
    { path: 'basic/category', name: 'MaterialBasicCategory', component: () => import('@/views/material/basic/Category.vue'), meta: { title: '物资装备种类管理' } },
    { path: 'basic/set', name: 'MaterialBasicSet', component: () => import('@/views/material/basic/Set.vue'), meta: { title: '装备套组管理' } },
  ]
}

export default resourceRoutes
