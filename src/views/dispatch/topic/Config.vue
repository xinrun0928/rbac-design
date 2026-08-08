<template>
  <div class="topic-config">
    <div class="config-layout">
      <!-- 左侧标签页 -->
      <div class="topic-tabs">
        <div
          v-for="tab in topicTabs"
          :key="tab.key"
          class="tab-item"
          :class="{ active: activeTopic === tab.key }"
          @click="activeTopic = tab.key"
        >
          <el-icon :size="18"><component :is="tab.icon" /></el-icon>
          <span class="tab-label">{{ tab.label }}</span>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="config-content">
        <!-- 上半部分：监控视频 + 短视频 -->
        <div class="content-upper">
          <!-- 左侧：监控视频网格 -->
          <div class="monitor-section">
            <div class="section-header">
              <span class="section-title">监控视频</span>
              <div class="section-actions">
                <el-button type="primary" size="small" @click="handleBindMonitor">
                  <el-icon><Link /></el-icon>绑定监控
                </el-button>
                <el-button size="small" circle @click="handleMonitorSetting">
                  <el-icon><Setting /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="monitor-grid">
              <div
                v-for="item in configData.monitors"
                :key="item.id"
                class="monitor-cell"
              >
                <div class="monitor-preview">
                  <img :src="item.monitorUrl" :alt="item.pointName" />
                  <div class="monitor-overlay">
                    <el-icon :size="24" color="#fff"><VideoCamera /></el-icon>
                  </div>
                </div>
                <div class="monitor-info">
                  <span class="monitor-name" :title="item.pointName">{{ item.pointName }}</span>
                  <span class="monitor-location">{{ item.pointLongitude }}, {{ item.pointLatitude }}</span>
                </div>
              </div>
              <!-- 空位补全 -->
              <div
                v-for="n in emptyMonitorSlots"
                :key="'empty-' + n"
                class="monitor-cell empty-cell"
              >
                <div class="monitor-preview empty-preview">
                  <el-icon :size="32" color="#c0c4cc"><Plus /></el-icon>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：短视频区域 -->
          <div class="short-video-section">
            <div class="section-header">
              <span class="section-title">短视频</span>
              <el-button type="primary" size="small" @click="handleAddShortVideo">
                <el-icon><Plus /></el-icon>添加短视频
              </el-button>
            </div>
            <div class="short-video-list">
              <div
                v-for="video in configData.shortVideos"
                :key="video.id"
                class="short-video-item"
                @click="handlePreviewVideo(video)"
              >
                <div class="video-cover">
                  <img :src="video.coverUrl" :alt="video.title" />
                  <div class="video-duration">{{ video.duration }}</div>
                  <div class="video-play-icon">
                    <el-icon :size="20" color="#fff"><CaretRight /></el-icon>
                  </div>
                </div>
                <div class="video-title">{{ video.title }}</div>
              </div>
              <!-- 空位 -->
              <div class="short-video-item empty-item" @click="handleAddShortVideo">
                <div class="video-cover empty-cover">
                  <el-icon :size="28" color="#c0c4cc"><Plus /></el-icon>
                </div>
                <div class="video-title">添加视频</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 中间部分：切片配置 -->
        <div class="content-middle">
          <div class="slice-section">
            <div class="section-header">
              <span class="section-title">视频切片</span>
              <div class="slice-actions">
                <el-button type="primary" size="small" @click="handleBindSlice">
                  <el-icon><Link /></el-icon>绑定切片
                </el-button>
                <el-button type="primary" link size="small" @click="handleManualSlice">手动切片</el-button>
                <el-button type="primary" link size="small" @click="handleAutoSlice">自动切片配置</el-button>
              </div>
            </div>
            <div class="slice-preview-list">
              <div
                v-for="slice in configData.slices"
                :key="slice.id"
                class="slice-item"
                @click="handlePreviewSlice(slice)"
              >
                <div class="slice-cover">
                  <img :src="slice.coverUrl" :alt="slice.title" />
                  <div class="slice-duration">{{ slice.duration }}</div>
                  <div class="slice-play-icon">
                    <el-icon :size="18" color="#fff"><CaretRight /></el-icon>
                  </div>
                </div>
                <div class="slice-title">{{ slice.title }}</div>
              </div>
              <!-- 空位 -->
              <div class="slice-item empty-slice" @click="handleBindSlice">
                <div class="slice-cover empty-slice-cover">
                  <el-icon :size="24" color="#c0c4cc"><Plus /></el-icon>
                </div>
                <div class="slice-title">添加切片</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 下半部分：风险隐患点位表格 -->
        <div class="content-lower">
          <div class="risk-section">
            <div class="section-header">
              <span class="section-title">风险隐患点位</span>
              <div class="section-actions">
                <el-button type="primary" size="small" @click="handleAddRiskPoint">
                  <el-icon><Plus /></el-icon>添加风险点
                </el-button>
                <div class="sync-time">
                  <el-icon><Clock /></el-icon>
                  <span>上次同步时间：{{ lastSyncTime }}</span>
                </div>
              </div>
            </div>
            <el-table
              :data="configData.riskPoints"
              border
              stripe
              highlight-current-row
              :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
              class="data-table"
            >
              <el-table-column prop="pointName" label="点位名称" min-width="180" align="center" show-overflow-tooltip />
              <el-table-column prop="riskType" label="风险类型" width="120" align="center" />
              <el-table-column label="风险等级" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="getRiskLevelType(row.riskLevel)" effect="plain" size="small">
                    {{ row.riskLevel }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="longitude" label="点位经度" width="130" align="center" />
              <el-table-column prop="latitude" label="点位纬度" width="130" align="center" />
              <el-table-column prop="managementUnit" label="管理单位" width="140" align="center" show-overflow-tooltip />
              <el-table-column label="状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)" effect="plain" size="small">
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="updateTime" label="更新时间" width="160" align="center" />
              <el-table-column label="操作" width="120" align="center" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="handleBindMonitorToPoint(row)">
                    绑定监控
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>

    <!-- 绑定监控抽屉 -->
    <el-drawer v-model="bindMonitorVisible" title="绑定监控设备" size="70%" direction="rtl" destroy-on-close>
      <div class="bind-monitor-content">
        <el-tabs v-model="bindMonitorTab">
          <el-tab-pane label="未加入" name="notJoined">
            <el-table :data="notJoinedDevices" border stripe :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }">
              <el-table-column prop="deviceName" label="设备名称" min-width="150" align="center" show-overflow-tooltip />
              <el-table-column prop="deviceType" label="设备类型" width="120" align="center" />
              <el-table-column prop="department" label="所属单位" width="140" align="center" show-overflow-tooltip />
              <el-table-column label="设备状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.status === '在线' ? 'success' : 'danger'" effect="plain" size="small">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="longitude" label="经度" width="120" align="center" />
              <el-table-column prop="latitude" label="纬度" width="120" align="center" />
              <el-table-column prop="installLocation" label="安装位置" width="140" align="center" show-overflow-tooltip />
              <el-table-column label="操作" width="80" align="center" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="handleJoinDevice(row)">加入</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="已加入" name="joined">
            <el-table :data="joinedDevices" border stripe :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }">
              <el-table-column prop="deviceName" label="设备名称" min-width="150" align="center" show-overflow-tooltip />
              <el-table-column prop="deviceType" label="设备类型" width="120" align="center" />
              <el-table-column prop="department" label="所属单位" width="140" align="center" show-overflow-tooltip />
              <el-table-column label="设备状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.status === '在线' ? 'success' : 'danger'" effect="plain" size="small">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="longitude" label="经度" width="120" align="center" />
              <el-table-column prop="latitude" label="纬度" width="120" align="center" />
              <el-table-column prop="installLocation" label="安装位置" width="140" align="center" show-overflow-tooltip />
              <el-table-column label="操作" width="100" align="center" fixed="right">
                <template #default="{ row }">
                  <el-button type="danger" link size="small" @click="handleLeaveDevice(row)">取消加入</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>

    <!-- 监控设置抽屉 -->
    <el-drawer v-model="monitorSettingVisible" title="监控轮巡设置" size="40%" direction="rtl" destroy-on-close>
      <el-form :model="monitorSettingForm" label-width="100px" label-position="right">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="规则名称">
              <el-input v-model="monitorSettingForm.ruleName" placeholder="必填" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规则编号">
              <el-input v-model="monitorSettingForm.ruleCode" placeholder="唯一标识" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="轮询范围">
              <el-input v-model="monitorSettingForm.patrolScope" placeholder="路段/区域/设备集合" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="视频列表">
              <el-input v-model="monitorSettingForm.videoList" placeholder="视频ID集合" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="轮询方式">
              <el-select v-model="monitorSettingForm.patrolMethod" placeholder="请选择" style="width: 100%;">
                <el-option label="顺序" value="顺序" />
                <el-option label="随机" value="随机" />
                <el-option label="循环" value="循环" />
                <el-option label="优先" value="优先" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="切换间隔">
              <el-input v-model="monitorSettingForm.switchInterval" placeholder="秒">
                <template #append>秒</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="优先级">
              <el-select v-model="monitorSettingForm.priority" placeholder="请选择" style="width: 100%;">
                <el-option label="高" value="高" />
                <el-option label="中" value="中" />
                <el-option label="低" value="低" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用">
              <el-switch v-model="monitorSettingForm.enabled" active-text="是" inactive-text="否" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="monitorSettingVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveMonitorSetting">保存</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 添加短视频抽屉 -->
    <el-drawer v-model="addShortVideoVisible" title="添加短视频" size="40%" direction="rtl" destroy-on-close>
      <el-form :model="shortVideoForm" label-width="100px" label-position="right">
        <el-form-item label="视频名称">
          <el-input v-model="shortVideoForm.name" placeholder="请输入视频名称" />
        </el-form-item>
        <el-form-item label="视频描述">
          <el-input v-model="shortVideoForm.description" type="textarea" :rows="3" placeholder="请输入视频描述" />
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            class="video-uploader"
            action="#"
            :auto-upload="false"
            :limit="1"
            accept="video/*"
          >
            <el-button type="primary" plain>选择视频文件</el-button>
            <template #tip>
              <div class="el-upload__tip">支持MP4、AVI、MOV格式，文件大小不超过500MB</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="addShortVideoVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveShortVideo">确定</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 绑定切片抽屉 -->
    <el-drawer v-model="bindSliceVisible" title="绑定切片" size="50%" direction="rtl" destroy-on-close>
      <div class="bind-slice-content">
        <el-tabs v-model="bindSliceTab">
          <el-tab-pane label="已绑定" name="bound">
            <div class="slice-grid">
              <div v-for="slice in boundSlices" :key="slice.id" class="slice-grid-item">
                <div class="slice-image">
                  <img :src="slice.coverUrl" :alt="slice.title" />
                  <div class="slice-actions-overlay">
                    <el-button type="danger" circle size="small"><el-icon><Delete /></el-icon></el-button>
                  </div>
                  <el-checkbox class="slice-checkbox" />
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="未绑定" name="unbound">
            <div class="slice-grid">
              <div v-for="slice in unboundSlices" :key="slice.id" class="slice-grid-item">
                <div class="slice-image">
                  <img :src="slice.coverUrl" :alt="slice.title" />
                  <div class="slice-actions-overlay">
                    <el-button type="primary" circle size="small"><el-icon><Plus /></el-icon></el-button>
                  </div>
                  <el-checkbox class="slice-checkbox" />
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="bindSliceVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveSliceBind">确定</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 手动切片抽屉 -->
    <el-drawer v-model="manualSliceVisible" title="手动切片" size="40%" direction="rtl" destroy-on-close>
      <el-form :model="manualSliceForm" label-width="100px" label-position="right">
        <el-form-item label="名称">
          <el-input v-model="manualSliceForm.name" placeholder="请输入切片名称" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="manualSliceForm.startTime"
            type="datetime"
            placeholder="选择 年月日时分秒"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="manualSliceForm.endTime"
            type="datetime"
            placeholder="选择 年月日时分秒"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="预计时长">
          <el-input v-model="manualSliceForm.duration" placeholder="自动计算开始时间与结束时间的时长" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="manualSliceVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveManualSlice">确定</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 自动切片配置抽屉 -->
    <el-drawer v-model="autoSliceVisible" title="自动切片配置" size="60%" direction="rtl" destroy-on-close>
      <div class="auto-slice-content">
        <div class="auto-slice-header">
          <el-button type="primary" size="small" @click="handleAddAutoSliceRule">
            <el-icon><Plus /></el-icon>添加
          </el-button>
          <el-button type="primary" size="small" plain @click="handleExportAutoSliceRules">
            <el-icon><Download /></el-icon>导出
          </el-button>
        </div>
        <el-table :data="autoSliceRules" border stripe :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }">
          <el-table-column prop="ruleName" label="切片规则名称" min-width="160" align="center" show-overflow-tooltip />
          <el-table-column prop="triggerType" label="触发类型" width="120" align="center" />
          <el-table-column prop="triggerCondition" label="触发条件" width="120" align="center" />
          <el-table-column prop="preDuration" label="前置时长（秒）" width="130" align="center" />
          <el-table-column prop="postDuration" label="后置时长（秒）" width="130" align="center" />
          <el-table-column prop="outputFormat" label="输出格式" width="100" align="center" />
          <el-table-column label="规则状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.enabled ? 'success' : 'danger'" effect="plain" size="small">
                {{ row.enabled ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="autoSlicePage"
            v-model:page-size="autoSlicePageSize"
            :total="autoSliceRules.length"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            background
          />
        </div>
      </div>
    </el-drawer>

    <!-- 风险点绑定监控抽屉 -->
    <el-drawer v-model="bindMonitorToPointVisible" title="绑定监控设备" size="70%" direction="rtl" destroy-on-close>
      <div class="bind-monitor-content">
        <el-tabs v-model="bindMonitorToPointTab">
          <el-tab-pane label="未加入" name="notJoined">
            <el-table :data="notJoinedDevices" border stripe :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }">
              <el-table-column prop="deviceName" label="设备名称" min-width="150" align="center" show-overflow-tooltip />
              <el-table-column prop="deviceType" label="设备类型" width="120" align="center" />
              <el-table-column prop="department" label="所属单位" width="140" align="center" show-overflow-tooltip />
              <el-table-column label="设备状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.status === '在线' ? 'success' : 'danger'" effect="plain" size="small">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="longitude" label="经度" width="120" align="center" />
              <el-table-column prop="latitude" label="纬度" width="120" align="center" />
              <el-table-column prop="installLocation" label="安装位置" width="140" align="center" show-overflow-tooltip />
              <el-table-column label="操作" width="80" align="center" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="handleJoinDevice(row)">加入</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="已加入" name="joined">
            <el-table :data="joinedDevices" border stripe :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }">
              <el-table-column prop="deviceName" label="设备名称" min-width="150" align="center" show-overflow-tooltip />
              <el-table-column prop="deviceType" label="设备类型" width="120" align="center" />
              <el-table-column prop="department" label="所属单位" width="140" align="center" show-overflow-tooltip />
              <el-table-column label="设备状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.status === '在线' ? 'success' : 'danger'" effect="plain" size="small">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="longitude" label="经度" width="120" align="center" />
              <el-table-column prop="latitude" label="纬度" width="120" align="center" />
              <el-table-column prop="installLocation" label="安装位置" width="140" align="center" show-overflow-tooltip />
              <el-table-column label="操作" width="100" align="center" fixed="right">
                <template #default="{ row }">
                  <el-button type="danger" link size="small" @click="handleLeaveDevice(row)">取消加入</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>

    <!-- 添加风险点抽屉 -->
    <el-drawer v-model="addRiskPointVisible" title="添加风险点" size="70%" direction="rtl" destroy-on-close>
      <div class="bind-monitor-content">
        <el-tabs v-model="addRiskPointTab">
          <el-tab-pane label="未加入" name="notJoined">
            <el-table :data="notJoinedRiskPoints" border stripe :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }">
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="pointName" label="风险点名称" min-width="160" align="center" show-overflow-tooltip />
              <el-table-column prop="riskType" label="风险点类型" width="120" align="center" />
              <el-table-column label="隐患等级" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="getRiskLevelType(row.riskLevel)" effect="plain" size="small">{{ row.riskLevel }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="roadSection" label="所属路段" width="120" align="center" />
              <el-table-column prop="managementUnit" label="所属单位" width="140" align="center" show-overflow-tooltip />
              <el-table-column prop="contactPhone" label="联系电话" width="130" align="center" />
              <el-table-column prop="updateTime" label="更新时间" width="160" align="center" />
              <el-table-column label="操作" width="80" align="center" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="handleJoinRiskPoint(row)">加入</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="已加入" name="joined">
            <el-table :data="joinedRiskPoints" border stripe :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }">
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="pointName" label="风险点名称" min-width="160" align="center" show-overflow-tooltip />
              <el-table-column prop="riskType" label="风险点类型" width="120" align="center" />
              <el-table-column label="隐患等级" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="getRiskLevelType(row.riskLevel)" effect="plain" size="small">{{ row.riskLevel }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="roadSection" label="所属路段" width="120" align="center" />
              <el-table-column prop="managementUnit" label="所属单位" width="140" align="center" show-overflow-tooltip />
              <el-table-column prop="contactPhone" label="联系电话" width="130" align="center" />
              <el-table-column prop="updateTime" label="更新时间" width="160" align="center" />
              <el-table-column label="操作" width="100" align="center" fixed="right">
                <template #default="{ row }">
                  <el-button type="danger" link size="small" @click="handleLeaveRiskPoint(row)">取消加入</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {
  Link, Plus, VideoCamera, CaretRight, Clock, Ship, OfficeBuilding,
  Setting, Delete, Download
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { topicConfigData } from '@/mock/dispatch/topicData'
import type { RiskPoint, ShortVideo, VideoSlice } from '@/types/dispatch/topic'

/** 专题标签页 */
const topicTabs = [
  { key: 'channel', label: '航道专题', icon: Ship },
  { key: 'strait', label: '海峡办专题', icon: OfficeBuilding },
]

const activeTopic = ref('channel')
const configData = ref(topicConfigData)
const lastSyncTime = ref('2026-08-08 09:30:00')

/** 监控网格空位数量（补到9个） */
const emptyMonitorSlots = computed(() => {
  const count = configData.value.monitors.length
  return count < 9 ? 9 - count : 0
})

/** 风险等级标签类型 */
const getRiskLevelType = (level: string) => {
  const map: Record<string, string> = {
    '高风险': 'danger',
    '中风险': 'warning',
    '低风险': 'info',
    '正常': 'success',
  }
  return map[level] || 'info'
}

/** 状态标签类型 */
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '处置中': 'danger',
    '处理中': 'warning',
    '正常': 'success',
    '已完成': 'info',
  }
  return map[status] || 'info'
}

// ==================== 绑定监控 ====================
const bindMonitorVisible = ref(false)
const bindMonitorTab = ref('notJoined')

interface DeviceInfo {
  id: number
  deviceName: string
  deviceType: string
  department: string
  status: '在线' | '离线'
  longitude: string
  latitude: string
  installLocation: string
}

const allDevices = ref<DeviceInfo[]>([
  { id: 1, deviceName: 'G4高速K23摄像头', deviceType: '枪机摄像头', department: '广深高速管理公司', status: '离线', longitude: '113.365214', latitude: '23.124578', installLocation: 'G4高速K23+500' },
  { id: 2, deviceName: '天河收费站监控', deviceType: '球机摄像头', department: '广州交通局', status: '离线', longitude: '113.321456', latitude: '23.135678', installLocation: '天河收费站入口' },
  { id: 3, deviceName: '南山隧道入口监控', deviceType: '枪机摄像头', department: '深圳交通局', status: '离线', longitude: '113.923456', latitude: '22.543210', installLocation: '南山隧道入口' },
  { id: 4, deviceName: '清远山区监控点', deviceType: '热成像摄像头', department: '清远交通局', status: '离线', longitude: '112.987654', latitude: '24.567890', installLocation: '山体滑坡监测点' },
  { id: 5, deviceName: '服务区停车场监控', deviceType: '球机摄像头', department: '中山交通局', status: '离线', longitude: '113.456789', latitude: '22.678901', installLocation: '服务区停车场' },
  { id: 6, deviceName: '桥梁健康监控视频', deviceType: '高清摄像头', department: '佛山交通局', status: '离线', longitude: '113.112233', latitude: '23.223344', installLocation: '大桥中段' },
  { id: 7, deviceName: '收费广场监控设备', deviceType: '枪机摄像头', department: '惠州交通局', status: '离线', longitude: '114.123456', latitude: '23.345678', installLocation: '收费广场' },
  { id: 8, deviceName: '高边坡监控设备', deviceType: '热成像摄像头', department: '韶关交通局', status: '离线', longitude: '113.567890', latitude: '24.123456', installLocation: '高边坡区域' },
  { id: 9, deviceName: '客运站入口监控', deviceType: '球机摄像头', department: '珠海交通局', status: '离线', longitude: '113.576789', latitude: '22.271234', installLocation: '客运站入口' },
  { id: 10, deviceName: '港口通道监控设备', deviceType: '枪机摄像头', department: '港口管理单位', status: '离线', longitude: '113.654321', latitude: '22.123456', installLocation: '港口通道' },
])

const joinedDeviceIds = ref<Set<number>>(new Set([4]))

const notJoinedDevices = computed(() => allDevices.value.filter(d => !joinedDeviceIds.value.has(d.id)))
const joinedDevices = computed(() => allDevices.value.filter(d => joinedDeviceIds.value.has(d.id)))

const handleBindMonitor = () => { bindMonitorVisible.value = true }
const handleJoinDevice = (device: DeviceInfo) => { joinedDeviceIds.value.add(device.id) }
const handleLeaveDevice = (device: DeviceInfo) => { joinedDeviceIds.value.delete(device.id) }

// ==================== 监控设置 ====================
const monitorSettingVisible = ref(false)
const monitorSettingForm = reactive({
  ruleName: '',
  ruleCode: '',
  patrolScope: '',
  videoList: '',
  patrolMethod: '顺序',
  switchInterval: '',
  priority: '中',
  enabled: true
})

const handleMonitorSetting = () => { monitorSettingVisible.value = true }
const handleSaveMonitorSetting = () => {
  ElMessage.success('保存成功')
  monitorSettingVisible.value = false
}

// ==================== 添加短视频 ====================
const addShortVideoVisible = ref(false)
const shortVideoForm = reactive({
  name: '',
  description: '',
  videoFile: null as File | null
})

const handleAddShortVideo = () => { addShortVideoVisible.value = true }
const handleSaveShortVideo = () => {
  ElMessage.success('添加成功')
  addShortVideoVisible.value = false
}

// ==================== 绑定切片 ====================
const bindSliceVisible = ref(false)
const bindSliceTab = ref('bound')

const allSlices = ref<VideoSlice[]>([
  { id: 1, title: '切片1', coverUrl: '/images/slice-1.jpg', videoUrl: '/videos/slice-1.mp4', duration: '0:30' },
  { id: 2, title: '切片2', coverUrl: '/images/slice-2.jpg', videoUrl: '/videos/slice-2.mp4', duration: '0:45' },
  { id: 3, title: '切片3', coverUrl: '/images/slice-3.jpg', videoUrl: '/videos/slice-3.mp4', duration: '1:00' },
  { id: 4, title: '切片4', coverUrl: '/images/slice-4.jpg', videoUrl: '/videos/slice-4.mp4', duration: '0:20' },
  { id: 5, title: '切片5', coverUrl: '/images/slice-5.jpg', videoUrl: '/videos/slice-5.mp4', duration: '0:55' },
  { id: 6, title: '切片6', coverUrl: '/images/slice-6.jpg', videoUrl: '/videos/slice-6.mp4', duration: '0:35' },
])

const boundSliceIds = ref<Set<number>>(new Set([1, 2, 3]))

const boundSlices = computed(() => allSlices.value.filter(s => boundSliceIds.value.has(s.id)))
const unboundSlices = computed(() => allSlices.value.filter(s => !boundSliceIds.value.has(s.id)))

const handleBindSlice = () => { bindSliceVisible.value = true }
const handleSaveSliceBind = () => {
  ElMessage.success('保存成功')
  bindSliceVisible.value = false
}

// ==================== 手动切片 ====================
const manualSliceVisible = ref(false)
const manualSliceForm = reactive({
  name: '',
  startTime: '',
  endTime: '',
  duration: ''
})

const handleManualSlice = () => { manualSliceVisible.value = true }
const handleSaveManualSlice = () => {
  ElMessage.success('切片成功')
  manualSliceVisible.value = false
}

// ==================== 自动切片配置 ====================
const autoSliceVisible = ref(false)
const autoSlicePage = ref(1)
const autoSlicePageSize = ref(10)

interface AutoSliceRule {
  id: number
  ruleName: string
  triggerType: string
  triggerCondition: string
  preDuration: number
  postDuration: number
  outputFormat: string
  enabled: boolean
}

const autoSliceRules = ref<AutoSliceRule[]>([
  { id: 1, ruleName: '高速拥堵自动切片', triggerType: '实时触发', triggerCondition: '整点触发', preDuration: 30, postDuration: 60, outputFormat: 'MP4', enabled: false },
  { id: 2, ruleName: '事故事件视频切片', triggerType: '事件触发', triggerCondition: '半点触发', preDuration: 60, postDuration: 120, outputFormat: 'MP4', enabled: false },
  { id: 3, ruleName: '大客流路段监控切片', triggerType: '定时触发', triggerCondition: '十分钟触发', preDuration: 10, postDuration: 20, outputFormat: 'HLS', enabled: false },
  { id: 4, ruleName: '恶劣天气自动切片', triggerType: '条件触发', triggerCondition: '晚间触发', preDuration: 45, postDuration: 90, outputFormat: 'MP4', enabled: false },
  { id: 5, ruleName: '夜间重点路段巡检切片', triggerType: '定时触发', triggerCondition: '整点触发', preDuration: 15, postDuration: 30, outputFormat: 'MP4', enabled: false },
  { id: 6, ruleName: '超速行为检测切片', triggerType: '实时触发', triggerCondition: '半点触发', preDuration: 20, postDuration: 40, outputFormat: 'MP4', enabled: false },
  { id: 7, ruleName: '应急演练过程记录切片', triggerType: '手动触发', triggerCondition: '整点触发', preDuration: 60, postDuration: 180, outputFormat: 'MP4', enabled: false },
  { id: 8, ruleName: '重点车辆轨迹切片', triggerType: '条件触发', triggerCondition: '半点触发', preDuration: 30, postDuration: 60, outputFormat: 'MP4', enabled: false },
])

const handleAutoSlice = () => { autoSliceVisible.value = true }
const handleAddAutoSliceRule = () => { ElMessage.info('添加规则功能开发中...') }
const handleExportAutoSliceRules = () => { ElMessage.info('导出功能开发中...') }

// ==================== 风险点绑定监控 ====================
const bindMonitorToPointVisible = ref(false)
const bindMonitorToPointTab = ref('notJoined')

// ==================== 添加风险点 ====================
const addRiskPointVisible = ref(false)
const addRiskPointTab = ref('notJoined')

interface RiskPointItem {
  id: number
  pointName: string
  riskType: string
  riskLevel: '重大' | '较大' | '一般' | '低'
  roadSection: string
  managementUnit: string
  contactPhone: string
  updateTime: string
}

const allRiskPointItems = ref<RiskPointItem[]>([
  { id: 1, pointName: 'G4高速护栏破损', riskType: '设施隐患', riskLevel: '重大', roadSection: 'G4天河段', managementUnit: '广州交通局', contactPhone: '020-154521', updateTime: '2026-04-01 08:50' },
  { id: 2, pointName: '南山隧道照明故障', riskType: '设备隐患', riskLevel: '重大', roadSection: 'S3深圳段', managementUnit: '深圳交通局', contactPhone: '020-154521', updateTime: '2026-04-01 08:55' },
  { id: 3, pointName: '清远边坡裂缝', riskType: '地质隐患', riskLevel: '重大', roadSection: 'G78清远段', managementUnit: '清远交通局', contactPhone: '020-154521', updateTime: '2026-04-01 09:00' },
  { id: 4, pointName: '佛山桥梁伸缩缝损坏', riskType: '桥梁隐患', riskLevel: '重大', roadSection: 'G15佛山段', managementUnit: '佛山交通局', contactPhone: '020-154521', updateTime: '2026-04-01 09:05' },
  { id: 5, pointName: '中山服务区消防设备失效', riskType: '消防隐患', riskLevel: '重大', roadSection: 'G94中山段', managementUnit: '中山交通局', contactPhone: '020-154521', updateTime: '2026-04-01 09:10' },
  { id: 6, pointName: '港口道路标线模糊', riskType: '交通设施隐患', riskLevel: '重大', roadSection: '港口道路段', managementUnit: '港口管理单位', contactPhone: '020-154521', updateTime: '2026-04-01 09:15' },
  { id: 7, pointName: '台风影响路段积水', riskType: '气象隐患', riskLevel: '重大', roadSection: '沿海高速', managementUnit: '省交通厅', contactPhone: '020-154521', updateTime: '2026-04-01 09:20' },
  { id: 8, pointName: '大雾路段标志缺失', riskType: '标识隐患', riskLevel: '重大', roadSection: '广州高速', managementUnit: '广州交通局', contactPhone: '020-154521', updateTime: '2026-04-01 09:25' },
  { id: 9, pointName: '惠州危化品通道标识不清', riskType: '安全隐患', riskLevel: '重大', roadSection: '惠州高速', managementUnit: '惠州交通局', contactPhone: '020-154521', updateTime: '2026-04-01 09:30' },
  { id: 10, pointName: '高速收费站设备老化', riskType: '设备隐患', riskLevel: '重大', roadSection: '广深高速', managementUnit: '广深高速公司', contactPhone: '020-154521', updateTime: '2026-04-01 09:35' },
])

const joinedRiskPointIds = ref<Set<number>>(new Set())

const notJoinedRiskPoints = computed(() => allRiskPointItems.value.filter(p => !joinedRiskPointIds.value.has(p.id)))
const joinedRiskPoints = computed(() => allRiskPointItems.value.filter(p => joinedRiskPointIds.value.has(p.id)))

const handleBindMonitorToPoint = (row: RiskPoint) => {
  bindMonitorToPointVisible.value = true
}

const handleAddRiskPoint = () => { addRiskPointVisible.value = true }
const handleJoinRiskPoint = (point: RiskPointItem) => { joinedRiskPointIds.value.add(point.id) }
const handleLeaveRiskPoint = (point: RiskPointItem) => { joinedRiskPointIds.value.delete(point.id) }

// ==================== 其他 ====================
const handlePreviewVideo = (video: ShortVideo) => { ElMessage.info(`预览视频：${video.title}`) }
const handlePreviewSlice = (slice: VideoSlice) => { ElMessage.info(`预览切片：${slice.title}`) }
</script>

<style lang="scss" scoped>
.topic-config {
  min-height: 100%;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  padding: 12px;
}

.config-layout {
  display: flex;
  gap: 0;
  min-height: calc(100vh - 100px);
}

/* ===== 左侧标签页 ===== */
.topic-tabs {
  width: 120px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 0;
  background: #fff;
  border-radius: 12px 0 0 12px;
  border-right: 1px solid #ebeef5;
  position: sticky;
  top: 0;
  height: fit-content;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 16px 8px;
  margin: 0 8px;
  border-radius: 8px;
  cursor: pointer;
  color: #606266;
  transition: all 0.25s ease;
  user-select: none;

  &:hover {
    color: #409eff;
    background: #ecf5ff;
  }

  &.active {
    color: #fff;
    background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.35);
  }

  .tab-label {
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
  }
}

/* ===== 右侧内容区域 ===== */
.config-content {
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #fff;
  border-radius: 0 12px 12px 0;
  overflow-y: auto;
}

/* ===== 区块通用 ===== */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
    position: relative;
    padding-left: 10px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 16px;
      background: linear-gradient(180deg, #409eff, #337ecc);
      border-radius: 2px;
    }
  }
}

.section-actions {
  display: flex;
  gap: 8px;
}

/* ===== 上半部分 ===== */
.content-upper {
  display: flex;
  gap: 16px;
  min-height: 280px;
}

/* -- 监控视频网格 -- */
.monitor-section {
  flex: 2;
  background: #fafafa;
  border-radius: 10px;
  padding: 14px;
  border: 1px solid #ebeef5;
}

.monitor-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.monitor-cell {
  background: #000;
  border-radius: 6px;
  overflow: hidden;
  position: relative;

  .monitor-preview {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .monitor-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.25s;
    }

    &:hover .monitor-overlay {
      opacity: 1;
    }
  }

  .monitor-info {
    padding: 6px 8px;
    background: #fff;

    .monitor-name {
      display: block;
      font-size: 12px;
      color: #303133;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .monitor-location {
      font-size: 11px;
      color: #909399;
    }
  }
}

.empty-cell {
  background: #f5f7fa;
  border: 2px dashed #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;

  .empty-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    aspect-ratio: 16 / 9;
    cursor: pointer;
  }

  &:hover {
    border-color: #409eff;
    background: #ecf5ff;
  }
}

/* -- 短视频区域 -- */
.short-video-section {
  flex: 1;
  background: #fafafa;
  border-radius: 10px;
  padding: 14px;
  border: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
}

.short-video-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}

.short-video-item {
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: #fff;
  border: 1px solid #ebeef5;
  transition: all 0.25s;

  &:hover {
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
  }

  .video-cover {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .video-duration {
      position: absolute;
      right: 6px;
      bottom: 6px;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .video-play-icon {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.2);
      opacity: 0;
      transition: opacity 0.25s;
    }

    &:hover .video-play-icon {
      opacity: 1;
    }
  }

  .video-title {
    padding: 6px 8px;
    font-size: 12px;
    color: #303133;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.empty-item {
  border-style: dashed;
  border-color: #dcdfe6;

  .empty-cover {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
  }

  &:hover {
    border-color: #409eff;
  }
}

/* ===== 中间部分：切片 ===== */
.content-middle {
  flex-shrink: 0;
}

.slice-section {
  background: #fafafa;
  border-radius: 10px;
  padding: 14px;
  border: 1px solid #ebeef5;
}

.slice-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.slice-preview-list {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.slice-item {
  flex-shrink: 0;
  width: 180px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: #fff;
  border: 1px solid #ebeef5;
  transition: all 0.25s;

  &:hover {
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
  }

  .slice-cover {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .slice-duration {
      position: absolute;
      right: 6px;
      bottom: 6px;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .slice-play-icon {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.2);
      opacity: 0;
      transition: opacity 0.25s;
    }

    &:hover .slice-play-icon {
      opacity: 1;
    }
  }

  .slice-title {
    padding: 6px 8px;
    font-size: 12px;
    color: #303133;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.empty-slice {
  border-style: dashed;
  border-color: #dcdfe6;
  width: 160px;

  .empty-slice-cover {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
  }

  &:hover {
    border-color: #409eff;
  }
}

/* ===== 下半部分：风险点位表格 ===== */
.content-lower {
  min-height: 300px;
}

.risk-section {
  background: #fafafa;
  border-radius: 10px;
  padding: 14px;
  border: 1px solid #ebeef5;
}

.sync-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #909399;
}

.data-table {
  width: 100%;
}

/* ===== 抽屉通用样式 ===== */
.drawer-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
}

.bind-monitor-content {
  :deep(.el-tabs__content) {
    padding: 0;
  }
}

.bind-slice-content {
  :deep(.el-tabs__content) {
    padding: 0;
  }
}

.slice-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 16px;
}

.slice-grid-item {
  .slice-image {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #ebeef5;
    aspect-ratio: 16 / 9;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .slice-actions-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.25s;
    }

    &:hover .slice-actions-overlay {
      opacity: 1;
    }

    .slice-checkbox {
      position: absolute;
      bottom: 8px;
      right: 8px;
    }
  }
}

.auto-slice-content {
  .auto-slice-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.video-uploader {
  :deep(.el-upload-dragger) {
    width: 100%;
  }
}

/* ===== 动画 ===== */
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
