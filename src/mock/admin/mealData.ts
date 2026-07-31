import type { Meal } from '@/types/admin/meal'

export const mockMealData: Meal[] = [
  // ── 顶节点（类型1）──
  {
    mealId: 1,
    code: 'PKG_PROV_TRANSPORT',
    name: '省交通本级',
    mealType: 1,
    sort: 1,
    status: 1101,
    creater: '系统管理员',
    createTime: '2026-01-15 10:30:00',
    updateTime: '2026-01-15 10:30:00',
    remark: ''
  },

  // ── 交通节点（类型2）──
  {
    mealId: 2,
    code: 'PKG_TRANSPORT',
    name: '交通',
    mealType: 2,
    sort: 2,
    status: 1101,
    creater: '系统管理员',
    createTime: '2026-01-15 10:35:00',
    updateTime: '2026-01-15 10:35:00',
    remark: ''
  },
  {
    mealId: 3,
    code: 'PKG_CITY_TRANSPORT',
    name: '市交通',
    mealType: 2,
    sort: 3,
    status: 1101,
    creater: '王五',
    createTime: '2026-02-01 11:00:00',
    updateTime: '2026-02-01 11:00:00',
    remark: ''
  },
  {
    mealId: 4,
    code: 'PKG_COUNTY_TRANSPORT',
    name: '县交通',
    mealType: 2,
    sort: 4,
    status: 1101,
    creater: '赵六',
    createTime: '2026-02-15 16:45:00',
    updateTime: '2026-02-15 16:45:00',
    remark: ''
  },

  // ── 事务中心节点（类型3）──
  {
    mealId: 5,
    code: 'PKG_PROV_AFFAIRS',
    name: '省事务中心',
    mealType: 3,
    sort: 5,
    status: 1101,
    creater: '系统管理员',
    createTime: '2026-01-20 10:00:00',
    updateTime: '2026-01-20 10:00:00',
    remark: ''
  },
  {
    mealId: 6,
    code: 'PKG_AFFAIRS',
    name: '事务中心',
    mealType: 3,
    sort: 6,
    status: 1101,
    creater: '周九',
    createTime: '2026-02-10 15:30:00',
    updateTime: '2026-02-10 15:30:00',
    remark: ''
  },
  {
    mealId: 7,
    code: 'PKG_CITY_AFFAIRS',
    name: '市事务中心',
    mealType: 3,
    sort: 7,
    status: 1101,
    creater: '吴十',
    createTime: '2026-02-25 09:20:00',
    updateTime: '2026-02-25 09:20:00',
    remark: ''
  },
  {
    mealId: 8,
    code: 'PKG_COUNTY_AFFAIRS',
    name: '县事务中心',
    mealType: 3,
    sort: 8,
    status: 1001,
    creater: '郑十一',
    createTime: '2026-03-05 14:50:00',
    updateTime: '2026-03-05 14:50:00',
    remark: ''
  },

  // ── 公司企业节点（类型4）──
  {
    mealId: 9,
    code: 'PKG_PROV_COMPANY',
    name: '省交通公司',
    mealType: 4,
    sort: 9,
    status: 1101,
    creater: '系统管理员',
    createTime: '2026-01-25 10:15:00',
    updateTime: '2026-01-25 10:15:00',
    remark: ''
  },
  {
    mealId: 10,
    code: 'PKG_COMPANY',
    name: '公司',
    mealType: 4,
    sort: 10,
    status: 1101,
    creater: '陈十四',
    createTime: '2026-02-05 16:30:00',
    updateTime: '2026-02-05 16:30:00',
    remark: ''
  },
  {
    mealId: 11,
    code: 'PKG_MONITOR_CENTER',
    name: '监控中心',
    mealType: 4,
    sort: 11,
    status: 1101,
    creater: '褚十五',
    createTime: '2026-02-18 09:45:00',
    updateTime: '2026-02-18 09:45:00',
    remark: ''
  },
  {
    mealId: 12,
    code: 'PKG_HIGHWAY',
    name: '高速公路',
    mealType: 4,
    sort: 12,
    status: 1001,
    creater: '卫十六',
    createTime: '2026-03-08 13:20:00',
    updateTime: '2026-03-08 13:20:00',
    remark: ''
  },
  {
    mealId: 13,
    code: 'PKG_NORMAL_ROAD',
    name: '普通公路',
    mealType: 4,
    sort: 13,
    status: 1101,
    creater: '蒋十七',
    createTime: '2026-03-25 10:55:00',
    updateTime: '2026-03-25 10:55:00',
    remark: ''
  }
]

/** 套餐名称选项（按类型分组） */
export const mealNameOptions: Record<number, string[]> = {
  1: ['省交通本级'],
  2: ['交通', '市交通', '县交通'],
  3: ['省事务中心', '事务中心', '市事务中心', '县事务中心'],
  4: ['省交通公司', '公司', '监控中心', '高速公路', '普通公路']
}

/** 套餐类型选项 */
export const mealTypeOptions = [
  { value: 1, label: '顶节点', description: '省级交通主管部门' },
  { value: 2, label: '交通节点', description: '市县级交通部门' },
  { value: 3, label: '事务中心节点', description: '各级事务服务中心' },
  { value: 4, label: '公司企业节点', description: '交通相关企业单位' }
]
