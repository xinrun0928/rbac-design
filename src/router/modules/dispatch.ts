import type { RouteRecordRaw } from 'vue-router'

/**
 * 应急指挥智能调度子系统路由 (EMERGENCY_DISPATCH)
 * 路径前缀: /dispatch
 * 包含: 重点保障、车辆轨迹、专题管理、路段统计、会议管理、设备管理等
 */
const dispatchRoutes: RouteRecordRaw = {
  path: '/dispatch',
  component: () => import('@/views/dispatch/DispatchLayout.vue'),
  meta: { title: '应急指挥调度', subsystem: 'EMERGENCY_DISPATCH' },
  children: [
    // 重点保障工作
    {
      path: 'guarantee',
      name: 'DispatchGuarantee',
      component: () => import('@/views/dispatch/guarantee/Guarantee.vue'),
      meta: { title: '重点保障工作' }
    },
    // 重点车辆行驶轨迹
    {
      path: 'vehicle/track',
      name: 'DispatchVehicleTrack',
      component: () => import('@/views/dispatch/vehicle/VehicleTrack.vue'),
      meta: { title: '重点车辆行驶轨迹' }
    },
    // 专题管理
    {
      path: 'topic/channel',
      name: 'DispatchTopicChannel',
      component: () => import('@/views/dispatch/topic/Channel.vue'),
      meta: { title: '航道专题视图' }
    },
    {
      path: 'topic/strait',
      name: 'DispatchTopicStrait',
      component: () => import('@/views/dispatch/topic/Strait.vue'),
      meta: { title: '海峡办专题视图' }
    },
    {
      path: 'topic/config',
      name: 'DispatchTopicConfig',
      component: () => import('@/views/dispatch/topic/Config.vue'),
      meta: { title: '专题配置' }
    },
    // 重点路段统计
    {
      path: 'road/statistics',
      name: 'DispatchRoadStatistics',
      component: () => import('@/views/dispatch/road/Statistics.vue'),
      meta: { title: '重点路段统计' }
    },
    // 会议管理
    {
      path: 'meeting',
      name: 'DispatchMeetingList',
      component: () => import('@/views/dispatch/meeting/MeetingList.vue'),
      meta: { title: '会议列表' }
    },
    // 网络设备管理
    {
      path: 'network/monitor',
      name: 'DispatchNetworkMonitor',
      component: () => import('@/views/dispatch/network/Monitor.vue'),
      meta: { title: '监控设备管理' }
    },
    {
      path: 'network/video',
      name: 'DispatchNetworkVideo',
      component: () => import('@/views/dispatch/network/Video.vue'),
      meta: { title: '监控视频' }
    },
    {
      path: 'network/meeting-device',
      name: 'DispatchNetworkMeetingDevice',
      component: () => import('@/views/dispatch/network/MeetingDevice.vue'),
      meta: { title: '会议设备管理' }
    },
    {
      path: 'network/meeting-video',
      name: 'DispatchNetworkMeetingVideo',
      component: () => import('@/views/dispatch/network/MeetingVideo.vue'),
      meta: { title: '会议视频' }
    },
    {
      path: 'network/voice-device',
      name: 'DispatchNetworkVoiceDevice',
      component: () => import('@/views/dispatch/network/VoiceDevice.vue'),
      meta: { title: '语音设备管理' }
    },
    {
      path: 'network/voice',
      name: 'DispatchNetworkVoice',
      component: () => import('@/views/dispatch/network/Voice.vue'),
      meta: { title: '语音' }
    },
    // 终端设备管理
    {
      path: 'terminal/control-ball',
      name: 'DispatchTerminalControlBall',
      component: () => import('@/views/dispatch/terminal/ControlBall.vue'),
      meta: { title: '应急布控球' }
    },
    {
      path: 'terminal/command-vehicle',
      name: 'DispatchTerminalCommandVehicle',
      component: () => import('@/views/dispatch/terminal/CommandVehicle.vue'),
      meta: { title: '应急指挥车' }
    },
    {
      path: 'terminal/personal',
      name: 'DispatchTerminalPersonal',
      component: () => import('@/views/dispatch/terminal/Personal.vue'),
      meta: { title: '应急单兵设备' }
    },
    {
      path: 'terminal/statistics',
      name: 'DispatchTerminalStatistics',
      component: () => import('@/views/dispatch/terminal/Statistics.vue'),
      meta: { title: '终端调度统计' }
    },
    // 大客流大货流
    {
      path: 'flow/road',
      name: 'DispatchFlowRoad',
      component: () => import('@/views/dispatch/flow/Road.vue'),
      meta: { title: '路段' }
    },
    {
      path: 'flow/service-area',
      name: 'DispatchFlowServiceArea',
      component: () => import('@/views/dispatch/flow/ServiceArea.vue'),
      meta: { title: '服务区' }
    },
    {
      path: 'flow/toll-station',
      name: 'DispatchFlowTollStation',
      component: () => import('@/views/dispatch/flow/TollStation.vue'),
      meta: { title: '收费站' }
    },
    // 数据接口
    {
      path: 'data/road-config',
      name: 'DispatchDataRoadConfig',
      component: () => import('@/views/dispatch/data/RoadConfig.vue'),
      meta: { title: '重点路段配置' }
    },
    {
      path: 'data/road-info',
      name: 'DispatchDataRoadInfo',
      component: () => import('@/views/dispatch/data/RoadInfo.vue'),
      meta: { title: '路段信息' }
    },
    {
      path: 'data/toll-info',
      name: 'DispatchDataTollInfo',
      component: () => import('@/views/dispatch/data/TollInfo.vue'),
      meta: { title: '收费站信息' }
    },
    {
      path: 'data/service-info',
      name: 'DispatchDataServiceInfo',
      component: () => import('@/views/dispatch/data/ServiceInfo.vue'),
      meta: { title: '服务区信息' }
    },
    {
      path: 'data/bridge-info',
      name: 'DispatchDataBridgeInfo',
      component: () => import('@/views/dispatch/data/BridgeInfo.vue'),
      meta: { title: '桥梁信息' }
    },
    {
      path: 'data/tunnel-info',
      name: 'DispatchDataTunnelInfo',
      component: () => import('@/views/dispatch/data/TunnelInfo.vue'),
      meta: { title: '隧道信息' }
    },
    // 气象数据接入
    {
      path: 'weather/typhoon',
      name: 'DispatchWeatherTyphoon',
      component: () => import('@/views/dispatch/weather/Typhoon.vue'),
      meta: { title: '台风' }
    },
    {
      path: 'weather/rainfall',
      name: 'DispatchWeatherRainfall',
      component: () => import('@/views/dispatch/weather/Rainfall.vue'),
      meta: { title: '降雨量' }
    },
    {
      path: 'weather/weather',
      name: 'DispatchWeatherWeather',
      component: () => import('@/views/dispatch/weather/Weather.vue'),
      meta: { title: '天气' }
    },
    {
      path: 'weather/wind',
      name: 'DispatchWeatherWind',
      component: () => import('@/views/dispatch/weather/Wind.vue'),
      meta: { title: '风力' }
    },
    {
      path: 'weather/interface',
      name: 'DispatchWeatherInterface',
      component: () => import('@/views/dispatch/weather/Interface.vue'),
      meta: { title: '数据接口设置' }
    },
    // 基础能力
    {
      path: 'basic/workflow',
      name: 'DispatchBasicWorkflow',
      component: () => import('@/views/dispatch/basic/Workflow.vue'),
      meta: { title: '工作流程管理' }
    },
    {
      path: 'basic/form',
      name: 'DispatchBasicForm',
      component: () => import('@/views/dispatch/basic/Form.vue'),
      meta: { title: '填报表单管理' }
    },
    {
      path: 'basic/scene',
      name: 'DispatchBasicScene',
      component: () => import('@/views/dispatch/basic/Scene.vue'),
      meta: { title: '业务场景管理' }
    },
    // 机构管理
    {
      path: 'org/admin',
      name: 'DispatchOrgAdmin',
      component: () => import('@/views/dispatch/org/Admin.vue'),
      meta: { title: '机构管理（超管）' }
    },
    {
      path: 'org/unit',
      name: 'DispatchOrgUnit',
      component: () => import('@/views/dispatch/org/Unit.vue'),
      meta: { title: '机构管理（单位）' }
    },
    // 默认重定向
    {
      path: '',
      redirect: '/dispatch/guarantee'
    }
  ]
}

// 独立全屏页面路由（不使用DispatchLayout）
export const dispatchStandaloneRoutes: RouteRecordRaw[] = [
  {
    path: '/dispatch/basic/form-designer',
    name: 'DispatchBasicFormDesigner',
    component: () => import('@/views/dispatch/basic/FormDesigner.vue'),
    meta: { title: '表单设计器', hideLayout: true }
  },
  {
    path: '/dispatch/road/screen/overview',
    name: 'DispatchScreenOverview',
    component: () => import('@/views/dispatch/road/screen/Overview.vue'),
    meta: { title: '总览', hideLayout: true }
  },
  {
    path: '/dispatch/road/screen/congestion',
    name: 'DispatchScreenCongestion',
    component: () => import('@/views/dispatch/road/screen/CongestionAnalysis.vue'),
    meta: { title: '重点路段拥堵分析', hideLayout: true }
  },
  {
    path: '/dispatch/road/screen/traffic',
    name: 'DispatchScreenTraffic',
    component: () => import('@/views/dispatch/road/screen/TrafficFlow.vue'),
    meta: { title: '重点路段车流量分析', hideLayout: true }
  },
  {
    path: '/dispatch/road/screen/frequency',
    name: 'DispatchScreenFrequency',
    component: () => import('@/views/dispatch/road/screen/CongestionFrequency.vue'),
    meta: { title: '重点路段拥堵发生次数统计', hideLayout: true }
  },
  {
    path: '/dispatch/road/screen/duration',
    name: 'DispatchScreenDuration',
    component: () => import('@/views/dispatch/road/screen/CongestionDuration.vue'),
    meta: { title: '重点路段拥堵时长分析', hideLayout: true }
  },
  {
    path: '/dispatch/road/screen/traffic-analysis',
    name: 'DispatchScreenTrafficAnalysis',
    component: () => import('@/views/dispatch/road/screen/TrafficFlowAnalysis.vue'),
    meta: { title: '重点路段车流量分析', hideLayout: true }
  }
]

export default dispatchRoutes
