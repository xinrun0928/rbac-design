/** 子系统数据类型 */
export interface Subsystem {
  /** 子系统ID */
  subsysId: number
  /** 子系统编码 */
  subsysCode: string
  /** 子系统名称 */
  subsysName: string
  /** 子系统简称 */
  subsysShortName: string
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
  /** 创建人 */
  creater: string
  /** 创建时间 */
  createTime: string
  /** 更新人 */
  updater: string
  /** 更新时间 */
  updateTime: string
  /** 删除标记: 0-未删除, 1-已删除 */
  deleted: number
  /** 签名 */
  signature: string
  /** 签名版本 */
  signatureVersion: number
  /** 图标名称（前端扩展） */
  icon?: string
  /** 渐变背景色（前端扩展） */
  color?: string
}

/** 子系统表单类型 */
export interface SubsystemForm {
  /** 子系统ID（编辑时必填） */
  subsysId?: number
  /** 子系统编码 */
  subsysCode: string
  /** 子系统名称 */
  subsysName: string
  /** 子系统简称 */
  subsysShortName: string
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
  subsysCode: string
  /** 子系统名称 */
  subsysName: string
  /** 状态筛选 */
  status: string | number
}
