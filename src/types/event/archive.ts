/** 归档事故库 */
export interface EventArchive {
  /** 事故ID */
  id: number
  /** 事故名称 */
  accidentName: string
  /** 事故编号 */
  accidentCode: string
  /** 事故类型 */
  accidentType: string
  /** 事故等级: 特别重大, 重大, 较大, 一般 */
  accidentLevel: string
  /** 事故地点 */
  location: string
  /** 事发时间 */
  occurTime: string
  /** 归档时间 */
  archiveTime: string
  /** 伤亡人数 */
  casualtyCount: number
  /** 受伤人数 */
  injuredCount: number
  /** 死亡人数 */
  deadCount: number
  /** 处置时长（小时） */
  handleDuration: number
  /** 是否结案 */
  closed: boolean
  /** 责任单位 */
  responsibleOrg: string
  /** 事故原因 */
  cause: string
  /** 处置措施 */
  measures: string
  /** 经验教训 */
  lessons: string
  /** 附件数量 */
  attachmentCount: number
}
