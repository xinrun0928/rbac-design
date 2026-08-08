export interface ExportRecord {
  id: number
  fileName: string
  fileType: string
  fileSize: string
  exportTime: string
  exportUser: string
  status: 'success' | 'failed' | 'pending'
}

export const exportData: ExportRecord[] = [
  {
    id: 1,
    fileName: '台风数据_20260424.xlsx',
    fileType: 'Excel',
    fileSize: '2.3MB',
    exportTime: '2026-04-24 09:20:00',
    exportUser: '管理员',
    status: 'success'
  },
  {
    id: 2,
    fileName: '降雨量数据_20260424.xlsx',
    fileType: 'Excel',
    fileSize: '1.8MB',
    exportTime: '2026-04-24 09:15:00',
    exportUser: '操作员A',
    status: 'success'
  },
  {
    id: 3,
    fileName: '路段信息_20260424.xlsx',
    fileType: 'Excel',
    fileSize: '3.5MB',
    exportTime: '2026-04-24 09:10:00',
    exportUser: '管理员',
    status: 'success'
  },
  {
    id: 4,
    fileName: '收费站数据_20260424.xlsx',
    fileType: 'Excel',
    fileSize: '1.2MB',
    exportTime: '2026-04-24 09:05:00',
    exportUser: '操作员B',
    status: 'success'
  },
  {
    id: 5,
    fileName: '服务区信息_20260424.xlsx',
    fileType: 'Excel',
    fileSize: '0.9MB',
    exportTime: '2026-04-24 09:00:00',
    exportUser: '管理员',
    status: 'success'
  }
]
