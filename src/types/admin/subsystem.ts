/** 子系统数据类型 */
export interface Subsystem {
  /** 子系统ID */
  subsystemId: number
  /** 子系统编码 */
  subsystemCode: string
  /** 子系统名称 */
  subsystemName: string
  /** 子系统简称 */
  subsystemShortName: string
  /** 路径前缀 */
  pathPrefix: string
  /** 表前缀 */
  tablePrefix: string
  /** 显示排序 */
  displayOrder: number
  /** 是否隐藏 */
  isHidden: boolean
  /** 状态: 1101-正常, 1001-停用 */
  status: number
  /** 备注 */
  remark?: string
  /** 创建时间 */
  createTime: string
  /** 图标名称（前端扩展） */
  icon?: string
  /** 渐变背景色（前端扩展） */
  color?: string
}

/** 子系统表单类型 */
export interface SubsystemForm {
  /** 子系统ID（编辑时必填） */
  subsystemId?: number
  /** 子系统编码 */
  subsystemCode: string
  /** 子系统名称 */
  subsystemName: string
  /** 子系统简称 */
  subsystemShortName: string
  /** 路径前缀 */
  pathPrefix: string
  /** 表前缀 */
  tablePrefix: string
  /** 显示排序 */
  displayOrder: number
  /** 是否隐藏 */
  isHidden: boolean
  /** 状态: 1101-正常, 1001-停用 */
  status: number
  /** 备注 */
  remark: string
  /** 图标名称 */
  icon?: string
  /** 渐变背景色 */
  color?: string
}

/** 子系统搜索表单类型 */
export interface SubsystemSearchForm {
  /** 子系统编码 */
  subsystemCode: string
  /** 子系统名称 */
  subsystemName: string
  /** 状态筛选 */
  status: string | number
}
