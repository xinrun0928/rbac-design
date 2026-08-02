const TOKEN_KEY = 'ecdp_token'
const LOGIN_INFO_KEY = 'ecdp_login_info'

export interface LoginInfo {
  username: string
  password: string
  phone: string
  loginType: 'password' | 'sms'
}

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function getLoginInfo(): LoginInfo | null {
  const raw = localStorage.getItem(LOGIN_INFO_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as LoginInfo
  } catch {
    return null
  }
}

export function setLoginInfo(info: LoginInfo) {
  localStorage.setItem(LOGIN_INFO_KEY, JSON.stringify(info))
}

export function clearLoginInfo() {
  localStorage.removeItem(LOGIN_INFO_KEY)
}
