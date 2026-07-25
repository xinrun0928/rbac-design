import {
  mockAccessLogData,
  mockMessageLogData,
  mockHttpLogData,
  mockLoginLogData
} from '@/mock/logsData'
import type { SysAccessLog, SysMessageLog, SysHttpLog, SysLoginLog } from '@/types/logs/logs'

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
    if (params.search.user_name) {
      const keyword = params.search.user_name.trim().toLowerCase()
      data = data.filter(item => item.user_name?.toLowerCase().includes(keyword))
    }
    if (params.search.ip) {
      const keyword = params.search.ip.trim()
      data = data.filter(item => item.ip.includes(keyword))
    }
    if (params.search.req_url) {
      const keyword = params.search.req_url.trim().toLowerCase()
      data = data.filter(item => item.req_url.toLowerCase().includes(keyword))
    }
    if (params.search.op_type) {
      data = data.filter(item => item.op_type === params.search!.op_type)
    }
    if (params.search.func_type) {
      data = data.filter(item => item.func_type === params.search!.func_type)
    }
    if (params.search.module_type) {
      data = data.filter(item => item.module_type === params.search!.module_type)
    }
    if (params.search.status !== undefined && params.search.status !== '') {
      data = data.filter(item => item.status === params.search!.status)
    }
    if (params.search.create_time && params.search.create_time.length === 2) {
      const [start, end] = params.search.create_time
      if (start && end) {
        data = data.filter(item => {
          const d = item.create_time
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
    if (params.search.template_id) {
      const keyword = params.search.template_id.trim().toLowerCase()
      data = data.filter(item => item.template_id.toLowerCase().includes(keyword))
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
    if (params.search.create_time && params.search.create_time.length === 2) {
      const [start, end] = params.search.create_time
      if (start && end) {
        data = data.filter(item => {
          const d = item.create_time
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
  return mockMessageLogData.find(item => item.message_id === messageId)
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
    if (params.search.user_id) {
      const keyword = params.search.user_id.trim()
      data = data.filter(item => String(item.user_id).includes(keyword))
    }
    if (params.search.req_url) {
      const keyword = params.search.req_url.trim().toLowerCase()
      data = data.filter(item => item.req_url.toLowerCase().includes(keyword))
    }
    if (params.search.req_method) {
      data = data.filter(item => item.req_method === params.search!.req_method)
    }
    if (params.search.rep_state !== undefined && params.search.rep_state !== '') {
      data = data.filter(item => item.rep_state === params.search!.rep_state)
    }
    if (params.search.create_time && params.search.create_time.length === 2) {
      const [start, end] = params.search.create_time
      if (start && end) {
        data = data.filter(item => {
          const d = item.create_time
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
    if (params.search.user_name) {
      const keyword = params.search.user_name.trim().toLowerCase()
      data = data.filter(item => item.user_name?.toLowerCase().includes(keyword))
    }
    if (params.search.client_id) {
      const keyword = params.search.client_id.trim().toLowerCase()
      data = data.filter(item => item.client_id.toLowerCase().includes(keyword))
    }
    if (params.search.ip) {
      const keyword = params.search.ip.trim()
      data = data.filter(item => item.ip.includes(keyword))
    }
    if (params.search.operation_type !== undefined && params.search.operation_type !== '') {
      data = data.filter(item => item.operation_type === params.search!.operation_type)
    }
    if (params.search.grant_type) {
      const keyword = params.search.grant_type.trim().toLowerCase()
      data = data.filter(item => item.grant_type.toLowerCase().includes(keyword))
    }
    if (params.search.create_time && params.search.create_time.length === 2) {
      const [start, end] = params.search.create_time
      if (start && end) {
        data = data.filter(item => {
          const d = item.create_time
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
  return mockLoginLogData.find(item => item.log_id === logId)
}
