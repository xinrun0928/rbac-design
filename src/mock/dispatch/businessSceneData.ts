import type { BusinessScene } from '@/types/dispatch/businessScene'

export const businessSceneData: BusinessScene[] = [
  {
    sceneId: 1,
    sceneName: '台风应急响应场景',
    sceneCode: 'SCENE_TYPHOON_001',
    sceneType: '应急响应',
    applicableBusiness: '灾害处置',
    applicableScope: '广东省',
    enabled: true,
    sceneDescription: '台风灾害应急响应流程',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-06-20 14:30:00'
  },
  {
    sceneId: 2,
    sceneName: '暴雨内涝处置场景',
    sceneCode: 'SCENE_RAIN_001',
    sceneType: '应急响应',
    applicableBusiness: '灾害处置',
    applicableScope: '广州市',
    enabled: true,
    sceneDescription: '城市内涝应急处理',
    createTime: '2024-02-10 09:00:00',
    updateTime: '2024-07-15 16:00:00'
  },
  {
    sceneId: 3,
    sceneName: '山体滑坡处置场景',
    sceneCode: 'SCENE_LANDSLIDE_001',
    sceneType: '应急响应',
    applicableBusiness: '地质灾害',
    applicableScope: '清远市',
    enabled: true,
    sceneDescription: '山区滑坡应急处理',
    createTime: '2024-03-05 11:00:00',
    updateTime: '2024-08-01 09:30:00'
  },
  {
    sceneId: 4,
    sceneName: '桥梁异常监测场景',
    sceneCode: 'SCENE_BRIDGE_001',
    sceneType: '监测预警',
    applicableBusiness: '设施监测',
    applicableScope: '广州市',
    enabled: true,
    sceneDescription: '桥梁结构异常监测',
    createTime: '2024-04-20 08:30:00',
    updateTime: '2024-08-10 10:00:00'
  },
  {
    sceneId: 5,
    sceneName: '隧道事故处理场景',
    sceneCode: 'SCENE_TUNNEL_001',
    sceneType: '事故处置',
    applicableBusiness: '交通事故',
    applicableScope: '广东省',
    enabled: true,
    sceneDescription: '隧道事故应急处理',
    createTime: '2024-05-12 14:00:00',
    updateTime: '2024-09-01 11:00:00'
  },
  {
    sceneId: 6,
    sceneName: '洪水调度响应场景',
    sceneCode: 'SCENE_FLOOD_001',
    sceneType: '应急响应',
    applicableBusiness: '水灾处置',
    applicableScope: '珠江流域',
    enabled: true,
    sceneDescription: '洪水应急调度',
    createTime: '2024-06-01 10:00:00',
    updateTime: '2024-09-15 08:00:00'
  },
  {
    sceneId: 7,
    sceneName: '高温灾害应对场景',
    sceneCode: 'SCENE_HEAT_001',
    sceneType: '灾害应对',
    applicableBusiness: '气象灾害',
    applicableScope: '广东省',
    enabled: true,
    sceneDescription: '高温天气应对',
    createTime: '2024-06-20 15:00:00',
    updateTime: '2024-10-01 09:00:00'
  },
  {
    sceneId: 8,
    sceneName: '森林火灾处置场景',
    sceneCode: 'SCENE_FIRE_001',
    sceneType: '应急响应',
    applicableBusiness: '火灾处置',
    applicableScope: '广东北部山区',
    enabled: true,
    sceneDescription: '森林火灾应急',
    createTime: '2024-07-10 11:30:00',
    updateTime: '2024-10-20 14:00:00'
  },
  {
    sceneId: 9,
    sceneName: '道路塌方抢通场景',
    sceneCode: 'SCENE_COLLAPSE_001',
    sceneType: '交通抢险',
    applicableBusiness: '交通事件',
    applicableScope: '山区公路',
    enabled: true,
    sceneDescription: '道路塌方处理',
    createTime: '2024-08-05 09:00:00',
    updateTime: '2024-11-01 10:30:00'
  },
  {
    sceneId: 10,
    sceneName: '应急通信保障场景',
    sceneCode: 'SCENE_COMM_001',
    sceneType: '专项保障',
    applicableBusiness: '通信保障',
    applicableScope: '全省范围',
    enabled: true,
    sceneDescription: '保障通信畅通',
    createTime: '2024-08-20 14:00:00',
    updateTime: '2024-11-15 16:00:00'
  },
  {
    sceneId: 11,
    sceneName: '大雾天气管控场景',
    sceneCode: 'SCENE_FOG_001',
    sceneType: '监测预警',
    applicableBusiness: '气象灾害',
    applicableScope: '广东省',
    enabled: true,
    sceneDescription: '大雾天气交通管控',
    createTime: '2024-09-01 10:00:00',
    updateTime: '2024-12-01 09:00:00'
  },
  {
    sceneId: 12,
    sceneName: '危化品泄漏处置场景',
    sceneCode: 'SCENE_CHEMICAL_001',
    sceneType: '事故处置',
    applicableBusiness: '灾害处置',
    applicableScope: '全省范围',
    enabled: false,
    sceneDescription: '危化品泄漏应急处置',
    createTime: '2024-09-15 11:00:00',
    updateTime: '2024-12-10 15:00:00'
  },
  {
    sceneId: 13,
    sceneName: '春运保障场景',
    sceneCode: 'SCENE_SPRING_001',
    sceneType: '专项保障',
    applicableBusiness: '交通事件',
    applicableScope: '广东省',
    enabled: true,
    sceneDescription: '春运期间交通保障',
    createTime: '2024-10-01 09:00:00',
    updateTime: '2025-01-05 10:00:00'
  },
  {
    sceneId: 14,
    sceneName: '防汛防风场景',
    sceneCode: 'SCENE_FLOOD_WIND_001',
    sceneType: '应急响应',
    applicableBusiness: '灾害处置',
    applicableScope: '广东省',
    enabled: true,
    sceneDescription: '三防应急响应',
    createTime: '2024-10-20 14:30:00',
    updateTime: '2025-01-15 11:00:00'
  },
  {
    sceneId: 15,
    sceneName: '节假日保畅场景',
    sceneCode: 'SCENE_HOLIDAY_001',
    sceneType: '专项保障',
    applicableBusiness: '交通事件',
    applicableScope: '广东省',
    enabled: true,
    sceneDescription: '节假日高速公路保畅',
    createTime: '2024-11-01 10:00:00',
    updateTime: '2025-02-01 09:00:00'
  }
]

/** 模拟工作流选项 */
export const workflowOptions = [
  { workflowId: 1, workflowName: '台风应急响应流程' },
  { workflowId: 2, workflowName: '暴雨内涝处置流程' },
  { workflowId: 3, workflowName: '山体滑坡处置流程' },
  { workflowId: 4, workflowName: '隧道事故处理流程' },
  { workflowId: 5, workflowName: '洪水调度响应流程' },
  { workflowId: 6, workflowName: '森林火灾处置流程' }
]

/** 模拟表单选项 */
export const formOptions = [
  { formId: 1, formName: '应急事件上报表' },
  { formId: 2, formName: '现场情况记录表' },
  { formId: 3, formName: '资源调度申请表' },
  { formId: 4, formName: '事故处理报告表' },
  { formId: 5, formName: '应急处置总结表' }
]
