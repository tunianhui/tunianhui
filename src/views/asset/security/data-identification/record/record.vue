<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-04-23 10:51:04
 * @LastEditTime: 2023-08-08 15:14:33
 * @Description:
-->
<template>
  <section class="security-wrapper">
    <div class="dp-page-layout">
      <div class="dp-page-header-filters">
        <div v-show="showCondition" class="condition-wrapper mb-10">
          <div>
            <el-form :model="form" inline class="form" label-width="110px">
              <el-form-item label="生效规则" class="form-item">
                <el-select multiple clearable placeholder="请选择生效规则" v-model="form.identifyRuleId" @change="selectHandle">
                  <el-option v-for="item in identRuleList" :key="item.identifyRuleId" :value="item.identifyRuleId" :label="item.identifyRuleName"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="数据板块" class="form-item">
                <el-select multiple clearable placeholder="请选择数据板块" v-model="form.unitId" @change="selectHandle2">
                  <el-option v-for="item in businList" :key="item.value" :value="item.value" :label="item.name"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目" class="form-item">
                <el-select multiple clearable placeholder="请选择项目" v-model="form.projectId" @change="selectHandle5">
                  <el-option v-for="item in projectList" :key="item.value" :value="item.value" :label="item.name"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生效状态" class="form-item">
                <el-checkbox-group v-model="form.status" clearable :disabled="form.lockStatus && form.lockStatus.length > 0" @change="selectHandle3">
                  <el-checkbox v-for="(item, index) in statusList" :label="item.value" :key="index">{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="锁定状态">
                <el-checkbox-group v-model="form.lockStatus" clearable :disabled="form.status && form.status.length > 0" @change="selectHandle4">
                  <el-checkbox v-for="(item, index) in lockStatusList" :label="item.value" :key="index">{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </div>
          <div v-if="form.identifyRuleId.length !== 0 || form.unitId.length !== 0 || form.projectId.length !== 0 || form.status.length !== 0 || form.lockStatus.length !== 0">
            <el-divider></el-divider>
            <el-tag v-if="form.identifyRuleId.length !== 0" :key="1" size="mini" closable class="mr-5" @close="handleClose('1')">生效规则: {{screenRuleIdList.join('、')}}</el-tag>
            <el-tag v-if="form.unitId.length !== 0" :key="2" size="mini" closable class="mr-5" @close="handleClose('2')">数据板块: {{screenunitIdList.join('、')}}</el-tag>
            <el-tag v-if="form.projectId.length !== 0" :key="3" size="mini" closable class="mr-5" @close="handleClose('3')">项目: {{screenProIdList.join('、')}}</el-tag>
            <el-tag v-if="form.status.length !== 0" :key="4" size="mini" closable class="mr-5" @close="handleClose('4')">生效状态: {{screenStatusList.join('、')}}</el-tag>
            <el-tag v-if="form.lockStatus.length !== 0" :key="5" size="mini" closable class="mr-5" @close="handleClose('5')">锁定状态: {{screenlockList.join('、')}}</el-tag>
          </div>
        </div>
      </div>
      <div class="dp-table-layout">
        <el-table ref="multipleTable" :data="tableData" height="100%" tooltip-effect="dark" style="width: 100%;" :class="{'fixed': fixed, 'tabel-cell-noe': false,}" v-loading="!!loading" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="unitName" label="数据板块">
            <template slot-scope="{row}">
              <div>
                <OverflowTooltip class="width">{{row.unitCode}}</OverflowTooltip>
              </div>
              <div class="object-info-secondary">{{row.unitName}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="projectName" label="项目">
            <template slot-scope="{row}">
              <div>
                <OverflowTooltip class="width">{{row.projectName}}</OverflowTooltip>
              </div>
              <div class="object-info-secondary"> {{row.projectCode}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="tableName" label="表">
            <template slot-scope="{row}">
              <div class="flex">
                <div class="tbl-icon"><i class="icon iconfont icon-yuanbiao-xianxing"></i></div>
                <div class="ml-10">
                  <div class="cube_name">{{row.tableName}}</div>
                  <div class="object-info-secondary"> {{row.tblDesc}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="columnName" label="字段">
            <template slot-scope="{row}">
              <div>
                <OverflowTooltip class="width">{{row.columnName}}</OverflowTooltip>
              </div>
              <div class="object-info-secondary"> {{row.colComment}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="identifyRuleName" label="生效规则">
            <template slot-scope="{row}">
              <div class="tab-top">{{row.identifyRuleName}}
                <span v-if="row.lock_status === 1" class="icon iconfont icon-guanlian"></span>
                <span v-if="row.recommend_flag === 1" class="icon iconfont icon-info"></span>
              </div>
              <div class="object-info-secondary">{{row.identifyRuleId}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="classifyShortName" label="数据分类" width="100">
            <template slot-scope="{row}">
              <span class="data-classify">{{row.classifyShortName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="levelShortName" label="数据分级" width="100">
            <template slot-scope="{row}">
              <span class="data-classify"> <i class="icon iconfont icon-APIshouquan"></i> {{row.levelShortName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="生效状态/日期" width="140">
            <template slot-scope="{row}">
              <el-switch v-model="row.status" active-value="1" inactive-value="0" @change=changeStatus(row)>
              </el-switch>
              <div>{{row.updatedDate}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="{row}">
              <el-tooltip v-if="row.lockStatus == 0" content="锁定识别规则" placement="top">
                <el-button type="text" @click="lockClick([row])"><i class="iconfont icon-lock-line font-16 color-btn"></i></el-button>
              </el-tooltip>
              <el-tooltip v-if="row.lockStatus == 1" content="解锁识别规则" placement="top">
                <el-button type="text" @click="unlockClick([row])"><i class="iconfont icon-unlock font-16 color-btn"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="更改识别模式" placement="top">
                <el-button type="text" @click="handleEdit([row])"><i class="font-16 color-btn iconfont icon-lishijilu"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="字段识别详情" placement="top">
                <el-button type="text" @click="clickhandle(row)"><i class="el-icon-set-up font-16 color-btn"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <SelectFooter @checkAllChange="checkAllChange" :multipleSelection="multipleSelection" :tableData="tableData" :totalNum="total" @batchDel="lockClick(multipleSelection)" @batchRecover="unlockClick(multipleSelection)" @handleEdit="handleEdit(multipleSelection)" @sendTableList="sendTableList"></SelectFooter>

    <!-- 更改识别模式 -->
    <el-dialog title="编辑字段识别规则" :visible.sync="editRuleVisible" width="40%" :close-on-click-modal="false">
      <el-form :model="formList" ref="formRef" label-width="120px" :rules="rules">
        <div class="flex-wrapper">
          <div class="item" :class="{select: formList.judgedType === 'DEFAULT'}" @click="formList.judgedType = 'DEFAULT'">
            <div class="title mb-10"> <i class="icon iconfont icon-guanlian"></i> 自动识别</div>
            <div class="desc">基于覆盖此字段的规则按照优先级自动打标</div>
          </div>
          <div class="item" :class="{select: formList.judgedType === 'CUSTOM'}" @click="formList.judgedType = 'CUSTOM'">
            <div class="title mb-10"><i class="icon iconfont icon-guanlian"></i> 手动指定</div>
            <div class="desc">手动指定此字段识别规则</div>
          </div>
        </div>
        <el-form-item v-if="formList.judgedType === 'CUSTOM'" label="手动识别规则" prop="identifyRuleId" class="mt-20">
          <el-select v-model="formList.identifyRuleId">
            <el-option v-for="item in identifyRuleList" :key="item.identifyRuleId" :label="item.identifyRuleName" :value="item.identifyRuleId">
            </el-option>
          </el-select>
        </el-form-item>
        <div v-if="formList.judgedType === 'DEFAULT'" class="tips">
          <i class="icon iconfont icon-tip"></i>
          锁定指定识别规则之后，默认锁定所指定的规则，可在识别详情列表中解锁改规则，解锁之后将按照自动识别模式对该字段进行规则打标
        </div>
        <div v-else class="tips">
          <i class="icon iconfont icon-tip"></i>
          基于覆盖此字段的识别规则按照优先级自动打标；可以锁定当前识别规则或手动指定为新规则，锁定或手动指定后自动变为手动指定模式并且锁定状态
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRuleVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleRuleSure">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 字段识别记录 -->
    <Identification v-if="identVisible" @detailsClose="detailsClose" :info="info"></Identification>
  </section>
</template>

<script>
import SelectFooter from './footer'
import Identification from './identification.vue'
import pager from '@/mixins/pager'
import record from './record.js'
import {
  getBusinList,
  getProjectList,
  getIdentifyRecordData,
  updateRecordStatus,
  getPagedIdentifyRule,
  batchCleanCustomLabels
} from '@/api/asset/security.js'
export default {
  name: 'Record2',
  components: {
    SelectFooter,
    Identification
  },
  mixins: [pager, record],
  props: {
    showCondition: {
      type: Boolean,
      default: false
    },
    reshNum: {
      type: Number
    },
    searchText: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      identVisible: false,
      formList: {
        judgedType: 'DEFAULT',
        identifyRuleId: ''
      },
      fixed: false,
      loading: 0,
      editRuleVisible: false,
      ruleType: 1,
      rules: {
        identifyRuleId: [
          { required: true, message: '请选择手动识别规则', trigger: 'change' }
        ]
      },
      tableData: [],
      total: 0,
      multipleSelection: [],
      unitList: [],
      projectList: [],
      identifyRuleList: [],
      seachData: {},
      identRuleList: [],
      businList: [],
      statusList: [
        { name: '开启', value: '1' },
        { name: '关闭', value: '0' }
      ],
      lockStatusList: [
        { name: '已锁定', value: '1' },
        { name: '未锁定', value: '0' }
      ],
      form: {
        searchText: '',
        identifyRuleId: [],
        projectId: [],
        unitId: [],
        status: [],
        lockStatus: []
      },
      itemList: []
    }
  },
  created () {
    this.getTableList()
    this.getBizunitList()
  },
  mounted () {
    this.getPagedIdentifyRuleList()
    this.getPagedIdentifyRule()
    this.getBusinList()
  },
  watch: {
    'seachData.unitIdList' (val) {
      if (val) {
        this.getProjectData(val)
      }
    },
    reshNum: {
      immediate: true,
      handler (val) {
        this.getTableList()
      }
    },
    searchText: {
      handler (val) {
        this.form.searchText = val
        this.getTableList()
      }
    }
  },
  methods: {
    sendTableList (val) {
      this.pageFilters = val
      this.getTableList()
    },

    async getTableList () {
      this.loading++
      const { identifyRuleId, unitId, projectId, status, lockStatus, searchText } = this.form
      let params = {
        ...this.pageFilters,
        searchText,
        identifyRuleIdList: identifyRuleId + '',
        unitIdList: unitId + '',
        projectIdList: projectId + '',
        status: status + '',
        lockStatus: lockStatus + ''
      }
      this.seachData = params
      const res = await getIdentifyRecordData(params)
      if (res) {
        this.tableData = res.data.totalList
        this.total = res.data.total
      }
      this.loading--
    },

    async getBizunitList () {
      const res = await getBusinList()
      if (res) {
        this.unitList = res.data.map(item => {
          return {
            id: item.value,
            label: item.name
          }
        })
      }
    },

    // 获取项目列表
    async getProjectData (unitId) {
      const res = await getProjectList({ unitId: unitId + '' })
      if (res) {
        this.projectList = res.data
      }
    },

    // 获取识别规则列表
    async getPagedIdentifyRuleList () {
      const params = {
        pageNo: 1,
        pageSize: 100
      }
      const res = await getPagedIdentifyRule(params)
      if (res) {
        this.identifyRuleList = res.data.totalList
      }
    },

    async changeStatus (row) {
      // 决定当前识别结果是否生效，关闭则不会进入后续使用流程（包含展示、统计、脱敏等）。修改后立即生效。
      const params = {
        labelId: row.labelId,
        status: row.status
      }
      const res = await updateRecordStatus(params)
      if (res) {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      }
    },

    handleClose (tag) {
      switch (tag) {
        case '1':
          this.screenRuleIdList = []
          this.form.identifyRuleId = []
          break
        case '2':
          this.screenunitIdList = []
          this.form.unitId = []
          break
        case '3':
          this.screenProIdList = []
          this.form.projectId = []
          break
        case '4':
          this.screenStatusList = []
          this.form.status = []
          break
        case '5':
          this.screenlockList = []
          this.form.lockStatus = []
          break
      }
      this.getTableList()
    },

    async getPagedIdentifyRule () {
      const params = {
        pageNo: 1,
        pageSize: 100
      }
      const res = await getPagedIdentifyRule(params)
      if (res) {
        this.identRuleList = res.data.totalList
      }
    },

    async getBusinList () {
      const res = await getBusinList()
      if (res) {
        this.businList = res.data
      }
    },

    // 编辑
    handleEdit (item) {
      this.itemList = item
      const labelId = item.map(item => item.labelId)
      this.formList = {
        labelId: labelId,
        judgedType: 'DEFAULT'
      }
      this.editRuleVisible = true
    },

    handleRuleSure () {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.submitRule()
        }
      })
    },

    async submitRule () {
      const { identifyRuleId, labelId, judgedType } = this.formList
      let identifyRuleIdList = []
      if (judgedType === 'DEFAULT') {
        identifyRuleIdList = this.itemList.map(item => item.identifyRuleId)
      }
      const params = {
        identifyRuleId: judgedType === 'DEFAULT' ? identifyRuleIdList + '' : identifyRuleId,
        recognitionMode: judgedType === 'DEFAULT' ? 0 : 1
      }
      const labelIds = labelId + ''
      const res = await batchCleanCustomLabels(params, labelIds)
      if (res) {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.editRuleVisible = false
        this.getTableList()
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
  .el-divider {
    margin-top: 0px;
    margin-bottom: 5px;
  }
}
.security-wrapper {
  position: relative;
  height: calc(100% - 50px);
  .icon {
    font-size: 18px;
    color: #8c8c8c;
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
  .flex-wrapper {
    display: flex;
    gap: 20px;
    .icon {
      font-size: 24px;
      color: #2e65ff;
    }
    .item {
      width: 50%;
      text-align: center;
      padding: 10px 20px 10px;
      border: 1px solid #999;
      cursor: pointer;
      &:hover {
        border: 1px solid #2e65ff;
      }
      .title {
        font-size: 16px;
        // margin-bottom: 10px;
      }
      .desc {
        font-size: 14px;
        color: #999;
        line-height: 20px;
      }
    }
    .select {
      border: 1px solid #2e65ff;
    }
  }
  .tips {
    font-size: 14px;
    color: #999;
    line-height: 20px;
    margin: 20px 0;
    .icon {
      font-size: 24px;
      color: #2e65ff;
    }
  }
  .tbl-icon {
    height: 30px;
    width: 30px;
    background-color: #2e65ff;
    display: flex;
    .icon {
      // margin-top: 3px;
      color: #fff;
      background-color: #2e65ff;
      margin: auto;
    }
  }
  .tab-top {
    .icon {
      font-size: 12px;
      color: #999;
      margin-left: 2px;
    }
  }
  .data-classify {
    .icon {
      font-size: 14px;
      color: #999;
    }
  }
}
</style>
