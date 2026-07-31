/** 规格型号 */
export interface CategorySpec {
  /** 规格 */
  spec: string
  /** 型号 */
  model: string
}

/** 物资装备种类 */
export interface MaterialCategory {
  /** 分类ID */
  categoryId: string
  /** 上级分类ID（空字符串为顶级分类） */
  parentId: string
  /** 分类名称 */
  categoryName: string
  /** 单位 */
  unit: string
  /** 相关图片 */
  image: string
  /** 预警数量（未设置时为 undefined，列表显示 -） */
  warningQuantity?: number
  /** 预警比较符: < > = ≤ ≥（未设置时为空字符串） */
  warningOperator?: string
  /** 启用状态: 1-启用 0-停用 */
  status: number
  /** 最后修改时间 */
  updateTime: string
  /** 最后操作人 */
  updateBy: string
  /** 规格型号 */
  specs: CategorySpec[]
  /** 子分类 */
  children?: MaterialCategory[]
}

/** 物资装备种类搜索表单 */
export interface CategorySearchForm {
  /** 分类名称 */
  categoryName: string
  /** 启用状态: 1-启用 0-停用 空-全部 */
  status: number | ''
}

/** 物资装备种类新增/编辑表单 */
export interface CategoryForm {
  /** 上级分类ID（空字符串为顶级分类） */
  parentId: string
  /** 分类名称 */
  categoryName: string
  /** 单位 */
  unit: string
  /** 预警数量 */
  warningQuantity: number
  /** 预警比较符 */
  warningOperator: string
  /** 启用状态: 1-启用 0-停用 */
  status: number
  /** 相关图片 */
  image: string
  /** 规格型号 */
  specs: CategorySpec[]
}
