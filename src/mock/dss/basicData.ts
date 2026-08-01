import type { BasicUser, RoleItem } from '@/types/dss'

/** 角色列表Mock数据 */
export const mockRoles: RoleItem[] = [
  { name: '超级管理员', selected: true },
  { name: '知识管理员', selected: false },
  { name: '反馈处理员', selected: false },
  { name: '普通浏览员', selected: false }
]

/** 用户管理Mock数据 */
export const mockBasicUsers: BasicUser[] = [
  {
    name: '张三',
    department: 'XXX部门',
    gender: '男',
    phone: '13728394873',
    accountStatus: '启用',
    addTime: '2024-09-11',
    operator: '李四（13583746639）'
  }
]
