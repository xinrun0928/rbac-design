/** 事件管理 - 字典类型 */
export interface EventDictType {
  /** 字典类型编码 */
  dictType: string
  /** 字典类型名称 */
  dictTypeName: string
  /** 关联字典数据数量 */
  count: number
  /** 备注 */
  remark: string
  /** 状态: 1101-正常, 1102-停用 */
  status: number
  /** 创建时间 */
  createTime: string
}

/** 事件管理 - 字典数据 */
export interface EventDictData {
  /** 字典ID */
  dictId: number
  /** 字典类型编码 */
  dictType: string
  /** 字典标签 */
  dictLabel: string
  /** 字典值 */
  dictValue: string
  /** 字典编码 */
  dictCode: string
  /** 显示排序 */
  displayOrder: number
  /** 是否默认: 0-否, 1-是 */
  isDefault: number
  /** 状态: 1101-正常, 1102-停用 */
  status: number
  /** 备注 */
  remark: string
  /** 创建时间 */
  createTime: string
}
