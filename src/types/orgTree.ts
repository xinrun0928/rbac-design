/** 组织树节点（组织架构展示用） */
export interface OrgTreeNode {
  id: number
  name: string
  /** 节点类型：root-根节点 | dept-部门 | branch-分支 | station-站点 | company-企业 */
  nodeType: 'root' | 'dept' | 'branch' | 'station' | 'company'
  /** 关联套餐名称 */
  packageName: string
  /** 节点描述 */
  description: string
  /** 是否为关键/重点单位 */
  isKey: boolean
  /** 成员列表 */
  members: OrgMember[]
  /** 子节点 */
  children?: OrgTreeNode[]
}

/** 组织成员 */
export interface OrgMember {
  id: number
  /** 姓名 */
  name: string
  /** 职务 */
  position: string
  /** 联系电话 */
  phone: string
  /** 联系邮箱 */
  email: string
  /** 负责区域/职责描述 */
  responsibility: string
}
