/** MQ消息消费日志数据类型 */
export interface MqConsumeLog {
  /** 日志ID */
  id: number
  /** 消息投递标签 */
  deliveryTag: number
  /** 操作类型 */
  operation: string
  /** 交换机名称 */
  exchange: string
  /** 路由键 */
  routingKey: string
  /** 队列名称 */
  queueName: string
  /** 消息ID */
  msgId: string
  /** 消息内容类型 */
  contentType: string
  /** 消息内容（JSON） */
  payload: string
  /** 消费状态: 0-待消费, 1-消费成功, 2-消费失败 */
  status: number
  /** 错误信息 */
  errorMessage: string | null
  /** 业务处理结果 */
  businessResult: string | null
  /** 处理耗时（毫秒） */
  processTime: number | null
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

/** MQ消息消费日志搜索表单类型 */
export interface MqConsumeLogSearchForm {
  /** 队列名称 */
  queueName: string
  /** 路由键 */
  routingKey: string
  /** 消费状态 */
  status: number | ''
  /** 开始时间 */
  startTime: string
  /** 结束时间 */
  endTime: string
}
