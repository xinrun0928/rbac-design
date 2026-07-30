/** 区域数据类型 */
export interface Area {
  /** 区域ID */
  id: number
  /** 区域编码 */
  code: string
  /** 区域名称 */
  name: string
  /** 区域级别: province-省, city-市, district-区/县 */
  level: string
  /** 父级区域编码（顶级区域为null） */
  parentCode?: string | null
  /** 显示排序 */
  displayOrder: number
  /** 子区域列表 */
  children?: Area[]
}

/** 区域搜索表单类型 */
export interface AreaSearchForm {
  /** 区域名称 */
  name: string
  /** 区域编码 */
  code: string
  /** 区域级别 */
  level: string
}
