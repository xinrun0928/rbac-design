/** 短信模板数据类型 */
export interface MessageTemplate {
  /** 模板ID */
  id: number
  /** 模板编号 */
  templateId: string
  /** 消息ID */
  msgId: string
  /** 模板名称 */
  name: string
  /** 排序号 */
  displayOrder: number
  /** 子系统ID */
  subsystemId: number
  /** 子系统名称 */
  subsystemName: string
  /** 备注 */
  remark: string
  /** 模板内容 */
  template: string
  /** 消息内容 */
  content: string
  /** 扩展信息（JSON） */
  extJson?: string | null
  /** 审批信息（JSON） */
  approvalJson?: string | null
  /** 状态: 1-正常, 0-停用 */
  status: number
  /** 创建时间 */
  createTime: string
}

/** 扩展信息解析后的数据结构 */
export interface ExtJsonInfo {
  /** 响应码 */
  code: number
  /** 响应消息 */
  message: string
  /** 是否成功 */
  success: boolean
  /** 响应数据 */
  data: {
    /** 消息 */
    msg: string
    /** 结果 */
    res: string
    /** 是否成功 */
    success: boolean
    /** 响应详细数据 */
    respdata: {
      /** 模板记录列表 */
      records: Array<{
        /** 代码描述 */
        codeDesc: string
        /** 代码 */
        code: string
        /** 消息ID */
        msgId: string
        /** 模板ID */
        templateId: string
      }>
    }
  }
  /** 时间戳 */
  timestamp: number
}

/** 审批信息解析后的数据结构 */
export interface ApprovalJsonInfo {
  /** 响应码 */
  code: number
  /** 响应消息 */
  message: string
  /** 是否成功 */
  success: boolean
  /** 响应数据 */
  data: {
    /** 消息 */
    msg: string
    /** 结果 */
    res: string
    /** 是否成功 */
    success: boolean
    /** 响应详细数据 */
    respdata: {
      /** 审批记录列表 */
      records: Array<{
        /** 代码描述 */
        codeDesc: string
        /** 代码 */
        code: string
        /** 状态描述 */
        statusDesc: string
        /** 消息ID */
        msgId: string
        /** 描述 */
        desc: string
        /** 状态 */
        status: string
      }>
    }
  }
  /** 时间戳 */
  timestamp: number
}

/** 短信模板申请表单 */
export interface MessageTemplateApplyForm {
  /** 子系统ID */
  subsystemId: number | ''
  /** 模板内容 */
  template: string
}

/** 短信模板搜索表单类型 */
export interface MessageTemplateSearchForm {
  /** 模板编号 */
  templateId: string
  /** 模板名称 */
  name: string
  /** 消息ID */
  msgId: string
  /** 状态筛选 */
  status: number | ''
  /** 子系统ID */
  subsystemId: number | ''
}
