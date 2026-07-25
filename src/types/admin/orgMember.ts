/** 组织成员数据类型 */
export interface OrgMember {
  /** 成员ID */
  memberId: number
  /** 姓名 */
  name: string
  /** 手机号码 */
  phone: string
  /** 性别: 0-未知, 1-男, 2-女 */
  sex: number
  /** 头像URL */
  avatar: string
  /** 邮箱 */
  email: string
  /** 状态: 1101-正常, 1102-停用 */
  status: number
  /** 备注 */
  remark: string
  /** 创建时间 */
  createTime: string
  /** 所属组织ID */
  orgId: number
  /** 角色列表 */
  roles: OrgMemberRole[]
}

/** 组织成员角色信息 */
export interface OrgMemberRole {
  /** 角色ID */
  roleId: number
  /** 角色名称 */
  roleName: string
  /** 角色类型: 1-系统角色, 2-自定义角色 */
  roleType: number
}

/** 组织成员搜索表单类型 */
export interface OrgMemberSearchForm {
  /** 姓名 */
  name: string
  /** 手机号码 */
  phone: string
  /** 状态筛选 */
  status: number | ''
}
