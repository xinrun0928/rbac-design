/** 岗位管理 */
export interface Post {
  id: number
  postName: string
  parentId: number
  unitName: string
  status: number // 1=启用 0=停用
  remark: string
  updateTime: string
  deleted: number
  children?: Post[]
}

export interface PostForm {
  id?: number
  postName: string
  parentId: number
  unitName: string
  status: number
  remark: string
}

export interface PostSearchForm {
  postName: string
}
