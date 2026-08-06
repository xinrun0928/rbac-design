import type { RouteRecordRaw } from 'vue-router'

/**
 * 厅级应急物资管理子系统路由 (MATERIAL)
 * 路径前缀: /resource
 * 包含: 设备物资仓库管理、无人机飞控管理、装备维保管理、装备培训与考核、基础管理
 */
const resourceRoutes: RouteRecordRaw = {
  path: '/resource',
  component: () => import('@/views/resource/MaterialLayout.vue'),
  meta: { title: '物资管理', subsystem: 'MATERIAL' },
  redirect: '/resource/warehouse/query',
  children: [
    // 首页
    { path: 'home', name: 'MaterialHome', component: () => import('@/views/resource/MaterialHome.vue'), meta: { title: '首页' } },
    // 设备物资仓库管理
    { path: 'warehouse/query', name: 'MaterialWarehouseQuery', component: () => import('@/views/resource/warehouse/Query.vue'), meta: { title: '库存查询' } },
    { path: 'warehouse/apply', name: 'MaterialWarehouseApply', component: () => import('@/views/resource/warehouse/Apply.vue'), meta: { title: '调用申请' } },
    { path: 'warehouse/check', name: 'MaterialWarehouseCheck', component: () => import('@/views/resource/warehouse/Check.vue'), meta: { title: '库存盘点' } },
    { path: 'warehouse/audit', name: 'MaterialWarehouseAudit', component: () => import('@/views/resource/warehouse/Audit.vue'), meta: { title: '调用审核' } },
    { path: 'warehouse/warehouse', name: 'MaterialWarehouseWarehouse', component: () => import('@/views/resource/warehouse/Warehouse.vue'), meta: { title: '仓库查询' } },
    { path: 'warehouse/warning', name: 'MaterialWarehouseWarning', component: () => import('@/views/resource/warehouse/Warning.vue'), meta: { title: '安全库存预警' } },
    { path: 'warehouse/fault-warning', name: 'MaterialWarehouseFaultWarning', component: () => import('@/views/resource/warehouse/FaultWarning.vue'), meta: { title: '故障/报废预警' } },
    // 无人机飞控管理
    { path: 'drone/device', name: 'MaterialDroneDevice', component: () => import('@/views/resource/drone/Device.vue'), meta: { title: '设备管理' } },
    { path: 'drone/monitor', name: 'MaterialDroneMonitor', component: () => import('@/views/resource/drone/Monitor.vue'), meta: { title: '飞行监控' } },
    // 装备维保管理
    { path: 'maintenance/plan', name: 'MaterialMaintenancePlan', component: () => import('@/views/resource/maintenance/Plan.vue'), meta: { title: '装备维保计划' } },
    { path: 'maintenance/record', name: 'MaterialMaintenanceRecord', component: () => import('@/views/resource/maintenance/Record.vue'), meta: { title: '维保记录' } },
    { path: 'maintenance/fault', name: 'MaterialMaintenanceFault', component: () => import('@/views/resource/maintenance/Fault.vue'), meta: { title: '故障设备' } },
    { path: 'maintenance/retire', name: 'MaterialMaintenanceRetire', component: () => import('@/views/resource/maintenance/Retire.vue'), meta: { title: '退役/报废审核' } },
    // 装备培训与考核
    { path: 'training/use', name: 'MaterialTrainingUse', component: () => import('@/views/resource/training/Use.vue'), meta: { title: '装备使用教程' } },
    { path: 'training/template', name: 'MaterialTrainingTemplate', component: () => import('@/views/resource/training/Template.vue'), meta: { title: '装备操作考核模板' } },
    { path: 'training/record', name: 'MaterialTrainingRecord', component: () => import('@/views/resource/training/Record.vue'), meta: { title: '装备操作考核记录' } },
    { path: 'training/task', name: 'MaterialTrainingTask', component: () => import('@/views/resource/training/Task.vue'), meta: { title: '装备操作考核任务' } },
    // 基础管理
    { path: 'basic/category', name: 'MaterialBasicCategory', component: () => import('@/views/resource/basic/Category.vue'), meta: { title: '物资装备种类管理' } },
    { path: 'basic/set', name: 'MaterialBasicSet', component: () => import('@/views/resource/basic/Set.vue'), meta: { title: '装备套组管理' } },
  ]
}

export default resourceRoutes
