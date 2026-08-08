/** 业务场景数据类型 */
export interface BusinessScene {
  /** 场景ID */
  sceneId: number
  /** 场景名称 */
  sceneName: string
  /** 场景编码 */
  sceneCode: string
  /** 场景类型 */
  sceneType: string
  /** 适用业务 */
  applicableBusiness: string
  /** 适用范围 */
  applicableScope: string
  /** 关联流程ID */
  workflowId?: number | null
  /** 关联流程名称 */
  workflowName?: string
  /** 关联表单ID */
  formId?: number | null
  /** 关联表单名称 */
  formName?: string
  /** 是否启用: true-启用, false-停用 */
  enabled: boolean
  /** 场景描述 */
  sceneDescription?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/** 业务场景表单类型 */
export interface BusinessSceneForm {
  /** 场景ID（编辑时必填） */
  sceneId?: number
  /** 场景名称 */
  sceneName: string
  /** 场景编码 */
  sceneCode: string
  /** 场景类型 */
  sceneType: string
  /** 适用业务 */
  applicableBusiness: string
  /** 适用范围 */
  applicableScope: string
  /** 关联流程ID */
  workflowId?: number | null
  /** 关联表单ID */
  formId?: number | null
  /** 是否启用 */
  enabled: boolean
  /** 场景描述 */
  sceneDescription: string
}

/** 业务场景搜索表单类型 */
export interface BusinessSceneSearchForm {
  /** 场景名称 */
  sceneName: string
  /** 场景类型 */
  sceneType: string
}

/** 场景类型选项 */
export const SCENE_TYPE_OPTIONS = [
  { value: '应急响应', label: '应急响应' },
  { value: '事故处置', label: '事故处置' },
  { value: '灾害应对', label: '灾害应对' },
  { value: '监测预警', label: '监测预警' },
  { value: '交通抢险', label: '交通抢险' },
  { value: '专项保障', label: '专项保障' }
]

/** 适用业务选项 */
export const BUSINESS_OPTIONS = [
  { value: '灾害处置', label: '灾害处置' },
  { value: '地质灾害', label: '地质灾害' },
  { value: '设施监测', label: '设施监测' },
  { value: '交通事故', label: '交通事故' },
  { value: '水灾处置', label: '水灾处置' },
  { value: '气象灾害', label: '气象灾害' },
  { value: '火灾处置', label: '火灾处置' },
  { value: '交通事件', label: '交通事件' },
  { value: '通信保障', label: '通信保障' }
]
