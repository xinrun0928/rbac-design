import type { Holiday } from '@/types/duty/holiday'

/**
 * 节假日数据
 * 包含2023-2026年法定节假日
 */
export const holidayData: Holiday[] = [
  // ── 2026年 ──
  { id: 1, holidayName: '元旦', startDate: '2026-01-01', endDate: '2026-01-03', remark: '法定节假日，共3天', createTime: '2026-01-01 00:00:00' },
  { id: 2, holidayName: '春节', startDate: '2026-02-15', endDate: '2026-02-23', remark: '法定节假日，共9天', createTime: '2026-02-15 00:00:00' },
  { id: 3, holidayName: '清明节', startDate: '2026-04-04', endDate: '2026-04-06', remark: '法定节假日，共3天', createTime: '2026-04-04 00:00:00' },
  { id: 4, holidayName: '劳动节', startDate: '2026-05-01', endDate: '2026-05-05', remark: '法定节假日，共5天', createTime: '2026-05-01 00:00:00' },
  { id: 5, holidayName: '端午节', startDate: '2026-06-19', endDate: '2026-06-21', remark: '法定节假日，共3天', createTime: '2026-06-19 00:00:00' },
  { id: 6, holidayName: '中秋节', startDate: '2026-09-25', endDate: '2026-09-27', remark: '法定节假日，共3天', createTime: '2026-09-25 00:00:00' },
  { id: 7, holidayName: '国庆节', startDate: '2026-10-01', endDate: '2026-10-07', remark: '法定节假日，共7天', createTime: '2026-10-01 00:00:00' },

  // ── 2025年 ──
  { id: 8, holidayName: '元旦', startDate: '2025-01-01', endDate: '2025-01-01', remark: '法定节假日，共1天', createTime: '2025-01-01 00:00:00' },
  { id: 9, holidayName: '春节', startDate: '2025-01-28', endDate: '2025-02-04', remark: '法定节假日，共8天', createTime: '2025-01-28 00:00:00' },
  { id: 10, holidayName: '清明节', startDate: '2025-04-04', endDate: '2025-04-06', remark: '法定节假日，共3天', createTime: '2025-04-04 00:00:00' },
  { id: 11, holidayName: '劳动节', startDate: '2025-05-01', endDate: '2025-05-05', remark: '法定节假日，共5天', createTime: '2025-05-01 00:00:00' },
  { id: 12, holidayName: '端午节', startDate: '2025-05-31', endDate: '2025-06-02', remark: '法定节假日，共3天', createTime: '2025-05-31 00:00:00' },
  { id: 13, holidayName: '国庆节、中秋节', startDate: '2025-10-01', endDate: '2025-10-08', remark: '法定节假日，共8天（国庆、中秋合并放假）', createTime: '2025-10-01 00:00:00' },

  // ── 2024年 ──
  { id: 14, holidayName: '元旦', startDate: '2024-01-01', endDate: '2024-01-01', remark: '法定节假日，共1天（与周末连休）', createTime: '2024-01-01 00:00:00' },
  { id: 15, holidayName: '春节', startDate: '2024-02-10', endDate: '2024-02-17', remark: '法定节假日，共8天', createTime: '2024-02-10 00:00:00' },
  { id: 16, holidayName: '清明节', startDate: '2024-04-04', endDate: '2024-04-06', remark: '法定节假日，共3天', createTime: '2024-04-04 00:00:00' },
  { id: 17, holidayName: '劳动节', startDate: '2024-05-01', endDate: '2024-05-05', remark: '法定节假日，共5天', createTime: '2024-05-01 00:00:00' },
  { id: 18, holidayName: '端午节', startDate: '2024-06-10', endDate: '2024-06-10', remark: '法定节假日，共1天（与周末连休）', createTime: '2024-06-10 00:00:00' },
  { id: 19, holidayName: '中秋节', startDate: '2024-09-15', endDate: '2024-09-17', remark: '法定节假日，共3天', createTime: '2024-09-15 00:00:00' },
  { id: 20, holidayName: '国庆节', startDate: '2024-10-01', endDate: '2024-10-07', remark: '法定节假日，共7天', createTime: '2024-10-01 00:00:00' },

  // ── 2023年 ──
  { id: 21, holidayName: '元旦', startDate: '2022-12-31', endDate: '2023-01-02', remark: '法定节假日，共3天', createTime: '2022-12-31 00:00:00' },
  { id: 22, holidayName: '春节', startDate: '2023-01-21', endDate: '2023-01-27', remark: '法定节假日，共7天', createTime: '2023-01-21 00:00:00' },
  { id: 23, holidayName: '清明节', startDate: '2023-04-05', endDate: '2023-04-05', remark: '法定节假日，共1天', createTime: '2023-04-05 00:00:00' },
  { id: 24, holidayName: '劳动节', startDate: '2023-04-29', endDate: '2023-05-03', remark: '法定节假日，共5天', createTime: '2023-04-29 00:00:00' },
  { id: 25, holidayName: '端午节', startDate: '2023-06-22', endDate: '2023-06-24', remark: '法定节假日，共3天', createTime: '2023-06-22 00:00:00' },
  { id: 26, holidayName: '中秋节、国庆节', startDate: '2023-09-29', endDate: '2023-10-06', remark: '法定节假日，共8天（中秋、国庆合并放假）', createTime: '2023-09-29 00:00:00' },
]
