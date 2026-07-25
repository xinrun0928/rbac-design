/**
 * 农历计算工具
 * 基于查表法实现公历→农历转换
 */

// 农历月份名称
const LUNAR_MONTH_CN = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月']

// 农历日期名称
const LUNAR_DAY_CN = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
]

// 天干
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
// 地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
// 生肖
const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

// 农历数据表 (1900-2100)
// 每个元素存储该年农历的月份大小信息和闰月月份
// 高16位: 闰月月份(0表示无闰月), 低16位: 1-12月每月天数(1=30天,0=29天)
const LUNAR_INFO: number[] = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x16a95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
  0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a4d0, 0x0d150, 0x0f252,
  0x0d520,
]

// 每年农历正月初一对应的公历日期偏移量（相对于1900年1月31日）
const LUNAR_YEAR_START = 1900
const BASE_DATE = new Date(1900, 0, 31) // 1900年正月初一

/**
 * 获取农历年的总天数
 */
function lunarYearDays(year: number): number {
  let sum = 348 // 12个月最少29天 * 12 = 348
  const info = LUNAR_INFO[year - LUNAR_YEAR_START]
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (info & i) ? 1 : 0
  }
  return sum + leapDays(year)
}

/**
 * 获取农历年闰月的天数
 */
function leapDays(year: number): number {
  if (leapMonth(year)) {
    const info = LUNAR_INFO[year - LUNAR_YEAR_START]
    return (info & 0x10000) ? 30 : 29
  }
  return 0
}

/**
 * 获取农历年闰月月份 (0表示无闰月)
 */
function leapMonth(year: number): number {
  return LUNAR_INFO[year - LUNAR_YEAR_START] >> 16
}

/**
 * 获取农历某月的天数
 */
function lunarMonthDays(year: number, month: number): number {
  const info = LUNAR_INFO[year - LUNAR_YEAR_START]
  return (info & (0x10000 >> month)) ? 30 : 29
}

/**
 * 公历日期转农历
 * @param date 公历日期
 * @returns { year, month, day, isLeapMonth, monthCn, dayCn }
 */
export function solarToLunar(date: Date): {
  year: number
  month: number
  day: number
  isLeapMonth: boolean
  monthCn: string
  dayCn: string
  yearCn: string
  zodiac: string
} {
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const offset = Math.floor((targetDate.getTime() - BASE_DATE.getTime()) / 86400000)

  // 确定农历年份
  let lunarYear = LUNAR_YEAR_START
  let daysInYear = lunarYearDays(lunarYear)
  let offsetLeft = offset

  while (offsetLeft >= daysInYear) {
    offsetLeft -= daysInYear
    lunarYear++
    daysInYear = lunarYearDays(lunarYear)
  }

  // 确定农历月份
  const leap = leapMonth(lunarYear)
  let isLeapMonth = false
  let lunarMonth = 1
  let daysInMonth = 0

  for (let i = 1; i <= 13; i++) {
    if (leap > 0 && i === leap + 1 && !isLeapMonth) {
      // 闰月
      daysInMonth = leapDays(lunarYear)
      isLeapMonth = true
      i-- // 月份不递增
    } else {
      daysInMonth = lunarMonthDays(lunarYear, lunarMonth)
      isLeapMonth = false
    }

    if (offsetLeft < daysInMonth) break

    offsetLeft -= daysInMonth

    if (!isLeapMonth) {
      lunarMonth++
    }
  }

  const lunarDay = offsetLeft + 1

  // 天干地支纪年
  const ganIndex = (lunarYear - 4) % 10
  const zhiIndex = (lunarYear - 4) % 12
  const yearCn = TIAN_GAN[ganIndex] + DI_ZHI[zhiIndex]
  const zodiac = SHENG_XIAO[zhiIndex]

  // 月份名称
  const monthCn = (isLeapMonth ? '闰' : '') + LUNAR_MONTH_CN[lunarMonth - 1]
  const dayCn = LUNAR_DAY_CN[lunarDay - 1]

  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    isLeapMonth,
    monthCn,
    dayCn,
    yearCn,
    zodiac
  }
}

/**
 * 格式化农历为中文字符串（月+日）
 * @param date 公历日期
 * @returns 如 "正月初一"
 */
export function formatLunarDate(date: Date): string {
  const lunar = solarToLunar(date)
  return `${lunar.monthCn}${lunar.dayCn}`
}
