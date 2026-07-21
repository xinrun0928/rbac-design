<template>
  <div class="org-tree-view">
    <!-- 页面头部 -->
    <div class="page-header animate-item">
      <div class="header-left">
        <h1><span class="title-bar"></span>组织架构树</h1>
        <span class="page-desc">广东省交通运输厅组织架构与成员信息</span>
      </div>
      <div class="header-right">
        <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
      </div>
    </div>

    <div class="main-content animate-item">
      <!-- 左侧：组织树列表 -->
      <div class="tree-panel" :class="{ collapsed: treeCollapsed }">
        <div class="tree-header">
          <span v-if="!treeCollapsed" class="tree-title">组织结构</span>
          <el-button
            :icon="treeCollapsed ? DArrowRight : DArrowLeft"
            link
            @click="treeCollapsed = !treeCollapsed"
            class="collapse-btn"
          />
        </div>
        <div v-if="!treeCollapsed" class="tree-body">
          <el-input
            v-model="treeFilter"
            placeholder="搜索组织名称"
            clearable
            :prefix-icon="Search"
            class="tree-search"
          />
          <el-tree
            ref="treeRef"
            :data="treeData"
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
                <el-icon class="node-icon" :class="getNodeIconClass(data.nodeType)">
                  <component :is="getNodeIcon(data.nodeType)" />
                </el-icon>
                <span class="node-label">{{ data.name }}</span>
                <span class="node-tag-right">
                  <el-tag
                    :color="getPackageTagColor(data.packageName)"
                    effect="dark"
                    style="border: none; color: #fff; font-size: 11px; height: 20px; padding: 0 8px;"
                    size="small"
                    round
                  >
                    {{ data.packageName }}
                  </el-tag>
                </span>
              </div>
            </template>
          </el-tree>
        </div>
      </div>

      <!-- 右侧：成员信息区域 -->
      <div class="detail-panel">
        <!-- 未选中状态 -->
        <div v-if="!currentNode" class="empty-state">
          <el-icon :size="80" color="#DCDFE6"><OfficeBuilding /></el-icon>
          <p class="empty-title">请选择左侧组织节点</p>
          <p class="empty-desc">点击左侧组织树中的节点，查看该组织的成员信息</p>
        </div>

        <!-- 选中状态：组织详情 -->
        <template v-else>
          <!-- 组织信息卡片 -->
          <el-card class="org-info-card" shadow="never">
            <div class="org-info-header">
              <div class="org-info-left">
                <div class="org-name-row">
                  <el-icon class="org-icon" :class="getNodeIconClass(currentNode.nodeType)">
                    <component :is="getNodeIcon(currentNode.nodeType)" />
                  </el-icon>
                  <h2 class="org-name">{{ currentNode.name }}</h2>
                  <el-tag
                    :color="getPackageTagColor(currentNode.packageName)"
                    effect="dark"
                    style="border: none; color: #fff;"
                    round
                  >
                    {{ currentNode.packageName }}
                  </el-tag>
                </div>
                <p class="org-desc">{{ currentNode.description }}</p>
              </div>
            </div>

            <!-- 统计卡片 -->
            <div class="stat-cards">
              <div class="stat-item">
                <div class="stat-value">{{ currentNode.members.length }}</div>
                <div class="stat-label">成员人数</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ getChildrenCount(currentNode) }}</div>
                <div class="stat-label">下属机构</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ getAllMembersCount(currentNode) }}</div>
                <div class="stat-label">总人员数</div>
              </div>
            </div>
          </el-card>

          <!-- 成员列表 -->
          <el-card class="member-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span class="card-title">
                  <el-icon><User /></el-icon>
                  成员列表
                </span>
                <span class="member-count">共 {{ currentNode.members.length }} 人</span>
              </div>
            </template>

            <div v-if="currentNode.members.length" class="member-grid">
              <div
                v-for="member in currentNode.members"
                :key="member.id"
                class="member-item"
              >
                <div class="member-avatar">
                  <el-icon :size="28"><User /></el-icon>
                </div>
                <div class="member-info">
                  <div class="member-name">{{ member.name }}</div>
                  <div class="member-position">
                    <el-tag size="small" effect="plain" round>{{ member.position }}</el-tag>
                  </div>
                  <div class="member-detail">
                    <div class="detail-row">
                      <el-icon><Phone /></el-icon>
                      <span>{{ member.phone }}</span>
                    </div>
                    <div class="detail-row">
                      <el-icon><Message /></el-icon>
                      <span>{{ member.email }}</span>
                    </div>
                    <div class="detail-row">
                      <el-icon><Tickets /></el-icon>
                      <span>{{ member.responsibility }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="no-members">
              <el-icon :size="48" color="#DCDFE6"><User /></el-icon>
              <p>该组织暂无成员信息</p>
            </div>
          </el-card>

          <!-- 子组织列表（如有） -->
          <el-card v-if="currentNode.children && currentNode.children.length" class="children-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span class="card-title">
                  <el-icon><OfficeBuilding /></el-icon>
                  下属机构
                </span>
                <span class="member-count">共 {{ currentNode.children.length }} 个</span>
              </div>
            </template>

            <div class="children-grid">
              <div
                v-for="child in currentNode.children"
                :key="child.id"
                class="child-item"
                @click="handleNodeClick(child)"
              >
                <div class="child-icon" :class="getNodeIconClass(child.nodeType)">
                  <el-icon :size="20">
                    <component :is="getNodeIcon(child.nodeType)" />
                  </el-icon>
                </div>
                <div class="child-info">
                  <div class="child-name">
                    {{ child.name }}
                    <el-tag
                      :color="getPackageTagColor(child.packageName)"
                      effect="dark"
                      style="border: none; color: #fff; font-size: 10px; height: 18px; padding: 0 6px; margin-left: 8px;"
                      size="small"
                      round
                    >
                      {{ child.packageName }}
                    </el-tag>
                  </div>
                  <div class="child-meta">
                    <span>{{ child.members.length }} 名成员</span>
                    <span v-if="child.children?.length">{{ child.children.length }} 个子机构</span>
                  </div>
                </div>
                <el-icon class="child-arrow"><ArrowRight /></el-icon>
              </div>
            </div>
          </el-card>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type ElTree from 'element-plus/es/components/tree'
import {
  Refresh, Search, DArrowLeft, DArrowRight,
  OfficeBuilding, User, Phone, Message, Tickets,
  ArrowRight, DataBoard, SetUp, Van, Place
} from '@element-plus/icons-vue'
import type { OrgTreeNode } from '../types/orgTree'
import { orgTreeData } from '../mock/orgTreeData'

// ── 状态 ──
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeCollapsed = ref(false)
const treeFilter = ref('')
const treeData = ref<OrgTreeNode[]>(orgTreeData)
const currentNode = ref<OrgTreeNode | null>(null)

// ── 树节点筛选 ──
watch(treeFilter, (val) => {
  treeRef.value?.filter(val)
})

// ── 方法 ──
function filterTreeNode(value: string, data: OrgTreeNode): boolean {
  if (!value) return true
  return data.name.includes(value)
}

function handleNodeClick(data: OrgTreeNode) {
  currentNode.value = data
}

function handleRefresh() {
  treeData.value = [...orgTreeData]
  currentNode.value = null
  treeFilter.value = ''
}

function getNodeIcon(nodeType: string) {
  const iconMap: Record<string, any> = {
    root: DataBoard,
    dept: OfficeBuilding,
    branch: SetUp,
    station: Van,
    company: Place
  }
  return iconMap[nodeType] || OfficeBuilding
}

function getNodeIconClass(nodeType: string): string {
  const classMap: Record<string, string> = {
    root: 'icon-root',
    dept: 'icon-dept',
    branch: 'icon-branch',
    station: 'icon-station',
    company: 'icon-company'
  }
  return classMap[nodeType] || 'icon-dept'
}

/** 套餐名称 → 标签颜色 */
function getPackageTagColor(packageName: string): string {
  const colorMap: Record<string, string> = {
    '省交通本级': '#409EFF',
    '交通': '#67C23A',
    '市交通': '#19A576',
    '县交通': '#20B2AA',
    '省事务中心': '#E6A23C',
    '事务中心': '#EBBB28',
    '市事务中心': '#F0C040',
    '县事务中心': '#F5D060',
    '省交通公司': '#9B59B6',
    '公司': '#8E44AD',
    '监控中心': '#E74C3C',
    '高速公路': '#3498DB',
    '普通公路': '#95A5A6'
  }
  return colorMap[packageName] || '#909399'
}

function getChildrenCount(node: OrgTreeNode): number {
  return node.children?.length || 0
}

function getAllMembersCount(node: OrgTreeNode): number {
  let count = node.members.length
  if (node.children) {
    for (const child of node.children) {
      count += getAllMembersCount(child)
    }
  }
  return count
}
</script>

<style lang="scss" scoped>
.org-tree-view {
  padding: 24px;
  background: linear-gradient(160deg, #F5F7FA 0%, #E8ECF1 100%);
  min-height: 100vh;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;

  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;
    &:nth-child(1) { animation-delay: 0.05s; }
    &:nth-child(2) { animation-delay: 0.15s; }
  }

  // 头部
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    padding: 24px 28px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);

    .header-left h1 {
      font-size: 22px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 8px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .title-bar {
      width: 4px; height: 22px;
      background: linear-gradient(180deg, #409EFF, #66B1FF);
      border-radius: 2px;
      display: inline-block;
    }
    .page-desc { font-size: 13px; color: #909399; padding-left: 14px; }
  }

  // 主内容区：左树右详情
  .main-content {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  // 左侧树面板 — 宽度增至 420px
  .tree-panel {
    width: 420px;
    flex-shrink: 0;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    transition: width 0.3s ease;
    overflow: hidden;

    &.collapsed { width: 48px; }

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

    .tree-body {
      padding: 12px;
    }

    .tree-search {
      margin-bottom: 12px;
    }

    .org-tree {
      max-height: calc(100vh - 320px);
      overflow-y: auto;

      :deep(.el-tree-node__content) {
        height: 40px;
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
      flex: 1;
      min-width: 0;

      .node-icon {
        font-size: 16px;
        flex-shrink: 0;

        &.icon-root { color: #E6A23C; }
        &.icon-dept { color: #409EFF; }
        &.icon-branch { color: #67C23A; }
        &.icon-station { color: #909399; }
        &.icon-company { color: #9B59B6; }
      }

      .node-label {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .node-tag-right {
        flex-shrink: 0;
        margin-left: auto;
      }
    }
  }

  // 右侧详情区
  .detail-panel {
    flex: 1;
    min-width: 0;
  }

  // 空状态
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 500px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);

    .empty-title {
      font-size: 18px;
      color: #606266;
      margin: 20px 0 8px;
      font-weight: 500;
    }
    .empty-desc {
      font-size: 14px;
      color: #909399;
    }
  }

  // 组织信息卡片
  .org-info-card {
    border-radius: 12px;
    border: none;
    margin-bottom: 16px;

    :deep(.el-card__body) { padding: 24px; }

    .org-info-header {
      margin-bottom: 20px;
    }

    .org-name-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;

      .org-icon {
        font-size: 28px;

        &.icon-root { color: #E6A23C; }
        &.icon-dept { color: #409EFF; }
        &.icon-branch { color: #67C23A; }
        &.icon-station { color: #909399; }
        &.icon-company { color: #9B59B6; }
      }

      .org-name {
        font-size: 20px;
        font-weight: 600;
        color: #303133;
        margin: 0;
      }
    }

    .org-desc {
      font-size: 14px;
      color: #909399;
      margin: 0;
      padding-left: 38px;
    }

    .stat-cards {
      display: flex;
      gap: 16px;
      padding-top: 20px;
      border-top: 1px solid #EBEEF5;
    }

    .stat-item {
      flex: 1;
      text-align: center;
      padding: 16px;
      background: #F5F7FA;
      border-radius: 8px;

      .stat-value {
        font-size: 28px;
        font-weight: 700;
        color: #409EFF;
        line-height: 1.2;
      }
      .stat-label {
        font-size: 13px;
        color: #909399;
        margin-top: 6px;
      }
    }
  }

  // 成员卡片
  .member-card {
    border-radius: 12px;
    border: none;
    margin-bottom: 16px;

    :deep(.el-card__header) {
      padding: 16px 24px;
      border-bottom: 1px solid #EBEEF5;
    }
    :deep(.el-card__body) { padding: 20px 24px; }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 600;
      color: #303133;
    }

    .member-count {
      font-size: 13px;
      color: #909399;
      background: #F0F2F5;
      padding: 4px 12px;
      border-radius: 6px;
    }

    .member-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 16px;
    }

    .member-item {
      display: flex;
      gap: 16px;
      padding: 20px;
      background: #F5F7FA;
      border-radius: 10px;
      transition: all 0.3s ease;

      &:hover {
        background: #ECF5FF;
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
        transform: translateY(-2px);
      }
    }

    .member-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #409EFF, #66B1FF);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      flex-shrink: 0;
    }

    .member-info {
      flex: 1;
      min-width: 0;
    }

    .member-name {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 4px;
    }

    .member-position {
      margin-bottom: 12px;
    }

    .member-detail {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .detail-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 13px;
      color: #606266;

      .el-icon {
        color: #909399;
        margin-top: 2px;
        flex-shrink: 0;
      }
    }

    .no-members {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 0;

      p {
        font-size: 14px;
        color: #909399;
        margin-top: 12px;
      }
    }
  }

  // 子组织卡片
  .children-card {
    border-radius: 12px;
    border: none;

    :deep(.el-card__header) {
      padding: 16px 24px;
      border-bottom: 1px solid #EBEEF5;
    }
    :deep(.el-card__body) { padding: 20px 24px; }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 600;
      color: #303133;
    }

    .member-count {
      font-size: 13px;
      color: #909399;
      background: #F0F2F5;
      padding: 4px 12px;
      border-radius: 6px;
    }

    .children-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .child-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 20px;
      background: #F5F7FA;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #ECF5FF;
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
        transform: translateX(4px);
      }
    }

    .child-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.icon-root { background: #FDF6EC; color: #E6A23C; }
      &.icon-dept { background: #ECF5FF; color: #409EFF; }
      &.icon-branch { background: #F0F9EB; color: #67C23A; }
      &.icon-station { background: #F4F4F5; color: #909399; }
      &.icon-company { background: #F5ECF8; color: #9B59B6; }
    }

    .child-info {
      flex: 1;
      min-width: 0;
    }

    .child-name {
      font-size: 15px;
      font-weight: 600;
      color: #303133;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .child-meta {
      font-size: 13px;
      color: #909399;
      margin-top: 4px;

      span + span::before {
        content: '·';
        margin: 0 8px;
      }
    }

    .child-arrow {
      color: #C0C4CC;
      font-size: 16px;
      flex-shrink: 0;
      transition: transform 0.3s ease;

      .child-item:hover & {
        color: #409EFF;
        transform: translateX(4px);
      }
    }
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
