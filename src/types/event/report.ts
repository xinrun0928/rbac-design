/** 事件管理 - 事故上报 */
export interface EventReport {
  /** 事故ID */
  id: number
  /** 事故名称 */
  accidentName: string
  /** 报送时间 */
  reportTime: string
  /** 报告类型: 1-首报, 2-续报, 3-终报 */
  reportType: number
  /** 事故地点 */
  location: string
  /** 事故现场信息 */
  sceneInfo: string
  /** 状态: 0-未终报, 1-已终报, 2-已关闭 */
  status: number
  /** 创建时间 */
  createTime: string
}
