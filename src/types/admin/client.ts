/** 客户端管理 - OAuth2客户端 */
export interface OAuthClient {
  /** 客户端ID */
  clientId: string
  /** 客户端密钥 */
  clientSecret: string
  /** 域 */
  scope: string
  /** 授权类型 */
  authorizedGrantTypes: string
  /** 重定向地址 */
  webServerRedirectUri: string
  /** 子系统ID列表 */
  subsystemIds: string
  /** token有效期（秒） */
  accessTokenValidity: number
  /** 刷新令牌有效期（秒） */
  refreshTokenValidity: number
  /** 令牌扩展字段JSON */
  additionalInformation: string
  /** 是否自动放行 */
  autoApprove: string
}

/** 客户端管理 - 搜索表单 */
export interface ClientSearchForm {
  clientId: string
}
