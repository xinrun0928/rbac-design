/** 套餐数据接口 */
export interface Meal {
  id: number
  code: string
  name: string
  type: number
  typeName: string
  sort: number
  status: number
  statusName: string
  creator: string
  createTime: string
}

/** 搜索表单 */
export interface SearchForm {
  name?: string
  type?: number | ''
  status?: number | ''
}

/** 套餐表单（新增/编辑） */
export interface MealForm {
  id?: number
  code: string
  name: string
  type: number | ''
  sort: number
  status: number
}

/** 分页参数 */
export interface Pagination {
  page: number
  pageSize: number
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
