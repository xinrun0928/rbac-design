<template>
  <div class="tree-panel" :class="{ collapsed: treeCollapsed }">
    <template v-if="!treeCollapsed">
      <div class="tree-header">
        <span class="tree-title">组织架构</span>
        <el-button
          :icon="DArrowLeft"
          link
          @click="treeCollapsed = true"
          class="collapse-btn"
        />
      </div>
      <div class="tree-body">
        <el-input
          v-model="treeFilter"
          placeholder="搜索组织名称"
          clearable
          :prefix-icon="Search"
          class="tree-search"
        />
        <el-tree
          ref="treeRef"
          :data="orgTreeData"
          :props="{ label: 'name', children: 'children' }"
          node-key="id"
          highlight-current
          default-expand-all
          :expand-on-click-node="false"
          :filter-node-method="filterTreeNode"
          @node-click="handleNodeClick"
          class="org-tree"
        >
          <template #default="{ data }">
            <div class="tree-node">
              <el-icon class="node-icon" :style="{ color: getNodeTypeColor(data.nodeType) }">
                <component :is="getNodeTypeIcon(data.nodeType)" />
              </el-icon>
              <span class="node-label">{{ data.name }}</span>
            </div>
          </template>
        </el-tree>
      </div>
    </template>
    <div v-else class="collapsed-body">
      <div class="collapsed-expand-bar">
        <el-tooltip content="展开" placement="right">
          <el-button :icon="DArrowRight" link @click="treeCollapsed = false" class="expand-btn" />
        </el-tooltip>
      </div>
      <div class="collapsed-list">
        <div v-for="(item, index) in flatTreeData" :key="index" class="collapsed-item" :class="{ active: item.id === activeSelectedId }" @click="handleCollapsedItemClick(item)">
          <el-tooltip :content="item.name" placement="right">
            <div class="collapsed-icon-wrapper">
              <div class="collapsed-icon" :style="{ background: getNodeTypeColor(item.nodeType) }">
                <span class="collapsed-char">{{ item.name.charAt(0) }}</span>
              </div>
              <span class="collapsed-level">{{ item.level }}</span>
            </div>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Search, DArrowLeft, DArrowRight,
  OfficeBuilding, HomeFilled, FolderOpened, Monitor, Briefcase, Folder
} from '@element-plus/icons-vue'
import { orgTreeData } from '@/mock/admin/orgTreeData'
import type { OrgTreeNode } from '@/types/admin/orgTree'
import type ElTree from 'element-plus/es/components/tree'

const treeRef = ref<InstanceType<typeof ElTree>>()
const treeCollapsed = ref(false)
const treeFilter = ref('')

const props = withDefaults(defineProps<{
  selectedId?: number
}>(), {
  selectedId: undefined
})

const emit = defineEmits<{
  'node-click': [node: OrgTreeNode]
}>()

interface FlatTreeNode {
  id: number
  name: string
  nodeType: string
  level: number
}

const flatTreeData = computed(() => {
  function flatten(nodes: OrgTreeNode[], level: number): FlatTreeNode[] {
    const result: FlatTreeNode[] = []
    for (const node of nodes) {
      result.push({ id: node.id, name: node.name, nodeType: node.nodeType, level })
      if (node.children && node.children.length > 0) {
        result.push(...flatten(node.children, level + 1))
      }
    }
    return result
  }
  return flatten(orgTreeData, 1)
})

const activeSelectedId = computed(() => props.selectedId ?? flatTreeData.value[0]?.id)

watch(treeFilter, (val) => {
  treeRef.value?.filter(val)
})

function handleNodeClick(data: OrgTreeNode) {
  emit('node-click', data)
}

function filterTreeNode(value: string, data: OrgTreeNode): boolean {
  if (!value) return true
  return data.name.includes(value)
}

function findNodeById(nodes: OrgTreeNode[], id: number): OrgTreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

function handleCollapsedItemClick(item: FlatTreeNode) {
  const node = findNodeById(orgTreeData, item.id)
  if (node) {
    emit('node-click', node)
    treeRef.value?.setCurrentKey(node.id)
  }
}

function getNodeTypeIcon(nodeType: string) {
  const icons: Record<string, any> = {
    root: HomeFilled,
    dept: OfficeBuilding,
    branch: FolderOpened,
    station: Monitor,
    company: Briefcase
  }
  return icons[nodeType] || Folder
}

function getNodeTypeColor(nodeType: string): string {
  const colors: Record<string, string> = {
    root: '#409EFF',
    dept: '#67C23A',
    branch: '#E6A23C',
    station: '#9B59B6',
    company: '#F56C6C'
  }
  return colors[nodeType] || '#909399'
}

function setCurrentKey(key: number) {
  treeRef.value?.setCurrentKey(key)
}

defineExpose({
  treeRef,
  setCurrentKey
})
</script>

<style lang="scss" scoped>
.tree-panel {
  width: 280px;
  flex-shrink: 0;
  align-self: stretch;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  transition: width 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &.collapsed {
    width: 84px;

    .collapsed-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 0;
      gap: 4px;
      flex: 1;
      width: 100%;

      .collapsed-expand-bar {
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        padding-bottom: 8px;
        border-bottom: 1px solid #EBEEF5;

        .expand-btn {
          color: #909399;
          font-size: 18px;
        }
      }

      .collapsed-list {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;

        &::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
      }

      .collapsed-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;

        &:first-child {
          margin-top: 8px;
        }

        &.active {
          .collapsed-icon-wrapper {
            box-shadow: 0 0 0 2px #409EFF;
            border-radius: 11px;
          }

          .collapsed-icon {
            width: 40px;
            height: 40px;
          }

          .collapsed-char {
            font-size: 18px;
          }
        }
      }

      .collapsed-icon-wrapper {
        position: relative;
        border-radius: 10px;
      }

      .collapsed-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.2s;

        &:hover { opacity: 0.85; }

        .collapsed-char {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          line-height: 1;
        }
      }

      .collapsed-level {
        position: absolute;
        top: -4px;
        right: -4px;
        font-size: 9px;
        color: #fff;
        font-weight: 600;
        background: #909399;
        border-radius: 8px;
        padding: 0 4px;
        min-width: 16px;
        text-align: center;
        height: 16px;
        line-height: 16px;
        z-index: 1;
        pointer-events: none;
      }
    }
  }

  .tree-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 16px 12px;
    border-bottom: 1px solid #EBEEF5;
  }

  .tree-title {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
  }

  .tree-search {
    margin-bottom: 12px;
  }

  .tree-body {
    padding: 12px;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .org-tree {
    flex: 1;
    overflow-y: auto;

    :deep(.el-tree-node__content) {
      height: 36px;
      border-radius: 6px;
      margin-bottom: 2px;
    }

    :deep(.el-tree-node.is-current > .el-tree-node__content) {
      background: #ECF5FF;
      color: #409EFF;
    }
  }

  .tree-node {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;

    .node-icon {
      font-size: 14px;
    }
  }
}
</style>
