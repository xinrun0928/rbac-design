<template>
  <div class="post-management">
    <div class="main-container animate-item">
      <!-- 操作栏 + 表格 -->
      <div class="table-card">
        <div class="table-header">
          <el-input
            v-model="searchForm.postName"
            placeholder="请输入岗位名称"
            clearable
            :prefix-icon="Search"
            style="width: 200px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <div class="table-actions">
            <el-button type="primary" :icon="Plus" @click="handleAdd(null)">新增岗位</el-button>
            <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
          </div>
        </div>

        <div class="table-wrapper">
          <el-table
            v-loading="loading"
            :data="filteredData"
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            :header-cell-style="{
              background: '#F5F7FA',
              color: '#606266',
              fontWeight: '600',
              textAlign: 'center',
            }"
            border
            stripe
            default-expand-all
            :indent="24"
            empty-text=" "
          >
            <el-table-column
              label="序号"
              width="70"
              align="center"
            >
              <template #default="{ $index }">
                {{ $index + 1 }}
              </template>
            </el-table-column>

            <el-table-column
              prop="postName"
              label="岗位名称"
              min-width="200"
              fixed
              align="center"
            >
              <template #default="{ row }">
                <span style="text-align: left; display: block;">{{ row.postName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="unitName"
              label="所属单位"
              min-width="140"
              align="center"
            />

            <el-table-column
              prop="status"
              label="启用状态"
              width="100"
              align="center"
            >
              <template #default="{ row }">
                <el-tag
                  :type="row.status === 1 ? 'success' : 'info'"
                  effect="plain"
                  size="small"
                >
                  {{ row.status === 1 ? '启用' : '停用' }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column
              prop="remark"
              label="备注信息"
              min-width="200"
              align="center"
              show-overflow-tooltip
            />

            <el-table-column
              prop="updateTime"
              label="更新时间"
              width="180"
              align="center"
            />

            <el-table-column
              label="操作"
              width="160"
              align="center"
              fixed="right"
            >
              <template #default="{ row }">
                <el-button
                  type="primary"
                  link
                  size="small"
                  :icon="Edit"
                  @click.stop="handleEdit(row)"
                >修改</el-button>
                <el-button
                  type="danger"
                  link
                  size="small"
                  :icon="Delete"
                  @click.stop="handleDelete(row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 新增/编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="isEdit ? '修改岗位' : '新增岗位'"
      size="480px"
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
        class="post-form"
      >
        <el-form-item label="上一层级" prop="parentId">
          <el-tree-select
            v-model="formData.parentId"
            :data="parentPostOptions"
            :props="{
              label: 'postName',
              value: 'id',
              children: 'children',
            }"
            check-strictly
            :render-after-expand="false"
            placeholder="请选择上级岗位（不选则为顶级）"
            clearable
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="岗位名称" prop="postName">
          <el-input
            v-model="formData.postName"
            placeholder="请输入岗位名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="所属单位" prop="unitName">
          <el-select
            v-model="formData.unitName"
            placeholder="请选择所属单位"
            style="width: 100%"
          >
            <el-option
              v-for="item in unitOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注信息" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
            {{ isEdit ? '保存修改' : '确认创建' }}
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Search, Plus, Delete, Edit, Download } from '@element-plus/icons-vue'
import type { Post, PostForm, PostSearchForm } from '@/types/duty/post'
import { mockPostData, unitOptions } from '@/mock/duty/postData'

// ── 状态 ──
const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref<Post[]>([])
const drawerVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const searchForm = reactive<PostSearchForm>({
  postName: '',
})

const formData = reactive<PostForm>({
  postName: '',
  parentId: 0,
  unitName: '',
  status: 1,
  remark: '',
})

// ── 表单验证规则 ──
const formRules: FormRules = {
  postName: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
  unitName: [{ required: true, message: '请选择所属单位', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

// ── 计算属性 ──
const filteredData = computed(() => {
  if (!searchForm.postName) return tableData.value
  const keyword = searchForm.postName.toLowerCase()
  const filterTree = (list: Post[]): Post[] => {
    return list
      .filter(item => {
        const nameMatch = item.postName.toLowerCase().includes(keyword)
        const childMatch = item.children && filterTree(item.children).length > 0
        return nameMatch || childMatch
      })
      .map(item => ({
        ...item,
        children: item.children ? filterTree(item.children) : [],
      }))
  }
  return filterTree(tableData.value)
})

const parentPostOptions = computed(() => {
  const buildTree = (parentId: number): any[] => {
    return tableData.value
      .filter(item => item.parentId === parentId)
      .map(item => ({
        id: item.id,
        postName: item.postName,
        children: buildTree(item.id),
      }))
  }
  return [{ id: 0, postName: '顶级岗位', children: buildTree(0) }]
})

// ── 方法 ──
function fetchData() {
  loading.value = true
  setTimeout(() => {
    tableData.value = JSON.parse(JSON.stringify(mockPostData))
    loading.value = false
  }, 300)
}

function handleSearch() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 300)
}

function handleAdd(parentRow: Post | null) {
  isEdit.value = false
  formData.id = undefined
  formData.parentId = parentRow ? parentRow.id : 0
  formData.postName = ''
  formData.unitName = ''
  formData.status = 1
  formData.remark = ''
  drawerVisible.value = true
}

function handleEdit(row: Post) {
  isEdit.value = true
  formData.id = row.id
  formData.parentId = row.parentId
  formData.postName = row.postName
  formData.unitName = row.unitName
  formData.status = row.status
  formData.remark = row.remark
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
  setTimeout(() => {
    const now = new Date().toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    }).replace(/\//g, '-')

    if (isEdit.value && formData.id) {
      const updateItem = (list: Post[]): boolean => {
        for (const item of list) {
          if (item.id === formData.id) {
            item.postName = formData.postName
            item.parentId = formData.parentId
            item.unitName = formData.unitName
            item.status = formData.status
            item.remark = formData.remark
            return true
          }
          if (item.children && updateItem(item.children)) return true
        }
        return false
      }
      updateItem(tableData.value)
      ElMessage.success('修改成功，数据已更新')
    } else {
      const newItem: Post = {
        id: Date.now(),
        postName: formData.postName,
        parentId: formData.parentId,
        unitName: formData.unitName,
        status: formData.status,
        remark: formData.remark,
        children: [],
      }

      if (formData.parentId === 0) {
        tableData.value.push(newItem)
      } else {
        const addChild = (list: Post[]): boolean => {
          for (const item of list) {
            if (item.id === formData.parentId) {
              if (!item.children) item.children = []
              item.children.push(newItem)
              return true
            }
            if (item.children && addChild(item.children)) return true
          }
          return false
        }
        addChild(tableData.value)
      }
      ElMessage.success('新增成功，岗位已创建')
    }
    drawerVisible.value = false
    submitLoading.value = false
  }, 400)
}

function resetForm() {
  formRef.value?.resetFields()
}

async function handleDelete(row: Post) {
  try {
    await ElMessageBox.confirm(
      `您即将删除以下岗位：\n\n岗位名称：${row.postName}\n所属单位：${row.unitName}\n\n删除后将同时删除其子岗位，确定要继续吗？`,
      '确认删除',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )

    loading.value = true
    const removeItem = (list: Post[]): boolean => {
      const idx = list.findIndex(item => item.id === row.id)
      if (idx !== -1) {
        list.splice(idx, 1)
        return true
      }
      for (const item of list) {
        if (item.children && removeItem(item.children)) return true
      }
      return false
    }
    removeItem(tableData.value)
    ElMessage.success('删除成功')
    loading.value = false
  } catch {
    // cancelled
  }
}

function handleExport() {
  ElMessage.success('导出成功')
}

// ── 初始化 ──
fetchData()
</script>

<style lang="scss" scoped>
.post-management {
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

  .main-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  // 表格卡片
  .table-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .table-header {
      padding: 16px 20px;
      border-bottom: 1px solid #ebeef5;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .table-actions {
        display: flex;
        align-items: center;
        gap: 8px;
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

        // 表头居中
        .el-table__header-wrapper th .cell {
          justify-content: center;
        }

        .el-table__row {
          .cell {
            padding: 0 12px;
            display: flex;
            align-items: center;
          }

          .el-table__cell:not(:first-child) {
            .cell {
              justify-content: center;
            }
          }
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
  .post-form {
    .el-form-item {
      margin-bottom: 20px;
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
