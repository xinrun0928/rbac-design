export interface MessageTemplate {
  id: number
  templateId: string
  msgId: string
  name: string | null
  template: string
  content: string
  extJson: string | null
  approvalJson: string | null
  status: number
  createTime: string
  deleted: number
}

// 解析后的ext_json信息
export interface ExtJsonInfo {
  code: number
  message: string
  success: boolean
  data: {
    msg: string
    res: string
    success: boolean
    respdata: {
      records: Array<{
        codeDesc: string
        code: string
        msgId: string
        templateId: string
      }>
    }
  }
  timestamp: number
}

// 解析后的approval_json信息
export interface ApprovalJsonInfo {
  code: number
  message: string
  success: boolean
  data: {
    msg: string
    res: string
    success: boolean
    respdata: {
      records: Array<{
        codeDesc: string
        code: string
        statusDesc: string
        msgId: string
        desc: string
        status: string
      }>
    }
  }
  timestamp: number
}

export interface MessageTemplateSearchForm {
  templateId: string
  msgId: string
  status: number | ''
}
