/** 字典数据类型 */
export interface DictData {
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
  /** 字典分类 */
  dictClass?: string | null
  /** 是否默认: 0-否, 1-是 */
  isDefault: number
  /** 状态: 1101-正常, 1001-停用 */
  status: number
  /** 备注 */
  remark?: string | null
  /** 创建时间 */
  createTime: string
}

/** 字典类型数据 */
export interface DictType {
  /** 字典类型编码 */
  dictType: string
  /** 字典类型名称 */
  dictTypeName: string
  /** 关联字典数据数量 */
  count: number
  /** 备注 */
  remark: string
  /** 状态: 1101-正常, 1001-停用 */
  status: number
  /** 创建时间 */
  createTime: string
}

/** 字典数据搜索表单类型 */
export interface DictDataSearchForm {
  /** 字典标签 */
  dictLabel: string
  /** 字典编码 */
  dictCode: string
  /** 状态筛选 */
  status: number | ''
}
