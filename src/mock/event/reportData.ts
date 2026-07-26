import type { EventReport } from '@/types/event/report'

/** 报告预览 Mock 数据 */
export const mockReportPreviewData: Record<number, { type: string; content: string }[]> = {
  1: [
    {
      type: '首报',
      content: `【首报】

05时58分接广播监控报告事故信息

【一】发现时间：2026年3月27日05时25分监控轮巡发现。

【二】事故地点：广肇高速往广州方向K39+500（莲塘站至白土站，属肇庆高要区）。

【三】事故车辆信息：小车（车牌待核实）、货车（车牌及载货物待核实）。

【四】事故现场信息：

【1】事故情况：车辆追尾。

【2】交通情况：现场交通中断，车龙1公里（往广州方向车辆可从莲塘站出高速绕行G324国道在白土站再入高速；原路径约13.4公里11分钟，绕行路径约16.7公里21分钟）。

【3】伤亡情况：待交警核实。

【五】事故救援信息：路段已通知交警、路政、拯救、消防、急救、养护前往处置。

【六】事故原因：待交警核实。

现场照片：—

历史视频：—`
    }
  ],
  2: [
    {
      type: '首报',
      content: `【首报】

05时58分接广播监控报告事故信息

【一】发现时间：2026年3月27日05时25分监控轮巡发现。

【二】事故地点：广肇高速往广州方向K39+500（莲塘站至白土站，属肇庆高要区）。

【三】事故车辆信息：小车（车牌待核实）、货车（车牌及载货物待核实）。

【四】事故现场信息：

【1】事故情况：车辆追尾。

【2】交通情况：现场交通中断，车龙1公里（往广州方向车辆可从莲塘站出高速绕行G324国道在白土站再入高速；原路径约13.4公里11分钟，绕行路径约16.7公里21分钟）。

【3】伤亡情况：待交警核实。

【五】事故救援信息：路段已通知交警、路政、拯救、消防、急救、养护前往处置。

【六】事故原因：待交警核实。

现场照片：—

历史视频：—`
    },
    {
      type: '续报',
      content: `【续报】

07时31分接广播监控报告事故信息

【一】发现时间：2026年3月27日05时25分监控轮巡发现。

【二】事故地点：广肇高速往广州方向K39+500（莲塘站至白土站，属肇庆高要区）。

【三】事故车辆信息：粤S577A1小车，辽J36754货车运载PVC管、粤K72581货车运载塑料管。

【四】事故现场信息：

【1】事故情况：辽J36754（最后追尾车辆）、粤S577A1、粤K72581先后追尾。

【2】交通情况：05:42车龙1公里；至07:20，现场往广州方向占据第二车道，第一车道可通行，莲塘站往广州方向出口分流（往广州方向车辆可从莲塘站出高速绕行G324国道在白土站再入高速）、入口封闭。

【3】伤亡情况：待交警核实。

【五】事故救援信息：交警、拯救、路政、消防、急救已到场处置。

【六】事故原因：待交警核实。

备注：【黎嘉敏--广东省交通集团高速公路监控中心，值班电话：020-83730980】

现场照片：—

历史视频：—`
    }
  ],
  3: [
    {
      type: '首报',
      content: `【首报】

05时58分接广播监控报告事故信息

【一】发现时间：2026年3月27日05时25分监控轮巡发现。

【二】事故地点：广肇高速往广州方向K39+500（莲塘站至白土站，属肇庆高要区）。

【三】事故车辆信息：小车（车牌待核实）、货车（车牌及载货物待核实）。

【四】事故现场信息：

【1】事故情况：车辆追尾。

【2】交通情况：现场交通中断，车龙1公里（往广州方向车辆可从莲塘站出高速绕行G324国道在白土站再入高速；原路径约13.4公里11分钟，绕行路径约16.7公里21分钟）。

【3】伤亡情况：待交警核实。

【五】事故救援信息：路段已通知交警、路政、拯救、消防、急救、养护前往处置。

【六】事故原因：待交警核实。

现场照片：—

历史视频：—`
    },
    {
      type: '续报',
      content: `【续报】

07时31分接广播监控报告事故信息

【一】发现时间：2026年3月27日05时25分监控轮巡发现。

【二】事故地点：广肇高速往广州方向K39+500（莲塘站至白土站，属肇庆高要区）。

【三】事故车辆信息：粤S577A1小车，辽J36754货车运载PVC管、粤K72581货车运载塑料管。

【四】事故现场信息：

【1】事故情况：辽J36754（最后追尾车辆）、粤S577A1、粤K72581先后追尾。

【2】交通情况：05:42车龙1公里；至07:20，现场往广州方向占据第二车道，第一车道可通行，莲塘站往广州方向出口分流（往广州方向车辆可从莲塘站出高速绕行G324国道在白土站再入高速）、入口封闭。

【3】伤亡情况：待交警核实。

【五】事故救援信息：交警、拯救、路政、消防、急救已到场处置。

【六】事故原因：待交警核实。

备注：【黎嘉敏--广东省交通集团高速公路监控中心，值班电话：020-83730980】

现场照片：—

历史视频：—`
    }
  ]
}

/** 事件管理 - 事故上报 Mock 数据 */
export const mockEventReportData: EventReport[] = [
  { id: 1, accidentName: 'G15沈海高速货车追尾事故', reportTime: '2026-07-25 14:30:00', reportType: 1, location: 'G15沈海高速K1234+500处', sceneInfo: '两辆货车追尾，车头严重变形，有人员被困', status: 0, createTime: '2026-07-25 14:30:00' },
  { id: 2, accidentName: 'S81广州环城高速路面塌方', reportTime: '2026-07-25 11:20:00', reportType: 1, location: 'S81广州环城高速东行K56+200', sceneInfo: '路面塌陷约20平方米，半幅车道封闭', status: 0, createTime: '2026-07-25 11:20:00' },
  { id: 3, accidentName: '京港澳高速韶关段山体滑坡', reportTime: '2026-07-24 16:40:00', reportType: 1, location: '京港澳高速K1865+300', sceneInfo: '山体滑坡导致双向车道受阻，约500立方泥土', status: 1, createTime: '2026-07-24 16:40:00' },
  { id: 4, accidentName: 'G4W广澳高速中山段交通事故', reportTime: '2026-07-24 09:15:00', reportType: 1, location: 'G4W广澳高速K89+100', sceneInfo: '三车连环追尾，交通拥堵约3公里', status: 2, createTime: '2026-07-24 09:15:00' },
  { id: 5, accidentName: 'G94珠三角环线高速暴雨积水', reportTime: '2026-07-23 14:30:00', reportType: 1, location: 'G94珠三角环线K234+800', sceneInfo: '路面积水深度约30厘米，车辆无法通行', status: 1, createTime: '2026-07-23 14:30:00' },
  { id: 6, accidentName: 'S304省道清远段路基塌陷', reportTime: '2026-07-23 17:45:00', reportType: 1, location: 'S304省道K45+600', sceneInfo: '路基塌陷长度约15米，宽度约8米', status: 0, createTime: '2026-07-23 17:45:00' },
  { id: 7, accidentName: '广深高速虎门大桥拥堵事件', reportTime: '2026-07-24 14:00:00', reportType: 1, location: '广深高速虎门大桥段', sceneInfo: '车流量过大导致严重拥堵，排队约5公里', status: 2, createTime: '2026-07-24 14:00:00' },
  { id: 8, accidentName: 'G15沈海高速货车追尾事故', reportTime: '2026-07-25 13:15:00', reportType: 2, location: 'G15沈海高速K1234+500处', sceneInfo: '伤亡人数更新为3人，已送医救治', status: 0, createTime: '2026-07-25 13:15:00' },
  { id: 9, accidentName: 'S81广州环城高速路面塌方', reportTime: '2026-07-25 15:40:00', reportType: 2, location: 'S81广州环城高速东行K56+200', sceneInfo: '塌陷范围扩大至30平方米，已设置警戒线', status: 0, createTime: '2026-07-25 15:40:00' },
  { id: 10, accidentName: '京港澳高速韶关段山体滑坡', reportTime: '2026-07-25 09:00:00', reportType: 2, location: '京港澳高速K1865+300', sceneInfo: '清理工作进行中，预计下午恢复通行', status: 1, createTime: '2026-07-25 09:00:00' },
  { id: 11, accidentName: 'G4W广澳高速中山段交通事故', reportTime: '2026-07-24 15:30:00', reportType: 3, location: 'G4W广澳高速K89+100', sceneInfo: '事故处理完毕，交通恢复正常', status: 2, createTime: '2026-07-24 15:30:00' },
  { id: 12, accidentName: 'G94珠三角环线高速暴雨积水', reportTime: '2026-07-24 08:00:00', reportType: 2, location: 'G94珠三角环线K234+800', sceneInfo: '积水已排除，交通恢复正常', status: 1, createTime: '2026-07-24 08:00:00' },
  { id: 13, accidentName: 'G15沈海高速惠州段车辆起火', reportTime: '2026-07-22 10:30:00', reportType: 1, location: 'G15沈海高速K1100+200', sceneInfo: '一辆货车货箱起火，火势已控制', status: 0, createTime: '2026-07-22 10:30:00' },
  { id: 14, accidentName: 'S303省道梅州段山体落石', reportTime: '2026-07-22 14:15:00', reportType: 1, location: 'S303省道K78+400', sceneInfo: '山体落石约10立方，占用半幅车道', status: 0, createTime: '2026-07-22 14:15:00' },
  { id: 15, accidentName: 'G45大广高速韶关段边坡滑塌', reportTime: '2026-07-21 16:20:00', reportType: 1, location: 'G45大广高速K3200+100', sceneInfo: '边坡滑塌约200立方，双向车道封闭', status: 1, createTime: '2026-07-21 16:20:00' },
  { id: 16, accidentName: 'G15沈海高速惠州段车辆起火', reportTime: '2026-07-22 14:00:00', reportType: 2, location: 'G15沈海高速K1100+200', sceneInfo: '火灾扑灭，现场清理中', status: 0, createTime: '2026-07-22 14:00:00' },
  { id: 17, accidentName: 'S303省道梅州段山体落石', reportTime: '2026-07-22 18:30:00', reportType: 2, location: 'S303省道K78+400', sceneInfo: '落石清理完毕，交通半幅恢复', status: 0, createTime: '2026-07-22 18:30:00' },
  { id: 18, accidentName: 'G45大广高速韶关段边坡滑塌', reportTime: '2026-07-22 10:00:00', reportType: 2, location: 'G45大广高速K3200+100', sceneInfo: '清理工作完成80%，预计今日恢复', status: 1, createTime: '2026-07-22 10:00:00' },
  { id: 19, accidentName: 'S304省道清远段路基塌陷', reportTime: '2026-07-24 10:30:00', reportType: 2, location: 'S304省道K45+600', sceneInfo: '临时便道已铺设，车辆可绕行', status: 0, createTime: '2026-07-24 10:30:00' },
  { id: 20, accidentName: 'G94珠三角环线高速暴雨积水', reportTime: '2026-07-24 12:00:00', reportType: 3, location: 'G94珠三角环线K234+800', sceneInfo: '积水完全排除，交通全面恢复', status: 1, createTime: '2026-07-24 12:00:00' },
  { id: 21, accidentName: 'G15沈海高速货车追尾事故', reportTime: '2026-07-25 18:00:00', reportType: 3, location: 'G15沈海高速K1234+500处', sceneInfo: '事故处理完毕，交通恢复正常', status: 0, createTime: '2026-07-25 18:00:00' },
  { id: 22, accidentName: '广佛高速佛山段大雾追尾', reportTime: '2026-07-20 08:30:00', reportType: 1, location: '广佛高速K15+800', sceneInfo: '大雾天气导致多车追尾，共5辆车受损', status: 2, createTime: '2026-07-20 08:30:00' },
  { id: 23, accidentName: 'S111省道中山段路面破损', reportTime: '2026-07-20 14:20:00', reportType: 1, location: 'S111省道K32+100', sceneInfo: '路面出现大面积破损，影响行车安全', status: 2, createTime: '2026-07-20 14:20:00' },
  { id: 24, accidentName: 'G94珠三角环线高速桥梁检测', reportTime: '2026-07-19 10:00:00', reportType: 1, location: 'G94珠三角环线K180+500', sceneInfo: '定期检测发现桥梁伸缩缝异常', status: 1, createTime: '2026-07-19 10:00:00' },
  { id: 25, accidentName: 'G15沈海高速暴雨交通管制', reportTime: '2026-07-19 16:45:00', reportType: 1, location: 'G15沈海高速K980+300', sceneInfo: '暴雨导致能见度不足50米，实施交通管制', status: 1, createTime: '2026-07-19 16:45:00' },
  { id: 26, accidentName: '广佛高速佛山段大雾追尾', reportTime: '2026-07-20 12:00:00', reportType: 3, location: '广佛高速K15+800', sceneInfo: '事故处理完毕，交通恢复正常', status: 2, createTime: '2026-07-20 12:00:00' },
  { id: 27, accidentName: 'S111省道中山段路面破损', reportTime: '2026-07-21 09:30:00', reportType: 2, location: 'S111省道K32+100', sceneInfo: '修补工作完成，交通恢复正常', status: 2, createTime: '2026-07-21 09:30:00' },
  { id: 28, accidentName: 'G94珠三角环线高速桥梁检测', reportTime: '2026-07-20 14:00:00', reportType: 3, location: 'G94珠三角环线K180+500', sceneInfo: '检测完成，伸缩缝正常，无需维修', status: 1, createTime: '2026-07-20 14:00:00' },
  { id: 29, accidentName: 'G45大广高速韶关段边坡滑塌', reportTime: '2026-07-23 08:00:00', reportType: 3, location: 'G45大广高速K3200+100', sceneInfo: '清理完毕，交通全面恢复', status: 1, createTime: '2026-07-23 08:00:00' },
  { id: 30, accidentName: 'S303省道梅州段山体落石', reportTime: '2026-07-23 10:00:00', reportType: 3, location: 'S303省道K78+400', sceneInfo: '清理完毕，交通全面恢复', status: 0, createTime: '2026-07-23 10:00:00' },
]
