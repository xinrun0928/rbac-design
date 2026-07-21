export interface Attachment {
  attachmentId: number
  subsysId: number
  fileName: string
  fileSize: number
  fileMd5: string
  mimeType: string
  fileExt: string
  storagePath: string
  storageType: string
  fileDesc: string | null
  metadata: string | null
  userId: number | null
  orgId: number | null
  creater: string | null
  createTime: string
  updater: string | null
  updateTime: string
  deleted: number
  signature: string | null
  signatureVersion: number
}

export interface AttachmentSearchForm {
  fileName: string
  fileExt: string
  storageType: string
  subsysId: number | ''
}
