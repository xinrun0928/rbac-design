<template>
  <div class="wf-props" :class="{ 'is-dialog': dialogMode }">
    <div v-if="!dialogMode" class="wf-props__header">
      <span class="wf-props__title">属性</span>
      <el-tag v-if="kind === 'node'" type="info" size="small">节点</el-tag>
      <el-tag v-else-if="kind === 'edge'" type="warning" size="small">连线</el-tag>
      <el-tag v-else type="info" size="small">无选中</el-tag>
    </div>

    <!-- dialog-mode：顶部类型 chip，方便用户快速识别 -->
    <div v-if="dialogMode && kind" class="wf-props__chip">
      <el-tag v-if="kind === 'node' && node" :color="nodeMeta.color" effect="dark">节点 · {{ nodeMeta.label }}</el-tag>
      <el-tag v-else-if="kind === 'edge'" type="warning" size="small">连线</el-tag>
      <span class="wf-props__chip-id">{{ node?.id || edge?.id }}</span>
    </div>

    <div v-if="!kind" class="wf-props__empty">
      <el-icon size="36" color="#c0c4cc"><Document /></el-icon>
      <p>选中节点或连线以查看属性</p>
    </div>

    <!-- ========== 节点属性 ========== -->
    <el-form
      v-else-if="kind === 'node' && node"
      label-position="top"
      class="wf-props__form"
      size="small"
    >
      <div class="wf-props__section-title">基本信息</div>
      <el-form-item label="节点 ID">
        <el-input :model-value="node.id" disabled />
      </el-form-item>
      <el-form-item label="名称">
        <el-input
          :model-value="node.label"
          placeholder="请输入节点名称"
          @change="onLabelChange"
        />
      </el-form-item>
      <el-form-item label="类型">
        <el-tag :color="nodeMeta.color" effect="dark">{{ nodeMeta.label }}</el-tag>
      </el-form-item>

      <!-- 文档 -->
      <el-form-item label="文档说明">
        <el-input
          :model-value="node.documentation"
          type="textarea"
          :rows="2"
          placeholder="可选：BPMN documentation"
          @change="(v: string) => updateNode({ documentation: v })"
        />
      </el-form-item>

      <!-- 执行属性 -->
      <div class="wf-props__section-title">执行</div>
      <el-form-item label="异步执行">
        <el-radio-group
          :model-value="!!node.async"
          @change="(v: boolean) => updateNode({ async: v })"
        >
          <el-radio :value="false">否</el-radio>
          <el-radio :value="true">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="多实例">
        <el-radio-group
          :model-value="!!node.multiInstance"
          @change="(v: boolean) => updateNode({ multiInstance: v })"
        >
          <el-radio :value="false">否</el-radio>
          <el-radio :value="true">是</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 任务专属 -->
      <template v-if="isTaskNode(node.type)">
        <div class="wf-props__section-title">任务</div>
        <el-form-item v-if="node.type === 'user-task'" label="执行人">
          <el-input
            :model-value="node.assignee"
            placeholder="${currentUser}"
            @change="(v: string) => updateNode({ assignee: v })"
          />
        </el-form-item>
        <el-form-item v-if="node.type === 'user-task'" label="候选组">
          <el-input
            :model-value="node.candidateGroups"
            placeholder="audit-group"
            @change="(v: string) => updateNode({ candidateGroups: v })"
          />
        </el-form-item>
        <el-form-item v-if="node.type === 'user-task'" label="表单 Key">
          <el-input
            :model-value="node.formKey"
            placeholder="form_key_v1"
            @change="(v: string) => updateNode({ formKey: v })"
          />
        </el-form-item>
        <el-form-item v-if="node.type === 'service-task' || node.type === 'script-task'" label="调用表达式">
          <el-input
            :model-value="node.expression"
            type="textarea"
            :rows="2"
            placeholder="${beanName.method(args)}"
            @change="(v: string) => updateNode({ expression: v })"
          />
        </el-form-item>
      </template>

      <div class="wf-props__danger">
        <el-button type="danger" link size="small" @click="onDelete">删除节点</el-button>
      </div>
    </el-form>

    <!-- ========== 连线属性 ========== -->
    <el-form
      v-else-if="kind === 'edge' && edge"
      label-position="top"
      class="wf-props__form"
      size="small"
    >
      <div class="wf-props__section-title">基本信息</div>
      <el-form-item label="连线 ID">
        <el-input :model-value="edge.id" disabled />
      </el-form-item>
      <el-form-item label="标签">
        <el-input
          :model-value="edge.label"
          placeholder="可选：连线显示文本"
          @change="(v: string) => updateEdge({ label: v })"
        />
      </el-form-item>

      <div class="wf-props__section-title">条件</div>
      <el-form-item label="条件表达式">
        <el-input
          :model-value="edge.condition"
          type="textarea"
          :rows="3"
          placeholder="${var == 'value'}"
          @change="(v: string) => updateEdge({ condition: v })"
        />
      </el-form-item>
      <el-form-item label="默认流">
        <el-radio-group
          :model-value="!!edge.isDefault"
          @change="(v: boolean) => updateEdge({ isDefault: v })"
        >
          <el-radio :value="false">否</el-radio>
          <el-radio :value="true">是</el-radio>
        </el-radio-group>
        <div class="wf-props__hint">排他网关出口的默认流仅一条生效</div>
      </el-form-item>

      <div class="wf-props__danger">
        <el-button type="danger" link size="small" @click="onDelete">删除连线</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import type { WorkflowNode, WorkflowEdge, NodeType } from '@/types/workflow'
import { paletteItemByType } from '@/types/workflow/nodeTypes'
import { useWorkflowStore } from '@/composables/useWorkflowStore'

interface Props {
  /** 弹窗模式：去掉自有 header/border/empty 文案，作为 el-dialog 的 body 内容 */
  dialogMode?: boolean
}
withDefaults(defineProps<Props>(), { dialogMode: false })

const store = useWorkflowStore()

const node = computed<WorkflowNode | null>(() => {
  const id = store.selectedNodeId.value
  if (!id) return null
  return store.nodes.value.find(n => n.id === id) || null
})

const edge = computed<WorkflowEdge | null>(() => {
  const id = store.selectedEdgeId.value
  if (!id) return null
  return store.edges.value.find(e => e.id === id) || null
})

const kind = computed<'node' | 'edge' | null>(() => {
  if (node.value) return 'node'
  if (edge.value) return 'edge'
  return null
})

const nodeMeta = computed(() => {
  const t = node.value?.type
  if (!t) return { color: '#909399', label: '' }
  const item = paletteItemByType[t]
  return { color: item?.color || '#909399', label: item?.label || '' }
})

const taskTypes: NodeType[] = ['user-task', 'manual-task', 'service-task', 'script-task', 'receive-task']
function isTaskNode(t: NodeType) {
  return taskTypes.includes(t)
}

function updateNode(patch: Partial<WorkflowNode>) {
  if (!node.value) return
  store.updateNode(node.value.id, patch)
}

function updateEdge(patch: Partial<WorkflowEdge>) {
  if (!edge.value) return
  store.updateEdge(edge.value.id, patch)
}

function onLabelChange(v: string | number) {
  updateNode({ label: String(v) })
}

function onDelete() {
  if (node.value) {
    store.removeNode(node.value.id)
    ElMessage.success('节点已删除')
  } else if (edge.value) {
    store.removeEdge(edge.value.id)
    ElMessage.success('连线已删除')
  }
}
</script>

<style scoped lang="scss">
.wf-props {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
  border-left: 1px solid #e4e7ed;

  &.is-dialog {
    border-left: none;
    height: auto;
    max-height: 60vh;
  }
}

.wf-props__chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 0 12px;
}

.wf-props__chip-id {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  color: #909399;
}

.wf-props__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #e4e7ed;
  background: #fafbfc;
}

.wf-props__title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  flex: 1;
}

.wf-props__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #909399;
  font-size: 13px;
}

.wf-props__form {
  flex: 1;
  overflow: auto;
  padding: 12px 16px 24px;
}

.is-dialog .wf-props__form {
  padding: 4px 0 8px;
}

.wf-props__section-title {
  font-size: 12px;
  font-weight: 600;
  color: #909399;
  margin: 12px 0 8px;
  letter-spacing: 0.4px;
  border-left: 2px solid #409eff;
  padding-left: 6px;
}

.wf-props__danger {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px dashed #e4e7ed;
  text-align: center;
}

.wf-props__hint {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}
</style>