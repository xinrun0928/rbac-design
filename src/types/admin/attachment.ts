/** 附件数据类型 */
export interface Attachment {
  /** 附件ID */
  attachmentId: number
  /** 所属子系统ID */
  subsysId: number
  /** 文件名 */
  fileName: string
  /** 文件大小（字节） */
  fileSize: number
  /** 文件MD5校验值 */
  fileMd5: string
  /** MIME类型 */
  mimeType: string
  /** 文件扩展名 */
  fileExt: string
  /** 存储路径 */
  storagePath: string
  /** 存储类型: local-本地, oss-对象存储, minio-MinIO */
  storageType: string
  /** 文件描述 */
  fileDesc: string | null
  /** 文件元数据（JSON） */
  metadata: string | null
  /** 上传用户ID */
  userId: number | null
  /** 所属组织ID */
  orgId: number | null
  /** 创建人 */
  creater: string | null
  /** 创建时间 */
  createTime: string
  /** 更新人 */
  updater: string | null
  /** 更新时间 */
  updateTime: string
  /** 删除标记: 0-未删除, 1-已删除 */
  deleted: number
  /** 签名 */
  signature: string | null
  /** 签名版本 */
  signatureVersion: number
}

/** 附件搜索表单类型 */
export interface AttachmentSearchForm {
  /** 文件名 */
  fileName: string
  /** 文件扩展名 */
  fileExt: string
  /** 存储类型 */
  storageType: string
  /** 子系统ID */
  subsysId: number | ''
}
