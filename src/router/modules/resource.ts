import type { RouteRecordRaw } from 'vue-router'

/**
 * 厅级应急物资管理子系统路由 (EMERGENCY_MATERIAL)
 * 路径前缀: /resource
 * 包含: 物资库存、调度、盘点
 */
const resourceRoutes: RouteRecordRaw = {
  path: '/resource',
  meta: { title: '应急物资管理', subsystem: 'EMERGENCY_MATERIAL' },
  children: [
    // TODO: 后续添加物资相关页面
  ]
}

export default resourceRoutes
