<template>
  <div class="wf-validate">
    <div class="wf-validate__header">
      <span class="wf-validate__title">校验结果</span>
      <el-tag
        v-if="store.hasErrors.value"
        type="danger"
        size="small"
      >{{ store.validationIssues.value.filter(i => i.severity === 'error').length }} 个错误</el-tag>
      <el-tag
        v-else-if="store.hasWarnings.value"
        type="warning"
        size="small"
      >{{ store.validationIssues.value.filter(i => i.severity === 'warning').length }} 个警告</el-tag>
      <el-tag v-else type="success" size="small">通过</el-tag>
    </div>

    <div class="wf-validate__body">
      <el-empty
        v-if="!store.validationIssues.value.length"
        description="未发现问题"
        :image-size="80"
      />
      <div
        v-for="(issue, idx) in store.validationIssues.value"
        :key="idx"
        class="wf-validate__item"
        :class="`is-${issue.severity}`"
        @click="focusIssue(issue)"
      >
        <el-icon class="wf-validate__icon">
          <CircleCloseFilled v-if="issue.severity === 'error'" />
          <WarningFilled v-else />
        </el-icon>
        <span class="wf-validate__msg">{{ issue.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { CircleCloseFilled, WarningFilled } from '@element-plus/icons-vue'
import { useWorkflowStore } from '@/composables/useWorkflowStore'

const store = useWorkflowStore()

function focusIssue(issue: { severity: string; targetId?: string; targetType?: 'node' | 'edge'; message: string }) {
  if (!issue.targetId) return
  if (issue.targetType === 'node') {
    store.selectNode(issue.targetId)
  } else if (issue.targetType === 'edge') {
    store.selectEdge(issue.targetId)
  } else {
    ElMessage.info(issue.message)
  }
}
</script>

<style scoped lang="scss">
.wf-validate {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
  border-left: 1px solid #e4e7ed;
}

.wf-validate__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #e4e7ed;
  background: #fafbfc;
}

.wf-validate__title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  flex: 1;
}

.wf-validate__body {
  flex: 1;
  overflow: auto;
  padding: 12px;
}

.wf-validate__item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 4px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  line-height: 1.5;
  transition: background 0.15s ease;

  &:hover {
    background: #f5f7fa;
  }

  &.is-error {
    color: #f56c6c;
    background: #fef0f0;

    &:hover {
      background: #fde2e2;
    }
  }

  &.is-warning {
    color: #e6a23c;
    background: #fdf6ec;

    &:hover {
      background: #faecd8;
    }
  }
}

.wf-validate__icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.wf-validate__msg {
  flex: 1;
}
</style>