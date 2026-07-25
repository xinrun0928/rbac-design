<template>
  <div class="schedule-rule-page">
    <div class="main-container animate-item">
      <!-- 左侧：排班规则列表 -->
      <div class="left-panel">
        <div class="panel-header">
          <span class="panel-title">排班规则</span>
          <el-button type="primary" :icon="Plus" size="small" @click="handleAdd">新建</el-button>
        </div>
        <div class="rule-list">
          <div
            v-for="rule in ruleList"
            :key="rule.id"
            class="rule-item"
            :class="{ active: selectedRule?.id === rule.id }"
            @click="selectRule(rule)"
          >
            <span class="rule-name">{{ rule.ruleName }}</span>
            <el-icon class="rule-edit" @click.stop="handleEdit(rule)"><Edit /></el-icon>
          </div>
          <el-empty v-if="ruleList.length === 0" description="暂无规则" :image-size="60" />
        </div>
      </div>

      <!-- 右侧：规则详情 -->
      <div class="right-panel">
        <template v-if="selectedRule">
          <div class="detail-header">
            <span class="detail-title">{{ selectedRule.ruleName }}</span>
            <el-tag type="info" effect="plain" size="small">排序: {{ selectedRule.sortOrder }}</el-tag>
          </div>
          <div class="detail-content">
            <el-empty description="规则详细内容开发中" />
          </div>
        </template>
        <el-empty v-else description="请选择左侧规则查看详情" />
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '修改规则' : '新建规则'"
      width="420px"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
        label-position="right"
      >
        <el-form-item label="规则名称" prop="ruleName">
          <el-input
            v-model="formData.ruleName"
            placeholder="请输入规则名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number
            v-model="formData.sortOrder"
            :min="1"
            :max="999"
            style="width: 200px"
          />
          <span class="form-tip">数值越小越靠前</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          {{ isEdit ? '保存修改' : '确认创建' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, Edit } from '@element-plus/icons-vue'
import type { ScheduleRule, ScheduleRuleForm } from '@/types/duty/schedule'
import { mockScheduleRuleData } from '@/mock/duty/scheduleData'

// ── 状态 ──
const ruleList = ref<ScheduleRule[]>([])
const selectedRule = ref<ScheduleRule | null>(null)
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive<ScheduleRuleForm>({
  ruleName: '',
  sortOrder: 1,
})

const formRules: FormRules = {
  ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  sortOrder: [{ required: true, message: '请输入排序值', trigger: 'blur' }],
}

// ── 方法 ──
function fetchData() {
  ruleList.value = JSON.parse(JSON.stringify(mockScheduleRuleData))
}

function selectRule(rule: ScheduleRule) {
  selectedRule.value = rule
}

function handleAdd() {
  isEdit.value = false
  formData.id = undefined
  formData.ruleName = ''
  formData.sortOrder = ruleList.value.length + 1
  dialogVisible.value = true
}

function handleEdit(rule: ScheduleRule) {
  isEdit.value = true
  formData.id = rule.id
  formData.ruleName = rule.ruleName
  formData.sortOrder = rule.sortOrder
  dialogVisible.value = true
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
      const item = ruleList.value.find(r => r.id === formData.id)
      if (item) {
        item.ruleName = formData.ruleName
        item.sortOrder = formData.sortOrder
      }
      if (selectedRule.value?.id === formData.id && item) {
        selectedRule.value = item
      }
      ElMessage.success('修改成功')
    } else {
      const newItem: ScheduleRule = {
        id: Date.now(),
        ruleName: formData.ruleName,
        sortOrder: formData.sortOrder,
        createTime: now,
        deleted: 0,
      }
      ruleList.value.push(newItem)
      ElMessage.success('新建成功')
    }
    dialogVisible.value = false
    submitLoading.value = false
  }, 300)
}

function resetForm() {
  formRef.value?.resetFields()
}

// ── 初始化 ──
fetchData()
</script>

<style lang="scss" scoped>
.schedule-rule-page {
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
  }

  .main-container {
    display: flex;
    gap: 16px;
    flex: 1;
    overflow: hidden;
  }

  // 左侧规则列表
  .left-panel {
    flex: 6;
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
    }

    .rule-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
      -ms-overflow-style: none;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .rule-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;

      &:hover {
        background: #f5f7fa;
      }

      &.active {
        background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
        border-left-color: #409eff;

        .rule-name {
          color: #409eff;
          font-weight: 600;
        }
      }

      .rule-name {
        font-size: 14px;
        color: #303133;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
        min-width: 0;
      }

      .rule-edit {
        font-size: 14px;
        color: #909399;
        flex-shrink: 0;
        margin-left: 8px;

        &:hover {
          color: #409eff;
        }
      }
    }
  }

  // 右侧规则详情
  .right-panel {
    flex: 18;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .detail-header {
      padding: 16px 24px;
      border-bottom: 1px solid #ebeef5;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .detail-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
    }

    .detail-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :deep(.el-empty) {
      padding: 60px 0;
    }
  }

  // 表单提示
  .form-tip {
    font-size: 12px;
    color: #909399;
    margin-left: 12px;
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
