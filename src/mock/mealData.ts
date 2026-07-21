import type { Meal } from '../types/meal'

export const mockMealData: Meal[] = [
  // ── 顶节点（类型1）──
  {
    id: 1,
    code: 'PKG_PROV_TRANSPORT',
    name: '省交通本级',
    type: 1,
    typeName: '顶节点',
    sort: 1,
    status: 1101,
    statusName: '正常',
    creator: '系统管理员',
    createTime: '2026-01-15 10:30:00'
  },
  {
    id: 2,
    code: 'PKG_PROV_TRANSPORT_2',
    name: '省交通本级',
    type: 1,
    typeName: '顶节点',
    sort: 2,
    status: 1101,
    statusName: '正常',
    creator: '张三',
    createTime: '2026-02-20 14:20:00'
  },
  {
    id: 3,
    code: 'PKG_PROV_TRANSPORT_3',
    name: '省交通本级',
    type: 1,
    typeName: '顶节点',
    sort: 3,
    status: 1001,
    statusName: '停用',
    creator: '李四',
    createTime: '2026-03-10 09:15:00'
  },

  // ── 交通节点（类型2）──
  {
    id: 4,
    code: 'PKG_TRANSPORT',
    name: '交通',
    type: 2,
    typeName: '交通节点',
    sort: 4,
    status: 1101,
    statusName: '正常',
    creator: '系统管理员',
    createTime: '2026-01-15 10:35:00'
  },
  {
    id: 5,
    code: 'PKG_CITY_TRANSPORT',
    name: '市交通',
    type: 2,
    typeName: '交通节点',
    sort: 5,
    status: 1101,
    statusName: '正常',
    creator: '王五',
    createTime: '2026-02-01 11:00:00'
  },
  {
    id: 6,
    code: 'PKG_COUNTY_TRANSPORT',
    name: '县交通',
    type: 2,
    typeName: '交通节点',
    sort: 6,
    status: 1101,
    statusName: '正常',
    creator: '赵六',
    createTime: '2026-02-15 16:45:00'
  },
  {
    id: 7,
    code: 'PKG_TRANSPORT_2',
    name: '交通',
    type: 2,
    typeName: '交通节点',
    sort: 7,
    status: 1001,
    statusName: '停用',
    creator: '钱七',
    createTime: '2026-03-01 08:30:00'
  },
  {
    id: 8,
    code: 'PKG_CITY_TRANSPORT_2',
    name: '市交通',
    type: 2,
    typeName: '交通节点',
    sort: 8,
    status: 1101,
    statusName: '正常',
    creator: '孙八',
    createTime: '2026-03-20 13:10:00'
  },

  // ── 事务中心节点（类型3）──
  {
    id: 9,
    code: 'PKG_PROV_AFFAIRS',
    name: '省事务中心',
    type: 3,
    typeName: '事务中心节点',
    sort: 9,
    status: 1101,
    statusName: '正常',
    creator: '系统管理员',
    createTime: '2026-01-20 10:00:00'
  },
  {
    id: 10,
    code: 'PKG_AFFAIRS',
    name: '事务中心',
    type: 3,
    typeName: '事务中心节点',
    sort: 10,
    status: 1101,
    statusName: '正常',
    creator: '周九',
    createTime: '2026-02-10 15:30:00'
  },
  {
    id: 11,
    code: 'PKG_CITY_AFFAIRS',
    name: '市事务中心',
    type: 3,
    typeName: '事务中心节点',
    sort: 11,
    status: 1101,
    statusName: '正常',
    creator: '吴十',
    createTime: '2026-02-25 09:20:00'
  },
  {
    id: 12,
    code: 'PKG_COUNTY_AFFAIRS',
    name: '县事务中心',
    type: 3,
    typeName: '事务中心节点',
    sort: 12,
    status: 1001,
    statusName: '停用',
    creator: '郑十一',
    createTime: '2026-03-05 14:50:00'
  },
  {
    id: 13,
    code: 'PKG_AFFAIRS_2',
    name: '事务中心',
    type: 3,
    typeName: '事务中心节点',
    sort: 13,
    status: 1101,
    statusName: '正常',
    creator: '王十二',
    createTime: '2026-03-15 11:40:00'
  },
  {
    id: 14,
    code: 'PKG_PROV_AFFAIRS_2',
    name: '省事务中心',
    type: 3,
    typeName: '事务中心节点',
    sort: 14,
    status: 1101,
    statusName: '正常',
    creator: '冯十三',
    createTime: '2026-04-01 08:00:00'
  },

  // ── 公司企业节点（类型4）──
  {
    id: 15,
    code: 'PKG_PROV_COMPANY',
    name: '省交通公司',
    type: 4,
    typeName: '公司企业节点',
    sort: 15,
    status: 1101,
    statusName: '正常',
    creator: '系统管理员',
    createTime: '2026-01-25 10:15:00'
  },
  {
    id: 16,
    code: 'PKG_COMPANY',
    name: '公司',
    type: 4,
    typeName: '公司企业节点',
    sort: 16,
    status: 1101,
    statusName: '正常',
    creator: '陈十四',
    createTime: '2026-02-05 16:30:00'
  },
  {
    id: 17,
    code: 'PKG_MONITOR_CENTER',
    name: '监控中心',
    type: 4,
    typeName: '公司企业节点',
    sort: 17,
    status: 1101,
    statusName: '正常',
    creator: '褚十五',
    createTime: '2026-02-18 09:45:00'
  },
  {
    id: 18,
    code: 'PKG_HIGHWAY',
    name: '高速公路',
    type: 4,
    typeName: '公司企业节点',
    sort: 18,
    status: 1001,
    statusName: '停用',
    creator: '卫十六',
    createTime: '2026-03-08 13:20:00'
  },
  {
    id: 19,
    code: 'PKG_NORMAL_ROAD',
    name: '普通公路',
    type: 4,
    typeName: '公司企业节点',
    sort: 19,
    status: 1101,
    statusName: '正常',
    creator: '蒋十七',
    createTime: '2026-03-25 10:55:00'
  },
  {
    id: 20,
    code: 'PKG_COMPANY_2',
    name: '公司',
    type: 4,
    typeName: '公司企业节点',
    sort: 20,
    status: 1101,
    statusName: '正常',
    creator: '沈十八',
    createTime: '2026-04-05 15:40:00'
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
