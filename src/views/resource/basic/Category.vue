<template>
  <div class="category-management">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <span class="search-bar-title">物资装备种类管理</span>
        <div class="search-bar-actions">
          <el-input
            v-model="searchForm.categoryName"
            placeholder="搜索分类名称"
            clearable
            :prefix-icon="Search"
            style="width: 180px; margin-right: 12px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-select
            v-model="searchForm.status"
            placeholder="全部状态"
            clearable
            style="width: 140px; margin-right: 12px"
            :prefix-icon="Search"
            @change="handleSearch"
          >
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
          <el-button type="primary" :icon="Plus" @click="handleCreate">新建分类</el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        row-key="categoryId"
        default-expand-all
        :indent="24"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column prop="categoryName" label="类别名称" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="category-name-text" :class="{ 'is-parent': !row.parentId }">{{ row.categoryName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="unit" label="单位" width="90" align="center">
          <template #default="{ row }">
            <span class="unit-text">{{ row.unit || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="image" label="图片" width="110" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.image"
              :src="row.image"
              fit="cover"
              class="category-image"
              :preview-src-list="[row.image]"
              preview-teleported
            />
            <div v-else class="image-placeholder">
              <el-icon :size="16"><Picture /></el-icon>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="warningQuantity" label="预警数量" width="100" align="center">
          <template #default="{ row }">
            <span class="warning-text">{{ row.warningQuantity != null ? `${row.warningOperator ?? ''}${row.warningQuantity}` : '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" effect="light" round>
              {{ row.status === 1 ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="updateBy" label="最后操作人" width="110" align="center">
          <template #default="{ row }">
            <span class="operator-name">{{ row.updateBy }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="updateTime" label="最后修改时间" width="170" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.updateTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="230" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Plus" @click="handleAddChild(row)">添加下级</el-button>
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="drawerTitle"
      size="50%"
      direction="rtl"
      class="category-drawer"
      destroy-on-close
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90px">
        <el-form-item label="上级分类">
          <el-input :model-value="parentName" disabled />
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="formData.categoryName" placeholder="请输入分类名称" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select v-model="formData.unit" placeholder="请选择单位" filterable allow-create style="width: 100%">
            <el-option v-for="unit in unitOptions" :key="unit" :label="unit" :value="unit" />
          </el-select>
        </el-form-item>
        <el-form-item label="预警数量" prop="warningQuantity">
          <div class="warning-row">
            <el-select v-model="formData.warningOperator" style="width: 100px">
              <el-option v-for="op in operatorOptions" :key="op" :label="op" :value="op" />
            </el-select>
            <el-input-number v-model="formData.warningQuantity" :min="0" :max="99999" style="flex: 1" />
          </div>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="相关图片">
          <el-upload
            v-model:file-list="imageFileList"
            :auto-upload="false"
            list-type="picture-card"
            :limit="1"
            :on-change="handleImageChange"
            :on-remove="handleImageRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="规格型号" prop="specs">
          <div class="specs-editor">
            <el-table :data="formData.specs" border size="small" class="specs-table">
              <el-table-column label="规格" min-width="160" align="center">
                <template #default="{ row }">
                  <el-input v-model="row.spec" placeholder="请输入规格" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="型号" min-width="190" align="center">
                <template #default="{ row }">
                  <el-input v-model="row.model" placeholder="请输入型号" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="60" align="center">
                <template #default="{ $index }">
                  <el-button
                    type="danger"
                    link
                    :icon="Delete"
                    :disabled="formData.specs.length <= 1"
                    @click="removeSpec($index)"
                  />
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" plain :icon="Plus" class="add-spec-btn" @click="addSpec">添加规格型号</el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules, UploadFile, UploadUserFile } from 'element-plus'
import { Search, Plus, Edit, Delete, Picture } from '@element-plus/icons-vue'
import { materialCategoryData } from '@/mock/resource/categoryData'
import type { CategoryForm, CategorySpec, MaterialCategory, CategorySearchForm } from '@/types/resource/category'

const loading = ref(false)
const tableData = ref<MaterialCategory[]>(materialCategoryData)

const searchForm = reactive<CategorySearchForm>({
  categoryName: '',
  status: ''
})

// ── 树形扁平化（用于 ID 生成与导出） ──
function flattenTree(nodes: MaterialCategory[]): MaterialCategory[] {
  const result: MaterialCategory[] = []
  for (const node of nodes) {
    result.push(node)
    if (node.children) result.push(...flattenTree(node.children))
  }
  return result
}

// ── 树形筛选 ──
function filterTree(nodes: MaterialCategory[], keyword: string, status: number | ''): MaterialCategory[] {
  const result: MaterialCategory[] = []
  for (const node of nodes) {
    const keptChildren = node.children ? filterTree(node.children, keyword, status) : []
    const selfMatch =
      (!keyword || node.categoryName.includes(keyword)) &&
      (status === '' || node.status === status)
    if (selfMatch || keptChildren.length) {
      result.push({ ...node, children: keptChildren.length ? keptChildren : undefined })
    }
  }
  return result
}

const filteredData = computed(() =>
  filterTree(tableData.value, searchForm.categoryName, searchForm.status)
)

function handleSearch() {}

// ── 选项 ──
const unitOptions = ['辆', '台', '个', '套', '件', '块', '副', '根', '支', '盏', '把', '卷', '枚', '艘', '盘', '瓶', '张', '顶', '条', '袋', '部', '座', '具', '架', '只']
const operatorOptions = ['<', '>', '=', '≤', '≥']

// ── 树形查找/删除 ──
function findNode(nodes: MaterialCategory[], id: string): MaterialCategory | undefined {
  for (const node of nodes) {
    if (node.categoryId === id) return node
    if (node.children) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return undefined
}

function removeNode(nodes: MaterialCategory[], id: string): boolean {
  const index = nodes.findIndex(n => n.categoryId === id)
  if (index > -1) {
    nodes.splice(index, 1)
    return true
  }
  for (const node of nodes) {
    if (node.children && removeNode(node.children, id)) {
      if (node.children.length === 0) node.children = undefined
      return true
    }
  }
  return false
}

// ── 新增/编辑抽屉 ──
const drawerVisible = ref(false)
const drawerTitle = ref('新建分类')
const formRef = ref<FormInstance>()
const editingId = ref('')
const parentName = ref('顶级分类')
const imageFileList = ref<UploadUserFile[]>([])

const createEmptySpec = (): CategorySpec => ({
  spec: '',
  model: ''
})

const formData = reactive<CategoryForm>({
  parentId: '',
  categoryName: '',
  unit: '',
  warningQuantity: 0,
  warningOperator: '≤',
  status: 1,
  image: '',
  specs: [createEmptySpec()]
})

const formRules: FormRules = {
  categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  unit: [{ required: true, message: '请选择单位', trigger: 'change' }],
  warningQuantity: [{ required: true, message: '请输入预警数量', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  specs: [
    {
      validator: (_rule, value: CategorySpec[], callback) => {
        if (!value.length) {
          callback(new Error('请至少填写一条规格型号'))
          return
        }
        if (value.some(item => !item.spec)) {
          callback(new Error('请完整填写规格型号的规格'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ]
}

function resetForm() {
  formData.parentId = ''
  formData.categoryName = ''
  formData.unit = ''
  formData.warningQuantity = 0
  formData.warningOperator = '≤'
  formData.status = 1
  formData.image = ''
  formData.specs = [createEmptySpec()]
  imageFileList.value = []
}

function openDrawer(title: string, parentId: string, parentLabel: string) {
  editingId.value = ''
  drawerTitle.value = title
  resetForm()
  formData.parentId = parentId
  parentName.value = parentLabel
  drawerVisible.value = true
}

function handleCreate() {
  openDrawer('新建分类', '', '顶级分类')
}

function handleAddChild(row: MaterialCategory) {
  openDrawer('添加下级分类', row.categoryId, row.categoryName)
}

function handleEdit(row: MaterialCategory) {
  editingId.value = row.categoryId
  drawerTitle.value = '编辑分类'
  formData.parentId = row.parentId
  parentName.value = row.parentId ? findNode(tableData.value, row.parentId)?.categoryName ?? '顶级分类' : '顶级分类'
  formData.categoryName = row.categoryName
  formData.unit = row.unit
  formData.warningQuantity = row.warningQuantity ?? 0
  formData.warningOperator = row.warningOperator || '≤'
  formData.status = row.status
  formData.image = row.image
  formData.specs = row.specs.length ? row.specs.map(s => ({ ...s })) : [createEmptySpec()]
  imageFileList.value = row.image ? [{ name: row.categoryName, url: row.image }] : []
  drawerVisible.value = true
}

// ── 图片上传 ──
function handleImageChange(file: UploadFile) {
  const raw = file.raw
  if (!raw) return
  const reader = new FileReader()
  reader.onload = () => {
    formData.image = String(reader.result ?? '')
  }
  reader.readAsDataURL(raw)
}

function handleImageRemove() {
  formData.image = ''
  imageFileList.value = []
}

// ── 规格型号 ──
function addSpec() {
  formData.specs.push(createEmptySpec())
}

function removeSpec(index: number) {
  formData.specs.splice(index, 1)
}

// ── 提交 ──
function nextCategoryId(): string {
  return `CAT${String(flattenTree(tableData.value).length + 1).padStart(3, '0')}`
}

function formatNow(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function handleSubmit() {
  formRef.value?.validate(valid => {
    if (!valid) return
    if (editingId.value) {
      const target = findNode(tableData.value, editingId.value)
      if (target) {
        target.categoryName = formData.categoryName
        target.unit = formData.unit
        target.warningQuantity = formData.warningQuantity
        target.warningOperator = formData.warningOperator
        target.status = formData.status
        target.image = formData.image
        target.specs = formData.specs.map(s => ({ ...s }))
        target.updateTime = formatNow()
        target.updateBy = '当前用户'
      }
      ElMessage.success('修改成功')
    } else {
      const newNode: MaterialCategory = {
        categoryId: nextCategoryId(),
        parentId: formData.parentId,
        categoryName: formData.categoryName,
        unit: formData.unit,
        image: formData.image,
        warningQuantity: formData.warningQuantity,
        warningOperator: formData.warningOperator,
        status: formData.status,
        updateTime: formatNow(),
        updateBy: '当前用户',
        specs: formData.specs.map(s => ({ ...s }))
      }
      if (formData.parentId) {
        const parent = findNode(tableData.value, formData.parentId)
        if (parent) {
          if (!parent.children) parent.children = []
          parent.children.push(newNode)
        }
      } else {
        tableData.value.unshift(newNode)
      }
      ElMessage.success('保存成功')
    }
    drawerVisible.value = false
  })
}

// ── 删除 ──
function handleDelete(row: MaterialCategory) {
  const hasChildren = !!row.children && row.children.length > 0
  ElMessageBox.confirm(
    hasChildren
      ? `分类 "${row.categoryName}" 存在子分类，删除后将一并删除所有子分类，是否确认删除？`
      : `是否确认删除分类 "${row.categoryName}"？`,
    '删除确认',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    removeNode(tableData.value, row.categoryId)
    ElMessage.success(`已删除分类 ${row.categoryName}`)
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
:deep(.el-drawer__footer) {
  border-top: 1px solid #ebeef5;
}

.category-management {
  padding: 16px;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;

  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;
  }

  .table-card {
    border-radius: 12px;
    border: none;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-card__body) {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }

    // ── 搜索栏 ──
    .search-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #ebeef5;
    }

    .search-bar-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .search-bar-actions {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    // ── 树形表格单元格居中 ──
    :deep(.el-table__row .cell) {
      display: flex;
      align-items: center;
    }

    :deep(.el-table__row .el-table__cell:not(:first-child) .cell) {
      justify-content: center;
    }

    .category-name-text {
      font-weight: 500;
      color: #303133;

      &.is-parent {
        font-weight: 600;
        color: #1f2d3d;
      }
    }

    .unit-text,
    .time-text {
      font-size: 13px;
      color: #909399;
    }

    .warning-text {
      font-size: 13px;
      color: #e6a23c;
      font-weight: 500;
    }

    .operator-name {
      font-size: 13px;
      color: #303133;
      font-weight: 500;
    }

    .category-image {
      width: 44px;
      height: 22px;
      border-radius: 4px;
    }

    .image-placeholder {
      width: 44px;
      height: 22px;
      border-radius: 4px;
      background: #f5f7fa;
      border: 1px dashed #dcdfe6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #c0c4cc;
    }

    .data-table {
      flex: 1;
    }
  }
}

// 抽屉表单
.category-drawer {
  .warning-row {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .specs-editor {
    width: 100%;

    .specs-table {
      margin-bottom: 12px;
    }

    .add-spec-btn {
      width: 100%;
    }
  }
}

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
