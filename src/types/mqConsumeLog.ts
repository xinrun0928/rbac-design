export interface MqConsumeLog {
  id: number
  deliveryTag: number
  operation: string
  exchange: string
  routingKey: string
  queueName: string
  msgId: string
  contentType: string
  payload: string
  status: number
  errorMessage: string | null
  businessResult: string | null
  processTime: number | null
  creater: string | null
  createTime: string
  updater: string | null
  updateTime: string
  deleted: number
  signature: string | null
  signatureVersion: number
}

export interface MqConsumeLogSearchForm {
  queueName: string
  routingKey: string
  status: number | ''
  startTime: string
  endTime: string
}
