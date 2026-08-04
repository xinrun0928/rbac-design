import type { EventDocument } from '@/types/event/document'

/** 事件管理 - 文档库 Mock 数据 */
export const mockEventDocumentData: EventDocument[] = [
  { id: 1, title: '广清高速暴雨内涝应急预案', docType: '专项预案', relatedEvent: '广清高速暴雨内涝交通中断事件', creator: '张伟', createTime: '2026-04-02 08:20:00' },
  { id: 2, title: 'G78多车追尾事故处置方案', docType: '处置方案', relatedEvent: 'G78汕昆高速多车追尾事故', creator: '王磊', createTime: '2026-04-02 09:30:00' },
  { id: 3, title: '危化品泄漏应急预案调用记录', docType: '应急预案', relatedEvent: '广清高速危化品泄漏事件', creator: '李强', createTime: '2026-04-02 10:15:00' },
  { id: 4, title: '广州环城高速拥堵情况通报', docType: '通知', relatedEvent: '广州环城高速严重拥堵事件', creator: '陈超', createTime: '2026-04-02 11:00:00' },
  { id: 5, title: '山区滑坡事件处置总结报告', docType: '报告', relatedEvent: '山区滑坡导致道路中断事件', creator: '刘洋', createTime: '2026-04-02 16:30:00' },
  { id: 6, title: 'G4京港澳高速大雾天气应急预案', docType: '专项预案', relatedEvent: 'G4京港澳高速大雾天气应急响应', creator: '张伟', createTime: '2026-04-01 14:20:00' },
  { id: 7, title: 'G6京藏高速桥梁震后检查方案', docType: '处置方案', relatedEvent: 'G6京藏高速桥梁震后安全检查', creator: '王磊', createTime: '2026-04-01 10:30:00' },
  { id: 8, title: 'S81路面塌方抢通作业方案', docType: '处置方案', relatedEvent: 'S81广州环城高速路面塌方', creator: '李强', createTime: '2026-03-31 16:45:00' },
  { id: 9, title: '暴雨积水路段绕行通知', docType: '通知', relatedEvent: 'G94珠三角环线高速暴雨积水', creator: '陈超', createTime: '2026-03-31 09:10:00' },
  { id: 10, title: 'G15沈海高速追尾事故处置报告', docType: '报告', relatedEvent: 'G15沈海高速货车追尾事故', creator: '刘洋', createTime: '2026-03-30 15:20:00' },
  { id: 11, title: '高温天气行车安全提示发布记录', docType: '通知', relatedEvent: 'G45大广高速高温行车安全提示', creator: '张伟', createTime: '2026-03-30 08:40:00' },
  { id: 12, title: 'S303省道山体落石处置方案', docType: '处置方案', relatedEvent: 'S303省道梅州段山体落石', creator: '王磊', createTime: '2026-03-29 14:15:00' },
  { id: 13, title: '广深高速虎门大桥拥堵应急方案', docType: '专项预案', relatedEvent: '广深高速虎门大桥拥堵事件', creator: '李强', createTime: '2026-03-29 11:30:00' },
  { id: 14, title: 'G45大广高速边坡滑塌抢通报告', docType: '报告', relatedEvent: 'G45大广高速韶关段边坡滑塌', creator: '刘洋', createTime: '2026-03-28 16:50:00' },
  { id: 15, title: 'S304省道路基塌陷临时便道方案', docType: '处置方案', relatedEvent: 'S304省道清远段路基塌陷', creator: '陈超', createTime: '2026-03-28 09:25:00' },
]
