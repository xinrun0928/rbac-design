<template>
  <div class="menu-management">
    <div class="main-container animate-item">
      <!-- 左侧子系统列表 -->
      <div class="left-panel" :class="{ collapsed: leftPanelCollapsed }">
        <div class="panel-header">
          <span v-if="!leftPanelCollapsed" class="panel-title">子系统列表</span>
          <el-button
            :icon="leftPanelCollapsed ? DArrowRight : DArrowLeft"
            link
            @click="leftPanelCollapsed = !leftPanelCollapsed"
            class="collapse-btn"
          />
        </div>
        <div class="subsystem-list">
          <div
            v-for="sub in subsystems"
            :key="sub.subsystemId"
            class="subsystem-item"
            :class="{ active: selectedSubsystem === sub.subsystemId }"
            @click="selectSubsystem(sub.subsystemId)"
          >
            <el-tooltip
              :content="sub.subsystemName"
              placement="right"
              :disabled="!leftPanelCollapsed"
            >
              <div class="subsystem-icon-wrapper">
                <div
                  class="subsystem-icon"
                  :style="{ background: getSubsystemIconStyle(sub.subsystemId).bg }"
                >
                  <el-icon :color="getSubsystemIconStyle(sub.subsystemId).color">
                    <component :is="getSubsystemIconStyle(sub.subsystemId).icon" />
                  </el-icon>
                </div>
                <span v-if="leftPanelCollapsed" class="subsystem-abbr">
                  {{ sub.subsystemShortName?.slice(0, 2) || '未' }}
                </span>
              </div>
            </el-tooltip>
            <div v-if="!leftPanelCollapsed" class="subsystem-info">
              <div class="subsystem-name">{{ sub.subsystemShortName }}</div>
              <div class="subsystem-full-name">{{ sub.subsystemName }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧菜单树 -->
      <div class="right-panel">
        <div class="panel-header">
          <span class="panel-title">菜单列表 - {{ currentSubsystemName }}</span>
          <div class="panel-actions">
            <el-input
              v-model="searchForm.menuName"
              placeholder="搜索菜单名称"
              clearable
              :prefix-icon="Search"
              style="width: 180px; margin-right: 12px"
              @keyup.enter="handleSearch"
              @clear="handleSearch"
            />
            <el-button type="primary" :icon="Plus" @click="handleAdd(null)"
              >新增菜单</el-button
            >
          </div>
        </div>

        <!-- 搜索栏 -->
        <div
          class="search-bar"
          v-if="
            searchForm.menuName ||
            searchForm.menuCode ||
            searchForm.status !== ''
          "
        >
          <el-form :model="searchForm" inline>
            <el-form-item label="菜单编码">
              <el-input
                v-model="searchForm.menuCode"
                placeholder="输入编码"
                clearable
                style="width: 180px"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-select
                v-model="searchForm.status"
                placeholder="请选择"
                clearable
                style="width: 120px"
              >
                <el-option label="正常" :value="1101" />
                <el-option label="停用" :value="1102" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <!-- 菜单树表格 -->
        <div class="table-wrapper">
          <el-table
            v-loading="loading"
            :data="menuTreeData"
            row-key="menuId"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            :header-cell-style="{
              background: '#F5F7FA',
              color: '#606266',
              fontWeight: '600',
            }"
            border
            stripe
            default-expand-all
            :indent="24"
            empty-text=" "
          >
            <el-table-column
              prop="menuName"
              label="菜单名称"
              min-width="240"
              fixed
              align="center"
            >
              <template #default="{ row }">
                <div class="menu-name-cell">
                  <el-icon
                    v-if="row.icon"
                    class="menu-icon"
                    :color="getMenuTypeColor(row.menuType)"
                  >
                    <component :is="row.icon" />
                  </el-icon>
                  <span class="menu-name">{{ row.menuName }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="menuType"
              label="类型"
              width="80"
              align="center"
            >
              <template #default="{ row }">
                <el-tag
                  :color="MENU_TYPE_MAP[row.menuType]?.color"
                  effect="dark"
                  style="border: none; color: #fff"
                  round
                  size="small"
                >
                  {{ MENU_TYPE_MAP[row.menuType]?.label || "未知" }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="icon" label="图标" width="80" align="center">
              <template #default="{ row }">
                <div style="display: flex; justify-content: center;">
                  <el-icon
                    v-if="row.icon"
                    :size="18"
                    :color="getMenuTypeColor(row.menuType)"
                  >
                    <component :is="row.icon" />
                  </el-icon>
                  <span v-else class="empty-text">-</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="menuCode" label="权限标识" min-width="180" align="center" show-overflow-tooltip>
              <template #default="{ row }">
                <div v-if="row.menuCode" class="overflow-cell">
                  <span class="code-text">{{ row.menuCode }}</span>
                  <el-tooltip content="复制" placement="top">
                    <el-button
                      type="primary"
                      link
                      size="small"
                      @click.stop="handleCopy(row.menuCode)"
                    >
                      <el-icon><CopyDocument /></el-icon>
                    </el-button>
                  </el-tooltip>
                </div>
                <span v-else class="empty-text">-</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="contentType"
              label="内容类型"
              width="100"
              align="center"
            >
              <template #default="{ row }">
                <el-tag
                  :type="getContentTypeTagType(row.contentType)"
                  effect="plain"
                  size="small"
                >
                  {{ CONTENT_TYPE_MAP[row.contentType]?.label || "未知" }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="path" label="路由地址" min-width="180" align="center" show-overflow-tooltip>
              <template #default="{ row }">
                <span class="overflow-text" v-if="row.path">{{ row.path }}</span>
                <span class="empty-text" v-else>-</span>
              </template>
            </el-table-column>

            <el-table-column prop="component" label="组件路径" min-width="180" align="center" show-overflow-tooltip>
              <template #default="{ row }">
                <span class="overflow-text" v-if="row.component">{{ row.component }}</span>
                <span class="empty-text" v-else>-</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="displayOrder"
              label="排序"
              width="60"
              align="center"
            >
              <template #default="{ row }">
                <span class="sort-text">{{ row.displayOrder }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="hidden"
              label="可见"
              width="60"
              align="center"
            >
              <template #default="{ row }">
                <el-tag
                  :type="row.hidden === 1 ? 'info' : 'success'"
                  effect="plain"
                  size="small"
                >
                  {{ row.hidden === 1 ? "隐藏" : "显示" }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="ext" label="扩展字段" width="120" align="center">
              <template #default="{ row }">
                <el-popover v-if="row.ext" trigger="hover" width="300">
                  <template #reference>
                    <el-tag
                      type="info"
                      effect="plain"
                      size="small"
                      class="ext-tag"
                    >
                      JSON
                    </el-tag>
                  </template>
                  <div class="ext-content">
                    <pre>{{ formatJson(row.ext) }}</pre>
                  </div>
                </el-popover>
                <span v-else class="empty-text">-</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="status"
              label="状态"
              width="80"
              align="center"
            >
              <template #default="{ row }">
                <el-switch
                  :model-value="row.status"
                  :active-value="1101"
                  :inactive-value="1102"
                  inline-prompt
                  style="
                    --el-switch-on-color: #67c23a;
                    --el-switch-off-color: #909399;
                  "
                  @change="(val: number) => handleStatusChange(row, val)"
                />
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              width="200"
              align="center"
              fixed="right"
            >
              <template #default="{ row }">
                <el-button
                  type="primary"
                  link
                  size="small"
                  :icon="Plus"
                  @click.stop="handleAdd(row)"
                  >子菜单</el-button
                >
                <el-button
                  type="primary"
                  link
                  size="small"
                  :icon="Edit"
                  @click.stop="handleEdit(row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  link
                  size="small"
                  :icon="Delete"
                  @click.stop="handleDelete(row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 新增/编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="isEdit ? '编辑菜单' : '新增菜单'"
      size="520px"
      direction="rtl"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        label-position="right"
        class="menu-form"
      >
        <el-form-item label="上级菜单" prop="parentId">
          <el-tree-select
            v-model="formData.parentId"
            :data="parentMenuOptions"
            :props="{
              label: 'menuName',
              value: 'menuId',
              children: 'children',
            }"
            check-strictly
            :render-after-expand="false"
            placeholder="请选择上级菜单（不选则为顶级）"
            clearable
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="菜单类型" prop="menuType">
          <el-select
            v-model="formData.menuType"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in MENU_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="formData.menuName"
            placeholder="请输入菜单名称"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item v-if="formData.menuType === 2" label="权限标识" prop="menuCode">
          <el-input
            v-model="formData.menuCode"
            placeholder="如：SYSTEM_USER_ADD"
            maxlength="100"
            show-word-limit
          >
            <template #append>
              <el-tooltip content="将自动转为大写" placement="top">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="内容类型" prop="contentType">
          <el-select
            v-model="formData.contentType"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="(item, key) in CONTENT_TYPE_MAP"
              :key="key"
              :label="item.label"
              :value="Number(key)"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="菜单图标" prop="icon">
          <el-input
            v-model="formData.icon"
            placeholder="图标组件名称，如：Monitor"
            clearable
          />
        </el-form-item>

        <el-form-item label="路由地址" prop="path">
          <el-input
            v-model="formData.path"
            placeholder="如：/system/user"
            clearable
          />
        </el-form-item>

        <el-form-item label="组件路径" prop="component">
          <el-input
            v-model="formData.component"
            placeholder="如：views/system/UserManagement"
            clearable
          />
        </el-form-item>

        <el-form-item label="排序" prop="displayOrder">
          <el-input-number
            v-model="formData.displayOrder"
            :min="0"
            :max="999999"
            style="width: 200px"
          />
          <span class="form-tip-inline">数值越小越靠前</span>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1101">正常</el-radio>
            <el-radio :value="1102">停用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否隐藏" prop="hidden">
          <el-switch
            v-model="formData.hidden"
            :active-value="1"
            :inactive-value="0"
            active-text="隐藏"
            inactive-text="显示"
            inline-prompt
          />
        </el-form-item>

        <el-form-item label="扩展字段" prop="ext">
          <el-input
            v-model="formData.ext"
            type="textarea"
            :rows="3"
            placeholder='JSON格式，如：{"key": "value"}'
            clearable
          />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注信息"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="handleSubmit"
          >
            {{ isEdit ? "保存修改" : "确认创建" }}
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"
import {
  Refresh,
  Search,
  Plus,
  Delete,
  Edit,
  CopyDocument,
  QuestionFilled,
  Monitor,
  Bell,
  Document,
  Warning,
  Connection,
  Box,
  DataAnalysis,
  Share,
  Sunrise,
  Setting,
  Notebook,
  Calendar,
  Reading,
  Folder,
  VideoPlay,
  Grid,
  EditPen,
  ChatDotRound,
  List,
  Clock,
  Collection,
  Star,
  Location,
  PieChart,
  DataLine,
  User,
  Link,
  Sunny,
  SetUp,
  OfficeBuilding,
  HomeFilled,
  Tools,
  MapLocation,
  Position,
  Cpu,
  VideoCamera,
  DataBoard,
  DArrowLeft,
  DArrowRight,
} from "@element-plus/icons-vue"
import type { Menu, MenuForm, MenuSearchForm } from "@/types/admin/menu"
import { MENU_TYPE_MAP, MENU_TYPE_OPTIONS, CONTENT_TYPE_MAP } from "@/types/admin/menu"
import { mockSubsystemData } from "@/mock/admin/subsystemData"
import {
  getMenuTreeBySubsystem,
  addMenu,
  updateMenu,
  deleteMenu,
  toggleMenuStatus,
} from "@/utils/menuMockApi"

// ── 状态 ──
const loading = ref(false)
const submitLoading = ref(false)
const menuTreeData = ref<Menu[]>([])
const selectedSubsystem = ref<number>(1)
const drawerVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const leftPanelCollapsed = ref(true)

// 子系统列表（排除隐藏的）
const subsystems = mockSubsystemData.filter(
  sub => !sub.isHidden && true,
)

const currentSubsystemName = computed(() => {
  const sub = subsystems.find(s => s.subsystemId === selectedSubsystem.value)
  return sub ? sub.subsystemName : ""
})

const searchForm = reactive<MenuSearchForm>({
  menuName: "",
  menuCode: "",
  status: "",
})

const formData = reactive<MenuForm>({
  parentId: 0,
  menuName: "",
  menuCode: "",
  menuType: 0,
  contentType: 1,
  subsystemId: 99,
  icon: "",
  path: "",
  component: "",
  displayOrder: 0,
  status: 1101,
  remark: "",
  ext: "",
  hidden: 0,
})

// ── 表单验证规则 ──
const formRules: FormRules = {
  menuName: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  menuType: [{ required: true, message: "请选择菜单类型", trigger: "change" }],
  displayOrder: [{ required: true, message: "请输入排序值", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
}

// 父级菜单选项
const parentMenuOptions = computed(() => {
  const buildTree = (parentId: number): any[] => {
    return menuTreeData.value
      .filter(item => item.parentId === parentId && item.menuType !== 2)
      .map(item => ({
        menuId: item.menuId,
        menuName: item.menuName,
        children: buildTree(item.menuId),
      }))
  }
  return [{ menuId: 0, menuName: "顶级菜单", children: buildTree(0) }]
})

// ── 方法 ──
function selectSubsystem(subsystemId: number) {
  selectedSubsystem.value = subsystemId
}

async function fetchMenuTree() {
  if (!selectedSubsystem.value) return

  loading.value = true
  try {
    const tree = await getMenuTreeBySubsystem(selectedSubsystem.value)
    menuTreeData.value = tree
  } catch (err) {
    ElMessage.error("获取数据失败，请重试")
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  fetchMenuTree()
}

function handleReset() {
  searchForm.menuName = ""
  searchForm.menuCode = ""
  searchForm.status = ""
  fetchMenuTree()
}

function handleRefresh() {
  fetchMenuTree()
}

function handleAdd(parentRow: Menu | null) {
  isEdit.value = false
  formData.parentId = parentRow ? parentRow.menuId : 0
  formData.menuName = ""
  formData.menuCode = ""
  formData.menuType = parentRow
    ? parentRow.menuType === 0
      ? 1
      : parentRow.menuType
    : 0
  formData.contentType = 1
  formData.subsystemId = selectedSubsystem.value
  formData.icon = ""
  formData.path = ""
  formData.component = ""
  formData.displayOrder = 0
  formData.status = 1101
  formData.remark = ""
  formData.ext = ""
  formData.hidden = 0
  drawerVisible.value = true
}

function handleEdit(row: Menu) {
  isEdit.value = true
  formData.menuId = row.menuId
  formData.parentId = row.parentId
  formData.menuName = row.menuName
  formData.menuCode = row.menuCode
  formData.menuType = row.menuType
  formData.contentType = row.contentType
  formData.subsystemId = row.subsystemId
  formData.icon = row.icon
  formData.path = row.path
  formData.component = row.component
  formData.displayOrder = row.displayOrder
  formData.status = row.status
  formData.remark = row.remark ?? ''
  formData.ext = row.ext
  formData.hidden = row.hidden
  drawerVisible.value = true
}

async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  submitLoading.value = true
  try {
    if (isEdit.value && formData.menuId) {
      await updateMenu(formData.menuId, {
        parentId: formData.parentId,
        menuName: formData.menuName,
        menuCode: formData.menuCode,
        menuType: formData.menuType,
        contentType: formData.contentType,
        subsystemId: formData.subsystemId,
        icon: formData.icon,
        path: formData.path,
        component: formData.component,
        displayOrder: formData.displayOrder,
        status: formData.status,
        remark: formData.remark,
        ext: formData.ext,
        hidden: formData.hidden,
      })
      ElMessage.success("编辑成功，数据已更新")
    } else {
      await addMenu({
        parentId: formData.parentId,
        menuName: formData.menuName,
        menuCode: formData.menuCode,
        menuType: formData.menuType,
        contentType: formData.contentType,
        subsystemId: formData.subsystemId,
        icon: formData.icon,
        path: formData.path,
        component: formData.component,
        displayOrder: formData.displayOrder,
        status: formData.status,
        remark: formData.remark,
        ext: formData.ext,
        hidden: formData.hidden,
      })
      ElMessage.success("新增成功，菜单已创建")
    }
    drawerVisible.value = false
    fetchMenuTree()
  } catch (err) {
    ElMessage.error("操作失败，请重试")
  } finally {
    submitLoading.value = false
  }
}

function resetForm() {
  formRef.value?.resetFields()
}

async function handleDelete(row: Menu) {
  try {
    await ElMessageBox.confirm(
      `您即将删除以下菜单：\n\n菜单名称：${row.menuName}\n菜单编码：${row.menuCode || "-"}\n\n删除后将同时删除其子菜单，确定要继续吗？`,
      "确认删除",
      {
        confirmButtonText: "确认删除",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: false,
      },
    )

    loading.value = true
    await deleteMenu(row.menuId)
    ElMessage.success("删除成功")
    fetchMenuTree()
  } catch (err) {
    if (err !== "cancel") {
      ElMessage.error("删除失败，请重试")
    }
  } finally {
    loading.value = false
  }
}

async function handleStatusChange(row: Menu, newStatus: number) {
  const from = newStatus === 1101 ? "停用" : "正常"
  const to = newStatus === 1101 ? "正常" : "停用"

  try {
    await ElMessageBox.confirm(
      `您将把菜单 "${row.menuName}" 的状态从 "${from}" 切换为 "${to}"，确定要继续吗？`,
      "切换状态确认",
      {
        confirmButtonText: "确认切换",
        cancelButtonText: "取消",
        type: "info",
      },
    )

    await toggleMenuStatus(row.menuId, newStatus)
    row.status = newStatus
    ElMessage.success(`状态已切换为 "${to}"`)
  } catch (err) {
    if (err !== "cancel") {
      ElMessage.error("状态切换失败，请重试")
    }
    fetchMenuTree()
  }
}

async function handleCopy(code: string) {
  try {
    await navigator.clipboard.writeText(code)
    ElMessage.success("已复制到剪贴板")
  } catch {
    ElMessage.warning("复制失败，请手动复制")
  }
}

function getMenuTypeColor(type: number): string {
  return MENU_TYPE_MAP[type]?.color || "#909399"
}

function getContentTypeTagType(
  contentType: number,
): "" | "success" | "warning" | "info" | "danger" {
  const typeMap: Record<
    number,
    "" | "success" | "warning" | "info" | "danger"
  > = {
    1: "", // 菜单页面 - 默认蓝色
    2: "success", // 大屏 - 绿色
    3: "warning", // 嵌入页面 - 橙色
    4: "info", // 外部链接 - 灰色
  }
  return typeMap[contentType] || "info"
}

function formatJson(jsonStr: string): string {
  try {
    const obj = JSON.parse(jsonStr)
    return JSON.stringify(obj, null, 2)
  } catch {
    return jsonStr
  }
}

// 子系统图标配置
const subsystemIconMap: Record<
  number,
  { icon: string; color: string; bg: string }
> = {
  1: {
    icon: "Bell",
    color: "#E6A23C",
    bg: "linear-gradient(135deg, #FDF6EC 0%, #FAECD8 100%)",
  },
  2: {
    icon: "Document",
    color: "#409EFF",
    bg: "linear-gradient(135deg, #ECF5FF 0%, #D9ECFF 100%)",
  },
  3: {
    icon: "Warning",
    color: "#F56C6C",
    bg: "linear-gradient(135deg, #FEF0F0 0%, #FDE2E2 100%)",
  },
  4: {
    icon: "Connection",
    color: "#9B59B6",
    bg: "linear-gradient(135deg, #F4ECF7 0%, #E8DAEF 100%)",
  },
  5: {
    icon: "Box",
    color: "#67C23A",
    bg: "linear-gradient(135deg, #F0F9EB 0%, #E1F3D8 100%)",
  },
  6: {
    icon: "DataAnalysis",
    color: "#00BCD4",
    bg: "linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)",
  },
  7: {
    icon: "Share",
    color: "#FF9800",
    bg: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)",
  },
  8: {
    icon: "Monitor",
    color: "#3F51B5",
    bg: "linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)",
  },
  99: {
    icon: "Setting",
    color: "#606266",
    bg: "linear-gradient(135deg, #F5F7FA 0%, #E9ECEF 100%)",
  },
}

function getSubsystemIconStyle(subsystemId: number) {
  return subsystemIconMap[subsystemId] || subsystemIconMap[99]
}

// 构建菜单路径映射
const menuPathMap = computed(() => {
  const map = new Map<number, string>()

  function buildPath(items: Menu[], parentPath: string = "") {
    items.forEach(item => {
      const currentPath = parentPath
        ? `${parentPath} / ${item.menuName}`
        : item.menuName
      map.set(item.menuId, parentPath)
      if (item.children && item.children.length > 0) {
        buildPath(item.children, currentPath)
      }
    })
  }

  buildPath(menuTreeData.value)
  return map
})

function getPathLabel(row: Menu): string {
  if (row.parentId === 0) return ""
  return menuPathMap.value.get(row.menuId) || ""
}

// ── 监听子系统切换 ──
watch(selectedSubsystem, () => {
  fetchMenuTree()
})

// ── 初始化 ──
onMounted(() => {
  fetchMenuTree()
})
</script>

<style lang="scss" scoped>
.menu-management {
  padding: 0;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;

  // 入场动画
  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;

    &:nth-child(1) {
      animation-delay: 0.05s;
    }
    &:nth-child(2) {
      animation-delay: 0.12s;
    }
  }

  // 主容器
  .main-container {
    display: flex;
    gap: 20px;
    flex: 1;
    overflow: hidden;
  }

  // 左侧子系统面板
  .left-panel {
    width: 260px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    transition: width 0.3s ease;

    &.collapsed {
      width: 72px;

      .panel-header {
        padding: 16px 8px;
        justify-content: center;
      }

      .subsystem-list {
        padding: 8px;
      }

      .subsystem-item {
        flex-direction: column;
        padding: 10px 4px;
        align-items: center;
        margin-bottom: 4px;
        gap: 4px;
        border: 1px solid transparent;
        border-bottom: 1px solid #f0f2f5;

        &:last-child {
          border-bottom: none;
        }

        &.active {
          background: #ecf5ff;
          border-color: #b3d8ff;
        }
      }

      .subsystem-icon-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }

      .subsystem-icon {
        margin: 0;
        width: 40px;
        height: 40px;
      }

      .subsystem-abbr {
        font-size: 11px;
        color: #606266;
        line-height: 1.2;
        text-align: center;
        max-width: 56px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .panel-header {
      padding: 16px 20px;
      border-bottom: 1px solid #ebeef5;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .panel-title {
        font-size: 15px;
        font-weight: 600;
        color: #303133;
      }

      .panel-count {
        font-size: 12px;
        color: #909399;
      }

      .collapse-btn {
        color: #909399;
        &:hover {
          color: #409eff;
        }
      }
    }

    .subsystem-list {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      -ms-overflow-style: none;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .subsystem-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 4px;
      border-bottom: 1px solid #f0f2f5;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: #f5f7fa;
      }

      &.active {
        background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
        border: 1px solid #b3d8ff;
        border-bottom: 1px solid #b3d8ff;

        .subsystem-icon {
          background: #409eff;
          color: #ffffff;
        }

        .subsystem-name {
          color: #409eff;
          font-weight: 600;
        }

        .subsystem-abbr {
          color: #409eff;
          font-weight: 600;
        }
      }

      &:not(.active):hover {
        background: #f5f7fa;
      }

      .subsystem-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background: #f0f2f5;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all 0.2s ease;

        .el-icon {
          font-size: 20px;
          color: #606266;
        }
      }

      .subsystem-icon-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }

      .subsystem-info {
        flex: 1;
        min-width: 0;

        .subsystem-name {
          font-size: 14px;
          font-weight: 500;
          color: #303133;
          margin-bottom: 2px;
        }

        .subsystem-full-name {
          font-size: 11px;
          color: #909399;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  // 右侧菜单面板
  .right-panel {
    flex: 1;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .panel-header {
      padding: 16px 20px;
      border-bottom: 1px solid #ebeef5;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .panel-title {
        font-size: 15px;
        font-weight: 600;
        color: #303133;
      }

      .panel-actions {
        display: flex;
        align-items: center;
      }
    }

    .search-bar {
      padding: 12px 20px;
      background: #fafafa;
      border-bottom: 1px solid #ebeef5;

      .el-form-item {
        margin-bottom: 0;
      }
    }

    .table-wrapper {
      flex: 1;
      padding: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      :deep(.el-table) {
        flex: 1;
        --el-table-row-hover-bg-color: #f5f7fa;

        .el-table__body-wrapper {
          overflow-y: auto;
        }

        .el-table__row {
          .cell {
            padding: 0 12px;

            display: flex;
            align-items: center;
          }

          // 需要居中的列
          .el-table__cell:not(:first-child) {
            .cell {
              justify-content: center;
            }
          }
        }

        // 菜单名称表头居中
        .el-table__header-wrapper th:first-child .cell {
          justify-content: center;
        }

        // 树形缩进
        .el-table__indent {
          padding-left: 24px !important;
          display: inline-block !important;
        }

        // 展开图标
        .el-table__expand-icon {
          width: 24px;
          height: 24px;
          margin-right: 4px;
          // display: inline-flex !important;
          vertical-align: middle;

          .el-icon {
            font-size: 14px;
            transition: transform 0.2s ease;
          }

          &.expanded .el-icon {
            transform: rotate(90deg);
          }
        }

        // 树形单元格样式
        .el-table__cell {
          &.is-leaf {
            .el-table__expand-icon {
              visibility: hidden;
            }
          }
        }
      }
    }
  }

  // 菜单名称单元格
  .menu-name-cell {
    display: flex;
    align-items: center;
    gap: 8px;

    .menu-icon {
      font-size: 16px;
      flex-shrink: 0;
    }

    .menu-name {
      font-weight: 500;
      color: #303133;
    }
  }

  // 编码单元格
  .code-cell {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .code-text {
    font-family: "Monaco", "Menlo", "Consolas", monospace;
    color: #409eff;
    font-size: 12px;
    background: #ecf5ff;
    padding: 2px 6px;
    border-radius: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .overflow-cell {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 0;
    justify-content: center;

    .code-text {
      min-width: 0;
      flex: 1;
    }
  }

  .overflow-text {
    font-family: "Monaco", "Menlo", "Consolas", monospace;
    font-size: 12px;
    color: #606266;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }

  .path-text {
    font-family: "Monaco", "Menlo", "Consolas", monospace;
    color: #606266;
    font-size: 12px;
  }

  .component-text {
    font-family: "Monaco", "Menlo", "Consolas", monospace;
    color: #909399;
    font-size: 11px;
  }

  .empty-text {
    color: #c0c4cc;
  }

  .sort-text {
    font-weight: 600;
    color: #606266;
  }

  .ext-tag {
    cursor: pointer;
  }

  .ext-content {
    pre {
      margin: 0;
      font-family: "Monaco", "Menlo", "Consolas", monospace;
      font-size: 12px;
      color: #606266;
      white-space: pre-wrap;
      word-break: break-all;
      background: #f5f7fa;
      padding: 8px;
      border-radius: 4px;
    }
  }

  // 抽屉
  :deep(.el-drawer) {
    .el-drawer__header {
      margin-bottom: 0;
      padding: 20px 24px;
      border-bottom: 1px solid #EBEEF5;

      .el-drawer__title {
        font-weight: 600;
        font-size: 16px;
      }
    }

    .el-drawer__body {
      padding: 24px;
      overflow-y: auto;
    }
  }

  .drawer-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid #EBEEF5;
    margin: 0 -24px -24px;
    background: #FFFFFF;
  }

  // 表单
  .menu-form {
    .el-form-item {
      margin-bottom: 20px;
    }

    .form-tip-inline {
      font-size: 12px;
      color: #909399;
      margin-left: 12px;
    }
  }
}
</style>

<style>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
