/** 套餐数据类型 */
export interface Meal {
  /** 套餐ID */
  id: number
  /** 套餐编码 */
  code: string
  /** 套餐名称 */
  name: string
  /** 套餐类型: 1-顶节点, 2-交通节点, 3-事务中心节点, 4-公司企业节点 */
  type: number
  /** 类型名称 */
  typeName: string
  /** 显示排序 */
  sort: number
  /** 状态: 1101-正常, 1001-停用 */
  status: number
  /** 状态名称 */
  statusName: string
  /** 创建人 */
  creator: string
  /** 创建时间 */
  createTime: string
}

/** 套餐搜索表单类型 */
export interface SearchForm {
  /** 套餐名称 */
  name?: string
  /** 套餐类型 */
  type?: number | ''
  /** 状态筛选 */
  status?: number | ''
}

/** 套餐表单类型（新增/编辑） */
export interface MealForm {
  /** 套餐ID（编辑时必填） */
  id?: number
  /** 套餐编码 */
  code: string
  /** 套餐名称 */
  name: string
  /** 套餐类型 */
  type: number | ''
  /** 显示排序 */
  sort: number
  /** 状态: 1101-正常, 1001-停用 */
  status: number
}

/** 分页参数类型 */
export interface Pagination {
  /** 当前页码 */
  page: number
  /** 每页条数 */
  pageSize: number
  /** 总记录数 */
  total: number
}

/** 套餐类型映射 */
export const MEAL_TYPE_MAP: Record<number, { label: string; color: string }> = {
  1: { label: '顶节点', color: '#409EFF' },
  2: { label: '交通节点', color: '#67C23A' },
  3: { label: '事务中心节点', color: '#E6A23C' },
  4: { label: '公司企业节点', color: '#9B59B6' }
}

/** 状态映射 */
export const STATUS_MAP: Record<number, { label: string; color: string }> = {
  1101: { label: '正常', color: '#67C23A' },
  1001: { label: '停用', color: '#909399' }
}
