import { mockMenuData } from '@/mock/menuData'
import type { Menu, MenuSearchForm } from '@/types/menu'

/** 模拟网络延迟 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/** 格式化当前时间 */
function formatNow(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/** 构建树形结构 */
export function buildMenuTree(menus: Menu[], parentId: number = 0): Menu[] {
  return menus
    .filter(item => item.parentId === parentId && item.deleted === 0)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(item => {
      const children = buildMenuTree(menus, item.menuId)
      const result: Menu = { ...item }
      if (children.length > 0) {
        result.children = children
      }
      return result
    })
}

/** 获取子系统下的菜单树 */
export async function getMenuTreeBySubsystem(subsysId: number): Promise<Menu[]> {
  await delay(200 + Math.random() * 300)

  const filteredData = mockMenuData.filter(item => item.subsysId === subsysId && item.deleted === 0)
  return buildMenuTree(filteredData, 0)
}

/** 获取所有菜单列表（平铺） */
export async function getMenus(params: {
  subsysId: number
  search?: MenuSearchForm
}): Promise<Menu[]> {
  await delay(200 + Math.random() * 300)

  let data = mockMenuData.filter(item => item.subsysId === params.subsysId && item.deleted === 0)

  if (params.search?.menuName) {
    const keyword = params.search.menuName.trim().toLowerCase()
    data = data.filter(item => item.menuName.toLowerCase().includes(keyword))
  }

  if (params.search?.menuCode) {
    const keyword = params.search.menuCode.trim().toLowerCase()
    data = data.filter(item => item.menuCode.toLowerCase().includes(keyword))
  }

  if (params.search?.status !== undefined && params.search.status !== '') {
    data = data.filter(item => item.status === params.search!.status)
  }

  return buildMenuTree(data, 0)
}

/** 新增菜单 */
export async function addMenu(data: {
  parentId: number
  menuName: string
  menuCode: string
  menuType: number
  contentType: number
  subsysId: number
  icon: string
  path: string
  component: string
  displayOrder: number
  status: number
  remark: string
  ext: string
  hidden: number
}): Promise<Menu> {
  await delay(400 + Math.random() * 300)

  const maxId = mockMenuData.reduce((max, p) => Math.max(max, p.menuId), 0)

  const newMenu: Menu = {
    menuId: maxId + 1,
    parentId: data.parentId,
    menuName: data.menuName,
    menuCode: data.menuCode.toUpperCase(),
    menuType: data.menuType,
    contentType: data.contentType,
    subsysId: data.subsysId,
    icon: data.icon,
    path: data.path,
    component: data.component,
    displayOrder: data.displayOrder,
    status: data.status,
    remark: data.remark,
    ext: data.ext,
    hidden: data.hidden,
    creater: '当前用户',
    createTime: formatNow(),
    updater: '',
    updateTime: formatNow(),
    deleted: 0,
    signature: '',
    signatureVersion: 0
  }

  mockMenuData.push(newMenu)
  return newMenu
}

/** 编辑菜单 */
export async function updateMenu(
  id: number,
  data: {
    parentId: number
    menuName: string
    menuCode: string
    menuType: number
    contentType: number
    subsysId: number
    icon: string
    path: string
    component: string
    displayOrder: number
    status: number
    remark: string
    ext: string
    hidden: number
  }
): Promise<Menu> {
  await delay(400 + Math.random() * 300)

  const index = mockMenuData.findIndex(p => p.menuId === id)
  if (index === -1) {
    throw new Error('菜单不存在')
  }

  const updated: Menu = {
    ...mockMenuData[index],
    parentId: data.parentId,
    menuName: data.menuName,
    menuCode: data.menuCode.toUpperCase(),
    menuType: data.menuType,
    contentType: data.contentType,
    icon: data.icon,
    path: data.path,
    component: data.component,
    displayOrder: data.displayOrder,
    status: data.status,
    remark: data.remark,
    ext: data.ext,
    hidden: data.hidden,
    updater: '当前用户',
    updateTime: formatNow()
  }

  mockMenuData[index] = updated
  return updated
}

/** 删除菜单（逻辑删除） */
export async function deleteMenu(id: number): Promise<void> {
  await delay(400 + Math.random() * 300)

  const index = mockMenuData.findIndex(p => p.menuId === id)
  if (index === -1) {
    throw new Error('菜单不存在')
  }

  mockMenuData[index].deleted = 1

  // 同时删除所有子菜单
  const deleteChildren = (parentId: number) => {
    mockMenuData.forEach((item, idx) => {
      if (item.parentId === parentId && item.deleted === 0) {
        mockMenuData[idx].deleted = 1
        deleteChildren(item.menuId)
      }
    })
  }
  deleteChildren(id)
}

/** 批量删除菜单 */
export async function batchDeleteMenus(ids: number[]): Promise<void> {
  await delay(600 + Math.random() * 400)

  ids.forEach(id => {
    const index = mockMenuData.findIndex(p => p.menuId === id)
    if (index !== -1) {
      mockMenuData[index].deleted = 1

      // 同时删除所有子菜单
      const deleteChildren = (parentId: number) => {
        mockMenuData.forEach((item, idx) => {
          if (item.parentId === parentId && item.deleted === 0) {
            mockMenuData[idx].deleted = 1
            deleteChildren(item.menuId)
          }
        })
      }
      deleteChildren(id)
    }
  })
}

/** 切换菜单状态 */
export async function toggleMenuStatus(id: number, status: number): Promise<Menu> {
  await delay(300 + Math.random() * 200)

  const index = mockMenuData.findIndex(p => p.menuId === id)
  if (index === -1) {
    throw new Error('菜单不存在')
  }

  mockMenuData[index].status = status
  mockMenuData[index].updater = '当前用户'
  mockMenuData[index].updateTime = formatNow()

  return mockMenuData[index]
}
