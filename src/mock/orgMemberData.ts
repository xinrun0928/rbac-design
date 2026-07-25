import type { OrgMember } from '@/types/org/orgMember'

export const orgMemberList: OrgMember[] = [
  // orgId: 1 - 广东省交通运输厅（顶节点，12条数据）
  {
    memberId: 1,
    name: '张伟',
    phone: '13800138001',
    sex: 1,
    avatar: '',
    email: 'zhangwei@gdjt.com',
    status: 1101,
    remark: '系统管理员',
    createTime: '2024-01-15 10:30:00',
    orgId: 1,
    roles: [
      { roleId: 1, roleName: '超级管理员', roleType: 1 },
      { roleId: 2, roleName: '系统管理员', roleType: 1 }
    ]
  },
  {
    memberId: 2,
    name: '李娜',
    phone: '13800138002',
    sex: 2,
    avatar: '',
    email: 'lina@gdjt.com',
    status: 1101,
    remark: '',
    createTime: '2024-02-20 14:20:00',
    orgId: 1,
    roles: [
      { roleId: 3, roleName: '运维工程师', roleType: 2 }
    ]
  },
  {
    memberId: 3,
    name: '王强',
    phone: '13800138003',
    sex: 1,
    avatar: '',
    email: 'wangqiang@gdjt.com',
    status: 1101,
    remark: '负责值守系统维护',
    createTime: '2024-03-10 09:15:00',
    orgId: 1,
    roles: [
      { roleId: 4, roleName: '值守主管', roleType: 2 },
      { roleId: 5, roleName: '技术支持', roleType: 2 }
    ]
  },
  {
    memberId: 4,
    name: '赵敏',
    phone: '13800138004',
    sex: 2,
    avatar: '',
    email: 'zhaomin@gdjt.com',
    status: 1101,
    remark: '',
    createTime: '2024-04-05 16:45:00',
    orgId: 1,
    roles: [
      { roleId: 6, roleName: '数据分析师', roleType: 2 }
    ]
  },
  {
    memberId: 5,
    name: '刘洋',
    phone: '13800138005',
    sex: 1,
    avatar: '',
    email: 'liuyang@gdjt.com',
    status: 1102,
    remark: '已离职',
    createTime: '2024-01-20 08:00:00',
    orgId: 1,
    roles: [
      { roleId: 7, roleName: '普通用户', roleType: 2 }
    ]
  },
  {
    memberId: 6,
    name: '陈静',
    phone: '13800138006',
    sex: 2,
    avatar: '',
    email: 'chenjing@gdjt.com',
    status: 1101,
    remark: '',
    createTime: '2024-05-12 11:30:00',
    orgId: 1,
    roles: [
      { roleId: 4, roleName: '值守主管', roleType: 2 }
    ]
  },
  {
    memberId: 7,
    name: '孙磊',
    phone: '13800138007',
    sex: 1,
    avatar: '',
    email: 'sunlei@gdjt.com',
    status: 1101,
    remark: '负责事件处理',
    createTime: '2024-06-18 15:20:00',
    orgId: 1,
    roles: [
      { roleId: 8, roleName: '事件处理员', roleType: 2 },
      { roleId: 9, roleName: '调度员', roleType: 2 }
    ]
  },
  {
    memberId: 8,
    name: '周芳',
    phone: '13800138008',
    sex: 2,
    avatar: '',
    email: 'zhoufang@gdjt.com',
    status: 1101,
    remark: '',
    createTime: '2024-07-22 09:45:00',
    orgId: 1,
    roles: [
      { roleId: 10, roleName: '预案管理员', roleType: 2 }
    ]
  },
  {
    memberId: 9,
    name: '吴刚',
    phone: '13800138009',
    sex: 1,
    avatar: '',
    email: 'wugang@gdjt.com',
    status: 1101,
    remark: '物资管理员',
    createTime: '2024-08-30 14:00:00',
    orgId: 1,
    roles: [
      { roleId: 11, roleName: '物资管理员', roleType: 2 }
    ]
  },
  {
    memberId: 10,
    name: '郑丽',
    phone: '13800138010',
    sex: 2,
    avatar: '',
    email: 'zhengli@gdjt.com',
    status: 1101,
    remark: '',
    createTime: '2024-09-15 10:10:00',
    orgId: 1,
    roles: [
      { roleId: 12, roleName: '决策顾问', roleType: 2 }
    ]
  },
  {
    memberId: 11,
    name: '黄涛',
    phone: '13800138011',
    sex: 1,
    avatar: '',
    email: 'huangtao@gdjt.com',
    status: 1101,
    remark: '调度中心负责人',
    createTime: '2024-10-08 08:30:00',
    orgId: 1,
    roles: [
      { roleId: 9, roleName: '调度员', roleType: 2 },
      { roleId: 13, roleName: '调度主管', roleType: 2 }
    ]
  },
  {
    memberId: 12,
    name: '许婷',
    phone: '13800138012',
    sex: 2,
    avatar: '',
    email: 'xuting@gdjt.com',
    status: 1101,
    remark: '',
    createTime: '2024-11-20 16:25:00',
    orgId: 1,
    roles: [
      { roleId: 14, roleName: '融合协调员', roleType: 2 }
    ]
  },
  // orgId: 2 - 广州市交通运输局（3条数据）
  {
    memberId: 13,
    name: '林萍',
    phone: '13800138013',
    sex: 2,
    avatar: '',
    email: 'linping@gzjt.com',
    status: 1101,
    remark: '',
    createTime: '2024-03-25 11:20:00',
    orgId: 2,
    roles: [
      { roleId: 4, roleName: '值守主管', roleType: 2 }
    ]
  },
  {
    memberId: 14,
    name: '高峰',
    phone: '13800138014',
    sex: 1,
    avatar: '',
    email: 'gaofeng@gzjt.com',
    status: 1101,
    remark: '',
    createTime: '2024-04-18 09:55:00',
    orgId: 2,
    roles: [
      { roleId: 8, roleName: '事件处理员', roleType: 2 }
    ]
  },
  {
    memberId: 15,
    name: '马超',
    phone: '13800138015',
    sex: 1,
    avatar: '',
    email: 'machao@gzjt.com',
    status: 1101,
    remark: '',
    createTime: '2024-05-30 14:15:00',
    orgId: 2,
    roles: [
      { roleId: 9, roleName: '调度员', roleType: 2 }
    ]
  },
  // orgId: 3 - 深圳市交通运输局（2条数据）
  {
    memberId: 16,
    name: '刘芳',
    phone: '13800138016',
    sex: 2,
    avatar: '',
    email: 'liufang@szjt.com',
    status: 1101,
    remark: '',
    createTime: '2024-06-10 10:30:00',
    orgId: 3,
    roles: [
      { roleId: 11, roleName: '物资管理员', roleType: 2 }
    ]
  },
  {
    memberId: 17,
    name: '陈明',
    phone: '13800138017',
    sex: 1,
    avatar: '',
    email: 'chenming@szjt.com',
    status: 1101,
    remark: '',
    createTime: '2024-07-22 15:45:00',
    orgId: 3,
    roles: [
      { roleId: 12, roleName: '决策顾问', roleType: 2 }
    ]
  },
  // orgId: 4 - 东莞市交通运输局（3条数据）
  {
    memberId: 18,
    name: '王芳',
    phone: '13800138018',
    sex: 2,
    avatar: '',
    email: 'wangfang@dgjt.com',
    status: 1101,
    remark: '',
    createTime: '2024-08-05 09:20:00',
    orgId: 4,
    roles: [
      { roleId: 9, roleName: '调度员', roleType: 2 },
      { roleId: 13, roleName: '调度主管', roleType: 2 }
    ]
  },
  {
    memberId: 19,
    name: '李强',
    phone: '13800138019',
    sex: 1,
    avatar: '',
    email: 'liqiang@dgjt.com',
    status: 1101,
    remark: '',
    createTime: '2024-09-18 11:10:00',
    orgId: 4,
    roles: [
      { roleId: 14, roleName: '融合协调员', roleType: 2 }
    ]
  },
  {
    memberId: 20,
    name: '赵伟',
    phone: '13800138020',
    sex: 1,
    avatar: '',
    email: 'zhaowei@dgjt.com',
    status: 1101,
    remark: '',
    createTime: '2024-10-25 16:30:00',
    orgId: 4,
    roles: [
      { roleId: 7, roleName: '普通用户', roleType: 2 }
    ]
  },
  // orgId: 5 - 佛山市交通运输局（2条数据）
  {
    memberId: 21,
    name: '周静',
    phone: '13800138021',
    sex: 2,
    avatar: '',
    email: 'zhoujing@fsjt.com',
    status: 1101,
    remark: '',
    createTime: '2024-11-08 10:45:00',
    orgId: 5,
    roles: [
      { roleId: 15, roleName: '展示管理员', roleType: 2 }
    ]
  },
  {
    memberId: 22,
    name: '吴明',
    phone: '13800138022',
    sex: 1,
    avatar: '',
    email: 'wuming@fsjt.com',
    status: 1101,
    remark: '',
    createTime: '2024-12-20 14:00:00',
    orgId: 5,
    roles: [
      { roleId: 7, roleName: '普通用户', roleType: 2 }
    ]
  },
  // orgId: 6 - 珠海市交通运输局（2条数据）
  {
    memberId: 23,
    name: '孙丽',
    phone: '13800138023',
    sex: 2,
    avatar: '',
    email: 'sunli@zhjt.com',
    status: 1101,
    remark: '',
    createTime: '2025-01-15 09:30:00',
    orgId: 6,
    roles: [
      { roleId: 16, roleName: '测试工程师', roleType: 2 }
    ]
  },
  {
    memberId: 24,
    name: '钱伟',
    phone: '13800138024',
    sex: 1,
    avatar: '',
    email: 'qianwei@zhjt.com',
    status: 1101,
    remark: '',
    createTime: '2025-02-28 15:20:00',
    orgId: 6,
    roles: [
      { roleId: 7, roleName: '普通用户', roleType: 2 }
    ]
  }
]

// 按组织ID获取成员列表
export function getMembersByOrgId(orgId: number): OrgMember[] {
  return orgMemberList.filter(m => m.orgId === orgId && m.status === 1101)
}

// 搜索成员
export function searchMembers(
  orgId: number,
  search: { name?: string; phone?: string; status?: number | '' }
): OrgMember[] {
  return orgMemberList.filter(m => {
    if (m.orgId !== orgId) return false
    if (search.name && !m.name.includes(search.name)) return false
    if (search.phone && !m.phone.includes(search.phone)) return false
    if (search.status !== '' && search.status !== undefined && m.status !== search.status) return false
    return true
  })
}
