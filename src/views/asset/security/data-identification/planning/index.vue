<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-26 10:44:16
 * @LastEditTime: 2023-08-07 14:04:14
 * @Description:
-->

<template>
  <section class="security-wrapper">
    <div class="dp-page-layout">
      <div class="dp-page-header-filters">
        <div class="head">
          <div class="flex">
            <div class="page-title mr-20">识别规则</div>
          </div>
          <div>
            <el-button type="primary" icon="el-icon-plus" @click="addRule">新建识别规则</el-button>
            <el-button @click="handleRuleScan">手动规则扫描</el-button>
            <el-button @click="dispatchTask">调度任务配置</el-button>
            <el-button @click="getTableList()"><i class="el-icon-refresh-right"></i></el-button>
          </div>
        </div>

        <div class="introduce-wrapper">
          <div class="title">
            <span>规则介绍</span>
            <i class="iconfont icon-shousuoshangjiantou"></i>
          </div>
          <el-divider></el-divider>
          <div class="introduce">
            <div class="list-wrapper" v-for="(item, index) in list" :key="index">
              <div style="width: 100%">
                <div class="type"><i class="iconfont icon-font icon-shousuo"></i>{{item.type}}</div>
                <div class="content">{{item.content}}</div>
              </div>
              <el-divider direction="vertical" v-if="index < list.length - 1"></el-divider>
            </div>
          </div>
        </div>

        <FilterFieldCard class="mb-10" ref="filterFieldCard" placeholder="请输入规则名称" @confirm="getTableList" :filterData="filterData" :keywords="searchText"></FilterFieldCard>
      </div>
      <div class="dp-table-layout">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" height="100%" style="width: 100%" :class="{'fixed': fixed, 'tabel-cell-noe': false}" v-loading="!!loading" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="identifyRuleName" label="规则名称" min-width="230">
            <template slot-scope="{row}">
              <div class="table-name">
                <span class="icon iconfont icon-guizepeizhi"></span>
                <div class="ml-10">
                  <div>
                    <OverflowTooltip class="width">{{row.identifyRuleName}}</OverflowTooltip>
                  </div>
                  <div class="object-info-secondary">{{row.identifyRuleId}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="classifyShortName" label="数据分类" min-width="120">
            <template slot-scope="{row}">
              <span class="data-classify">{{row.classifyShortName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="levelShortName" label="数据分级" min-width="120">
            <template slot-scope="{row}">
              <span class="data-classify"><i class="iconfont icon-APIshouquan"></i> {{row.levelShortName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fieldCount" label="生效字段数" align="center" min-width="100">
          </el-table-column>
          <el-table-column prop="priority" label="优先级" min-width="110">
            <template slot-scope="{row}">
              <span class="priority-tag"> <i class="iconfont icon-APIshouquan"></i> {{ row.priority }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="owner" label="负责人" min-width="140" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="bindAlready" label="脱敏规则" width="100">
            <template slot-scope="{row}">
              <span>{{row.bindAlready === '1' ? '已配置' : '未配置'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updatedDate" label="更新时间" min-width="150">
          </el-table-column>
          <el-table-column prop="status" label="生效状态" min-width="110">
            <template slot-scope="{row}">
              <el-switch v-model="row.status" active-value="1" inactive-value="0" @change=changeStatus(row)>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{row}">
              <el-tooltip class="item" effect="dark" content="查看" placement="top">
                <el-button type="text" @click="handleCheckRule(row)"><i class="el-icon-set-up font-16 color-btn"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <el-button type="text" @click="handleEditRule(row)"><i class="el-icon-edit-outline font-16 color-btn"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="复制" placement="top">
                <el-button type="text" @click="handleCopyRule(row)"><i class="iconfont icon-fuzhi font-16 color-btn"></i></el-button>
              </el-tooltip>
              <el-button type="text" icon="iconfont icon-gengduo font-14 color-btn" v-popover:morepopover>
                <el-popover popper-class="more-popover" placement="bottom" trigger="hover" ref="morepopover">
                  <ul class="popper-list">
                    <li @click="changeOwner(row)">
                      <i class="iconfont icon-zhuanjiao font-14 color-btn mr-10"></i>
                      <span>转交</span>
                    </li>
                    <li @click="handleDelRule(row)">
                      <i class="el-icon-delete font-14 color-btn mr-10"></i>
                      <span>删除</span>
                    </li>
                  </ul>
                </el-popover>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <SelectFooter @checkAllChange="checkAllChange" :multipleSelection="multipleSelection" :tableData="tableData" :totalNum="total" @sendTableList="sendTableList"></SelectFooter>

    <!-- 识别规则 -->
    <el-dialog :title="`${type1}识别规则`" :visible.sync="identifyRuleVisible" width="40%" class="identifyRule-dialog" :close-on-click-modal="false">
      <el-form :model="ruleForm" ref="ruleFormRef" label-width="100px" :rules="identifyRules">
        <el-form-item label="规则名称" prop="identifyRuleName">
          <el-input v-model="ruleForm.identifyRuleName" :disabled="checkRule"></el-input>
        </el-form-item>
        <el-form-item label="识别规则说明" prop="remark">
          <el-input type="textarea" v-model="ruleForm.remark" :disabled="checkRule" show-word-limit :maxlength="200" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="扫描范围" class="filter-scope" :rules="{required: true}">
          <div class="filter-item">
            <el-row class="scope-item">
              <el-col :span="3" class="left">
                <span>数据板块</span>
              </el-col>
              <el-col :span="21" class="right">
                <el-row class="mb-10">
                  <el-radio :disabled="checkRule" v-model="ruleForm.unitScopeType" label="ALL">全部</el-radio>
                </el-row>
                <el-row class="mb-10">
                  <el-col :span="4">
                    <el-radio :disabled="checkRule" v-model="ruleForm.unitScopeType" label="ENUM">枚举</el-radio>
                  </el-col>
                  <el-col :span="19" :offset="1">
                    <el-select v-model="ruleForm.unitIds" placeholder="请选择数据板块" multiple :disabled="ruleForm.unitScopeType !== 'ENUM'">
                      <el-option v-for="item in unitList" :key="item.value" :label="item.name" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <div class="filter-item">
            <el-row class="scope-item">
              <el-col :span="3" class="left">
                <span>项目</span>
              </el-col>
              <el-col :span="21" class="right">
                <el-row class="mb-10">
                  <el-radio :disabled="checkRule" v-model="ruleForm.projectScopeType" label="ALL">全部</el-radio>
                </el-row>
                <el-row class="mb-10">
                  <el-col :span="4">
                    <el-radio :disabled="checkRule" v-model="ruleForm.projectScopeType" label="ENUM">枚举</el-radio>
                  </el-col>
                  <el-col :span="19" :offset="1">
                    <el-select v-model="ruleForm.projectIds" placeholder="请选择项目" multiple :disabled="ruleForm.projectScopeType !== 'ENUM'">
                      <el-option v-for="item in projectList" :key="item.value" :label="item.name" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <div class="filter-item">
            <el-row class="scope-item">
              <el-col :span="3" class="left">
                <span>数据表</span>
              </el-col>
              <el-col :span="21" class="right">
                <el-row class="mb-10">
                  <el-radio :disabled="checkRule" v-model="ruleForm.tableScopeType" label="ALL">全部</el-radio>
                </el-row>
                <el-row class="mb-10">
                  <el-col :span="4">
                    <el-radio :disabled="checkRule" v-model="ruleForm.tableScopeType" label="CUSTOM">自定义</el-radio>
                  </el-col>
                  <el-col :span="19" :offset="1">
                    <el-input v-model="ruleForm.tableCustomExp" placeholder="请输入自定义正则表达式" :disabled="ruleForm.tableScopeType !== 'CUSTOM'"></el-input>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <!-- <el-form-item label="扫描方式" class="scan-way" :rules="{required: true}">
          <el-row class="mb-10">
            <el-col :span="24">
              <el-checkbox :disabled="checkRule" v-model="ruleForm.enableByContent" true-label="1" false-label="0">按内容扫描<i class="el-icon-info"></i></el-checkbox>
            </el-col>
          </el-row>
          <el-row class="mb-10 contentScanType-left">
            <el-col :span="4">
              <el-radio :disabled="checkRule || ruleForm.enableByContent !== '1' " v-model="ruleForm.identifyType" label="SYSTEM">内置识别</el-radio>
            </el-col>
            <el-col :span="19" :offset="1">
              <el-select :disabled="checkRule || ruleForm.enableByContent !== '1' || ruleForm.identifyType !== 'SYSTEM'" v-model="ruleForm.identifyIds">
                <el-option v-for="item in buildInIdentifyList" :key="item.featureId" :label="item.featureName" :value="item.featureId">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row class="mb-10 contentScanType-left">
            <el-col :span="4">
              <el-radio :disabled="checkRule || ruleForm.enableByContent !== '1'" v-model="ruleForm.identifyType" label="CUSTOM">自定义</el-radio>
            </el-col>
            <el-col :span="19" :offset="1">
              <el-input :disabled="checkRule || ruleForm.identifyType !== 'CUSTOM'" v-model="ruleForm.customRule" placeholder="请输入自定义正则表达式"></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-checkbox :disabled="checkRule" v-model="ruleForm.enableByField" true-label="1" false-label="0">按字段名称扫描<i class="el-icon-info"></i></el-checkbox>
            </el-col>
            <el-col :span="17" :offset="1">
              <el-input :disabled="checkRule || ruleForm.enableByField !== '1' " v-model="ruleForm.customFieldExpression" placeholder="请输入"></el-input>
            </el-col>
          </el-row>
        </el-form-item> -->
        <el-form-item label="识别阀值" prop="threshold">
          <el-input :disabled="checkRule" v-model="ruleForm.threshold" placeholder="请输入">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="识别特征" prop="featureId">
          <el-select :disabled="checkRule" v-model="ruleForm.featureId">
            <el-option v-for="item in buildInIdentifyList" :key="item.featureId" :label="item.featureName" :value="item.featureId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据分类" prop="classifyId">
          <el-select :disabled="checkRule" v-model="ruleForm.classifyId">
            <el-option v-for="item in dataClassifyList" :key="item.id" :label="item.label" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据分级" prop="levelId">
          <el-select :disabled="checkRule" v-model="ruleForm.levelId">
            <el-option v-for="item in dataLevelList" :key="item.id" :label="item.label" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="priority">
          <span slot="label">优先级<i class="el-icon-info"></i></span>
          <el-select :disabled="checkRule" v-model="ruleForm.priority">
            <el-option v-for="item in priorityList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="type1 !=='查看'">
        <el-button @click="identifyRuleVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleRuleSure">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 手动扫描规则 -->
    <el-dialog title="手动扫描规则" :visible.sync="scanVisible" width="30%" :close-on-click-modal="false">
      <el-form :model="scanform" ref="scanformRef" label-width="120px" :rules="scanRules">
        <el-form-item label="扫描方式" prop="manuFullScan">
          <el-radio-group v-model="scanform.manuFullScan">
            <el-radio :label="1">全库扫描</el-radio>
            <el-radio :label="0">项目扫描</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="scanform.manuFullScan === 0" label="请选择扫描项目" prop="projectId">
          <el-select v-model="scanform.projectId" multiple>
            <el-option v-for="item in projectList" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="scanVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleScanSure">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 调度任务配置 -->
    <el-dialog title="识别任务调度配置" :visible.sync="dispatchTaskVisible" width="550px" class="more-dialog" :close-on-click-modal="false">
      <el-form :model="taskForm" ref="taskFormRef" label-width="140px" label="right" :rules="taskRules">
        <el-form-item prop="scheduleIntervalType" class="task-cycle">
          <span slot="label">调度任务周期<i class="el-icon-info"></i></span>
          <el-row :gutter="0">
            <el-col :span="8">
              <el-select v-model="taskForm.scheduleIntervalType">
                <el-option v-for="item in cycleTypeList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8" :offset="1" v-if="taskForm.scheduleIntervalType === 'DAILY'">
              <el-time-picker v-model="taskForm.scheduleDayTime" value-format="HH:mm" format="HH:mm"></el-time-picker>
            </el-col>
            <el-col :span="24" v-if="taskForm.scheduleIntervalType !== 'DAILY'" class="mb-10 mt-10">
              <template v-if="taskForm.scheduleIntervalType === 'WEEK'">
                <el-select v-model="taskForm.scheduleWeekDays" multiple>
                  <el-option v-for="item in weekList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </template>
              <template v-if="taskForm.scheduleIntervalType === 'MONTH'">
                <el-select v-model="taskForm.scheduleMonthDays" multiple>
                  <el-option v-for="(item,index) in 31" :key="index" :label="`${index+1}日`" :value="index + 1">
                  </el-option>
                </el-select>
              </template>
            </el-col>
            <el-col :span="24" v-if="taskForm.scheduleIntervalType !== 'DAILY'">
              <el-time-picker v-model="taskForm.scheduleDayTime" value-format="HH:mm" format="HH:mm"></el-time-picker>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="cron表达式" prop="scheduleCronExpression">
          <!-- crontab 格式：秒  分  小时  天   月  周，6位长度，中间用空格间隔 -->
          <!-- 当任务周期选择日时，选择小时和分钟，分别更新到crontab表达式的第3位和第2位，比如选择12:34，则crontab表达式为0 34 12 * * ？ -->
          <!-- 当任务周期选择周时，选择星期、小时和分钟，分别更新到crontab表达式的第6位和第3位和第2位，比如选择周1和周2，时间选择12:34，则crontab表达式为0 34 12 * * 1,2 -->
          <!-- 当任务周期选择月时，选择天、小时和分钟，分别更新到crontab表达式的第4位、第3位和第2位，比如选择5号和6号，时间选择12:34，则crontab表达式为0 34 12 5,6 * ？ -->
          <span>{{scheduleCronExpression}}</span>
        </el-form-item>
        <el-form-item prop="scheduleConcurrency">
          <span slot="label">调度任务并行度<i class="el-icon-info"></i></span>
          <el-row>
            <el-col :span="6">
              <el-input v-model="taskForm.scheduleConcurrency"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <span slot="label">调度黑名单<i class="el-icon-info"></i></span>
          <el-switch v-model="taskForm.enableScheduleBlackTime" active-value="1" inactive-value="0">
          </el-switch>
          <div v-if="taskForm.enableScheduleBlackTime === '1'" class="mt-10">
            <el-time-select placeholder="起始时间" v-model="taskForm.scheduleBlackTimeStart" value-format="HH:mm" :picker-options="{
      start: '00:00',
      step: '00:01',
      end: '24:00'
    }" style="width: 150px"></el-time-select>
            <el-time-select placeholder="结束时间" v-model="taskForm.scheduleBlackTimeEnd" value-format="HH:mm" :picker-options="{
      start: '00:00',
      step: '00:01',
      end: '24:00',
      minTime: startTime
    }" style="width: 150px" class="ml-10"></el-time-select>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dispatchTaskVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleTaskSure">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 转交识别规则 -->
    <el-dialog title="转交识别规则" :visible.sync="ownerEditVisible" width="40%" :close-on-click-modal="false">
      <el-form :model="ownerForm" ref="ownerFormRef" label-width="100px" :rules="ownerRules">
        <el-form-item label="转交对象" prop="owner">
          <el-select v-model="ownerForm.owner" placeholder="请选择转交对象">
            <el-option v-for="item in ownerList2" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="mt-10 mb-10">转交规则(1)</div>
      <el-table :data="tableData2" style="width: 100%">
        <el-table-column prop="identifyRuleName" label="规则名称">
          <template slot-scope="{row}">
            <div>{{row.identifyRuleName}}</div>
            <div>{{row.identifyRuleId}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="classifyShortName" label="数据分类">
          <template slot-scope="{row}">
            <span class="data-classify">{{row.classifyShortName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="levelShortName" label="数据分级">
          <template slot-scope="{row}">
            <span class="data-classify">{{row.levelShortName}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ownerEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOwnerSure">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import SelectFooter from '@c/footer-simple'
import pager from '@/mixins/pager'
import {
  getDataClassify,
  getDataLevel,
  securityRoleUsers,
  getBusinList,
  getProjectList,
  getIdentifyData,
  getPagedIdentifyRule,
  getScheduleSettings,
  saveScheduleSettings,
  saveIdentifyRule,
  getIdentifyRule, // 查看详情/编辑查看/复制查看
  updateRuleStatus,
  updateIdentifyRuleOwner,
  deleteIdentifyRule,
  triggerTenantIdentifyTask
} from '@/api/asset/security.js'
export default {
  name: 'Planning',
  components: {
    SelectFooter
  },
  mixins: [pager],
  data () {
    return {
      checkRule: false,
      startTime: '',
      endTime: '',
      fixed: false,
      loading: 0,
      list: [
        {
          type: '规则识别',
          content: '对数据资产进行识别,规则覆盖字段默认生效分类分级,可单条字段设定是否生效或自定义分类和分级'
        },
        {
          type: '优先级',
          content: '多个规则发生冲突时，优先级较高着生效，优先级1为最高级，同级规则，更新时段较新着生效'
        },
        {
          type: '生效日期',
          content: '新建或变更规则，数据表或脚本任务发生变更时，当日触发扫描，次日生效；每月一次扫描重识别'
        },
        {
          type: '数据抽样',
          content: '内容扫描时，对近3个时间分区的数据进行抽样(上限100条)识别，满足度超过80%即视为匹配'
        }
      ],
      filterData: [],
      tableData: [],
      tableData2: [],
      multipleSelection: [],
      scanform: {
        manuFullScan: 1,
        projectId: ''
      },
      taskForm: {},
      ownerForm: {},
      ruleForm: {
        threshold: '80'
      },
      type1: '新建',
      ownerEditVisible: false,
      identifyRuleVisible: false,
      scanVisible: false,
      dispatchTaskVisible: false,
      identifyRules: {
        identifyRuleName: [
          { required: true, message: '请输入规则名称', trigger: 'blur' }
        ],
        classifyId: [
          { required: true, message: '请选择数据分类', trigger: 'change' }
        ],
        levelId: [
          { required: true, message: '请选择数据分级', trigger: 'change' }
        ],
        priority: [
          { required: true, message: '请选择优先级', trigger: 'change' }
        ],
        threshold: [{ required: true, message: '请输入', trigger: 'blur' }],
        featureId: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      scanRules: {
        manuFullScan: [
          { required: true, message: '请选择扫描方式', trigger: 'blur' }
        ]
      },
      taskRules: {
        scheduleIntervalType: [
          { required: true, message: '请选择调度任务周期', trigger: 'blur' }
        ],
        scheduleConcurrency: [
          { required: true, message: '请输入调度任务并行度', trigger: 'blur' }
        ]
      },
      ownerRules: {
        owner: [
          { required: true, message: '请选择转交对象', trigger: 'change' }
        ]
      },
      cycleTypeList: [
        {
          label: '日',
          value: 'DAILY'
        },
        {
          label: '周',
          value: 'WEEK'
        },
        {
          label: '月',
          value: 'MONTH'
        }
      ],
      weekList: [
        {
          label: '周日',
          value: '1'
        },
        {
          label: '周一',
          value: '2'
        },
        {
          label: '周二',
          value: '3'
        },
        {
          label: '周三',
          value: '4'
        },
        {
          label: '周四',
          value: '5'
        },
        {
          label: '周五',
          value: '6'
        },
        {
          label: '周六',
          value: '7'
        }
      ],
      priorityList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      unitList: [],
      projectList: [],
      buildInIdentifyList: [],
      categoryList: [],
      dataLevelList: [],
      dataClassifyList: [],
      ownerList: [],
      ownerList2: [],
      searchText: ''
    }
  },
  created () {
    this.configData()
  },
  mounted () {
    const { identifyRuleName } = this.$route.query
    if (identifyRuleName) {
      this.searchText = identifyRuleName
    }
    this.getBizunitList()
    this.getIdentifyList()
    this.getProjectData('')
  },
  watch: {
    'ruleForm.unitIds' (val) {
      if (val) {
        const unitId = `${val}`
        this.getProjectData(unitId)
      }
    }
  },
  computed: {
    scheduleCronExpression () {
      const day = this.taskForm.scheduleDayTime ? this.convertTime(this.taskForm.scheduleDayTime) : '0 0'
      const week = this.taskForm.scheduleWeekDays && this.taskForm.scheduleWeekDays.length ? `${this.taskForm.scheduleWeekDays}` : '?'
      const month = this.taskForm.scheduleMonthDays && this.taskForm.scheduleMonthDays.length ? `${this.taskForm.scheduleMonthDays}` : '* *'
      if (this.taskForm.scheduleIntervalType === 'DAILY') {
        return `0 ${day} * * ?`
      } else if (this.taskForm.scheduleIntervalType === 'WEEK') {
        return `0 ${day} ? * ${week}`
      } else {
        return `0 ${day} ${month} * ?`
      }
    }
  },
  methods: {
    convertTime (timeStr) {
      const timeArr = timeStr.split(':')
      const hour = timeArr[0]// 将小时部分转换成数字类型
      const minute = timeArr[1] // 将分钟部分转换成数字类型
      const arr = [minute, hour]
      // arr.reverse() // 将数组中的元素顺序反转
      const result = arr.join(' ')
      return result
    },

    sendTableList (val) {
      this.pageFilters = val
      this.getTableList()
    },

    async configData () {
      await this.getDataClassifyList()
      await this.getDataLevelList()
      await this.getSecurityRoleUsers()

      this.filterData = [
        {
          label: '数据分类',
          id: '数据分类',
          options: this.dataClassifyList
        },
        {
          label: '数据分级',
          id: '数据分级',
          options: this.dataLevelList
        },
        {
          label: '负责人',
          id: '负责人',
          options: this.ownerList
        }
      ]
      await this.getTableList([], this.searchText)
    },

    async getScheduleData () {
      const res = await getScheduleSettings()
      if (res) {
        const { scheduleMonthDays, scheduleWeekDays } = res.data
        this.taskForm = {
          ...res.data,
          scheduleMonthDays: scheduleMonthDays && scheduleMonthDays !== 'null' ? scheduleMonthDays.split(',') : [],
          scheduleWeekDays: scheduleWeekDays && scheduleWeekDays !== 'null' ? scheduleWeekDays.split(',') : []
        }
        this.dispatchTaskVisible = true
        this.$nextTick(() => {
          this.$refs['taskFormRef'].clearValidate()
        })
      }
    },

    async changeStatus (row) {
      const params = {
        identifyRuleId: row.identifyRuleId,
        status: row.status
      }
      const res = await updateRuleStatus(params)
      if (res) {
        this.$message({
          type: 'success',
          message: '状态修改成功!'
        })
      }
    },

    handleDelRule (row) {
      this.$confirm(`确定删除识别规则, ${row.identifyRuleName} 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitDel(row.identifyRuleId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    async submitDel (identifyRuleId) {
      const res = await deleteIdentifyRule({ identifyRuleIds: identifyRuleId, loginUser: '' })
      if (res && res.code == 0) {
        if (res.data) {
          const { WARN, SUCCESS } = res.data
          if (WARN && WARN.length) {
            this.$message({
              type: 'warning',
              message: `识别规则已经被绑定!`
            })
          }
          if (SUCCESS && SUCCESS.length) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        } else {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
        this.getTableList()
      }
    },

    changeOwner (row) {
      const { identifyRuleName, identifyRuleId, classifyShortName, levelShortName } = row
      this.tableData2 = [
        { identifyRuleName, identifyRuleId, classifyShortName, levelShortName }
      ]
      this.ownerForm = {
        identifyRuleId
      }
      this.ownerEditVisible = true
      this.$nextTick(() => {
        this.$refs['ownerFormRef'].clearValidate()
      })
    },

    handleOwnerSure () {
      this.$refs.ownerFormRef.validate(valid => {
        if (valid) {
          this.updateOwner()
        }
      })
    },

    async updateOwner () {
      const res = await updateIdentifyRuleOwner(this.ownerForm)
      if (res) {
        this.$message({
          type: 'success',
          message: '转交成功!'
        })
        this.ownerEditVisible = false
        this.getTableList()
      }
    },

    handleCheckRule (row) {
      this.type1 = '查看'
      this.checkRule = true
      this.editRule(row)
    },

    handleCopyRule (row) {
      this.type1 = '复制'
      this.checkRule = false
      this.editRule(row)
    },

    handleEditRule (row) {
      this.checkRule = false
      this.type1 = '编辑'
      this.editRule(row)
    },

    async editRule (row) {
      const res = await getIdentifyRule({ identifyRuleId: row.identifyRuleId })
      if (res) {
        this.ruleForm = res.data
        if (this.type1 === '复制') {
          this.ruleForm.identifyRuleName = `${this.ruleForm.identifyRuleName}_副本`
          delete this.ruleForm.identifyRuleId // 复制提交不需要identifyRuleId
        }
      }
      this.identifyRuleVisible = true
      this.$nextTick(() => {
        this.$refs['ruleFormRef'].clearValidate()
      })
    },

    addRule () {
      this.checkRule = false
      this.type1 = '新建'
      this.identifyRuleVisible = true
      this.ruleForm = this.resetRuleForm()
      this.$nextTick(() => {
        this.$refs['ruleFormRef'].clearValidate()
      })
    },

    async handleRuleSure () {
      this.$refs.ruleFormRef.validate(valid => {
        if (valid) {
          this.submitRule()
        }
      })
    },

    async submitRule () {
      const params = JSON.parse(JSON.stringify(this.ruleForm))
      params.projectIds = `${params.projectIds}`
      params.unitIds = `${params.unitIds}`
      const res = await saveIdentifyRule(params)
      if (res) {
        let msg = this.ruleForm.identifyRuleId ? '修改成功' : '新建成功'
        if (this.type1 === '复制') {
          msg = '复制成功'
        }
        this.$message({
          type: 'success',
          message: msg
        })
        this.identifyRuleVisible = false
        this.getTableList()
      }
    },

    handleRuleScan () {
      this.scanVisible = true
      this.$refs.scanformRef.clearValidate()
    },

    handleScanSure () {
      this.$refs.scanformRef.validate(valid => {
        if (valid) {
          this.submitScan()
        }
      })
    },

    async submitScan () {
      const { manuFullScan, projectId } = this.scanform
      const params = {
        manuFullScan,
        projectId: `${projectId}`
      }

      const res = await triggerTenantIdentifyTask(params)
      if (res) {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.scanVisible = false
      }
    },

    // 调度任务
    dispatchTask () {
      this.getScheduleData()
    },

    handleTaskSure () {
      this.$refs.taskFormRef.validate(valid => {
        if (valid) {
          this.updateTaskSure()
        }
      })
    },

    async updateTaskSure () {
      const data = JSON.parse(JSON.stringify(this.taskForm))
      const { scheduleMonthDays, scheduleWeekDays } = data
      data.scheduleMonthDays = `${scheduleMonthDays}`
      data.scheduleWeekDays = `${scheduleWeekDays}`
      data.scheduleCronExpression = this.scheduleCronExpression

      const params = {
        ...data
      }
      const res = await saveScheduleSettings(params)
      if (res && res.code === 0) {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.dispatchTaskVisible = false
      } else {
        this.$message({
          type: 'warning',
          message: res.msg
        })
      }
    },

    async getTableList (curFilter = [], keyword = '') {
      let params = {
        identifyRuleName: keyword,
        classifyId: '',
        levelId: '',
        owner: '',
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo
      }
      curFilter.forEach(e => {
        switch (e.module) {
          case '数据分类':
            params.classifyId = e.value
            break
          case '数据分级':
            params.levelId = e.value
            break
          case '负责人':
            params.owner = e.value
            break
        }
      })
      this.loading++
      const res = await getPagedIdentifyRule(params)
      if (res) {
        this.tableData = res.data.totalList
        this.total = res.data.total
      }
      this.loading--
    },

    async getDataClassifyList () {
      const params = {
        pageNo: 1,
        pageSize: 100
      }
      const res = await getDataClassify(params)
      if (res) {
        this.dataClassifyList = res.data.totalList.map(item => {
          return {
            id: item.classifyId,
            label: `${item.classifyName}(${item.shortName})`
          }
        })
      }
    },

    async getDataLevelList () {
      const params = {
        pageNo: 1,
        pageSize: 100
      }
      const res = await getDataLevel(params)
      if (res) {
        this.dataLevelList = res.data.totalList.map(item => {
          return {
            id: item.levelId,
            label: `${item.levelName}(${item.shortName})`
          }
        })
      }
    },

    async getSecurityRoleUsers () {
      const res = await securityRoleUsers()
      if (res) {
        this.ownerList2 = res.data
        this.ownerList = res.data.map(item => {
          return {
            id: item.value,
            label: item.name
          }
        })
      }
    },

    async getBizunitList () {
      const res = await getBusinList()
      if (res) {
        this.unitList = res.data
      }
    },

    async getProjectData (unitId) {
      const res = await getProjectList({ unitId })
      if (res) {
        this.projectList = res.data
      }
    },

    async getIdentifyList () {
      const params = {
        pageNo: 1,
        pageSize: 100
      }
      const res = await getIdentifyData(params)
      if (res) {
        this.buildInIdentifyList = res.data.totalList
      }
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    checkAllChange (boolean) {
      if (boolean) {
        this.tableData.forEach(item => {
          this.$refs.multipleTable.toggleAllSelection(item)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },

    // 清除
    handleEdit (item) { },

    // 恢复
    batchRecover (item) { },

    // 批量删除
    batchDel () {
      console.log(999, this.multipleSelection)
      const ids = this.multipleSelection.map(ele => ele.identifyRuleId)
      this.submitDel(ids.join(','))
    },

    resetRuleForm () {
      return {
        threshold: 80,
        featureId: '',
        unitScopeType: 'ALL',
        projectScopeType: 'ALL',
        tableScopeType: 'ALL',
        enableByContent: '1',
        identifyType: 'SYSTEM',
        projectIds: '',
        unitIds: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.priority-tag {
  display: block;
  width: fit-content;
  text-align: center;
  border: 1px solid rgb(255, 199, 10);
  border-radius: 10px;
  color: rgb(255, 199, 10);
  background-color: rgba(255, 199, 10, 0.1);
  padding: 0 20px;
}
.security-wrapper {
  height: 100%;
  position: relative;
  :deep(.el-date-editor) {
    .el-input__inner,
    .el-input {
      width: 150px !important;
    }
  }
  :deep(.el-date-editor) {
    .el-input__inner,
    .el-input {
      width: 180px;
    }
  }
  .table-name {
    display: flex;
    align-items: center;
  }
  .icon {
    font-size: 24px;
    color: #4783ff;
  }
  .data-classify {
    display: block;
    width: fit-content;
    text-align: center;
    border: 1px solid #c6dcff;
    background-color: #d1e3fd;
    border-radius: 10px;
    padding: 0 20px;
  }
  .data-level {
    display: block;
    width: fit-content;
    text-align: center;
    border: 1px solid #ffe282;
    background-color: #fff9e6;
    border-radius: 10px;
    padding: 0 20px;
  }
  .identifyRule-dialog {
    ::v-deep .el-dialog {
      height: 600px;
      .el-dialog__body {
        height: calc(100% - 124px);
        overflow-y: auto;
      }
      .filter-scope {
        display: flex;
        flex-direction: column;
        ::v-deep .el-form-item__content {
          margin-left: 20px !important;
        }
        .filter-item {
          width: 100%;
          display: flex;
          .scope-item {
            width: 100%;
            .left {
              .num {
                display: inline-block;
                width: 16px;
                height: 16px;
                line-height: 16px;
                text-align: center;
                background-color: #5789f7;
                color: #fff;
                margin-right: 10px;
              }
            }
          }
        }
      }
      .contentScanType-left {
        margin-left: 4%;
      }
    }
  }
  .more-dialog {
    .task-cycle {
      .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 100% !important;
      }
    }
  }
}
.el-icon-info {
  margin-left: 5px;
}
</style>
