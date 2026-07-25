import type { RouteRecordRaw } from 'vue-router'

/**
 * 数据融合子系统路由 (DATA_FUSION)
 * 路径前缀: /fusion
 * 包含: 多源数据接入、清洗、融合
 */
const fusionRoutes: RouteRecordRaw = {
  path: '/fusion',
  meta: { title: '数据融合', subsystem: 'DATA_FUSION' },
  children: [
    // TODO: 后续添加数据融合相关页面
  ]
}

export default fusionRoutes
