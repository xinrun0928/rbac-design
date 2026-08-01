/** 基础管理类型定义 */

/** 角色类型 */
export interface RoleItem {
  /** 角色名称 */
  name: string
  /** 是否选中 */
  selected?: boolean
}

/** 用户管理记录 */
export interface BasicUser {
  /** 用户姓名 */
  name: string
  /** 所属部门 */
  department: string
  /** 性别 */
  gender: string
  /** 手机号码 */
  phone: string
  /** 账号状态 */
  accountStatus: '启用' | '停用'
  /** 添加时间 */
  addTime: string
  /** 操作人 */
  operator: string
}
