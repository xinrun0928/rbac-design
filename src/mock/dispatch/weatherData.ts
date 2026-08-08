import type { TyphoonData, RainfallData, WeatherData, WindData, WeatherInterface } from '@/types/dispatch/weather'

/** 台风数据 */
export const typhoonData: TyphoonData[] = [
  { id: 1, name: '台风"海葵"', windSpeed: 38, longitude: 118.5, latitude: 24.2, impactCount: 4, centerWindForce: '13级', updateTime: '2026-04-01 08:50', status: '发展中', visible: true },
  { id: 2, name: '台风"杜苏芮"', windSpeed: 45, longitude: 120.1, latitude: 22.8, impactCount: 6, centerWindForce: '14级', updateTime: '2026-04-01 09:00', status: '发展中', visible: false },
  { id: 3, name: '台风"泰利"', windSpeed: 30, longitude: 117.8, latitude: 23.5, impactCount: 4, centerWindForce: '11级', updateTime: '2026-04-01 09:10', status: '发展中', visible: false },
  { id: 4, name: '台风"苏拉"', windSpeed: 50, longitude: 119.6, latitude: 21.9, impactCount: 3, centerWindForce: '15级', updateTime: '2026-04-01 09:20', status: '发展中', visible: false },
  { id: 5, name: '台风"卡努"', windSpeed: 42, longitude: 121.2, latitude: 25.1, impactCount: 1, centerWindForce: '14级', updateTime: '2026-04-01 09:30', status: '发展中', visible: false },
  { id: 6, name: '台风"玛娃"', windSpeed: 36, longitude: 118.0, latitude: 22.3, impactCount: 8, centerWindForce: '12级', updateTime: '2026-04-01 09:40', status: '发展中', visible: false },
  { id: 7, name: '台风"尼格"', windSpeed: 28, longitude: 116.9, latitude: 24.8, impactCount: 4, centerWindForce: '10级', updateTime: '2026-04-01 09:50', status: '发展中', visible: false },
  { id: 8, name: '台风"暹芭"', windSpeed: 40, longitude: 120.5, latitude: 23.1, impactCount: 6, centerWindForce: '13级', updateTime: '2026-04-01 10:00', status: '发展中', visible: false },
  { id: 9, name: '台风"烟花"', windSpeed: 35, longitude: 119.0, latitude: 26.2, impactCount: 9, centerWindForce: '12级', updateTime: '2026-04-01 10:10', status: '发展中', visible: false },
  { id: 10, name: '台风"利奇马"', windSpeed: 48, longitude: 121.0, latitude: 20.5, impactCount: 4, centerWindForce: '15级', updateTime: '2026-04-01 10:20', status: '发展中', visible: false }
]

/** 降雨量数据 */
export const rainfallData: RainfallData[] = [
  { id: 1, area: '广州市', rainfall: 65, level: '大雨', collectTime: '2026-04-01 08:30', updateTime: '2026-04-01 08:50', impactCount: 4, visible: true },
  { id: 2, area: '深圳市', rainfall: 80, level: '暴雨', collectTime: '2026-04-01 08:40', updateTime: '2026-04-01 08:55', impactCount: 6, visible: false },
  { id: 3, area: '清远市', rainfall: 50, level: '中雨', collectTime: '2026-04-01 08:50', updateTime: '2026-04-01 09:00', impactCount: 4, visible: false },
  { id: 4, area: '佛山市', rainfall: 90, level: '暴雨', collectTime: '2026-04-01 09:00', updateTime: '2026-04-01 09:05', impactCount: 3, visible: false },
  { id: 5, area: '中山市', rainfall: 45, level: '中雨', collectTime: '2026-04-01 09:10', updateTime: '2026-04-01 09:10', impactCount: 1, visible: false },
  { id: 6, area: '惠州市', rainfall: 100, level: '暴雨', collectTime: '2026-04-01 09:15', updateTime: '2026-04-01 09:15', impactCount: 8, visible: false },
  { id: 7, area: '韶关市', rainfall: 30, level: '小雨', collectTime: '2026-04-01 09:20', updateTime: '2026-04-01 09:20', impactCount: 4, visible: false },
  { id: 8, area: '珠海市', rainfall: 70, level: '大雨', collectTime: '2026-04-01 09:25', updateTime: '2026-04-01 09:25', impactCount: 6, visible: false },
  { id: 9, area: '港口区域', rainfall: 85, level: '暴雨', collectTime: '2026-04-01 09:30', updateTime: '2026-04-01 09:30', impactCount: 9, visible: false },
  { id: 10, area: '广州市', rainfall: 55, level: '大雨', collectTime: '2026-04-01 09:35', updateTime: '2026-04-01 09:35', impactCount: 4, visible: false }
]

/** 天气预警数据 */
export const weatherData: WeatherData[] = [
  { id: 1, area: '广州市', warningType: '暴雨预警', warningLevel: '红色', publishTime: '2026-04-01 08:30', updateTime: '2026-04-01 08:50', impactCount: 4, visible: true },
  { id: 2, area: '深圳市', warningType: '暴雨预警', warningLevel: '橙色', publishTime: '2026-04-01 08:40', updateTime: '2026-04-01 08:55', impactCount: 6, visible: false },
  { id: 3, area: '清远市', warningType: '雷电预警', warningLevel: '红色', publishTime: '2026-04-01 08:50', updateTime: '2026-04-01 09:00', impactCount: 4, visible: false },
  { id: 4, area: '佛山市', warningType: '暴雨预警', warningLevel: '橙色', publishTime: '2026-04-01 09:00', updateTime: '2026-04-01 09:05', impactCount: 3, visible: false },
  { id: 5, area: '中山市', warningType: '暴雨预警', warningLevel: '红色', publishTime: '2026-04-01 09:10', updateTime: '2026-04-01 09:10', impactCount: 1, visible: false },
  { id: 6, area: '惠州市', warningType: '暴雨预警', warningLevel: '橙色', publishTime: '2026-04-01 09:15', updateTime: '2026-04-01 09:15', impactCount: 8, visible: false },
  { id: 7, area: '韶关市', warningType: '大风预警', warningLevel: '红色', publishTime: '2026-04-01 09:20', updateTime: '2026-04-01 09:20', impactCount: 4, visible: false },
  { id: 8, area: '珠海市', warningType: '暴雨预警', warningLevel: '橙色', publishTime: '2026-04-01 09:25', updateTime: '2026-04-01 09:25', impactCount: 6, visible: false },
  { id: 9, area: '港口区域', warningType: '台风预警', warningLevel: '红色', publishTime: '2026-04-01 09:30', updateTime: '2026-04-01 09:30', impactCount: 9, visible: false },
  { id: 10, area: '广州市', warningType: '暴雨预警', warningLevel: '橙色', publishTime: '2026-04-01 09:35', updateTime: '2026-04-01 09:35', impactCount: 4, visible: false }
]

/** 风力数据 */
export const windData: WindData[] = [
  { id: 1, area: '广州市', windSpeed: 12, windLevel: '6级', windRange: '200m', impactCount: 4, updateTime: '2026-04-01 08:50', visible: true },
  { id: 2, area: '深圳市', windSpeed: 20, windLevel: '8级', windRange: '500m', impactCount: 6, updateTime: '2026-04-01 08:55', visible: false },
  { id: 3, area: '清远市', windSpeed: 8, windLevel: '4级', windRange: '300m', impactCount: 4, updateTime: '2026-04-01 09:00', visible: false },
  { id: 4, area: '佛山市', windSpeed: 15, windLevel: '7级', windRange: '250m', impactCount: 3, updateTime: '2026-04-01 09:05', visible: false },
  { id: 5, area: '中山市', windSpeed: 10, windLevel: '5级', windRange: '200m', impactCount: 1, updateTime: '2026-04-01 09:10', visible: false },
  { id: 6, area: '惠州市', windSpeed: 22, windLevel: '9级', windRange: '600m', impactCount: 8, updateTime: '2026-04-01 09:15', visible: false },
  { id: 7, area: '韶关市', windSpeed: 9, windLevel: '5级', windRange: '150m', impactCount: 4, updateTime: '2026-04-01 09:20', visible: false },
  { id: 8, area: '珠海市', windSpeed: 18, windLevel: '8级', windRange: '500m', impactCount: 6, updateTime: '2026-04-01 09:25', visible: false },
  { id: 9, area: '港口区域', windSpeed: 25, windLevel: '10级', windRange: '800m', impactCount: 9, updateTime: '2026-04-01 09:30', visible: false },
  { id: 10, area: '广州市', windSpeed: 14, windLevel: '7级', windRange: '200m', impactCount: 4, updateTime: '2026-04-01 09:35', visible: false }
]

/** 数据接口设置 */
export const interfaceData: WeatherInterface[] = [
  { id: 1, name: '降雨量数据接口', type: 'HTTP接口', url: '/api/rain', version: 'v1.0', status: '启用', updateTime: '2026-04-01 08:50', description: '获取降雨数据' },
  { id: 2, name: '台风数据接口', type: 'HTTP接口', url: '/api/typhoon', version: 'v2.1', status: '启用', updateTime: '2026-04-01 08:55', description: '获取台风信息' },
  { id: 3, name: '风力监测接口', type: 'HTTP接口', url: '/api/wind', version: 'v1.2', status: '启用', updateTime: '2026-04-01 09:00', description: '获取风力数据' },
  { id: 4, name: '路段信息接口', type: 'REST接口', url: '/api/road', version: 'v3.0', status: '启用', updateTime: '2026-04-01 09:05', description: '路段数据查询' },
  { id: 5, name: '收费站接口', type: 'REST接口', url: '/api/toll', version: 'v2.0', status: '启用', updateTime: '2026-04-01 09:10', description: '收费站信息' },
  { id: 6, name: '服务区接口', type: 'REST接口', url: '/api/service', version: 'v1.5', status: '启用', updateTime: '2026-04-01 09:15', description: '服务区数据' },
  { id: 7, name: '桥梁接口', type: 'REST接口', url: '/api/bridge', version: 'v1.0', status: '启用', updateTime: '2026-04-01 09:20', description: '桥梁信息' },
  { id: 8, name: '隧道接口', type: 'REST接口', url: '/api/tunnel', version: 'v1.0', status: '启用', updateTime: '2026-04-01 09:25', description: '隧道信息' },
  { id: 9, name: '轨迹接口', type: '数据流接口', url: '/api/track', version: 'v2.3', status: '启用', updateTime: '2026-04-01 09:30', description: '车辆轨迹' },
  { id: 10, name: '视频设备接口', type: 'HTTP接口', url: '/api/video', version: 'v1.8', status: '启用', updateTime: '2026-04-01 09:35', description: '视频设备数据' }
]
