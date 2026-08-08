/** 填报表单模板数据类型 */
export interface FormTemplate {
  /** 表单ID */
  formId: number
  /** 表单名称 */
  formName: string
  /** 业务场景 */
  businessScene: string
  /** 版本号 */
  version: string
  /** 版本说明 */
  versionDesc?: string
  /** 表单类型 */
  formType: string
  /** 适配终端 */
  terminal: string
  /** 发布状态: published-已发布, unpublished-未发布 */
  publishStatus: string
  /** 使用状态: enabled-启用, disabled-停用 */
  useStatus: boolean
  /** 是否最新版本 */
  isLatest: boolean
  /** 是否允许编辑 */
  allowEdit: boolean
  /** 是否允许删除 */
  allowDelete: boolean
  /** 表单描述 */
  description?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/** 填报表单模板表单类型 */
export interface FormTemplateForm {
  /** 表单ID（编辑时必填） */
  formId?: number
  /** 表单名称 */
  formName: string
  /** 业务场景 */
  businessScene: string
  /** 版本号 */
  version: string
  /** 版本说明 */
  versionDesc: string
  /** 表单类型 */
  formType: string
  /** 适配终端 */
  terminal: string
  /** 发布状态 */
  publishStatus: string
  /** 使用状态 */
  useStatus: boolean
  /** 是否最新版本 */
  isLatest: boolean
  /** 是否允许编辑 */
  allowEdit: boolean
  /** 是否允许删除 */
  allowDelete: boolean
  /** 表单描述 */
  description: string
}

/** 填报表单模板搜索表单类型 */
export interface FormTemplateSearchForm {
  /** 表单名称 */
  formName: string
  /** 表单类型 */
  formType: string
}

/** 表单类型选项 */
export const FORM_TYPE_OPTIONS = [
  { value: '填报表单', label: '填报表单' },
  { value: '报告表单', label: '报告表单' },
  { value: '记录表单', label: '记录表单' },
  { value: '检查表单', label: '检查表单' },
  { value: '分析表单', label: '分析表单' },
  { value: '巡检表单', label: '巡检表单' }
]

/** 适配终端选项 */
export const TERMINAL_OPTIONS = [
  { value: 'PC端', label: 'PC端' },
  { value: '移动端', label: '移动端' },
  { value: 'PC/移动端', label: 'PC/移动端' }
]

/** 业务场景选项 */
export const BUSINESS_SCENE_OPTIONS = [
  { value: '隐患排查', label: '隐患排查' },
  { value: '事故管理', label: '事故管理' },
  { value: '应急演练', label: '应急演练' },
  { value: '设备管理', label: '设备管理' },
  { value: '风险管理', label: '风险管理' },
  { value: '视频监控', label: '视频监控' },
  { value: '收费站管理', label: '收费站管理' },
  { value: '服务区管理', label: '服务区管理' },
  { value: '桥梁管理', label: '桥梁管理' },
  { value: '隧道管理', label: '隧道管理' }
]
