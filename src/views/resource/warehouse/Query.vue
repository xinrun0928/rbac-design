<template>
  <div class="inventory-query-page">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部筛选卡片 -->
      <StatsCards v-model="currentCategory" :items="statsCards" @change="handleCategoryChange" />

      <!-- 维保状态筛选 -->
      <div class="search-bar">
        <div class="search-bar-filter">
          <span class="filter-label">维保状态：</span>
          <el-link
            v-for="tab in statusTabs"
            :key="tab.value"
            class="filter-link"
            :underline="false"
            :type="currentMaintenanceStatus === tab.value ? 'primary' : 'info'"
            @click="handleMaintenanceStatusChange(tab.value)"
          >{{ tab.label }}</el-link>
        </div>
      </div>

      <!-- 记录数 + 标签页 + 操作按钮 -->
      <div class="content-header">
        <div class="content-header-left">
          <el-radio-group v-model="activeTab" size="default" @change="handleTabChange">
            <el-radio-button value="summary">品类汇总</el-radio-button>
            <el-radio-button value="detail">物资明细</el-radio-button>
          </el-radio-group>
        </div>

        <div class="content-header-right">
          <el-input
            v-model="searchKeyword"
            placeholder="输入关键字快速搜索"
            clearable
            :prefix-icon="Search"
            style="width: 200px; margin-right: 12px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-dropdown trigger="click" @command="handleAddCommand">
            <el-button type="primary" :icon="Plus">添加设备/物资</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="deviceIn">设备/物资入库</el-dropdown-item>
                <el-dropdown-item command="batchIn">批量导入</el-dropdown-item>
                <el-dropdown-item command="permission">管理权限</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 品类汇总表格 -->
      <SummaryTable
        v-if="activeTab === 'summary'"
        :data="filteredData as InventorySummary[]"
        :loading="loading"
        @show-detail="handleShowSummaryDetail"
        @edit="handleEdit"
        @delete="handleDelete"
      />

      <!-- 物资明细表格 -->
      <DetailTable
        v-if="activeTab === 'detail'"
        :data="filteredData as InventoryDetail[]"
        :loading="loading"
        @show-detail="handleShowDetailDetail"
        @edit="handleEdit"
        @delete="handleDelete"
      />

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 设备详情抽屉 -->
    <el-drawer
      v-model="detailVisible"
      :title="''"
      size="70%"
      direction="rtl"
      destroy-on-close
    >
      <template #header>
        <div class="detail-drawer-header">
          <h3 class="detail-title">{{ currentDetail?.name || '' }}</h3>
        </div>
      </template>

      <!-- 品类汇总详情头部 -->
      <div v-if="activeTab === 'summary'" class="detail-header">
        <div class="detail-info">
          <div class="detail-info-row">
            <span class="detail-meta">{{ currentSummaryDetail?.category || '' }}</span>
            <span class="detail-meta">消耗类/非消耗类</span>
            <span class="detail-meta">数量：<b>{{ currentSummaryDetail?.stockQuantity }}</b></span>
            <span class="detail-meta">存放位置：{{ currentSummaryDetail?.location }}</span>
            <span class="detail-meta">维保状态：
              <el-link v-if="currentSummaryDetail?.pendingCount" type="danger" :underline="false">待维保（{{ currentSummaryDetail.pendingCount }}台）</el-link>
              <el-link v-else type="success" :underline="false">已维保</el-link>
            </span>
          </div>
          <div class="detail-info-row">
            <span class="detail-meta">型号规格：{{ currentSummaryDetail?.spec }}</span>
          </div>
        </div>
      </div>

      <!-- 物资明细详情头部 -->
      <div v-if="activeTab === 'detail' && currentDetailDetail" class="detail-header material-detail-header">
        <div class="detail-info">
          <div class="detail-info-row">
            <span class="detail-meta">{{ currentDetailDetail.category }}</span>
            <span class="detail-meta">型号规格：{{ currentDetailDetail.spec }}</span>
            <span class="detail-meta">维保状态：
              <el-link v-if="currentDetailDetail.pendingCount" type="danger" :underline="false">待维保（{{ currentDetailDetail.pendingCount }}台）</el-link>
              <el-link v-else type="success" :underline="false">已维保</el-link>
            </span>
          </div>
          <div class="detail-info-row">
            <span class="detail-meta">编号：<b>{{ currentDetailDetail.code }}</b></span>
            <span class="detail-meta">序列号：{{ currentDetailDetail.serialNumber }}</span>
            <span class="detail-meta">存放位置：{{ currentDetailDetail.location }}</span>
          </div>
          <div class="detail-info-row">
            <span class="detail-meta">装备物资保险：{{ currentDetailDetail.insurance }}</span>
            <span v-if="currentDetailDetail.insuranceExpiring" class="insurance-expiring">（即将过期）</span>
            <span v-else-if="currentDetailDetail.insuranceExpired" class="insurance-expired">（已过期）</span>
            <el-link type="primary" :underline="false" @click="handleOpenInsuranceRenewal">保险续期>></el-link>
          </div>
          <div class="detail-info-row">
            <span class="detail-meta">相关附件：</span>
            <el-link type="primary" :underline="false">设备图.png</el-link>
            <el-link type="primary" :underline="false">采购发票.pdf</el-link>
            <el-link type="primary" :underline="false">使用说明书.pdf</el-link>
          </div>
          <div class="detail-info-row">
            <span class="detail-meta">累计使用时长：138小时</span>
            <el-link type="primary" :underline="false">设置预警阈值>></el-link>
          </div>
        </div>
      </div>

      <el-tabs v-model="detailTab">
        <el-tab-pane v-if="activeTab === 'summary'" label="设备/物资清单" name="devices">
          <div class="detail-section detail-section-flex">
            <div class="section-title">物资/装备清单</div>
            <div class="section-toolbar">
              <span>共{{ deviceTotal }}条数据</span>
              <div class="section-toolbar-right">
                <el-select v-model="deviceStatusFilter" placeholder="全部维保状态" style="width: 140px; margin-right: 12px" clearable>
                  <el-option label="全部维保状态" value="" />
                  <el-option label="待维保" value="待维保" />
                  <el-option label="已维保" value="已维保" />
                </el-select>
                <el-input
                  v-model="deviceSearch"
                  placeholder="输入关键字快速搜索"
                  clearable
                  :prefix-icon="Search"
                  style="width: 200px"
                />
              </div>
            </div>
            <el-table
              :data="pagedDeviceRecords"
              border
              stripe
              height="100%"
              :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
            >
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="code" label="装备/物资编号" min-width="180" align="center">
                <template #default="{ row }">
                  <el-link type="primary" :underline="false">{{ row.code }}</el-link>
                </template>
              </el-table-column>
              <el-table-column prop="inDate" label="入库日期" width="120" align="center" />
              <el-table-column prop="useCount" label="调用次数" width="100" align="center" />
              <el-table-column prop="status" label="状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag v-if="row.status === '在库'" type="success" effect="light" round>{{ row.status }}</el-tag>
                  <el-tag v-else-if="row.status === '在用'" type="primary" effect="light" round>{{ row.status }}</el-tag>
                  <el-tag v-else-if="row.status === '维修'" type="warning" effect="light" round>{{ row.status }}</el-tag>
                  <el-tag v-else type="info" effect="light" round>{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="maintenanceStatus" label="维保状态" width="100" align="center">
                <template #default="{ row }">
                  <span v-if="row.maintenanceStatus === '-'">-</span>
                  <el-link v-else-if="row.maintenanceStatus === '待维保'" type="danger" :underline="false">{{ row.maintenanceStatus }}</el-link>
                  <el-link v-else type="success" :underline="false">{{ row.maintenanceStatus }}</el-link>
                </template>
              </el-table-column>
              <el-table-column label="相关附件" width="100" align="center">
                <template #default>
                  <el-icon class="attachment-icon"><Paperclip /></el-icon>
                </template>
              </el-table-column>
              <el-table-column prop="lastMaintenanceDate" label="最近维保日期" width="130" align="center" />
              <el-table-column prop="nextMaintenanceDate" label="下次维保日期" width="130" align="center" />
              <el-table-column prop="purchaseDate" label="采购日期" width="130" align="center" />
              <el-table-column prop="validityPeriod" label="生产/有效期" min-width="180" align="center" show-overflow-tooltip />
            </el-table>
            <div class="pagination-wrapper">
              <el-pagination
                v-model:current-page="devicePagination.page"
                v-model:page-size="devicePagination.pageSize"
                :total="deviceTotal"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                background
                @size-change="handleDeviceSizeChange"
                @current-change="handleDevicePageChange"
              />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane v-if="activeTab === 'detail'" label="维保记录" name="maintenance">
          <div class="detail-section detail-section-flex">
            <div class="section-title">维保记录</div>
            <div class="section-toolbar">
              <span>共{{ maintenanceTotal }}条数据</span>
              <div class="section-toolbar-right">
                <el-select v-model="maintenanceStatusFilter" placeholder="全部维保状态" style="width: 140px; margin-right: 12px" clearable>
                  <el-option label="全部维保状态" value="" />
                  <el-option label="待维保" value="待维保" />
                  <el-option label="已完成" value="已完成" />
                </el-select>
                <el-input
                  v-model="maintenanceSearch"
                  placeholder="输入关键字快速搜索"
                  clearable
                  :prefix-icon="Search"
                  style="width: 200px"
                />
              </div>
            </div>
            <el-table
              :data="pagedMaintenanceRecords"
              border
              stripe
              height="100%"
              :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
            >
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="date" label="维保日期" width="130" align="center" />
              <el-table-column prop="code" label="维保单编号" min-width="180" align="center">
                <template #default="{ row }">
                  <el-link type="primary" :underline="false">{{ row.code }}</el-link>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag v-if="row.status === '待维保'" type="warning" effect="light" round>{{ row.status }}</el-tag>
                  <el-tag v-else type="success" effect="light" round>{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="result" label="维保结果" width="100" align="center">
                <template #default="{ row }">
                  <span v-if="row.result === '正常'" style="color: #67C23A">{{ row.result }}</span>
                  <span v-else-if="row.result === '存在故障'" style="color: #F56C6C">{{ row.result }}</span>
                  <span v-else>{{ row.result }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="maintainer" label="维保人" width="100" align="center" />
              <el-table-column label="相关附件" width="100" align="center">
                <template #default>
                  <el-icon class="attachment-icon"><Paperclip /></el-icon>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-wrapper">
              <el-pagination
                v-model:current-page="maintenancePagination.page"
                v-model:page-size="maintenancePagination.pageSize"
                :total="maintenanceTotal"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                background
                @size-change="handleMaintenanceSizeChange"
                @current-change="handleMaintenancePageChange"
              />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane v-if="activeTab === 'detail'" label="保险续期记录" name="insurance">
          <div class="detail-section detail-section-flex">
            <div class="section-title">保险续期记录</div>
            <div class="section-toolbar">
              <span>共{{ insuranceTotal }}条数据</span>
              <div class="section-toolbar-right">
                <el-select v-model="insuranceStatusFilter" placeholder="全部保险状态" style="width: 140px; margin-right: 12px" clearable>
                  <el-option label="全部保险状态" value="" />
                  <el-option label="即将过期" value="即将过期" />
                  <el-option label="已过期" value="已过期" />
                  <el-option label="有效" value="有效" />
                </el-select>
                <el-input
                  v-model="insuranceSearch"
                  placeholder="输入关键字快速搜索"
                  clearable
                  :prefix-icon="Search"
                  style="width: 200px"
                />
              </div>
            </div>
            <el-table
              :data="pagedInsuranceRecords"
              border
              stripe
              height="100%"
              :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
            >
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="period" label="保险有效期" min-width="180" align="center" />
              <el-table-column prop="registerDate" label="续保登记日期" width="130" align="center" />
              <el-table-column prop="policyCode" label="保单编号" min-width="160" align="center">
                <template #default="{ row }">
                  <el-link type="primary" :underline="false">{{ row.policyCode }}</el-link>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100" align="center">
                <template #default="{ row }">
                  <span v-if="row.status === '即将过期'" style="color: #E6A23C">{{ row.status }}</span>
                  <span v-else-if="row.status === '已过期'" style="color: #F56C6C">{{ row.status }}</span>
                  <span v-else style="color: #67C23A">{{ row.status }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="maintainer" label="维保人" width="100" align="center" />
              <el-table-column label="相关附件" width="100" align="center">
                <template #default>
                  <el-icon class="attachment-icon"><Paperclip /></el-icon>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" width="100" align="center" />
            </el-table>
            <div class="pagination-wrapper">
              <el-pagination
                v-model:current-page="insurancePagination.page"
                v-model:page-size="insurancePagination.pageSize"
                :total="insuranceTotal"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                background
                @size-change="handleInsuranceSizeChange"
                @current-change="handleInsurancePageChange"
              />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="出入库记录" name="records">
          <div class="detail-section">
            <div class="section-title">出入库记录</div>
            <div class="section-toolbar">
              <span>共{{ ioRecords.length }}条数据</span>
              <div class="section-toolbar-right">
                <el-select v-model="ioTypeFilter" placeholder="全部" style="width: 140px; margin-right: 12px" clearable>
                  <el-option label="全部" value="" />
                  <el-option label="调出" value="调出" />
                  <el-option label="调入" value="调入" />
                  <el-option label="盘盈" value="盘盈" />
                  <el-option label="采购" value="采购" />
                  <el-option label="报废" value="报废" />
                  <el-option label="盘亏" value="盘亏" />
                </el-select>
                <el-input
                  v-model="ioSearch"
                  placeholder="输入关键字快速搜索"
                  clearable
                  :prefix-icon="Search"
                  style="width: 200px"
                />
              </div>
            </div>

            <div class="io-timeline">
              <div v-for="(record, idx) in filteredIoRecords" :key="idx" class="io-date-group">
                <div class="io-date-header">
                  <div class="io-date-dot" />
                  <span class="io-date-text">{{ record.date }}</span>
                </div>
                <div class="io-record-card">
                  <div class="io-time">{{ record.time }}</div>
                  <div class="io-record-content">
                    <div class="io-record-top">
                      <el-tag :type="record.typeColor" effect="light" round>{{ record.type }}</el-tag>
                      <span>数量：<b>{{ record.quantity }}台</b></span>
                      <span>操作人：<b>{{ record.operator }}</b>（{{ record.phone }}）</span>
                      <span>备注：<b>{{ record.remark }}</b></span>
                    </div>
                    <div v-if="record.attachment" class="io-record-attachment">
                      相关附件：<el-link type="primary" :underline="false">{{ record.attachment }}</el-link>
                    </div>
                    <div class="io-record-codes">
                      <table class="codes-table">
                        <thead>
                          <tr>
                            <th>序号</th>
                            <th>装备/物资编号</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(code, ci) in record.codes" :key="ci">
                            <td>{{ ci + 1 }}</td>
                            <td>{{ code }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <el-button type="warning" @click="handleOutStock">出库</el-button>
        <el-button type="primary" @click="handleInStock">入库</el-button>
      </template>
    </el-drawer>

    <!-- 设备入库抽屉 -->
    <el-drawer v-model="deviceInVisible" title="设备入库" size="40%" direction="rtl" destroy-on-close>
      <el-form ref="deviceInFormRef" :model="deviceInForm" :rules="deviceInRules" label-width="120px">
        <el-form-item label="装备/物资名称" prop="name">
          <el-select v-model="deviceInForm.name" placeholder="请选择" class="form-input" filterable>
            <el-option v-for="name in materialNameOptions" :key="name" :label="name" :value="name" />
          </el-select>
        </el-form-item>
        <div class="form-tip-link">
          <el-link type="primary" :underline="false" @click="goToCategory">没有对应物资/设备？去添加>></el-link>
        </div>

        <el-form-item label="序列号" prop="serialNumber">
          <el-input v-model="deviceInForm.serialNumber" placeholder="请输入" class="form-input" />
        </el-form-item>

        <el-form-item label="来源" prop="source">
          <el-radio-group v-model="deviceInForm.source">
            <el-radio value="库存盘点">库存盘点</el-radio>
            <el-radio value="采购">采购</el-radio>
            <el-radio value="调拨">调拨</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="型号规格" prop="spec">
          <el-input v-model="deviceInForm.spec" placeholder="请输入" class="form-input" />
        </el-form-item>

        <el-form-item label="单位" prop="unit">
          <el-select v-model="deviceInForm.unit" placeholder="请选择" class="form-input">
            <el-option v-for="u in unitOptions" :key="u" :label="u" :value="u" />
          </el-select>
        </el-form-item>

        <el-form-item label="装备/物资保险" prop="insurance">
          <el-date-picker
            v-model="deviceInForm.insurance"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            class="form-input"
            :disabled="deviceInForm.noInsurance"
          />
        </el-form-item>
        <div class="form-tip-link" style="margin-top: -8px; margin-bottom: 16px; margin-left: 120px;">
          <el-checkbox v-model="deviceInForm.noInsurance">暂无保险</el-checkbox>
        </div>

        <el-form-item label="存放位置" prop="location">
          <el-input v-model="deviceInForm.location" placeholder="请输入" class="form-input" />
        </el-form-item>

        <el-form-item label="相关附件">
          <el-link type="primary" :underline="false" :icon="Paperclip">添加</el-link>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="deviceInVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDeviceInSubmit">入库</el-button>
      </template>
    </el-drawer>

    <!-- 批量入库抽屉 -->
    <el-drawer v-model="batchInVisible" title="批量入库" size="40%" direction="rtl" destroy-on-close>
      <div class="batch-in-content">
        <div class="batch-step">
          <div class="batch-step-title">第一步：下载模板进行填写或已有清单进行批量修改（请严格按格式填写）</div>
          <el-link type="primary" :underline="false" :icon="Download" @click="handleDownloadTemplate">下载模板</el-link>
        </div>
        <div class="batch-step">
          <div class="batch-step-title">第二步：上传填好的文件</div>
          <el-upload
            class="batch-upload"
            drag
            action="#"
            :auto-upload="false"
          >
            <el-icon class="upload-icon" :size="40"><UploadFilled /></el-icon>
            <div class="upload-text">将文件拖到此处，或<el-link type="primary" :underline="false">点击上传</el-link></div>
          </el-upload>
        </div>
      </div>

      <template #footer>
        <el-button @click="batchInVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBatchInSubmit">入库</el-button>
      </template>
    </el-drawer>

    <!-- 权限管理抽屉 -->
    <el-drawer v-model="permissionVisible" title="权限管理" size="550px" direction="rtl" destroy-on-close>
      <el-form ref="permissionFormRef" :model="permissionForm" :rules="permissionRules" label-width="110px">
        <el-form-item label="权限配置名称" prop="name">
          <el-input v-model="permissionForm.name" placeholder="请输入" class="form-input" />
        </el-form-item>

        <el-form-item label="关联附件类型" prop="attachmentType">
          <el-radio-group v-model="permissionForm.attachmentType">
            <el-radio value="全部">全部</el-radio>
            <el-radio value="仅图片">仅图片</el-radio>
            <el-radio value="仅文档">仅文档</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="授权对象类型" prop="targetObjectType">
          <el-select v-model="permissionForm.targetObjectType" placeholder="请选择" class="form-input">
            <el-option v-for="t in targetObjectTypeOptions" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>

        <el-form-item label="权限角色" prop="role">
          <el-select v-model="permissionForm.role" placeholder="请选择" class="form-input">
            <el-option v-for="r in roleOptions" :key="r" :label="r" :value="r" />
          </el-select>
        </el-form-item>

        <el-form-item label="允许操作类型" prop="operations">
          <el-checkbox-group v-model="permissionForm.operations">
            <el-checkbox label="查看" value="查看" />
            <el-checkbox label="下载" value="下载" />
            <el-checkbox label="编辑" value="编辑" />
            <el-checkbox label="删除" value="删除" />
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="装备范围明细" prop="scope">
          <el-select v-model="permissionForm.scope" placeholder="请输入" class="form-input">
            <el-option v-for="s in scopeOptions" :key="s" :label="s" :value="s" />
          </el-select>
        </el-form-item>

        <el-form-item label="生效时间" prop="effectiveTime">
          <el-date-picker v-model="permissionForm.effectiveTime" type="date" placeholder="请选择日期" class="form-input" value-format="YYYY-MM-DD" />
        </el-form-item>

        <el-form-item label="失效时间" prop="expireTime">
          <el-date-picker v-model="permissionForm.expireTime" type="date" placeholder="请选择日期" class="form-input" value-format="YYYY-MM-DD" />
        </el-form-item>

        <el-form-item label="过期处理方式" prop="expireAction">
          <el-select v-model="permissionForm.expireAction" placeholder="请选择日期" class="form-input">
            <el-option label="自动延期" value="自动延期" />
            <el-option label="自动停用" value="自动停用" />
            <el-option label="通知管理员" value="通知管理员" />
          </el-select>
        </el-form-item>

        <el-form-item label="授权人" prop="grantor">
          <el-select v-model="permissionForm.grantor" placeholder="请选择" class="form-input">
            <el-option label="张三" value="张三" />
            <el-option label="李四" value="李四" />
            <el-option label="王五" value="王五" />
          </el-select>
        </el-form-item>

        <el-form-item label="授权时间" prop="grantTime">
          <el-date-picker v-model="permissionForm.grantTime" type="date" placeholder="请选择日期" class="form-input" value-format="YYYY-MM-DD" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="permissionVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePermissionSubmit">确定</el-button>
      </template>
    </el-drawer>

    <!-- 入库抽屉 -->
    <el-drawer v-model="inStockVisible" title="入库" size="50%" direction="rtl" destroy-on-close>
      <el-form ref="inStockFormRef" :model="inStockForm" :rules="inStockRules" label-width="130px">
        <el-form-item label="入库类型" prop="type">
          <el-radio-group v-model="inStockForm.type">
            <el-radio value="调入">调入</el-radio>
            <el-radio value="采购">采购</el-radio>
            <el-radio value="盘盈">盘盈</el-radio>
            <el-radio value="归还">归还</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="装备/物资编号" prop="codes" required>
          <div class="code-input-list">
            <div v-for="(code, index) in inStockForm.codes" :key="index" class="code-input-row">
              <span class="code-index">{{ index + 1 }}</span>
              <el-input v-model="inStockForm.codes[index]" placeholder="请输入" class="code-input" />
              <el-button
                type="danger"
                link
                :icon="CircleCloseFilled"
                @click="removeInCode(index)"
              />
              <el-button
                v-if="index === inStockForm.codes.length - 1"
                type="primary"
                link
                :icon="CirclePlusFilled"
                @click="addInCode"
              />
            </div>
          </div>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="inStockForm.remark" type="textarea" :rows="3" placeholder="描述检查对象，让大模型更好的理解它" class="form-input" />
        </el-form-item>

        <el-form-item label="相关附件">
          <el-link type="primary" :underline="false" :icon="Paperclip">添加</el-link>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="inStockVisible = false">取消</el-button>
        <el-button type="primary" @click="handleInStockSubmit">确认</el-button>
      </template>
    </el-drawer>

    <!-- 出库抽屉 -->
    <el-drawer v-model="outStockVisible" title="出库" size="50%" direction="rtl" destroy-on-close>
      <el-form ref="outStockFormRef" :model="outStockForm" :rules="outStockRules" label-width="130px">
        <el-form-item label="出库类型" prop="type">
          <el-radio-group v-model="outStockForm.type">
            <el-radio value="调出">调出</el-radio>
            <el-radio value="报废">报废</el-radio>
            <el-radio value="盘亏">盘亏</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="装备/物资编号" prop="codes" required>
          <div class="code-input-list">
            <div v-for="(code, index) in outStockForm.codes" :key="index" class="code-input-row">
              <span class="code-index">{{ index + 1 }}</span>
              <el-input v-model="outStockForm.codes[index]" placeholder="请输入" class="code-input" />
              <el-button
                type="danger"
                link
                :icon="CircleCloseFilled"
                @click="removeOutCode(index)"
              />
              <el-button
                v-if="index === outStockForm.codes.length - 1"
                type="primary"
                link
                :icon="CirclePlusFilled"
                @click="addOutCode"
              />
            </div>
          </div>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="outStockForm.remark" type="textarea" :rows="3" placeholder="描述检查对象，让大模型更好的理解它" class="form-input" />
        </el-form-item>

        <el-form-item label="相关附件">
          <el-link type="primary" :underline="false" :icon="Paperclip">添加</el-link>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="outStockVisible = false">取消</el-button>
        <el-button type="primary" @click="handleOutStockSubmit">确认</el-button>
      </template>
    </el-drawer>

    <!-- 保险续期抽屉 -->
    <InsuranceRenewalDrawer
      v-model="insuranceRenewalVisible"
      :row-data="insuranceRenewalRow"
      @submit="handleInsuranceRenewalSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Search, Plus, Reading, Box, Tools, Operation, MoreFilled,
  Paperclip, Download, UploadFilled, CircleCloseFilled, CirclePlusFilled
} from '@element-plus/icons-vue'
import {
  inventorySummaryData, inventoryDetailData, deviceRecordData, ioRecordData,
  materialNameOptions, unitOptions,
  targetObjectTypeOptions, roleOptions, scopeOptions,
  maintenanceRecordData, insuranceRecordData
} from '@/mock/resource/warehouseData'
import type {
  InventorySummary, InventoryDetail, DeviceRecord, IoRecord,
  DeviceInForm, PermissionForm, StockInForm, StockOutForm,
  SourceType, AttachmentType, InType, OutType,
  MaintenanceRecord, InsuranceRecord
} from '@/types/resource/warehouse'
import SummaryTable from './query/SummaryTable.vue'
import DetailTable from './query/DetailTable.vue'
import InsuranceRenewalDrawer from './query/InsuranceRenewalDrawer.vue'
import StatsCards from '@/components/StatsCards.vue'

const loading = ref(false)
const router = useRouter()

function goToCategory() {
  deviceInVisible.value = false
  router.push('/resource/basic/category')
}

// ── 标签页 ──
const activeTab = ref<'summary' | 'detail'>('summary')

// ── 筛选 ──
const currentCategory = ref('all')
const currentMaintenanceStatus = ref<'all' | 'pending' | 'done'>('all')
const searchKeyword = ref('')

const statusTabs = [
  { label: '全部', value: 'all' },
  { label: '待维保', value: 'pending' },
  { label: '已维保', value: 'done' }
]

// ── 分页 ──
const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

// ── 统计卡片 ──
const statsCards = computed(() => {
  const data = activeTab.value === 'summary' ? inventorySummaryData : inventoryDetailData
  const getCategory = (item: InventorySummary | InventoryDetail) => {
    const cat = ('category' in item && (item as InventorySummary).category) ? (item as InventorySummary).category : (item as InventoryDetail).category
    if (cat.includes('基本生活')) return '基本生活保障物资'
    if (cat.includes('应急')) return '应急装备及配套物资'
    if (cat.includes('工程')) return '工程材料与机械加工'
    return '其他'
  }
  return [
    { key: 'all', label: '全部', value: data.length, icon: Reading, color: '#409EFF', bgColor: '#ecf5ff' },
    { key: '基本生活保障物资', label: '基本生活保障物资', value: data.filter(d => getCategory(d) === '基本生活保障物资').length, icon: Box, color: '#67C23A', bgColor: '#f0f9eb' },
    { key: '应急装备及配套物资', label: '应急装备及配套物资', value: data.filter(d => getCategory(d) === '应急装备及配套物资').length, icon: Tools, color: '#E6A23C', bgColor: '#fdf6ec' },
    { key: '工程材料与机械加工', label: '工程材料与机械加工', value: data.filter(d => getCategory(d) === '工程材料与机械加工').length, icon: Operation, color: '#F56C6C', bgColor: '#fef0f0' },
    { key: '其他', label: '其他', value: data.filter(d => getCategory(d) === '其他').length, icon: MoreFilled, color: '#909399', bgColor: '#f4f4f5' }
  ]
})

// ── 品类汇总过滤 ──
const summaryFilteredData = computed(() => {
  let data = [...inventorySummaryData]
  if (currentCategory.value !== 'all') {
    data = data.filter(item => item.category === currentCategory.value)
  }
  if (currentMaintenanceStatus.value === 'pending') {
    data = data.filter(item => item.maintenanceStatus === '待维保')
  } else if (currentMaintenanceStatus.value === 'done') {
    data = data.filter(item => item.maintenanceStatus === '已维保')
  }
  if (searchKeyword.value) {
    data = data.filter(item => item.name.includes(searchKeyword.value) || item.type.includes(searchKeyword.value))
  }
  return data
})

// ── 物资明细过滤 ──
const detailFilteredData = computed(() => {
  let data = [...inventoryDetailData]
  if (currentMaintenanceStatus.value === 'pending') {
    data = data.filter(item => item.maintenanceStatus === '待维保')
  } else if (currentMaintenanceStatus.value === 'done') {
    data = data.filter(item => item.maintenanceStatus === '已维保')
  }
  if (searchKeyword.value) {
    data = data.filter(item => item.name.includes(searchKeyword.value) || item.code.includes(searchKeyword.value) || item.serialNumber.includes(searchKeyword.value))
  }
  return data
})

const filteredData = computed(() => {
  const data = activeTab.value === 'summary' ? summaryFilteredData.value : detailFilteredData.value
  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

function handleCategoryChange(key: string) {
  currentCategory.value = key
  pagination.page = 1
}

function handleMaintenanceStatusChange(value: string) {
  currentMaintenanceStatus.value = value as 'all' | 'pending' | 'done'
  pagination.page = 1
}

function handleTabChange() {
  pagination.page = 1
  currentCategory.value = 'all'
}

function handleSearch() { pagination.page = 1 }
function handleSizeChange(size: number) { pagination.pageSize = size; pagination.page = 1 }
function handlePageChange(page: number) { pagination.page = page }

// ── 添加设备/物资 ──
function handleAddCommand(command: string) {
  if (command === 'deviceIn') {
    deviceInVisible.value = true
  } else if (command === 'batchIn') {
    batchInVisible.value = true
  } else if (command === 'permission') {
    permissionVisible.value = true
  }
}

// ── 设备详情 ──
const detailVisible = ref(false)
const detailTab = ref('devices')
const currentDetail = ref<InventorySummary | null>(null)
const currentSummaryDetail = ref<InventorySummary | null>(null)
const currentDetailDetail = ref<InventoryDetail | null>(null)
const deviceRecords = ref<DeviceRecord[]>(deviceRecordData)
const ioRecords = ref<IoRecord[]>(ioRecordData)
const deviceStatusFilter = ref('')
const deviceSearch = ref('')
const ioTypeFilter = ref('')
const ioSearch = ref('')

// ── 设备清单分页 ──
const devicePagination = reactive({ page: 1, pageSize: 10, total: 0 })

const filteredDeviceRecords = computed(() => {
  let data = [...deviceRecords.value]
  if (deviceStatusFilter.value) {
    data = data.filter(item => item.maintenanceStatus === deviceStatusFilter.value)
  }
  if (deviceSearch.value) {
    data = data.filter(item => item.code.includes(deviceSearch.value))
  }
  return data
})

const deviceTotal = computed(() => filteredDeviceRecords.value.length)

const pagedDeviceRecords = computed(() => {
  const start = (devicePagination.page - 1) * devicePagination.pageSize
  return filteredDeviceRecords.value.slice(start, start + devicePagination.pageSize)
})

function handleDevicePageChange(page: number) {
  devicePagination.page = page
}

function handleDeviceSizeChange(size: number) {
  devicePagination.pageSize = size
  devicePagination.page = 1
}

// ── 维保记录 ──
const maintenanceRecords = ref<MaintenanceRecord[]>(maintenanceRecordData)
const maintenanceStatusFilter = ref('')
const maintenanceSearch = ref('')
const maintenancePagination = reactive({ page: 1, pageSize: 10, total: 0 })

const filteredMaintenanceRecords = computed(() => {
  let data = [...maintenanceRecords.value]
  if (maintenanceStatusFilter.value) {
    data = data.filter(item => item.status === maintenanceStatusFilter.value)
  }
  if (maintenanceSearch.value) {
    data = data.filter(item => item.code.includes(maintenanceSearch.value) || item.maintainer.includes(maintenanceSearch.value))
  }
  return data
})

const maintenanceTotal = computed(() => filteredMaintenanceRecords.value.length)

const pagedMaintenanceRecords = computed(() => {
  const start = (maintenancePagination.page - 1) * maintenancePagination.pageSize
  return filteredMaintenanceRecords.value.slice(start, start + maintenancePagination.pageSize)
})

function handleMaintenancePageChange(page: number) {
  maintenancePagination.page = page
}

function handleMaintenanceSizeChange(size: number) {
  maintenancePagination.pageSize = size
  maintenancePagination.page = 1
}

// ── 保险续期记录 ──
const insuranceRecords = ref<InsuranceRecord[]>(insuranceRecordData)
const insuranceStatusFilter = ref('')
const insuranceSearch = ref('')
const insurancePagination = reactive({ page: 1, pageSize: 10, total: 0 })

const filteredInsuranceRecords = computed(() => {
  let data = [...insuranceRecords.value]
  if (insuranceStatusFilter.value) {
    data = data.filter(item => item.status === insuranceStatusFilter.value)
  }
  if (insuranceSearch.value) {
    data = data.filter(item => item.policyCode.includes(insuranceSearch.value) || item.maintainer.includes(insuranceSearch.value))
  }
  return data
})

const insuranceTotal = computed(() => filteredInsuranceRecords.value.length)

const pagedInsuranceRecords = computed(() => {
  const start = (insurancePagination.page - 1) * insurancePagination.pageSize
  return filteredInsuranceRecords.value.slice(start, start + insurancePagination.pageSize)
})

function handleInsurancePageChange(page: number) {
  insurancePagination.page = page
}

function handleInsuranceSizeChange(size: number) {
  insurancePagination.pageSize = size
  insurancePagination.page = 1
}

watch(deviceStatusFilter, () => { devicePagination.page = 1 })
watch(deviceSearch, () => { devicePagination.page = 1 })
watch(maintenanceStatusFilter, () => { maintenancePagination.page = 1 })
watch(maintenanceSearch, () => { maintenancePagination.page = 1 })
watch(insuranceStatusFilter, () => { insurancePagination.page = 1 })
watch(insuranceSearch, () => { insurancePagination.page = 1 })

const filteredIoRecords = computed(() => {
  let data = [...ioRecords.value]
  if (ioTypeFilter.value) {
    data = data.filter(item => item.type.includes(ioTypeFilter.value))
  }
  if (ioSearch.value) {
    data = data.filter(item => item.remark.includes(ioSearch.value) || item.operator.includes(ioSearch.value))
  }
  return data
})

function handleShowSummaryDetail(row: InventorySummary) {
  currentDetail.value = row
  currentSummaryDetail.value = row
  detailTab.value = 'devices'
  detailVisible.value = true
}

function handleShowDetailDetail(row: InventoryDetail) {
  currentDetail.value = row as any
  currentDetailDetail.value = row
  detailTab.value = 'maintenance'
  detailVisible.value = true
}

function handleEdit(row: any) {
  editingId.value = row.id || row.code || ''
  deviceInForm.name = row.name || ''
  deviceInForm.serialNumber = row.serialNumber || ''
  deviceInForm.source = '采购'
  deviceInForm.spec = row.spec || ''
  deviceInForm.unit = row.unit || ''
  deviceInForm.insurance = ''
  deviceInForm.noInsurance = false
  deviceInForm.location = row.location || ''
  deviceInForm.attachments = []
  deviceInVisible.value = true
}

function handleDelete(row: any) {
  ElMessageBox.confirm(
    `是否确认删除"${row.name}"？`,
    '删除确认',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// ── 设备入库 ──
const deviceInVisible = ref(false)
const deviceInFormRef = ref<FormInstance>()
const deviceInForm = reactive<DeviceInForm>({
  name: '',
  serialNumber: '',
  source: '采购' as SourceType,
  spec: '',
  unit: '',
  insurance: '',
  noInsurance: false,
  location: '',
  attachments: []
})
const deviceInRules: FormRules = {
  name: [{ required: true, message: '请选择装备/物资名称', trigger: 'change' }],
  source: [{ required: true, message: '请选择来源', trigger: 'change' }],
  spec: [{ required: true, message: '请选择型号规格', trigger: 'change' }],
  unit: [{ required: true, message: '请选择单位', trigger: 'change' }],
  location: [{ required: true, message: '请选择存放位置', trigger: 'change' }]
}

function handleDeviceInSubmit() {
  deviceInFormRef.value?.validate(valid => {
    if (valid) {
      ElMessage.success('入库成功')
      deviceInVisible.value = false
    }
  })
}

// ── 批量入库 ──
const batchInVisible = ref(false)

function handleBatchInSubmit() {
  ElMessage.success('批量入库成功')
  batchInVisible.value = false
}

function handleDownloadTemplate() {
  ElMessage.success('模板下载成功')
}

// ── 权限管理 ──
const permissionVisible = ref(false)
const editingId = ref('')
const permissionFormRef = ref<FormInstance>()
const permissionForm = reactive<PermissionForm>({
  name: '',
  attachmentType: '全部' as AttachmentType,
  targetObjectType: '',
  role: '',
  operations: ['查看', '下载'],
  scope: '',
  effectiveTime: '',
  expireTime: '',
  expireAction: '自动延期' as any,
  grantor: '',
  grantTime: ''
})
const permissionRules: FormRules = {
  name: [{ required: true, message: '请输入权限配置名称', trigger: 'blur' }],
  attachmentType: [{ required: true, message: '请选择关联附件类型', trigger: 'change' }],
  targetObjectType: [{ required: true, message: '请选择授权对象类型', trigger: 'change' }],
  role: [{ required: true, message: '请选择权限角色', trigger: 'change' }],
  operations: [{ required: true, message: '请选择允许操作类型', trigger: 'change' }],
  scope: [{ required: true, message: '请选择装备范围明细', trigger: 'change' }],
  effectiveTime: [{ required: true, message: '请选择生效时间', trigger: 'change' }],
  grantor: [{ required: true, message: '请选择授权人', trigger: 'change' }],
  grantTime: [{ required: true, message: '请选择授权时间', trigger: 'change' }]
}

function handlePermissionSubmit() {
  permissionFormRef.value?.validate(valid => {
    if (valid) {
      ElMessage.success('权限配置成功')
      permissionVisible.value = false
    }
  })
}

// ── 入库 ──
const inStockVisible = ref(false)
const inStockFormRef = ref<FormInstance>()
const inStockForm = reactive<StockInForm>({
  type: '调入' as InType,
  codes: ['', ''],
  remark: '',
  attachments: []
})
const inStockRules: FormRules = {
  type: [{ required: true, message: '请选择入库类型', trigger: 'change' }]
}

function addInCode() { inStockForm.codes.push('') }
function removeInCode(index: number) { inStockForm.codes.splice(index, 1) }

function handleInStock() {
  inStockForm.codes = ['', '']
  inStockForm.type = '调入'
  inStockForm.remark = ''
  inStockVisible.value = true
}

function handleInStockSubmit() {
  ElMessage.success('入库成功')
  inStockVisible.value = false
}

// ── 出库 ──
const outStockVisible = ref(false)
const outStockFormRef = ref<FormInstance>()
const outStockForm = reactive<StockOutForm>({
  type: '调出' as OutType,
  codes: ['', ''],
  remark: '',
  attachments: []
})
const outStockRules: FormRules = {
  type: [{ required: true, message: '请选择出库类型', trigger: 'change' }]
}

function addOutCode() { outStockForm.codes.push('') }
function removeOutCode(index: number) { outStockForm.codes.splice(index, 1) }

function handleOutStock() {
  outStockForm.codes = ['', '']
  outStockForm.type = '调出'
  outStockForm.remark = ''
  outStockVisible.value = true
}

function handleOutStockSubmit() {
  ElMessage.success('出库成功')
  outStockVisible.value = false
}

// ── 保险续期 ──
const insuranceRenewalVisible = ref(false)
const insuranceRenewalRow = ref<InventoryDetail | null>(null)

function handleOpenInsuranceRenewal() {
  if (currentDetailDetail.value) {
    insuranceRenewalRow.value = currentDetailDetail.value
    insuranceRenewalVisible.value = true
  }
}

function handleInsuranceRenewalSubmit() {
  insuranceRenewalVisible.value = false
}
</script>

<style lang="scss" scoped>
:deep(.el-drawer__footer) {
  border-top: 1px solid #ebeef5;
}

.inventory-query-page {
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

    .search-bar {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #ebeef5;
    }

    .search-bar-filter {
      display: flex;
      align-items: center;
      gap: 12px;

      .filter-label {
        font-size: 14px;
        color: #606266;
        font-weight: 600;
      }
      .filter-link {
        font-size: 14px;
        &.el-link--primary { font-weight: 600; }
      }
    }

    .content-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;

      .record-count {
        font-size: 14px;
        color: #909399;
      }

      .content-header-center {
        flex: 1;
        display: flex;
        justify-content: center;
      }

      .content-header-right {
        display: flex;
        align-items: center;
      }
    }

    .data-table {
      flex: 1;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }

  .form-input {
    width: 100%;
  }

  .form-tip-link {
    margin-top: -8px;
    margin-bottom: 16px;
    margin-left: 120px;
  }

  .insurance-expired {
    color: #F56C6C;
    font-weight: 500;
  }
  .insurance-expiring {
    color: #E6A23C;
    font-weight: 500;
  }
}
.detail-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .detail-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
}

.detail-header {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;

  .detail-info {
    .detail-info-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 16px;
      align-items: center;
      margin-bottom: 4px;
    }
  }

  .detail-meta {
    font-size: 14px;
    color: #606266;
    b { color: #303133; }
  }
}

.material-detail-header {
  .detail-info-row {
    gap: 12px 20px;
    margin-bottom: 6px;
  }
}

.detail-section {
  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 12px;
    padding-left: 10px;
    border-left: 3px solid #409eff;
  }

  .section-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
    color: #909399;

    .section-toolbar-right {
      display: flex;
      align-items: center;
    }
  }
}

.detail-section-flex {
  display: flex;
  flex-direction: column;
  height: 100%;

  .el-table {
    flex: 1;
    overflow: hidden;
  }
}

:deep(.el-drawer__body) {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

:deep(.el-tabs) {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;

  .el-tabs__content {
    flex: 1;
    overflow: hidden;
  }

  .el-tab-pane {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }
}

.attachment-icon {
  font-size: 16px;
  color: #909399;
  cursor: pointer;
  &:hover { color: #409eff; }
}

// ── 出入库时间线 ──
.io-timeline {
  .io-date-group {
    margin-bottom: 16px;
  }

  .io-date-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;

    .io-date-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #409eff;
    }
    .io-date-text {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }

  .io-record-card {
    display: flex;
    gap: 16px;
    padding: 16px;
    margin-left: 5px;
    border-left: 2px solid #e4e7ed;

    .io-time {
      font-size: 15px;
      font-weight: 600;
      color: #303133;
      flex-shrink: 0;
      width: 50px;
    }

    .io-record-content {
      flex: 1;

      .io-record-top {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
        margin-bottom: 8px;
        font-size: 14px;
        color: #606266;
        b { color: #303133; }
      }

      .io-record-attachment {
        margin-bottom: 8px;
        font-size: 14px;
        color: #606266;
      }

      .codes-table {
        width: 400px;
        border-collapse: collapse;
        margin-bottom: 4px;

        th, td {
          border: 1px solid #ebeef5;
          padding: 6px 12px;
          font-size: 13px;
          text-align: center;
        }
        th {
          background: #f5f7fa;
          color: #606266;
          font-weight: 600;
        }
        td { color: #303133; }
      }

      .expand-link {
        font-size: 13px;
      }
    }
  }
}

// ── 批量入库 ──
.batch-in-content {
  .batch-step {
    margin-bottom: 24px;

    .batch-step-title {
      font-size: 14px;
      color: #606266;
      margin-bottom: 8px;
    }
  }

  .batch-upload {
    width: 100%;

    :deep(.el-upload-dragger) {
      width: 100%;
      padding: 40px 0;
    }

    .upload-icon {
      color: #c0c4cc;
    }
    .upload-text {
      margin-top: 8px;
      font-size: 14px;
      color: #606266;
    }
  }
}

// ── 编号输入列表 ──
  .code-input-list {
    width: 100%;

    .code-input-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;

      .code-index {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #f0f2f5;
        color: #909399;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        flex-shrink: 0;
      }

      .code-input {
        flex: 1;
      }
    }
  }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
