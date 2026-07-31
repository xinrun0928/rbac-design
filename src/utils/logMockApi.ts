import {
  mockAccessLogData,
  mockMessageLogData,
  mockHttpLogData,
  mockLoginLogData
} from '@/mock/admin/logsData'
import type { SysAccessLog, SysMessageLog, SysHttpLog, SysLoginLog } from '@/types/admin/logs'

/** 模拟网络延迟 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/** 分页查询访问日志 */
export async function getAccessLogs(params: {
  page: number
  pageSize: number
  search?: Record<string, any>
}): Promise<{ list: SysAccessLog[]; total: number }> {
  await delay(200 + Math.random() * 300)

  let data = [...mockAccessLogData]

  if (params.search) {
    if (params.search.name) {
      const keyword = params.search.name.trim().toLowerCase()
      data = data.filter(item => item.name.toLowerCase().includes(keyword))
    }
    if (params.search.userName) {
      const keyword = params.search.userName.trim().toLowerCase()
      data = data.filter(item => item.userName?.toLowerCase().includes(keyword))
    }
    if (params.search.ip) {
      const keyword = params.search.ip.trim()
      data = data.filter(item => item.ip.includes(keyword))
    }
    if (params.search.reqUrl) {
      const keyword = params.search.reqUrl.trim().toLowerCase()
      data = data.filter(item => item.reqUrl.toLowerCase().includes(keyword))
    }
    if (params.search.opType) {
      data = data.filter(item => item.opType === params.search!.opType)
    }
    if (params.search.funcType) {
      data = data.filter(item => item.funcType === params.search!.funcType)
    }
    if (params.search.moduleType) {
      data = data.filter(item => item.moduleType === params.search!.moduleType)
    }
    if (params.search.status !== undefined && params.search.status !== '') {
      data = data.filter(item => item.status === params.search!.status)
    }
    if (params.search.createTime && params.search.createTime.length === 2) {
      const [start, end] = params.search.createTime
      if (start && end) {
        data = data.filter(item => {
          const d = item.createTime
          return d >= start && d <= end + ' 23:59:59'
        })
      }
    }
  }

  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize

  return {
    list: data.slice(start, end),
    total: data.length
  }
}

/** 获取访问日志详情 */
export async function getAccessLogDetail(id: string): Promise<SysAccessLog | undefined> {
  await delay(150)
  return mockAccessLogData.find(item => item.id === id)
}

/** 分页查询短信消息日志 */
export async function getMessageLogs(params: {
  page: number
  pageSize: number
  search?: Record<string, any>
}): Promise<{ list: SysMessageLog[]; total: number }> {
  await delay(200 + Math.random() * 300)

  let data = [...mockMessageLogData]

  if (params.search) {
    if (params.search.templateId) {
      const keyword = params.search.templateId.trim().toLowerCase()
      data = data.filter(item => item.templateId.toLowerCase().includes(keyword))
    }
    if (params.search.phone) {
      const keyword = params.search.phone.trim()
      data = data.filter(item => item.phone.includes(keyword))
    }
    if (params.search.content) {
      const keyword = params.search.content.trim().toLowerCase()
      data = data.filter(item => item.content.toLowerCase().includes(keyword))
    }
    if (params.search.status !== undefined && params.search.status !== '') {
      data = data.filter(item => item.status === params.search!.status)
    }
    if (params.search.createTime && params.search.createTime.length === 2) {
      const [start, end] = params.search.createTime
      if (start && end) {
        data = data.filter(item => {
          const d = item.createTime
          return d >= start && d <= end + ' 23:59:59'
        })
      }
    }
  }

  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize

  return {
    list: data.slice(start, end),
    total: data.length
  }
}

/** 获取短信消息日志详情 */
export async function getMessageLogDetail(messageId: string): Promise<SysMessageLog | undefined> {
  await delay(150)
  return mockMessageLogData.find(item => item.messageId === messageId)
}

/** 分页查询接口请求日志 */
export async function getHttpLogs(params: {
  page: number
  pageSize: number
  search?: Record<string, any>
}): Promise<{ list: SysHttpLog[]; total: number }> {
  await delay(200 + Math.random() * 300)

  let data = [...mockHttpLogData]

  if (params.search) {
    if (params.search.userId) {
      const keyword = params.search.userId.trim()
      data = data.filter(item => String(item.userId).includes(keyword))
    }
    if (params.search.reqUrl) {
      const keyword = params.search.reqUrl.trim().toLowerCase()
      data = data.filter(item => item.reqUrl.toLowerCase().includes(keyword))
    }
    if (params.search.reqMethod) {
      data = data.filter(item => item.reqMethod === params.search!.reqMethod)
    }
    if (params.search.repState !== undefined && params.search.repState !== '') {
      data = data.filter(item => item.repState === params.search!.repState)
    }
    if (params.search.createTime && params.search.createTime.length === 2) {
      const [start, end] = params.search.createTime
      if (start && end) {
        data = data.filter(item => {
          const d = item.createTime
          return d >= start && d <= end + ' 23:59:59'
        })
      }
    }
  }

  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize

  return {
    list: data.slice(start, end),
    total: data.length
  }
}

/** 获取接口请求日志详情 */
export async function getHttpLogDetail(id: string): Promise<SysHttpLog | undefined> {
  await delay(150)
  return mockHttpLogData.find(item => item.id === id)
}

/** 分页查询登录日志 */
export async function getLoginLogs(params: {
  page: number
  pageSize: number
  search?: Record<string, any>
}): Promise<{ list: SysLoginLog[]; total: number }> {
  await delay(200 + Math.random() * 300)

  let data = [...mockLoginLogData]

  if (params.search) {
    if (params.search.userName) {
      const keyword = params.search.userName.trim().toLowerCase()
      data = data.filter(item => item.userName?.toLowerCase().includes(keyword))
    }
    if (params.search.clientId) {
      const keyword = params.search.clientId.trim().toLowerCase()
      data = data.filter(item => item.clientId.toLowerCase().includes(keyword))
    }
    if (params.search.ip) {
      const keyword = params.search.ip.trim()
      data = data.filter(item => item.ip.includes(keyword))
    }
    if (params.search.operationType !== undefined && params.search.operationType !== '') {
      data = data.filter(item => item.operationType === params.search!.operationType)
    }
    if (params.search.grantType) {
      const keyword = params.search.grantType.trim().toLowerCase()
      data = data.filter(item => item.grantType.toLowerCase().includes(keyword))
    }
    if (params.search.createTime && params.search.createTime.length === 2) {
      const [start, end] = params.search.createTime
      if (start && end) {
        data = data.filter(item => {
          const d = item.createTime
          return d >= start && d <= end + ' 23:59:59'
        })
      }
    }
  }

  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize

  return {
    list: data.slice(start, end),
    total: data.length
  }
}

/** 获取登录日志详情 */
export async function getLoginLogDetail(logId: string): Promise<SysLoginLog | undefined> {
  await delay(150)
  return mockLoginLogData.find(item => item.logId === logId)
}
