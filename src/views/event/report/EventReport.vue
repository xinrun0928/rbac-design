<template>
  <div class="event-report-page">
    <el-card class="table-card" shadow="never">
      <!-- 统计卡片 -->
      <StatsCards v-model="currentTab" :items="statsCards" :card-width="180" @change="handleTabChange" />

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="事故名称">
            <el-input v-model="searchForm.accidentName" placeholder="输入事故名称" clearable :prefix-icon="Search" style="width: 260px" @keyup.enter="handleSearch" />
          </el-form-item>
        </el-form>
        <div class="search-actions">
          <el-button type="primary" :icon="Plus" @click="handleAdd">突发事故上报</el-button>
          <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="id"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column label="序号" width="60" align="center" type="index">
          <template #default="{ $index }">
            <span class="index-text">{{ (pagination.page - 1) * pagination.pageSize + $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="accidentName" label="事故名称" min-width="220" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tooltip content="点击复制" placement="top">
              <span class="name-text copyable" @click="handleCopyName(row.accidentName)">{{ row.accidentName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="reportTime" label="报送时间" width="170" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.reportTime }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="reportType" label="报告类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag effect="light" size="small" :type="getReportTypeTag(row.reportType)">
              {{ getReportTypeText(row.reportType) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="location" label="事故地点" min-width="200" show-overflow-tooltip />

        <el-table-column prop="sceneInfo" label="事故现场信息" min-width="250" show-overflow-tooltip />

        <el-table-column label="操作" width="280" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="View" @click="handleView(row)">详情</el-button>
            <el-button type="warning" link :icon="MapLocation" @click="handleTrack(row)">跟踪</el-button>
            <el-button type="success" link :icon="Edit" @click="handleFollowUp(row)">续报</el-button>
            <el-button type="info" link :icon="Document" @click="handleFinalReport(row)">终报</el-button>
          </template>
        </el-table-column>
      </el-table>

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

    <!-- 突发事故上报弹窗 -->
    <el-drawer
      v-model="drawerVisible"
      title="突发事故上报"
      size="900px"
      direction="rtl"
      destroy-on-close
      class="report-drawer"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" label-position="right" class="report-form">
        <!-- 模块1：事故基础信息 -->
        <div class="form-section">
          <div class="section-title">
            <el-icon><Document /></el-icon>
            <span>事故基础信息</span>
          </div>

          <el-form-item label="事故名称" prop="accidentName">
            <el-input v-model="formData.accidentName" placeholder="请输入事故名称" maxlength="100" />
          </el-form-item>

          <el-form-item label="接报时间" prop="reportTime">
            <el-date-picker
              v-model="formData.reportTime"
              type="datetime"
              placeholder="选择接报时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>

          <el-form-item label="报送状态" prop="reportStatus">
            <el-select v-model="formData.reportStatus" placeholder="请选择报送状态" style="width: 100%">
              <el-option label="首报（需有终报）" value="首报（需有终报）" />
              <el-option label="首报也是终报（无需续报）" value="首报也是终报（无需续报）" />
            </el-select>
          </el-form-item>

          <el-form-item label="接报来源" prop="reportSource">
            <el-input v-model="formData.reportSource" placeholder="如：交警/路政/群众" maxlength="100" />
          </el-form-item>

          <el-form-item label="事故地点" prop="location">
            <div class="location-input">
              <el-input v-model="formData.location" placeholder="请输入事故地点" style="flex: 1">
                <template #suffix>
                  <el-icon class="location-icon" @click="handleOpenMap"><MapLocation /></el-icon>
                </template>
              </el-input>
              <el-input v-model="formData.stakeNo" placeholder="桩号" style="width: 120px; margin-left: 8px" />
            </div>
          </el-form-item>

          <el-form-item label="事故车辆信息" prop="vehicleTypes">
            <div class="vehicle-section">
              <div class="vehicle-row">
                <el-select v-model="formData.vehicleTypes" multiple placeholder="请选择车辆类型" class="vehicle-type-select">
                  <el-option label="小车" value="小车" />
                  <el-option label="货车" value="货车" />
                  <el-option label="危化品" value="危化品" />
                  <el-option label="重型货车" value="重型货车" />
                  <el-option label="大客车" value="大客车" />
                  <el-option label="不涉及" value="不涉及" />
                  <el-option label="待核查" value="待核查" />
                </el-select>
                <el-input v-model="formData.licensePlate" placeholder="车牌号" class="plate-input" />
                <el-button
                  :type="formData.isSpecialVehicle ? 'warning' : ''"
                  @click="formData.isSpecialVehicle = !formData.isSpecialVehicle"
                  class="special-btn"
                >
                  两客一危一重
                </el-button>
                <el-input v-model="formData.specialVehicleDesc" placeholder="补充说明" class="desc-input" />
                <el-button v-if="formData.vehicleDetails.length === 0" type="primary" circle :icon="Plus" @click="addVehicleDetail" />
                <el-button v-else type="danger" circle :icon="Delete" @click="removeFirstVehicle" />
              </div>
              <div v-for="(item, index) in formData.vehicleDetails" :key="index" class="vehicle-row">
                <el-select v-model="item.type" placeholder="车辆类型" class="vehicle-type-select">
                  <el-option label="大客车" value="大客车" />
                  <el-option label="旅游包车" value="旅游包车" />
                  <el-option label="危化品车" value="危化品车" />
                  <el-option label="重型货车" value="重型货车" />
                  <el-option label="小车" value="小车" />
                  <el-option label="货车" value="货车" />
                </el-select>
                <el-input v-model="item.plateNo" placeholder="车牌号" class="plate-input" />
                <el-button
                  :type="item.isSpecial ? 'warning' : ''"
                  @click="item.isSpecial = !item.isSpecial"
                  class="special-btn"
                >
                  两客一危一重
                </el-button>
                <el-input v-model="item.specialDesc" placeholder="补充说明" class="desc-input" />
                <el-button v-if="index === formData.vehicleDetails.length - 1" type="primary" circle :icon="Plus" @click="addVehicleDetail" />
                <el-button v-else type="danger" circle :icon="Delete" @click="removeVehicleDetail(index)" />
              </div>
            </div>
          </el-form-item>

          <el-form-item label="现场情况" prop="sceneCondition">
            <el-select v-model="formData.sceneCondition" multiple placeholder="请选择现场情况" style="width: 100%">
              <el-option label="车辆着火" value="车辆着火" />
              <el-option label="危化品车辆泄露" value="危化品车辆泄露" />
              <el-option label="货车追尾" value="货车追尾" />
              <el-option label="多车连环追尾" value="多车连环追尾" />
              <el-option label="大巴车事故" value="大巴车事故" />
              <el-option label="以上不涉及" value="以上不涉及" />
            </el-select>
          </el-form-item>

          <el-form-item label="事故情况" prop="accidentDesc">
            <el-input v-model="formData.accidentDesc" type="textarea" :rows="4" placeholder="请详细描述事故经过" maxlength="2000" show-word-limit />
          </el-form-item>
        </div>

        <!-- 模块2：交通影响与伤亡 -->
        <div class="form-section">
          <div class="section-title">
            <el-icon><Warning /></el-icon>
            <span>交通影响与伤亡</span>
          </div>

          <el-form-item label="是否阻断" prop="isBlocked">
            <el-radio-group v-model="formData.isBlocked">
              <el-radio value="未造成">未造成</el-radio>
              <el-radio value="中断">中断</el-radio>
              <el-radio value="阻塞">阻塞</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="交通情况" prop="trafficCondition">
            <div class="condition-input">
              <el-select v-model="formData.trafficCondition" placeholder="请选择" style="width: 160px">
                <el-option label="无影响" value="无影响" />
                <el-option label="明显拥堵" value="明显拥堵" />
                <el-option label="出现缓行" value="出现缓行" />
                <el-option label="通行基本正常" value="通行基本正常" />
                <el-option label="交通中断" value="交通中断" />
              </el-select>
            </div>
            <el-input v-model="formData.trafficDesc" type="textarea" :rows="3" placeholder="情况说明" maxlength="500" show-word-limit style="margin-top: 8px" />
          </el-form-item>

          <el-form-item label="受伤人数">
            <div class="count-input">
              <el-input-number v-model="formData.injuredCount" :min="0" :max="9999" controls-position="right" style="width: 120px" />
              <el-input v-model="formData.injuredDesc" placeholder="补充说明（选填）" style="flex: 1; margin-left: 8px" />
            </div>
          </el-form-item>

          <el-form-item label="死亡人数">
            <div class="count-input">
              <el-input-number v-model="formData.deadCount" :min="0" :max="9999" controls-position="right" style="width: 120px" />
              <el-input v-model="formData.deadDesc" placeholder="补充说明（选填）" style="flex: 1; margin-left: 8px" />
            </div>
          </el-form-item>
        </div>

        <!-- 模块3：救援、原因、位置与附件 -->
        <div class="form-section">
          <div class="section-title">
            <el-icon><Location /></el-icon>
            <span>救援、原因、位置与附件</span>
          </div>

          <el-form-item label="救援信息说明" prop="rescueInfo">
            <el-input v-model="formData.rescueInfo" placeholder="请输入救援信息说明" maxlength="500" />
          </el-form-item>

          <el-form-item label="救援时间">
            <el-date-picker
              v-model="formData.rescueTime"
              type="datetime"
              placeholder="选择救援时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>

          <el-form-item label="救援过程">
            <el-input v-model="formData.rescueProcess" type="textarea" :rows="3" placeholder="请输入救援过程（选填）" maxlength="1000" show-word-limit />
          </el-form-item>

          <el-form-item label="事故原因" prop="accidentCause">
            <el-input v-model="formData.accidentCause" placeholder="请输入事故原因" maxlength="500" />
          </el-form-item>

          <el-form-item label="事故级别" prop="accidentLevel">
            <el-select v-model="formData.accidentLevel" placeholder="请选择事故级别" style="width: 100%">
              <el-option label="一般事故" value="一般事故" />
              <el-option label="重大事故" value="重大事故" />
            </el-select>
          </el-form-item>

          <el-form-item label="阻断原因" prop="blockCause">
            <el-select v-model="formData.blockCause" placeholder="请选择阻断原因" style="width: 100%">
              <el-option label="交通事故" value="交通事故" />
              <el-option label="道路施工" value="道路施工" />
              <el-option label="恶劣天气" value="恶劣天气" />
              <el-option label="地质灾害" value="地质灾害" />
              <el-option label="设施故障" value="设施故障" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>

          <el-form-item label="阻断起点坐标">
            <div class="location-input">
              <el-input v-model="formData.blockStartLng" placeholder="经度" style="flex: 1" @blur="validateCoord('blockStartLng', $event)" />
              <el-input v-model="formData.blockStartLat" placeholder="纬度" style="flex: 1; margin-left: 8px" @blur="validateCoord('blockStartLat', $event)" />
            </div>
          </el-form-item>

          <el-form-item label="阻断终点坐标">
            <div class="location-input">
              <el-input v-model="formData.blockEndLng" placeholder="经度" style="flex: 1" @blur="validateCoord('blockEndLng', $event)" />
              <el-input v-model="formData.blockEndLat" placeholder="纬度" style="flex: 1; margin-left: 8px" @blur="validateCoord('blockEndLat', $event)" />
            </div>
          </el-form-item>

          <el-form-item label="现场联系人" prop="contactPerson">
            <el-input v-model="formData.contactPerson" placeholder="请输入现场联系人" maxlength="50" />
          </el-form-item>

          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="formData.contactPhone" placeholder="请输入联系电话" maxlength="20" />
          </el-form-item>

          <el-form-item label="影响范围">
            <el-input v-model="formData.impactRange" placeholder="如：K12+300至K13+200" maxlength="200" />
          </el-form-item>

          <el-form-item label="是否占道">
            <el-radio-group v-model="formData.isOccupyLane">
              <el-radio value="是">是</el-radio>
              <el-radio value="否">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <!-- 附件区 -->
        <div class="form-section">
          <div class="section-title">
            <el-icon><Paperclip /></el-icon>
            <span>附件上传</span>
          </div>

          <el-form-item label="现场照片">
            <el-upload
              v-model:file-list="formData.photos"
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :limit="5"
              accept="image/*"
            >
              <el-icon><Plus /></el-icon>
              <template #tip>
                <div class="el-upload__tip">支持 jpg/png 格式，最多5张</div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item label="历史视频">
            <el-upload
              v-model:file-list="formData.videos"
              action="#"
              :auto-upload="false"
              :limit="3"
              accept="video/*"
            >
              <el-button type="primary" :icon="Upload">上传视频</el-button>
              <template #tip>
                <div class="el-upload__tip">支持 mp4 格式，最多3个，单个不超过500MB</div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item label="其他附件">
            <el-upload
              v-model:file-list="formData.attachments"
              action="#"
              :auto-upload="false"
              :limit="5"
            >
              <el-button type="primary" :icon="Upload">上传附件</el-button>
              <template #tip>
                <div class="el-upload__tip">支持 pdf/doc/xls 格式，最多5个</div>
              </template>
            </el-upload>
          </el-form-item>
        </div>

        <!-- 备注 -->
        <div class="form-section">
          <div class="section-title">
            <el-icon><Edit /></el-icon>
            <span>备注信息</span>
          </div>

          <el-form-item label="备注">
            <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注信息（选填）" maxlength="1000" show-word-limit />
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button type="warning" @click="handleAiParse">
            <el-icon><MagicStick /></el-icon>
            AI解析
          </el-button>
          <div class="footer-right">
            <el-button @click="drawerVisible = false">关闭页面</el-button>
            <el-button type="primary" @click="handleSubmit">确定上报</el-button>
          </div>
        </div>
      </template>
    </el-drawer>

    <!-- 跟踪弹窗 -->
    <el-drawer
      v-model="trackDrawerVisible"
      :title="'事故跟踪 - ' + (trackRow?.accidentName || '')"
      size="700px"
      direction="rtl"
      destroy-on-close
    >
      <el-form ref="trackFormRef" :model="trackFormData" :rules="trackFormRules" label-width="100px" label-position="right">
        <el-form-item label="描述" prop="description">
          <el-input v-model="trackFormData.description" type="textarea" :rows="4" placeholder="请输入跟踪描述" maxlength="1000" show-word-limit />
        </el-form-item>

        <el-form-item label="数据来源" prop="dataSource">
          <el-input v-model="trackFormData.dataSource" placeholder="请输入数据来源" maxlength="100" />
        </el-form-item>

        <el-form-item label="发生时间" prop="occurTime">
          <el-date-picker
            v-model="trackFormData.occurTime"
            type="datetime"
            placeholder="选择发生时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="现场照片">
          <el-upload
            v-model:file-list="trackFormData.photos"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="5"
            accept="image/*"
          >
            <el-icon><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">支持 jpg/png 格式，最多5张</div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="历史视频">
          <el-upload
            v-model:file-list="trackFormData.videos"
            action="#"
            :auto-upload="false"
            :limit="3"
            accept="video/*"
          >
            <el-button type="primary" :icon="Upload">上传视频</el-button>
            <template #tip>
              <div class="el-upload__tip">支持 mp4 格式，最多3个，事发前后视频</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="trackDrawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleTrackSubmit">确定</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 续报/终报弹窗 -->
    <el-drawer
      v-model="reportDrawerVisible"
      :title="reportType === 'followUp' ? '事故续报' : '事故终报'"
      size="100%"
      direction="rtl"
      destroy-on-close
    >
      <div class="report-drawer-content">
        <!-- 左侧表单 -->
        <div class="report-form-section">
          <el-form ref="reportFormRef" :model="reportFormData" :rules="reportFormRules" label-width="120px" label-position="right" class="report-form">
            <!-- 模块1：事故基础信息 -->
            <div class="form-section">
              <div class="section-title">
                <el-icon><Document /></el-icon>
                <span>事故基础信息</span>
              </div>

              <el-form-item label="事故名称" prop="accidentName">
                <el-input v-model="reportFormData.accidentName" placeholder="请输入事故名称" maxlength="100" />
              </el-form-item>

              <el-form-item label="接报时间" prop="reportTime">
                <el-date-picker
                  v-model="reportFormData.reportTime"
                  type="datetime"
                  placeholder="选择接报时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
                />
              </el-form-item>

              <el-form-item label="报送状态" prop="reportStatus">
                <el-select v-model="reportFormData.reportStatus" placeholder="请选择报送状态" style="width: 100%">
                  <el-option label="首报（需有终报）" value="首报（需有终报）" />
                  <el-option label="首报也是终报（无需续报）" value="首报也是终报（无需续报）" />
                </el-select>
              </el-form-item>

              <el-form-item label="接报来源" prop="reportSource">
                <el-input v-model="reportFormData.reportSource" placeholder="如：交警/路政/群众" maxlength="100" />
              </el-form-item>

              <el-form-item label="事故地点" prop="location">
                <div class="location-input">
                  <el-input v-model="reportFormData.location" placeholder="请输入事故地点" style="flex: 1">
                    <template #suffix>
                      <el-icon class="location-icon" @click="handleOpenMap"><MapLocation /></el-icon>
                    </template>
                  </el-input>
                  <el-input v-model="reportFormData.stakeNo" placeholder="桩号" style="width: 120px; margin-left: 8px" />
                </div>
              </el-form-item>

              <el-form-item label="事故车辆信息" prop="vehicleTypes">
                <div class="vehicle-section">
                  <div class="vehicle-row" v-for="(item, index) in reportFormData.vehicleDetails" :key="index">
                    <el-select v-model="item.type" placeholder="车辆类型" class="vehicle-type-select">
                      <el-option label="小车" value="小车" />
                      <el-option label="货车" value="货车" />
                      <el-option label="危化品" value="危化品" />
                      <el-option label="重型货车" value="重型货车" />
                      <el-option label="大客车" value="大客车" />
                      <el-option label="不涉及" value="不涉及" />
                      <el-option label="待核查" value="待核查" />
                    </el-select>
                    <el-input v-model="item.plateNo" placeholder="车牌号" class="plate-input" />
                    <el-button
                      :type="item.isSpecial ? 'warning' : ''"
                      @click="item.isSpecial = !item.isSpecial"
                      class="special-btn"
                    >
                      两客一危一重
                    </el-button>
                    <el-input v-model="item.specialDesc" placeholder="补充说明" class="desc-input" />
                    <el-button v-if="index === reportFormData.vehicleDetails.length - 1" type="primary" circle :icon="Plus" @click="addReportVehicleDetail" />
                    <el-button v-else type="danger" circle :icon="Delete" @click="removeReportVehicleDetail(index)" />
                  </div>
                  <div v-if="reportFormData.vehicleDetails.length === 0" class="vehicle-row">
                    <el-button type="primary" :icon="Plus" @click="addReportVehicleDetail">添加车辆</el-button>
                  </div>
                </div>
              </el-form-item>

              <el-form-item label="现场情况" prop="sceneCondition">
                <el-select v-model="reportFormData.sceneCondition" multiple placeholder="请选择现场情况" style="width: 100%">
                  <el-option label="车辆着火" value="车辆着火" />
                  <el-option label="危化品车辆泄露" value="危化品车辆泄露" />
                  <el-option label="货车追尾" value="货车追尾" />
                  <el-option label="多车连环追尾" value="多车连环追尾" />
                  <el-option label="大巴车事故" value="大巴车事故" />
                  <el-option label="以上不涉及" value="以上不涉及" />
                </el-select>
              </el-form-item>

              <el-form-item label="事故情况" prop="accidentDesc">
                <el-input v-model="reportFormData.accidentDesc" type="textarea" :rows="4" placeholder="请详细描述事故经过" maxlength="2000" show-word-limit />
              </el-form-item>
            </div>

            <!-- 模块2：交通影响与伤亡 -->
            <div class="form-section">
              <div class="section-title">
                <el-icon><Warning /></el-icon>
                <span>交通影响与伤亡</span>
              </div>

              <el-form-item label="是否阻断" prop="isBlocked">
                <el-radio-group v-model="reportFormData.isBlocked">
                  <el-radio value="未造成">未造成</el-radio>
                  <el-radio value="中断">中断</el-radio>
                  <el-radio value="阻塞">阻塞</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="交通情况" prop="trafficCondition">
                <div class="condition-input">
                  <el-select v-model="reportFormData.trafficCondition" placeholder="请选择" style="width: 160px">
                    <el-option label="无影响" value="无影响" />
                    <el-option label="明显拥堵" value="明显拥堵" />
                    <el-option label="出现缓行" value="出现缓行" />
                    <el-option label="通行基本正常" value="通行基本正常" />
                    <el-option label="交通中断" value="交通中断" />
                  </el-select>
                </div>
                <el-input v-model="reportFormData.trafficDesc" type="textarea" :rows="3" placeholder="情况说明" maxlength="500" show-word-limit style="margin-top: 8px" />
              </el-form-item>

              <el-form-item label="受伤人数" prop="injuredCount">
                <div class="count-input">
                  <el-input-number v-model="reportFormData.injuredCount" :min="0" :max="999" controls-position="right" />
                  <el-input v-model="reportFormData.injuredDesc" placeholder="伤亡情况说明" style="flex: 1; margin-left: 8px" />
                </div>
              </el-form-item>

              <el-form-item label="死亡人数" prop="deadCount">
                <div class="count-input">
                  <el-input-number v-model="reportFormData.deadCount" :min="0" :max="999" controls-position="right" />
                  <el-input v-model="reportFormData.deadDesc" placeholder="伤亡情况说明" style="flex: 1; margin-left: 8px" />
                </div>
              </el-form-item>
            </div>

            <!-- 模块3：救援、原因、位置与附件 -->
            <div class="form-section">
              <div class="section-title">
                <el-icon><Location /></el-icon>
                <span>救援、原因、位置与附件</span>
              </div>

              <el-form-item label="救援信息" prop="rescueInfo">
                <el-input v-model="reportFormData.rescueInfo" type="textarea" :rows="3" placeholder="请输入救援信息说明" maxlength="500" show-word-limit />
              </el-form-item>

              <el-form-item label="事故原因" prop="accidentCause">
                <el-input v-model="reportFormData.accidentCause" type="textarea" :rows="2" placeholder="请输入事故原因" maxlength="500" show-word-limit />
              </el-form-item>

              <el-form-item label="事故级别" prop="accidentLevel">
                <el-select v-model="reportFormData.accidentLevel" placeholder="请选择事故级别" style="width: 100%">
                  <el-option label="一般事故" value="一般事故" />
                  <el-option label="重大事故" value="重大事故" />
                </el-select>
              </el-form-item>

              <el-form-item label="阻断原因" prop="blockCause">
                <el-select v-model="reportFormData.blockCause" placeholder="请选择阻断原因" style="width: 100%">
                  <el-option label="交通事故" value="交通事故" />
                  <el-option label="道路施工" value="道路施工" />
                  <el-option label="恶劣天气" value="恶劣天气" />
                  <el-option label="地质灾害" value="地质灾害" />
                  <el-option label="设施故障" value="设施故障" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>

              <el-form-item label="阻断起点坐标">
                <div class="location-input">
                  <el-input v-model="reportFormData.blockStartLng" placeholder="经度" style="flex: 1" @blur="validateReportCoord('blockStartLng', $event)" />
                  <el-input v-model="reportFormData.blockStartLat" placeholder="纬度" style="flex: 1; margin-left: 8px" @blur="validateReportCoord('blockStartLat', $event)" />
                </div>
              </el-form-item>

              <el-form-item label="阻断终点坐标">
                <div class="location-input">
                  <el-input v-model="reportFormData.blockEndLng" placeholder="经度" style="flex: 1" @blur="validateReportCoord('blockEndLng', $event)" />
                  <el-input v-model="reportFormData.blockEndLat" placeholder="纬度" style="flex: 1; margin-left: 8px" @blur="validateReportCoord('blockEndLat', $event)" />
                </div>
              </el-form-item>

              <el-form-item label="现场联系人" prop="contactPerson">
                <el-input v-model="reportFormData.contactPerson" placeholder="请输入现场联系人" maxlength="50" />
              </el-form-item>

              <el-form-item label="联系电话" prop="contactPhone">
                <el-input v-model="reportFormData.contactPhone" placeholder="请输入联系电话" maxlength="20" />
              </el-form-item>

              <el-form-item label="影响范围">
                <el-input v-model="reportFormData.impactRange" placeholder="如：K12+300至K13+200" maxlength="200" />
              </el-form-item>

              <el-form-item label="是否占道">
                <el-radio-group v-model="reportFormData.isOccupyLane">
                  <el-radio value="是">是</el-radio>
                  <el-radio value="否">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>

            <!-- 附件区 -->
            <div class="form-section">
              <div class="section-title">
                <el-icon><Paperclip /></el-icon>
                <span>附件上传</span>
              </div>

              <el-form-item label="现场照片">
                <el-upload
                  v-model:file-list="reportFormData.photos"
                  action="#"
                  list-type="picture-card"
                  :auto-upload="false"
                  :limit="5"
                  accept="image/*"
                >
                  <el-icon><Plus /></el-icon>
                  <template #tip>
                    <div class="el-upload__tip">支持 jpg/png 格式，最多5张</div>
                  </template>
                </el-upload>
              </el-form-item>

              <el-form-item label="历史视频">
                <el-upload
                  v-model:file-list="reportFormData.videos"
                  action="#"
                  :auto-upload="false"
                  :limit="3"
                  accept="video/*"
                >
                  <el-button type="primary" :icon="Upload">上传视频</el-button>
                  <template #tip>
                    <div class="el-upload__tip">支持 mp4 格式，最多3个，单个不超过500MB</div>
                  </template>
                </el-upload>
              </el-form-item>

              <el-form-item label="其他附件">
                <el-upload
                  v-model:file-list="reportFormData.attachments"
                  action="#"
                  :auto-upload="false"
                  :limit="5"
                >
                  <el-button type="primary" :icon="Upload">上传附件</el-button>
                  <template #tip>
                    <div class="el-upload__tip">支持 pdf/doc/xls 格式，最多5个</div>
                  </template>
                </el-upload>
              </el-form-item>
            </div>

            <!-- 备注 -->
            <div class="form-section">
              <div class="section-title">
                <el-icon><Edit /></el-icon>
                <span>备注信息</span>
              </div>

              <el-form-item label="备注">
                <el-input v-model="reportFormData.remark" type="textarea" :rows="3" placeholder="请输入备注信息（选填）" maxlength="1000" show-word-limit />
              </el-form-item>
            </div>
          </el-form>
        </div>

        <!-- 右侧报告预览 -->
        <div class="report-preview-section">
          <div class="preview-title">报告预览</div>
          <div class="preview-cards">
            <div v-for="(report, index) in reportPreviewData" :key="index" class="preview-card">
              <div class="card-header">【{{ report.type }}】</div>
              <div class="card-content">{{ report.content }}</div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="drawer-footer">
          <div class="footer-left">
            <el-button @click="handleClearReference">清空引用的内容</el-button>
            <el-button @click="handleUseLastReport">引用上一次的报告</el-button>
            <el-button type="warning" @click="handleAiParse">
              <el-icon><MagicStick /></el-icon>
              AI解析
            </el-button>
          </div>
          <div class="footer-right">
            <el-button @click="reportDrawerVisible = false">关闭页面</el-button>
            <el-button type="primary" @click="handleReportSubmit">确定上报</el-button>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Search, Plus, Download, View, MapLocation, Edit, Document,
  CircleCheck, Clock, CloseBold, Warning, Location, Paperclip, Upload, MagicStick, Delete
} from '@element-plus/icons-vue'
import { mockEventReportData, mockReportPreviewData } from '@/mock/event/reportData'
import type { EventReport } from '@/types/event/report'
import StatsCards from '@/components/StatsCards.vue'

// ── 搜索 ──
const searchForm = reactive({
  accidentName: ''
})

// ── 状态 ──
const loading = ref(false)
const currentTab = ref('all')
const drawerVisible = ref(false)
const trackDrawerVisible = ref(false)
const reportDrawerVisible = ref(false)
const reportType = ref<'followUp' | 'final'>('followUp')
const reportRow = ref<EventReport | null>(null)
const trackRow = ref<EventReport | null>(null)
const formRef = ref<FormInstance>()
const trackFormRef = ref<FormInstance>()
const reportFormRef = ref<FormInstance>()

// ── 分页 ──
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// ── 表格数据 ──
const allData = ref<EventReport[]>([...mockEventReportData])

// ── 表单数据 ──
const formData = reactive({
  // 模块1：事故基础信息
  accidentName: '',
  reportTime: '',
  reportStatus: '',
  reportSource: '',
  location: '',
  stakeNo: '',
  vehicleTypes: [] as string[],
  licensePlate: '',
  isSpecialVehicle: false,
  specialVehicleDesc: '',
  vehicleDetails: [] as { type: string; plateNo: string; isSpecial: boolean; specialDesc: string }[],
  accidentDesc: '',
  sceneCondition: [] as string[],
  // 模块2：交通影响与伤亡
  isBlocked: '未造成',
  trafficCondition: '',
  trafficDesc: '',
  injuredCount: 0,
  injuredDesc: '',
  deadCount: 0,
  deadDesc: '',
  // 模块3：救援、原因、位置与附件
  rescueInfo: '',
  rescueTime: '',
  rescueProcess: '',
  accidentCause: '',
  accidentLevel: '',
  blockCause: '',
  blockStartLng: '',
  blockStartLat: '',
  blockEndLng: '',
  blockEndLat: '',
  contactPerson: '',
  contactPhone: '',
  impactRange: '',
  isOccupyLane: '',
  // 附件
  photos: [] as any[],
  videos: [] as any[],
  attachments: [] as any[],
  // 备注
  remark: ''
})

// ── 跟踪表单数据 ──
const trackFormData = reactive({
  description: '',
  dataSource: '',
  occurTime: '',
  photos: [] as any[],
  videos: [] as any[]
})

// ── 跟踪表单校验 ──
const trackFormRules: FormRules = {
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  dataSource: [{ required: true, message: '请输入数据来源', trigger: 'blur' }],
  occurTime: [{ required: true, message: '请选择发生时间', trigger: 'change' }]
}

// ── 续报/终报表单数据 ──
const reportFormData = reactive({
  // 模块1：事故基础信息
  accidentName: '',
  reportTime: '',
  reportStatus: '',
  reportSource: '',
  location: '',
  stakeNo: '',
  vehicleTypes: [] as string[],
  licensePlate: '',
  isSpecialVehicle: false,
  specialVehicleDesc: '',
  vehicleDetails: [] as { type: string; plateNo: string; isSpecial: boolean; specialDesc: string }[],
  accidentDesc: '',
  sceneCondition: [] as string[],
  // 模块2：交通影响与伤亡
  isBlocked: '未造成',
  trafficCondition: '',
  trafficDesc: '',
  injuredCount: 0,
  injuredDesc: '',
  deadCount: 0,
  deadDesc: '',
  // 模块3：救援、原因、位置与附件
  rescueInfo: '',
  rescueTime: '',
  rescueProcess: '',
  accidentCause: '',
  accidentLevel: '',
  blockCause: '',
  blockStartLng: '',
  blockStartLat: '',
  blockEndLng: '',
  blockEndLat: '',
  contactPerson: '',
  contactPhone: '',
  impactRange: '',
  isOccupyLane: '',
  // 附件
  photos: [] as any[],
  videos: [] as any[],
  attachments: [] as any[],
  // 备注
  remark: ''
})

// ── 续报/终报表单校验 ──
const reportFormRules: FormRules = {
  accidentName: [{ required: true, message: '请输入事故名称', trigger: 'blur' }],
  reportTime: [{ required: true, message: '请选择接报时间', trigger: 'change' }],
  reportStatus: [{ required: true, message: '请选择报送状态', trigger: 'change' }],
  reportSource: [{ required: true, message: '请输入接报来源', trigger: 'blur' }],
  location: [{ required: true, message: '请输入事故地点', trigger: 'blur' }],
  vehicleTypes: [{ required: true, message: '请选择事故车辆信息', trigger: 'change' }],
  sceneCondition: [{ required: true, message: '请选择现场情况', trigger: 'change' }],
  accidentDesc: [{ required: true, message: '请输入事故情况', trigger: 'blur' }],
  isBlocked: [{ required: true, message: '请选择是否阻断', trigger: 'change' }],
  trafficCondition: [{ required: true, message: '请选择交通情况', trigger: 'change' }],
  rescueInfo: [{ required: true, message: '请输入救援信息说明', trigger: 'blur' }],
  accidentCause: [{ required: true, message: '请输入事故原因', trigger: 'blur' }],
  contactPerson: [{ required: true, message: '请输入现场联系人', trigger: 'blur' }],
  contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
}

// ── 报告预览数据 ──
const reportPreviewData = ref<{ type: string; content: string }[]>([])

// 生成报告内容
function generateReportContent(type: 'first' | 'followUp' | 'final', data: any): string {
  const typeMap = { first: '首报', followUp: '续报', final: '终报' }
  const typeName = typeMap[type]

  let content = `【${typeName}】\n\n`
  content += `${data.reportTime || '时间待填写'}接广播监控报告事故信息\n\n`
  content += `【一】发现时间：${data.reportTime || '待填写'}。\n\n`
  content += `【二】事故地点：${data.location || '待填写'}（${data.stakeNo || ''}）。\n\n`

  // 事故车辆信息
  let vehicleInfo = ''
  if (data.vehicleDetails && data.vehicleDetails.length > 0) {
    vehicleInfo = data.vehicleDetails.map((v: any) => {
      let info = v.plateNo || '车牌待核实'
      if (v.type) info += v.type
      if (v.isSpecial) info += '（两客一危一重）'
      if (v.specialDesc) info += v.specialDesc
      return info
    }).join('、')
  } else if (data.licensePlate) {
    vehicleInfo = data.licensePlate
  } else {
    vehicleInfo = '车牌待核实'
  }
  content += `【三】事故车辆信息：${vehicleInfo}。\n\n`

  // 事故现场信息
  content += `【四】事故现场信息：\n\n`
  content += `【1】事故情况：${data.accidentDesc || '待填写'}。\n\n`
  content += `【2】交通情况：${data.trafficDesc || data.trafficCondition || '待填写'}。\n\n`
  content += `【3】伤亡情况：${data.injuredDesc || '待核实'}。\n\n`

  // 救援信息
  content += `【五】事故救援信息：${data.rescueInfo || '待填写'}。\n\n`

  // 事故原因
  content += `【六】事故原因：${data.accidentCause || '待核实'}。\n\n`

  // 备注
  if (data.remark) {
    content += `备注：${data.remark}\n\n`
  }

  // 现场照片
  content += `现场照片：${data.photos && data.photos.length > 0 ? data.photos.length + '张' : '—'}\n\n`

  // 历史视频
  content += `历史视频：${data.videos && data.videos.length > 0 ? data.videos.length + '个' : '—'}\n`

  return content
}

// ── 表单校验 ──
const formRules: FormRules = {
  // 模块1：事故基础信息（全部必填）
  accidentName: [{ required: true, message: '请输入事故名称', trigger: 'blur' }],
  reportTime: [{ required: true, message: '请选择接报时间', trigger: 'change' }],
  reportStatus: [{ required: true, message: '请选择报送状态', trigger: 'change' }],
  reportSource: [{ required: true, message: '请输入接报来源', trigger: 'blur' }],
  location: [{ required: true, message: '请输入事故地点', trigger: 'blur' }],
  vehicleTypes: [{ required: true, message: '请选择事故车辆信息', trigger: 'change' }],
  sceneCondition: [{ required: true, message: '请选择现场情况', trigger: 'change' }],
  accidentDesc: [{ required: true, message: '请输入事故情况', trigger: 'blur' }],
  // 模块2
  isBlocked: [{ required: true, message: '请选择是否阻断', trigger: 'change' }],
  trafficCondition: [{ required: true, message: '请选择交通情况', trigger: 'change' }],
  // 模块3
  rescueInfo: [{ required: true, message: '请输入救援信息说明', trigger: 'blur' }],
  accidentCause: [{ required: true, message: '请输入事故原因', trigger: 'blur' }],
  contactPerson: [{ required: true, message: '请输入现场联系人', trigger: 'blur' }],
  contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  // 坐标格式验证
  blockStartLng: [{ pattern: /^-?\d+(\.\d+)?$/, message: '请输入正确的经度格式', trigger: 'blur' }],
  blockStartLat: [{ pattern: /^-?\d+(\.\d+)?$/, message: '请输入正确的纬度格式', trigger: 'blur' }],
  blockEndLng: [{ pattern: /^-?\d+(\.\d+)?$/, message: '请输入正确的经度格式', trigger: 'blur' }],
  blockEndLat: [{ pattern: /^-?\d+(\.\d+)?$/, message: '请输入正确的纬度格式', trigger: 'blur' }]
}

// ── 统计数据 ──
const statsCards = computed(() => [
  { key: 'all', label: '全部事故', value: allData.value.length, icon: Document, color: '#409EFF', bgColor: '#ecf5ff' },
  { key: 'pending', label: '未终报', value: allData.value.filter(d => d.status === 0).length, icon: Warning, color: '#E6A23C', bgColor: '#fdf6ec' },
  { key: 'reported', label: '已终报', value: allData.value.filter(d => d.status === 1).length, icon: CircleCheck, color: '#67C23A', bgColor: '#f0f9eb' },
  { key: 'closed', label: '已关闭', value: allData.value.filter(d => d.status === 2).length, icon: CloseBold, color: '#909399', bgColor: '#f4f4f5' },
])

// ── 过滤 + 分页 ──
const filteredData = computed(() => {
  let data = allData.value

  if (currentTab.value === 'pending') {
    data = data.filter(d => d.status === 0)
  } else if (currentTab.value === 'reported') {
    data = data.filter(d => d.status === 1)
  } else if (currentTab.value === 'closed') {
    data = data.filter(d => d.status === 2)
  }

  if (searchForm.accidentName) {
    const keyword = searchForm.accidentName.toLowerCase()
    data = data.filter(item =>
      item.accidentName.toLowerCase().includes(keyword)
    )
  }

  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

// ── 报告类型 ──
function getReportTypeText(type: number) {
  const map: Record<number, string> = { 1: '首报', 2: '续报', 3: '终报' }
  return map[type] || ''
}

function getReportTypeTag(type: number) {
  const map: Record<number, string> = { 1: '', 2: 'warning', 3: 'success' }
  return map[type] || ''
}

// ── 方法 ──
function handleTabChange(key: string) {
  currentTab.value = key
  pagination.page = 1
}

function handleSearch() {
  pagination.page = 1
}

function handleAdd() {
  resetForm()
  drawerVisible.value = true
}

function resetForm() {
  formData.accidentName = ''
  formData.reportTime = ''
  formData.reportStatus = ''
  formData.reportSource = ''
  formData.location = ''
  formData.stakeNo = ''
  formData.vehicleTypes = []
  formData.licensePlate = ''
  formData.isSpecialVehicle = false
  formData.specialVehicleDesc = ''
  formData.vehicleDetails = []
  formData.accidentDesc = ''
  formData.sceneCondition = []
  formData.isBlocked = ''
  formData.trafficCondition = ''
  formData.trafficDesc = ''
  formData.injuredCount = 0
  formData.injuredDesc = ''
  formData.deadCount = 0
  formData.deadDesc = ''
  formData.rescueInfo = ''
  formData.rescueTime = ''
  formData.rescueProcess = ''
  formData.accidentCause = ''
  formData.accidentLevel = ''
  formData.blockCause = ''
  formData.blockStartLng = ''
  formData.blockStartLat = ''
  formData.blockEndLng = ''
  formData.blockEndLat = ''
  formData.contactPerson = ''
  formData.contactPhone = ''
  formData.impactRange = ''
  formData.isOccupyLane = ''
  formData.photos = []
  formData.videos = []
  formData.attachments = []
  formData.remark = ''
}

// 坐标格式验证
function validateCoord(field: string, event: Event) {
  const value = (event.target as HTMLInputElement).value
  if (value && !/^-?\d+(\.\d+)?$/.test(value)) {
    ElMessage.warning('请输入正确的坐标格式（数字）')
    // 清空无效值
    if (field === 'blockStartLng') formData.blockStartLng = ''
    else if (field === 'blockStartLat') formData.blockStartLat = ''
    else if (field === 'blockEndLng') formData.blockEndLng = ''
    else if (field === 'blockEndLat') formData.blockEndLat = ''
  }
}

function handleExport() {
  ElMessage.info('导出功能开发中...')
}

function handleCopyName(name: string) {
  navigator.clipboard.writeText(name).then(() => {
    ElMessage.success('已复制事故名称')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

function handleView(row: EventReport) {
  ElMessage.info('详情功能开发中...')
}

function handleTrack(row: EventReport) {
  trackRow.value = row
  // 重置跟踪表单
  trackFormData.description = ''
  trackFormData.dataSource = ''
  trackFormData.occurTime = ''
  trackFormData.photos = []
  trackFormData.videos = []
  trackDrawerVisible.value = true
}

function handleTrackSubmit() {
  if (!trackFormRef.value) return
  trackFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('跟踪信息提交成功')
      trackDrawerVisible.value = false
    }
  })
}

function handleFollowUp(row: EventReport) {
  reportRow.value = row
  reportType.value = 'followUp'
  resetReportForm()
  // 从mock数据获取报告预览
  reportPreviewData.value = mockReportPreviewData[row.id] || [
    { type: '首报', content: generateReportContent('first', row) }
  ]
  reportDrawerVisible.value = true
}

function handleFinalReport(row: EventReport) {
  reportRow.value = row
  reportType.value = 'final'
  resetReportForm()
  // 从mock数据获取报告预览
  reportPreviewData.value = mockReportPreviewData[row.id] || [
    { type: '首报', content: generateReportContent('first', row) },
    { type: '续报', content: generateReportContent('followUp', row) }
  ]
  reportDrawerVisible.value = true
}

function resetReportForm() {
  reportFormData.accidentName = reportRow.value?.accidentName || ''
  reportFormData.reportTime = ''
  reportFormData.reportStatus = reportType.value === 'final' ? '终报' : '续报'
  reportFormData.reportSource = ''
  reportFormData.location = reportRow.value?.location || ''
  reportFormData.stakeNo = ''
  reportFormData.vehicleTypes = []
  reportFormData.licensePlate = ''
  reportFormData.isSpecialVehicle = false
  reportFormData.specialVehicleDesc = ''
  reportFormData.vehicleDetails = []
  reportFormData.accidentDesc = ''
  reportFormData.sceneCondition = []
  reportFormData.isBlocked = '未造成'
  reportFormData.trafficCondition = ''
  reportFormData.trafficDesc = ''
  reportFormData.injuredCount = 0
  reportFormData.injuredDesc = ''
  reportFormData.deadCount = 0
  reportFormData.deadDesc = ''
  reportFormData.rescueInfo = ''
  reportFormData.rescueTime = ''
  reportFormData.rescueProcess = ''
  reportFormData.accidentCause = ''
  reportFormData.accidentLevel = ''
  reportFormData.blockCause = ''
  reportFormData.blockStartLng = ''
  reportFormData.blockStartLat = ''
  reportFormData.blockEndLng = ''
  reportFormData.blockEndLat = ''
  reportFormData.contactPerson = ''
  reportFormData.contactPhone = ''
  reportFormData.impactRange = ''
  reportFormData.isOccupyLane = ''
  reportFormData.photos = []
  reportFormData.videos = []
  reportFormData.attachments = []
  reportFormData.remark = ''
}

function handleClearReference() {
  ElMessage.success('已清空引用内容')
}

function handleUseLastReport() {
  ElMessage.success('已引用上一次报告')
}

function handleReportSubmit() {
  if (!reportFormRef.value) return
  reportFormRef.value.validate((valid) => {
    if (valid) {
      const typeName = reportType.value === 'followUp' ? '续报' : '终报'
      ElMessage.success(`${typeName}提交成功`)
      reportDrawerVisible.value = false
    }
  })
}

function addReportVehicleDetail() {
  reportFormData.vehicleDetails.push({ type: '', plateNo: '', isSpecial: false, specialDesc: '' })
}

function removeReportVehicleDetail(index: number) {
  reportFormData.vehicleDetails.splice(index, 1)
}

function validateReportCoord(field: string, event: Event) {
  const value = (event.target as HTMLInputElement).value
  if (value && !/^-?\d+(\.\d+)?$/.test(value)) {
    ElMessage.warning('请输入正确的坐标格式（数字）')
    if (field === 'blockStartLng') reportFormData.blockStartLng = ''
    else if (field === 'blockStartLat') reportFormData.blockStartLat = ''
    else if (field === 'blockEndLng') reportFormData.blockEndLng = ''
    else if (field === 'blockEndLat') reportFormData.blockEndLat = ''
  }
}

function addVehicleDetail() {
  formData.vehicleDetails.push({ type: '', plateNo: '', isSpecial: false, specialDesc: '' })
}

function removeVehicleDetail(index: number) {
  formData.vehicleDetails.splice(index, 1)
}

function removeFirstVehicle() {
  formData.vehicleDetails = []
}

function handleOpenMap() {
  ElMessage.info('地图选点功能开发中...')
}

function handleAiParse() {
  ElMessage.info('AI解析功能开发中...')
}

function handleSubmit() {
  if (!formRef.value) return
  formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('事故上报成功')
      drawerVisible.value = false
    }
  })
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handlePageChange(page: number) {
  pagination.page = page
}
</script>

<style lang="scss" scoped>
.event-report-page {
  padding: 0;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;

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
  }

  // ── 统计卡片 ──
  // ── 搜索栏 ──
  .search-bar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #ebeef5;
  }

  .search-form {
    flex: 1;
    .el-form-item { margin-bottom: 0; margin-right: 12px; }
  }

  .search-actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  // ── 表格 ──
  .data-table {
    flex: 1;

    .index-text { color: #909399; font-size: 13px; }

    .name-text {
      font-weight: 500;
      color: #303133;

      &.copyable {
        cursor: pointer;
        &:hover {
          color: #409eff;
          text-decoration: underline;
        }
      }
    }

    .time-text { font-size: 13px; color: #909399; }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }
}

// ── 抽屉样式 ──
:deep(.report-drawer) {
  .el-drawer__header {
    margin-bottom: 0;
    padding: 20px 24px;
    border-bottom: 1px solid #EBEEF5;
    .el-drawer__title { font-weight: 600; font-size: 16px; }
  }

  .el-drawer__body {
    padding: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}

.report-form {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;

  .form-section {
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px dashed #ebeef5;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f0f0f0;

      .el-icon {
        color: #409eff;
      }
    }
  }

  .location-input,
  .condition-input,
  .count-input {
    display: flex;
    width: 100%;
  }

  .location-icon {
    cursor: pointer;
    color: #409eff;
    &:hover {
      color: #337ecc;
    }
  }

  .vehicle-section {
    width: 100%;

    .vehicle-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      gap: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      .vehicle-type-select {
        width: 160px;
        flex-shrink: 0;
      }

      .plate-input {
        width: 140px;
        flex-shrink: 0;
      }

      .special-btn {
        flex-shrink: 0;
      }

      .desc-input {
        width: 150px;
        flex-shrink: 0;
      }
    }
  }
}

.drawer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #EBEEF5;
  background: #fff;

  .footer-left {
    display: flex;
  }

  .footer-right {
    display: flex;
  }
}

// 续报/终报弹窗内容
.report-drawer-content {
  display: flex;
  height: 100%;

  .report-form-section {
    width: 60%;
    overflow-y: auto;
    padding-right: 20px;
    border-right: 1px solid #EBEEF5;
  }

  .report-preview-section {
    width: 40%;
    padding: 0 20px;
    overflow-y: auto;

    .preview-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f0f0f0;
    }

    .preview-cards {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .preview-card {
      background: #f8f9fb;
      border-radius: 8px;
      padding: 16px;

      .card-header {
        font-size: 14px;
        font-weight: 600;
        color: #409eff;
        margin-bottom: 12px;
      }

      .card-content {
        font-size: 13px;
        color: #606266;
        line-height: 1.5;
        white-space: pre-wrap;
      }
    }
  }
}
</style>
