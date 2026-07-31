/** 套组装备明细 */
export interface EquipmentSetItem {
  /** 设备物资名称 */
  equipmentName: string
  /** 类别 */
  category: string
  /** 单位 */
  unit: string
  /** 数量 */
  quantity: number
}

/** 装备套组 */
export interface EquipmentSet {
  /** 套组ID */
  setId: string
  /** 套组名称 */
  setName: string
  /** 关联装备（拼接展示） */
  equipmentDesc: string
  /** 套组装备明细 */
  equipmentItems: EquipmentSetItem[]
  /** 启用状态: 1-已启用 0-未启用 */
  status: number
  /** 创建人 */
  createBy: string
  /** 创建日期 */
  createTime: string
  /** 最近修改日期 */
  updateTime: string
  /** 备注 */
  remark: string
}

/** 装备套组搜索表单 */
export interface EquipmentSetSearchForm {
  /** 套组名称 */
  setName: string
  /** 启用状态: 1-已启用 0-未启用 空-全部 */
  status: number | ''
}

/** 装备套组新增/编辑表单 */
export interface EquipmentSetForm {
  /** 套组名称 */
  setName: string
  /** 启用状态: 1-正常 0-失效 */
  status: number
  /** 备注 */
  remark: string
  /** 套组装备明细 */
  equipmentItems: EquipmentSetItem[]
}
