<template>
  <section class="apply-data-table">
    <el-card>
      <el-form label-width="80px" disabled ref="formData2" :model="formData2">
        <el-row>
          <el-col :span="8">
            <el-form-item label="环境">
              <el-select v-model="formData2.environment" disabled placeholder="请选择环境" style="width: 260px;">
                <el-option v-for="(item, index) in environmentList" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务板块">
              <el-select v-model="formData2.businessSegment" disabled placeholder="请选择业务板块" style="width: 260px;">
                <el-option v-for="(item, index) in businessSegmentList" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="逻辑表">
              <el-select v-model="formData2.logicTable" disabled placeholder="请选择逻辑表" style="width: 260px;">
                <el-option v-for="(item, index) in logicTableList" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <p class="title-name">权限字段</p>
        <el-table ref="multipleTable" :data="formData2.tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column type="index" width="100" label="序号">
          </el-table-column>
          <el-table-column prop="element_code" label="字段名">
            <template slot-scope="scope">{{ scope.row.element_name }}</template>
          </el-table-column>
          <el-table-column prop="element_code" label="字段描述">
          </el-table-column>
          <el-table-column prop="element_type" label="数据类型" show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <p class="title-name">权限配置</p>
        <el-form-item label="权限类型" prop="authType">
          <el-checkbox-group v-model="formData2.authType">
            <el-checkbox label="1" name="authType" v-if="formData2.authType.includes('1')">查询</el-checkbox>
            <el-checkbox label="2" name="authType" v-if="formData2.authType.includes('2')">写入</el-checkbox>
            <el-checkbox label="3" name="authType" v-if="formData2.authType.includes('3')">修改</el-checkbox>
            <el-checkbox label="4" name="authType" v-if="formData2.authType.includes('4')">删除</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <p class="title-name">账号类型</p>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-radio v-model="formData2.accountType" label="0">个人账号</el-radio>
          </el-col>
          <el-col :span="5">
            <el-form-item label="有效期至" prop="validEndTime">
              <el-select v-model="formData2.validEndTime" :disabled="formData2.accountType !== '0'" placeholder="请选择有效期">
                <el-option v-for="(item, index) in timeList" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-date-picker v-model="formData2.periodValidity" type="date" :disabled="formData2.accountType !== '0'" placeholder="选择日期">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-radio v-model="formData2.accountType" label="1">项目生产账号</el-radio>
          </el-col>
          <el-col :span="5">
            <el-form-item label="归属项目" prop="projectName">
              <el-select v-model="formData2.projectName" :disabled="formData2.accountType !== '1'" placeholder="请选择项目">
                <el-option v-for="(item, index) in projectList" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="申请原因" prop="remark">
          <el-input type="textarea" v-model="formData2.remark" maxlength="128" show-word-limit placeholder="请输入申请原因"></el-input>
        </el-form-item>
      </el-form>

      <div class="mb-20 mt-20 font-14">审批信息</div>
      <div class="notice-center-card mb-20">
        <el-form ref="form" :model="approvalInfo" label-width="100px" label-suffix="：" :rules="approvalInfoRules">
          <el-row class="mb-20">
            <el-col>
              <el-form-item label="审批结果" prop="reject">
                <el-radio-group v-model="approvalInfo.reject">
                  <el-radio :label="false">通过</el-radio>
                  <el-radio :label="true">驳回</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="mb-10">
            <el-col>
              <el-form-item label="审批说明" prop="message">
                <el-input type="textarea" :rows="4" resize="none" :show-word-limit="true" :maxlength="128" placeholder="请输入内容" v-model="approvalInfo.message">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="flex-center">
        <el-button type="primary" class="mr-20" @click="confirm">提 交</el-button>
        <el-button type="primary" @click="cancel">返 回</el-button>
      </div>
    </el-card>
  </section>
</template>

<script>
import {
  getFormAll
} from '@/api/rd/publish/form.js'
import {
  getPassTask,
  getRejectTask
} from '@/api/notice/task-center/index.js'
import {
  getLogicTables,
  getLogicColumns
} from '@/api/asset/authority.js'
import { getListBusiness, getTableList } from '@/api/plan/project-manage'

export default {
  name: 'ApplyDataTable',
  inject: ['tabStore'],
  props: {
    proc_inst_id: String,
    flow_type: String,
    baseinfo: Object
  },
  data () {
    return {
      formJson: {},
      formData: {},
      optionData: {},

      approvalInfo: {
        message: '',
        reject: ''
      },
      approvalInfoRules: {
        reject: [{ required: true, message: '请选择审批结果', trigger: 'blur' }]
      },
      formData2: {
        environment: '',
        businessSegment: '',
        logicTable: '',
        tableData: [],
        authType: [],
        accountType: '',
        validEndTime: '',
        periodValidity: '',
        projectName: '',
        remark: ''
      },
      environmentList: [
        {
          label: '生产环境',
          value: '生产环境'
        },
        {
          label: '测试环境',
          value: '测试环境'
        },
        {
          label: '开发环境',
          value: '开发环境'
        }
      ],
      businessSegmentList: [],
      logicTableList: [],
      timeList: [
        {
          label: '自定义',
          value: '0'
        },
        {
          label: '长期',
          value: '1'
        },
        {
          label: '一天',
          value: '2'
        },
        {
          label: '一周',
          value: '3'
        }
      ],
      codes: [],
      projectList: []
    }
  },
  created () {
    this.getBusinessSegmentList()
    this.getLogicTableList()
    this.getProjectList()
  },
  mounted () {
    this.getData()
  },
  methods: {
    async getData () {
      const res = await this.$simpleAsyncTo(getLogicColumns())
      if (res) {
        this.formData2.tableData = res.data
        this.formData2.environment = this.baseinfo.environment
        this.formData2.businessSegment = this.baseinfo.businessSegment
        this.formData2.logicTable = this.baseinfo.logicTable
        this.formData2.authType = this.baseinfo.permissionype.map(a => String(a))
        this.formData2.accountType = this.baseinfo.personalAccount
        this.formData2.validEndTime = String(this.baseinfo.expiration)
        this.formData2.periodValidity = this.baseinfo.date
        this.formData2.projectName = this.baseinfo.project
        this.formData2.remark = this.baseinfo.remark
        this.codes = this.baseinfo.codes
        this.$nextTick(() => {
          this.codes.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(this.formData2.tableData.find(a => { return a.element_code == row }), true)
          })
        })
      }
    },
    async getBusinessSegmentList () {
      const res = await this.$simpleAsyncTo(getListBusiness())
      if (res) {
        this.businessSegmentList = res.data.map(item => {
          return {
            label: item.busin_name,
            value: item.busin_id
          }
        })
      }
    },
    async getLogicTableList () {
      const res = await this.$simpleAsyncTo(getLogicTables({ type: 0 }))
      if (res) {
        this.logicTableList = res.data.map(item => {
          return {
            label: item.cube_code,
            value: item.cube_id
          }
        })
      }
    },
    async getProjectList () {
      const res = await this.$simpleAsyncTo(getTableList())
      if (res) {
        this.projectList = res.data.map(item => {
          return {
            label: item.project_name,
            value: item.id
          }
        })
      }
    },

    setFormData () {
      const formData = this.baseinfo
      this.$refs.vFormRef.setFormData(formData)
    },

    confirm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitForm()
        }
      })
    },

    async submitForm () {
      const params = {
        proc_inst_id: this.proc_inst_id,
        opinion: this.approvalInfo.message
      }
      let fn = null
      if (this.approvalInfo.reject) {
        fn = getRejectTask
      } else {
        fn = getPassTask
      }
      const res = await this.$simpleAsyncTo(fn(params), '提交失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '提交成功'
        })
        this.$emit('cancel')
      }
    },

    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss">
.apply-data-table {
  padding: 20px 20px;
  background: $grey7;
  height: 100%;
  .el-card__header {
    padding: 0;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .btn-wrapper {
    text-align: center;
  }
  .title-name {
    margin-bottom: 20px;
  }
  .el-table {
    margin-bottom: 20px;
  }
}
body {
  margin: 0; /* 如果页面出现垂直滚动条，则加入此行CSS以消除之 */
}
</style>
