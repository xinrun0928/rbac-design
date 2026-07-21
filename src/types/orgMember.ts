export interface OrgMember {
  memberId: number
  name: string
  phone: string
  sex: number  // 0-未知 1-男 2-女
  avatar: string
  email: string
  status: number  // 1101正常 1102停用
  remark: string
  createTime: string
  orgId: number
  roles: OrgMemberRole[]
}

export interface OrgMemberRole {
  roleId: number
  roleName: string
  roleType: number  // 1-系统角色 2-自定义角色
}

export interface OrgMemberSearchForm {
  name: string
  phone: string
  status: number | ''
}
