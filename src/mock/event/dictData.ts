import type { EventDictData, EventDictType } from '@/types/event/dict'

/** 事件管理 - 字典数据 Mock 数据 */
export const mockEventDictDataList: EventDictData[] = [
  // ── 事故类型 ──
  { dictId: 1, dictType: 'event_accident_type', dictLabel: '自然灾害类', dictValue: '1', dictCode: 'accident_natural', displayOrder: 1, isDefault: 0, status: 1101, remark: '自然灾害类事故', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 2, dictType: 'event_accident_type', dictLabel: '交通事故类', dictValue: '2', dictCode: 'accident_traffic', displayOrder: 2, isDefault: 0, status: 1101, remark: '交通事故类事故', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 3, dictType: 'event_accident_type', dictLabel: '道路阻断类', dictValue: '3', dictCode: 'accident_road_block', displayOrder: 3, isDefault: 0, status: 1101, remark: '道路阻断类事故', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 4, dictType: 'event_accident_type', dictLabel: '设施设备类', dictValue: '4', dictCode: 'accident_facility', displayOrder: 4, isDefault: 0, status: 1101, remark: '设施设备类事故', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 5, dictType: 'event_accident_type', dictLabel: '公共安全类', dictValue: '5', dictCode: 'accident_public_safety', displayOrder: 5, isDefault: 0, status: 1101, remark: '公共安全类事故', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 6, dictType: 'event_accident_type', dictLabel: '运营管理类', dictValue: '6', dictCode: 'accident_operation', displayOrder: 6, isDefault: 0, status: 1101, remark: '运营管理类事故', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 7, dictType: 'event_accident_type', dictLabel: '应急处置类', dictValue: '7', dictCode: 'accident_emergency', displayOrder: 7, isDefault: 0, status: 1101, remark: '应急处置类事故', createTime: '2026-07-01 09:00:00', deleted: 0 },

  // ── 路段敏感度 ──
  { dictId: 20, dictType: 'event_road_sensitivity', dictLabel: '高敏感', dictValue: '1', dictCode: 'sensitivity_high', displayOrder: 1, isDefault: 0, status: 1101, remark: '高敏感路段：城市核心区、主干道、交通枢纽', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 21, dictType: 'event_road_sensitivity', dictLabel: '中敏感', dictValue: '2', dictCode: 'sensitivity_medium', displayOrder: 2, isDefault: 1, status: 1101, remark: '中敏感路段：次干道、一般公路', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 22, dictType: 'event_road_sensitivity', dictLabel: '低敏感', dictValue: '3', dictCode: 'sensitivity_low', displayOrder: 3, isDefault: 0, status: 1101, remark: '低敏感路段：偏远地区、支线道路', createTime: '2026-07-01 09:00:00', deleted: 0 },

  // ── 发生时间 ──
  { dictId: 30, dictType: 'event_occurrence_time', dictLabel: '工作日白天', dictValue: '1', dictCode: 'time_workday_day', displayOrder: 1, isDefault: 0, status: 1101, remark: '工作日 08:00-18:00', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 31, dictType: 'event_occurrence_time', dictLabel: '工作日夜间', dictValue: '2', dictCode: 'time_workday_night', displayOrder: 2, isDefault: 0, status: 1101, remark: '工作日 18:00-次日08:00', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 32, dictType: 'event_occurrence_time', dictLabel: '节假日白天', dictValue: '3', dictCode: 'time_holiday_day', displayOrder: 3, isDefault: 0, status: 1101, remark: '节假日 08:00-18:00', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 33, dictType: 'event_occurrence_time', dictLabel: '节假日夜间', dictValue: '4', dictCode: 'time_holiday_night', displayOrder: 4, isDefault: 0, status: 1101, remark: '节假日 18:00-次日08:00', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 34, dictType: 'event_occurrence_time', dictLabel: '凌晨时段', dictValue: '5', dictCode: 'time_dawn', displayOrder: 5, isDefault: 1, status: 1101, remark: '00:00-06:00 高危时段', createTime: '2026-07-01 09:00:00', deleted: 0 },

  // ── 影响范围 ──
  { dictId: 40, dictType: 'event_impact_scope', dictLabel: '单点', dictValue: '1', dictCode: 'scope_single', displayOrder: 1, isDefault: 0, status: 1101, remark: '单个点位受影响', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 41, dictType: 'event_impact_scope', dictLabel: '局部路段', dictValue: '2', dictCode: 'scope_partial', displayOrder: 2, isDefault: 1, status: 1101, remark: '局部路段受影响', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 42, dictType: 'event_impact_scope', dictLabel: '多个路段', dictValue: '3', dictCode: 'scope_multi', displayOrder: 3, isDefault: 0, status: 1101, remark: '多个路段受影响', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 43, dictType: 'event_impact_scope', dictLabel: '区域性', dictValue: '4', dictCode: 'scope_regional', displayOrder: 4, isDefault: 0, status: 1101, remark: '区域性大范围受影响', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 44, dictType: 'event_impact_scope', dictLabel: '全线', dictValue: '5', dictCode: 'scope_all', displayOrder: 5, isDefault: 0, status: 1101, remark: '全线受影响', createTime: '2026-07-01 09:00:00', deleted: 0 },

  // ── 紧急程度 ──
  { dictId: 50, dictType: 'event_urgency_level', dictLabel: '特别紧急', dictValue: '1', dictCode: 'urgency_critical', displayOrder: 1, isDefault: 0, status: 1101, remark: '特别紧急：需立即响应处置', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 51, dictType: 'event_urgency_level', dictLabel: '紧急', dictValue: '2', dictCode: 'urgency_high', displayOrder: 2, isDefault: 0, status: 1101, remark: '紧急：需尽快响应处置', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 52, dictType: 'event_urgency_level', dictLabel: '较紧急', dictValue: '3', dictCode: 'urgency_medium', displayOrder: 3, isDefault: 0, status: 1101, remark: '较紧急：需及时响应处置', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 53, dictType: 'event_urgency_level', dictLabel: '一般', dictValue: '4', dictCode: 'urgency_low', displayOrder: 4, isDefault: 1, status: 1101, remark: '一般：按常规流程处置', createTime: '2026-07-01 09:00:00', deleted: 0 },

  // ── 告警等级 ──
  { dictId: 60, dictType: 'event_alarm_level', dictLabel: '红色预警', dictValue: '1', dictCode: 'alarm_red', displayOrder: 1, isDefault: 0, status: 1101, remark: 'Ⅰ级：特别严重', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 61, dictType: 'event_alarm_level', dictLabel: '橙色预警', dictValue: '2', dictCode: 'alarm_orange', displayOrder: 2, isDefault: 0, status: 1101, remark: 'Ⅱ级：严重', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 62, dictType: 'event_alarm_level', dictLabel: '黄色预警', dictValue: '3', dictCode: 'alarm_yellow', displayOrder: 3, isDefault: 0, status: 1101, remark: 'Ⅲ级：较重', createTime: '2026-07-01 09:00:00', deleted: 0 },
  { dictId: 63, dictType: 'event_alarm_level', dictLabel: '蓝色预警', dictValue: '4', dictCode: 'alarm_blue', displayOrder: 4, isDefault: 1, status: 1101, remark: 'Ⅳ级：一般', createTime: '2026-07-01 09:00:00', deleted: 0 },
]

// 字典类型名称映射
export const eventDictTypeNames: Record<string, string> = {
  'event_accident_type': '事故类型',
  'event_road_sensitivity': '路段敏感度',
  'event_occurrence_time': '发生时间',
  'event_impact_scope': '影响范围',
  'event_urgency_level': '紧急程度',
  'event_alarm_level': '告警等级'
}

/** 获取字典类型列表 */
export function getEventDictTypes(): EventDictType[] {
  const typeMap = new Map<string, EventDictType>()
  const activeData = mockEventDictDataList.filter(d => d.deleted === 0)

  for (const item of activeData) {
    if (!typeMap.has(item.dictType)) {
      typeMap.set(item.dictType, {
        dictType: item.dictType,
        dictTypeName: eventDictTypeNames[item.dictType] || item.dictType,
        count: 0,
        remark: item.remark || '',
        status: 1101,
        createTime: item.createTime
      })
    }
    const type = typeMap.get(item.dictType)!
    type.count++
  }

  return Array.from(typeMap.values())
}

/** 获取指定类型的字典数据 */
export function getEventDictDataByType(dictType: string): EventDictData[] {
  return mockEventDictDataList.filter(d => d.dictType === dictType && d.deleted === 0)
}
