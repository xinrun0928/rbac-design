import type { RoadConfig, RoadInfo, TollInfo, ServiceInfo, BridgeInfo, TunnelInfo } from '@/types/dispatch/roadData'

/** 重点路段配置 */
export const roadConfigData: RoadConfig[] = [
  { id: 1, name: 'G4天河段', direction: '北向南', congestionLevel: '高', congestionTime: '07:30-09:30', congestionPoint: '天河收费站入口', stakeNumber: 'K25+500', company: '广深高速公司' },
  { id: 2, name: 'G15佛山段', direction: '南向北', congestionLevel: '中', congestionTime: '17:30-19:30', congestionPoint: '佛山西出口', stakeNumber: 'K130+200', company: '佛山交通局' },
  { id: 3, name: 'G25惠州段', direction: '东向西', congestionLevel: '高', congestionTime: '08:00-10:00', congestionPoint: '惠州收费站', stakeNumber: 'K55+800', company: '惠州交通局' },
  { id: 4, name: 'G94中山段', direction: '双向', congestionLevel: '中', congestionTime: '18:00-20:00', congestionPoint: '中山服务区', stakeNumber: 'K20+600', company: '中山交通局' },
  { id: 5, name: 'S3深圳段', direction: '南向北', congestionLevel: '高', congestionTime: '07:00-09:00', congestionPoint: '南山收费站', stakeNumber: 'K35+200', company: '深圳交通局' },
  { id: 6, name: 'G78清远段', direction: '北向南', congestionLevel: '低', congestionTime: '16:00-18:00', congestionPoint: '清远北出口', stakeNumber: 'K90+300', company: '清远交通局' },
  { id: 7, name: 'G4韶关段', direction: '南向北', congestionLevel: '中', congestionTime: '07:30-09:00', congestionPoint: '韶关北收费站', stakeNumber: 'K70+400', company: '韶关交通局' },
  { id: 8, name: 'G80广州段', direction: '东向西', congestionLevel: '高', congestionTime: '17:00-19:00', congestionPoint: '广州南收费站', stakeNumber: 'K65+300', company: '广州交通局' },
  { id: 9, name: 'G15珠海段', direction: '双向', congestionLevel: '中', congestionTime: '08:00-10:00', congestionPoint: '珠海西出口', stakeNumber: 'K15+200', company: '珠海交通局' },
  { id: 10, name: '港口快速路段', direction: '西向东', congestionLevel: '高', congestionTime: '18:00-21:00', congestionPoint: '港口入口', stakeNumber: 'K5+100', company: '港口管理单' }
]

/** 路段信息 */
export const roadInfoData: RoadInfo[] = [
  { id: 1, name: 'G4高速天河段', route: 'G4京港澳高速', area: '广州市', manager: '广州交通局', type: '高速路段', updateTime: '2026-04-01 08:50', status: '正常' },
  { id: 2, name: 'G15佛山段', route: 'G15沈海高速', area: '佛山市', manager: '佛山交通局', type: '高速路段', updateTime: '2026-04-01 08:55', status: '正常' },
  { id: 3, name: 'G25惠州段', route: 'G25长深高速', area: '惠州市', manager: '惠州交通局', type: '高速路段', updateTime: '2026-04-01 09:00', status: '正常' },
  { id: 4, name: 'G94中山段', route: 'G94珠三角环线', area: '中山市', manager: '中山交通局', type: '高速路段', updateTime: '2026-04-01 09:05', status: '正常' },
  { id: 5, name: 'S3深圳段', route: 'S3广深沿江高速', area: '深圳市', manager: '深圳交通局', type: '高速路段', updateTime: '2026-04-01 09:10', status: '正常' },
  { id: 6, name: 'G78清远段', route: 'G78汕昆高速', area: '清远市', manager: '清远交通局', type: '高速路段', updateTime: '2026-04-01 09:15', status: '正常' },
  { id: 7, name: 'G4韶关段', route: 'G4京港澳高速', area: '韶关市', manager: '韶关交通局', type: '高速路段', updateTime: '2026-04-01 09:20', status: '正常' },
  { id: 8, name: 'G80广州段', route: 'G80广昆高速', area: '广州市', manager: '广州交通局', type: '高速路段', updateTime: '2026-04-01 09:25', status: '正常' },
  { id: 9, name: 'G15珠海段', route: 'G15沈海高速', area: '珠海市', manager: '珠海交通局', type: '高速路段', updateTime: '2026-04-01 09:30', status: '正常' },
  { id: 10, name: '港口通道路段', route: '港口快速路', area: '港口区域', manager: '港口管理单位', type: '城市道路', updateTime: '2026-04-01 09:35', status: '正常' }
]

/** 收费站信息 */
export const tollInfoData: TollInfo[] = [
  { id: 1, name: '天河收费站', route: 'G4京港澳高速', roadSection: 'G4天河段', stakeNumber: 'K25+500', area: '广州市', manager: '广州交通局', updateTime: '2026-04-01 08:50', status: '正常' },
  { id: 2, name: '南山收费站', route: 'S3广深沿江高速', roadSection: 'S3深圳段', stakeNumber: 'K35+200', area: '深圳市', manager: '深圳交通局', updateTime: '2026-04-01 08:55', status: '正常' },
  { id: 3, name: '清远北收费站', route: 'G78汕昆高速', roadSection: 'G78清远段', stakeNumber: 'K90+300', area: '清远市', manager: '清远交通局', updateTime: '2026-04-01 09:00', status: '正常' },
  { id: 4, name: '佛山西收费站', route: 'G15沈海高速', roadSection: 'G15佛山段', stakeNumber: 'K130+100', area: '佛山市', manager: '佛山交通局', updateTime: '2026-04-01 09:05', status: '正常' },
  { id: 5, name: '中山南收费站', route: 'G94珠三角环线', roadSection: 'G94中山段', stakeNumber: 'K20+600', area: '中山市', manager: '中山交通局', updateTime: '2026-04-01 09:10', status: '正常' },
  { id: 6, name: '惠州东收费站', route: 'G25长深高速', roadSection: 'G25惠州段', stakeNumber: 'K55+800', area: '惠州市', manager: '惠州交通局', updateTime: '2026-04-01 09:15', status: '正常' },
  { id: 7, name: '韶关北收费站', route: 'G4京港澳高速', roadSection: 'G4韶关段', stakeNumber: 'K70+400', area: '韶关市', manager: '韶关交通局', updateTime: '2026-04-01 09:20', status: '正常' },
  { id: 8, name: '珠海西收费站', route: 'G15沈海高速', roadSection: 'G15珠海段', stakeNumber: 'K15+200', area: '珠海市', manager: '珠海交通局', updateTime: '2026-04-01 09:25', status: '正常' },
  { id: 9, name: '港口收费站', route: '港口快速路', roadSection: '港口通道路段', stakeNumber: 'K5+100', area: '港口区域', manager: '港口管理单位', updateTime: '2026-04-01 09:30', status: '正常' },
  { id: 10, name: '广州南收费站', route: 'G80广昆高速', roadSection: 'G80广州段', stakeNumber: 'K65+300', area: '广州市', manager: '广州交通局', updateTime: '2026-04-01 09:35', status: '正常' }
]

/** 服务区信息 */
export const serviceInfoData: ServiceInfo[] = [
  { id: 1, name: '天河服务区', route: 'G4京港澳高速', roadSection: 'G4天河段', stakeNumber: 'K25+000', area: '广州市', manager: '广州交通局', status: '正常' },
  { id: 2, name: '南山服务区', route: 'S3广深沿江高速', roadSection: 'S3深圳段', stakeNumber: 'K35+000', area: '深圳市', manager: '深圳交通局', status: '正常' },
  { id: 3, name: '清远北服务区', route: 'G78汕昆高速', roadSection: 'G78清远段', stakeNumber: 'K90+000', area: '清远市', manager: '清远交通局', status: '正常' },
  { id: 4, name: '佛山西服务区', route: 'G15沈海高速', roadSection: 'G15佛山段', stakeNumber: 'K130+000', area: '佛山市', manager: '佛山交通局', status: '正常' },
  { id: 5, name: '中山南服务区', route: 'G94珠三角环线', roadSection: 'G94中山段', stakeNumber: 'K20+000', area: '中山市', manager: '中山交通局', status: '正常' },
  { id: 6, name: '惠州东服务区', route: 'G25长深高速', roadSection: 'G25惠州段', stakeNumber: 'K55+000', area: '惠州市', manager: '惠州交通局', status: '正常' },
  { id: 7, name: '韶关北服务区', route: 'G4京港澳高速', roadSection: 'G4韶关段', stakeNumber: 'K70+000', area: '韶关市', manager: '韶关交通局', status: '正常' },
  { id: 8, name: '珠海西服务区', route: 'G15沈海高速', roadSection: 'G15珠海段', stakeNumber: 'K15+000', area: '珠海市', manager: '珠海交通局', status: '正常' },
  { id: 9, name: '港口服务区', route: '港口快速路', roadSection: '港口通道路段', stakeNumber: 'K5+000', area: '港口区域', manager: '港口管理单位', status: '正常' },
  { id: 10, name: '广州南服务区', route: 'G80广昆高速', roadSection: 'G80广州段', stakeNumber: 'K65+000', area: '广州市', manager: '广州交通局', status: '正常' }
]

/** 桥梁信息 */
export const bridgeInfoData: BridgeInfo[] = [
  { id: 1, name: '天河大桥', route: 'G4京港澳高速', roadSection: 'G4天河段', area: '广州市', manager: '广州交通局', type: '跨河桥', status: '正常' },
  { id: 2, name: '南山跨海大桥', route: 'S3广深沿江高速', roadSection: 'S3深圳段', area: '深圳市', manager: '深圳交通局', type: '跨海桥', status: '正常' },
  { id: 3, name: '清远北桥', route: 'G78汕昆高速', roadSection: 'G78清远段', area: '清远市', manager: '清远交通局', type: '山区桥', status: '正常' },
  { id: 4, name: '佛山西立交桥', route: 'G15沈海高速', roadSection: 'G15佛山段', area: '佛山市', manager: '佛山交通局', type: '立交桥', status: '正常' },
  { id: 5, name: '中山南桥', route: 'G94珠三角环线', roadSection: 'G94中山段', area: '中山市', manager: '中山交通局', type: '城市桥', status: '正常' },
  { id: 6, name: '惠州东桥', route: 'G25长深高速', roadSection: 'G25惠州段', area: '惠州市', manager: '惠州交通局', type: '跨河桥', status: '正常' },
  { id: 7, name: '韶关北桥', route: 'G4京港澳高速', roadSection: 'G4韶关段', area: '韶关市', manager: '韶关交通局', type: '山区桥', status: '正常' },
  { id: 8, name: '珠海跨海通道桥', route: 'G15沈海高速', roadSection: 'G15珠海段', area: '珠海市', manager: '珠海交通局', type: '跨海桥', status: '正常' },
  { id: 9, name: '港口通道桥', route: '港口快速路', roadSection: '港口通道路段', area: '港口区域', manager: '港口管理单位', type: '城市桥', status: '正常' },
  { id: 10, name: '广州南高架桥', route: 'G80广昆高速', roadSection: 'G80广州段', area: '广州市', manager: '广州交通局', type: '高架桥', status: '正常' }
]

/** 隧道信息 */
export const tunnelInfoData: TunnelInfo[] = [
  { id: 1, name: '天河隧道', route: 'G4京港澳高速', roadSection: 'G4天河段', area: '广州市', manager: '广州交通局', type: '城市隧道', status: '正常' },
  { id: 2, name: '南山隧道', route: 'S3广深沿江高速', roadSection: 'S3深圳段', area: '深圳市', manager: '深圳交通局', type: '海底隧道', status: '正常' },
  { id: 3, name: '清远北隧道', route: 'G78汕昆高速', roadSection: 'G78清远段', area: '清远市', manager: '清远交通局', type: '山区隧道', status: '正常' },
  { id: 4, name: '佛山西隧道', route: 'G15沈海高速', roadSection: 'G15佛山段', area: '佛山市', manager: '佛山交通局', type: '城市隧道', status: '正常' },
  { id: 5, name: '中山南隧道', route: 'G94珠三角环线', roadSection: 'G94中山段', area: '中山市', manager: '中山交通局', type: '城市隧道', status: '正常' },
  { id: 6, name: '惠州东隧道', route: 'G25长深高速', roadSection: 'G25惠州段', area: '惠州市', manager: '惠州交通局', type: '山区隧道', status: '正常' },
  { id: 7, name: '韶关北隧道', route: 'G4京港澳高速', roadSection: 'G4韶关段', area: '韶关市', manager: '韶关交通局', type: '山区隧道', status: '正常' },
  { id: 8, name: '珠海跨海隧道', route: 'G15沈海高速', roadSection: 'G15珠海段', area: '珠海市', manager: '珠海交通局', type: '海底隧道', status: '正常' },
  { id: 9, name: '港口通道隧道', route: '港口快速路', roadSection: '港口通道路段', area: '港口区域', manager: '港口管理单位', type: '城市隧道', status: '正常' },
  { id: 10, name: '广州南隧道', route: 'G80广昆高速', roadSection: 'G80广州段', area: '广州市', manager: '广州交通局', type: '城市隧道', status: '正常' }
]
