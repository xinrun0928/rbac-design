/** 系统配置数据类型 */
export interface Config {
  /** 配置ID */
  configId: number
  /** 配置名称 */
  configLabel: string
  /** 配置键 */
  configKey: string
  /** 配置值 */
  configValue: string
  /** 配置类型: sys-系统内置, custom-用户自定义 */
  configType: string
  /** 配置分组 */
  configGroup: string
  /** 显示顺序 */
  displayOrder: number
  /** 状态 */
  status: number
  /** 创建人 */
  creater?: string
  /** 创建时间 */
  createTime: string
  /** 更新人 */
  updater?: string
  /** 备注 */
  remark?: string | null
}

/** 配置搜索表单类型 */
export interface ConfigSearchForm {
  /** 配置名称 */
  configLabel: string
}
