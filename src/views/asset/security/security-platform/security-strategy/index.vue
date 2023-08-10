<template>
  <section class="security-wrapper">
    <div class="dp-page-layout">
      <div class="dp-page-header-filters">
        <div class="head">
          <div class="flex">
            <div class="page-title mr-20">项目安全策略</div>
          </div>
          <div>
            <div class="flex">
              <el-input v-model="form.projectName" prefix-icon="el-icon-search" clearable placeholder="请输入项目名称" class="ml-10 mr-10"></el-input>
              <el-button icon="iconfont icon-filter" @click="handleFilter">筛选</el-button>
              <el-button icon="el-icon-question" @click="handleExplain">{{showExplain ? '收起':'说明' }}</el-button>
              <el-button icon="el-icon-refresh-right" @click="getTableList()"></el-button>
            </div>
          </div>
        </div>

        <div v-show="showExplain">
          <div class="introduce-wrapper">
            <div class="title">
              <span>安全策略概念说明</span>
              <i class="iconfont icon-shousuoshangjiantou" @click="showExplain = false"></i>
            </div>
            <el-divider></el-divider>
            <div class="introduce">
              <div class="list-wrapper" v-for="(item, index) in list" :key="index">
                <div style="width: 100%;">
                  <div class="type"><i class="iconfont icon-font icon-shousuo"></i>{{item.type}}</div>
                  <div class="content">{{item.content}}</div>
                </div>
                <el-divider direction="vertical" v-if="index < list.length - 1"></el-divider>
              </div>
            </div>
          </div>
        </div>

        <div v-show="showCondition" class="condition-wrapper mb-10">
          <el-form :model="form" inline class="form" label-width="110px">
            <el-form-item label="数据板块" class="form-item">
              <el-select v-model="form.unitId" multiple placeholder="全部">
                <el-option v-for="item in unitList" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="安全策略安装" class="form-item">
          <el-checkbox-group v-model="form.registerStatus">
            <el-checkbox v-for="(item, index) in strategyStatusList" :label="item.value" :key="index">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
            <el-form-item label="安全策略状态" class="form-item">
              <el-checkbox-group v-model="form.strategyActiveStatus">
                <el-checkbox v-for="(item, index) in statusList" :label="item.value" :key="index">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>

          <div v-if="form.unitId.length || form.registerStatus.length || form.strategyActiveStatus.length" class="select-wrapper">
            <el-tag v-if="form.unitId.length" size="mini" closable class="mr-5" @close="handleClose('1')">数据板块：{{form.unitId.join('、')}}</el-tag>
            <el-tag v-if="form.registerStatus.length" size="mini" closable class="mr-5" @close="handleClose('2')">安全策略安装：{{form.registerStatus.join('、')}}</el-tag>
            <el-tag v-if="form.strategyActiveStatus.length" size="mini" closable class="mr-5" @close="handleClose('3')">安全策略状态：{{form.strategyActiveStatus.join('、')}}</el-tag>
          </div>
        </div>
      </div>
      <div class="dp-table-layout">
        <el-table ref="multipleTable" :data="tableData" height="100%" style="width: 100%;" v-loading="!!loading" @selection-change="handleSelectionChange">
          <el-table-column prop="projectName" label="项目" min-width="200">
            <template slot-scope="{row}">
              <div class="flex">
                <span class="icon iconfont icon-zhiliangguize"></span>
                <div class="ml-10">
                  <div class="">{{row.projectCode}}</div>
                  <div class="">{{row.projectName}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="unitCode" label="数据板块" min-width="180">
            <template slot-scope="{row}">
              <div>{{row.unitCode}}</div>
              <div>{{row.unitName}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="allowDownloadName" label="数据结果下载" min-width="140"></el-table-column>
          <el-table-column prop="allowReadName" label="读权限申请" min-width="140"></el-table-column>
          <el-table-column prop="allowWriteName" label="写权限申请" min-width="140">
          </el-table-column>
          <!-- <el-table-column prop="registerStatusName" label="安全策略安装" width="160">
      </el-table-column> -->
          <el-table-column prop="strategyActiveStatusName" label="安全策略状态" min-width="140">
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="{row}">
              <el-tooltip class="item" effect="dark" content="查看" placement="top">
                <el-button type="text"><i class="iconfont icon-shujutancha font-16 color-btn" @click="handleCheck(row)"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <el-button type="text"><i class="el-icon-edit-outline font-16 color-btn" @click="handleEdit(row)"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <SelectFooter :tableData="tableData" :totalNum="total" @sendTableList="sendTableList"></SelectFooter>

    <!-- 查看 -->
    <el-dialog title="查看项目安全策略" :visible.sync="checkDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}" width="30%">
      <el-form :model="formData" label-width="140px" label-suffix="：">
        <el-form-item label="项目名称" prop="projectName">
          <span>{{formData.projectName}}</span>
        </el-form-item>
        <!-- <el-form-item label="安全策略安装" prop="registerStatusName">
          <span>{{formData.registerStatusName}}</span>
          <span>({{formData.successfulInstallationsCount}}/{{formData.installationsCount}})</span>
          <el-button class="ml-20" @click="checkLog(formData)">查看安装日志</el-button>
        </el-form-item> -->
        <el-form-item label="策略生效状态" prop="strategyActiveStatusName">
          <span>{{formData.strategyActiveStatusName}}</span>
        </el-form-item>
        <el-form-item label="数据结果下载" prop="allowDownloadName">
          <span>{{formData.allowDownloadName}}</span>
        </el-form-item>
        <el-form-item label="数据读权限申请" prop="allowReadName">
          <span>{{formData.allowReadName}}</span>
        </el-form-item>
        <el-form-item label="数据写权限申请" prop="allowWriteName">
          <span>{{formData.allowWriteName}}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="编辑项目安全策略" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}" width="35%">
      <el-form ref="form" :model="formData" :rules="rules" label-width="140px" label-suffix="：">
        <el-form-item label="项目名称" prop="projectName">
          <span>{{formData.projectName}}</span>
        </el-form-item>
        <!-- <el-form-item label="安全策略安装" prop="registerStatus">
          <span>{{formData.registerStatusName}}</span>
          <template v-if="formData.registerStatusName === '未安装'">
            <el-button class="ml-10" @click="update('INIT')">安装</el-button>
          </template>
          <template v-else>
            <span class="ml-10">({{formData.successfulInstallationsCount}}/{{formData.installationsCount}})</span>
            <el-button type="primary" class="ml-10" @click="update('UPDATE')">更新</el-button>
            <el-button class="ml-10" @click="update('RESET')">重装</el-button>
            <el-button class="ml-10" @click="checkLog(formData)">查看安装日志</el-button>
          </template>
        </el-form-item> -->
        <el-form-item label="策略生效状态" prop="strategyActiveStatus">
          <el-switch v-model="formData.strategyActiveStatus" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="数据结果下载" prop="allowDownload">
          <el-switch v-model="formData.allowDownload" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="数据读权限申请" prop="allowRead">
          <el-switch v-model="formData.allowRead" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="数据写权限申请" prop="allowWrite">
          <el-switch v-model="formData.allowWrite" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSumbit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 安装日志 -->
    <el-dialog title="安装日志基本信息" :visible.sync="showLog" :close-on-click-modal="false" :close-on-press-escape="false" v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}" width="30%">
      <el-form :model="formData" label-width="160px" label-suffix="：">
        <el-form-item label="任务状态">
          <span>{{formData.registerStatusName}}</span>
        </el-form-item>
        <el-form-item label="操作人">
          <span>{{formData.operateUserName}}</span>
        </el-form-item>
        <el-form-item label="开始时间">
          <span>{{formData.operateStartTime}}</span>
        </el-form-item>
        <el-form-item label="结束时间">
          <span>{{formData.operateEndTime}}</span>
        </el-form-item>
        <el-form-item label="安装函数成功数/总数">
          <span>{{formData.successfulInstallationsCount}}/{{formData.installationsCount}}</span>
        </el-form-item>
      </el-form>
      <div class="mt-10 mb-10">函数列表</div>
      <el-table :data="formData.registerResults" style="width: 100%" class="func-table">
        <el-table-column prop="maskAlgoName" label="函数" min-width="160">
        </el-table-column>
        <el-table-column prop="operateStatus" label="状态" width="100">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showLog = false">关 闭</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import {
  getBusinList,
  getStrategyStatus,
  getPagedProject,
  getByProjectId,
  securityPolicyInstall,
  saveStrategy
} from '@/api/asset/security.js'
import SelectFooter from '@c/footer-simple'
import pager from '@/mixins/pager'
export default {
  name: 'security-strategy',
  components: {
    SelectFooter
  },
  mixins: [pager],
  data () {
    return {
      showExplain: false,
      showCondition: false,
      showLog: false,
      form: {
        projectName: '',
        unitId: [],
        registerStatus: [],
        strategyActiveStatus: []
      },
      inputVal: '',
      loading: 0,
      tableData: [],
      multipleSelection: [],
      // 弹窗相关
      dialogVisible: false,
      checkDialogVisible: false,
      formData: {
        field1: 'blink_test',
        field2: 'blink_test_dev'
      },
      rules: {},
      unitList: [],
      strategyStatusList: [],
      statusList: [
        { name: '开启', value: 1 },
        { name: '关闭', value: 0 }
      ],
      list: [
        {
          type: '资产安全策略',
          content: '用于敏感数据识别和数据脱敏，可开启关闭、可更新。'
        },
        {
          type: '数据结果下载',
          content: '控制即席查询、SQL任务等的查询结构数据能否下载至本地客户端'
        },
        {
          type: '数据读写权限申请',
          content: '控制用户是否可申请该生产项目下表的查询/写入权限，已申请过的权限不受影响'
        }
      ]
    }
  },
  mounted () {
    this.getTableList()
    this.getUnitList()
    this.getStrategyStatusList()
  },
  watch: {
    form: {
      deep: true,
      handler (val) {
        this.getTableList()
      }
    }
  },
  methods: {
    async getUnitList () {
      const res = await getBusinList()
      if (res) {
        this.unitList = res.data
      }
    },

    async getStrategyStatusList () {
      const res = await getStrategyStatus()
      if (res) {
        this.strategyStatusList = res.data
      }
    },

    async getTableList () {
      const params = JSON.parse(JSON.stringify(this.form))
      const { unitId, registerStatus, strategyActiveStatus } = this.form
      params.unitId = `${unitId}`
      params.registerStatus = `${registerStatus}`
      params.strategyActiveStatus = `${strategyActiveStatus}`
      params.pageNo = this.pageFilters.pageNo
      params.pageSize = this.pageFilters.pageSize
      this.loading++
      const res = await getPagedProject(params)
      this.loading--
      if (res) {
        this.tableData = res.data.totalList
        this.total = res.data.total
      }
    },

    sendTableList (val) {
      this.pageFilters = val
      this.getTableList()
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    handleClose (tag) {
      switch (tag) {
        case '1':
          this.form.unitId = []
          break
        case '2':
          this.form.registerStatus = []
          break
        case '3':
          this.form.strategyActiveStatus = []
          break
      }
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

    // 编辑
    async handleEdit (row) {
      const res = await getByProjectId({ projectId: row.projectId, policyId: row.policyId })
      if (res) {
        this.formData = res.data
        this.dialogVisible = true
        this.getTableList()
      }
    },

    // 查看
    async handleCheck (row) {
      const res = await getByProjectId({ projectId: row.projectId, policyId: row.policyId })
      if (res) {
        this.formData = res.data
        this.checkDialogVisible = true
      }
    },

    async handleSumbit () {
      const { unitId, unitName, projectId, policyId, projectName, installLogId, strategyActiveStatus, allowDownload, allowRead, allowWrite } = this.formData

      const params = {
        unitId,
        // unitName,
        projectId,
        policyId,
        // projectName,
        // installLogId,
        strategyActiveStatus,
        allowDownload,
        allowRead,
        allowWrite
      }
      const res = await saveStrategy(params)
      if (res) {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.dialogVisible = false
        this.getTableList()
      }
    },

    checkLog (data) {
      this.showLog = true
    },

    async update (installType) {
      const { unitId, unitName, projectId, projectCode, projectName, installLogId } = this.formData

      const params = {
        unitId,
        unitName,
        projectId,
        projectCode,
        projectName,
        installLogId,
        installType
      }

      const res = await securityPolicyInstall(params)
      if (res) {
        if (installType !== 'INIT') {
          // registerStatus  registerStatusName
        }
        this.$message({
          type: 'success',
          message: '更新成功!'
        })
      }
    },

    // 恢复
    batchRecover (item) { },

    handleExplain () {
      this.showExplain = !this.showExplain
      this.showCondition = false
    },

    handleFilter () {
      this.showCondition = !this.showCondition
      this.showExplain = false
    }
  }
}
</script>

<style lang="scss" scoped>
.condition-wrapper {
  background-color: #fff;
  padding: 20px 30px;
  :deep(.el-form) {
    .el-form-item {
      width: 48.5%;
      border: 1px solid #dcdfe6;
      padding: 0 10px;
      height: 34px;
      line-height: 28px;
    }
    .el-form-item__content {
      width: calc(100% - 110px);
      border-left: 1px solid #dcdfe6;
      padding-left: 10px;
      .el-select {
        width: 100%;
        .el-input__inner {
          border: none;
        }
      }
    }
  }
}

.func-table {
  max-height: 200px;
  overflow: auto;
}

.security-wrapper {
  position: relative;
  height: 100%;
  .table-height {
    height: calc(100% - 80px);
    max-height: calc(100% - 80px);
    overflow: auto;
  }
  .table-height-new {
    height: calc(100% - 260px) !important;
    max-height: calc(100% - 260px) !important;
  }
  .check-box {
    line-height: 28px;
  }
  .icon {
    font-size: 24px;
    color: #4783ff;
  }
  .count {
    color: #4783ff;
  }
  .line {
    height: 1px;
    border-bottom: 1px solid #d9d9d9;
  }
}
</style>
