/** 数据源配置 */
export interface DataSource {
  id: number
  identifier: string
  objectType: string
  url: string
  requestMethod: string
  authMethod: string
  authInfo: string
  syncMethod: string
}

export const dataSourceData: DataSource[] = [
  { id: 1, identifier: 'GAODE_ROAD_INFO', objectType: '路段', url: 'https://restapi.amap.com/v3/traffic/status/road', requestMethod: 'GET', authMethod: 'API Key', authInfo: 'key=43cbed37a1a126069b1d192845792d0', syncMethod: '实时同步' },
  { id: 2, identifier: 'GD_SERVICE_AREA', objectType: '服务区', url: 'https://api.gdjt.gov.cn/service-area/list', requestMethod: 'POST', authMethod: 'Token', authInfo: 'Authorization: Bearer xxxxxx', syncMethod: '定时同步' },
  { id: 3, identifier: 'GD_TOLL_STATION', objectType: '收费站', url: 'https://api.gdjt.gov.cn/tollstation/query', requestMethod: 'POST', authMethod: 'Token', authInfo: 'Authorization: Bearer xxxxxx', syncMethod: '定时同步' },
  { id: 4, identifier: 'COMMAND_VEHICLE', objectType: '指挥车', url: 'http://10.10.1.25:8080/api/vehicle/list', requestMethod: 'GET', authMethod: '无认证', authInfo: '无', syncMethod: '实时同步' },
  { id: 5, identifier: 'SINGLE_SOLDIER', objectType: '单兵设备', url: 'http://10.10.1.30:9000/device/soldier', requestMethod: 'GET', authMethod: 'Basic Auth', authInfo: 'username: admin / password: 123456', syncMethod: '实时同步' },
  { id: 6, identifier: 'CONTROL_BALL', objectType: '布控球', url: 'http://10.10.1.40:8081/api/camera/controlball', requestMethod: 'GET', authMethod: 'Token', authInfo: 'Authorization: Bearer xxxxxx', syncMethod: '定时同步' },
  { id: 7, identifier: 'WEATHER_MONITOR', objectType: '气象监测', url: 'https://api.weather.com/v1/data', requestMethod: 'GET', authMethod: 'API Key', authInfo: 'appid=xxxx&appsecret=xxxx', syncMethod: '定时同步' },
  { id: 8, identifier: 'TRAFFIC_FLOW', objectType: '交通流量', url: 'https://api.trafficdata.cn/flow', requestMethod: 'POST', authMethod: 'Token', authInfo: 'Authorization: Bearer xxxxxx', syncMethod: '实时同步' },
  { id: 9, identifier: '港口视频接入网关', objectType: 'GB28181网关', url: '港口管理单位', requestMethod: '已接入', authMethod: '192.168.10.18', authInfo: '5060', syncMethod: '2026-04-01 10:10' },
  { id: 10, identifier: '高速监控网关', objectType: '国标网关', url: '广深高速公司', requestMethod: '已接入', authMethod: '192.168.10.19', authInfo: '5060', syncMethod: '2026-04-01 10:20' }
]
