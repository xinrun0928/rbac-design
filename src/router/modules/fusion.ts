import type { RouteRecordRaw } from 'vue-router'

/**
 * 数据融合子系统路由 (FUSION)
 * 路径前缀: /fusion
 * 包含: 地图引擎、高精地图、个人门户、仿真引擎、融合服务、视频会议、视频能力、数据看板、外部接口、子系统集成
 */
const fusionRoutes: RouteRecordRaw = {
  path: '/fusion',
  component: () => import('@/views/fusion/FusionLayout.vue'),
  meta: { title: '数据融合', subsystem: 'FUSION' },
  children: [
    { path: 'map', name: 'FusionMap', component: () => import('@/views/fusion/map/FusionMap.vue'), meta: { title: '地图引擎封装服务' } },
    { path: 'hd-map', name: 'FusionHdMap', component: () => import('@/views/fusion/hd-map/HdMap.vue'), meta: { title: '高精地图引擎服务' } },
    { path: 'portal', name: 'FusionPortal', component: () => import('@/views/fusion/portal/Portal.vue'), meta: { title: '个人门户' } },
    { path: 'simulation', name: 'FusionSimulation', component: () => import('@/views/fusion/simulation/Simulation.vue'), meta: { title: '交通仿真引擎服务' } },
    { path: 'service', name: 'FusionService', component: () => import('@/views/fusion/service/FusionService.vue'), meta: { title: '融合服务' } },
    { path: 'video-conference', name: 'FusionVideoConference', component: () => import('@/views/fusion/video-conference/VideoConference.vue'), meta: { title: '视频会议应用' } },
    { path: 'video-capability', name: 'FusionVideoCapability', component: () => import('@/views/fusion/video-capability/VideoCapability.vue'), meta: { title: '视频能力应用' } },
    { path: 'dashboard', name: 'FusionDashboard', component: () => import('@/views/fusion/dashboard/Dashboard.vue'), meta: { title: '数据看板' } },
    { path: 'external', name: 'FusionExternal', component: () => import('@/views/fusion/external/External.vue'), meta: { title: '外部系统接口对接' } },
    { path: 'integration', name: 'FusionIntegration', component: () => import('@/views/fusion/integration/Integration.vue'), meta: { title: '子系统集成' } },
  ]
}

export default fusionRoutes
