import type { DictData, DictType } from '../types/dictData'

export const dictDataList: DictData[] = [
  { dictId: 100000000000, dictType: 'flood_fail_reason_type', dictLabel: '其他', dictValue: '1', dictCode: 'fail_reason_other', displayOrder: 1, dictClass: '', isDefault: 0, status: 1101, remark: '未达标原因类型-其他', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:35', deleted: 0, signature: null, signatureVersion: 0 },
  { dictId: 100000000007, dictType: 'flood_fail_reason_type', dictLabel: '没网', dictValue: '2', dictCode: 'fail_reason_no_network', displayOrder: 2, dictClass: '', isDefault: 0, status: 1101, remark: '未达标原因类型-没网', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:35', deleted: 0, signature: null, signatureVersion: 0 },
  { dictId: 100000000014, dictType: 'flood_fail_reason_type', dictLabel: '没电', dictValue: '3', dictCode: 'fail_reason_no_power', displayOrder: 3, dictClass: '', isDefault: 0, status: 1101, remark: '未达标原因类型-没电', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:35', deleted: 0, signature: null, signatureVersion: 0 },

  { dictId: 100000000021, dictType: 'org_area_level', dictLabel: '省级', dictValue: '1', dictCode: 'area_level_province', displayOrder: 1, dictClass: '', isDefault: 0, status: 1101, remark: '区域级别-省级', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:39', deleted: 0, signature: null, signatureVersion: 0 },
  { dictId: 100000000028, dictType: 'org_area_level', dictLabel: '市级', dictValue: '2', dictCode: 'area_level_city', displayOrder: 2, dictClass: '', isDefault: 0, status: 1101, remark: '区域级别-市级', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:39', deleted: 0, signature: null, signatureVersion: 0 },
  { dictId: 100000000035, dictType: 'org_area_level', dictLabel: '区级', dictValue: '3', dictCode: 'area_level_district', displayOrder: 3, dictClass: '', isDefault: 0, status: 1101, remark: '区域级别-区级', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:39', deleted: 0, signature: null, signatureVersion: 0 },
  { dictId: 100000000042, dictType: 'org_area_level', dictLabel: '乡镇级', dictValue: '4', dictCode: 'area_level_township', displayOrder: 4, dictClass: '', isDefault: 0, status: 1101, remark: '区域级别-乡镇级', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:39', deleted: 0, signature: null, signatureVersion: 0 },

  { dictId: 100000000049, dictType: 'flood_highway_element', dictLabel: '路基', dictValue: '1', dictCode: 'element_subgrade', displayOrder: 1, dictClass: '', isDefault: 0, status: 1101, remark: '公路要素-路基', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:43', deleted: 0, signature: null, signatureVersion: 0 },
  { dictId: 100000000056, dictType: 'flood_highway_element', dictLabel: '路面', dictValue: '2', dictCode: 'element_pavement', displayOrder: 2, dictClass: '', isDefault: 0, status: 1101, remark: '公路要素-路面', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:43', deleted: 0, signature: null, signatureVersion: 0 },
  { dictId: 100000000063, dictType: 'flood_highway_element', dictLabel: '边坡', dictValue: '3', dictCode: 'element_slope', displayOrder: 3, dictClass: '', isDefault: 0, status: 1101, remark: '公路要素-边坡', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:43', deleted: 0, signature: null, signatureVersion: 0 },
  { dictId: 100000000070, dictType: 'flood_highway_element', dictLabel: '桥梁', dictValue: '4', dictCode: 'element_bridge', displayOrder: 4, dictClass: '', isDefault: 0, status: 1101, remark: '公路要素-桥梁', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:43', deleted: 0, signature: null, signatureVersion: 0 },
  { dictId: 100000000077, dictType: 'flood_highway_element', dictLabel: '隧道', dictValue: '5', dictCode: 'element_tunnel', displayOrder: 5, dictClass: '', isDefault: 0, status: 1101, remark: '公路要素-隧道', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:43', deleted: 0, signature: null, signatureVersion: 0 },
  { dictId: 100000000084, dictType: 'flood_highway_element', dictLabel: '交安设施', dictValue: '6', dictCode: 'element_traffic_facility', displayOrder: 6, dictClass: '', isDefault: 0, status: 1101, remark: '公路要素-交安设施', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:43', deleted: 0, signature: null, signatureVersion: 0 },
  { dictId: 100000000091, dictType: 'flood_highway_element', dictLabel: '无异常', dictValue: '7', dictCode: 'element_no_anomaly', displayOrder: 7, dictClass: '', isDefault: 0, status: 1101, remark: '公路要素-无异常', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:43', deleted: 0, signature: null, signatureVersion: 0 },

  { dictId: 100000000098, dictType: 'highway_grade', dictLabel: '高速公路', dictValue: '1', dictCode: 'grade_expressway', displayOrder: 1, dictClass: '', isDefault: 0, status: 1101, remark: '公路等级-高速公路', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:43', deleted: 0, signature: null, signatureVersion: 0 },
  { dictId: 100000000105, dictType: 'highway_grade', dictLabel: '一级公路', dictValue: '2', dictCode: 'grade_first_class', displayOrder: 2, dictClass: '', isDefault: 0, status: 1101, remark: '公路等级-一级公路', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:43', deleted: 0, signature: null, signatureVersion: 0 },
  { dictId: 100000000112, dictType: 'highway_grade', dictLabel: '二级公路', dictValue: '3', dictCode: 'grade_second_class', displayOrder: 3, dictClass: '', isDefault: 0, status: 1101, remark: '公路等级-二级公路', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:43', deleted: 0, signature: null, signatureVersion: 0 },
  { dictId: 100000000119, dictType: 'highway_grade', dictLabel: '三级公路', dictValue: '4', dictCode: 'grade_third_class', displayOrder: 4, dictClass: '', isDefault: 0, status: 1101, remark: '公路等级-三级公路', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:43', deleted: 0, signature: null, signatureVersion: 0 },
  { dictId: 100000000126, dictType: 'highway_grade', dictLabel: '四级公路', dictValue: '5', dictCode: 'grade_fourth_class', displayOrder: 5, dictClass: '', isDefault: 0, status: 1101, remark: '公路等级-四级公路', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:43', deleted: 0, signature: null, signatureVersion: 0 },
  { dictId: 100000000133, dictType: 'highway_grade', dictLabel: '等外公路', dictValue: '6', dictCode: 'grade_substandard', displayOrder: 6, dictClass: '', isDefault: 0, status: 1101, remark: '公路等级-等外公路', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:43', deleted: 0, signature: null, signatureVersion: 0 },

  { dictId: 100000000140, dictType: 'flood_task_type', dictLabel: '高速公路', dictValue: '1', dictCode: 'task_type_highway', displayOrder: 1, dictClass: '', isDefault: 0, status: 1101, remark: '任务类型-高速公路', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:43', deleted: 0, signature: null, signatureVersion: 0 },
  { dictId: 100000000147, dictType: 'flood_task_type', dictLabel: '普通公路', dictValue: '2', dictCode: 'task_type_provincial', displayOrder: 2, dictClass: '', isDefault: 0, status: 1101, remark: '任务类型-普通公路', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:43', deleted: 0, signature: null, signatureVersion: 0 },

  { dictId: 100000000154, dictType: 'flood_warning_category', dictLabel: '气象灾害', dictValue: '1', dictCode: 'warning_meteorological', displayOrder: 1, dictClass: '', isDefault: 0, status: 1101, remark: '预警分类-气象灾害', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:43', deleted: 0, signature: null, signatureVersion: 0 },
  { dictId: 100000000161, dictType: 'flood_warning_category', dictLabel: '山洪灾害', dictValue: '2', dictCode: 'warning_flash_flood', displayOrder: 2, dictClass: '', isDefault: 0, status: 1101, remark: '预警分类-山洪灾害', creater: '系统管理员1号', updater: null, createTime: '2026-07-01 09:30:00', updateTime: '2026-07-01 01:34:43', deleted: 0, signature: null, signatureVersion: 0 }
]

// 字典类型名称映射
export const dictTypeNames: Record<string, string> = {
  'flood_fail_reason_type': '未达标原因类型',
  'org_area_level': '区域级别',
  'flood_highway_element': '公路要素',
  'highway_grade': '公路等级',
  'flood_task_type': '任务类型',
  'flood_warning_category': '预警分类'
}

export function getDictTypes(): DictType[] {
  const typeMap = new Map<string, DictType>()
  const activeData = dictDataList.filter(d => d.deleted === 0)

  for (const item of activeData) {
    if (!typeMap.has(item.dictType)) {
      typeMap.set(item.dictType, {
        dictType: item.dictType,
        dictTypeName: dictTypeNames[item.dictType] || item.dictType,
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
